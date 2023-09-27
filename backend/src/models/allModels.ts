//import dotenv from 'dotenv';

//import mongodb models
import {Model as mongoModel} from './mongodb/model';
import {Prompt as mongoPrompt} from './mongodb/prompt';
import {Log as mongoLog} from './mongodb/log';
import {Variable as mongoVariable} from './mongodb/variable';

async function importModule(moduleName: string):Promise<any>{
  const importedModule = await import(moduleName);
  return importedModule;
}

//dotenv.config({ path: '../.env' });

let Prompt:any, Model:any, Log:any, Variable:any;

if (process.env.DATABASE_SELECTION === 'mongodb') {
  Prompt = mongoPrompt;
  Model = mongoModel;
  Log = mongoLog;
  Variable = mongoVariable;
  importModule('./mongodb/db');
}

export { Model, Prompt, Log, Variable };