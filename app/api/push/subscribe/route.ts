import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import PushSubscription from "@/lib/models/PushSubscription";
import { getSession } from "@/lib/auth";

export async function GET() {
  return NextResponse.json({ publicKey: process.env.VAPID_PUBLIC_KEY || "" });
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { subscription } = await req.json();
    if (!subscription?.endpoint || !subscription?.keys) {
      return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
    }

    await PushSubscription.findOneAndUpdate(
      { endpoint: subscription.endpoint },
      {
        userId: session.user.id,
        endpoint: subscription.endpoint,
        keys: subscription.keys,
        createdAt: new Date(),
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Push subscribe error:", error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { endpoint } = await req.json();
    if (endpoint) {
      await PushSubscription.deleteOne({ endpoint, userId: session.user.id });
    } else {
      await PushSubscription.deleteMany({ userId: session.user.id });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to unsubscribe" }, { status: 500 });
  }
}
