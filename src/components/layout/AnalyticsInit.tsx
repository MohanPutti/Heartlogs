"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { initAmplitude, trackPageView, setUserId } from "@/lib/analytics";

export function AnalyticsInit() {
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    initAmplitude();
  }, []);

  useEffect(() => {
    if (!pathname) return;
    // Map URL paths to human-readable page names
    const pageMap: Record<string, string> = {
      "/": "Landing",
      "/login": "Login",
      "/register": "Register",
      "/dashboard": "Dashboard",
      "/entry/new": "New Entry",
      "/calendar": "Calendar",
      "/search": "Search",
      "/settings": "Settings",
      "/features": "Features",
      "/blog": "Blog",
      "/privacy": "Privacy",
    };
    const pageName = pageMap[pathname] || (pathname.startsWith("/blog/") ? "Blog Post" : pathname.startsWith("/entry/") ? "Entry View" : pathname);
    trackPageView(pageName);
  }, [pathname]);

  useEffect(() => {
    setUserId(session?.user?.id ?? undefined);
  }, [session?.user?.id]);

  return null;
}
