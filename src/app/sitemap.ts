import type { MetadataRoute } from "next";

// The home page only. The nav's other routes (content/home.ts `routes`) 404 until those pages
// ship; add each one here when it does.
export default function sitemap(): MetadataRoute.Sitemap {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://3264.ai";
  return [{ url: new URL("/", origin).href, changeFrequency: "monthly", priority: 1 }];
}
