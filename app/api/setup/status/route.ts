import { NextResponse } from "next/server";

export async function GET() {
  const vars = {
    MONGODB_URI: !!process.env.MONGODB_URI,
    JWT_SECRET: !!process.env.JWT_SECRET,
    EMAIL_USER: !!process.env.EMAIL_USER,
    EMAIL_PASS: !!process.env.EMAIL_PASS,
    NEXT_PUBLIC_BASE_URL: !!process.env.NEXT_PUBLIC_BASE_URL,
    VAPID_PUBLIC_KEY: !!process.env.VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY: !!process.env.VAPID_PRIVATE_KEY,
    VAPID_EMAIL: !!process.env.VAPID_EMAIL,
  };

  const requiredKeys = ["MONGODB_URI", "JWT_SECRET"];
  const allRequiredSet = requiredKeys.every(k => vars[k as keyof typeof vars]);

  return NextResponse.json({ vars, allRequiredSet });
}
