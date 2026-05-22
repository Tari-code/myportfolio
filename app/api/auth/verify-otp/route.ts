import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";
import PendingUser from "@/lib/models/PendingUser";
import { login } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
    }

    const pendingUser = await PendingUser.findOne({ email });

    if (!pendingUser) {
      return NextResponse.json({ error: "No pending registration found" }, { status: 400 });
    }

    if (pendingUser.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    if (new Date() > pendingUser.otpExpiry) {
      return NextResponse.json({ error: "OTP has expired" }, { status: 400 });
    }

    // OTP is valid, update user to verified
    let user = await User.findOneAndUpdate(
      { email },
      { $set: { emailVerified: true } },
      { new: true }
    );

    if (!user) {
      user = await User.create({
        name: pendingUser.name,
        email: pendingUser.email,
        phone: pendingUser.phone,
        password: pendingUser.password,
        role: pendingUser.role,
        emailVerified: true
      });
    }

    // Clean up pending user
    await PendingUser.deleteOne({ email });

    const userResponse = { id: user._id.toString(), name: user.name, email: user.email, role: user.role, emailVerified: true };
    await login(userResponse);

    return NextResponse.json({ success: true, user: userResponse });
  } catch (error) {
    console.error("OTP verification error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
