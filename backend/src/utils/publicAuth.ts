const bcrypt = require('bcryptjs');
const saltRounds = 10;
const figlet = require('figlet');

import cookieParser from 'cookie-parser';
import { Organization, Model, Prompt, Variable } from "../models/allModels";
import { User } from "../models/mongodb/user";
import { Log } from "../models/mongodb/log";

var organization_db = new Organization();
var user_db = new User();
var model:any = new Model();
var prompt:any = new Prompt();
var variable:any = new Variable();
var organization:any = new Organization();
var logs:any = new Log();

var fs = require('fs');
var path = require('path');
var seed_data = fs.readFileSync(path.join(__dirname, '../init/database.json'));
seed_data = JSON.parse(seed_data);

var isSetupCompleted = false;

const checkIfFirstRun = async function() {
    if(isSetupCompleted == true) {
        return true
    }
    var existing_organization = await organization_db.getOrganization();
    if(organization == undefined || existing_organization == null) {
        return true
    }
    return false
}

figlet("PromptDesk", function (err:any, data:any) {
    if (err) {
        console.dir(err);
        return;
    }
});

async function generateInitialOrganization(body:any) {
    body.password = await bcrypt.hash(body.password, saltRounds)
    organization = await organization_db.addOrganization(body.organization_api_key);
    await populateOrganization(organization.id, body.openai_api_key)
    var user = await user_db.createUser(body.email, body.password, organization.id);
    isSetupCompleted = false;
}

async function setup() {
    
    if(process.env.SETUP == 'true') {
        console.log("INFO :: Setting up organization and models");
        let isFirstRun = await checkIfFirstRun();
        if(!isFirstRun) {
            return;
        }
        console.log("INFO :: Setting up organization and models");
        let body = {
            email: process.env.EMAIL,
            password: process.env.PASSWORD,
            openai_api_key: process.env.OPENAI_API_KEY,
            organization_api_key: process.env.ORGANIZATION_API_KEY
        }
        await generateInitialOrganization(body);
        console.log("INFO :: ############### SUCCESS ###############")
        console.log("INFO :: Setup successful!")
        console.log("INFO :: ############### SUCCESS ###############")
    }
}

const authenticate = function(app:any) {

    app.use(cookieParser());

    app.get(['/setup.html', '/login.html'], async (req:any, res:any) => {
        return res.redirect('/auth/login');
    })

    app.get(['/auth/setup'], async (req:any, res:any) => {
        const shouldSetup = await checkIfFirstRun()
        if(shouldSetup) {
            return res.sendFile(path.join(__dirname, '../../public/setup.html'));
        }
        
        return res.redirect('/auth/login');
    })

    app.get(['/auth/login'], async (req:any, res:any) => {
        const shouldSetup = await checkIfFirstRun()
        if(shouldSetup) {
            return res.redirect('/auth/setup');
        }

        let token_cookie = req.cookies.token;
        let organization_id_cookie = req.cookies.organization;
    
        let isAuthenticated = await isAuthenticatedSession(organization_id_cookie, token_cookie);

        if(isAuthenticated) {
            return res.redirect('/');
        }

        res.sendFile(path.join(__dirname, '../../public/login.html'));
    })

    // req.isAuthenticated is provided from the auth router
    app.post('/auth/setup', async (req:any, res:any) => {
        let body = req.body;

        //validate email, password and  openai_api_key - make sure they are not empty
        if(body.email == undefined || body.email == "") {
            return res.status(400).json({error:"Email cannot be empty."})
        }

        if(body.password == undefined || body.password == "") {
            return res.status(400).json({error:"Password cannot be empty."})
        }

        if(body.openai_api_key == undefined || body.openai_api_key == "") {
            return res.status(400).json({error:"OpenAI API key cannot be empty."})
        }

        //check if email already exists
        let existing_user = await user_db.findUser(body.email);

        if(existing_user != undefined) {
            return res.status(400).json({error:"Email already exists."})
        }

        const shouldSetup = await checkIfFirstRun()
        if(!shouldSetup) {
            return res.status(400).json({error:"Organization already exists."})
        }

        await generateInitialOrganization(body);

        return res.status(200).json({message:"Setup successful."})
    });

    app.post('/auth/login', async (req:any, res:any) => {
        try {
            let body = req.body;
            let user = await user_db.findUser(body.email);
            if(user == undefined) {
                return res.status(400).json({error:"Wrong email or password."})
            }
            let match = await bcrypt.compare(body.password, user.password);
            if(match) {
                let organization = await organization_db.getOrganizationById(user.organization_id);
                let token = organization.keys[0].key;
                let expiry = 60*1000*60*24*30;
                res.cookie('token', token, { maxAge: expiry, httpOnly: false });
                res.cookie('organization', organization.id, { maxAge: expiry, httpOnly: false });
                return res.status(200).json({message:"Login successful."})
            }
            return res.status(400).json({error:"Wrong email or password."})
        } catch (error) {
            return res.status(400).json({error:"Wrong email or password."})
        }
    })

    app.get('/logout', async (req:any, res:any) => {
        res.clearCookie('token');
        res.clearCookie('organization');
        res.redirect('/auth/login');
    })

    setup();

    app.use(checkAuth);

}

