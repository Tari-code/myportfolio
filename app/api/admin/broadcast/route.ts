import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";
import { getSession } from "@/lib/auth";
import { createNotification } from "@/lib/createNotification";

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getSession();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, message, link, type } = await req.json();
    if (!title || !message) {
      return NextResponse.json({ error: "Title and message are required" }, { status: 400 });
    }

    const users = await User.find({ role: { $ne: "admin" } }).select("_id");
    let sent = 0;
    let failed = 0;

    for (const user of users) {
      try {
        await createNotification({
          userId: user._id.toString(),
          type: type || "admin_update",
          title,
          message,
          link: link || "/dashboard",
          metadata: { broadcastBy: session.user.id },
        });
        sent++;
      } catch {
        failed++;
      }
    }

    return NextResponse.json({ success: true, sent, failed, total: users.length });
  } catch (error) {
    console.error("Broadcast error:", error);
    return NextResponse.json({ error: "Broadcast failed" }, { status: 500 });
  }
}
