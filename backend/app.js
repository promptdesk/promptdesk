import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import modelsRouter from './routes/api/models.js';
import promptsRouter from './routes/api/prompts.js';
import magicRouter from './routes/api/magic.js';

dotenv.config();
const app = express();

console.log(dotenv.config()['parsed'])

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Port configuration
const port = process.env.PORT || 4000;

// Root Router
app.get('/', (req, res) => {
  return res.send('Hello, World!');
});

// API Routers
app.use('/api', modelsRouter);
app.use('/api', magicRouter);
app.use('/api', promptsRouter);

// Start the server
app.listen(port, () => {
  //console.log(`Server is running on port ${port}`);
});

// Export app for testing
export default app;