import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Ticket from "@/lib/models/Ticket";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const user = searchParams.get("user");
    
    let tickets;
    if (user) {
      tickets = await Ticket.find({ 
        $or: [{ email: user }, { user: user }] 
      }).sort({ createdAt: -1 });
    } else {
      tickets = await Ticket.find({}).sort({ createdAt: -1 });
    }
    
    return NextResponse.json(tickets);
  } catch (error) {
    console.error("Fetch tickets error:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json().catch(() => ({}));
    const { action, id, message, user: ticketUser, email: ticketEmail } = body;

    if (action === "resolve" && id) {
      await Ticket.findByIdAndUpdate(id, { status: "resolved" });
      return NextResponse.json({ success: true });
    }

    if (action === "markRead" && id) {
      const email = body.email;
      if (email) {
        await Ticket.findByIdAndUpdate(id, { $addToSet: { readBy: email } });
      }
      return NextResponse.json({ success: true });
    }

    if (action === "reply" && id && message) {
      const sender = body.sender || "admin";
      const ticket = await Ticket.findById(id);
      if (ticket) {
        ticket.replies.push({
          sender: sender,
          text: message,
          time: new Date()
        });
        await ticket.save();
        return NextResponse.json({ success: true, ticket });
      }
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    if (action === "create") {
      if (!ticketUser || !message) {
        return NextResponse.json({ error: "User and message are required" }, { status: 400 });
      }

      const ticket = await Ticket.create({
        user: ticketUser,
        email: ticketEmail || "",
        message: message,
        status: "open",
        replies: []
      });
      return NextResponse.json({ success: true, ticket });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Process tickets error:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
