import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ActivityLog from "@/lib/models/ActivityLog";
import { getSession } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await connectDB();
    const session = await getSession();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const since = searchParams.get("since");
    const query: any = {};
    if (since) query.createdAt = { $gt: new Date(since) };
    const logs = await ActivityLog.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    return NextResponse.json(logs);
  } catch (error) {
    console.error("Activity log fetch error:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const log = await ActivityLog.create(body);
    return NextResponse.json(log);
  } catch (error) {
    console.error("Activity log create error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
