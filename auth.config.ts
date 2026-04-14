import type { NextAuthConfig } from "next-auth";

// Edge-compatible auth config (no Prisma imports)
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      const publicPaths = ["/login", "/register"];
      const isPublic = publicPaths.some((p) => pathname.startsWith(p));
      const isApiAuth = pathname.startsWith("/api/auth");
      const isApiRegister = pathname.startsWith("/api/register");

      if (isApiAuth || isApiRegister) return true;
      if (isPublic && isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      if (!isPublic && !isLoggedIn) return false;
      return true;
    },
  },
  providers: [], // Providers added in lib/auth.ts
};
