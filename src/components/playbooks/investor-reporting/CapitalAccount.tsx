import { Figure, Sheet, SheetTitle, cx } from "@/components/playbooks/article/figure";
import { tileImages } from "@/components/playbooks/media";

// F2 (§01): one LP's quarter in the ILPA Reporting Template's capital account layout (Section
// A), rolled from beginning to ending NAV and tied to the administrator's statement. From a
// 540px main column it is a three-column table with a note per line; below it, line and amount
// only, with the carry note set once under the table. Fictional LP and fund; the roll-forward
// sums exactly. Negatives in parentheses, signed by their effect on the LP's wealth.

type Line = { line: string; amount: string; note?: string };

const LINES: Line[] = [
  { line: "Contributions", amount: "2,500,000" },
  { line: "Distributions", amount: "(1,850,000)" },
  { line: "Management fees", amount: "(187,500)" },
  { line: "Offsets", amount: "12,400", note: "Unapplied offset roll-forward in the full template" },
  { line: "Partnership expenses", amount: "(46,210)", note: "External expenses" },
  { line: "Internal chargebacks", amount: "(8,900)", note: "Paid to the GP or related persons, shown separately" },
  { line: "Investment income and gains", amount: "1,705,030", note: "Income 1,102,380 · realised 214,000 · unrealised 388,650" },
  { line: "Change in accrued carried interest", amount: "(206,420)", note: "Negative for LPs, positive for the GP, null for the Total Fund" },
];

const COMMITMENT: Array<[string, string]> = [
  ["Commitment", "50,000,000"],
  ["Unfunded, beginning", "12,500,000"],
  ["Contributions", "(2,500,000)"],
  ["Unfunded, ending", "10,000,000"],
];

/** Line, amount, note from a 540px main column; line and amount below it. */
const COLS = "grid-cols-[minmax(0,1fr)_auto] @min-[539.5px]:grid-cols-[minmax(0,1.3fr)_minmax(0,0.75fr)_minmax(0,1.5fr)]";
const ROW = cx("grid items-baseline gap-x-3.5 gap-y-[3px] p-2", COLS);
const AMOUNT = "text-right font-mono text-[11.5px]";
const NOTE = "hidden min-w-0 text-[12px] leading-[1.45] text-sec @min-[539.5px]:block";

/** The tie-out, in the status green. Set on the wash, so in its darker text shade (see
    --ok-ink in globals.css); the dot keeps the design's green. */
function Tie() {
  return (
    <span className="flex items-baseline gap-1.5 text-ok-ink">
      <span aria-hidden="true" className="size-[7px] flex-none rounded-full bg-ok" />
      <span>Ties to Northbay PCAP · difference 0</span>
    </span>
  );
}

export function CapitalAccount() {
  return (
    <Figure
      image={tileImages["client-reporting-flow"]}
      veil={0.74}
      metaRight={false}
      className="mt-8"
      label="Capital account statement · ILPA Reporting Template v2.0, Section A"
      meta="QTD Q2 2026 · USD"
      evidence="PCAP-LCOF-II-Q2-26 · Northbay v3 (fictional) · LP 014 ending NAV → 43,126,514 → roll-forward recompute, diff 0 → tied → Fund controller · 2026-08-06 11:40 UTC"
      moment="Carried interest is negative in the LP column, as ILPA's template signs values by their effect on each party's wealth."
      caption="One LP's quarter in the ILPA capital account layout, rolled from beginning to ending NAV and tied to the administrator's statement."
    >
      <Sheet>
        <SheetTitle>LP allocation: Calder County Retirement System (fictional)</SheetTitle>
        <div className="mt-1 mb-3 font-mono text-[10.5px] leading-[1.6] text-mut">
          Larkspur Credit Opportunities Fund II (fictional) · negatives in parentheses
        </div>

        <div role="table" aria-label="Capital account, QTD Q2 2026">
          <div role="row" className={cx("hidden gap-x-3 border-b border-ink px-2 pb-[7px] text-[10.5px] text-sec @min-[539.5px]:grid", COLS)}>
            <span role="columnheader">Line</span>
            <span role="columnheader" className="text-right">
              LP allocation, QTD
            </span>
            <span role="columnheader">Note</span>
          </div>

          <div role="row" className={cx(ROW, "border-b border-rule-2 bg-wash")}>
            <span role="rowheader" className="min-w-0 text-[13px] leading-[1.35] font-medium">
              Beginning NAV, 1 Apr 2026
            </span>
            <span role="cell" className={cx(AMOUNT, "font-medium")}>
              41,208,114
            </span>
            <span role="cell" className={NOTE} />
          </div>
          {LINES.map((l, i) => (
            <div key={l.line} role="row" className={cx(ROW, i < LINES.length - 1 && "border-b border-rule-2")}>
              <span role="rowheader" className="min-w-0 text-[13px] leading-[1.35]">
                {l.line}
              </span>
              <span role="cell" className={AMOUNT}>
                {l.amount}
              </span>
              <span role="cell" className={NOTE}>
                {l.note}
              </span>
            </div>
          ))}
          <div role="row" className={cx(ROW, "border-y border-ink bg-wash")}>
            <span role="rowheader" className="min-w-0 text-[13px] leading-[1.35] font-medium">
              Ending NAV, 30 Jun 2026
            </span>
            <span role="cell" className={cx(AMOUNT, "font-medium")}>
              43,126,514
            </span>
            <span role="cell" className={NOTE}>
              <Tie />
            </span>
            {/* below 540px the tie-out runs under the line and amount */}
            <span role="cell" className="col-[1/-1] block text-[12px] @min-[539.5px]:hidden">
              <Tie />
            </span>
          </div>
        </div>
        <p className="mt-2 mb-0 text-[11.5px] leading-[1.5] text-sec @min-[539.5px]:hidden">
          Change in accrued carried interest is negative for LPs, positive for the GP and null for the Total Fund.
        </p>

        <div className="mt-3.5 flex flex-wrap gap-x-[22px] gap-y-1.5 border-t border-rule-2 px-2 pt-3 font-mono text-[11px] text-sec">
          {COMMITMENT.map(([label, value]) => (
            <span key={label} className="whitespace-nowrap">
              {label} <strong className="font-medium text-ink">{value}</strong>
            </span>
          ))}
        </div>
      </Sheet>
    </Figure>
  );
}
