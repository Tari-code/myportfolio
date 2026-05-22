import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";
import PasswordReset from "@/lib/models/PasswordReset";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({ success: true });
    }

    // Invalidate any existing tokens for this email
    await PasswordReset.deleteMany({ email: user.email });

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await PasswordReset.create({ email: user.email, token, expiresAt });

    const baseUrl = process.env.REPLIT_DEV_DOMAIN
      ? `https://${process.env.REPLIT_DEV_DOMAIN}`
      : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

    const resetUrl = `${baseUrl}/customer/reset-password?token=${token}`;

    const emailSent = await sendPasswordResetEmail(user.email, resetUrl);

    return NextResponse.json({
      success: true,
      emailSent,
      // Only expose reset URL in dev when email is not configured
      ...(process.env.NODE_ENV !== "production" && !emailSent ? { devResetUrl: resetUrl } : {}),
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
