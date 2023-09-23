import express, { Request, Response } from 'express';
import { Log } from '../../models/allModels';

const router = express.Router();
const log_db = new Log();

router.get('/logs', async (req: Request, res: Response) => {
  const page: number = parseInt(req.query.page as string) || 1;
  const limit: number = parseInt(req.query.limit as string) || 10;

  try {
    const logs = await log_db.getLogs(page, limit);
    res.status(200).json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/logs', async (req: Request, res: Response) => {
  const logData = req.body;

  try {
    const logId = await log_db.createLog(logData);
    res.status(201).json({ id: logId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/logs/:id', async (req: Request, res: Response) => {
  const logId: string = req.params.id;

  try {
    const logJson = await log_db.findLog(logId);
    if (!logJson) {
      return res.status(404).json({ message: 'Log not found' });
    }
    res.status(200).json(logJson);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
