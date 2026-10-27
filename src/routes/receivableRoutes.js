// backend/routes/receivableRoutes.js
import express from 'express';
import { createReceipt } from '../controllers/receivableController.js';
import multer from 'multer'; // MUST be here

const upload = multer({ storage: multer.memoryStorage() }); 

const router = express.Router();

// Apply multer ONLY to this POST route
router.post('/createReceipt', upload.single('document'), createReceipt);

export default router;