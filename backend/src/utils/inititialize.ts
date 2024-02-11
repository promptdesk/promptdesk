var fs = require("fs");
var path = require("path");
var seed_data = fs.readFileSync(path.join(__dirname, "../init/database.json"));
seed_data = JSON.parse(seed_data);
const bcrypt = require("bcryptjs");
import mongoose from "mongoose";
const saltRounds = 10;

import { Organization, Model, Prompt, Variable } from "../models/allModels";
import { User } from "../models/mongodb/user";
import { Log } from "../models/mongodb/log";

var organization_db = new Organization();
var model: any = new Model();
var prompt: any = new Prompt();
var variable: any = new Variable();
var organization: any = new Organization();
var logs: any = new Log();
var user_db = new User();

let isSetupCompleted = false;

export const checkIfFirstRun = async function () {
  if (isSetupCompleted == true) {
    return true;
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
  await variable.createVariables(data, organization.id);
  await populateOrganization(organization.id, model, prompt, logs);
  var user = await user_db.createUser(
    body.email,
    body.password,
    organization.id,
  );
  isSetupCompleted = false;
  console.log("INFO :: ORGANIZATION + USER SUCCESSFULLY CREATED");
  return "COMPLETE";
}

export async function automaticEnvironmentSetup() {
  if (
    process.env.SETUP == "true" ||
    process.env.NODE_ENV == "development" ||
    process.env.NODE_ENV == "test"
  ) {
    let isFirstRun = await checkIfFirstRun();
    console.log("INFO :: FIRST RUN:", isFirstRun);
    console.log("INFO :: ENV:", process.env.NODE_ENV);
    if (!isFirstRun && process.env.NODE_ENV !== "test") {
      return "NOT CREATED*";
    }
    if (process.env.NODE_ENV == "test") {
      console.log("INFO :: RESET DATABASE");
      let collections = await mongoose.connection.db
        .listCollections()
        .toArray();
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

      await prompt.createPrompt(prompt_obj, organization_id);
    }
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

  function getRandomStatus() {
    let status = [200, 400, 500];
    //get 200 97% of the time
    let random = Math.random();
    if (random < 0.97) {
      return 200;
    }
    //get 400 2% of the time
    if (random < 0.99) {
      return 400;
    }
    //get 500 1% of the time
    return 500;
  }

  //loop 100 times to create logs
  for (let i = 0; i < 20; i++) {
    let log = {
      message: "test data",
      error: false,
      status: getRandomStatus(),
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

  //loop 100 times to create logs
  for (let i = 0; i < 2; i++) {
    let log = {
      message: "test data",
      error: false,
      status: getRandomStatus(),
      model_id: python_generator.model,
      prompt_id: python_generator.id,
      organization_id: python_generator.organization_id,
      duration: getRandomFloat(3.5),
    };
    await logs.createLog(log, organization_id);
    let log2 = {
      message: "test data",
      error: false,
      status: getRandomStatus(),
      model_id: test_generator.model,
      prompt_id: test_generator.id,
      organization_id: test_generator.organization_id,
      duration: getRandomFloat(4.5),
    };
    await logs.createLog(log2, organization_id);
  }

  /*console.log(chat_model)
    console.log(completion_model)
    let model_obj = seed_data['models'][0];
    model_obj.organization_id = organization_id;
    var model_id = await model.createModel(model_obj, organization_id);

    let prompt_obj = seed_data['prompts'][0];
    prompt_obj.organization_id = organization_id;
    prompt_obj.model = model_id;
    await prompt.createPrompt(prompt_obj, organization_id)

    model_obj = seed_data['models'][1];
    model_obj.organization_id = organization_id;
    model_id = await model.createModel(model_obj, organization_id)

    prompt_obj = seed_data['prompts'][1];
    prompt_obj.organization_id = organization_id;
    prompt_obj.model = model_id;
    await prompt.createPrompt(prompt_obj, organization_id)*/

  return "COMPLETE";
};
