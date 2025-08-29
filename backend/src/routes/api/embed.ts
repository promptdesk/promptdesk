import express, { text } from "express";
import axios from "axios";
import { Log, Sample } from "../../models/allModels";
import {
  embedding_model_validation,
  replace_api_variables
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

  try {

    if (error) {
      return res
        .status(error.status)
        .json({ error: true, message: error.message, status: error.status });
    }


    //SET API CALL BODY
    let body = {} as any;
    body = jmap.applyMapping(
      {
        text_list: text_list,
      },
      model.request_mapping,
    );


    var api_call = await replace_api_variables(model.api_call, organization);

    // //SET API CALL REQUEST JSON BODY
    api_call.data = body;

    let obj = {} as any; // Initialize outside to make it accessible in the finally block

    try {

      const response = await axios(api_call);
      let data = {} as any;
      data = jmap.applyMapping(response.data, model.response_mapping);

      // Construct success response
      obj = {
        embeddings: data,
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
