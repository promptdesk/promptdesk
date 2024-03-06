import express from "express";
import axios from "axios";
import { Log, Sample } from "../../models/allModels";
import {
  prompt_model_validation,
  process_prompt_variables,
  replace_api_variables,
  generate_cached_response,
} from "../../utils/generate";
import { JSONMapper } from "promptdesk";
let log_db = new Log();
let sample_db = new Sample();

const router = express.Router();
let jmap = new JSONMapper();

// Route for /api/generate/gpt-3.5-turbo
router.all(["/generate"], async (req, res) => {
  const organization = (req as any).organization;

  var start_time = Date.now();

  let tempPrompt = req.body.new;

  let [prompt, model, proxy, error, cache] = await prompt_model_validation(
    req.body,
    organization,
  );

  try {
    if (error) {
      return res
        .status(error.status)
        .json({ error: true, message: error.message, status: error.status });
    }

    //SET API ENV VARIABLES
    var api_call = await replace_api_variables(model.api_call, organization);

    //SET PROMPT VARIABLES
    let [prompt_data, prompt_variables] = process_prompt_variables(
      prompt,
      req.body,
      proxy,
    );

    if (!prompt.model_parameters) prompt.model_parameters = {};

    for (const key in model.model_parameters) {
      if (model.model_parameters[key].required) {
        if (!prompt.model_parameters[key]) {
          //add default value if available
          if (model.model_parameters[key].default) {
            prompt.model_parameters[key] = model.model_parameters[key].default;
          } else {
            return res.status(400).json({
              error: true,
              message: `Model parameter ${key} is required, but default value is not set.`,
              status: 400,
            });
          }
        }
      }
    }

    //SET API CALL BODY
    let body = {} as any;
    if (model.input_format) {
      var input_format = eval(model.input_format);
      body = input_format(prompt_data, prompt.model_parameters);
    } else if (model.request_mapping) {
      body = jmap.applyMapping(
        {
          ...prompt_data,
          model_parameters: prompt.model_parameters,
        },
        model.request_mapping,
      );
    }

    //SET API CALL REQUEST JSON BODY
    api_call.data = body;

    //GENERATE HASH AND CACHED RESPONSE IF AVAILABLE
    let [hash, cachedResponse] = await generate_cached_response(
      body,
      cache,
      organization,
    );
    if (cachedResponse) {
      return res.status(200).json(cachedResponse);
    }

    let obj = {} as any; // Initialize outside to make it accessible in the finally block

    try {
      const response = await axios(api_call);
      let data = {} as any;
      if (model.output_format) {
        var output_format = eval(model.output_format);
        data = output_format(response.data);
      } else if (model.response_mapping) {
        data = jmap.applyMapping(response.data, model.response_mapping);
      }

      if (data.text && model.response_mapping) {
        data = data.text;
      }

      // Construct success response
      obj = {
        message: data,
        error: false,
        response: response.data,
        status: 200,
      };
    } catch (error: any) {
      const isAxiosError = error.response; // Check if it's an axios error
      const status = isAxiosError ? error.response.status : 500;
      const message = error.stack || error.message;
      const responseData = isAxiosError ? error.response.data : undefined;

      // Construct error response
      obj = {
        message,
        error: true,
        response: responseData,
        status,
      };
    } finally {
      // Add common properties
      obj = {
        ...obj,
        hash: hash,
        raw: {
          request: body,
          response: obj.response,
        },
        data: {
          parameters: prompt.model_parameters,
          ...prompt.prompt_data,
          variables: prompt_variables,
        },
        model_id: prompt.model,
        prompt_id: prompt.id,
        duration: (Date.now() - start_time) / 1000,
      };

      let log = await log_db.createLog(obj, organization.id);
      obj["log_id"] = log;

      if (!obj.error && !tempPrompt) {
        sample_db.recordSampleDataIfNeeded(
          prompt_variables,
          prompt_data,
          obj.message,
          prompt.id,
          organization.id,
        );
      }

      res.status(obj.status).json(obj);
    }
  } catch (error: any) {
    console.log("ERROR :: GENERATE", error);
    return res
      .status(500)
      .json({ error: true, message: error.message, status: 500 });
  }
});

export default router;
