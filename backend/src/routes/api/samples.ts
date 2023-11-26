import express, { Request, Response } from 'express';
import { Sample } from '../../models/allModels';
import {sampleSchema} from "@/models/mongodb/sample";

const router = express.Router();
const sample_db = new Sample()

router.get('/samples', async (req: Request, res: Response) => {

  const organization = (req as any).organization;
  const page: number = parseInt(req.query.page as string) || 1;
  const limit: number = parseInt(req.query.limit as string) || 10;
  const prompt_id: string = req.query.prompt_id as string;

  try {
    const samples = await sample_db.getSamples(page, limit, organization.id, prompt_id);
    res.status(200).json(samples);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.patch('/samples/:id', async (req, res) => {
  const organization = (req as any).organization;
  const sampleJson = req.body;
  const id = req.params.id;
  await sample_db.patchSample(id, sampleJson, organization.id);
  res.status(200).json({});
});

router.delete('/samples/:id', async (req, res) => {
  const organization = (req as any).organization;
  await sample_db.deleteSample(req.params.id, organization.id);
  res.status(200).json({ id: req.params.id });
});

export default router;
