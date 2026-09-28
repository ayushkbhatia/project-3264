import type { Metadata } from "next";
import type { PlaybookArticle } from "./types";

/**
 * A playbook page's metadata. Setting `openGraph` on a page replaces the root layout's, and
 * with it the site share image the root's opengraph-image.png file supplies, so the image is
 * named here again (resolved against metadataBase; X falls back to og:image).
 */
export function articleMetadata(article: PlaybookArticle): Metadata {
  const { title, description } = article.meta;
  return {
    title,
    description,
    openGraph: {
      type: "article",
      siteName: "3264.ai",
      locale: "en_US",
      title,
      description,
      url: "./",
      modifiedTime: article.reviewed.iso,
      images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "3264.ai — Deployment is the deliverable." }],
    },
  };
}
