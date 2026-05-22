import mongoose, { Schema, model, models } from 'mongoose';

const TicketSchema = new Schema({
  user: { type: String }, // For legacy guest tickets
  name: { type: String }, // For contact form
  email: { type: String },
  subject: { type: String },
  message: { type: String, required: true },
  status: { type: String, enum: ['open', 'resolved'], default: 'open' },
  readBy: [{ type: String }], // emails of users who have read the latest reply
  replies: [{
    sender: { type: String },
    text: { type: String },
    time: { type: Date, default: Date.now }
  }],
  time: { type: Date, default: Date.now } // For legacy guest tickets
}, { timestamps: true });

const Ticket = models.Ticket || model('Ticket', TicketSchema);
export default Ticket;
