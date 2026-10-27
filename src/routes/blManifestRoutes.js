// backend/routes/blManifestRoutes.js
import express from 'express';
import { 
  createBLManifestJob, 
  uploadBLManifestEntries, 
  getAllBLManifestJobs,
  getVesselsForBL,
  updateBLManifestJob
} from '../controllers/blManifestController.js';

const router = express.Router();

router.post('/create-job', createBLManifestJob);
router.post('/upload-entries/:jobId', uploadBLManifestEntries);
router.get('/jobs', getAllBLManifestJobs);
router.get('/vessels', getVesselsForBL);
router.put('/update/:jobId', updateBLManifestJob);

export default router;
