import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Notification from "@/lib/models/Notification";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = session.user.id;
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({ userId, read: false });
    return NextResponse.json({ notifications, unreadCount });
  } catch (error) {
    console.error("Fetch notifications error:", error);
    return NextResponse.json({ notifications: [], unreadCount: 0 });
  }
}

export async function PATCH(req: Request) {
  try {
    await connectDB();
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id, markAll } = await req.json();
    const userId = session.user.id;

    if (markAll) {
      await Notification.updateMany({ userId, read: false }, { read: true });
    } else if (id) {
      await Notification.findOneAndUpdate({ _id: id, userId }, { read: true });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update notification error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getSession();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId, type, title, message, link, metadata } = await req.json();
    const notification = await Notification.create({ userId, type, title, message, link, metadata });
    return NextResponse.json({ success: true, notification });
  } catch (error) {
    console.error("Create notification error:", error);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
