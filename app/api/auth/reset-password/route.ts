import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";
import PasswordReset from "@/lib/models/PasswordReset";
import { hashPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Token and password are required" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const record = await PasswordReset.findOne({ token, used: false });

    if (!record) {
      return NextResponse.json({ error: "Invalid or expired reset link" }, { status: 400 });
    }

    if (new Date() > record.expiresAt) {
      await PasswordReset.deleteOne({ _id: record._id });
      return NextResponse.json({ error: "This reset link has expired. Please request a new one." }, { status: 400 });
    }

    const hashed = await hashPassword(password);
    await User.updateOne({ email: record.email }, { password: hashed });
    await PasswordReset.updateOne({ _id: record._id }, { used: true });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ valid: false, error: "No token provided" }, { status: 400 });
    }

    const record = await PasswordReset.findOne({ token, used: false });

    if (!record || new Date() > record.expiresAt) {
      return NextResponse.json({ valid: false, error: "Invalid or expired token" });
    }

    return NextResponse.json({ valid: true });
  } catch (error) {
    return NextResponse.json({ valid: false, error: "Something went wrong" }, { status: 500 });
  }
}
