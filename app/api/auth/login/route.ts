import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";
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
    await login(userResponse, !!rememberMe);

    return NextResponse.json({ success: true, user: userResponse });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
