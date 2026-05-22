import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import News from "@/lib/models/News";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { postId } = await req.json();
    if (!postId) return NextResponse.json({ error: "postId required" }, { status: 400 });

    const userId = session.user.id;
    const post = await News.findById(postId);
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    if (!post.likes) post.likes = [];
    const alreadyLiked = post.likes.some((id: any) => id.toString() === userId);
    if (alreadyLiked) {
      post.likes = post.likes.filter((id: any) => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }
    await post.save();

    return NextResponse.json({ success: true, likes: post.likes.length, liked: !alreadyLiked });
  } catch (err) {
    console.error("Like error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
