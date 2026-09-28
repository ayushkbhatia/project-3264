import type { ReactNode } from "react";
import { tileImages } from "@/components/playbooks/media";
import { Dot, Figure, Sheet, SheetTitle, cx, monoLabel } from "@/components/playbooks/article/figure";

// F2 (§03, after the step table): the price tests. An illustrative pricing policy's tolerance
// bands by asset class, then this period's tests against them: one syndicated loan moves 1.50
// points between vendors, outside its 1.0-point band, and a challenge is raised. All names and
// figures fictional; the policy is not an industry standard.

const POLICY = [
  { cls: "Broadly syndicated loans", primary: "Pricing vendor A", compared: "Pricing vendor B", tolerance: "1.0 pt", action: "Price challenge to vendor" },
  { cls: "Level 3 direct loans", primary: "Valuation model", compared: "Prior-quarter mark", tolerance: "3.0% move", action: "Valuation memo to committee" },
  { cls: "FX forwards", primary: "Pricing vendor", compared: "Counterparty valuation", tolerance: "0.10%", action: "Query counterparty" },
  { cls: "Cash", primary: "Bank statement", compared: "Administrator", tolerance: "0.00", action: "Reconcile before strike" },
];

const PERIOD = [
  { name: "Tallis Brook Components 1L term loan", kind: "Broadly syndicated loan", primary: "96.25", compared: "94.75", diff: "1.50 pt > 1.0 pt", status: "Challenge raised", out: true },
  { name: "Brisbane Lane Foods 1L term loan", kind: "Broadly syndicated loan", primary: "99.50", compared: "99.25", diff: "0.25 pt", status: "Within band" },
  { name: "Penrose Vale Software term loan", kind: "Level 3 direct loan", primary: "97.60", compared: "98.10", diff: "(0.51%)", status: "Within band" },
];

/** The policy: five columns from a 560px main column, else one, each cell with its label. */
const POLICY_COLS =
  "grid-cols-[minmax(0,1fr)] gap-x-3 @min-[559.5px]:grid-cols-[minmax(0,1.2fr)_minmax(0,0.95fr)_minmax(0,1fr)_minmax(0,0.65fr)_minmax(0,1.2fr)]";
/** This period: five columns from 540px; below it the position and its difference. */
const PERIOD_COLS =
  "grid-cols-[minmax(0,1fr)_auto] gap-x-3 @min-[539.5px]:grid-cols-[minmax(0,1.75fr)_minmax(0,0.55fr)_minmax(0,0.65fr)_minmax(0,0.95fr)_minmax(0,0.9fr)]";
const head = "border-b border-ink px-2 pb-[7px] text-[10.5px] text-sec";
const body = "grid items-baseline gap-y-[3px] px-2 py-[9px]";
const text = "min-w-0 text-[12.5px] leading-[1.45] text-ink-2";

/** A cell's label on narrow columns, inline before its value. */
function Label({ children, sans }: { children: ReactNode; sans?: boolean }) {
  return <span className={cx("text-[11px] text-mut @min-[559.5px]:hidden", sans && "font-sans")}>{children}</span>;
}

/** A mono label on a line of its own ("Policy"). */
function Part({ className, children }: { className: string; children: ReactNode }) {
  return (
    <div className={className}>
      <span className={cx(monoLabel, "text-sec")}>{children}</span>
    </div>
  );
}

