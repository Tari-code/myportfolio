import mongoose, { Schema, model, models } from "mongoose";

const VisitSchema = new Schema({
  date: { type: String, required: true, unique: true }, // Format: YYYY-MM-DD
  views: { type: Number, default: 0 },
  clicks: { type: Number, default: 0 }
}, { timestamps: true });

const Visit = models.Visit || model("Visit", VisitSchema);
export default Visit;
