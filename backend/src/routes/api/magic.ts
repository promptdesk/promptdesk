import express from 'express';
import axios from 'axios';
import { Model, Prompt, Log, Variable} from '../../models/allModels';
import handlebars from 'handlebars';

let model_db = new Model();
let prompt_db = new Prompt();
let log_db = new Log();
let variable_db = new Variable();

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

async function prompt_model_validation(organization:any, body:any) {

    var prompt = undefined;
    var proxy = false;
    var error = undefined;

    if (body.prompt_name) {
        prompt = await prompt_db.findPromptByName(body.prompt_name, organization.id);

        if (!prompt) {
            return [undefined, undefined, undefined, { error: 'Prompt name is required', status: 404 }]
        }
        proxy = true;
    } else {
        prompt = body
    }

    if(!prompt){
        return [undefined, undefined, undefined, { error: 'Prompt not found.', status: 404 }]
    }

    var model_id = prompt.model

    const model = await model_db.findModel(model_id, organization.id);

    if(!model){
        return [undefined, undefined, undefined, { error: 'Model not found.', status: 404 }]
    }
    
    if(!model.api_call){
        return [undefined, undefined, undefined, { error: 'Model API not found.', status: 404 }]
    }

    return [prompt, model, proxy, error]
}

// Route for /api/magic/gpt-3.5-turbo
router.all(['/magic', '/magic/generate'], async (req, res) => {
    const organization = (req as any).organization;

    try {

        let [ prompt, model, proxy, error ] = await prompt_model_validation(organization, req.body);

        if(error){
            return res.status(error.status).json({ error: error.error, status: error.status });
        }

        var start = Date.now()
    
        //get variables from variables db
        var environment_variables = await variable_db.getVariables(organization.id);
    
        var api_call = JSON.stringify(model.api_call) as any;    
    
        environment_variables = env_variable_object(environment_variables)
    
        var prompt_api_template = handlebars.compile(api_call);
    
        api_call = prompt_api_template(environment_variables);
    
        api_call = JSON.parse(api_call)
    
        var end = Date.now()
        var elapsed = end - start
    
        if(!model.input_format){
            return res.status(404).json({ error: 'Model format function not found.' });
        }
    
        if(!model.output_format){
            return res.status(404).json({ error: 'Model format function not found.' });
        }
    
        var input_format = eval(model.input_format)
        var output_format = eval(model.output_format)
        
        var variables = req.body.variables || {}
        if(!proxy){
            variables = variable_object(prompt.prompt_variables)
        }
    
        //validate variables
        for (var key in prompt.prompt_variables) {
            if (!variables[key]) {
                return res.status(400).json({ error: 'Variable "' + key + '" not found in prompt.', status: 400});
            }
        }
        
        var prompt_data = JSON.stringify(prompt.prompt_data)
        var prompt_data_template = handlebars.compile(prompt_data);
    
        prompt_data = prompt_data_template(variables);
    
        prompt_data = JSON.parse(prompt_data)
    
        var body = input_format(prompt_data, prompt.prompt_parameters)
    
        api_call.data = body

        try {

            var response = await axios(api_call)
            var data = response.data
            var data = output_format(response.data)
            var obj = {
                message: data,
                error: false,
                raw: {
                    request: body,
                    response: response.data
                },
                data: {
                    ...prompt.prompt_data,
                    ...{
                        variables: variables
                    }
                },
                status: 200,
                model_id: prompt.model,
                prompt_id: prompt.id
            } as any;
            log_db.createLog(obj, organization.id)
            return res.status(200).json(obj);

        } catch (error:any) {

            var obj = {
                message: undefined,
                error: true,
                raw: {
                    request: body,
                    response: error.response.data
                },
                data: {
                    ...prompt.prompt_data,
                    ...{
                        variables: variables
                    }
                },
                status: error.response.status,
                model_id: prompt.model,
                prompt_id: prompt.id
            } as any;
            log_db.createLog(obj, organization.id)
            return res.status(error.response.status).json(obj);

        }

    } catch (error:any) {

        var obj = {
            message: error.message,
            error: true,
            raw: {
                request: body
            },
            status: 500
        } as any;
        log_db.createLog(obj, organization.id)
        return res.status(500).json(obj);

    }

});

export default router;