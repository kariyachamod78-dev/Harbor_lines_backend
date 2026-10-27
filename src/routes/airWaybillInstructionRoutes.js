import express from 'express';
import { createInstruction, getInstructionById, getAllInstructions, generateAWBPDF } from '../controllers/airWaybillInstructionController.js';

const router = express.Router();

router.post('/create', createInstruction);
router.get('/getAll', getAllInstructions);
router.get('/get/:id', getInstructionById);
router.get('/print-pdf/:id', generateAWBPDF);

export default router;
