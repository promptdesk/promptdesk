import dotenv from 'dotenv';

dotenv.config({path:'../.env'})


//get DATABASE env
const DATABASE = process.env.DATABASE;

let Model, Prompt;

if (DATABASE === 'local') {
    console.log("Using local database")
    Model = (await import('./local/model.js')).default;
    Prompt = (await import('./local/prompt.js')).default;
} else if (DATABASE === 'mongodb') {
    console.log("Using mongodb database")
    Model = (await import('./local/model.js')).default;
    Prompt = (await import('./local/prompt.js')).default;
}

export { Model, Prompt }