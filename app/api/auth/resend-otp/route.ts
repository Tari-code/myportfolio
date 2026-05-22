import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";
import PendingUser from "@/lib/models/PendingUser";
import { sendOTPEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email } = await req.json().catch(() => ({}));

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json({ error: "Email is already verified" }, { status: 400 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store/Update in PendingUser
    await PendingUser.findOneAndUpdate(
      { email },
      { name: user.name, email, phone: user.phone || "", password: user.password, role: user.role, otp, otpExpiry },
      { upsert: true, new: true }
    );

    // Send email
    const emailRes = await sendOTPEmail(email, otp);
    if (!emailRes.success) {
      return NextResponse.json({ error: "Failed to send OTP email" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "OTP resent successfully" });
  } catch (error) {
    console.error("Resend OTP error:", error);
    return NextResponse.json({ error: "Failed to resend OTP" }, { status: 500 });
  }
}
