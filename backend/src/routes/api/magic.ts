import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import { Model, Prompt, Log, Variable } from '../../models/allModels';
import handlebars from 'handlebars';

dotenv.config();
const environment_variables = dotenv.config({path:'../.env'})['parsed']

const router = express.Router();

var model_db = new Model();
var prompt_db = new Prompt();
var log_db = new Log();
var variable_db = new Variable();

function variable_object(prompt_variables:any) {

    var variables = {}
    for (var key in prompt_variables) {
        var parsed = false
        try {
            (variables as any)[key] = JSON.stringify(JSON.parse(prompt_variables[key]['value']))
            console.log(key, prompt_variables[key]['value'])
            parsed = true
        } catch (error) {
            //console.log(error)
        }
        if (!parsed) {
            (variables as any)[key] = prompt_variables[key]['value']
        }
    }

    return variables
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
    var variables_db = await variable_db.findVariablesByModel(model_id)

    //[{"name": "OPEN_AI_API_KEY", "value": "secret-key-value"}]

    var api_call = JSON.stringify(model.api_call) as any;
    var template = handlebars.compile(api_call);
    api_call = template(environment_variables);

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