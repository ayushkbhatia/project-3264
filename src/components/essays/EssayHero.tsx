import Image, { type StaticImageData } from "next/image";
import { SmartLink } from "@/components/home/primitives";
import { CopyLink } from "@/components/playbooks/article/CopyLink";
import { longDate, page, route, type EssayFront } from "@/content/essays";
import { HERO_SIZES } from "./media";

/**
 * An essay's hero (#top): eyebrow with its category, h1, the summary set upright, the meta row
 * (date, read time, copy link), the byline and the painting at 16:9. Under 1048px, where the
 * sidebar is gone, "← All essays" opens it instead.
 *
 * The category link opens the index filtered to that category (the prototype links to the
 * index as a whole; the index reads ?category= on load). The read time is computed on the
 * server (read-time.ts), so it is in the first paint and never shifts the row.
 */
export function EssayHero({ front, readMinutes, image }: { front: EssayFront; readMinutes: number; image: StaticImageData }) {
  return (
    <div id="top" data-pb-anchor="" data-screen-label="Hero">
      <SmartLink
        href={page.back.href}
        className="relative mb-6 inline-flex text-[13.5px] text-sec before:absolute before:-inset-1 before:content-[''] min-[1048px]:hidden"
      >
        {/* one flex item, so the arrow keeps its space */}
        <span>
          <span aria-hidden="true">{"← "}</span>
          {page.back.label}
        </span>
      </SmartLink>
      <div className="text-[13px] text-sec">
        {page.eyebrow} ·{" "}
        <SmartLink
          href={`${route}?category=${front.category.toLowerCase()}`}
          className="border-b border-[rgba(20,20,18,0.25)] text-ink hover:border-a hover:text-a"
        >
          {front.category}
        </SmartLink>
      </div>
      <h1 className="mt-3.5 mb-0 text-[clamp(34px,3.8vw,48px)] leading-[1.02] font-normal tracking-[-0.038em]">{front.title}</h1>
      <p className="mt-4 mb-0 text-[clamp(16.5px,1.4vw,18.5px)] leading-[1.45] tracking-[-0.01em] text-sec">{front.dek}</p>
      <div className="mt-[22px] flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-rule-2 pt-3 text-[12.5px] text-mut">
        <time dateTime={front.date}>{longDate(front.date)}</time>
        <span>{readMinutes} min read</span>
        <CopyLink />
      </div>
      <div className="mt-[26px] flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex size-9 flex-none items-center justify-center rounded-full bg-ink font-mono text-[10px] tracking-[0.02em] text-[#F4F3F0]"
        >
          {page.byline.mark}
        </span>
        <span className="flex flex-col">
          <span className="text-[14px] leading-[1.3]">{page.byline.name}</span>
          <span className="text-[12.5px] leading-[1.3] text-mut">
            {page.byline.series} · No. {front.num}
          </span>
        </span>
      </div>
      <figure className="mt-8 mb-0">
        {/* content-box, as in the reference: the 16:9 is the box inside the 1px border */}
        <div aria-hidden="true" className="relative box-content aspect-video overflow-hidden rounded-[16px] border border-[rgba(20,20,18,0.06)] bg-[#E2DFD8]">
          <Image src={image} alt="" fill sizes={HERO_SIZES} loading="eager" fetchPriority="high" className="object-cover" />
        </div>
      </figure>
    </div>
  );
}
