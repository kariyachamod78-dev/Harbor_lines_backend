import express from 'express';
import { registerAdmin, loginUser, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', registerAdmin);  // ← Use this ONCE to create Admin
router.post('/login', loginUser);
router.get('/me', protect, getMe);

export default router;