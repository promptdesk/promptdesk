import express from 'express';
import Model from '../../models/local/model.js';

const router = express.Router();
const model_db = new Model();

router.get('/models', (req, res) => {
  const modelList = model_db.listModels();
  res.status(200).json(modelList);
});

router.post('/model', (req, res) => {
  const modelJson = req.body;
  const modelId = model_db.createModel(modelJson);
  res.status(201).json({ id: modelId });
});

router.get('/model/:id', (req, res) => {
  const modelJson = model_db.findModel(req.params.id);
  if (!modelJson) {
    return res.status(404).json({ message: 'Model not found' });
  }
  res.status(200).json(modelJson);
});

router.put('/model/:id', (req, res) => {
  const modelJson = req.body;
  model_db.updateModelById(modelJson);
  res.status(200).json(modelJson);
});

router.delete('/model/:id', (req, res) => {
  model_db.deleteModel(req.params.id);
  res.status(200).json({ id: req.params.id });
});

// Add more routes here...

export default router;