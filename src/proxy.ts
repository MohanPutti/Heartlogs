import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Paths that are accessible to everyone but redirect to dashboard when logged in
const AUTH_PAGES = ["/", "/login", "/register"];

// Public content pages — always accessible, even when logged in
const PUBLIC_CONTENT = ["/features", "/blog", "/privacy", "/alternatives", "/vs/", "/donate", "/sitemap.xml", "/robots.txt"];

async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Always allow through
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/register") ||
    pathname.startsWith("/api/blog") ||
    pathname.startsWith("/api/donate") ||
    pathname.startsWith("/api/webhooks") ||
    pathname.startsWith("/admin") || // admin auth is separate, enforced in src/app/admin/(protected)/layout.tsx
    pathname.startsWith("/api/admin") ||
    pathname.startsWith("/_next") ||
    /\.(ico|svg|png|jpe?g|gif|webp|txt|xml|webmanifest)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  const secureCookie = req.nextUrl.protocol === "https:";
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    cookieName: secureCookie ? "__Secure-authjs.session-token" : "authjs.session-token",
  });
  const isLoggedIn = !!token;

  // Auth pages (landing, login, register) — serve to everyone,
  // but redirect to dashboard if already logged in
  if (AUTH_PAGES.some((p) => p === "/" ? pathname === "/" : pathname.startsWith(p))) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // Allow public content pages regardless of auth state
  if (PUBLIC_CONTENT.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Protected pages require login
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export { proxy };
export default proxy;

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|.*\\.(?:ico|svg|png|jpe?g|gif|webp|txt|xml|webmanifest)$).*)",
  ],
};
