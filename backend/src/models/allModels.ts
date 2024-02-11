//import mongodb models
import { Model as mongoModel } from "./mongodb/model";
import { Prompt as mongoPrompt } from "./mongodb/prompt";
import { Log as mongoLog } from "./mongodb/log";
import { Variable as mongoVariable } from "./mongodb/variable";
import { Organization as mongoOrganization } from "./mongodb/organization";
import { Sample as mongoSample } from "./mongodb/sample";
import connectToDatabase from "../models/mongodb/db";

async function importModule(moduleName: string): Promise<any> {
  const importedModule = await import(moduleName);
  return importedModule;
}

let Prompt: any,
  Model: any,
  Log: any,
  Variable: any,
  Organization: any,
  Sample: any;

if (true) {
  setTimeout(async () => {
    await connectToDatabase();
    var environment = process.env.NODE_ENV;

    if (environment === "development" || environment === "test") {
      var org = new mongoOrganization();
      org = await org.getOrganization();
      if (org) {
        console.log("############### .env ###############");
        //check if keys exist in organization
        if ((org as any).keys) {
          console.log("ORGANIZATION_API_KEY=" + (org as any).keys[0]["key"]);
        }
        console.log("############### .env ###############");
      }
    }
  }, 100);
  Prompt = mongoPrompt;
  Model = mongoModel;
  Log = mongoLog;
  Variable = mongoVariable;
  Organization = mongoOrganization;
  Sample = mongoSample;
  importModule("./mongodb/db");
}

export { Model, Prompt, Log, Variable, Organization, Sample };
