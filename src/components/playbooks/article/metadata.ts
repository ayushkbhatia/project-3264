import type { Metadata } from "next";
import { pageMetadata } from "@/app/shared-metadata";
import type { PlaybookArticle } from "./types";

/** A playbook page's metadata: the site's page metadata, share image included, as an article. */
export function articleMetadata(article: PlaybookArticle): Metadata {
  const { title, description } = article.meta;
  return pageMetadata({ title, description, openGraph: { type: "article", modifiedTime: article.reviewed.iso } });
}
