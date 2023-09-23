import express, { Request, Response } from 'express';
import { Variable } from '../../models/allModels';

const router = express.Router();
const variable_db = new Variable();

// Update a Variable by ID
router.put('/variables', async (req: Request, res: Response) => {
  const variableId: string = req.params.id;
  const data_list = req.body;

  try {
    await variable_db.updateVariables(data_list);
    res.status(200).json({ message: 'Variable updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }

});

// Get a Variable by ID
router.get('/variables', async (req: Request, res: Response) => {

  try {
    const variableData = await variable_db.getVariables();
    if (!variableData) {
      return res.status(404).json({ message: 'Variable not found' });
    }
    res.status(200).json(variableData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;