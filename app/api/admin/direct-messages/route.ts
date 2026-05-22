import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Message from "@/lib/models/Message";
import User from "@/lib/models/User";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId1 = searchParams.get("user1");
    const userId2 = searchParams.get("user2");

    if (userId1 && userId2) {
      const messages = await Message.find({
        $or: [
          { sender: userId1, recipient: userId2 },
          { sender: userId2, recipient: userId1 }
        ]
      })
        .sort({ createdAt: 1 })
        .populate("sender", "name email")
        .populate("recipient", "name email");
      return NextResponse.json(messages);
    }

    const allMessages = await Message.find()
      .sort({ createdAt: -1 });

    const pairMap = new Map<string, any>();

    for (const msg of allMessages) {
      const s = msg.sender.toString();
      const r = msg.recipient.toString();
      const key = [s, r].sort().join("_");
      if (!pairMap.has(key)) {
        pairMap.set(key, {
          user1Id: s,
          user2Id: r,
          lastMessage: msg.text,
          lastTime: msg.createdAt,
          messageCount: 1
        });
      } else {
        pairMap.get(key).messageCount++;
      }
    }

    const pairs = Array.from(pairMap.values());

    const userIds = new Set<string>();
    pairs.forEach(p => { userIds.add(p.user1Id); userIds.add(p.user2Id); });
    const users = await User.find({ _id: { $in: Array.from(userIds) } }).select("name email");
    const userMap = new Map(users.map(u => [u._id.toString(), u]));

    const conversations = pairs.map(p => ({
      user1: userMap.get(p.user1Id) || { _id: p.user1Id, name: "Unknown", email: "" },
      user2: userMap.get(p.user2Id) || { _id: p.user2Id, name: "Unknown", email: "" },
      lastMessage: p.lastMessage,
      lastTime: p.lastTime,
      messageCount: p.messageCount
    })).sort((a, b) => new Date(b.lastTime).getTime() - new Date(a.lastTime).getTime());

    return NextResponse.json(conversations);
  } catch (error: any) {
    console.error("Admin DM GET error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch DMs" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId1 = searchParams.get("user1");
    const userId2 = searchParams.get("user2");

    if (!userId1 || !userId2) {
      return NextResponse.json({ error: "Missing user IDs" }, { status: 400 });
    }

    await Message.deleteMany({
      $or: [
        { sender: userId1, recipient: userId2 },
        { sender: userId2, recipient: userId1 }
      ]
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete conversation" }, { status: 500 });
  }
}
