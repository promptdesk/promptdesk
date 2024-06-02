import express, { text } from "express";
import axios from "axios";
import { Log, Sample } from "../../models/allModels";
import {
  embedding_model_validation,
  replace_api_variables,
} from "../../utils/embed";
import { JSONMapper } from "promptdesk";
let log_db = new Log();
let sample_db = new Sample();

const router = express.Router();
let jmap = new JSONMapper();

// Route for /api/generate/gpt-3.5-turbo
router.all(["/embed"], async (req, res) => {
  const organization = (req as any).organization;

  var start_time = Date.now();

  let [text_list, model, error] = await embedding_model_validation(
    req.body,
    organization,
  );
  return res.send({ text_list, model, error });

  /*

  try {

    if (error) {
      return res
        .status(error.status)
        .json({ error: true, message: error.message, status: error.status });
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
        },
        model.request_mapping,
      );
    }

    //SET API CALL REQUEST JSON BODY
    api_call.data = body;

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
  }*/
});

export default router;
