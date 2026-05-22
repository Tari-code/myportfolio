import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/lib/models/Project";

export async function GET() {
  try {
    await connectDB();
    const portfolio = await Project.find({}).sort({ createdAt: -1 });
    return NextResponse.json(portfolio);
  } catch (error) {
    console.error("Fetch portfolio error:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const { action, id, item } = await req.json();

    if (action === "add" && item) {
      const newItem = await Project.create(item);
      return NextResponse.json({ success: true, item: newItem });
    }

    if (action === "edit" && id && item) {
      const updatedItem = await Project.findByIdAndUpdate(id, item, { new: true });
      if (updatedItem) {
        return NextResponse.json({ success: true, item: updatedItem });
      }
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    if (action === "remove" && id) {
      await Project.findByIdAndDelete(id);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Process portfolio error:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
