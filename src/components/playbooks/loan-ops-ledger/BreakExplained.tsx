"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import { tileImages } from "@/components/playbooks/media";
import { Figure, Sheet, cx, monoLabel } from "@/components/playbooks/article/figure";
import { ON_TOP_IN_UPPER_65, useHeroReveal } from "@/components/playbooks/article/useHeroReveal";

// F1, the hero figure: a break explained, a partial PIK toggle. The agent's interest notice,
// the two ledger lines it breaks, and the explanation. The notice's Interest Amount is ringed
// (step 1), the two differences fade in (step 2), the break class, calculation and status rise
// in (step 3), and the status dot turns from red to green (step 4). All data fictional; the
// rate is illustrative.

const NOTICE: Array<[string, string]> = [
  ["Borrower", "Penrose Vale Software"],
  ["Facility", "Term Loan · PVS-TL1"],
  ["Interest period", "31 Mar – 30 Jun 2026"],
  ["Days · basis", "91 · ACT/360"],
  ["Term SOFR 3M*", "4.3125%"],
  ["Margin", "5.2500%"],
  ["All-in rate", "9.5625%"],
  ["Principal", "24,750,000.00"],
];

const AMOUNTS: Array<[string, string]> = [
  ["Interest Amount", "598,253.91"],
  ["Paid in cash", "299,126.96"],
  ["PIK capitalised (50%)", "299,126.95"],
  ["New principal", "25,049,126.95"],
];

const LEDGER = [
  { line: "Cash due 30 Jun 2026", system: "598,253.91", agent: "299,126.96", diff: "−299,126.95" },
  { line: "Principal after 30 Jun 2026", system: "24,750,000.00", agent: "25,049,126.95", diff: "+299,126.95" },
];

/** Notice fields: two columns, four from a 560px main column. */
const FIELDS = "grid grid-cols-[repeat(2,minmax(0,1fr))] gap-x-[18px] @min-[559.5px]:grid-cols-[repeat(4,minmax(0,1fr))]";
const LEDGER_COLS = "grid grid-cols-[minmax(0,1.35fr)_repeat(3,minmax(0,1fr))] gap-x-3";
const num = "text-right font-mono text-[11.5px]";
const fade = "transition-opacity duration-[450ms] ease-[ease]";

/** A notice field. `plain`: the value's wrapper keeps the sheet's 16px font, as the ringed
    Interest Amount does in the reference (its mono span sits in that taller line box). */
function Field({ label, children, strong, plain }: { label: string; children: ReactNode; strong?: boolean; plain?: boolean }) {
  return (
    <div className={cx("border-t py-[9px]", strong ? "border-ink" : "border-rule-2")}>
      <div className="text-[11px] text-sec">{label}</div>
      <div className={cx("mt-[3px]", !plain && "font-mono text-[12px]")}>{children}</div>
    </div>
  );
}

