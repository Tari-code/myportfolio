import mongoose, { Schema, model, models } from 'mongoose';

const MediaSchema = new Schema({
  filename: { type: String, required: true },
  url: { type: String, required: true },
  size: { type: Number },
  contentType: { type: String },
  uploadedBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const Media = models.Media || model('Media', MediaSchema);
export default Media;
