import express from 'express';
import { getDashboardStats, getCanadaDashboardStats } from '../controllers/statsController.js';
// import { protect } from '../middleware/authMiddleware.js'; // If you have auth

const router = express.Router();

router.get('/dashboard', getDashboardStats);
router.get('/canada-dashboard', getCanadaDashboardStats);

export default router;
