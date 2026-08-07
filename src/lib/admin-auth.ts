import { SignJWT, jwtVerify } from "jose";

export const ADMIN_COOKIE_NAME = "admin-session";
const SESSION_DURATION = "12h";

function getSecret(): Uint8Array {
  const secret = process.env.ADMIN_AUTH_SECRET;
  if (!secret) throw new Error("ADMIN_AUTH_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export async function createAdminSessionToken(): Promise<string> {
  return new SignJWT({ admin: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_DURATION)
    .sign(getSecret());
}

export async function verifyAdminSessionToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload.admin === true;
  } catch {
    return false;
  }
}
