import express from 'express';
import axios from 'axios';
import { Log, Sample} from '../../models/allModels';
import { prompt_model_validation, process_prompt_variables, replace_api_variables, generate_cached_response } from '../../utils/generate';

let log_db = new Log();
let sample_db = new Sample();

const router = express.Router();

// Route for /api/generate/gpt-3.5-turbo
router.all(['/generate'], async (req, res) => {
    const organization = (req as any).organization;

    var start_time = Date.now()

    let [ prompt, model, proxy, error, cache ] = await prompt_model_validation(req.body, organization);

    try {

        if(error) {
            return res.status(error.status).json({ error: true, message: error.message, status: error.status });
        }

        //SET API ENV VARIABLES
        var api_call = await replace_api_variables(model.api_call, organization)
        
        //SET INPUT/OUTPUT MAPPING FUNCTIONS
        var input_format = eval(model.input_format)
        var output_format = eval(model.output_format)

        //SET PROMPT VARIABLES
        let [prompt_data, prompt_variables] = process_prompt_variables(prompt, req.body, proxy)
        
        //SET API CALL BODY
        var body = input_format(prompt_data, prompt.prompt_parameters)
    
        //SET API CALL REQUEST JSON BODY
        api_call.data = body

        //GENERATE HASH AND CACHED RESPONSE IF AVAILABLE
        let [hash, cachedResponse] = await generate_cached_response(body, cache, organization)

        if(cachedResponse) {
            return res.status(200).json(cachedResponse);
        }

        let obj = {} as any; // Initialize outside to make it accessible in the finally block
        
        try {
            const response = await axios(api_call);
            const data = output_format(response.data);
            
            // Construct success response
            obj = {
                message: data,
                error: false,
                response: response.data,
                status: 200
            }
    
        } catch (error:any) {
            const isAxiosError = error.response; // Check if it's an axios error
            const status = isAxiosError ? error.response.status : 500;
            const message = error.stack || error.message;
            const responseData = isAxiosError ? error.response.data : undefined;
    
            // Construct error response
            obj = {
                message,
                error: true,
                response: responseData,
                status
            };
    
        } finally {
            // Add common properties
            obj = {
                ...obj,
                hash: hash,
                raw: {
                    request: body,
                    response: obj.response
                },
                data: {
                    parameters: prompt.prompt_parameters,
                    ...prompt.prompt_data,
                    variables: prompt_variables
                },
                model_id: prompt.model,
                prompt_id: prompt.id,
                duration: (Date.now() - start_time) / 1000
            };

            let log = await log_db.createLog(obj, organization.id);
            obj['log_id'] = log;
    
            if (!obj.error) {
                sample_db.recordSampleDataIfNeeded(prompt_variables, prompt_data, obj.message, prompt.id, organization.id);
            }
    
            res.status(obj.status).json(obj);
        }
        
    } catch (error:any) {
        console.log("error", error)
        return res.status(500).json({ error: error, message:error.message, status: 500 });
    }

});

export default router;