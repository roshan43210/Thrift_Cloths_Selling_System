import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    condition: { type: String, enum: ['like new', 'good', 'worn'], required: true },
    category: { type: String, enum: ['men', 'women', 'kids'], required: true },
    images: [{ type: String }],
    size: { type: String, default: '' },
    brand: { type: String, default: '' },
    isSold: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);

