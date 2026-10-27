// backend/routes/seaImportJob.js
import express from 'express';
import {
  createJob,
  getAllJobs,
  updateJob
} from '../controllers/seaImportJobController.js';

const router = express.Router();

router.post('/createJob', createJob);
router.get('/getAllJobs', getAllJobs);
router.put('/updateJob/:id', updateJob);

export default router;