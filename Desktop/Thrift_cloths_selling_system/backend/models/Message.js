import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    seen: { type: Boolean, default: false },
  },
  { timestamps: true }
);

messageSchema.index({ roomId: 1, createdAt: -1 });

export default mongoose.model('Message', messageSchema);

