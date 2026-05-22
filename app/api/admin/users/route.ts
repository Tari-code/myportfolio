import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";
import { getSession } from "@/lib/auth";
import { sendAdminTierChangeAlert, sendUserTierUpgradeEmail } from "@/lib/email";
import { createNotification } from "@/lib/createNotification";

export async function GET() {
  try {
    await connectDB();
    const session = await getSession();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await User.find({}, "-password").sort({ createdAt: -1 });
    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error("Fetch users error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const session = await getSession();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    if (id === session.user.id) {
      return NextResponse.json({ error: "You cannot delete your own account" }, { status: 400 });
    }

    await User.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await connectDB();
    const session = await getSession();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, role, tier, name, bio, skills, location, website, github, twitter, avatar } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const existingUser = await User.findById(id);
    if (!existingUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const update: Record<string, any> = {};
    if (role) update.role = role;
    if (tier) update.tier = tier;
    if (typeof name === "string" && name.trim()) update.name = name.trim();
    if (typeof bio === "string") update.bio = bio;
    if (Array.isArray(skills)) update.skills = skills;
    if (typeof location === "string") update.location = location;
    if (typeof website === "string") update.website = website;
    if (typeof github === "string") update.github = github;
    if (typeof twitter === "string") update.twitter = twitter;
    if (typeof avatar === "string") update.avatar = avatar;

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    await User.findByIdAndUpdate(id, { $set: update });

    // Fire-and-forget notifications on tier change
    if (tier && tier !== existingUser.tier) {
      const oldTier = existingUser.tier;
      sendAdminTierChangeAlert(existingUser.name, existingUser.email, oldTier, tier).catch(() => {});
      sendUserTierUpgradeEmail(existingUser.email, existingUser.name, tier).catch(() => {});
      createNotification({
        userId: existingUser._id.toString(),
        type: "tier_upgrade",
        title: `Your plan was upgraded to ${tier.toUpperCase()}`,
        message: `An admin has updated your account tier from ${oldTier.toUpperCase()} to ${tier.toUpperCase()}. Enjoy your new features!`,
        link: "/dashboard",
      }).catch(() => {});
      import("@/lib/models/ActivityLog").then(({ default: ActivityLog }) => {
        ActivityLog.create({
          type: "tier_change",
          userId: existingUser._id,
          userName: existingUser.name,
          userEmail: existingUser.email,
          meta: { from: oldTier, to: tier, changedBy: session.user.name }
        }).catch(() => {});
      }).catch(() => {});
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