const populateOrganization = async function(organization_id:any, open_ai_key:any) {
    var data = [{ "name": "OPENAI_API_KEY", "value": open_ai_key }];
    await variable.createVariables(data, organization_id);

    //read all files in ../../
    let model_files = fs.readdirSync(path.join(__dirname, '../../../models'));
    console.log("INFO :: Reading files in ../../")
    for(let i=0; i<model_files.length; i++) {
        //only open .json files
        if(model_files[i].endsWith('.json')) {
            let file = fs.readFileSync(path.join(__dirname, '../../../models', model_files[i]));
            let model_obj = JSON.parse(file);
            model_obj.organization_id = organization_id;
            await model.createModel(model_obj, organization_id);
        }
    }

    //count number of models
    let model_count = await model.listModels(organization_id);
    //console.log("INFO :: Number of models added: ", model_count.length, model_count)

    let chat_model = model_count.find((model:any) => model.name == 'gpt-3.5-turbo' && model.type == 'chat' && model.provider == 'OpenAI');
    let completion_model = model_count.find((model:any) => model.name == 'gpt-3.5-turbo' && model.type == 'completion' && model.provider == 'OpenAI');

    let prompt_files = fs.readdirSync(path.join(__dirname, '../init/prompts'));
    console.log("INFO :: Reading files in ../../")
    for(let i=0; i<prompt_files.length; i++) {
        //only open .json files
        if(prompt_files[i].endsWith('.json')) {
            let file = fs.readFileSync(path.join(__dirname, '../init/prompts', prompt_files[i]));
            let prompt_obj = JSON.parse(file);
            prompt_obj.organization_id = organization_id;
            console.log(prompt_obj.model_type)
            if(prompt_obj.model_type == 'chat') {
                prompt_obj.model = chat_model.id;
            } else if(prompt_obj.model_type == 'completion') {
                prompt_obj.model = completion_model.id;
            }

            //specific model assigning for demo + testing purposes
            if(prompt_obj.name == 'hashtag_generator') {
                let completion_model = model_count.find((model:any) => model.name == 'claude-2.1' && model.type == 'completion');
                prompt_obj.model = completion_model.id;
            }

            if(prompt_obj.name == 'python_function_generation') {
                let chat_model = model_count.find((model:any) => model.name == 'gemini-pro' && model.type == 'completion');
                prompt_obj.model = chat_model.id;
            }

            if(prompt_obj.name == 'supply_chain_advisory') {
                let chat_model = model_count.find((model:any) => model.name == 'mistral-medium' && model.type == 'chat');
                prompt_obj.model = chat_model.id;
            }  

            await prompt.createPrompt(prompt_obj, organization_id);
        }
    }

    //find hashtag_generator prompt
    let hashtag_generator = await prompt.findPromptByName('hashtag_generator', organization_id);
    let python_generator = await prompt.findPromptByName('python_function_generation', organization_id);
    let test_generator = await prompt.findPromptByName('python_test_generation', organization_id);
    

    //function that gets a float and returns the same float +- 0.2
    function getRandomFloat(num:number) {
        num = num + (Math.random() * 0.4) - 0.2;
        return num.toFixed(2);
    }

    function getRandomStatus() {
        let status = [200, 400, 500];
        //get 200 97% of the time
        let random = Math.random();
        if(random < 0.97) {
            return 200;
        }
        //get 400 2% of the time
        if(random < 0.99) {
            return 400;
        }
        //get 500 1% of the time
        return 500;
    }

    //loop 100 times to create logs
    for(let i=0; i<3658; i++) {
        let log = {
            "message": "test data",
            "error": false,
            "status": getRandomStatus(),
            "model_id": hashtag_generator.model,
            "prompt_id": hashtag_generator.id,
            "organization_id": hashtag_generator.organization_id,
            "duration": getRandomFloat(1.74)
        };
        await logs.createLog(log, organization_id);
    }

        //wait 1 second
        await new Promise(resolve => setTimeout(resolve, 1000));

        let log = {
            "message": "Here is a possible pytest test function for the get_weather function:\n\n```python\nimport pytest\nimport requests\n\ndef test_get_weather(requests_mock):\n    # Mock the HTTP GET request\n    requests_mock.get('http://api.openweathermap.org/data/2.5/weather?q=TestCity&appid=YOUR_API_KEY', \n                      json={'weather': 'sunny'}, status_code=200)\n\n    # Call the get_weather function with the test city\n    result = get_weather('TestCity')\n\n    # Assert that the request was successful\n    assert result == {'weather': 'sunny'}\n\n    # Assert that the HTTP GET request was made with the correct URL\n    assert requests_mock.last_request.url == 'http://api.openweathermap.org/data/2.5/weather?q=TestCity&appid=YOUR_API_KEY'\n```\n\nIn this test function, we use the `requests_mock` fixture provided by the `pytest-requests` plugin to mock the HTTP GET request. We then call the `get_weather` function with a test city and assert that the result is the expected weather data. We also assert that the HTTP GET request was made with the correct URL.",
            "raw": {
                "request": {
                    "model": "gpt-3.5-turbo",
                    "messages": [
                        {
                            "content": "Generate a pytest test function for the following python function:\n\nimport requests\n\ndef get_weather(city):\n# API endpoint URL\nurl &#x3D; f&quot;http://api.openweathermap.org/data/2.5/weather?q&#x3D;{city}&amp;appid&#x3D;YOUR_API_KEY&quot;\n\n# Send HTTP GET request\nresponse &#x3D; requests.get(url)\n\n# Check if the request was successful\nif response.status_code &#x3D;&#x3D; 200:\n# Get and return the weather data\ndata &#x3D; response.json()\nreturn data\nelse:\n# Return an error message\nreturn &quot;Error fetching weather data&quot;",
                            "role": "system"
                        }
                    ]
                },
                "response": {
                    "id": "chatcmpl-8qUijD5fax69MpMH3JoIfLoKiokW4",
                    "object": "chat.completion",
                    "created": 1707521837,
                    "model": "gpt-3.5-turbo-0613",
                    "choices": [
                        {
                            "index": 0,
                            "message": {
                                "role": "assistant",
                                "content": "Here is a possible pytest test function for the get_weather function:\n\n```python\nimport pytest\nimport requests\n\ndef test_get_weather(requests_mock):\n    # Mock the HTTP GET request\n    requests_mock.get('http://api.openweathermap.org/data/2.5/weather?q=TestCity&appid=YOUR_API_KEY', \n                      json={'weather': 'sunny'}, status_code=200)\n\n    # Call the get_weather function with the test city\n    result = get_weather('TestCity')\n\n    # Assert that the request was successful\n    assert result == {'weather': 'sunny'}\n\n    # Assert that the HTTP GET request was made with the correct URL\n    assert requests_mock.last_request.url == 'http://api.openweathermap.org/data/2.5/weather?q=TestCity&appid=YOUR_API_KEY'\n```\n\nIn this test function, we use the `requests_mock` fixture provided by the `pytest-requests` plugin to mock the HTTP GET request. We then call the `get_weather` function with a test city and assert that the result is the expected weather data. We also assert that the HTTP GET request was made with the correct URL."
                            },
                            "logprobs": null,
                            "finish_reason": "stop"
                        }
                    ],
                    "usage": {
                        "prompt_tokens": 152,
                        "completion_tokens": 239,
                        "total_tokens": 391
                    },
                    "system_fingerprint": null
                }
            },
            "data": {
                "prompt": "Generate a pytest test function for the following python function:\n\n{{python_function}}",
                "variables": {
                    "python_function": "import requests\n\ndef get_weather(city):\n# API endpoint URL\nurl = f\"http://api.openweathermap.org/data/2.5/weather?q={city}&appid=YOUR_API_KEY\"\n\n# Send HTTP GET request\nresponse = requests.get(url)\n\n# Check if the request was successful\nif response.status_code == 200:\n# Get and return the weather data\ndata = response.json()\nreturn data\nelse:\n# Return an error message\nreturn \"Error fetching weather data\""
                }
            },
            "error": false,
            "status": 200,
            "model_id": python_generator.model,
            "prompt_id": python_generator.id,
            "organization_id": python_generator.organization_id,
            "duration": getRandomFloat(3.50)
        };
        await logs.createLog(log, organization_id);
        let log2 = {
            "message": "Request failed with status code 400.",
            "raw": {
                "request": {
                    "model": "gpt-3.5-turbo",
                    "messages": [
                        {
                            "content": "Generate a pytest test function for the following python function:\n\nimport requests\n\ndef get_weather(city):\n# API endpoint URL\nurl &#x3D; f&quot;http://api.openweathermap.org/data/2.5/weather?q&#x3D;{city}&amp;appid&#x3D;YOUR_API_KEY&quot;\n\n# Send HTTP GET request\nresponse &#x3D; requests.get(url)\n\n# Check if the request was successful\nif response.status_code &#x3D;&#x3D; 200:\n# Get and return the weather data\ndata &#x3D; response.json()\nreturn data\nelse:\n# Return an error message\nreturn &quot;Error fetching weather data&quot;",
                            "role": "system"
                        }
                    ]
                },
                "response": {
                    "error": {
                        "message": "Incorrect API key provided: ask-PXIX****************************************Vm7x. You can find your API key at https://platform.openai.com/account/api-keys.",
                        "type": "invalid_request_error",
                        "param": null,
                        "code": "invalid_api_key"
                    }
                }
            },
            "data": {
                "prompt": "Generate a pytest test function for the following python function:\n\n{{python_function}}",
                "variables": {
                    "python_function": "import requests\n\ndef get_weather(city):\n# API endpoint URL\nurl = f\"http://api.openweathermap.org/data/2.5/weather?q={city}&appid=YOUR_API_KEY\"\n\n# Send HTTP GET request\nresponse = requests.get(url)\n\n# Check if the request was successful\nif response.status_code == 200:\n# Get and return the weather data\ndata = response.json()\nreturn data\nelse:\n# Return an error message\nreturn \"Error fetching weather data\""
                }
            },
            "error": false,
            "status": 400,
            "model_id": test_generator.model,
            "prompt_id": test_generator.id,
            "organization_id": test_generator.organization_id,
            "duration": getRandomFloat(4.50)
        };
        await logs.createLog(log2, organization_id);

    //loop 100 times to create logs
    for(let i=0; i<2; i++) {
        let log = {
            "message": "test data",
            "error": false,
            "status": getRandomStatus(),
            "model_id": python_generator.model,
            "prompt_id": python_generator.id,
            "organization_id": python_generator.organization_id,
            "duration": getRandomFloat(3.50)
        };
        await logs.createLog(log, organization_id);
        let log2 = {
            "message": "test data",
            "error": false,
            "status": getRandomStatus(),
            "model_id": test_generator.model,
            "prompt_id": test_generator.id,
            "organization_id": test_generator.organization_id,
            "duration": getRandomFloat(4.50)
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


}

const checkAuth = async function(req:any, res:any, next:any) {

    const shouldSetup = await checkIfFirstRun()
    if(shouldSetup) {
        return res.redirect('/auth/setup');
    }

    let token_cookie = req.cookies.token;
    let organization_id_cookie = req.cookies.organization;

    let isAuthenticated = await isAuthenticatedSession(organization_id_cookie, token_cookie);

    if(!isAuthenticated) {
        return res.redirect('/auth/login');
    }

    if(req.path.startsWith("/auth")) {
        return res.redirect('/prompts');
    }

    next();

}

const isAuthenticatedSession = async function(organization_id_cookie:any, token_cookie:any) {

    if(token_cookie == undefined || organization_id_cookie == undefined) {
        return false;
    }

    let organization = await organization_db.getOrganizationById(organization_id_cookie);
    if(organization == undefined) {
        return false
    }

    //check if any key in keys in organization matches token
    let isTokenValid = false;
    for(let i=0; i<organization.keys.length; i++) {
        if(organization.keys[i].key == token_cookie) {
            isTokenValid = true;
        }
    }

    if(!isTokenValid) {
        return false;
    }

    return true;

}

export { authenticate, checkAuth }