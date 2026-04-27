import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

// @desc   Get all users
// @route  GET /api/admin/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get all products
// @route  GET /api/admin/products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('seller', 'name email')
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get all orders
// @route  GET /api/admin/orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('buyer', 'name email')
      .populate('seller', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Remove product (admin hard delete)
// @route  DELETE /api/admin/products/:id
export const removeProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product permanently deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Toggle user active status (basic)
// @route  PUT /api/admin/users/:id
export const updateUserStatus = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

