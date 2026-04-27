import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: function () { return !this.googleId; } },
    avatar: { type: String, default: '' },
    role: { type: String, enum: ['buyer', 'seller', 'admin'], default: 'buyer' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    googleId: { type: String, default: null },
    isVerified: { type: Boolean, default: false },
    esewaId: { type: String, default: '' },
    khaltiId: { type: String, default: '' },
    ratingAverage: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);

