const bcrypt = require("bcryptjs");
const saltRounds = 10;

import cookieParser from "cookie-parser";
import { Organization, Model, Prompt, Variable } from "../models/allModels";
import { User } from "../models/mongodb/user";
import { Log } from "../models/mongodb/log";
var figlet = require("figlet");
import { rateLimit } from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});

var organization_db = new Organization();
var user_db = new User();
var model: any = new Model();
var prompt: any = new Prompt();
var variable: any = new Variable();
var organization: any = new Organization();
var logs: any = new Log();

var fs = require("fs");
var path = require("path");
import {
  checkIfFirstRun,
  generateInitialOrganization,
  automaticTestEnvironmentSetup,
} from "./inititialize";

const authenticate = async function (app: any) {
  app.use(cookieParser());

  app.get(["/setup.html", "/login.html"], async (req: any, res: any) => {
    return res.redirect("/auth/login");
  });

  app.get(["/auth/setup"], async (req: any, res: any) => {
    const shouldSetup = await checkIfFirstRun();
    if (shouldSetup) {
      return res.sendFile(path.join(__dirname, "../../public/setup.html"));
    }

    return res.redirect("/auth/login");
  });

  app.get(["/auth/login"], async (req: any, res: any) => {
    const shouldSetup = await checkIfFirstRun();
    if (shouldSetup) {
      return res.redirect("/auth/setup");
    }

    let token_cookie = req.cookies.token;
    let organization_id_cookie = req.cookies.organization;

    let isAuthenticated = await isAuthenticatedSession(
      organization_id_cookie,
      token_cookie,
    );

    if (isAuthenticated) {
      return res.redirect("/");
    }

    res.sendFile(path.join(__dirname, "../../public/login.html"));
  });

  // req.isAuthenticated is provided from the auth router
  app.post("/auth/setup", async (req: any, res: any) => {
    let body = req.body;

    //validate email, password and  openai_api_key - make sure they are not empty
    if (body.email == undefined || body.email == "") {
      return res
        .status(400)
        .json({ error: true, message: "Email cannot be empty." });
    }

    if (body.password == undefined || body.password == "") {
      return res
        .status(400)
        .json({ error: true, message: "Password cannot be empty." });
    }

    if (body.openai_api_key == undefined || body.openai_api_key == "") {
      return res
        .status(400)
        .json({ error: true, message: "OpenAI API key cannot be empty." });
    }

    //check if email already exists
    let existing_user = await user_db.findUser(body.email);

    if (existing_user != undefined) {
      return res
        .status(400)
        .json({ error: true, message: "Email already exists." });
    }

    const shouldSetup = await checkIfFirstRun();
    if (!shouldSetup) {
      return res
        .status(400)
        .json({ error: true, message: "Organization already exists." });
    }

    await generateInitialOrganization(body);

    return res.status(200).json({ message: "Setup successful." });
  });

  app.post("/auth/login", limiter, async (req: any, res: any) => {
    try {
      let body = req.body;
      let user = await user_db.findUser(body.email);
      if (user == undefined) {
        return res
          .status(400)
          .json({ error: true, message: "Wrong email or password." });
      }
      let match = await bcrypt.compare(body.password, user.password);
      if (match) {
        let organization = await organization_db.getOrganizationById(
          user.organization_id,
        );
        let token = organization.keys[0].key;
        let expiry = 60 * 1000 * 60 * 24 * 30;
        res.cookie("token", token, { maxAge: expiry, httpOnly: false });
        res.cookie("organization", organization.id, {
          maxAge: expiry,
          httpOnly: false,
        });
        return res
          .status(200)
          .json({ error: false, message: "Login successful." });
      }
      return res
        .status(400)
        .json({ error: true, message: "Wrong email or password." });
    } catch (error) {
      return res
        .status(400)
        .json({ error: true, message: "Wrong email or password." });
    }
  });

  app.get(["/logout", "/auth/logout"], async (req: any, res: any) => {
    res.clearCookie("token");
    res.clearCookie("organization");
    res.redirect("/auth/login");
  });

  await automaticTestEnvironmentSetup();

  figlet("PromptDesk OS", function (err: any, data: any) {
    if (err) {
      console.log("Something went wrong...");
      console.dir(err);
      return;
    }
    setTimeout(() => {
      console.log(data);
    }, 2000);
  });
};

const checkAuth = async function (req: any, res: any, next: any) {
  //get path
  let path = req.path;

  //ignore all files with non api prefix
  if (req.path.startsWith("/api")) {
    return next();
  }

  //ignore all files with extensions
  if (req.path.includes(".")) {
    return next();
  }

  const shouldSetup = await checkIfFirstRun();
  if (shouldSetup) {
    return res.redirect("/auth/setup");
  }

  let token_cookie = req.cookies.token;
  let organization_id_cookie = req.cookies.organization;

  let isAuthenticated = await isAuthenticatedSession(
    organization_id_cookie,
    token_cookie,
  );

  if (!isAuthenticated) {
    return res.redirect("/auth/login");
  }

  if (req.path.startsWith("/auth")) {
    return res.redirect("/prompts");
  }

  console.log("checkAuth DONE!");
  next();
};

const isAuthenticatedSession = async function (
  organization_id_cookie: any,
  token_cookie: any,
) {
  if (token_cookie == undefined || organization_id_cookie == undefined) {
    return false;
  }

  let organization = await organization_db.getOrganizationById(
    organization_id_cookie,
  );
  if (organization == undefined) {
    return false;
  }

  //check if any key in keys in organization matches token
  let isTokenValid = false;
  for (let i = 0; i < organization.keys.length; i++) {
    if (organization.keys[i].key == token_cookie) {
      isTokenValid = true;
    }
  }

  if (!isTokenValid) {
    return false;
  }

  return true;
};

export { authenticate, checkAuth };
