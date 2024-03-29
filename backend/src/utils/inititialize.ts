var fs = require("fs");
var path = require("path");
var samples = fs.readFileSync(path.join(__dirname, "../init/samples.json"));
samples = JSON.parse(samples);
const bcrypt = require("bcryptjs");
import mongoose from "mongoose";
const saltRounds = 10;

import {
  Organization,
  Model,
  Prompt,
  Variable,
  Sample,
} from "../models/allModels";
import { User } from "../models/mongodb/user";
import { Log } from "../models/mongodb/log";

var organization_db = new Organization();
var model: any = new Model();
var prompt: any = new Prompt();
var variable: any = new Variable();
var organization: any = new Organization();
var logs: any = new Log();
var user_db = new User();
var sample: any = new Sample();

let isSetupCompleted = false;

export const checkIfFirstRun = async function () {
  if (process.env.NODE_ENV == "test") {
    return true;
  }

  if (isSetupCompleted == true) {
    return false;
  }
  var existing_organization = await organization_db.getOrganization();

  if (organization == undefined || existing_organization == null) {
    return true;
  }

  return false;
};

export async function generateInitialOrganization(body: any) {
  console.log("INFO :: GENERATING ORGANIZATION + USER");
  body.password = await bcrypt.hash(body.password, saltRounds);
  organization = await organization_db.addOrganization(
    body.organization_api_key,
  );
  var data = [{ name: "OPENAI_API_KEY", value: body.openai_api_key }];
  if (process.env.ANTHROPIC_API_KEY) {
    data.push({
      name: "ANTHROPIC_API_KEY",
      value: process.env.ANTHROPIC_API_KEY,
    });
  }
  if (process.env.GEMINI_API_KEY) {
    data.push({ name: "GEMINI_API_KEY", value: process.env.GEMINI_API_KEY });
  }
  if (process.env.MISTRAL_API_KEY) {
    data.push({ name: "MISTRAL_API_KEY", value: process.env.MISTRAL_API_KEY });
  }
  if (process.env.COHERE_API_KEY) {
    data.push({ name: "CLAUDE_API_KEY", value: process.env.COHERE_API_KEY });
  }
  if (process.env.HUGGINGFACE_API_KEY) {
    data.push({
      name: "COHERE_API_KEY",
      value: process.env.HUGGINGFACE_API_KEY,
    });
  }
  await variable.createVariables(data, organization.id);
  await populateOrganization(organization.id, model, prompt, logs);
  var user = await user_db.createUser(
    body.email,
    body.password,
    organization.id,
  );
  isSetupCompleted = true;
  console.log("INFO :: ORGANIZATION + USER SUCCESSFULLY CREATED");
  return "COMPLETE";
}

//only runs if the environment is development or test
export async function automaticTestEnvironmentSetup() {
  if (
    process.env.SETUP == "true" ||
    process.env.NODE_ENV == "development" ||
    process.env.NODE_ENV == "test"
  ) {
    let isFirstRun = await checkIfFirstRun();
    console.log("INFO :: FIRST RUN:", isFirstRun);
    console.log("INFO :: ENV:", process.env.NODE_ENV);

    if (
      isFirstRun &&
      (process.env.NODE_ENV == "development" || process.env.NODE_ENV == "test")
    ) {
      console.log("INFO :: SETTING UP TEST ENVIRONMENT");
    } else {
      return "Test environment already setup or not in test/development mode.";
    }

    //wait until mongoose.connection.readyState is 1
    while (mongoose.connection.readyState !== 1) {
      console.log("INFO :: WAITING FOR MONGOOSE TO CONNECT...");
      await new Promise((resolve) => setTimeout(resolve, 250));
    }

    console.log("INFO :: MONGOOSE CONNECTED");

    if (process.env.NODE_ENV == "test") {
      console.log("INFO :: RESET DATABASE");
      //print mongoose status
      console.log("MONGOOSE STATUS", mongoose.connection.readyState);
      let collections = await mongoose.connection.db
        .listCollections()
        .toArray();
      console.log(`INFO :: DROPPING ${collections.length} COLLECTIONS`);
      for (let i = 0; i < collections.length; i++) {
        await mongoose.connection.db.dropCollection(collections[i].name);
      }
    }
    let body = {
      email: process.env.EMAIL,
      password: process.env.PASSWORD,
      openai_api_key: process.env.OPENAI_API_KEY,
      organization_api_key: process.env.ORGANIZATION_API_KEY,
    };
    await generateInitialOrganization(body);
    console.log("############### .env ###############");
    console.log("ORGANIZATION_API_KEY=" + process.env.ORGANIZATION_API_KEY);
    console.log("############### .env ###############");
    return "CREATED";
  }

  return "NOT CREATED";
}

