import express from 'express';
import Prompt from '../../models/local/prompt.js';

const router = express.Router();
const prompt_db = new Prompt();

router.get('/prompts', (req, res) => {
  const promptList = prompt_db.listPrompts();
  res.status(200).json(promptList);
});

router.post('/prompt', (req, res) => {
  var promptJson = req.body;
  promptJson['id'] = undefined;
  const promptId = prompt_db.createPrompt(promptJson);
  res.status(201).json({ id: promptId });
});

router.get('/prompt/:id', (req, res) => {
  const promptJson = prompt_db.findPrompt(req.params.id);
  if (!promptJson) {
    return res.status(404).json({ message: 'Prompt not found' });
  }
  res.status(200).json(promptJson);
});

router.put('/prompt/:id', (req, res) => {
  const promptJson = req.body;
  prompt_db.updatePromptById(promptJson);
  res.status(200).json(promptJson);
});

router.delete('/prompt/:id', (req, res) => {
  prompt_db.deletePrompt(req.params.id);
  res.status(200).json({ id: req.params.id });
});

export default router;