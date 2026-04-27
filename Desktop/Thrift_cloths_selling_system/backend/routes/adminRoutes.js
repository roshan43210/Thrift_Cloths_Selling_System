import express from 'express';
import {
  getAllUsers,
  getAllProducts,
  getAllOrders,
  removeProduct,
  updateUserStatus,
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/users', protect, adminOnly, getAllUsers);
router.get('/products', protect, adminOnly, getAllProducts);
router.get('/orders', protect, adminOnly, getAllOrders);
router.delete('/products/:id', protect, adminOnly, removeProduct);
router.put('/users/:id', protect, adminOnly, updateUserStatus);

export default router;

