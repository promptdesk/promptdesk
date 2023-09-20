import dotenv from 'dotenv';
//import './mongodb/db.js'
dotenv.config({path:'../.env'})

console.log(process.env)

//get DATABASE env
const database_selection = process.env.DATABASE_SELECTION;

let Model, Prompt, Log;

if (database_selection === 'local') {
    console.log("Using local database")
    Model = (await import('./local/model.js')).default;
    Prompt = (await import('./local/prompt.js')).default;
} else if (database_selection === 'mongodb') {
    console.log("Using mongodb database")
    await import('./mongodb/db.js')
    Model = (await import('./mongodb/model.js')).default;
    Prompt = (await import('./mongodb/prompt.js')).default;
    Log = (await import('./mongodb/log.js')).default;
} else {
    console.log("ERROR: NO DATABASE SELECTED IN .env FILE")
    process.exit(1);
}

export { Model, Prompt, Log }