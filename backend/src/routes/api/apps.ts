import express, { Request, Response } from "express";
import { Prompt, Organization } from "../../models/allModels";
import request from "supertest"

const router = express.Router();
const prompt_db = new Prompt();
const organization_db = new Organization();

router.get("/apps/:id", async (req: Request, res: Response) => {

  //get appId from request
  const appId = req.params.id;

  const prompt = await prompt_db.findPromptByAppId(appId);
  
  if(!prompt){
    return res.status(404).json({message: "Prompt not found!"});
  }

  res.status(200).json(prompt);

});

router.post("/apps/:id", async (req: Request, res: Response) => {

  const client = request(req.app);
  const appId = req.params.id;
  const data = req.body;

  let prompt = await prompt_db.findPromptByAppId(appId, true);
  if(!prompt){
    return res.status(404).json({message: "Prompt not found!"});
  }

  const organization = await organization_db.getOrganizationById(prompt.organization_id);
  
  prompt.prompt_variables = data.prompt_variables
  prompt = JSON.parse(JSON.stringify(prompt));

  req.url = '/api/generate'

  let response = await client.post("/api/generate").send(prompt).set("Authorization", "Bearer " + organization.keys[0].key);

  res.status(response.status).json({
    message:response.body.message,
    error: response.body.error,
  });

});

export default router;