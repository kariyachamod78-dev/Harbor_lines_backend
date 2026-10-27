// backend/routes/salesInvoiceRoutes.js
import express from 'express';
import {
  createSalesInvoice,
  getAllSalesInvoices,
  getSalesInvoice,
  generateInvoicePDF
} from '../controllers/salesInvoiceController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/createInvoice', createSalesInvoice);
router.get('/getAllInvoices', getAllSalesInvoices);
router.get('/getInvoice/:id', getSalesInvoice);
router.get('/generatePDF/:id', generateInvoicePDF);

export default router;