import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    await connectDB();
    const dbUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: { lastSeen: new Date() } },
      { returnDocument: "after" }
    ).select("-password");

    if (dbUser) {
      const fullUser = {
        id: dbUser._id.toString(),
        _id: dbUser._id.toString(),
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role,
        phone: dbUser.phone || "",
        emailVerified: dbUser.emailVerified ?? false,
        avatar: dbUser.avatar || "",
        bio: dbUser.bio || "",
        skills: dbUser.skills || [],
        following: dbUser.following || [],
        followers: dbUser.followers || [],
        tier: dbUser.tier || "free",
        apiKey: dbUser.apiKey || null,
        company: dbUser.company || "",
        website: dbUser.website || "",
        github: dbUser.github || "",
        twitter: dbUser.twitter || "",
        location: dbUser.location || "",
        industry: dbUser.industry || "",
        profileVisibility: dbUser.profileVisibility || {},
        lastSeen: dbUser.lastSeen,
        createdAt: dbUser.createdAt,
      };
      return NextResponse.json({ authenticated: true, user: fullUser });
    }
  } catch (_) {}

  return NextResponse.json({ authenticated: true, user: session.user });
}
