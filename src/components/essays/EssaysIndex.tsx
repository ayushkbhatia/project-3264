"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { SmartLink } from "@/components/home/primitives";
import { categories, essayHref, index as copy, type EssayCategory, type EssaySummary } from "@/content/essays";
import { LEAD_SIZES, ROW_SIZES, START_SIZES, essayImage } from "./media";

// The Essays index from its header to the end of the list (design_handoff_essays,
// Essays.dc.html): the h1 and description, the category chips, the lead essay and the "Start
// here" pair (only under All), and the numbered list of every essay in the category, its label
// sticky beside it.
//
// The category is mirrored in the URL (?category=engineering) so a filtered view can be shared:
// read once after hydration, written with history.replaceState (no history entry per click, no
// server round trip).
//
// Every card and row is one link named by its title and described by its summary (README,
// "Accessibility"); the paintings are decorative.

const paramOf = (c: EssayCategory) => c.toLowerCase();

/** "No. 11 · Strategy · 6 min read": the essay number takes the date's place on the index. */
function Meta({ essay, className }: { essay: EssaySummary; className?: string }) {
  return (
    <span className={`flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[12.5px] text-mut ${className ?? ""}`}>
      <span className="font-mono text-[11.5px] text-ink">No. {essay.num}</span>
      <span>{essay.category}</span>
      <span>{essay.readMinutes} min read</span>
    </span>
  );
}

/** `first`: the lead's painting, in the first screen at every width and the page's LCP, so it
    loads at once and first rather than lazily. */
function Painting({ essay, sizes, className, first }: { essay: EssaySummary; sizes: string; className: string; first?: boolean }) {
  return (
    <span aria-hidden="true" className={`relative block min-w-0 overflow-hidden bg-[#E2DFD8] ${className}`}>
      <Image
        src={essayImage(essay.image)!}
        alt=""
        fill
        sizes={sizes}
        className="object-cover"
        {...(first ? { loading: "eager" as const, fetchPriority: "high" as const } : {})}
      />
    </span>
  );
}

const linkProps = (essay: EssaySummary, prefix: string) => ({
  href: essayHref(essay.slug),
  "aria-labelledby": `${prefix}-${essay.num}-title`,
  "aria-describedby": `${prefix}-${essay.num}-dek`,
});

