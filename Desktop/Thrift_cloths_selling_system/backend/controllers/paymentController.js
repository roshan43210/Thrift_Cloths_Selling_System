import Order from '../models/Order.js';

export const esewaPay = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findOne({ _id: orderId, buyer: req.user._id });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const mockTransactionId = 'ESW-' + Date.now();
    order.payment.status = 'partial_paid';
    order.payment.transactionId = mockTransactionId;
    await order.save();

    res.json({ success: true, message: 'eSewa payment successful (sandbox)', transactionId: mockTransactionId, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const khaltiPay = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findOne({ _id: orderId, buyer: req.user._id });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const mockTransactionId = 'KHL-' + Date.now();
    order.payment.status = 'partial_paid';
    order.payment.transactionId = mockTransactionId;
    await order.save();

    res.json({ success: true, message: 'Khalti payment successful (sandbox)', transactionId: mockTransactionId, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPaymentStatus = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.orderId, buyer: req.user._id });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ payment: order.payment, status: order.status });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

