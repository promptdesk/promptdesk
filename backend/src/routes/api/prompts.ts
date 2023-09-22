import express from 'express';
import { Prompt } from '../../models/allModels';

const router = express.Router();
const prompt_db = new Prompt();

router.get('/prompts', async (req, res) => {
  console.log(prompt_db)
  const promptList = await prompt_db.listPrompts();
  console.log(promptList)
  res.status(200).json(promptList);
});

router.post('/prompt', async (req, res) => {
  var promptJson = req.body;
  promptJson['id'] = undefined;
  const promptId = await prompt_db.createPrompt(promptJson);
  res.status(201).json({ id: promptId });
});

router.get('/prompt/:id', async (req, res) => {
  const promptJson = await prompt_db.findPrompt(req.params.id);
  if (!promptJson) {
    return res.status(404).json({ message: 'Prompt not found' });
  }
  res.status(200).json(promptJson);
});

router.put('/prompt/:id', async (req, res) => {
  const promptJson = req.body;
  prompt_db.updatePromptById(promptJson);
  res.status(200).json(promptJson);
});

router.delete('/prompt/:id', async (req, res) => {
  await prompt_db.deletePrompt(req.params.id);
  res.status(200).json({ id: req.params.id });
});

export default router;