// backend/routes/tax.js
import express from 'express';
import {
  createTax,
  getAllTaxes,
  updateTax,
  deleteTax
} from '../controllers/taxController.js';

const router = express.Router();

router.post('/createTax', createTax);
router.get('/getAllTaxes', getAllTaxes);
router.put('/updateTax/:id', updateTax);
router.delete('/deleteTax/:id', deleteTax);

export default router;