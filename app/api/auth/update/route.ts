import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";
import { getSession, hashPassword, updateSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, phone, password, bio, skills } = await req.json();
    const userId = session.user.id;

    const updateData: any = { name, phone };

    if (password) {
      updateData.password = await hashPassword(password);
    }
    if (typeof bio === "string") {
      updateData.bio = bio;
    }
    if (Array.isArray(skills)) {
      updateData.skills = skills;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await updateSession({ name: updatedUser.name });

    return NextResponse.json({ 
      success: true, 
      user: { 
        id: updatedUser._id, 
        name: updatedUser.name, 
        email: updatedUser.email, 
        role: updatedUser.role,
        phone: updatedUser.phone,
        bio: updatedUser.bio || "",
        skills: updatedUser.skills || []
      } 
    });
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
