import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Review from "@/lib/models/Review";

export async function GET() {
  try {
    await connectDB();
    const reviews = await Review.find({ isApproved: true }).sort({ createdAt: -1 });
    return NextResponse.json(reviews);
  } catch (error) {
    console.error("GET /api/reviews error:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, content, role, rating } = body;

    if (!name || !content) {
      return NextResponse.json({ error: "Name and content are required" }, { status: 400 });
    }

    const review = await Review.create({
      name,
      content,
      role: role || "",
      rating: rating || 5,
      isApproved: false
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("POST /api/reviews error:", error);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
