import dotenv from 'dotenv';

//import mongodb models
import {Model as mongoModel} from './mongodb/model';
import {Prompt as mongoPrompt} from './mongodb/prompt';
import {Log as mongoLog} from './mongodb/log';

async function importModule(moduleName: string):Promise<any>{
  console.log("importing ", moduleName);
  const importedModule = await import(moduleName);
  console.log("\timported ...");
  return importedModule;
}

dotenv.config({ path: '../.env' });

let Prompt:any, Model:any, Log:any;

if (process.env.DATABASE_SELECTION === 'mongodb') {
  Prompt = mongoPrompt;
  Model = mongoModel;
  Log = mongoLog;
  importModule('./mongodb/db');
}

export { Model, Prompt, Log };