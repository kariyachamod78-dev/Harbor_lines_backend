// backend/routes/uom.js
import express from 'express';
import {
  createUOM,
  getAllUOMs,
  updateUOM,
  deleteUOM
} from '../controllers/uomController.js';

const router = express.Router();

router.post('/createUOM', createUOM);
router.get('/getAllUOMs', getAllUOMs);
router.put('/updateUOM/:id', updateUOM);
router.delete('/deleteUOM/:id', deleteUOM);

export default router;