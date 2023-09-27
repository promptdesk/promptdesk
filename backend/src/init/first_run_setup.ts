import connectToDatabase from '../models/mongodb/db';
import { Model } from '../models/mongodb/model';
import { Prompt } from '../models/mongodb/prompt';
import { Variable } from '../models/mongodb/variable';

//read database.json file
var fs = require('fs');
var path = require('path');
var config = fs.readFileSync(path.join(__dirname, './database.json'));

//parse JSON
var database_file = JSON.parse(config);

export default async function setup() {
    
    await connectToDatabase();
    
    var variables:any = new Variable();
    variables = await variables.getVariables();
    
    //if variables is empyt then create name and value with the OPEN_AI_API_KEY 
    if(variables.length == 0) {

        var variable = new Variable();
        var data = [{ "name": "OPEN_AI_API_KEY", "value": process.env.OPEN_AI_API_KEY }];
        await variable.createVariables(data);

        var model:any = new Model();
        var model_id = await model.createModel(database_file['models'][0])
        console.log(model_id)
    
        var prompt:any = new Prompt();
        database_file['prompts'][0]['model'] = model_id
        prompt = await prompt.createPrompt(database_file['prompts'][0])
        console.log(prompt)

        console.log("Database setup complete!")

    }

}