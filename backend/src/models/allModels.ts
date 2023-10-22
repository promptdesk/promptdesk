//import mongodb models
import {Model as mongoModel} from './mongodb/model';
import {Prompt as mongoPrompt} from './mongodb/prompt';
import {Log as mongoLog} from './mongodb/log';
import {Variable as mongoVariable} from './mongodb/variable';
import {Organization as mongoOrganization} from './mongodb/organization';

async function importModule(moduleName: string):Promise<any>{
  const importedModule = await import(moduleName);
  return importedModule;
}

let Prompt:any, Model:any, Log:any, Variable:any, Organization:any;

if (true) {

  Prompt = mongoPrompt;
  Model = mongoModel;
  Log = mongoLog;
  Variable = mongoVariable;
  Organization = mongoOrganization;
  importModule('./mongodb/db');

}

export { Model, Prompt, Log, Variable, Organization };