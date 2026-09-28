import { SmartLink } from "@/components/home/primitives";
import { playbooks, type Category } from "@/content/playbooks";
import { PlaybookCard } from "./PlaybookCard";

/** Section h2 on this page (category rows, Recently updated): clamp(32px,3.2vw,46px) / -0.035em / 1.05. */
export const pbSectionTitle = "m-0 text-[clamp(32px,3.2vw,46px)] leading-[1.05] font-normal tracking-[-0.035em]";

/**
 * One category's three playbooks (specs/05): the h2 and a "How we work in …" link, then the tiles
 * in an auto-fit grid (3 × 408px at 1440, then 2, then 1).
 */
export function CategoryRow({ category }: { category: Category }) {
  const items = playbooks.filter((p) => p.category === category.id);
  return (
    <section id={category.id} data-screen-label={category.label} className="px-10 pt-24 max-[479.98px]:px-5">
      <div className="mx-auto max-w-[1280px]">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3">
          <h2 className={pbSectionTitle}>{category.label}</h2>
          {/* nowrap (specs/05): the arrow never wraps alone; the link drops under the h2 instead */}
          <SmartLink href={category.href} className="text-[14px] tracking-[-0.01em] whitespace-nowrap text-sec hover:text-a">
            {category.linkLabel} <span aria-hidden="true">→</span>
          </SmartLink>
        </div>
        <div className="mt-9 grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-x-7 gap-y-11">
          {items.map((p) => (
            <PlaybookCard key={p.slug} playbook={p} idPrefix="row" />
          ))}
        </div>
      </div>
    </section>
  );
}
