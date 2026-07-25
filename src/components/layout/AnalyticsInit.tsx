"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { initAmplitude, trackPageView, setUserId, identifyUser } from "@/lib/analytics";

export function AnalyticsInit() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const prevUserId = useRef<string | undefined>(undefined);

  useEffect(() => {
    // Init Amplitude once — pass userId if session is already loaded
    initAmplitude(session?.user?.id ?? undefined);
    prevUserId.current = session?.user?.id;
  }, []);

  // Track page views
  useEffect(() => {
    if (!pathname) return;
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

  // Track user ID changes (session loads after render) and sync user properties
  useEffect(() => {
    const user = session?.user;
    const uid = user?.id;
    if (uid && uid !== prevUserId.current) {
      setUserId(uid);
      identifyUser({
        name: user.name ?? "",
        email: user.email ?? "",
      });
      prevUserId.current = uid;
    }
  }, [session?.user?.id]);

  return null;
}
