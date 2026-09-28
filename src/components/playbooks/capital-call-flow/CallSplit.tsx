"use client";

import { useId, useRef } from "react";
import { tileImages } from "@/components/playbooks/media";
import { Dot, Figure, Sheet, SheetTitle, cx } from "@/components/playbooks/article/figure";
import { ON_TOP_IN_UPPER_65, useHeroReveal } from "@/components/playbooks/article/useHeroReveal";

// F1, the hero figure: Capital Call No. 07 split per investor, one LP excused. Each line is the
// investment (on the remaining commitments of the investors who are not excused) plus the net
// management fee (on commitment), floored to the cent, with the residual cents placed by
// largest remainder: the +0.01 marks. The Total due is ringed (step 1), the tie-out check fades
// in (step 2), then Lanvik's excuse and the calculation trace (step 3). All data fictional; the
// numbers reconcile.
//
// Layout by main-column width. The reference's two (Math.round(width) >= N, so each query sits
// half a pixel below N): six columns from 640px, with Commitment and Remaining before; four
// below that. And one of the port's own: under 448px the reference's four columns are narrower
// than its 10.5px mono amounts, which run into each other (at a 390px phone, "7,360,000.00"
// overprints "155,833.33"), so each line stacks instead, its amounts one per row beside their
// labels.

type Amount = { value: string; /** received a residual cent */ cent?: boolean };

type Line = {
  name: string;
  id: string;
  commitment: string;
  remaining: string;
  /** null: excused from this investment by side letter. */
  investment: Amount | null;
  fee: Amount;
  total: string;
};

const LINES: Line[] = [
  {
    name: "Calder County Retirement System",
    id: "LP-01",
    commitment: "60,000,000.00",
    remaining: "39,000,000.00",
    investment: { value: "7,360,000.00" },
    fee: { value: "155,833.33" },
    total: "7,515,833.33",
  },
  {
    name: "Lanvik Sovereign Holdings",
    id: "LP-02",
    commitment: "75,000,000.00",
    remaining: "48,750,000.00",
    investment: null,
    fee: { value: "194,791.67", cent: true },
    total: "194,791.67",
  },
  {
    name: "Northfield University Endowment",
    id: "LP-03",
    commitment: "40,000,000.00",
    remaining: "26,000,000.00",
    investment: { value: "4,906,666.67", cent: true },
    fee: { value: "103,888.89", cent: true },
    total: "5,010,555.56",
  },
  {
    name: "Tamsin Mutual Insurance",
    id: "LP-04",
    commitment: "25,000,000.00",
    remaining: "16,250,000.00",
    investment: { value: "3,066,666.67", cent: true },
    fee: { value: "64,930.56", cent: true },
    total: "3,131,597.23",
  },
  {
    name: "Harlow Foundation",
    id: "LP-05",
    commitment: "15,000,000.00",
    remaining: "9,750,000.00",
    investment: { value: "1,840,000.00" },
    fee: { value: "38,958.33" },
    total: "1,878,958.33",
  },
  {
    name: "Ashgrove Family Office",
    id: "LP-06",
    commitment: "10,000,000.00",
    remaining: "6,500,000.00",
    investment: { value: "1,226,666.66" },
    fee: { value: "25,972.22" },
    total: "1,252,638.88",
  },
];

const TOTAL = {
  commitment: "225,000,000.00",
  remaining: "146,250,000.00",
  investment: "18,400,000.00",
  fee: "584,375.00",
  total: "18,984,375.00",
};

/** One column (stacked lines) under 448px; four from there; six from 640px. */
const TRACKS =
  "grid-cols-[minmax(0,1fr)] gap-x-2 gap-y-[3px] @min-[447.5px]:grid-cols-[minmax(0,1.3fr)_repeat(3,minmax(0,1fr))] @min-[639.5px]:grid-cols-[minmax(0,1.45fr)_repeat(5,minmax(0,1fr))]";
/** Commitment and Remaining before: from 640px only. */
const WIDE = "hidden text-right font-mono text-[10.5px] @min-[639.5px]:block";
/** Investment, fee and total: a figure in its column, or under 448px its label and figure. */
const AMOUNT = "flex items-baseline justify-between gap-3 text-right font-mono text-[10.5px] @min-[447.5px]:block";
const fade = "transition-opacity duration-[450ms] ease-[ease]";

/** An amount cell's label, shown only while the lines are stacked. */
function Label({ children }: { children: string }) {
  return <span className="font-normal text-sec @min-[447.5px]:hidden">{children}</span>;
}

/** An amount, marked "+0.01" where the rounding rule placed a residual cent on it. */
function Money({ amount }: { amount: Amount }) {
  if (!amount.cent) return <span>{amount.value}</span>;
  return (
    <span>
      <span aria-hidden="true" className="mr-1 inline-block rounded-[4px] border border-rule px-1 align-[1px] text-[9.5px] text-sec">
        +0.01
      </span>
      {amount.value}
      <span className="sr-only">, including a residual cent</span>
    </span>
  );
}

