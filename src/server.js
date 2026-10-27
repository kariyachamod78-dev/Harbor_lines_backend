// src/server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5173/',
    'https://harbourlinesfreight.netlify.app',
    'https://harbourlinesfreight.netlify.app/',
    'https://transcorp-canada.netlify.app'
  ],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

import authRoutes from './routes/authRoutes.js';
import customerSupplierRoutes from './routes/CustomerSupplier.js';
import currencyRoutes from './routes/currency.js';
import uomRoutes from './routes/uom.js';
import bankRoutes from './routes/bank.js';
import taxRoutes from './routes/tax.js';
import chargeRoutes from './routes/chargeRoutes.js';
import vesselRoutes from './routes/vessel.js';
import flightRoutes from './routes/flight.js';
import seaDestinationRoutes from './routes/seaDestination.js';
import airDestinationRoutes from './routes/airDestination.js';
import seaImportJobRoutes from './routes/seaImportJob.js';
import exportJobRoutes from './routes/exportJobRoutes.js';
import userRoutes from './routes/userRoutes.js';
import deliveryOrderRoutes from './routes/deliveryOrderRoutes.js';
import salesInvoiceRoutes from './routes/salesInvoiceRoutes.js';
import canadaRoutes from './routes/canadaRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import airImportJobRoutes from './routes/airImportJobRoutes.js';
import airWaybillRoutes from './routes/airWaybillRoutes.js';
import airWaybillInstructionRoutes from './routes/airWaybillInstructionRoutes.js';
import receivableRoutes from './routes/receivableRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import payableRoutes from './routes/payable.js';
import billingRoutes from './routes/billingRoutes.js';
import blManifestRoutes from './routes/blManifestRoutes.js';
import manifestInvoiceRoutes from './routes/manifestInvoiceRoutes.js';

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/customersuppliers', customerSupplierRoutes);
app.use('/api/currencies', currencyRoutes);
app.use('/api/uoms', uomRoutes);
app.use('/api/banks', bankRoutes);
app.use('/api/taxes', taxRoutes);
app.use('/api/charges', chargeRoutes);
app.use('/api/vessels', vesselRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/sea-destinations', seaDestinationRoutes);
app.use('/api/air-destinations', airDestinationRoutes);
app.use('/api/jobs/sea-import', seaImportJobRoutes);
app.use('/api/jobs/sea-export', exportJobRoutes);
app.use('/api/users', userRoutes);
app.use('/api/delivery-orders', deliveryOrderRoutes);
app.use('/api/sales-invoices', salesInvoiceRoutes);
app.use('/api/canada', canadaRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/jobs/air-import', airImportJobRoutes);
app.use('/api/air-waybill', airWaybillRoutes);
app.use('/api/air-waybill-instruction', airWaybillInstructionRoutes);
app.use('/api/receivables', receivableRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/payables', payableRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/bl-manifest', blManifestRoutes);
app.use('/api/manifest-invoice', manifestInvoiceRoutes);

// Serve static reports folder
app.use('/reports', express.static(path.join(__dirname, '../public/reports')));

// MongoDB connection + server start
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    const PORT = process.env.PORT || 5000; // 80 is usually privileged – better use 5000 locally
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('DB Connection Error:', err.message);
    process.exit(1);
  });

// Optional: Export app if you need it for testing
export default app;