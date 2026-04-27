import Wishlist from '../models/Wishlist.js';

// @desc   Get wishlist
// @route  GET /api/wishlist
export const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Add to wishlist
// @route  POST /api/wishlist/:productId
export const addToWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, products: [] });
    }

    if (!wishlist.products.includes(req.params.productId)) {
      wishlist.products.push(req.params.productId);
      await wishlist.save();
    }

    wishlist = await wishlist.populate('products');
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Remove from wishlist
// @route  DELETE /api/wishlist/:productId
export const removeFromWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });

    wishlist.products = wishlist.products.filter((p) => p.toString() !== req.params.productId);
    await wishlist.save();
    wishlist = await wishlist.populate('products');
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

