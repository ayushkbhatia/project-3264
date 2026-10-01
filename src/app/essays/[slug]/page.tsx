import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/app/shared-metadata";
import { EssayPage } from "@/components/essays/EssayPage";
import { getEssay, getEssays, summarize } from "@/content/essays-source";

// The fifteen essays, from src/content/essays/*.md, each on the shared EssayPage template
// (ported from design_handoff_essays: "Essay NN - ….dc.html"). All static; unknown slugs 404.

export const dynamicParams = false;

export function generateStaticParams() {
  return getEssays().map((e) => ({ slug: e.front.slug }));
}

export async function generateMetadata({ params }: PageProps<"/essays/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const essay = getEssay(slug);
  if (!essay) return {};
  const { title: name, dek, date } = essay.front;
  // As the prototypes title them: the essay first, the site after.
  const title = `${name} — 3264.ai`;
  return pageMetadata({
    title,
    description: dek,
    openGraph: { type: "article", publishedTime: date, section: essay.front.category },
  });
}

export default async function EssayRoute({ params }: PageProps<"/essays/[slug]">) {
  const { slug } = await params;
  const essay = getEssay(slug);
  if (!essay) notFound();
  return <EssayPage essay={essay} all={getEssays().map(summarize)} />;
}
