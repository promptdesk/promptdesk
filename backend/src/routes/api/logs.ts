import express, { Request, Response } from "express";
import { Log } from "../../models/allModels";

const router = express.Router();
const log_db = new Log();

async function hellop() {
  const response = await log_db.getLogDetails("65558a1a0393ceadb2c91624");
}

router.get("/logs", async (req: Request, res: Response) => {
  const organization = (req as any).organization;
  const page: number = parseInt(req.query.page as string) || 1;
  const limit: number = parseInt(req.query.limit as string) || 10;
  const model_id: string = req.query.model_id as string;
  const prompt_id: string = req.query.prompt_id as string;
  const status: number = parseInt(req.query.status as string);

  try {
    const logs = await log_db.getLogs(
      page,
      limit,
      organization.id,
      prompt_id,
      model_id,
      status,
    );
    res.status(200).json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/logs/details", async (req: Request, res: Response) => {
  const organization = (req as any).organization;

  try {
    const stats = await log_db.getLogDetails(organization.id);
    res.status(200).json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/logs", async (req: Request, res: Response) => {
  const organization = (req as any).organization;
  const logData = req.body;

  try {
    const logId = await log_db.createLog(logData, organization.id);
    res.status(201).json({ id: logId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/logs/:id", async (req: Request, res: Response) => {
  const organization = (req as any).organization;
  const logId: string = req.params.id;

  try {
    const logJson = await log_db.findLog(logId, organization.id);
    if (!logJson) {
      return res.status(404).json({ message: "Log not found" });
    }
    res.status(200).json(logJson);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
