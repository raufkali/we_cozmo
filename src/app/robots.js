// app/robots.js
import { siteMeta } from "@/config/sitemeta";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: `${siteMeta.siteUrl}/sitemap.xml`,
  };
}
