// backend/routes/payable.js
import express from 'express';
import { createPayable, getAllPayables } from '../controllers/payableController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/create', protect, createPayable);
router.get('/all', protect, getAllPayables);

export default router;
