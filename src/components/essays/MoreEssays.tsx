import Image from "next/image";
import { SmartLink } from "@/components/home/primitives";
import { essayHref, page, type EssaySummary } from "@/content/essays";
import { MORE_SIZES, essayImage } from "./media";

/**
 * Three more essays for the end of an essay: the others in its category first, in number order,
 * then the essays that follow it, wrapping round to No. 01 (as the fifteen prototypes pick
 * them).
 */
export function pickMore(all: EssaySummary[], current: EssaySummary, n = 3): EssaySummary[] {
  const at = all.findIndex((e) => e.slug === current.slug);
  const same = all.filter((e) => e.category === current.category && e.slug !== current.slug);
  const after = [...all.slice(at + 1), ...all.slice(0, at)].filter((e) => !same.includes(e));
  return [...same, ...after].slice(0, n);
}

/** More essays: each a 16:10 painting, "No. NN · Category", the title and the summary. */
export function MoreEssays({ essays }: { essays: EssaySummary[] }) {
  return (
    <section
      data-screen-label="More essays"
      aria-labelledby="more-essays"
      className="mx-auto box-border max-w-[1048px] px-[clamp(20px,4vw,40px)] pt-[120px]"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2.5 border-b border-rule-2 pb-[18px]">
        <h2 id="more-essays" className="m-0 text-[clamp(22px,2.2vw,28px)] leading-[1.15] font-normal tracking-[-0.026em]">
          {page.more.title}
        </h2>
        <SmartLink
          href={page.more.all.href}
          className="relative text-[13.5px] text-sec before:absolute before:-inset-1 before:content-[''] hover:text-a"
        >
          {page.more.all.label}
          <span aria-hidden="true"> →</span>
        </SmartLink>
      </div>
      <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(min(100%,250px),1fr))] gap-x-5 gap-y-7">
        {essays.map((essay) => {
          const id = `more-${essay.num}`;
          return (
            <SmartLink
              key={essay.slug}
              href={essayHref(essay.slug)}
              aria-labelledby={`${id}-title`}
              aria-describedby={`${id}-dek`}
              className="flex flex-col text-ink hover:text-a"
            >
              <span aria-hidden="true" className="relative block aspect-[16/10] overflow-hidden rounded-[14px] bg-[#E2DFD8]">
                <Image src={essayImage(essay.image)!} alt="" fill sizes={MORE_SIZES} className="object-cover" />
              </span>
              <span className="mt-3.5 text-[12px] text-mut">
                No. {essay.num} · {essay.category}
              </span>
              <h3 id={`${id}-title`} className="mt-1 mb-0 text-[17.5px] leading-[1.25] font-normal tracking-[-0.02em]">
                {essay.title}
              </h3>
              <span id={`${id}-dek`} className="mt-1.5 text-[13.5px] leading-[1.55] text-sec">
                {essay.dek}
              </span>
            </SmartLink>
          );
        })}
      </div>
    </section>
  );
}
