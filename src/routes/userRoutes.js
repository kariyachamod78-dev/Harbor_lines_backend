// backend/routes/userRoutes.js
import express from 'express';
import {
  createUser,
  getAllUsers,
  updateUser
} from '../controllers/userController.js';

const router = express.Router();

router.post('/createUser', createUser);
router.get('/getAllUsers', getAllUsers);
router.put('/updateUser/:id', updateUser);

export default router;