import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String },
});

const paymentSchema = new mongoose.Schema({
  method: { type: String, enum: ['esewa', 'khalti', 'cod'], required: true },
  advanceAmount: { type: Number, default: 0 },
  remainingAmount: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'partial_paid', 'fully_paid'], default: 'pending' },
  transactionId: { type: String, default: '' },
});

const orderSchema = new mongoose.Schema(
  {
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    shippingAddress: { type: String, required: true },
    phone: { type: String, required: true },
    payment: paymentSchema,
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    isReviewed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);

