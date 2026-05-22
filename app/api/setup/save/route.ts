import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const ALLOWED_KEYS = [
  "MONGODB_URI",
  "JWT_SECRET",
  "EMAIL_USER",
  "EMAIL_PASS",
  "NEXT_PUBLIC_BASE_URL",
  "VAPID_PUBLIC_KEY",
  "VAPID_PRIVATE_KEY",
  "VAPID_EMAIL",
];

function parseEnvFile(content: string): Record<string, string> {
  const result: Record<string, string> = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
    result[key] = val;
  }
  return result;
}

function serializeEnvFile(vars: Record<string, string>): string {
  return Object.entries(vars)
    .map(([k, v]) => {
      const needsQuotes = v.includes(" ") || v.includes("#") || v.includes("=");
      return `${k}=${needsQuotes ? `"${v}"` : v}`;
    })
    .join("\n") + "\n";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const envPath = path.join(process.cwd(), ".env.local");

    let existing: Record<string, string> = {};
    if (fs.existsSync(envPath)) {
      existing = parseEnvFile(fs.readFileSync(envPath, "utf-8"));
    }

    for (const [key, value] of Object.entries(body)) {
      if (!ALLOWED_KEYS.includes(key)) continue;
      if (typeof value === "string" && value.trim()) {
        existing[key] = value.trim();
      }
    }

    fs.writeFileSync(envPath, serializeEnvFile(existing), "utf-8");

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
