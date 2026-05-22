import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const apiKey = `tari_${crypto.randomBytes(24).toString("hex")}`;
    await User.updateOne({ _id: session.user.id }, { apiKey });

    return NextResponse.json({ apiKey });
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate API key" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await getSession();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    await User.updateOne({ _id: session.user.id }, { apiKey: null });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to revoke API key" }, { status: 500 });
  }
}
