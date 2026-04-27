import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

export const createOrder = async (req, res) => {
  try {
    const { shippingAddress, phone, paymentMethod } = req.body;
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const sellerId = cart.items[0].product.seller.toString();
    const allSameSeller = cart.items.every((item) => item.product.seller.toString() === sellerId);
    if (!allSameSeller) {
      return res.status(400).json({ message: 'All items must be from the same seller' });
    }

    const items = cart.items.map((item) => ({
      product: item.product._id,
      title: item.product.title,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.images[0],
    }));

    const totalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const advanceAmount = Math.round(totalAmount * 0.5);
    const remainingAmount = totalAmount - advanceAmount;

    const order = await Order.create({
      buyer: req.user._id,
      seller: sellerId,
      items,
      totalAmount,
      shippingAddress,
      phone,
      payment: {
        method: paymentMethod,
        advanceAmount,
        remainingAmount,
        status: 'pending',
      },
    });

    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, { isSold: true });
    }

    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .populate('seller', 'name')
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSellerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ seller: req.user._id })
      .populate('buyer', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('buyer', 'name email phone')
      .populate('seller', 'name email phone')
      .populate('items.product');

    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.buyer._id.toString() !== req.user._id.toString() &&
        order.seller._id.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    order.status = status;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markFullyPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    order.payment.status = 'fully_paid';
    order.payment.remainingAmount = 0;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

