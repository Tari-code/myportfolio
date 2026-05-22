import mongoose, { Schema, model, models } from 'mongoose';

const PendingUserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'customer' },
  otp: { type: String, required: true },
  otpExpiry: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now, expires: 3600 } // Auto-delete after 1 hour
}, { timestamps: true });

const PendingUser = models.PendingUser || model('PendingUser', PendingUserSchema);
export default PendingUser;
