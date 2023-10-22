import express, { Request, Response } from 'express';
import { Organization } from '../../models/allModels';

const router = express.Router();
const organization_db = new Organization();

// Add a new Organization with a random name
router.post('/organizations', async (req: Request, res: Response) => {

  try {
    const organization = await organization_db.addOrganization();
    res.status(201).json({ message: 'Organization added successfully', id: organization.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }

});

router.get('/organization', async (req: Request, res: Response) => {
    const organization = (req as any).organization;
    try {
      const organization_obj = await organization_db.getOrganizationById(organization.id);
      res.status(200).json(organization_obj);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  
});

router.delete('/organization/:id', async (req: Request, res: Response) => {

  const organizationId: string = req.params.id;

  try {
    const id = await organization_db.removeOrganization(organizationId);
    res.status(200).json({ message: 'Organization deleted successfully', id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }

})

export default router;