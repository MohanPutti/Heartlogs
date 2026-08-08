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
        "/alternatives",
        "/vs/day-one",
        "/vs/journey",
        "/api/auth/session",
        "/api/blog/",
      ],
      disallow: ["/dashboard", "/entry/", "/calendar", "/search", "/settings", "/admin", "/api/"],
    },
    sitemap: "https://heartlogs.com/sitemap.xml",
  };
}
