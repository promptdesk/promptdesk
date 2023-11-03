import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { apiKeyMiddleware, frontendAuthMiddleware } from './utils/authorization';
import cookieParser from 'cookie-parser';

//import basicAuth from 'express-basic-auth';

//get NODE_ENV variable
var environment = process.env.NODE_ENV;

if(environment == 'development') {
  console.log("INFO :: DEVELOPMENT ENVIRONMENT")
  dotenv.config({path:'../.env.development.local'})
}
if(environment == 'production') {
  console.log("INFO :: PRODUCTION ENVIRONMENT")
  dotenv.config({path:'../.env.production.local'})
}

import setup from './init/first_run_setup';

const app = express();

import './models/allModels';

import modelsRouter from './routes/api/models';
import promptsRouter from './routes/api/prompts';
import magicRouter from './routes/api/magic';
import logsRouter from './routes/api/logs';
import variablesRouter from './routes/api/variables';
import organizationRouter from './routes/api/organization';

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
app.get(['/api/ping', '/ping'], (req, res) => {
  return res.send('pong');
});

app.use('/api', apiKeyMiddleware);

app.use('/api', magicRouter);
app.use('/api', promptsRouter);
app.use('/api', logsRouter);
app.use('/api', modelsRouter);
app.use('/api', variablesRouter);
app.use('/api', organizationRouter);

app.all('/api/*', (req, res) => {
  return res.status(404).send({error: 'Not found'});
})

app.use('/*', frontendAuthMiddleware)

//serve static files
app.use(express.static('./dist'))

app.get(['/',], (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.get(['/workspace/*'], (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/workspace/[id].html'));
});

app.get(['/:filename'], (req, res) => {
  var filename = req.params.filename;
  try {
    res.sendFile(path.join(__dirname, '../dist/' + filename + '.html'));
  } catch (error) {
    res.sendFile(path.join(__dirname, '../dist/404.html'));
  }
});

//redirect all other routes to prompts page - main entry point
app.get(['/*'], (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/404.html'));
});

app.listen(port, () => {
    console.log('INFO :: INTERNAL SERVER RUNNING ON PORT ' + port)
    console.log('INFO :: EXTERNAL SERVER RUNNING ON ' + process.env.PROMPT_SERVER_URL)
});

setup();

export default app;