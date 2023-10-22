import { Model, Prompt, Variable, Organization } from '../models/allModels';
import connectToDatabase from '../models/mongodb/db';

connectToDatabase();

//read database.json file
var fs = require('fs');
var path = require('path');

//parse JSON
var seed_data = fs.readFileSync(path.join(__dirname, './database.json'));
seed_data = JSON.parse(seed_data);

export default async function setup() {

    var model:any = new Model();
    var prompt:any = new Prompt();
    var variable:any = new Variable();
    var organization:any = new Organization();
    var existing_organization = await organization.getOrganization();

    //if organization is empty then create organization
    if(organization == undefined || existing_organization == null) {
        const org = await organization.addOrganization();
        let organization_id = org.id;
        console.log("INFO :: ORGANIZATION CREATED")
        
        var data = [{ "name": "OPEN_AI_KEY", "value": process.env.OPEN_AI_KEY }];
        await variable.createVariables(data, organization_id);

        let model_obj = seed_data['models'][0];
        model_obj.organization_id = organization_id;
        var model_id = await model.createModel(model_obj, organization_id);
    
        let prompt_obj = seed_data['prompts'][0];
        prompt_obj.organization_id = organization_id;
        prompt_obj.model = model_id;
        await prompt.createPrompt(prompt_obj, organization_id)

        model_obj = seed_data['models'][1];
        model_obj.organization_id = organization_id;
        model_id = await model.createModel(model_obj, organization_id)
    
        prompt_obj = seed_data['prompts'][1];
        prompt_obj.organization_id = organization_id;
        prompt_obj.model = model_id;
        await prompt.createPrompt(prompt_obj, organization_id)
    }

}