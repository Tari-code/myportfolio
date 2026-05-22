import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String },
  company: { type: String },
  content: { type: String, required: true },
  rating: { type: Number, default: 5 },
  avatar: { type: String },
  isApproved: { type: Boolean, default: false }, // Admin can approve before display
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Review || mongoose.model("Review", ReviewSchema);
