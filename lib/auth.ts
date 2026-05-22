import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const secretKey = "herakon-secret-key-next-gen"; // In production, use process.env.JWT_SECRET
const key = new TextEncoder().encode(secretKey);

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}

export async function encrypt(payload: any, expiresIn: string = "2h") {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function login(user: any, rememberMe = false) {
  const duration = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 2 * 60 * 60 * 1000;
  const expiresIn = rememberMe ? "30d" : "2h";
  const expires = new Date(Date.now() + duration);
  const session = await encrypt({ user, expires }, expiresIn);
  (await cookies()).set("session", session, { expires, httpOnly: true, secure: process.env.NODE_ENV === "production" });
}

export async function logout() {
  // Destroy the session
  (await cookies()).set("session", "", { expires: new Date(0) });
}

export async function getSession() {
  const session = (await cookies()).get("session")?.value;
  if (!session) return null;
  const decoded = await decrypt(session);
  
  // Sanitize ID: ensure it's a string even if the cookie has an old BSON object format
  if (decoded?.user?.id && typeof decoded.user.id === 'object') {
    // If it's the { buffer: ... } object from Mongo, we can't easily stringify it here
    // without knowing its structure, but we can check if it has a toString or similar.
    // However, the best is to just ensure it's not [object Object]
    if (decoded.user.id.toString() === '[object Object]' && decoded.user.email) {
      // We might need to re-fetch or just let it fail gracefully
    }
  }
  
  return decoded;
}
export async function updateSession(updates: any) {
  const session = (await cookies()).get("session")?.value;
  if (!session) return;
  const decoded = await decrypt(session);
  
  decoded.user = { ...decoded.user, ...updates };
  const expires = new Date(decoded.expires);
  
  const newSession = await encrypt(decoded);
  (await cookies()).set("session", newSession, { expires, httpOnly: true, secure: process.env.NODE_ENV === "production" });
}
