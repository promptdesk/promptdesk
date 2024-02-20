import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import path from "path";
import { apiKeyMiddleware } from "./utils/authorization";
import fs from "fs";

var environment = process.env.NODE_ENV;

console.log("INFO :: ENVIRONMENT", environment);

if (environment == "development") {
  console.log("INFO :: DEVELOPMENT ENVIRONMENT");
  dotenv.config({ path: "../.env" });
}
if (environment == "test") {
  console.log("INFO :: TEST ENVIRONMENT");
  dotenv.config({ path: "../.env" });
}
if (environment == "production") {
  console.log("INFO :: PRODUCTION ENVIRONMENT");
  dotenv.config({ path: "../.env.production.local" });
}

const app = express();

import modelsRouter from "./routes/api/models";
import promptsRouter from "./routes/api/prompts";
import generateRouter from "./routes/api/generate";
import samplesRouter from "./routes/api/samples";
import logsRouter from "./routes/api/logs";
import variablesRouter from "./routes/api/variables";
import organizationRouter from "./routes/api/organization";

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Port configuration*/
const port = process.env.PROMPT_SERVER_PORT || 4000;

// use json for API routes
app.use(express.json());
app.use(cors());

// heartbeat route
app.get(["/api/ping", "/ping"], (req, res) => {
  return res.send("pong");
});

app.use("/api", apiKeyMiddleware);

app.use("/api", generateRouter);
app.use("/api", samplesRouter);
app.use("/api", promptsRouter);
app.use("/api", logsRouter);
app.use("/api", modelsRouter);
app.use("/api", variablesRouter);
app.use("/api", organizationRouter);

app.all("/api/*", (req, res) => {
  return res.status(404).send({ error: true, message: "API not found!" });
});

app.use(express.static("./assets"));

import { authenticate, checkAuth } from "./utils/publicAuth";
authenticate(app);
app.use(checkAuth);

app.get(["/", "/prompts/:path(*)"], (req, res) => {
  if (!fs.existsSync(path.join(__dirname, "../dist/index.html"))) {
    return res.end(
      "You must build the frontend first. Run 'npm run build' in the frontend directory.",
    );
  }
  return res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.get(["/workspace/:id"], (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/workspace/[id].html"));
});

app.get(["/workspace/:id/samples"], (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/workspace/[id]/samples.html"));
});

app.get(["/models/:id"], (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/models/[id].html"));
});

app.get(["/logs/:id"], (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/logs/[id].html"));
});

app.get(["/:filename"], (req, res) => {
  var filename = req.params.filename;
  var filePath = path.join(__dirname, "../dist", filename + ".html");

  res.sendFile(filePath, (err) => {
    if (err) {
      res.sendFile(path.join(__dirname, "../public/404.html"));
    }
  });
});

app.use(express.static("./public"));
app.use(express.static("./dist"));

//redirect all other routes to prompts page - main entry point
app.get(["/*"], (req, res) => {
  res.sendFile(path.join(__dirname, "../public/404.html"));
});

app.listen(port, () => {
  console.log("INFO :: INTERNAL SERVER RUNNING ON PORT " + port);
  console.log(
    "INFO :: EXTERNAL SERVER RUNNING ON " + process.env.PROMPT_SERVER_URL,
  );
});

export default app;
