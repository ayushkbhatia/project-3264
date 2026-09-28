import Image from "next/image";
import { SmartLink } from "@/components/home/primitives";
import { closingWash, tileImages } from "@/components/playbooks/media";
import { PlaybookBadge } from "@/components/playbooks/PlaybookBadge";
import { categoryById, playbookBySlug, playbookHref } from "@/content/playbooks";
import type { PlaybookArticle } from "./types";

type Link = { label: string; href: string };

// Rendered widths, for `sizes`. More playbooks: a 1048px row inside clamp(20px, 4vw, 40px)
// padding, auto-fit columns of at least 250px with 20px gaps (three of ~309px from 859px wide,
// then two, then one). Closing: content-box, so at most 968 + 2 × 56 + 2 = 1082px.
const TILE_SIZES = "(min-width: 1048px) 310px, (min-width: 859px) 31vw, (min-width: 566px) 46vw, 92vw";
const CLOSING_SIZES = "(min-width: 1162px) 1082px, 92vw";

/** More playbooks: three related playbooks, each a 2:1 painted tile with its glass badge. */
export function MorePlaybooks({ more }: { more: PlaybookArticle["more"] }) {
  return (
    <section
      data-screen-label="More playbooks"
      aria-labelledby="more-playbooks"
      className="mx-auto box-border max-w-[1048px] px-[clamp(20px,4vw,40px)] pt-[120px]"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2.5 border-b border-rule-2 pb-[18px]">
        <h2 id="more-playbooks" className="m-0 text-[clamp(22px,2.2vw,28px)] leading-[1.15] font-normal tracking-[-0.026em]">
          {more.title}
        </h2>
        <SmartLink
          href={more.all.href}
          className="relative text-[13.5px] text-sec before:absolute before:-inset-1 before:content-[''] hover:text-a"
        >
          {more.all.label}
          <span aria-hidden="true"> →</span>
        </SmartLink>
      </div>
      <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(min(100%,250px),1fr))] gap-x-5 gap-y-7">
        {more.items.map(({ slug, blurb }) => {
          const playbook = playbookBySlug(slug)!;
          const id = `more-${slug}`;
          return (
            <SmartLink
              key={slug}
              href={playbookHref(slug)}
              aria-labelledby={`${id}-name`}
              aria-describedby={`${id}-blurb`}
              className="flex flex-col text-ink hover:text-a"
            >
              <div className="relative block aspect-[2/1] overflow-hidden rounded-[14px] bg-[#E2DFD8]">
                <Image src={tileImages[slug]} alt="" fill sizes={TILE_SIZES} className="object-cover" />
                <PlaybookBadge slug={slug} size="34%" />
              </div>
              <span className="mt-3.5 text-[12px] text-mut">{categoryById(playbook.category).label}</span>
              <h3 id={`${id}-name`} className="mt-1 mb-0 text-[17.5px] leading-[1.25] font-normal tracking-[-0.02em]">
                {playbook.name}
              </h3>
              <span id={`${id}-blurb`} className="mt-1.5 text-[13.5px] leading-[1.55] text-sec">
                {blurb}
              </span>
            </SmartLink>
          );
        })}
      </div>
    </section>
  );
}

/**
 * The closing panel: the valley wash under a pale veil, the pitch left, the CTA bottom right
 * (under the text when the row wraps). Content-box, as in the reference: its 968px max-width is
 * the content width, so at full size the panel is 1082px wide, wider than the 1048px row above.
 */
export function ArticleClosing({ closing, cta }: { closing: PlaybookArticle["closing"]; cta: Link }) {
  return (
    <section
      data-screen-label="Closing"
      aria-labelledby="closing-title"
      className="border-b border-line2 px-[clamp(20px,4vw,40px)] py-[104px]"
    >
      <div className="relative mx-auto box-content flex max-w-[968px] flex-wrap items-end justify-between gap-8 overflow-hidden rounded-[18px] border border-line bg-[#E8E2D2] px-[clamp(24px,4vw,56px)] py-[clamp(40px,5vw,64px)]">
        <Image src={closingWash} alt="" fill sizes={CLOSING_SIZES} className="object-cover object-[center_60%]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(248,246,240,0.7)_0%,rgba(248,246,240,0.5)_60%,rgba(248,246,240,0.35)_100%)]" />
        <div className="relative min-w-0 flex-[3_1_420px]">
          <h2
            id="closing-title"
            className="m-0 max-w-[620px] text-[clamp(26px,2.8vw,38px)] leading-[1.08] font-normal tracking-[-0.032em] text-balance"
          >
            {closing.title}
          </h2>
          <p className="mt-4 mb-0 max-w-[520px] text-[15px] leading-[1.6] text-ink-2">{closing.text}</p>
        </div>
        <div className="relative flex flex-col items-start gap-3">
          <SmartLink
            href={cta.href}
            className="inline-flex h-[42px] items-center rounded-[6px] bg-ink px-5 text-[14px] font-medium tracking-[-0.005em] text-white hover:bg-a hover:text-white forced-colors:border"
          >
            {cta.label}
          </SmartLink>
        </div>
      </div>
    </section>
  );
}
