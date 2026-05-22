import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    const session = await getSession();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error("Fetch users error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const session = await getSession();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Don't allow deleting yourself
    if (id === session.user.id) {
      return NextResponse.json({ error: "You cannot delete your own account" }, { status: 400 });
    }

    await User.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await connectDB();
    const session = await getSession();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, role, tier } = await req.json();
    if (!id || (!role && !tier)) {
      return NextResponse.json({ error: "ID and at least one field (role or tier) are required" }, { status: 400 });
    }

    const update: Record<string, string> = {};
    if (role) update.role = role;
    if (tier) update.tier = tier;

    await User.findByIdAndUpdate(id, update);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update user role error:", error);
    return NextResponse.json({ error: "Failed to update user role" }, { status: 500 });
  }
}
