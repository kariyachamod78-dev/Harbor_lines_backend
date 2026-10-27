// backend/routes/bank.js
import express from 'express';
import {
  createBank,
  getAllBanks,
  updateBank,
  deleteBank
} from '../controllers/bankController.js';

const router = express.Router();

router.post('/createBank', createBank);
router.get('/getAllBanks', getAllBanks);
router.put('/updateBank/:id', updateBank);
router.delete('/deleteBank/:id', deleteBank);

export default router;