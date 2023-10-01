import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import { Model, Prompt, Log, Variable } from '../../models/allModels';
import handlebars from 'handlebars';

const router = express.Router();

var model_db = new Model();
var prompt_db = new Prompt();
var log_db = new Log();
var variable_db = new Variable();

function env_variable_object(prompt_variables: any): object {
    var variables: { [key: string]: string } = {};

    console.log(prompt_variables)

    if (!prompt_variables) {
        return {};
    }

    for (const variable of prompt_variables) {
        variables[variable.name] = variable.value;
    }

    return variables;
}

function variable_object(prompt_variables: any): any {
    //prompt_variables = { word: { type: 'text', value: 'hello' } }
    //convert to { word: 'hello' }

    var variables: { [key: string]: string } = {};

    for (const key in prompt_variables) {
        var variable = prompt_variables[key]
        variables[key] = variable.value;
    }

    return variables;

}

// Route for /api/magic/gpt-3.5-turbo
router.all(['/magic', '/magic/generate'], async (req, res) => {

    var prompt = undefined;
    var proxy = false;

    //check if prompt_name is provided
    if (req.body.prompt_name) {
        prompt = await prompt_db.findPromptByName(req.body.prompt_name);
        console.log(prompt)
        if (!prompt) {
            return res.status(404).json({ error: 'Prompt name is required', status: 404 });
        }
        proxy = true;
    } else {
        prompt = req.body
    }

    if(!prompt){
        return res.status(404).json({ error: 'Prompt not found.', status: 404 });
    }

    var model_id = prompt.model

    const model = await model_db.findModel(model_id);

    if(!model){
        return res.status(404).json({ error: 'Model not found.', status: 404 });
    }
    
    if(!model.api_call){
        return res.status(404).json({ error: 'Model API not found.', status: 404 });
    }

    var start = Date.now()

    //get variables from variables db
    var environment_variables = await variable_db.getVariables()
    console.log(environment_variables)

    var api_call = JSON.stringify(model.api_call) as any;

    console.log(api_call)


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

    console.log("prompt.prompt_variables", prompt.prompt_variables)

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

    //console.log(variables)

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
            data: {
                message: data,
                error: false,
                raw_response: response.data,
                raw_request: body,
                status: 200,
                model_id: model_id,
                prompt_id: prompt.id
            }
        } as any;
        log_db.createLog(obj.data)
        return res.status(200).json(obj);
    } catch (error:any) {
        var obj = {
            data: {
                message: undefined,
                error: true,
                raw_response: error.response.data,
                raw_request: body,
                status: error.response.status,
                model_id: model_id,
                prompt_id: prompt.id
            }
        } as any;
        log_db.createLog(obj.data)
        return res.status(error.response.status).json(obj);
    }

});

export default router;