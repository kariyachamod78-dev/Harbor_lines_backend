// backend/routes/deliveryOrderRoutes.js
import express from 'express';
import {
  createDeliveryOrder,
  getDeliveryOrder,
  getAllDeliveryOrders,
  downloadDeliveryOrder,
  updateDeliveryOrder,
  deleteDeliveryOrder
} from '../controllers/deliveryOrderController.js';

const router = express.Router();

router.post('/createDO', createDeliveryOrder);
router.get('/getAllDOs', getAllDeliveryOrders);
router.get('/getDO/:id', getDeliveryOrder);
router.get('/downloadDO/:id', downloadDeliveryOrder);
router.put('/updateDO/:id', updateDeliveryOrder);
router.delete('/deleteDO/:id', deleteDeliveryOrder);

export default router;