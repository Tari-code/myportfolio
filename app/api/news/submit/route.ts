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

    if (session.user.id.toString() === "[object Object]") {
      return NextResponse.json({ error: "Your session is outdated. Please log out and log in again to continue." }, { status: 400 });
    }

    if (!title || !summary || !content || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

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
      isApproved: false
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

export async function PATCH(req: Request) {
  try {
    await connectDB();
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, title, summary, content, category, imageUrl } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing news ID" }, { status: 400 });

    const existing = await News.findById(id);
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (existing.submittedBy !== session.user.id.toString()) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const slug = title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : existing.slug;

    const updated = await News.findByIdAndUpdate(
      id,
      { title, summary, content, category, imageUrl, slug, isApproved: false },
      { new: true }
    );

    return NextResponse.json({ success: true, news: updated });
  } catch (error) {
    console.error("Edit news error:", error);
    return NextResponse.json({ error: "Failed to update news" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing news ID" }, { status: 400 });

    const existing = await News.findById(id);
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (existing.submittedBy !== session.user.id.toString()) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await News.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete news error:", error);
    return NextResponse.json({ error: "Failed to delete news" }, { status: 500 });
  }
}
