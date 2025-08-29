import { Model, Prompt, Log, Variable, Sample } from "../models/allModels";
import handlebars from "handlebars";


let model_db = new Model();
let prompt_db = new Prompt();
let variable_db = new Variable();
let log_db = new Log();

export function format_env_variables(prompt_variables: any): object {
  var variables: { [key: string]: string } = {};
  if (!prompt_variables) {
    return {};
  }
  for (const variable of prompt_variables) {
    variables[variable.name] = variable.value;
  }
  return variables;
}

export async function replace_api_variables(api_call: any, organization: any) {
  var environment_variables = await variable_db.getVariables(organization.id);
  var api_call = JSON.stringify(api_call) as any;
  environment_variables = format_env_variables(environment_variables);
  var prompt_api_template = handlebars.compile(api_call);
  api_call = prompt_api_template(environment_variables);
  api_call = JSON.parse(api_call);
  return api_call;
}

export async function embedding_model_validation(body: any, organization: any) {
  try {
    let model = undefined;

    //check if body.text_list exists
    if (!body.text_list) {
      return [
        undefined,
        undefined,
        { error: true, message: "Text list not provided.", status: 404 },
        organization,
      ];
    }

    //get prompt if using SDK (saved in DB)
    if (body.model_name) {

      let modelName = typeof body.model_name === 'object' ? body.model_name.name : body.model_name;

      model = await model_db.findModelByName(body.model_name, organization.id)

      if (!model) {
        return [
          undefined,
          undefined,
          { error: true, message: "Model not found.", status: 404 },
          organization,
        ];
      }

      if (!model.api_call) {
        return [
          undefined,
          undefined,
          { error: true, message: "Model API object not found.", status: 404 },
          organization,
        ];
      }

      if (!model.input_format && !model.request_mapping) {
        return [
          undefined,
          undefined,
          {
            error: true,
            message: "Request JSON mapping not found.",
            status: 404,
          },
          organization,
        ];
      }

      if (!model.output_format && !model.response_mapping) {
        return [
          undefined,
          undefined,
          {
            error: true,
            message: "Response JSON mapping not found.",
            status: 404,
          },
          organization,
        ];
      }

      return [body.text_list, model, undefined, organization];
    } else {
      return [
        undefined,
        undefined,
        { error: true, message: "Model name not provided.", status: 404 },
        organization,
      ];
    }
  } catch (error: any) {
    console.log("error", error);
    return [
      undefined,
      { error: true, message: error.message, status: 500 },
      organization,
    ];
  }
}
