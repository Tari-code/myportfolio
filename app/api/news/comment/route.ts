import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import News from "@/lib/models/News";
import { getSession } from "@/lib/auth";
import { createNotification } from "@/lib/createNotification";

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { postId, text } = await req.json();
    if (!postId || !text?.trim()) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const post = await News.findById(postId);
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    const comment = {
      userId: session.user.id,
      userName: session.user.name,
      userAvatar: session.user.avatar || "",
      text: text.trim(),
      createdAt: new Date(),
    };

    post.comments = post.comments || [];
    post.comments.push(comment);
    await post.save();

    if (post.submittedBy && post.submittedBy.toString() !== session.user.id) {
      await createNotification({
        userId: post.submittedBy.toString(),
        type: "new_comment",
        title: "New comment on your post",
        message: `${session.user.name} commented: "${text.trim().slice(0, 60)}${text.trim().length > 60 ? "…" : ""}"`,
        link: "/dashboard?tab=community",
        metadata: { postId, commenterId: session.user.id },
      });
    }

    return NextResponse.json({ success: true, comment, commentCount: post.comments.length });
  } catch (error) {
    console.error("Comment error:", error);
    return NextResponse.json({ error: "Failed to post comment" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");
    if (!postId) return NextResponse.json({ error: "Missing postId" }, { status: 400 });

    const post = await News.findById(postId).select("comments");
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    return NextResponse.json({ comments: post.comments || [] });
  } catch (error) {
    console.error("Get comments error:", error);
    return NextResponse.json({ comments: [] }, { status: 500 });
  }
}
