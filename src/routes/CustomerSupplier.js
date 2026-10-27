// backend/routes/customerSupplier.js
import express from 'express';
import {
  createCustomerSupplier,
  getAllCustomerSuppliers,
  updateCustomerSupplier,
  deleteCustomerSupplier
} from '../controllers/customerSupplierController.js';

const router = express.Router();

router.post('/createCustomerSupplier', createCustomerSupplier);
router.get('/getAllCustomerSuppliers', getAllCustomerSuppliers);
router.put('/updateCustomerSupplier/:id', updateCustomerSupplier);
router.delete('/deleteCustomerSupplier/:id', deleteCustomerSupplier);

export default router;