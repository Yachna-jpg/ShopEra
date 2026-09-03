import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
 
const ACCESS_SECRET = process.env.JWT_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
 
export function signAccessToken(payload: { userId: string; role: string }) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: "15m" });
}
 
export function signRefreshToken(payload: { userId: string }) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });
}
 
export function verifyAccessToken(token: string) {
  try {
    return jwt.verify(token, ACCESS_SECRET) as { userId: string; role: string };
  } catch {
    return null;
  }
}
 
export function verifyRefreshToken(token: string) {
  try {
    return jwt.verify(token, REFRESH_SECRET) as { userId: string };
  } catch {
    return null;
  }
}
 
export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (!token) return null;
  return verifyAccessToken(token);
}
