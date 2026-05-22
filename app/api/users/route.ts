import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";

export async function GET(req: Request) {
  try {
    await connectDB();
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");
    const search = searchParams.get("search");

    // Get specific user
    if (userId) {
      const user = await User.findById(userId)
        .select("-password")
        .populate("followers", "name email avatar bio")
        .populate("following", "name email avatar bio");
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      return NextResponse.json(user);
    }

    // Search or list all users (excluding admins and current user)
    let query: any = { role: { $ne: "admin" }, _id: { $ne: session.user.id } };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    const users = await User.find(query).select("-password");
    return NextResponse.json(users);
  } catch (error: any) {
    console.error("Fetch users error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUserId = session.user.id;
    const body = await req.json();
    const { action } = body;

    if (action === "follow") {
      const { targetUserId } = body;
      if (!targetUserId || targetUserId === currentUserId) {
        return NextResponse.json({ error: "Invalid target user" }, { status: 400 });
      }

      const targetUser = await User.findById(targetUserId);
      const currentUser = await User.findById(currentUserId);

      if (!targetUser || !currentUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const isFollowing = currentUser.following.some((id: any) => id.toString() === targetUserId);

      if (isFollowing) {
        // Unfollow
        currentUser.following = currentUser.following.filter(
          (id: any) => id.toString() !== targetUserId
        );
        targetUser.followers = targetUser.followers.filter(
          (id: any) => id.toString() !== currentUserId
        );
      } else {
        // Follow
        currentUser.following.push(targetUserId);
        targetUser.followers.push(currentUserId);
      }

      await currentUser.save();
      await targetUser.save();

      return NextResponse.json({
        success: true,
        following: currentUser.following,
        isFollowing: !isFollowing
      });
    }

    if (action === "updateProfile") {
      const { bio, skills, name, avatar } = body;
      const updatedUser = await User.findByIdAndUpdate(
        currentUserId,
        {
          $set: {
            bio: bio || "",
            skills: Array.isArray(skills) ? skills : [],
            ...(name && { name }),
            ...(avatar && { avatar })
          }
        },
        { new: true }
      ).select("-password");

      return NextResponse.json({ success: true, user: updatedUser });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("User POST error:", error);
    return NextResponse.json({ error: error.message || "Failed to process request" }, { status: 500 });
  }
}
