import express from 'express';
import {
  createOrder,
  getMyOrders,
  getSellerOrders,
  getOrderById,
  updateOrderStatus,
  markFullyPaid,
} from '../controllers/orderController.js';
import { protect, sellerOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/seller-orders', protect, sellerOnly, getSellerOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, sellerOnly, updateOrderStatus);
router.put('/:id/mark-paid', protect, sellerOnly, markFullyPaid);

export default router;

