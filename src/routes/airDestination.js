// backend/routes/airDestination.js
import express from 'express';
import {
  createDestination,
  getAllDestinations,
  updateDestination,
  deleteDestination
} from '../controllers/airDestinationController.js';

const router = express.Router();

router.post('/createDestination', createDestination);
router.get('/getAllDestinations', getAllDestinations);
router.put('/updateDestination/:id', updateDestination);
router.delete('/deleteDestination/:id', deleteDestination);

export default router;