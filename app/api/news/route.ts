import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import News from "@/lib/models/News";

export async function GET() {
  try {
    // Only return approved news for the public feed
    const news = await News.find({ isApproved: true }).sort({ createdAt: -1 });
    return NextResponse.json(news);
  } catch (error) {
    console.error("Fetch news error:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const { action, item, id } = await req.json();

    if (action === "add" && item) {
      const newItem = await News.create(item);
      return NextResponse.json({ success: true, item: newItem });
    }

    if (action === "edit" && id && item) {
      const updatedItem = await News.findByIdAndUpdate(id, item, { new: true });
      if (updatedItem) {
        return NextResponse.json({ success: true, item: updatedItem });
      }
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    if ((action === "remove" || action === "reject") && id) {
      await News.findByIdAndDelete(id);
      return NextResponse.json({ success: true });
    }

    if (action === "approve" && id) {
      await News.findByIdAndUpdate(id, { isApproved: true });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Process news error:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
