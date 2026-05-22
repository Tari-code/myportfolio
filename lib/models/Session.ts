import mongoose, { Schema, model, models } from 'mongoose';

const SessionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sessionId: { type: String, required: true, unique: true },
  userAgent: { type: String, default: '' },
  ip: { type: String, default: '' },
  country: { type: String, default: '' },
  city: { type: String, default: '' },
  isRevoked: { type: Boolean, default: false },
  lastActive: { type: Date, default: Date.now },
}, { timestamps: true });

SessionSchema.index({ userId: 1, isRevoked: 1 });

const Session = models.Session || model('Session', SessionSchema);
export default Session;
