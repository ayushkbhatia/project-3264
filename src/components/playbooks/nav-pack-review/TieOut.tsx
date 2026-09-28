"use client";

import { useId, useRef } from "react";
import { featureImages } from "@/components/playbooks/media";
import { Dot, Figure, Sheet, SheetTitle, cx } from "@/components/playbooks/article/figure";
import { ON_TOP_IN_UPPER_65, useHeroReveal } from "@/components/playbooks/article/useHeroReveal";
import { evidenceLine } from "./case";

// F1, the hero figure: the Q2 2026 tie-out of a fictional credit fund's NAV pack against its
// books. Five lines tie or sit within tolerance; the management fee breaks, and the fund's net
// assets hold release until it is explained. The rows fade in, 40ms apart (step 1); then the
// explanation fades in and the break's status reads "Break · explained" (step 2).

type Row = {
  line: string;
  pack: string;
  books: string;
  diff: string;
  tolerance: string;
  /** Tied or within tolerance: ink, with a green dot. */
  status?: string;
  /** The management fee: red wash and edge, red status. */
  brk?: boolean;
  /** Net assets: an ink rule above, weight 500, no dot. */
  total?: boolean;
};

const ROWS: Row[] = [
  { line: "Investments at fair value", pack: "812,406,220.00", books: "812,406,220.00", diff: "0.00", tolerance: "tolerance 0.05% by asset class", status: "Tied" },
  { line: "Cash and equivalents", pack: "14,902,118.44", books: "14,902,118.44", diff: "0.00", tolerance: "tolerance 0.00", status: "Tied" },
  { line: "Interest receivable", pack: "6,118,730.12", books: "6,118,730.12", diff: "0.00", tolerance: "tolerance 500.00", status: "Tied" },
  { line: "Management fee payable", pack: "(1,262,500.00)", books: "(1,187,500.00)", diff: "(75,000.00)", tolerance: "tolerance 500.00", brk: true },
  { line: "Accrued fund expenses", pack: "(412,380.55)", books: "(412,210.55)", diff: "(170.00)", tolerance: "tolerance 500.00", status: "Within tolerance" },
  { line: "Net assets", pack: "831,752,188.01", books: "831,827,358.01", diff: "(75,170.00)", tolerance: "tolerance 0.5 bp of NAV (≈ 41,600)", status: "Open · release held", total: true },
];

/** Five columns from a 540px main column; below it the line and its difference, with the
    status and a pack · books · tolerance line under them. */
const COLS =
  "grid-cols-[minmax(0,1fr)_auto] gap-x-3 @min-[539.5px]:grid-cols-[minmax(0,1.45fr)_minmax(0,1.05fr)_minmax(0,1.05fr)_minmax(0,0.9fr)_minmax(0,1.05fr)]";
const wide = "hidden @min-[539.5px]:block";
const num = "text-right font-mono text-[11.5px]";

export function TieOut({ animate = true }: { animate?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const step = useHeroReveal(ref, animate, ON_TOP_IN_UPPER_65);
  const titleId = useId();

  return (
    <Figure
      ref={ref}
      data-reveal-root={animate ? "on" : "off"}
      image={featureImages["nav-pack-review"]}
      veil={0.72}
      eager
      metaRight={false}
      className="mt-9"
      label="Tie-out · NAV Pack Review"
      meta={
        <>
          Q2 2026 · 30 Jun 2026 · NAV pack v3
          <br />
          Northbay Fund Services · USD
        </>
      }
      evidence={evidenceLine.map((p) => p.sep + p.value).join("")}
      moment="Fees are recalculated from the LPA, not taken from the pack. One line breaks; its cause, clause and owner sit beside it."
      caption="Q2 2026 tie-out for a fictional credit fund. Five lines tie or sit within tolerance; the management fee breaks and is explained."
    >
      <Sheet>
        <SheetTitle id={titleId}>Larkspur Credit Opportunities Fund II</SheetTitle>
        <div className="mt-1 mb-3 font-mono text-[10.5px] leading-[1.6] text-mut">
          Difference = pack − books · tolerances illustrative · all names and figures fictional
        </div>

        <div role="table" aria-labelledby={titleId}>
          <div
            role="row"
            className={cx(COLS, "hidden border-b border-ink px-2 pb-[7px] text-[10.5px] text-sec @min-[539.5px]:grid")}
          >
            <span role="columnheader">Line</span>
            <span role="columnheader" className="text-right">
              Northbay pack
            </span>
            <span role="columnheader" className="text-right">
              Internal books
            </span>
            <span role="columnheader" className="text-right">
              Difference
            </span>
            <span role="columnheader">Status</span>
          </div>
          {ROWS.map((r, i) => (
            <div
              key={r.line}
              role="row"
              data-reveal="fade"
              className={cx(
                COLS,
                "grid items-baseline gap-y-[3px] px-2 py-[9px] transition-opacity duration-[320ms] ease-[ease]",
                r.total ? "border-t border-ink" : i < ROWS.length - 2 && "border-b border-rule-2",
                r.brk && "bg-bad-bg shadow-[inset_2px_0_0_#C4341E]",
                r.total && "font-medium",
              )}
              style={{ opacity: step >= 1 ? 1 : 0, transitionDelay: `${i * 40}ms` }}
            >
              <span role="rowheader" className="min-w-0 text-[13px] leading-[1.35]">
                {r.line}
              </span>
              <span role="cell" className={cx(wide, num)}>
                {r.pack}
              </span>
              <span role="cell" className={cx(wide, num)}>
                {r.books}
              </span>
              <span role="cell" className={cx(num, r.brk ? "text-bad-ink" : "text-ink")}>
                {r.diff}
              </span>
              <span
                role="cell"
                className={cx(
                  "col-span-full flex items-baseline gap-1.5 text-[12px] leading-[1.35] @min-[539.5px]:col-auto",
                  r.brk ? "text-bad-ink" : "text-ink",
                )}
              >
                {r.total ? null : <Dot tone={r.brk ? "bad" : "ok"} level />}
                <span>{r.brk ? (step >= 2 ? "Break · explained" : "Break") : r.status}</span>
              </span>
              <span
                role="cell"
                className={cx(wide, "col-[2/5] text-right font-mono text-[10px] font-normal", r.brk ? "text-mut-ink-2" : "text-mut")}
              >
                {r.tolerance}
              </span>
              <span
                role="cell"
                className={cx(
                  "col-span-full font-mono text-[10px] leading-[1.6] font-normal @min-[539.5px]:hidden",
                  r.brk ? "text-mut-ink-2" : "text-mut",
                )}
              >
                pack {r.pack} · books {r.books} · {r.tolerance}
              </span>
            </div>
          ))}
        </div>

        <div
          data-reveal="fade"
          className="mt-3 rounded-[0_10px_10px_0] border-l-2 border-bad bg-[#F6F5F2] px-3.5 py-3 transition-opacity duration-[400ms] ease-[ease]"
          style={{ opacity: step >= 2 ? 1 : 0 }}
        >
          <p className="m-0 text-[13.5px] leading-[1.55] text-ink">
            Fee basis should step down from commitments to invested capital after the investment period ended 31 Mar 2026 (LPA
            s.8.2). Administrator to rebook.
          </p>
          <div className="mt-1.5 font-mono text-[10.5px] leading-[1.6] text-sec [overflow-wrap:anywhere]">
            Owner: Fund controller · FC · 2026-07-21 14:32 · after rebook, net assets difference (170.00), within tolerance
          </div>
        </div>
      </Sheet>
    </Figure>
  );
}
