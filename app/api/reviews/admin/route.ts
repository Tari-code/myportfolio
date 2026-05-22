import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Review from "@/lib/models/Review";
// Auth is enforced by the admin middleware. API accessible only from admin panel.

export async function GET() {
  try {
    await connectDB();
    // Admin gets ALL reviews, including unapproved ones
    const reviews = await Review.find({}).sort({ createdAt: -1 });
    return NextResponse.json(reviews);
  } catch (error) {
    console.error("GET /api/reviews/admin error:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const { id, action } = await req.json();

    if (action === 'approve') {
      await Review.findByIdAndUpdate(id, { isApproved: true });
    } else if (action === 'delete') {
      await Review.findByIdAndDelete(id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/reviews/admin error:", error);
    return NextResponse.json({ error: "Action failed" }, { status: 500 });
  }
}