export const populateOrganization = async function (
  organization_id: any,
  model: any,
  prompt: any,
  logs: any,
) {
  //read all files in ../../
  let model_files = fs.readdirSync(path.join(__dirname, "../../../models"));
  for (let i = 0; i < model_files.length; i++) {
    //only open .json files
    if (model_files[i].endsWith(".json")) {
      let file = fs.readFileSync(
        path.join(__dirname, "../../../models", model_files[i]),
      );
      let model_obj = JSON.parse(file);
      model_obj.organization_id = organization_id;
      await model.createModel(model_obj, organization_id);
    }
  }

  //count number of models
  let model_count = await model.listModels(organization_id);

  let chat_model = model_count.find(
    (model: any) =>
      model.name == "gpt-3.5-turbo" &&
      model.type == "chat" &&
      model.provider == "OpenAI",
  );
  let completion_model = model_count.find(
    (model: any) =>
      model.name == "gpt-3.5-turbo" &&
      model.type == "completion" &&
      model.provider == "OpenAI",
  );

  let prompt_files = fs.readdirSync(path.join(__dirname, "../init/prompts"));
  for (let i = 0; i < prompt_files.length; i++) {
    //only open .json files
    if (prompt_files[i].endsWith(".json")) {
      let file = fs.readFileSync(
        path.join(__dirname, "../init/prompts", prompt_files[i]),
      );
      let prompt_obj = JSON.parse(file);
      prompt_obj.organization_id = organization_id;
      if (prompt_obj.model_type == "chat") {
        prompt_obj.model = chat_model.id;
      } else if (prompt_obj.model_type == "completion") {
        prompt_obj.model = completion_model.id;
      }

      //specific model assigning for demo + testing purposes
      if (prompt_obj.name == "hashtag_generator") {
        let completion_model = model_count.find(
          (model: any) =>
            model.name == "claude-2.1" && model.type == "completion",
        );
        prompt_obj.model = completion_model.id;
      }

      if (prompt_obj.name == "python_function_generation") {
        let chat_model = model_count.find(
          (model: any) =>
            model.name == "gemini-pro" && model.type == "completion",
        );
        prompt_obj.model = chat_model.id;
      }

      if (prompt_obj.name == "supply_chain_advisory") {
        let chat_model = model_count.find(
          (model: any) =>
            model.name == "mistral-medium" && model.type == "chat",
        );
        prompt_obj.model = chat_model.id;
      }

      if (
        process.env.NODE_ENV !== "development" &&
        process.env.NODE_ENV !== "test"
      ) {
        if (prompt_obj.project === "test") {
          if (prompt_obj.name === "short-story-test") {
            prompt_obj.name = "short-story";
            delete prompt_obj.project;
          }
          await prompt.createPrompt(prompt_obj, organization_id);
        }
      } else {
        await prompt.createPrompt(prompt_obj, organization_id);
      }
    }
  }

  //return if process.env.NODE_ENV is not development or test
  if (
    process.env.NODE_ENV !== "development" &&
    process.env.NODE_ENV !== "test"
  ) {
    return "COMPLETE";
  }

  //find hashtag_generator prompt
  let short_story_test = await prompt.findPromptByName(
    "short-story-test",
    organization_id,
  );

  //loop through all samples
  for (let i = 0; i < samples.length; i++) {
    let variables = samples[i].variables;
    let prompt = samples[i].prompt;
    let result = samples[i].result;
    let prompt_id = short_story_test.id;
    await sample.recordSampleDataIfNeeded(
      variables,
      prompt,
      result,
      prompt_id,
      organization_id,
    );
  }

  //find hashtag_generator prompt
  let hashtag_generator = await prompt.findPromptByName(
    "hashtag_generator",
    organization_id,
  );
  let python_generator = await prompt.findPromptByName(
    "python_function_generation",
    organization_id,
  );
  let test_generator = await prompt.findPromptByName(
    "python_test_generation",
    organization_id,
  );

  //function that gets a float and returns the same float +- 0.2
  function getRandomFloat(num: number) {
    num = num + Math.random() * 0.4 - 0.2;
    return num.toFixed(2);
  }

  //loop 100 times to create logs
  for (let i = 0; i < 20; i++) {
    let log = {
      message: "test data",
      error: false,
      status: 200,
      model_id: hashtag_generator.model,
      prompt_id: hashtag_generator.id,
      organization_id: hashtag_generator.organization_id,
      duration: getRandomFloat(1.74),
    };
    await logs.createLog(log, organization_id);
  }

  //wait 1 second
  await new Promise((resolve) => setTimeout(resolve, 1000));

  let log = {
    message:
      "Here is a possible pytest test function for the get_weather function:\n\n```python\nimport pytest\nimport requests\n\ndef test_get_weather(requests_mock):\n    # Mock the HTTP GET request\n    requests_mock.get('http://api.openweathermap.org/data/2.5/weather?q=TestCity&appid=YOUR_API_KEY', \n                      json={'weather': 'sunny'}, status_code=200)\n\n    # Call the get_weather function with the test city\n    result = get_weather('TestCity')\n\n    # Assert that the request was successful\n    assert result == {'weather': 'sunny'}\n\n    # Assert that the HTTP GET request was made with the correct URL\n    assert requests_mock.last_request.url == 'http://api.openweathermap.org/data/2.5/weather?q=TestCity&appid=YOUR_API_KEY'\n```\n\nIn this test function, we use the `requests_mock` fixture provided by the `pytest-requests` plugin to mock the HTTP GET request. We then call the `get_weather` function with a test city and assert that the result is the expected weather data. We also assert that the HTTP GET request was made with the correct URL.",
    raw: {
      request: {
        model: "gpt-3.5-turbo",
        messages: [
          {
            content:
              "Generate a pytest test function for the following python function:\n\nimport requests\n\ndef get_weather(city):\n# API endpoint URL\nurl &#x3D; f&quot;http://api.openweathermap.org/data/2.5/weather?q&#x3D;{city}&amp;appid&#x3D;YOUR_API_KEY&quot;\n\n# Send HTTP GET request\nresponse &#x3D; requests.get(url)\n\n# Check if the request was successful\nif response.status_code &#x3D;&#x3D; 200:\n# Get and return the weather data\ndata &#x3D; response.json()\nreturn data\nelse:\n# Return an error message\nreturn &quot;Error fetching weather data&quot;",
            role: "system",
          },
        ],
      },
      response: {
        id: "chatcmpl-8qUijD5fax69MpMH3JoIfLoKiokW4",
        object: "chat.completion",
        created: 1707521837,
        model: "gpt-3.5-turbo-0613",
        choices: [
          {
            index: 0,
            message: {
              role: "assistant",
              content:
                "Here is a possible pytest test function for the get_weather function:\n\n```python\nimport pytest\nimport requests\n\ndef test_get_weather(requests_mock):\n    # Mock the HTTP GET request\n    requests_mock.get('http://api.openweathermap.org/data/2.5/weather?q=TestCity&appid=YOUR_API_KEY', \n                      json={'weather': 'sunny'}, status_code=200)\n\n    # Call the get_weather function with the test city\n    result = get_weather('TestCity')\n\n    # Assert that the request was successful\n    assert result == {'weather': 'sunny'}\n\n    # Assert that the HTTP GET request was made with the correct URL\n    assert requests_mock.last_request.url == 'http://api.openweathermap.org/data/2.5/weather?q=TestCity&appid=YOUR_API_KEY'\n```\n\nIn this test function, we use the `requests_mock` fixture provided by the `pytest-requests` plugin to mock the HTTP GET request. We then call the `get_weather` function with a test city and assert that the result is the expected weather data. We also assert that the HTTP GET request was made with the correct URL.",
            },
            logprobs: null,
            finish_reason: "stop",
          },
        ],
        usage: {
          prompt_tokens: 152,
          completion_tokens: 239,
          total_tokens: 391,
        },
        system_fingerprint: null,
      },
    },
    data: {
      prompt:
        "Generate a pytest test function for the following python function:\n\n{{python_function}}",
      variables: {
        python_function:
          'import requests\n\ndef get_weather(city):\n# API endpoint URL\nurl = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid=YOUR_API_KEY"\n\n# Send HTTP GET request\nresponse = requests.get(url)\n\n# Check if the request was successful\nif response.status_code == 200:\n# Get and return the weather data\ndata = response.json()\nreturn data\nelse:\n# Return an error message\nreturn "Error fetching weather data"',
      },
    },
    error: false,
    status: 200,
    model_id: python_generator.model,
    prompt_id: python_generator.id,
    organization_id: python_generator.organization_id,
    duration: getRandomFloat(3.5),
  };
  await logs.createLog(log, organization_id);
  let log2 = {
    message: "Request failed with status code 400.",
    raw: {
      request: {
        model: "gpt-3.5-turbo",
        messages: [
          {
            content:
              "Generate a pytest test function for the following python function:\n\nimport requests\n\ndef get_weather(city):\n# API endpoint URL\nurl &#x3D; f&quot;http://api.openweathermap.org/data/2.5/weather?q&#x3D;{city}&amp;appid&#x3D;YOUR_API_KEY&quot;\n\n# Send HTTP GET request\nresponse &#x3D; requests.get(url)\n\n# Check if the request was successful\nif response.status_code &#x3D;&#x3D; 200:\n# Get and return the weather data\ndata &#x3D; response.json()\nreturn data\nelse:\n# Return an error message\nreturn &quot;Error fetching weather data&quot;",
            role: "system",
          },
        ],
      },
      response: {
        error: {
          message:
            "Incorrect API key provided: ask-PXIX****************************************Vm7x. You can find your API key at https://platform.openai.com/account/api-keys.",
          type: "invalid_request_error",
          param: null,
          code: "invalid_api_key",
        },
      },
    },
    data: {
      prompt:
        "Generate a pytest test function for the following python function:\n\n{{python_function}}",
      variables: {
        python_function:
          'import requests\n\ndef get_weather(city):\n# API endpoint URL\nurl = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid=YOUR_API_KEY"\n\n# Send HTTP GET request\nresponse = requests.get(url)\n\n# Check if the request was successful\nif response.status_code == 200:\n# Get and return the weather data\ndata = response.json()\nreturn data\nelse:\n# Return an error message\nreturn "Error fetching weather data"',
      },
    },
    error: false,
    status: 400,
    model_id: test_generator.model,
    prompt_id: test_generator.id,
    organization_id: test_generator.organization_id,
    duration: getRandomFloat(4.5),
  };
  await logs.createLog(log2, organization_id);

  return "COMPLETE";
};
