// backend/routes/vessel.js
import express from 'express';
import {
  createVessel,
  getAllVessels,
  updateVessel,
  deleteVessel
} from '../controllers/vesselController.js';

const router = express.Router();


router.post('/createVessel', createVessel);
router.get('/getAllVessels', getAllVessels);
router.put('/updateVessel/:id', updateVessel);
router.delete('/deleteVessel/:id', deleteVessel);

export default router;