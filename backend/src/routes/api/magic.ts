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
            return [undefined, undefined, undefined, { error:true, message: 'Prompt name is required', status: 404 }]
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
        return [undefined, undefined, undefined, { error: 'Model API not found.', status: 404 }]
    }

    return [prompt, model, proxy, error]
}

// Route for /api/magic/gpt-3.5-turbo
router.all(['/magic', '/magic/generate'], async (req, res) => {
    const organization = (req as any).organization;
    var start_time = Date.now()

    //try {

        let [ prompt, model, proxy, error ] = await prompt_model_validation(organization, req.body);

        if(error){
            return res.status(error.status).json({ error: true, message: error.error, status: error.status });
        }
    
        //get variables from variables db
        var environment_variables = await variable_db.getVariables(organization.id);
    
        var api_call = JSON.stringify(model.api_call) as any;    
    
        environment_variables = env_variable_object(environment_variables)
    
        var prompt_api_template = handlebars.compile(api_call);
    
        api_call = prompt_api_template(environment_variables);
    
        api_call = JSON.parse(api_call)
    
        if(!model.input_format){
            return res.status(404).json({ error:true, message: 'Model format function not found.', status: 404 });
        }

        if(!model.output_format){
            return res.status(404).json({ error: true, message: 'Model format function not found.', status: 404 });
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

        var time_taken = (Date.now() - start_time) / 1000

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
            return res.status(200).json(obj);

        } catch (error:any) {

            var obj = {
                message: error.message,
                error: true,
                raw: {
                    request: body,
                    response: error.response.data
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
                status: error.response.status,
                model_id: prompt.model,
                prompt_id: prompt.id,
                duration: (Date.now() - start_time) / 1000
            } as any;
            log_db.createLog(obj, organization.id)
            return res.status(error.response.status).json(obj);

        }

    /*} catch (error:any) {

        var obj = {
            message: error.message,
            error: true,
            raw: {
                request: body
            },
            status: 500,
            duration: (Date.now() - start_time) / 1000
        } as any;
        log_db.createLog(obj, organization.id)
        return res.status(500).json(obj);

    }*/

});

export default router;