export function CallSplit({ animate = true }: { animate?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  // the handoff's trigger: the figure's top in the upper 65% of the viewport, or the final state
  // if that has not happened within 4s of mount
  const step = useHeroReveal(ref, animate, ON_TOP_IN_UPPER_65);
  const titleId = useId();
  const excuse = { opacity: step >= 3 ? 1 : 0 };

  return (
    <Figure
      ref={ref}
      data-reveal-root={animate ? "on" : "off"}
      image={tileImages["capital-call-flow"]}
      veil={0.62}
      eager
      metaRight={false}
      className="mt-11"
      label="Aldercove Growth Fund III, L.P. · Capital Call No. 07 (drawdown notice)"
      meta={
        <>
          notice 2026-09-30 · due 2026-10-15
          <br />
          investment: Halden Instruments · Q4 management fee
          <br />
          allocation v1 · USD
        </>
      }
      evidence="call07_alloc v1 · rules v3.2 · LPA s.6.2.4.1 + SL §3.1 → 18,984,375.00 → recompute 6/6 → tied → fund controller · 2026-09-29 16:42"
      moment="Lanvik is excused from the Halden Instruments investment under its side letter. It still pays its management fee."
      caption="Fictional fund, investors and investment. The +0.01 marks show where residual cents were placed by the stated rounding rule."
      footer={
        // no text-wrap: pretty here, as in the reference
        <p className="mt-2.5 mb-0 text-[12.5px] leading-[1.5] text-sec [text-wrap:wrap]">
          US documents say capital call; UK and EU documents, and the ILPA Model LPA, say drawdown notice.
        </p>
      }
    >
      <Sheet>
        <SheetTitle id={titleId}>Per-investor split, one LP excused</SheetTitle>
        {/* stacked, the header is gone: the table keeps its ink rule on top */}
        <div role="table" aria-labelledby={titleId} className="mt-3 border-t border-ink @min-[447.5px]:border-t-0">
          <div role="row" className={cx("hidden @min-[447.5px]:grid", TRACKS, "border-b border-ink px-1.5 pb-2 text-[10.5px] text-sec")}>
            <span role="columnheader">Limited partner</span>
            <span role="columnheader" className={WIDE}>
              Commitment
            </span>
            <span role="columnheader" className={WIDE}>
              Remaining before
            </span>
            <span role="columnheader" className="text-right font-mono">
              Investment
            </span>
            <span role="columnheader" className="text-right font-mono">
              Mgmt fee, net
            </span>
            <span role="columnheader" className="text-right font-mono">
              Total due
            </span>
          </div>

          {LINES.map((l) => (
            <div
              key={l.id}
              role="row"
              className={cx("grid", TRACKS, "items-baseline border-b border-rule-2 px-1.5 py-[9px]", !l.investment && "bg-[#F1EEE8]")}
            >
              <span role="rowheader" className="mb-[5px] min-w-0 @min-[447.5px]:mb-0">
                <span className="block text-[12.5px] leading-[1.35]">{l.name}</span>
                {/* on the tinted row, --mut-ink: the design's grey is 4.48:1 there */}
                <span className={cx("mt-0.5 block font-mono text-[10px]", l.investment ? "text-mut" : "text-mut-ink")}>{l.id}</span>
              </span>
              <span role="cell" className={WIDE}>
                {l.commitment}
              </span>
              <span role="cell" className={WIDE}>
                {l.remaining}
              </span>
              {l.investment ? (
                <span role="cell" className={AMOUNT}>
                  <Label>Investment</Label>
                  <Money amount={l.investment} />
                </span>
              ) : (
                <span role="cell" className={cx(AMOUNT, "text-sec")}>
                  <Label>Investment</Label>
                  <span data-reveal="fade" className={fade} style={excuse}>
                    excused · side letter §3.1
                  </span>
                </span>
              )}
              <span role="cell" className={AMOUNT}>
                <Label>Mgmt fee, net</Label>
                <Money amount={l.fee} />
              </span>
              <span role="cell" className={AMOUNT}>
                <Label>Total due</Label>
                <span>{l.total}</span>
              </span>
            </div>
          ))}

          <div role="row" className={cx("grid", TRACKS, "items-baseline border-b border-ink px-1.5 py-2.5 font-medium")}>
            <span role="rowheader" className="mb-[5px] text-[12.5px] @min-[447.5px]:mb-0">
              Total
            </span>
            <span role="cell" className={WIDE}>
              {TOTAL.commitment}
            </span>
            <span role="cell" className={WIDE}>
              {TOTAL.remaining}
            </span>
            <span role="cell" className={AMOUNT}>
              <Label>Investment</Label>
              <span>{TOTAL.investment}</span>
            </span>
            <span role="cell" className={AMOUNT}>
              <Label>Mgmt fee, net</Label>
              <span>{TOTAL.fee}</span>
            </span>
            <span role="cell" className={AMOUNT}>
              <Label>Total due</Label>
              <span
                data-reveal="ring"
                className="-mx-1 -my-px inline-block rounded-[5px] px-1 py-px transition-[box-shadow] duration-500 ease-[ease]"
                style={{ boxShadow: step >= 1 ? "0 0 0 1.5px #1A1917" : "0 0 0 1.5px rgba(26,25,23,0)" }}
              >
                {TOTAL.total}
              </span>
            </span>
          </div>

          <div
            data-reveal="fade"
            className={cx("mx-1.5 mt-2.5 flex items-baseline justify-end gap-[7px] font-mono text-[11px] text-ok", fade)}
            style={{ opacity: step >= 2 ? 1 : 0 }}
          >
            <Dot tone="ok" />Σ LP lines = call total · variance 0.00
          </div>
        </div>

        <div
          data-reveal="fade"
          className={cx(
            "mt-3.5 rounded-[10px] bg-[#F3F0EA] px-3.5 py-3 font-mono text-[10.5px] leading-[1.8] text-ink-2 [overflow-wrap:anywhere]",
            fade,
          )}
          style={excuse}
        >
          investment base 97,500,000.00 = remaining commitments of non-excused LPs · LPA s.6.2.4.1
          <br />
          fee 1.75% ÷ 4 on commitment = 984,375.00, less fee income 400,000.00 split by commitment · LPA s.8.3–8.4
          <br />
          rounding: floor to the cent, residual by largest remainder, ties to larger base · investment +0.02 · fee +0.03
        </div>
      </Sheet>
    </Figure>
  );
}
