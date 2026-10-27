// backend/routes/manifestInvoiceRoutes.js
import express from 'express';
import { 
  getManifestEntryByBookingNum,
  createManifestInvoice,
  generateManifestInvoicePDF
} from '../controllers/manifestInvoiceController.js';

const router = express.Router();

router.get('/entry/:bookingNum', getManifestEntryByBookingNum);
router.post('/create', createManifestInvoice);
router.get('/pdf/:id', generateManifestInvoicePDF);

export default router;
