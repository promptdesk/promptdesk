import handlebars from "handlebars";
import { Model, Prompt, Log, Variable, Sample } from "../models/allModels";
import { canonical_json_stringify } from "../utils/canonicalJson";
import crypto from "crypto";

let prompt_db = new Prompt();
let model_db = new Model();
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

export function format_prompt_variables(prompt_variables: any): any {
  var variables: { [key: string]: string } = {};
  for (const key in prompt_variables) {
    var variable = prompt_variables[key];
    variables[key] = variable.value;
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

export function replace_prompt_variables(
  text: string,
  variable_object: object,
) {
  var template = handlebars.compile(text);
  var new_text = template(variable_object);
  return new_text;
}

export function process_prompt_variables(
  prompt: any,
  body: any,
  proxy: boolean,
) {
  var prompt_variables = body.variables || {};
  if (!proxy) {
    prompt_variables = format_prompt_variables(prompt.prompt_variables);
  }

  // validate variables
  for (var key in prompt.prompt_variables) {
    if (prompt_variables[key] === undefined) {
      throw new Error('Variable "' + key + '" not found in prompt.');
    }
  }

  var prompt_data = JSON.parse(JSON.stringify(prompt.prompt_data));

  // if prompt_data has a context key, replace it with the variable markdown
  if (prompt_data["context"]) {
    prompt_data["context"] = replace_prompt_variables(
      prompt_data["context"],
      prompt_variables,
    );
  }
  if (prompt_data["prompt"]) {
    prompt_data["prompt"] = replace_prompt_variables(
      prompt_data["prompt"],
      prompt_variables,
    );
  }
  if (prompt_data["messages"]) {
    // loop through each message in messages and replace the variables in the prompt_data['messages']['content']
    for (var i = 0; i < prompt_data["messages"].length; i++) {
      prompt_data["messages"][i]["content"] = replace_prompt_variables(
        prompt_data["messages"][i]["content"],
        prompt_variables,
      );
      //loop through all files in messages.i and replace the variables in the file
      if (prompt_data["messages"][i]["files"]) {
        for (var j = 0; j < prompt_data["messages"][i]["files"].length; j++) {
          for (var key in prompt_data["messages"][i]["files"][j]) {
            prompt_data["messages"][i]["files"][j][key] = replace_prompt_variables(
              prompt_data["messages"][i]["files"][j][key],
              prompt_variables,
            );
          }
        }
      }
    }
  }

  return [prompt_data, prompt_variables];
}

export async function prompt_model_validation(body: any, organization: any) {
  try {
    var prompt = undefined;
    var proxy = false;
    var error = undefined;
    var cache = body.cache || false;

    //get prompt if using SDK (saved in DB)
    if (body.prompt_name) {
      prompt = await prompt_db.findPromptByName(
        body.prompt_name,
        organization.id,
      );

      if (!prompt) {
        return [
          undefined,
          undefined,
          undefined,
          { error: true, message: "Prompt not found.", status: 404 },
          organization,
          cache,
        ];
      }
      proxy = true;
    } else {
      //get prompt by passing it in the body
      prompt = body;
    }

    if (!prompt) {
      return [
        undefined,
        undefined,
        undefined,
        { error: true, message: "Prompt not found.", status: 404 },
        organization,
        cache,
      ];
    }

    var model_id = prompt.model;

    const model = await model_db.findModel(model_id, organization.id);

    if (!model) {
      return [
        undefined,
        undefined,
        undefined,
        { error: true, message: "Model not found.", status: 404 },
        organization,
        cache,
      ];
    }

    if (!model.api_call) {
      return [
        undefined,
        undefined,
        undefined,
        { error: true, message: "Model API object not found.", status: 404 },
        organization,
        cache,
      ];
    }

    if (!model.input_format && !model.request_mapping) {
      return [
        undefined,
        undefined,
        undefined,
        {
          error: true,
          message: "Request JSON mapping not found.",
          status: 404,
        },
        organization,
        cache,
      ];
    }

    if (!model.output_format && !model.response_mapping) {
      return [
        undefined,
        undefined,
        undefined,
        {
          error: true,
          message: "Response JSON mapping not found.",
          status: 404,
        },
        organization,
        cache,
      ];
    }

    return [prompt, model, proxy, error, cache];
  } catch (error) {
    return [
      undefined,
      undefined,
      undefined,
      { error: true, message: error, status: 500 },
      organization,
      cache,
    ];
  }
}

export async function generate_cached_response(
  body: any,
  cache: any,
  organization: any,
) {
  const hashJsonString = canonical_json_stringify(body);
  const hash = crypto.createHash("sha256").update(hashJsonString).digest("hex");

  if (cache) {
    const cachedLog = await log_db.findLogByHash(hash, organization.id);
    if (cachedLog) {
      return [hash, cachedLog];
    }
  }

  return [hash, undefined];
}