export function PriceTests() {
  return (
    <Figure
      image={tileImages["nav-pack-review"]}
      veil={0.72}
      metaRight={false}
      className="mt-8"
      label="Price tests · NAV Pack Review"
      meta="Larkspur Credit Opportunities Fund II · Q2 2026"
      evidence="Vendor A file 2026-06-30 · Vendor B file 2026-06-30 · Tallis Brook 1L → 96.25 vs 94.75 → |Δ| 1.50 pt > 1.0 pt (pricing policy v4, illustrative) → challenge raised → Valuation analyst · 2026-07-08 10:05"
      moment="A move outside its band opens a price challenge. The valuation function decides the mark."
      caption="Price tests against an illustrative pricing policy. One syndicated loan moves 1.50 points between vendors, outside its 1.0-point band; a challenge is raised."
    >
      <Sheet>
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
          <SheetTitle>Pricing policy tolerance bands</SheetTitle>
          <span className="inline-flex items-center rounded-full border border-rule px-2 py-0.5 font-mono text-[10px] tracking-[0.05em] text-sec uppercase">
            Illustrative policy · not an industry standard
          </span>
        </div>
        <div className="mt-1 mb-3 font-mono text-[10.5px] leading-[1.6] text-mut">
          Tolerances are set in your pricing policy, by asset class and instrument · all names and figures fictional
        </div>

        <Part className="mt-1 mb-2">Policy</Part>
        <div role="table" aria-label="Pricing policy">
          <div role="row" className={cx(POLICY_COLS, head, "hidden @min-[559.5px]:grid")}>
            <span role="columnheader">Asset class</span>
            <span role="columnheader">Primary source</span>
            <span role="columnheader">Compared with</span>
            <span role="columnheader" className="text-right">
              Tolerance
            </span>
            <span role="columnheader">Action outside the band</span>
          </div>
          {POLICY.map((p, i) => (
            <div key={p.cls} role="row" className={cx(POLICY_COLS, body, i < POLICY.length - 1 && "border-b border-rule-2")}>
              <span role="rowheader" className="min-w-0 text-[13px] leading-[1.35] font-medium tracking-[-0.01em]">
                {p.cls}
              </span>
              <span role="cell" className={text}>
                <Label>Primary source · </Label>
                {p.primary}
              </span>
              <span role="cell" className={text}>
                <Label>Compared with · </Label>
                {p.compared}
              </span>
              <span role="cell" className="min-w-0 text-left font-mono text-[11.5px] @min-[559.5px]:text-right">
                <Label sans>Tolerance · </Label>
                {p.tolerance}
              </span>
              <span role="cell" className={text}>
                <Label>Outside the band · </Label>
                {p.action}
              </span>
            </div>
          ))}
        </div>

        <Part className="mt-5 mb-2">This period · 30 Jun 2026</Part>
        <div role="table" aria-label="This period">
          <div role="row" className={cx(PERIOD_COLS, head, "hidden @min-[539.5px]:grid")}>
            <span role="columnheader">Position</span>
            <span role="columnheader" className="text-right">
              Primary
            </span>
            <span role="columnheader" className="text-right">
              Compared
            </span>
            <span role="columnheader" className="text-right">
              Difference
            </span>
            <span role="columnheader">Status</span>
          </div>
          {PERIOD.map((p, i) => (
            <div
              key={p.name}
              role="row"
              className={cx(PERIOD_COLS, body, i < PERIOD.length - 1 && "border-b border-rule-2", p.out && "bg-bad-bg")}
            >
              <span role="rowheader" className="min-w-0">
                <span className="block text-[13px] leading-[1.35]">{p.name}</span>
                <span className={cx("mt-0.5 block text-[11.5px]", p.out ? "text-mut-ink-2" : "text-mut")}>{p.kind}</span>
              </span>
              <span role="cell" className="hidden text-right font-mono text-[11.5px] @min-[539.5px]:block">
                {p.primary}
              </span>
              <span role="cell" className="hidden text-right font-mono text-[11.5px] @min-[539.5px]:block">
                {p.compared}
              </span>
              <span role="cell" className={cx("text-right font-mono text-[11px]", p.out ? "text-bad-ink" : "text-ink")}>
                {p.diff}
              </span>
              <span
                role="cell"
                className={cx(
                  "col-span-full flex items-baseline gap-1.5 text-[12px] @min-[539.5px]:col-auto",
                  p.out ? "text-bad-ink" : "text-ink",
                )}
              >
                <Dot tone={p.out ? "bad" : "ok"} level />
                <span>{p.status}</span>
              </span>
              <span
                role="cell"
                className={cx("col-span-full font-mono text-[10px] @min-[539.5px]:hidden", p.out ? "text-mut-ink-2" : "text-mut")}
              >
                primary {p.primary} · compared {p.compared}
              </span>
            </div>
          ))}
        </div>
      </Sheet>
    </Figure>
  );
}
