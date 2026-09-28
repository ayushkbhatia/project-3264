import { Fragment } from "react";
import { featureImages } from "@/components/playbooks/media";
import { Figure, Sheet, SheetTitle, cx } from "@/components/playbooks/article/figure";

// F2 (§03): Call No. 07's receipts the day after the due date, from the bank's prior-day BAI2
// file, each wire matched to an investor. Three funded, one short by a bank's charge
// (explained, not chased), one proposed match a person must confirm, one late. A table from a
// 600px main column; below it the Due, Received and Variance columns fold into a line under the
// investor. All data fictional; the totals reconcile to the call.

type Status = "funded" | "short" | "awaiting" | "late";

type Receipt = {
  name: string;
  /** As the bank reports it: payer text, bank reference · value date, any charges. */
  payer: string[];
  due: string;
  received: string;
  variance: string;
  /** The variance is money not received (red). */
  bad?: boolean;
  status: Status;
  match: string;
  note?: string;
  /** The row the moment sentence is about, tinted. */
  moment?: boolean;
};

const RECEIPTS: Receipt[] = [
  {
    name: "Calder County Retirement System",
    payer: ["CALDER CTY RET SYS ALDERCOVE GF III CALL 07", "FW26100901 · 2026-10-09"],
    due: "7,515,833.33",
    received: "7,515,833.33",
    variance: "0.00",
    status: "funded",
    match: "match: exact",
  },
  {
    name: "Lanvik Sovereign Holdings",
    payer: ["LANVIK SOV HLDGS AGF3 C07", "FW26101402 · 2026-10-14"],
    due: "194,791.67",
    received: "194,791.67",
    variance: "0.00",
    status: "funded",
    match: "match: exact",
  },
  {
    name: "Northfield University Endowment",
    payer: ["NORTHFIELD UNIV END CALL 07", "IN26101407 · 2026-10-14", "charges 25.00 (legacy 71F)"],
    due: "5,010,555.56",
    received: "5,010,530.56",
    variance: "−25.00",
    bad: true,
    status: "short",
    match: "match: exact",
    note: "intermediary charge; fund accountant decides whether to request 25.00",
    moment: true,
  },
  {
    name: "Tamsin Mutual Insurance",
    payer: ["INV 88213 TMI", "FW26101503 · 2026-10-15"],
    due: "3,131,597.23",
    received: "3,131,597.23",
    variance: "0.00",
    status: "awaiting",
    match: "match: proposed",
    note: "payer text does not name the LP; a person confirms",
  },
  {
    name: "Harlow Foundation",
    payer: ["HARLOW FDN ALDERCOVE III", "FW26101305 · 2026-10-13"],
    due: "1,878,958.33",
    received: "1,878,958.33",
    variance: "0.00",
    status: "funded",
    match: "match: exact",
  },
  {
    name: "Ashgrove Family Office",
    payer: ["no credit by due date"],
    due: "1,252,638.88",
    received: "—",
    variance: "−1,252,638.88",
    bad: true,
    status: "late",
    match: "match: —",
    note: "reminder drafted for IR to send",
  },
];

/** Status: its label, its text colour and its 7px dot (solid, or an ink ring while open). */
const STATUS: Record<Status, { label: string; tone: string; dot: string }> = {
  funded: { label: "Funded", tone: "text-ok", dot: "bg-ok" },
  short: { label: "Short, explained", tone: "text-ink", dot: "border-[1.5px] border-ink" },
  awaiting: { label: "Awaiting confirmation", tone: "text-ink", dot: "border-[1.5px] border-ink" },
  late: { label: "Late", tone: "text-bad", dot: "bg-bad" },
};

const TOTALS: Array<[string, string]> = [
  ["Due", "18,984,375.00"],
  ["Confirmed", "14,600,113.89"],
  ["Awaiting confirmation", "3,131,597.23"],
  ["Not received", "1,252,638.88"],
  ["Short", "25.00"],
];

/** Two columns; five from a 600px main column. */
const TRACKS =
  "grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] gap-x-2.5 @min-[599.5px]:grid-cols-[minmax(0,1.65fr)_repeat(3,minmax(0,0.95fr))_minmax(0,1.3fr)]";
const WIDE = "hidden @min-[599.5px]:block";
const num = "text-right font-mono text-[10.5px]";

