import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
  phone: { type: String },
  emailVerified: { type: Boolean, default: false },
  avatar: { type: String },
  bio: { type: String, default: "" },
  skills: [{ type: String }],
  following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  tier: { type: String, enum: ['free', 'pro', 'elite', 'business'], default: 'free' },
  apiKey: { type: String, default: null },
  company: { type: String, default: '' },
  website: { type: String, default: '' },
  industry: { type: String, default: '' },
}, { timestamps: true });

const User = models.User || model('User', UserSchema);
export default User;
