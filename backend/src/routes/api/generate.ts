import express from 'express';
import axios from 'axios';
import { Model, Prompt, Log, Variable, Sample} from '../../models/allModels';
import handlebars from 'handlebars';
import crypto from 'crypto';
import {canonical_json_stringify} from "../../utils/canonicalJson";

let model_db = new Model();
let prompt_db = new Prompt();
let log_db = new Log();
let variable_db = new Variable();
let sample_db = new Sample();

const router = express.Router();

function env_variable_object(prompt_variables: any): object {
    var variables: { [key: string]: string } = {};
    if (!prompt_variables) {
        return {};
    }
    for (const variable of prompt_variables) {
        variables[variable.name] = variable.value;
    }
    return variables;
}

function variable_object(prompt_variables: any): any {
    var variables: { [key: string]: string } = {};
    for (const key in prompt_variables) {
        var variable = prompt_variables[key]
        variables[key] = variable.value;
    }
    return variables;
}

async function api_variables(api_call: any, organization:any) {
        var environment_variables = await variable_db.getVariables(organization.id);
        var api_call = JSON.stringify(api_call) as any;    
        environment_variables = env_variable_object(environment_variables)
        var prompt_api_template = handlebars.compile(api_call);
        api_call = prompt_api_template(environment_variables);
        api_call = JSON.parse(api_call)
        return api_call
}

async function prompt_model_validation(organization:any, body:any) {
    var prompt = undefined;
    var proxy = false;
    var error = undefined;

    if (body.prompt_name) {
        prompt = await prompt_db.findPromptByName(body.prompt_name, organization.id);

        if (!prompt) {
            return [undefined, undefined, undefined, { error:true, message: 'Prompt name is required.', status: 404 }]
        }
        proxy = true;
    } else {
        prompt = body
    }

    if(!prompt){
        return [undefined, undefined, undefined, { error:true, message: 'Prompt not found.', status: 404 }]
    }

    var model_id = prompt.model

    const model = await model_db.findModel(model_id, organization.id);

    if(!model){
        return [undefined, undefined, undefined, { error:true, message: 'Model not found.', status: 404 }]
    }
    
    if(!model.api_call){
        return [undefined, undefined, undefined, { error: 'Model API object not found.', status: 404 }]
    }

    return [prompt, model, proxy, error]
}

// Route for /api/generate/gpt-3.5-turbo
router.all(['/generate', '/generate/generate'], async (req, res) => {
    const organization = (req as any).organization;
    var start_time = Date.now()

    var cache = req.body.cache || false;

    try {

        let [ prompt, model, proxy, error ] = await prompt_model_validation(organization, req.body);

        if(error){
            return res.status(error.status).json({ error: true, message: error.error, status: error.status });
        }

        if(!model.input_format){
            return res.status(404).json({ error:true, message: 'Model input format function not found.', status: 404 });
        }

        if(!model.output_format){
            return res.status(404).json({ error: true, message: 'Model output format function not found.', status: 404 });
        }

        var api_call = await api_variables(model.api_call, organization)
    
        var input_format = eval(model.input_format)
        var output_format = eval(model.output_format)
        
        var variables = req.body.variables || {}
        if(!proxy){
            variables = variable_object(prompt.prompt_variables)
        }
    
        //validate variables
        for (var key in prompt.prompt_variables) {
            if (variables[key] === undefined) {
                return res.status(400).json({ error: 'Variable "' + key + '" not found in prompt.', status: 400});
            }
        }

        function replace_variables(text:string, variable_object:object) {
            var template = handlebars.compile(text);
            var new_text = template(variable_object);
            return new_text
        }

        var prompt_data = JSON.parse(JSON.stringify(prompt.prompt_data))

        //if prompt_data has a context key, replace it with the variable markdown
        if(prompt_data['context']){
            prompt_data['context'] = replace_variables(prompt_data['context'], variables)
        }
        if(prompt_data['prompt']){
            prompt_data['prompt'] = replace_variables(prompt_data['prompt'], variables)
        }
        if(prompt_data['messages']){
            //loop through each message in messages and replace the variables in the prompt_data['messages']['content']
            for(var i = 0; i < prompt_data['messages'].length; i++){
                prompt_data['messages'][i]['content'] = replace_variables(prompt_data['messages'][i]['content'], variables)
            }
        }
    
        var body = input_format(prompt_data, prompt.prompt_parameters)
    
        api_call.data = body

        const hashJsonString = canonical_json_stringify(body);
        const hash = crypto.createHash('sha256').update(hashJsonString).digest('hex');

        if (cache) {
            const cachedLog = await log_db.findLogByHash(hash, organization.id);
            if (cachedLog) {
                return res.status(200).json(cachedLog);
            }
        }

        var time_taken = (Date.now() - start_time) / 1000

        try {

            var response = await axios(api_call)
            var data = response.data
            var data = output_format(response.data)
            var obj = {
                message: data,
                error: false,
                hash: hash,
                raw: {
                    request: body,
                    response: response.data
                },
                data: {
                    ...{
                        parameters: prompt.prompt_parameters
                    },
                    ...prompt.prompt_data,
                    ...{
                        variables: variables
                    }
                },
                status: 200,
                model_id: prompt.model,
                prompt_id: prompt.id,
                duration: (Date.now() - start_time) / 1000
            } as any;
            log_db.createLog(obj, organization.id)
            sample_db.recordSampleDataIfNeeded(variables, prompt_data, data, prompt.id, organization.id)
            return res.status(200).json(obj);

        } catch (error:any) {

            var obj = {
                message: error.stack || error.message,
                error: true,
                raw: {
                    request: body,
                    response: error?.response?.data
                },
                data: {
                    ...{
                        parameters: prompt.prompt_parameters
                    },
                    ...prompt.prompt_data,
                    ...{
                        variables: variables
                    }
                },
                status: error?.response?.status,
                model_id: prompt.model,
                prompt_id: prompt.id,
                duration: (Date.now() - start_time) / 1000
            } as any;
            let log = await log_db.createLog(obj, organization.id)
            obj['log_id'] = log
            return res.status(error?.response?.status ?? 500).json(obj);
        }

    } catch (error:any) {
        var obj = {
            message: error.stack || error.message,
            error: true,
            raw: {
                request: body
            },
            status: 500,
            duration: (Date.now() - start_time) / 1000
        } as any;
        let log = log_db.createLog(obj, organization.id)
        obj['log_id'] = log
        return res.status(500).json(obj);

    }

});

