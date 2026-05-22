import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Message from "@/lib/models/Message";
import User from "@/lib/models/User";
import mongoose from "mongoose";

export async function GET(req: Request) {
  try {
    await connectDB();
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUserId = session.user.id;
    const { searchParams } = new URL(req.url);
    const chatWith = searchParams.get("chatWith");
    const conversations = searchParams.get("conversations");

    if (chatWith) {
      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(chatWith)) {
        return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
      }

      // Fetch messages between current user and target user
      const messages = await Message.find({
        $or: [
          { sender: currentUserId, recipient: chatWith },
          { sender: chatWith, recipient: currentUserId }
        ]
      }).sort({ createdAt: 1 });

      // Mark received messages as read
      await Message.updateMany(
        { sender: chatWith, recipient: currentUserId, read: false },
        { $set: { read: true } }
      );

      return NextResponse.json(messages);
    }

    if (conversations === "true" || !chatWith) {
      // Fetch list of conversations with last message and unread count
      // Find all messages involving current user
      const messages = await Message.find({
        $or: [{ sender: currentUserId }, { recipient: currentUserId }]
      }).sort({ createdAt: -1 });

      // Group by distinct other user
      const userIds = new Set<string>();
      const lastMessages: any[] = [];
      const unreadCounts: { [key: string]: number } = {};

      for (const msg of messages) {
        const senderStr = msg.sender.toString();
        const recipientStr = msg.recipient.toString();
        const otherUserId = senderStr === currentUserId ? recipientStr : senderStr;

        // Calculate unread count
        if (recipientStr === currentUserId && !msg.read) {
          unreadCounts[otherUserId] = (unreadCounts[otherUserId] || 0) + 1;
        }

        if (!userIds.has(otherUserId)) {
          userIds.add(otherUserId);
          lastMessages.push({
            otherUserId,
            text: msg.text,
            time: msg.createdAt,
            sender: senderStr
          });
        }
      }

      // Fetch user details for each otherUser
      const distinctUserIds = Array.from(userIds);
      const users = await User.find({ _id: { $in: distinctUserIds } }).select("name email avatar bio lastSeen");

      const conversationList = lastMessages.map(lm => {
        const userDetail = users.find(u => u._id.toString() === lm.otherUserId);
        return {
          user: userDetail || { _id: lm.otherUserId, name: "Unknown User", email: "" },
          lastMessage: lm.text,
          time: lm.time,
          lastSender: lm.sender,
          unreadCount: unreadCounts[lm.otherUserId] || 0
        };
      });

      return NextResponse.json(conversationList);
    }

    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  } catch (error: any) {
    console.error("Direct Message GET error:", error);
    return NextResponse.json({ error: error.message || "Failed to retrieve messages" }, { status: 500 });
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
    const { recipientId, text } = body;

    if (!recipientId || !text || !text.trim()) {
      return NextResponse.json({ error: "Recipient and message text are required" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(recipientId)) {
      return NextResponse.json({ error: "Invalid recipient ID" }, { status: 400 });
    }

    const recipientExists = await User.findById(recipientId);
    if (!recipientExists) {
      return NextResponse.json({ error: "Recipient not found" }, { status: 404 });
    }

    const newMessage = await Message.create({
      sender: currentUserId,
      recipient: recipientId,
      text: text.trim()
    });

    return NextResponse.json({ success: true, message: newMessage });
  } catch (error: any) {
    console.error("Direct Message POST error:", error);
    return NextResponse.json({ error: error.message || "Failed to send message" }, { status: 500 });
  }
}
