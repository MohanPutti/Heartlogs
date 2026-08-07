import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { ADMIN_COOKIE_NAME, createAdminSessionToken } from "@/lib/admin-auth";

// Used to keep bcrypt.compare timing constant even when the email doesn't match,
// so response time can't be used to enumerate whether ADMIN_EMAIL guessed correctly.
const DUMMY_HASH = "$2b$12$1ROEoD5khxr32KnkgdMpsOu3ZBUaRZ.mql1jTKhpNBci.dh92Evnu";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const emailMatches = email === process.env.ADMIN_EMAIL;
  const adminHash = Buffer.from(process.env.ADMIN_PASSWORD_HASH_B64 ?? "", "base64").toString("utf-8");
  const hashToCheck = emailMatches ? adminHash : DUMMY_HASH;
  const passwordMatches = await bcrypt.compare(password ?? "", hashToCheck);

  if (!emailMatches || !passwordMatches) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await createAdminSessionToken();
  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: req.nextUrl.protocol === "https:",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return res;
}
