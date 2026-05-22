import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/auth";

const CONFIG_KEY = "global_ops_switchboard";

async function getMaintenanceMode(): Promise<boolean> {
  try {
    const mongoose = await import('mongoose');
    
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) return false;

    let cached = (global as any).mongoose;
    if (!cached) {
      cached = (global as any).mongoose = { conn: null, promise: null };
    }

    if (!cached.conn) {
      if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
          bufferCommands: false,
        });
      }
      cached.conn = await cached.promise;
    }

    const SystemConfig = cached.conn.models.SystemConfig || 
      cached.conn.model('SystemConfig', new mongoose.Schema({
        key: { type: String, required: true, unique: true },
        maintenanceMode: { type: Boolean, default: false },
        chatbotActive: { type: Boolean, default: true },
        soundAlerts: { type: Boolean, default: true }
      }));

    const config = await SystemConfig.findOne({ key: CONFIG_KEY }).lean();
    return config?.maintenanceMode === true;
  } catch (error) {
    console.error("Maintenance check failed:", error);
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  const { pathname } = request.nextUrl;

  // Handle legacy routes
  if (pathname === "/login" || pathname === "/admin/login") {
    return NextResponse.redirect(new URL("/customer/login", request.url));
  }
  if (pathname === "/signup" || pathname === "/admin/signup") {
    return NextResponse.redirect(new URL("/customer/signup", request.url));
  }

  // Skip maintenance check for admin routes, API routes, static files, and auth pages
  const isProtectedPath = pathname.startsWith("/admin") || 
                         pathname.startsWith("/dashboard") || 
                         pathname.startsWith("/settings");
  const isAuthPage = [
    "/customer/login", 
    "/customer/signup", 
    "/admin/login", 
    "/admin/signup",
    "/maintenance"
  ].includes(pathname);
  const isStaticPath = pathname.startsWith("/_next") || pathname.includes(".");
  
  // Check maintenance mode for public pages only
  if (!isProtectedPath && !isAuthPage && !isStaticPath && pathname !== "/maintenance") {
    const maintenanceMode = await getMaintenanceMode();
    
    if (maintenanceMode) {
      const url = request.nextUrl.clone();
      url.pathname = "/maintenance";
      return NextResponse.rewrite(url);
    }
  }

  // Paths that require authentication
  if (isProtectedPath && !isAuthPage) {
    if (!session) {
      return NextResponse.redirect(new URL("/customer/login", request.url));
    }

    try {
      const payload = await decrypt(session);
      const userRole = payload.user.role;
      const isAdminPath = pathname.startsWith("/admin");

      // Redirect non-admins away from admin paths
      if (isAdminPath && userRole !== "admin") {
        return NextResponse.redirect(new URL("/", request.url));
      }
      
      // Both admins and customers can access /dashboard and /settings
    } catch (error) {
      return NextResponse.redirect(new URL("/customer/login", request.url));
    }
  }

  // If user is already logged in, redirect away from auth pages
  if (isAuthPage && session) {
    try {
      const payload = await decrypt(session);
      if (payload.user.role === "admin") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.redirect(new URL("/", request.url));
    } catch (error) {
      // invalid session, let them stay on auth page
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/settings/:path*",
    "/customer/login",
    "/customer/signup",
    "/login",
    "/signup",
    "/((?!api|_next/static|_next/image|favicon.ico|maintenance).*)",
  ],
};