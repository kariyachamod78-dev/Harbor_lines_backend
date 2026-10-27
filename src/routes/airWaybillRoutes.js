// backend/routes/airWaybillRoutes.js
import express from 'express';
import {
  createAirWaybill,
  getAllAirWaybills
} from '../controllers/airWaybillController.js';

const router = express.Router();

router.post('/create', createAirWaybill);
router.get('/getAll', getAllAirWaybills);

export default router;