// backend/routes/airImportJobRoutes.js
import express from 'express';
import {
  createAirImportJob,
  getAllAirImportJobs,
  updateAirImportJob
} from '../controllers/airImportJobController.js';

const router = express.Router();

router.post('/createJob', createAirImportJob);
router.get('/getAllJobs', getAllAirImportJobs);
router.put('/updateJob/:id', updateAirImportJob);

export default router;