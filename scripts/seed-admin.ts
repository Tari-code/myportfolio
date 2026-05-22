const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function seed() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error("MONGODB_URI not found");
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: String,
  });

  const User = mongoose.models.User || mongoose.model('User', UserSchema);

  const adminEmail = "admin@herakonlab.com";
  const existingAdmin = await User.findOne({ email: adminEmail });

  if (existingAdmin) {
    console.log("Admin user already exists");
  } else {
    const hashedPassword = await bcrypt.hash("Admin123!", 10);
    await User.create({
      name: "Super Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    });
    console.log("Default admin user created:");
    console.log("Email: admin@herakonlab.com");
    console.log("Password: Admin123!");
  }

  await mongoose.disconnect();
  console.log("Disconnected from MongoDB");
}

seed();
