import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";
import PendingUser from "@/lib/models/PendingUser";
import { hashPassword, login } from "@/lib/auth";
import { sendOTPEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { name, email, phone, password, role = "customer" } = await req.json();

    if (!name || !email || !phone || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create the unverified user directly in the database
    const user = await User.findOneAndUpdate(
      { email },
      { name, email, phone, password: hashedPassword, role, emailVerified: false },
      { upsert: true, new: true }
    );

    await PendingUser.findOneAndUpdate(
      { email },
      { name, email, phone, password: hashedPassword, role, otp, otpExpiry },
      { upsert: true, new: true }
    );

    const emailRes = await sendOTPEmail(email, otp);
    
    // Log them in immediately (even though unverified)
    const userResponse = { id: user._id.toString(), name: user.name, email: user.email, role: user.role, emailVerified: false };
    await login(userResponse);

    return NextResponse.json({ 
      success: true, 
      message: "OTP sent to your email",
      user: userResponse
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
