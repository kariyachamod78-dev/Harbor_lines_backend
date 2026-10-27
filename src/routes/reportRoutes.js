
import express from 'express';
import { getReportUrl, getAllReports } from '../controllers/reportController.js';

const router = express.Router();

router.get('/getAllReports', getAllReports);
router.get('/:code', getReportUrl);

export default router;
