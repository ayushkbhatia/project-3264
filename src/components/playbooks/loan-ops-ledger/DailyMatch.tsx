import { featureImages } from "@/components/playbooks/media";
import { Figure, Sheet, cx } from "@/components/playbooks/article/figure";

// F3 (§03): six of one day's 42 agent notices for a fictional fund, matched against the loan
// system: three match, three break, each break classed and owned. A table from a 600px main
// column, one card per notice below it. Rates marked * are illustrative.

type Notice = {
  t: string;
  bor: string;
  fac: string;
  ev: string;
  evd: string;
  agt: string;
  sys: string;
  dif: string;
  /** The difference is a break (red). */
  bad: boolean;
  cls?: string;
  own?: string;
  st: string;
  /** Status dot green (else red). */
  ok: boolean;
};

const NOTICES: Notice[] = [
  { t: "08:12", bor: "Tallis Brook Components", fac: "Term Loan (1L)", ev: "Rate set, 30 Jun – 30 Sep 2026", evd: "Term SOFR 3M 3.8412%* + 5.25%", agt: "9.0912%", sys: "9.0912%", dif: "0.0000%", bad: false, st: "Matched", ok: true },
  { t: "08:31", bor: "Brisbane Lane Foods", fac: "Revolving credit facility", ev: "Borrowing, 25 Jun 2026", evd: "Term SOFR 1M", agt: "2,000,000.00", sys: "2,000,000.00", dif: "0.00", bad: false, st: "Matched", ok: true },
  { t: "09:05", bor: "Oakmere Dental", fac: "Delayed draw term loan", ev: "Ticking fee, 1–13 Jun 2026", evd: "8,000,000.00 undrawn · 1.00% · ACT/360", agt: "2,888.89", sys: "2,666.67", dif: "+222.22", bad: true, cls: "Day count · 13 vs 12 days", own: "Loan operations analyst", st: "Explained · query to agent", ok: false },
  { t: "09:47", bor: "Norland Aero", fac: "Term Loan", ev: "Excess cash flow paydown", evd: "1,200,000.00 effective 25 Jun 2026", agt: "17,200,000.00", sys: "18,400,000.00", dif: "−1,200,000.00", bad: true, cls: "Paydown timing · principal", own: "Treasury", st: "Explained · awaiting cash", ok: false },
  { t: "10:20", bor: "Pellam Logistics", fac: "Term Loan", ev: "Interest, ABR (Prime)", evd: "6,500,000.00 · 11.50%* · 91 days · ACT/365", agt: "186,363.01", sys: "186,363.01", dif: "0.00", bad: false, st: "Matched", ok: true },
  { t: "11:02", bor: "Penrose Vale Software", fac: "Term Loan", ev: "Interest, 50% PIK", evd: "cash due 30 Jun 2026", agt: "299,126.96", sys: "598,253.91", dif: "−299,126.95", bad: true, cls: "PIK toggle · cash and principal", own: "Loan operations analyst", st: "Explained · booked", ok: true },
];

const COLS = "grid grid-cols-[minmax(0,1.55fr)_repeat(3,minmax(0,1fr))_minmax(0,1.25fr)] gap-x-3";
const num = "text-right font-mono text-[11.5px]";

function Status({ n }: { n: Notice }) {
  return (
    <span className="flex items-baseline gap-[7px] text-[12px] leading-[1.35]">
      <span aria-hidden="true" className={cx("size-[7px] flex-none -translate-y-px rounded-full", n.ok ? "bg-ok" : "bg-bad")} />
      <span>{n.st}</span>
    </span>
  );
}

