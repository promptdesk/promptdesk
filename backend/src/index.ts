import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

//get NODE_ENV variable
var environment = process.env.NODE_ENV;

if(environment == 'development') {
  console.log("INFO :: DEVELOPMENT ENVIRONMENT")
  dotenv.config({path:'../.env.development.local'})
  console.log(process.env.MONGODB_URI)

} else {
  console.log("INFO :: PRODUCTION ENVIRONMENT")
  dotenv.config({path:'../.env'})
  console.log(process.env.MONGODB_URI)
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

// heartbeat route
app.get('/ping', (req, res) => {
  return res.send('pong');
});

// use json for API routes
app.use(express.json());
app.use(cors());

app.use('/api', magicRouter);
app.use('/api', promptsRouter);
app.use('/api', logsRouter);
app.use('/api', modelsRouter);
app.use('/api', variablesRouter);

app.listen(port, () => {
    console.log('INFO :: SERVER RUNNING ON PORT ' + port)
});

setup();

export default app;