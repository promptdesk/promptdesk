const bcrypt = require('bcryptjs');
const saltRounds = 10;
const figlet = require('figlet');

import cookieParser from 'cookie-parser';
import { Organization, Model, Prompt, Variable } from "../models/allModels";
import { User } from "../models/mongodb/user";

var organization_db = new Organization();
var user_db = new User();
var model:any = new Model();
var prompt:any = new Prompt();
var variable:any = new Variable();
var organization:any = new Organization();

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
    var data = [{ "name": "OPEN_AI_KEY", "value": open_ai_key }];
    await variable.createVariables(data, organization_id);

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
    await prompt.createPrompt(prompt_obj, organization_id)
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