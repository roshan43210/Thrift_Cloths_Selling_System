import express from 'express';
import { esewaPay, khaltiPay, getPaymentStatus } from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/esewa', protect, esewaPay);
router.post('/khalti', protect, khaltiPay);
router.get('/status/:orderId', protect, getPaymentStatus);

export default router;

