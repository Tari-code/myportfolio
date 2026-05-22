import connectDB from "@/lib/mongodb";
import Notification from "@/lib/models/Notification";
import { sendPushToUser } from "@/lib/sendPush";

export async function createNotification({
  userId,
  type,
  title,
  message,
  link = "",
  metadata = {},
}: {
  userId: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  metadata?: Record<string, any>;
}) {
  try {
    await connectDB();
    await Notification.create({ userId, type, title, message, link, metadata });

    // Fire push notification (non-blocking)
    sendPushToUser(userId, {
      title,
      body: message,
      url: link || "/dashboard?tab=notifications",
      tag: type,
    }).catch(() => {});
  } catch (err) {
    console.error("createNotification error:", err);
  }
}
