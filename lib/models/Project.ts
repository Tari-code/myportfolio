import mongoose, { Schema, model, models } from 'mongoose';

const ProjectSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  imageUrl: { type: String }, // Matches existing field
  description: { type: String, required: true },
  fullDescription: { type: String },
  tags: [{ type: String }], // Matches existing field
  link: { type: String },
  client: { type: String },
  duration: { type: String },
}, { timestamps: true });

const Project = models.Project || model('Project', ProjectSchema);
export default Project;
