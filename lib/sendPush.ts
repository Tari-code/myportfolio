import webpush from "web-push";
import connectDB from "@/lib/mongodb";
import PushSubscriptionModel from "@/lib/models/PushSubscription";

let vapidConfigured = false;

function ensureVapid() {
  if (vapidConfigured) return;
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const email = process.env.VAPID_EMAIL || "mailto:admin@taritech.dev";
  if (publicKey && privateKey) {
    webpush.setVapidDetails(email, publicKey, privateKey);
    vapidConfigured = true;
  }
}

export async function sendPushToUser(
  userId: string,
  payload: { title: string; body: string; url?: string; tag?: string }
) {
  try {
    ensureVapid();
    if (!vapidConfigured) return;

    await connectDB();
    const subs = await PushSubscriptionModel.find({ userId });
    if (!subs.length) return;

    const data = JSON.stringify(payload);
    const results = await Promise.allSettled(
      subs.map((sub) =>
        webpush.sendNotification(
          { endpoint: sub.endpoint, keys: sub.keys },
          data
        )
      )
    );

    // Remove expired/invalid subscriptions
    for (let i = 0; i < results.length; i++) {
      const r = results[i];
      if (r.status === "rejected") {
        const err = r.reason as any;
        if (err?.statusCode === 410 || err?.statusCode === 404) {
          await PushSubscriptionModel.deleteOne({ _id: subs[i]._id });
        }
      }
    }
  } catch (err) {
    console.error("sendPush error:", err);
  }
}
