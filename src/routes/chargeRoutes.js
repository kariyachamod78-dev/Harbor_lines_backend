import express from 'express';
import { createCharge, getAllCharges, updateCharge } from '../controllers/chargeController.js';

const router = express.Router();

router.post('/createCharge', createCharge);
router.get('/getAllCharges', getAllCharges);
router.put('/updateCharge/:id', updateCharge);

export default router;