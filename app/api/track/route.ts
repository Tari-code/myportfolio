import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Visit from "@/lib/models/Visit";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { action } = body;

    if (action !== "view" && action !== "click") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Get date in YYYY-MM-DD in local/server time timezone
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;

    // Update with $inc, upserting if no record for the date exists yet
    const update: Record<string, number> = {};
    update[action === "view" ? "views" : "clicks"] = 1;

    await Visit.findOneAndUpdate(
      { date: dateStr },
      { $inc: update },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, date: dateStr });
  } catch (error) {
    console.error("Tracking API error:", error);
    return NextResponse.json({ error: "Failed to log event" }, { status: 500 });
  }
}