export function EssaysIndex({ essays }: { essays: EssaySummary[] }) {
  const [category, setCategory] = useState<EssayCategory | null>(null);

  // Read a shared filtered view from the URL once, after hydration (the server renders All).
  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("category");
    const found = categories.find((c) => paramOf(c) === param);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from the URL, which the server render cannot see
    if (found) setCategory(found);
  }, []);

  // Mirror changes back into the URL. Not on mount: the URL is the source then, and writing the
  // initial All would strip a shared ?category= before the read above has applied it.
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    const url = new URL(window.location.href);
    if (category) url.searchParams.set("category", paramOf(category));
    else url.searchParams.delete("category");
    if (url.href !== window.location.href) window.history.replaceState(window.history.state, "", url);
  }, [category]);

  const counts = new Map<EssayCategory, number>();
  for (const e of essays) counts.set(e.category, (counts.get(e.category) ?? 0) + 1);
  const chips: Array<{ id: EssayCategory | null; label: string; n: number }> = [
    { id: null, label: copy.all, n: essays.length },
    ...categories.map((c) => ({ id: c, label: c, n: counts.get(c) ?? 0 })),
  ];
  const shown = essays.filter((e) => !category || e.category === category);
  const lead = essays.find((e) => e.lead)!;
  const startHere = essays.filter((e) => e.startHere);

  return (
    <>
      <section id="top" data-screen-label="Essays header" className="px-10 pt-[88px] max-[479.98px]:px-5">
        <div className="mx-auto max-w-[1280px]">
          <h1 className="m-0 text-[clamp(44px,5.4vw,76px)] leading-none font-normal tracking-[-0.04em]">{copy.title}</h1>
          <p className="mt-[18px] mb-0 max-w-[640px] text-[clamp(16.5px,1.4vw,19px)] leading-[1.5] text-sec">{copy.description}</p>
          <div role="group" aria-label={copy.filterLabel} className="mt-9 flex flex-wrap gap-1.5 border-b border-line pb-5">
            {chips.map((chip) => {
              const on = chip.id === category;
              return (
                <button
                  key={chip.label}
                  type="button"
                  data-cat={chip.label}
                  aria-pressed={on}
                  onClick={() => setCategory(chip.id)}
                  className={`relative inline-flex h-[34px] cursor-pointer items-center gap-[7px] rounded-full border pr-3.5 pl-[15px] text-[13.5px] tracking-[-0.01em] whitespace-nowrap transition-[background,color] duration-[160ms] ease-[ease] before:absolute before:-inset-x-[3px] before:-inset-y-[5px] before:content-[''] ${
                    on ? "border-ink bg-ink text-white" : "border-line bg-white text-ink"
                  }`}
                >
                  <span>{chip.label}</span>
                  <span className={`font-mono text-[11px] ${on ? "text-white/70" : "text-mut"}`}>
                    {chip.n}
                    <span className="sr-only"> {chip.n === 1 ? "essay" : "essays"}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {category === null ? (
        <>
          {/* The outline's h2 for the lead and the pair; not in the design, so not shown. */}
          <h2 className="sr-only">Featured essays</h2>
          <section data-screen-label="Lead essay" className="px-10 pt-10 max-[479.98px]:px-5">
            <SmartLink
              {...linkProps(lead, "lead")}
              className="mx-auto box-border flex max-w-[1280px] flex-wrap items-center gap-x-14 gap-y-7 text-ink hover:text-a"
            >
              <Painting essay={lead} sizes={LEAD_SIZES} first className="aspect-[16/10] flex-[1.25_1_520px] rounded-[20px]" />
              <div className="flex min-w-0 flex-[1_1_380px] flex-col">
                <Meta essay={lead} />
                <h3 id={`lead-${lead.num}-title`} className="mt-4 mb-0 text-[clamp(30px,3.2vw,46px)] leading-[1.04] font-normal tracking-[-0.036em] text-balance">
                  {lead.title}
                </h3>
                <span id={`lead-${lead.num}-dek`} className="mt-4 text-[17px] leading-[1.55] text-pretty text-sec">
                  {lead.dek}
                </span>
                <span className="mt-6 self-start border-b border-[rgba(20,20,18,0.35)] pb-0.5 text-[14px] tracking-[-0.01em]">
                  {copy.readLead}
                  <span aria-hidden="true"> →</span>
                </span>
              </div>
            </SmartLink>
          </section>
          <section data-screen-label="Start here" className="px-10 pt-16 max-[479.98px]:px-5">
            <div className="mx-auto box-border flex max-w-[1280px] flex-wrap gap-10 border-t border-line pt-10">
              {startHere.map((essay) => (
                <SmartLink
                  key={essay.slug}
                  {...linkProps(essay, "start")}
                  className="flex min-w-0 flex-[1_1_420px] flex-col text-ink hover:text-a"
                >
                  <Painting essay={essay} sizes={START_SIZES} className="aspect-video rounded-[16px]" />
                  <Meta essay={essay} className="mt-[18px]" />
                  <h3 id={`start-${essay.num}-title`} className="mt-2.5 mb-0 text-[clamp(22px,2.1vw,28px)] leading-[1.15] font-normal tracking-[-0.028em] text-balance">
                    {essay.title}
                  </h3>
                  <span id={`start-${essay.num}-dek`} className="mt-2.5 max-w-[560px] text-[15.5px] leading-[1.55] text-pretty text-sec">
                    {essay.dek}
                  </span>
                </SmartLink>
              ))}
            </div>
          </section>
        </>
      ) : null}

      <section data-screen-label="All essays" className="px-10 pt-[88px] max-[479.98px]:px-5">
        <div className="mx-auto flex max-w-[1280px] flex-wrap gap-x-12 gap-y-1">
          <div className="flex-[0_0_200px]">
            {/* Live: the label and count are announced when a chip changes them. */}
            <div aria-live="polite" className="sticky top-24 pt-5">
              <h2 className="m-0 text-[clamp(26px,2.4vw,34px)] leading-[1.1] font-normal tracking-[-0.03em]">{category ?? copy.allEssays}</h2>
              <div className="mt-2 font-mono text-[11.5px] text-mut">{copy.count(shown.length)}</div>
            </div>
          </div>
          <ol className="m-0 min-w-0 flex-[1_1_560px] list-none border-b border-line p-0">
            {shown.map((essay) => (
              <li key={essay.slug}>
                <SmartLink
                  {...linkProps(essay, "row")}
                  className="flex flex-wrap items-start gap-x-7 gap-y-4 border-t border-line py-6 text-ink hover:text-a"
                >
                  <Painting essay={essay} sizes={ROW_SIZES} className="aspect-[16/10] flex-[0_0_clamp(150px,20vw,232px)] rounded-[14px]" />
                  <div className="flex min-w-0 flex-[1_1_320px] flex-col">
                    <Meta essay={essay} />
                    <h3 id={`row-${essay.num}-title`} className="mt-2.5 mb-0 text-[clamp(20px,1.9vw,24px)] leading-[1.2] font-normal tracking-[-0.024em] text-balance">
                      {essay.title}
                    </h3>
                    <span id={`row-${essay.num}-dek`} className="mt-2 max-w-[620px] text-[15px] leading-[1.55] text-pretty text-sec">
                      {essay.dek}
                    </span>
                  </div>
                </SmartLink>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
