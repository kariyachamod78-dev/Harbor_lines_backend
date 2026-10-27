// backend/routes/canadaRoutes.js
import express from 'express';
import { createManifest, getAllManifests, updateHBLCharges, updateHBL, searchVessels, createVessel, searchPorts, createPort } from '../controllers/canadaController.js';

const router = express.Router();

router.post('/createManifest', createManifest);
router.get('/getAllManifests', getAllManifests);
router.put('/updateHBLCharges/:manifestId/:hblNumber', updateHBLCharges);
router.put('/updateHBL/:manifestId/:hblId', updateHBL);

// Vessel Routes
router.get('/vessels/search', searchVessels);
router.post('/vessels/create', createVessel);

// Port Routes
router.get('/ports/search', searchPorts);
router.post('/ports/create', createPort);

export default router;