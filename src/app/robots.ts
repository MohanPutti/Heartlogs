import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: [
        "/",
        "/login",
        "/register",
        "/features",
        "/blog",
        "/privacy",
        "/api/auth/session",
        "/api/blog/",
      ],
      disallow: ["/dashboard", "/entry/", "/calendar", "/search", "/settings", "/api/"],
    },
    sitemap: "https://heartlogs.com/sitemap.xml",
  };
}
