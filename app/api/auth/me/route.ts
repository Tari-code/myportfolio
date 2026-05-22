import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    await connectDB();
    const dbUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: { lastSeen: new Date() } },
      { new: true }
    ).select("emailVerified name role");
    if (dbUser) {
      session.user.emailVerified = dbUser.emailVerified ?? false;
    }
  } catch (_) {}

  return NextResponse.json({ authenticated: true, user: session.user });
}
