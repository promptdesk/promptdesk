import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

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
app.get('/api/ping', (req, res) => {
  return res.send('pong');
});

app.use('/api', magicRouter);
app.use('/api', promptsRouter);
app.use('/api', logsRouter);
app.use('/api', modelsRouter);
app.use('/api', variablesRouter);

app.all('/api/*', (req, res) => {
  return res.status(404).send({message: 'Not found'});
})

//serve static files
app.use(express.static('./dist'))

//serve prompts page
app.get('/prompts', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/prompts.html'));
});

//redirect all other routes to prompts page - main entry point
app.get(['/', '/*'], (req, res) => {
  res.redirect('/prompts');
});

app.listen(port, () => {
    console.log('INFO :: INTERNAL SERVER RUNNING ON PORT ' + port)
    console.log('INFO :: EXTERNAL SERVER RUNNING ON ' + process.env.PROMPT_SERVER_URL)
});

setup();

export default app;