export function WireMatch() {
  return (
    <Figure
      image={featureImages["capital-call-flow"]}
      veil={0.72}
      metaRight={false}
      className="mt-10"
      label="Aldercove Growth Fund III, L.P. · Capital Call No. 07 · Receipts"
      meta={
        <>
          due 2026-10-15 · as of 2026-10-16 09:00 ET
          <br />
          source: BAI2 prior-day file, type 195 credits · USD
        </>
      }
      evidence="16,195,751583333,0,FW26100901,,CALDER CTY RET SYS ALDERCOVE GF III CALL 07 → 7,515,833.33 → exact → funded → fund accountant · 2026-10-09"
      moment="Northfield is 25.00 short because a bank on the route took its charge. The shortfall is explained, not chased."
      caption="Nothing here puts an LP in default. A Default Notice is the GP's decision, and the cure period is set by the LPA. Fictional data."
    >
      <Sheet>
        <SheetTitle id="ccf-receipts-title">Wires matched to investors</SheetTitle>
        <div role="table" aria-labelledby="ccf-receipts-title" className="mt-3">
          <div role="row" className={cx("hidden @min-[599.5px]:grid", TRACKS, "border-b border-ink px-1.5 pb-2 text-[10.5px] text-sec")}>
            <span role="columnheader">Limited partner · payer text · bank ref · value date</span>
            <span role="columnheader" className="text-right font-mono">
              Due
            </span>
            <span role="columnheader" className="text-right font-mono">
              Received
            </span>
            <span role="columnheader" className="text-right font-mono">
              Variance
            </span>
            <span role="columnheader">Status</span>
          </div>

          {RECEIPTS.map((r) => {
            const s = STATUS[r.status];
            return (
              <div
                key={r.name}
                role="row"
                className={cx("grid", TRACKS, "items-start border-b border-rule-2 px-1.5 py-2.5", r.moment && "bg-[#F1EEE8]")}
              >
                <span role="rowheader" className="min-w-0">
                  <span className="block text-[12.5px] leading-[1.35]">{r.name}</span>
                  <span className="mt-1 block font-mono text-[9.5px] leading-[1.6] text-sec [overflow-wrap:anywhere]">
                    {r.payer.map((line, i) => (
                      <Fragment key={i}>
                        {i ? <br /> : null}
                        {line}
                      </Fragment>
                    ))}
                  </span>
                  {/* below a 600px column, the three amount columns fold into this line */}
                  <span className="mt-1 block font-mono text-[10px] text-ink @min-[599.5px]:hidden">
                    due {r.due} · received {r.received} · {r.variance}
                  </span>
                </span>
                <span role="cell" className={cx(WIDE, num)}>
                  {r.due}
                </span>
                <span role="cell" className={cx(WIDE, num)}>
                  {r.received}
                </span>
                <span role="cell" className={cx(WIDE, num, r.bad && "text-bad")}>
                  {r.variance}
                </span>
                <span role="cell" className="min-w-0">
                  <span className={cx("flex items-baseline gap-1.5 text-[12px] leading-[1.35]", s.tone)}>
                    <span aria-hidden="true" className={cx("size-[7px] flex-none -translate-y-px rounded-full", s.dot)} />
                    <span>{s.label}</span>
                  </span>
                  {/* on the tinted row, --mut-ink: the design's grey is 4.48:1 there */}
                  <span className={cx("mt-[3px] ml-[13px] block font-mono text-[9.5px]", r.moment ? "text-mut-ink" : "text-mut")}>{r.match}</span>
                  {r.note ? <span className="mt-[3px] ml-[13px] block text-[10.5px] leading-[1.45] text-sec">{r.note}</span> : null}
                </span>
              </div>
            );
          })}
        </div>

        <dl className="mt-3 mb-0 grid grid-cols-[repeat(auto-fit,minmax(104px,1fr))] gap-x-3.5 gap-y-2.5 border-t border-ink px-1.5 pt-3">
          {TOTALS.map(([label, value]) => (
            <div key={label}>
              <dt className="text-[10.5px] text-sec">{label}</dt>
              <dd className="mt-[3px] font-mono text-[12px] font-medium">{value}</dd>
            </div>
          ))}
        </dl>
      </Sheet>
    </Figure>
  );
}
