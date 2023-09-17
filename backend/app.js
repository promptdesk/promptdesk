import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import modelsRouter from './routes/api/models.js';
import promptsRouter from './routes/api/prompts.js';
import magicRouter from './routes/api/magic.js';

dotenv.config({path:'../.env'})
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Port configuration
const port = process.env.PROMPT_SERVER_PORT || 4000;

// Root Router
app.get('/', (req, res) => {
  return res.send('Hello, World!');
});

// API Routers
app.use('/api', modelsRouter);
app.use('/api', magicRouter);
app.use('/api', promptsRouter);

//route all routes to 

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Export app for testing
export default app;