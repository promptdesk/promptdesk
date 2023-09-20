import { Model, Prompt } from './models/allModels.js';
import fs from 'fs';
import path from 'path';

(async () => {
    // Wait for the database to initialize
    await new Promise(resolve => setTimeout(resolve, 1000));

    const model_db = new Model();
    const prompt_db = new Prompt();

    // Calculate the absolute path to the database.json file
    const databasePath = path.join(__dirname, 'init', 'database.json');

    // Read the database.json file
    let rawdata = fs.readFileSync(databasePath);
    let database = JSON.parse(rawdata);

    var model = database['models'][0];
    var prompt = database['prompts'][0];

    model_db.createModel(model).then((response) => {
        var id = response;
        prompt['model'] = id;
        prompt_db.createPrompt(prompt).then((response) => {
            console.log(response);
            console.log(prompt);
            console.log("Successfully initialized database.");
        });

    });
})();