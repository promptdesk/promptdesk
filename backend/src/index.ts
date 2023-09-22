import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config({path:'../.env'})
const app = express();

import './models/allModels';

import modelsRouter from './routes/api/models';
import promptsRouter from './routes/api/prompts';
import magicRouter from './routes/api/magic';
import logsRouter from './routes/api/logs';

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

app.listen(port, () => {
    console.log('INFO :: Webserver started on port ' + port)
});

export default app;