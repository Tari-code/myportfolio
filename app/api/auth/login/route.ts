import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";
import Session from "@/lib/models/Session";
import { comparePassword, login } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, password, rememberMe } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const userResponse = { id: user._id.toString(), name: user.name, email: user.email, role: user.role, emailVerified: user.emailVerified };

    // Create session record
    const sessionId = crypto.randomUUID();
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = req.headers.get("user-agent") || "";

    await Session.create({
      userId: user._id,
      sessionId,
      userAgent,
      ip,
    });

    // Fire-and-forget geo lookup
    if (ip !== "unknown" && ip !== "127.0.0.1" && !ip.startsWith("::")) {
      fetch(`https://ipapi.co/${ip}/json/`)
        .then(r => r.json())
        .then(geo => {
          if (geo?.city || geo?.country_name) {
            Session.updateOne({ sessionId }, {
              city: geo.city || "",
              country: geo.country_name || "",
            }).catch(() => {});
          }
        })
        .catch(() => {});
    }

    await login(userResponse, !!rememberMe, sessionId);

    return NextResponse.json({ success: true, user: userResponse });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
