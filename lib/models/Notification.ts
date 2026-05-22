import mongoose, { Schema, model, models } from "mongoose";

const NotificationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  type: {
    type: String,
    enum: ["ticket_reply", "tier_upgrade", "welcome", "system", "news_approved", "news_rejected", "new_follower"],
    required: true,
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  link: { type: String, default: "" },
  metadata: { type: Schema.Types.Mixed, default: {} },
}, { timestamps: true });

const Notification = models.Notification || model("Notification", NotificationSchema);
export default Notification;
