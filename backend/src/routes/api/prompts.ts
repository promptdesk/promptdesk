import express from 'express';
import { Prompt } from '../../models/allModels';

const router = express.Router();
const prompt_db = new Prompt();

router.get('/prompts', async (req, res) => {
  const organization = (req as any).organization;
  const promptList = await prompt_db.listPrompts(organization.id);
  res.status(200).json(promptList);
});

router.post('/prompt', async (req, res) => {
  const organization = (req as any).organization;
  var promptJson = req.body;
  promptJson['id'] = undefined;
  const promptId = await prompt_db.createPrompt(promptJson, organization.id);
  res.status(201).json({ id: promptId });
});

router.get('/prompt/:id', async (req, res) => {
  const organization = (req as any).organization;
  const promptJson = await prompt_db.findPrompt(req.params.id, organization.id);
  if (!promptJson) {
    return res.status(404).json({ message: 'Prompt not found' });
  }
  res.status(200).json(promptJson);
});

router.put('/prompt/:id', async (req, res) => {
  const organization = (req as any).organization;
  const promptJson = req.body;
  prompt_db.updatePrompt(promptJson, organization.id);
  res.status(200).json(promptJson);
});

router.delete('/prompt/:id', async (req, res) => {
  const organization = (req as any).organization;
  await prompt_db.deletePrompt(req.params.id, organization.id);
  res.status(200).json({ id: req.params.id });
});

export default router;