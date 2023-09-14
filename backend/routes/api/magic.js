import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import model from '../../models/local/model.js';
import prompt from '../../models/local/prompt.js';
import handlebars from 'handlebars';

dotenv.config();
const environment_variables = dotenv.config()['parsed']

const router = express.Router();


var model_db = new model();
var prompt_db = new prompt();

function variable_object(prompt_variables) {

    var variables = {}
    for (var key in prompt_variables) {
        variables[key] = prompt_variables[key]['value']
    }

    return variables
}

// Route for /api/magic/gpt-3.5-turbo
router.all(['/magic', '/magic/generate'], async (req, res) => {

    var prompt = undefined;
    var proxy = false;

    //check if prompt_name is provided
    if (req.body.prompt_name) {
        prompt = prompt_db.findPromptByName(req.body.prompt_name);
        if (!prompt) {
            return res.status(404).json({ error: 'Prompt name is required' });
        }
        proxy = true;
    } else {
        prompt = req.body
    }

    if(!prompt){
        return res.status(404).json({ error: 'Prompt not found.' });
    }

    var model_id = prompt.model

    const model = model_db.findModel(model_id);

    if(!model){
        return res.status(404).json({ error: 'Model not found.' });
    }
    
    if(!model.api_call){
        return res.status(404).json({ error: 'Model API not found.' });
    }

    var start = Date.now()

    var api_call = JSON.stringify(model.api_call)
    var template = handlebars.compile(api_call);
    api_call = template(environment_variables);

    api_call = JSON.parse(api_call)

    var end = Date.now()
    var elapsed = end - start

    if(!model.format_function){
        return res.status(404).json({ error: 'Model format function not found.' });
    }

    if(!model.post_format_function){
        return res.status(404).json({ error: 'Model format function not found.' });
    }

    var format_function = eval(model.format_function)
    var post_format_function = eval(model.post_format_function)

    //console.log(prompt.prompt_variables)

    var variables = req.body.variables || {}
    if(!proxy){
        variables = variable_object(prompt.prompt_variables)
    }

    //validate variables
    for (var key in prompt.prompt_variables) {
        //check if key exists in prompt.prompt_variables
        //console.log(key)
        if (!variables[key]) {
            return res.status(400).json({ error: 'Variable "' + key + '" not found in prompt.' });
        }
    }

    //console.log(variables)

    var prompt_data = JSON.stringify(prompt.prompt_data)
    var prompt_data_template = handlebars.compile(prompt_data);
    prompt_data = prompt_data_template(variables);

    prompt_data = JSON.parse(prompt_data)

    var body = format_function(prompt_data, prompt.prompt_parameters)

    api_call.data = body

    try {
        var response = await axios(api_call)
        var data = response.data
        var data = post_format_function(response.data)
        return res.status(200).json({
            data: {
                message: data,
                //trimmed_text: data.trim(),
                error: undefined,
                raw_response: response.data,
                raw_request: body
            }
        });
    } catch (error) {
        return res.status(error.response.status).json({
            data: {
                message: undefined,
                error: "3rd party API error.",
                //trimmed_text: data.trim(),
                raw_response: error.response.data,
                raw_request: body
            }
        });
    }

});

export default router;