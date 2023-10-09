//import mongodb models
import connectToDatabase from '../models/mongodb/db';
import {Model as mongoModel} from './mongodb/model';
import {Prompt as mongoPrompt} from './mongodb/prompt';
import {Log as mongoLog} from './mongodb/log';
import {Variable as mongoVariable} from './mongodb/variable';

async function importModule(moduleName: string):Promise<any>{
  const importedModule = await import(moduleName);
  return importedModule;
}

let Prompt:any, Model:any, Log:any, Variable:any;

if (process.env.DATABASE_SELECTION === 'mongodb') {
  connectToDatabase();
  Prompt = mongoPrompt;
  Model = mongoModel;
  Log = mongoLog;
  Variable = mongoVariable;
  importModule('./mongodb/db');
}

export { Model, Prompt, Log, Variable };