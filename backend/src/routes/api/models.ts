import express, { Request, Response } from 'express';
 
import { Model } from '../../models/allModels';

const router = express.Router();
const model_db = new Model()

router.get('/models', async (req: Request, res: Response) => {
  const modelList = await model_db.listModels();
  res.status(200).json(modelList);
});

router.post('/model', async (req: Request, res: Response) => {
  const modelJson = req.body;
  const modelId = await model_db.createModel(modelJson);
  res.status(201).json({ id: modelId });
});

router.get('/model/:id', async (req: Request, res: Response) => {
  const modelJson = await model_db.findModel(req.params.id);
  if (!modelJson) {
    return res.status(404).json({ message: 'Model not found' });
  }
  res.status(200).json(modelJson);
});

router.put('/model/:id', async (req: Request, res: Response) => {
  const modelJson = req.body;
  await model_db.updateModelById(modelJson);
  res.status(200).json(modelJson);
});

router.delete('/model/:id', async (req: Request, res: Response) => {
  await model_db.deleteModel(req.params.id);
  res.status(200).json({ id: req.params.id });
});

export default router;
