// backend/routes/exportJobRoutes.js
import express from 'express';
import {
  getAllExportJobs,
  createExportJob,
  updateExportJob
} from '../controllers/exportJobController.js';

const router = express.Router();

router.get('/getAllExportJobs', getAllExportJobs);
router.post('/createExportJob', createExportJob);
router.put('/updateExportJob/:id', updateExportJob);

export default router;