export function BreakExplained({ animate = true }: { animate?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  // the handoff's trigger: the figure's top in the upper 65% of the viewport, or the final state
  // if that has not happened within 4s of mount
  const step = useHeroReveal(ref, animate, ON_TOP_IN_UPPER_65);
  const [notice, setNotice] = useState(false);
  const noticeId = useId();
  const diff = { opacity: step >= 2 ? 1 : 0 };
  const card = { opacity: step >= 3 ? 1 : 0 };

  return (
    <Figure
      ref={ref}
      data-reveal-root={animate ? "on" : "off"}
      image={tileImages["loan-ops-ledger"]}
      veil={0.58}
      eager
      radius={18}
      padding={14}
      headGap={12}
      metaRight={false}
      captionGap={6}
      className="mt-11"
      label="A break explained · PIK toggle"
      meta="Larkspur Credit Opportunities Fund II · Penrose Vale Software TL · IPD 30 Jun 2026"
      evidence={
        'AGT-PVS-TL1-20260623.pdf · v1 · p.1 "Interest Amount" → 598,253.91 → recompute ACT/360 = 598,253.91; PIK 50% per Election 12 Jun 2026, §3.02(ii) → explained · PIK toggle → loan operations analyst · 2026-06-23 11:42 ET'
      }
      moment="The borrower elected to pay half the interest in kind; the loan system still expected cash."
      caption="A partial PIK election, classed and explained from the credit agreement, with its effect on the fund facility flagged. Fictional data; illustrative rates."
    >
      {/* the agent's notice */}
      <Sheet pad="p-[18px]" radius={12}>
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
          <div>
            <div className={cx(monoLabel, "text-sec")}>Agent notice</div>
            <div className="mt-1.5 text-[17px] leading-[1.25] font-medium tracking-[-0.018em]">Interest payment notice</div>
          </div>
          <div className="font-mono text-[11px] leading-[1.7] text-sec">
            From: Administrative agent (fictional)
            <br />
            Ref AGT-PVS-TL1-20260623 · v1
            <br />
            Received 2026-06-23 11:02 ET
          </div>
        </div>
        {/* the full notice; below a 500px column, behind the toggle */}
        <div id={noticeId} className={cx(FIELDS, "mt-3.5", notice ? "" : "@max-[499.5px]:hidden")}>
          {NOTICE.map(([label, value]) => (
            <Field key={label} label={label}>
              {value}
            </Field>
          ))}
        </div>
        <div className={cx(FIELDS, "mt-1")}>
          {AMOUNTS.map(([label, value], i) => (
            <Field key={label} label={label} strong plain={i === 0}>
              {i === 0 ? (
                <span
                  data-reveal="ring"
                  className="-mx-1.5 -my-0.5 inline-block rounded-[6px] px-1.5 py-0.5 font-mono text-[12px] transition-[box-shadow] duration-500 ease-[ease]"
                  style={{ boxShadow: step >= 1 ? "0 0 0 1.5px #1A1917" : "0 0 0 1.5px rgba(26,25,23,0)" }}
                >
                  {value}
                </span>
              ) : (
                value
              )}
            </Field>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1.5">
          <span className="text-[11px] leading-[1.5] text-mut">* Illustrative rate, not a published fixing. All names and identifiers fictional.</span>
          <button
            type="button"
            aria-expanded={notice}
            aria-controls={noticeId}
            onClick={() => setNotice((n) => !n)}
            className="relative cursor-pointer border-b border-[rgba(20,20,18,0.3)] text-[12px] text-ink before:absolute before:-inset-x-1 before:-inset-y-1.5 before:content-[''] @min-[499.5px]:hidden"
          >
            {notice ? "Hide full notice" : "Show full notice"}
          </button>
        </div>
      </Sheet>

      {/* the two ledger lines it breaks, and the explanation */}
      <Sheet pad="p-[18px]" radius={12} className="mt-2.5">
        <div className={cx(monoLabel, "text-sec")}>Ledger · loan system vs agent notice</div>
        <div className="mt-1.5 text-[17px] leading-[1.25] font-medium tracking-[-0.018em]">Two breaks, one cause</div>

        {/* from a 500px column: a table */}
        <div role="table" className="mt-3 hidden @min-[499.5px]:block">
          <div role="row" className={cx(LEDGER_COLS, "items-baseline border-b border-ink pb-2 text-[11px] text-sec")}>
            <span role="columnheader">Line</span>
            <span role="columnheader" className="text-right font-mono">
              Loan system
            </span>
            <span role="columnheader" className="text-right font-mono">
              Agent notice
            </span>
            <span role="columnheader" className="text-right font-mono">
              Difference
            </span>
          </div>
          {LEDGER.map((r) => (
            <div key={r.line} role="row" className={cx(LEDGER_COLS, "items-baseline border-b border-rule-2 py-2.5")}>
              <span role="rowheader" className="text-[13px]">
                {r.line}
              </span>
              <span role="cell" className={num}>
                {r.system}
              </span>
              <span role="cell" className={num}>
                {r.agent}
              </span>
              <span role="cell" data-reveal="fade" className={cx(num, "text-bad", fade)} style={diff}>
                {r.diff}
              </span>
            </div>
          ))}
          <div role="row" className={cx(LEDGER_COLS, "items-baseline border-b border-rule-2 py-2.5")}>
            <span role="rowheader" className="text-[13px] text-sec">
              Net across the two legs
            </span>
            <span role="cell" />
            <span role="cell" />
            <span role="cell" className={num}>
              0.00
            </span>
          </div>
        </div>

        {/* below it: one card per line */}
        <div className="mt-3 border-t border-ink @min-[499.5px]:hidden">
          {LEDGER.map((r) => (
            <div key={r.line} className="border-b border-rule-2 py-2.5">
              <div className="text-[13px]">{r.line}</div>
              <div className="mt-1.5 grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-[3px] font-mono text-[11.5px]">
                <span className="text-sec">System</span>
                <span className="text-right">{r.system}</span>
                <span className="text-sec">Agent</span>
                <span className="text-right">{r.agent}</span>
                <span className="text-sec">Difference</span>
                <span data-reveal="fade" className={cx("text-right text-bad", fade)} style={diff}>
                  {r.diff}
                </span>
              </div>
            </div>
          ))}
          <div className="flex justify-between gap-3 border-b border-rule-2 py-2.5 text-[13px] text-sec">
            <span>Net across the two legs</span>
            <span className="font-mono text-[11.5px] text-ink">0.00</span>
          </div>
        </div>

        <p
          data-reveal="rise"
          className="mt-3.5 mb-0 text-[13.5px] leading-[1.6] transition-[opacity,transform] duration-[450ms] ease-[ease]"
          style={{ opacity: step >= 3 ? 1 : 0, transform: step >= 3 ? "none" : "translateY(6px)" }}
        >
          <span className="mr-[7px] inline-flex items-center rounded-full border border-ink px-[9px] py-0.5 align-[1px] font-mono text-[11px]">
            Break class · PIK toggle
          </span>
          PIK Election dated 12 Jun 2026, at least 10 business days before the 30 Jun payment date; 50% elected, within the 75%
          cap. Clause §3.02(ii).
        </p>
        <div
          data-reveal="fade"
          className={cx("mt-3 rounded-[10px] bg-[#F3F0EA] px-3.5 py-3 font-mono text-[11.5px] leading-[1.8] text-ink-2 [overflow-wrap:anywhere]", fade)}
          style={card}
        >
          <div>24,750,000.00 × 9.5625% × 91/360 = 598,253.90625 → 598,253.91</div>
          <div>PIK 50% of 598,253.90625 = 299,126.953… → 299,126.95</div>
          <div>Cash = 598,253.91 − 299,126.95 = 299,126.96</div>
        </div>
        <div data-reveal="fade" className={cx("mt-3 border-t border-rule-2 pt-3 text-[13px] leading-[1.55]", fade)} style={card}>
          Fund facility: Partial PIK concentration <span className="font-mono text-[11.5px]">7.8%</span> →{" "}
          <span className="font-mono text-[11.5px]">9.9%</span> of the <span className="font-mono text-[11.5px]">10.0%</span> limit ·
          flagged to fund controller
        </div>
        <div data-reveal="fade" className={cx("mt-2 flex items-baseline gap-[9px] text-[13px] leading-[1.55]", fade)} style={card}>
          <span
            data-reveal="dot"
            aria-hidden="true"
            className="size-[7px] flex-none -translate-y-px rounded-full transition-[background] duration-[400ms] ease-[ease]"
            style={{ background: step >= 4 ? "#157F52" : "#C4341E" }}
          />
          <span>Explained · agent figure accepted · PIK capitalisation booked by loan operations analyst</span>
        </div>
      </Sheet>
    </Figure>
  );
}
