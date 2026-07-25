import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_PATHS = ["/", "/login", "/register", "/features", "/blog", "/privacy", "/sitemap.xml", "/robots.txt"];

async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Always allow through
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/register") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const isPublic = PUBLIC_PATHS.some((p) => p === "/" ? pathname === "/" : pathname.startsWith(p));

  const secureCookie = req.nextUrl.protocol === "https:";
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    cookieName: secureCookie ? "__Secure-authjs.session-token" : "authjs.session-token",
  });
  const isLoggedIn = !!token;

  if (isPublic && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!isPublic && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export { proxy };
export default proxy;

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
