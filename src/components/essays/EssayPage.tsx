import { Footer } from "@/components/home/Footer";
import { Header } from "@/components/home/Header";
import { ArticleShell } from "@/components/playbooks/article/ArticleShell";
import { ArticleClosing } from "@/components/playbooks/article/ArticleEnd";
import type { TocEntry } from "@/components/playbooks/article/types";
import { articleFooterColumns, articleNav, essayCta, essayHref, headerCta, page, type EssaySummary } from "@/content/essays";
import type { Essay } from "@/content/essays-source";
import { EssayBody } from "./EssayBody";
import { EssayHero } from "./EssayHero";
import { essayImage } from "./media";
import { MoreEssays, pickMore } from "./MoreEssays";

// EssayPage: the template all fifteen essays share (design_handoff_essays, "Template 2"). It is
// built on the playbook pages' article shell, as the handoff says: the sticky contents with its
// coverage rail and the phone "On this page" bar (ArticleShell), the header's reading-progress
// bar, and the closing panel (ArticleClosing) are theirs; the hero, the body and More essays
// are the essay's own.
//
// Static apart from the shell's scroll-spy and the copy link. Every CTA uses the mapping
// session, the prototypes' default `ctaLabel`.

function tocFor({ doc }: Essay): TocEntry[] {
  return [
    { id: "top", num: "", label: page.overviewLabel, subs: [] },
    ...doc.sections.map((s) => ({ id: s.id, num: s.num ?? "", label: s.label, subs: [] })),
    { id: "sources", num: "", label: page.sourcesLabel, subs: [] },
  ];
}

/** Breadcrumbs and the article itself, for search engines. */
function StructuredData({ essay }: { essay: Essay }) {
  const { front } = essay;
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://3264.ai";
  const url = new URL(essayHref(front.slug), origin).href;
  const org = { "@type": "Organization", name: "3264.ai", url: new URL("/", origin).href };
  const data = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: new URL("/", origin).href },
        { "@type": "ListItem", position: 2, name: "Essays", item: new URL("/essays", origin).href },
        { "@type": "ListItem", position: 3, name: front.title, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: front.title,
      description: front.dek,
      datePublished: front.date,
      articleSection: front.category,
      mainEntityOfPage: url,
      author: org,
      publisher: org,
    },
  ];
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />
  );
}

export function EssayPage({ essay, all }: { essay: Essay; all: EssaySummary[] }) {
  const { front, doc, readMinutes } = essay;
  const cta = essayCta.mapping;
  const image = essayImage(front.image)!;
  const current = all.find((e) => e.slug === front.slug)!;
  return (
    <>
      <Header nav={articleNav} cta={headerCta} homeHref="/" collapseBelow="1000" menu progress />
      <ArticleShell toc={tocFor(essay)} back={page.back} card={page.sidebarCard} cta={cta}>
        <EssayHero front={front} readMinutes={readMinutes} image={image} />
        <EssayBody front={front} doc={doc} image={image} cta={cta} />
      </ArticleShell>
      <MoreEssays essays={pickMore(all, current)} />
      <ArticleClosing closing={page.closing} cta={cta} />
      {/* 20px gutters below 480px, as on the Playbooks pages */}
      <Footer columns={articleFooterColumns} className="max-[479.98px]:px-5" />
      <StructuredData essay={essay} />
    </>
  );
}
