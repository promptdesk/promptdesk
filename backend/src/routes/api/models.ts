import express, { Request, Response } from 'express';

import { Model } from '../../models/allModels';

const router = express.Router();
const model_db = new Model()

router.get('/models', async (req: Request, res: Response) => {
  try {
    const organization = (req as any).organization;
    const modelList = await model_db.listModels(organization.id);
    res.status(200).json(modelList);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/model', async (req: Request, res: Response) => {
  try {
    const organization = (req as any).organization;
    const modelJson = req.body;
    const modelId = await model_db.createModel(modelJson, organization.id);
    res.status(201).json({ id: modelId });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/model/:id', async (req: Request, res: Response) => {
  try {
    const organization = (req as any).organization;
    const modelJson = await model_db.findModel(req.params.id, organization.id);
    if (!modelJson) {
      return res.status(404).json({ message: 'Model not found' });
    }
    res.status(200).json(modelJson);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/model/:id', async (req: Request, res: Response) => {
  try {
    const organization = (req as any).organization;
    const modelJson = req.body;
    await model_db.updateModelById(modelJson, organization.id);
    res.status(200).json(modelJson);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/model/:id', async (req: Request, res: Response) => {
  try {
    const organization = (req as any).organization;
    await model_db.deleteModel(req.params.id, organization.id);
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;