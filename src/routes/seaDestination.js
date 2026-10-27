// backend/routes/seaDestination.js
import express from 'express';
import {
  createDestination,
  getAllDestinations,
  updateDestination,
  deleteDestination
} from '../controllers/seaDestinationController.js';

const router = express.Router();

router.post('/createDestination', createDestination);
router.get('/getAllDestinations', getAllDestinations);
router.put('/updateDestination/:id', updateDestination);
router.delete('/deleteDestination/:id', deleteDestination);

export default router;