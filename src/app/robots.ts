import type { MetadataRoute } from "next";

// Everything is public. The sitemap URL uses the same origin as the page metadata (layout.tsx).
export default function robots(): MetadataRoute.Robots {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://3264.ai";
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", origin).href,
  };
}
