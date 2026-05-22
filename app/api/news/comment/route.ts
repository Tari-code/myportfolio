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

    const body = await req.json();
    const { postId, text, commentId, action } = body;

    if (!postId || !text?.trim()) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const post = await News.findById(postId);
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    // Reply to existing comment
    if (action === "reply" && commentId) {
      const comment = post.comments.id(commentId);
      if (!comment) return NextResponse.json({ error: "Comment not found" }, { status: 404 });

      const reply = {
        userId: session.user.id,
        userName: session.user.name,
        userAvatar: session.user.avatar || "",
        text: text.trim(),
        createdAt: new Date(),
      };

      comment.replies = comment.replies || [];
      comment.replies.push(reply);
      await post.save();

      if (comment.userId && comment.userId.toString() !== session.user.id) {
        await createNotification({
          userId: comment.userId.toString(),
          type: "new_comment",
          title: "New reply to your comment",
          message: `${session.user.name} replied: "${text.trim().slice(0, 60)}${text.trim().length > 60 ? "…" : ""}"`,
          link: "/dashboard?tab=community",
          metadata: { postId, commentId },
        });
      }

      const updatedComment = post.comments.id(commentId);
      return NextResponse.json({ success: true, replies: updatedComment.replies });
    }

    // Top-level comment
    const comment = {
      userId: session.user.id,
      userName: session.user.name,
      userAvatar: session.user.avatar || "",
      text: text.trim(),
      createdAt: new Date(),
      likes: [],
      replies: [],
    };

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

    const savedComment = post.comments[post.comments.length - 1];
    return NextResponse.json({ success: true, comment: savedComment, commentCount: post.comments.length });
  } catch (error) {
    console.error("Comment error:", error);
    return NextResponse.json({ error: "Failed to post comment" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await connectDB();
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { postId, commentId, action } = await req.json();
    if (!postId || !commentId || action !== "like") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const post = await News.findById(postId);
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    const comment = post.comments.id(commentId);
    if (!comment) return NextResponse.json({ error: "Comment not found" }, { status: 404 });

    comment.likes = comment.likes || [];
    const userId = session.user.id;
    const alreadyLiked = comment.likes.some((id: any) => id.toString() === userId);

    if (alreadyLiked) {
      comment.likes = comment.likes.filter((id: any) => id.toString() !== userId);
    } else {
      comment.likes.push(userId);
    }

    await post.save();
    return NextResponse.json({ success: true, likes: comment.likes.length, liked: !alreadyLiked });
  } catch (error) {
    console.error("Comment like error:", error);
    return NextResponse.json({ error: "Failed to like comment" }, { status: 500 });
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
