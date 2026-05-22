import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import News from "@/lib/models/News";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, summary, content, category, imageUrl } = await req.json();

    // Check for corrupted session ID
    if (session.user.id.toString() === "[object Object]") {
      return NextResponse.json({ error: "Your session is outdated. Please log out and log in again to continue." }, { status: 400 });
    }

    if (!title || !summary || !content || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Generate slug
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const news = await News.create({
      title,
      summary,
      content,
      category,
      imageUrl,
      slug,
      author: session.user.name,
      submittedBy: session.user.id.toString(),
      isApproved: false // User submissions require admin approval
    });

    return NextResponse.json({ success: true, news });
  } catch (error) {
    console.error("News submission error:", error);
    return NextResponse.json({ error: "Failed to submit news" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const news = await News.find({ submittedBy: session.user.id.toString() }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, news });
  } catch (error) {
    console.error("Fetch user news error:", error);
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}
