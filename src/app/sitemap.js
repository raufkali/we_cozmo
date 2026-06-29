// app/sitemap.js
import { siteMeta } from "@/config/sitemeta";

export default async function sitemap() {
  const baseUrl = siteMeta.siteUrl;

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];
}
