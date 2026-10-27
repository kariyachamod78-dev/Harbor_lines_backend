// backend/routes/flight.js
import express from 'express';
import {
  createFlight,
  getAllFlights,
  updateFlight,
  deleteFlight
} from '../controllers/flightController.js';

const router = express.Router();

router.post('/createFlight', createFlight);
router.get('/getAllFlights', getAllFlights);
router.put('/updateFlight/:id', updateFlight);
router.delete('/deleteFlight/:id', deleteFlight);

export default router;