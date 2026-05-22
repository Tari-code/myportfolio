import connectDB from "@/lib/mongodb";
import Notification from "@/lib/models/Notification";

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
  } catch (err) {
    console.error("createNotification error:", err);
  }
}
