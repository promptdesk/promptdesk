import { Model, Prompt, Variable } from '../models/allModels';

//read database.json file
var fs = require('fs');
var path = require('path');

//parse JSON
var seed_data = fs.readFileSync(path.join(__dirname, './database.json'));
seed_data = JSON.parse(seed_data);

export default async function setup() {
    
    var variable:any = new Variable();
    var variable_list = await variable.getVariables();
    
    //if variables is empyt then create name and value with the OPEN_AI_KEY 
    if(variable_list.length == 0) {

        var model:any = new Model();
        var prompt:any = new Prompt();

        var data = [{ "name": "OPEN_AI_KEY", "value": process.env.OPEN_AI_KEY }];
        await variable.createVariables(data);

        var model_id = await model.createModel(seed_data['models'][0])
    
        seed_data['prompts'][0]['model'] = model_id
        await prompt.createPrompt(seed_data['prompts'][0])

        model_id = await model.createModel(seed_data['models'][1])
    
        seed_data['prompts'][1]['model'] = model_id
        await prompt.createPrompt(seed_data['prompts'][1])

        console.log("INFO :: DATABASE SETUP COMPLETE")

    }

}