import mongoose, { Schema, model, models } from "mongoose";

const SystemConfigSchema = new Schema({
  key: { type: String, required: true, unique: true },
  maintenanceMode: { type: Boolean, default: false },
  chatbotActive: { type: Boolean, default: true },
  soundAlerts: { type: Boolean, default: true }
}, { timestamps: true });

const SystemConfig = models.SystemConfig || model("SystemConfig", SystemConfigSchema);
export default SystemConfig;