router.all(['/generate/test/endpoint'], async (req, res) => {
    const organization = (req as any).organization;

    //check if data contains api_call
    if(!req.body.api_call){
        return res.status(500).json(
        {
            error: 'PromptDesk requires you to define API calls in the following format.',
            format: {
                "url": "https://api.openai.com/v1/chat/completions",
                "method": "POST",
                "headers": {
                    "Authorization": "Bearer {{OPEN_AI_KEY}}",
                    "Content-Type": "application/json"
                }
            }
        })
    }

    //get JSON data from request body
    var api_call = req.body.api_call;
    var api_call = await api_variables(api_call, organization)

    try {
        var response = await axios(api_call)
        return res.status(200).json({data: response.data, status: response.status});
    } catch (error) {
        return res.status(500).json({ data: (error as any).response.data, status: (error as any).response.status });
    }

});

router.all(['/generate/test/inputformat'], async (req, res) => {

    try {

        const organization = (req as any).organization;

        //check if data contains api_call
        if(!req.body.api_call){
            return res.status(500).json(
            {
                error: 'PromptDesk requires you to define API calls in the following format.',
                format: {
                    "url": "https://api.openai.com/v1/chat/completions",
                    "method": "POST",
                    "headers": {
                        "Authorization": "Bearer {{OPEN_AI_KEY}}",
                        "Content-Type": "application/json"
                    }
                }
            })
        }

        if(!req.body.input_format){
            return res.status(500).json(
            {
                error: 'PromptDesk requires you to define input format in the following format.',
                format: "function(input, parameters){\n\treturn input\n}"
            })
        }

        var output_format = undefined;
        if(req.body.output_format) {
            output_format = req.body.output_format
        }

        var input_format = undefined;
        
        try {
            input_format = eval(req.body.input_format)
        } catch (error) {
            return res.status(500).json({ error: error, status: 500 });
        }

        //get JSON data from request body
        var api_call = req.body.api_call;
        var api_call = await api_variables(api_call, organization)

        var prompt = {
            prompt: "Say hello."
        } as any;

        if(req.body.type == 'chat') {
            prompt = {
                "context": "I am a human.",
                "messages": [
                    {
                        "role": "user",
                        "content": "Say hello."
                    },
                    {
                        "role": "assistant",
                        "content": "Hello."
                    },
                    {
                        "role": "user",
                        "content": "Say hello."
                    },
                ]
            }
        }

        var body = input_format(prompt, {})

        api_call.data = body

        var response = undefined;

        try {
            response = await axios(api_call)
            if(!output_format) {
                return res.status(200).json({data: response.data, status: response.status});
            }
        } catch (error) {
            return res.status(500).json({ data: (error as any).response.data, status: (error as any).response.status });
        }

        var output_format = undefined
        try {
            output_format = eval(req.body.output_format)
        } catch (error) {
            return res.status(500).json({ data: error, status: 500 });
        }

        var data = undefined;
        try {
            data = output_format(response.data)
        } catch (error) {
            return res.status(500).json({ data: error, status: 500 });
        }

        if(req.body.type === 'chat' && (!data.role || !data.content)){
            return res.status(500).json({ data: data, status: 500 });
        } else if(req.body.type === 'completion' && typeof data !== 'string'){
            return res.status(500).json({ data: data, status: 500 });
        }
        
        return res.status(200).json({data: data, status: response.status});

    } catch (error) {
        return res.status(500).json({ data: error, status: 500 });
    }

});

export default router;