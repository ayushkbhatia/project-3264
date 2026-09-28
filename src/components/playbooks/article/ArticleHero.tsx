import type { ReactNode } from "react";
import { SmartLink } from "@/components/home/primitives";
import { CopyLink } from "./CopyLink";
import type { PlaybookArticle } from "./types";

type Link = { label: string; href: string };

/** 40px buttons: the page CTA (ink) and the secondary (outlined). */
const button = "box-border inline-flex h-10 items-center rounded-[6px] px-[18px] text-[13.5px] font-medium tracking-[-0.005em]";

/**
 * The hero (#top): eyebrow with the industry link, h1, one-liner, meta row (reviewed date, read
 * time, copy link), standfirst, the two buttons and the hero figure. Under 1048px, where the
 * sidebar is gone, the "← All playbooks" link opens it instead.
 *
 * The read time is computed on the server (read-time.ts) rather than 900ms after mount as in
 * the reference, so it is in the first paint and never shifts the row.
 */
export function ArticleHero({
  article,
  cta,
  readMinutes,
  figure,
}: {
  article: PlaybookArticle;
  cta: Link;
  readMinutes: number;
  figure: ReactNode;
}) {
  const { hero, back, reviewed } = article;
  return (
    <div id="top" data-pb-anchor="" data-screen-label="Hero">
      <SmartLink
        href={back.href}
        className="relative mb-6 inline-flex text-[13.5px] text-sec before:absolute before:-inset-1 before:content-[''] min-[1048px]:hidden"
      >
        {/* one flex item, so the arrow keeps its space */}
        <span>
          <span aria-hidden="true">{"← "}</span>
          {back.label}
        </span>
      </SmartLink>
      <div className="text-[13px] text-sec">
        Playbook ·{" "}
        <SmartLink
          href={hero.category.href}
          className="border-b border-[rgba(20,20,18,0.25)] text-ink hover:border-a hover:text-a"
        >
          {hero.category.label}
        </SmartLink>
      </div>
      <h1 className="mt-3.5 mb-0 text-[clamp(34px,3.8vw,48px)] leading-[1.02] font-normal tracking-[-0.038em]">{hero.title}</h1>
      <p className="mt-4 mb-0 text-[clamp(16.5px,1.4vw,18.5px)] leading-[1.45] tracking-[-0.01em] text-sec">{hero.oneLiner}</p>
      <div className="mt-[22px] flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-rule-2 pt-3 text-[12.5px] text-mut">
        <time dateTime={reviewed.iso}>{reviewed.label}</time>
        <span>{readMinutes} min read</span>
        <CopyLink />
      </div>
      <p className="mt-[26px] mb-0 text-[16px] leading-[1.7] text-ink-2">{hero.standfirst}</p>
      <div className="mt-6 flex flex-wrap gap-2.5">
        <SmartLink href={cta.href} className={`${button} bg-ink text-white hover:bg-a hover:text-white forced-colors:border`}>
          {cta.label}
        </SmartLink>
        <SmartLink href={hero.secondary.href} className={`${button} border border-line bg-white text-ink hover:border-a hover:text-a`}>
          {hero.secondary.label}
        </SmartLink>
      </div>
      {figure}
    </div>
  );
}
