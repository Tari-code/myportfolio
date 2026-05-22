import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";
import { getSession, updateSession } from "@/lib/auth";

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename") || "avatar.png";

  try {
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contentType = request.headers.get("content-type") || "image/png";
    const arrayBuffer = await request.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (buffer.length === 0) {
      return NextResponse.json({ error: "No data provided" }, { status: 400 });
    }

    // Upload to Vercel Blob
    const blob = await put(filename, buffer, {
      access: "public",
      contentType,
    });

    // Update User in DB
    await connectDB();
    const userId = session.user.id.toString();
    await User.findByIdAndUpdate(userId, { avatar: blob.url });
    await updateSession({ avatar: blob.url });

    return NextResponse.json(blob);
  } catch (error: any) {
    console.error("Upload error:", error);
    
    // Handle the specific "private store" error from Vercel
    if (error.message?.includes("private store")) {
      return NextResponse.json({ 
        error: "Your Vercel Blob store is set to 'Private'. Please create a 'Public' store in your Vercel Dashboard for profile pictures to work." 
      }, { status: 400 });
    }
    
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
