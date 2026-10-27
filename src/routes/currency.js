// backend/routes/currency.js
import express from 'express';
import {
  createCurrency,
  getAllCurrencies,
  updateCurrency,
  deleteCurrency
} from '../controllers/currencyController.js';

const router = express.Router();

router.post('/createCurrency', createCurrency);
router.get('/getAllCurrencies', getAllCurrencies);
router.put('/updateCurrency/:id', updateCurrency);
router.delete('/deleteCurrency/:id', deleteCurrency);

export default router;