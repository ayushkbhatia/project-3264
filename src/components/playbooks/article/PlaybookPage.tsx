import type { ReactNode } from "react";
import { Footer } from "@/components/home/Footer";
import { Header } from "@/components/home/Header";
import { articleFooterColumns, articleNav, headerCta } from "@/content/playbooks";
import { ArticleShell } from "./ArticleShell";
import { ArticleClosing, MorePlaybooks } from "./ArticleEnd";
import { ArticleHero } from "./ArticleHero";
import { Blocks, Eyebrow, LinkCard, SectionTitle, type BlockContext } from "./blocks";
import { readMinutes } from "./read-time";
import type { ArticleSection, CtaVariant, PlaybookArticle, TocEntry } from "./types";

// PlaybookPage: the template every playbook page shares (design_handoff_covenant_watch, "Page
// anatomy"). A page is its content module plus its figures:
//
//   <PlaybookPage article={covenantWatch} figures={{ recompute: <Recompute />, … }} />
//
// Static apart from a few client islands: the contents and scroll-spy (ArticleShell), the copy
// link, the FAQ, and whatever the page's figures need (Covenant Watch: the hero reveal and the
// evidence-line hover).
//
// The reference's three props are the template's: `cta` picks the label and target of every
// page CTA, `showBuilt` off collapses the engineering section to its link card, and each page
// passes its own animate flag to its hero figure.

function tocFor(article: PlaybookArticle, showBuilt: boolean): TocEntry[] {
  return [
    { id: "top", num: "", label: article.overviewLabel, subs: [] },
    ...article.sections.map((s) => ({
      id: s.id,
      num: s.num ?? "",
      label: s.label,
      subs:
        s.technical && !showBuilt
          ? []
          : s.blocks.flatMap((b) => (b.type === "h3" && b.id ? [{ id: b.id, label: b.toc ?? b.text }] : [])),
    })),
  ];
}

function SectionView({ section, showBuilt, ctx }: { section: ArticleSection; showBuilt: boolean; ctx: BlockContext }) {
  const collapsed = section.technical && !showBuilt;
  const card = collapsed ? section.blocks.find((b) => b.type === "linkCard") : undefined;
  return (
    <section
      id={section.id}
      data-pb-anchor=""
      data-screen-label={(section.num ? section.num + " " : "") + section.label}
      className="pt-24"
    >
      {section.eyebrow ? <Eyebrow>{section.eyebrow}</Eyebrow> : null}
      {collapsed ? (
        card && card.type === "linkCard" ? <LinkCard label={card.label} title={card.title} link={card.link} className="mt-4" /> : null
      ) : (
        <>
          {section.title ? <SectionTitle afterEyebrow={!!section.eyebrow}>{section.title}</SectionTitle> : null}
          <Blocks blocks={section.blocks} ctx={ctx} />
        </>
      )}
    </section>
  );
}

/** Breadcrumbs and the article itself, for search engines. */
function StructuredData({ article }: { article: PlaybookArticle }) {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://3264.ai";
  const url = new URL(`/playbooks/${article.slug}`, origin).href;
  const data = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: new URL("/", origin).href },
        { "@type": "ListItem", position: 2, name: "Playbooks", item: new URL("/playbooks", origin).href },
        { "@type": "ListItem", position: 3, name: article.hero.title, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.hero.title,
      description: article.meta.description,
      dateModified: article.reviewed.iso,
      mainEntityOfPage: url,
      author: { "@type": "Organization", name: "3264.ai", url: new URL("/", origin).href },
      publisher: { "@type": "Organization", name: "3264.ai", url: new URL("/", origin).href },
    },
  ];
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />
  );
}

export function PlaybookPage({
  article,
  figures,
  cta: ctaVariant = "mapping",
  showBuilt = true,
}: {
  article: PlaybookArticle;
  /** The page's figures, by the ids its content's figure blocks (and hero) name. */
  figures: Record<string, ReactNode>;
  cta?: CtaVariant;
  showBuilt?: boolean;
}) {
  const cta = article.cta[ctaVariant];
  const ctx: BlockContext = { figures, cta, blockLabels: article.blockLabels };
  return (
    <>
      <Header nav={articleNav} cta={headerCta} homeHref="/" collapseBelow="1000" menu progress />
      <ArticleShell toc={tocFor(article, showBuilt)} back={article.back} card={article.sidebarCard} cta={cta}>
        <ArticleHero
          article={article}
          cta={cta}
          readMinutes={readMinutes(article, cta, showBuilt)}
          figure={figures[article.hero.figure]}
        />
        {article.sections.map((section) => (
          <SectionView key={section.id} section={section} showBuilt={showBuilt} ctx={ctx} />
        ))}
      </ArticleShell>
      <MorePlaybooks more={article.more} />
      <ArticleClosing closing={article.closing} cta={cta} />
      {/* 20px gutters below 480px, as on the Playbooks page */}
      <Footer columns={articleFooterColumns} className="max-[479.98px]:px-5" />
      <StructuredData article={article} />
    </>
  );
}
