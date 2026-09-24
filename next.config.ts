import type { NextConfig } from "next";

// public/ files keep fixed, unhashed URLs, which Next serves with `max-age=0`: every visit
// paid a revalidation round trip for the hero painting and the logos. Not content-hashed, so
// not immutable either: fresh for a week, then served from cache for up to a day more while
// it revalidates. A file replaced under the same name can take that long to reach a returning
// visitor; give it a new name to ship it at once.
const ASSET_CACHE = [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }];

const nextConfig: NextConfig = {
  images: {
    // AVIF first. At quality 90 the footer painting is ~196KB instead of ~499KB as WebP and
    // still matches the reference (qa/fix-meta-compare.mjs --footer); browsers without AVIF
    // get the WebP.
    formats: ["image/avif", "image/webp"],
    // The footer painting is served at 90; 75 stays the default for anything else.
    qualities: [75, 90],
  },
  async headers() {
    return [
      { source: "/:dir(img|logos)/:file*", headers: ASSET_CACHE },
      // The metadata files in src/app. Their <link> and og:image URLs carry a content hash,
      // but crawlers and touch-icon lookups also fetch the bare paths.
      { source: "/:file(icon\\.svg|apple-icon\\.png|opengraph-image\\.png)", headers: ASSET_CACHE },
    ];
  },
};

export default nextConfig;
