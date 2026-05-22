import mongoose, { Schema, model, models } from 'mongoose';

const ActivityLogSchema = new Schema({
  type: {
    type: String,
    enum: ['login', 'register', 'ticket', 'tier_change', 'post', 'follow'],
    required: true
  },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  userName: { type: String },
  userEmail: { type: String },
  meta: { type: Schema.Types.Mixed },
}, { timestamps: true });

ActivityLogSchema.index({ createdAt: -1 });

const ActivityLog = models.ActivityLog || model('ActivityLog', ActivityLogSchema);
export default ActivityLog;
