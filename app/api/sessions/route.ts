import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Session from "@/lib/models/Session";
import { getSession } from "@/lib/auth";
import { logout } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const currentSessionId = session?.sessionId;
    const sessions = await Session.find({ userId: session.user.id, isRevoked: false })
      .sort({ lastActive: -1 })
      .limit(20)
      .lean();

    const enriched = sessions.map((s: any) => ({
      ...s,
      isCurrent: s.sessionId === currentSessionId,
    }));

    return NextResponse.json(enriched);
  } catch (error) {
    console.error("Sessions GET error:", error);
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getSession();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) return NextResponse.json({ error: "Session ID required" }, { status: 400 });

    await connectDB();

    await Session.updateOne(
      { sessionId, userId: session.user.id },
      { isRevoked: true }
    );

    const isCurrent = session?.sessionId === sessionId;
    if (isCurrent) {
      (await cookies()).set("session", "", { expires: new Date(0) });
    }

    return NextResponse.json({ success: true, loggedOut: isCurrent });
  } catch (error) {
    console.error("Sessions DELETE error:", error);
    return NextResponse.json({ error: "Failed to revoke session" }, { status: 500 });
  }
}
