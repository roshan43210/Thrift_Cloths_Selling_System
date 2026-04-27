import Review from '../models/Review.js';
import Order from '../models/Order.js';
import User from '../models/User.js';

export const createReview = async (req, res) => {
  try {
    const { orderId, rating, comment } = req.body;

    const order = await Order.findOne({ _id: orderId, buyer: req.user._id });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.status !== 'delivered') return res.status(400).json({ message: 'Order not delivered yet' });
    if (order.isReviewed) return res.status(400).json({ message: 'Order already reviewed' });

    const review = await Review.create({
      order: orderId,
      buyer: req.user._id,
      seller: order.seller,
      rating,
      comment,
    });

    order.isReviewed = true;
    await order.save();

    const reviews = await Review.find({ seller: order.seller });
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await User.findByIdAndUpdate(order.seller, {
      ratingAverage: Number(avg.toFixed(1)),
      ratingCount: reviews.length,
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSellerReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ seller: req.params.sellerId })
      .populate('buyer', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

