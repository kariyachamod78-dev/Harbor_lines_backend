import express from 'express';
import { createCanadaBilling, getCanadaBillings, getCanadaBillingById, saveConsigneeBillings } from '../controllers/billingController.js';

const router = express.Router();

router.post('/canada/create', createCanadaBilling);
router.get('/canada/list', getCanadaBillings);
router.get('/canada/detail/:id', getCanadaBillingById);
router.post('/canada/save-refs', saveConsigneeBillings);

export default router;
