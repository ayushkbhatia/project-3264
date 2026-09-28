import { SmartLink } from "@/components/home/primitives";
import { categoryById, playbookBySlug, playbookHref, recent, recentlyUpdated } from "@/content/playbooks";
import { pbSectionTitle } from "./CategoryRow";

/**
 * Recently updated (specs/06): a ruled list, one row per change, date | playbook and note |
 * category. PLACEHOLDER entries until 3264 supplies the changelog (content/playbooks.ts).
 *
 * Below 520px the category column moves under the note (the one breakpoint this section needs).
 */
export function RecentList() {
  return (
    <section data-screen-label="Recently updated" className="px-10 pt-24 max-[479.98px]:px-5">
      <div className="mx-auto max-w-[1280px]">
        <h2 className={pbSectionTitle}>{recent.title}</h2>
        <ul className="m-0 mt-7 list-none border-t border-ink p-0">
          {recentlyUpdated.map((item) => {
            const p = playbookBySlug(item.slug)!;
            return (
              <li key={`${item.date}-${item.slug}`}>
                <SmartLink
                  href={playbookHref(item.slug)}
                  className="grid grid-cols-[80px_minmax(0,1fr)_auto] items-baseline gap-x-6 gap-y-2 border-b border-line py-5 text-ink hover:text-a max-[519.98px]:grid-cols-[64px_minmax(0,1fr)] max-[519.98px]:gap-y-0"
                >
                  <time dateTime={item.date} className="font-mono text-[12px] text-mut">
                    {item.label}
                  </time>
                  <span className="min-w-0">
                    <span className="block text-[18px] leading-[1.25] tracking-[-0.02em]">{p.name}</span>
                    <span className="mt-1 block text-[14.5px] leading-[1.5] text-sec">{item.note}</span>
                  </span>
                  <span className="text-[13px] whitespace-nowrap text-mut max-[519.98px]:col-start-2 max-[519.98px]:mt-1">
                    {categoryById(p.category).label}
                  </span>
                </SmartLink>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