export function DailyMatch() {
  return (
    <Figure
      image={featureImages["capital-call-flow"]}
      veil={0.7}
      metaRight={false}
      captionGap={6}
      className="mt-10"
      label="Daily match · agent notices vs loan system"
      meta="Larkspur Credit Opportunities Fund II · 23 Jun 2026 · 6 of 42 notices"
      evidence={
        'OAK-DDTL-TF-20260623.pdf · v1 · p.1 "Ticking Fee" → 2,888.89 → 8,000,000.00 × 1.00% × 12/360 = 2,666.67; notice counts 13 days, §2.12(c) counts first day not last → explained · day count · query raised → loan operations analyst · 2026-06-23 09:31 ET'
      }
      moment="Three breaks, three different causes; the agent's figure stands until the agent answers the query."
      caption="Six of one day's 42 agent notices for a fictional fund: three matched, three breaks, each classed and owned."
    >
      <Sheet pad="px-4 py-3.5">
        {/* from a 600px column: a table */}
        <div role="table" className="hidden @min-[599.5px]:block">
          <div role="row" className={cx(COLS, "items-end border-b border-ink pb-2 text-[11px] font-medium text-sec")}>
            <span role="columnheader">Borrower · event</span>
            <span role="columnheader" className="text-right font-mono font-normal">
              Agent notice
            </span>
            <span role="columnheader" className="text-right font-mono font-normal">
              Loan system
            </span>
            <span role="columnheader" className="text-right font-mono font-normal">
              Difference
            </span>
            <span role="columnheader">Status</span>
          </div>
          {NOTICES.map((n) => (
            <div key={n.t} role="row" className={cx(COLS, "items-start border-b border-rule-2 py-[11px]")}>
              <span role="rowheader" className="min-w-0">
                <span className="block text-[13px] leading-[1.35]">{n.bor}</span>
                <span className="mt-0.5 block text-[11px] leading-[1.4] text-sec">
                  {n.fac} · <span className="font-mono">{n.t}</span>
                </span>
                <span className="mt-1.5 block text-[12px] leading-[1.4]">{n.ev}</span>
                <span className="mt-px block text-[11px] leading-[1.4] text-sec">{n.evd}</span>
              </span>
              <span role="cell" className={num}>
                {n.agt}
              </span>
              <span role="cell" className={num}>
                {n.sys}
              </span>
              <span role="cell" className={cx(num, n.bad ? "text-bad" : "text-ink")}>
                {n.dif}
              </span>
              <span role="cell" className="min-w-0">
                <Status n={n} />
                {n.own ? (
                  <>
                    <span className="mt-1.5 ml-3.5 block text-[11px] leading-[1.4]">{n.cls}</span>
                    <span className="mt-px ml-3.5 block text-[11px] leading-[1.4] text-sec">{n.own}</span>
                  </>
                ) : null}
              </span>
            </div>
          ))}
        </div>

        {/* below it: one card per notice */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,240px),1fr))] gap-2.5 @min-[599.5px]:hidden">
          {NOTICES.map((n) => (
            <div key={n.t} className="flex flex-col gap-2.5 rounded-[10px] border border-rule-2 bg-white p-3.5">
              <div>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-[13.5px] font-medium">{n.bor}</span>
                  <span className="font-mono text-[11px] text-sec">{n.t}</span>
                </div>
                <div className="mt-0.5 text-[12px] text-sec">{n.fac}</div>
              </div>
              <div>
                <div className="text-[12.5px] leading-[1.4]">{n.ev}</div>
                <div className="mt-0.5 text-[11.5px] leading-[1.4] text-sec">{n.evd}</div>
              </div>
              <div className="grid gap-[3px] font-mono text-[11.5px]">
                <div className="flex justify-between gap-3">
                  <span className="text-sec">Agent notice</span>
                  <span>{n.agt}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-sec">Loan system</span>
                  <span>{n.sys}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-sec">Difference</span>
                  <span className={n.bad ? "text-bad" : "text-ink"}>{n.dif}</span>
                </div>
              </div>
              {n.own ? (
                <div>
                  <div className="text-[12px] leading-[1.4]">{n.cls}</div>
                  <div className="mt-0.5 text-[11.5px] text-sec">{n.own}</div>
                </div>
              ) : null}
              <Status n={n} />
            </div>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-5 gap-y-1.5">
          <span className="text-[11px] leading-[1.5] text-sec">
            {"* Illustrative rates, not published fixings. Conventions are each loan's own (fictional)."}
          </span>
          <span className="font-mono text-[11px] leading-[1.5]">42 received · 39 matched · 3 breaks, each classed and owned</span>
        </div>
      </Sheet>
    </Figure>
  );
}
