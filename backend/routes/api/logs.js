import express from 'express';
import { Log } from '../../models/allModels.js';

const router = express.Router();
const log_db = new Log();

router.get('/logs', async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;

  try {
    console.log(req.query)
    const logs = await log_db.getLogs(page, limit);
    res.status(200).json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/logs', async (req, res) => {
  const logData = req.body;

  try {
    const logId = await log_db.createLog(logData);
    res.status(201).json({ id: logId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/logs/:id', async (req, res) => {
  const logId = req.params.id;

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