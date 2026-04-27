import express from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getMyProducts,
} from '../controllers/productController.js';
import { protect, sellerOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/my-products', protect, sellerOnly, getMyProducts);
router.post('/', protect, sellerOnly, createProduct);
router.get('/:id', getProductById);
router.put('/:id', protect, sellerOnly, updateProduct);
router.delete('/:id', protect, sellerOnly, deleteProduct);

export default router;

