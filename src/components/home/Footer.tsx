import type { ReactNode } from "react";
import { footer as homeFooter, type Link } from "@/content/home";
import { SmartLink, Wordmark } from "./primitives";

export type FooterColumn = { head: string; links: Array<Link & { current?: boolean }> };

export function Footer({
  columns = homeFooter.columns,
  extra,
}: {
  columns?: FooterColumn[];
  /** Rendered in the bottom bar, before the status line (e.g. a pause control). */
  extra?: ReactNode;
}) {
  const footer = homeFooter;
  return (
    <footer data-screen-label="Footer" className="px-6 pt-[70px] pb-10 md:px-10">
      <div className="mx-auto max-w-[1280px]">
        {/* Five columns divided by left hairlines; see .footer-cols in globals.css for how
            the rules follow the columns as they reflow to three, two and then one. */}
        <div className="footer-cols">
          {columns.map((col) => (
            <div key={col.head} className="min-w-0">
              <div className="text-[11px] font-medium tracking-[0.11em] text-mut uppercase">{col.head}</div>
              <ul className="m-0 mt-[22px] grid list-none gap-[13px] p-0 text-[14.5px] tracking-[-0.008em]">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {/* block: in the reference each link is a grid item as wide as its
                        column, so the hover target (and focus ring) spans the column. */}
                    <SmartLink
                      href={link.href}
                      aria-current={link.current ? "page" : undefined}
                      className={`block hover:text-a ${link.current ? "text-ink" : "text-sec"}`}
                    >
                      {link.label}
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 flex flex-wrap items-center justify-between gap-5 border-t border-line2 pt-[22px] text-[13px] tracking-[-0.005em] text-mut">
          <div className="flex min-w-0 flex-wrap items-center gap-x-[11px] gap-y-1">
            <Wordmark className="text-[15px] text-ink" />
            {/* pretty: on phones the line wraps, and "reserved." would otherwise sit alone. */}
            <span className="text-pretty">{footer.copyright}</span>
          </div>
          <div className="flex items-center gap-3.5">
            {extra}
            <span className="flex items-center gap-[7px]">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-a" />
              {footer.status}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
