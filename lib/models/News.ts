import mongoose, { Schema, model, models } from 'mongoose';

const NewsSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  imageUrl: { type: String },
  summary: { type: String, required: true }, // Changed from excerpt
  content: { type: String, required: true },
  author: { type: String, default: "Paul Gambo" },
  date: { type: String, default: () => new Date().toISOString() },
  readTime: { type: String, default: "5 min read" },
  isApproved: { type: Boolean, default: false },
  submittedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    userName: { type: String, required: true },
    userAvatar: { type: String, default: "" },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  }],
  shares: { type: Number, default: 0 },
}, { timestamps: true });

const News = models.News || model('News', NewsSchema);
export default News;
