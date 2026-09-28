import type { ReactNode } from "react";
import { tileImages } from "@/components/playbooks/media";
import { Figure, Sheet, cx } from "@/components/playbooks/article/figure";
import { CLIENT, Fictional, MANDATE, SheetHead, SheetMoment, Status } from "./parts";

// F2 (§03): one buy order tested against the mandate's rules before release. Four checks pass,
// the issuer-group limit warns (4.71% against a 4.50% warning level) and the firm restricted list
// blocks, so the order is held and never reaches the broker. All data fictional; the projected
// values are market value including cash, with the price held at 98.00 for illustration.
//
// Layout by main-column width: the six columns from 560px (Math.round(width) >= 560, so the query
// sits half a pixel below); under that, each check is a two-line row, the test and then its
// projected value, limit and result on a mono line. The reference switches its cells at 540px
// and its columns at 560, which folds the table into a broken two-column grid in between; the
// port switches both at 560, as the handoff's README specifies.

type Result = "pass" | "warn" | "block";

type Check = {
  n: string;
  rule: string;
  test: string;
  projected: ReactNode;
  /** Under the projected value (wide), "from" the position before the order. */
  from?: string;
  limit: string;
  result: Result;
  at: string;
};

const CHECKS: Check[] = [
  { n: "1", rule: "MG-0401 v2", test: "Permitted instruments (§3.1)", projected: "senior fixed", limit: "permitted", result: "pass", at: "09:14:02.204" },
  {
    n: "2",
    rule: "MG-0412 v3",
    test: "Investment grade at purchase (§4.2(c))",
    projected: "A3 · BBB+ · A− → A−",
    limit: "≥ BBB−",
    result: "pass",
    at: "09:14:02.231",
  },
  {
    n: "3",
    rule: "MG-0412 v3",
    test: "Issuer group, % of market value (§4.2(c))",
    projected: <strong className="font-semibold">4.71%</strong>,
    from: "from 4.22%",
    limit: "warn 4.50% · max 5.00%",
    result: "warn",
    at: "09:14:02.259",
  },
  {
    n: "4",
    rule: "MG-0415 v1",
    test: "Utilities sector ≤ 20% (§4.3(a))",
    projected: "14.95%",
    from: "from 14.46%",
    limit: "20.00%",
    result: "pass",
    at: "09:14:02.288",
  },
  {
    n: "5",
    rule: "MG-0430 v1",
    test: "Duration within ±1.50 yrs of benchmark (§4.6)",
    projected: "6.44",
    from: "from 6.42",
    limit: "4.60–7.60",
    result: "pass",
    at: "09:14:02.317",
  },
  {
    n: "6",
    rule: "RL-FIRM",
    test: "Firm restricted list (issuer listed 2026-09-16)",
    projected: "listed",
    limit: "not listed",
    result: "block",
    at: "09:14:02.346",
  },
];

const ORDER: Array<[string, string]> = [
  ["side", "BUY"],
  ["nominal", "2,500,000"],
  ["security", "Brackwell Utilities plc 4.25% 2031"],
  ["price", "98.00"],
  ["value", "£2.45m"],
];

/** Two tracks under a 560px column, six from there. */
const TRACKS =
  "grid-cols-[18px_minmax(0,1fr)] @min-[559.5px]:grid-cols-[18px_minmax(0,0.72fr)_minmax(0,1.55fr)_minmax(0,0.95fr)_minmax(0,0.95fr)_minmax(0,0.66fr)]";
const WIDE = "hidden @min-[559.5px]:block";
const NARROW = "block @min-[559.5px]:hidden";
const FIGURE_CELL = cx(WIDE, "min-w-0 text-right font-mono text-[11px] leading-[1.45]");

/** WARN: an outlined badge. PASS and BLOCK: a dot and the word, BLOCK in red. */
function ResultMark({ result }: { result: Result }) {
  if (result === "warn")
    return (
      <span className="inline-block rounded-[4px] border border-ink px-[5px] font-mono text-[10.5px] leading-[1.5] font-medium">WARN</span>
    );
  return result === "pass" ? (
    <Status tone="ok">PASS</Status>
  ) : (
    // always on the red row
    <Status tone="bad" onTint>
      BLOCK
    </Status>
  );
}

export function CheckSequence() {
  return (
    <Figure
      image={tileImages["client-reporting-flow"]}
      veil={0.74}
      metaRight={false}
      className="mt-8"
      label="Pre-trade compliance · check sequence"
      meta={
        <>
          order QGC-26-0917-031 · 2026-09-17
          <br />
          book IBOR · portfolio £500.00m incl. cash
        </>
      }
      evidence={
        <>
          QGC-26-0917-031 · ACCT-ASHBY-01 · pre-trade · IBOR 2026-09-17 09:14:02 → 6 checks → MG-0412 v3 WARN 4.71% (warn 4.50%) ·
          RL-FIRM <span className="font-medium text-bad">BLOCK</span> → order held, no 35=D → routed to portfolio manager and compliance ·
          09:14:03
        </>
      }
      note={
        // 11.5px here: a block inside the frame's 12px note, so its lines are 11.5px lines
        <span className="block text-[11.5px]">
          Projected values: market value including cash; price 98.00 held for illustration. A warning can be overridden with a reason; a
          block cannot.
        </span>
      }
      caption="Every order is tested per account against every applicable rule before release. The rule engine decides; no model is in this path."
    >
      <Sheet>
        <SheetHead
          title={
            <>
              {MANDATE} <Fictional />
            </>
          }
          sub={CLIENT}
        />

        {/* The order as the OMS holds it: each field on one line, as in the reference. Under a
            334px column (phones narrower than ~373px) the reference's security runs past the card
            (14px at 360, 54px at 320), so there its value may wrap. */}
        <dl className="mt-3.5 mb-3 flex flex-wrap gap-x-[18px] gap-y-1.5 border-y border-rule-2 px-2 py-2.5 font-mono text-[11px]">
          {ORDER.map(([k, v]) => (
            <div key={k} className="whitespace-nowrap">
              <dt className="inline text-mut">{k}</dt>{" "}
              <dd className="m-0 inline font-semibold text-ink @max-[333.5px]:whitespace-normal">{v}</dd>
            </div>
          ))}
        </dl>

        <div role="table" aria-label="Pre-trade checks on order QGC-26-0917-031">
          <div role="row" className={cx("hidden @min-[559.5px]:grid", TRACKS, "gap-x-3 border-b border-ink px-2 pb-[7px] text-[10.5px] text-sec")}>
            <span role="columnheader">#</span>
            <span role="columnheader">Rule</span>
            <span role="columnheader">Test (IMA clause)</span>
            <span role="columnheader" className="text-right">
              Projected
            </span>
            <span role="columnheader" className="text-right">
              Limit
            </span>
            <span role="columnheader">Result</span>
          </div>

          {CHECKS.map((c) => {
            const blocked = c.result === "block";
            return (
              <div
                key={c.n}
                role="row"
                className={cx("grid", TRACKS, "items-baseline gap-x-2.5 gap-y-[3px] px-2 py-[9px]", blocked ? "bg-bad-bg" : "border-b border-rule-2")}
              >
                {/* on the red row, muted and faint text take --mut-ink-2 (AA on the tint) */}
                <span role="cell" className={cx("font-mono text-[10.5px]", blocked ? "text-mut-ink-2" : "text-mut")}>
                  {c.n}
                </span>
                <span role="cell" className={cx(WIDE, "min-w-0 font-mono text-[10.5px]")}>
                  {c.rule}
                </span>
                <span role="rowheader" className="min-w-0 text-[12.5px] leading-[1.4]">
                  <span className={cx(NARROW, "font-mono text-[10.5px] text-sec")}>{c.rule}</span>
                  {c.test}
                </span>
                <span role="cell" className={FIGURE_CELL}>
                  {c.projected}
                  {c.from ? <span className="block text-[9.5px] text-mut">{c.from}</span> : null}
                </span>
                <span role="cell" className={FIGURE_CELL}>
                  {c.limit}
                </span>
                <span role="cell" className={cx(WIDE, "min-w-0 leading-[1.3]")}>
                  <ResultMark result={c.result} />
                  {/* the design's #8A887F is under AA here: --faint-ink on the sheet, --mut-ink-2 on the red row */}
                  <span className={cx("mt-0.5 block font-mono text-[9.5px]", blocked ? "text-mut-ink-2" : "text-faint-ink")}>{c.at}</span>
                </span>
                <span role="cell" className={cx(NARROW, "col-[2/-1] font-mono text-[10.5px] leading-[1.6] text-sec")}>
                  projected {c.projected} · limit {c.limit} · <ResultMark result={c.result} />
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1.5 rounded-[10px] border-[1.5px] border-bad px-3 py-2.5 font-mono text-[11px] leading-[1.5]">
          <span aria-hidden="true" className="size-[7px] flex-none rounded-full bg-bad" />
          <span className="font-semibold text-bad">HELD</span>
          <span className="min-w-0 flex-[1_1_240px]">6 checks · 4 pass · 1 warning · 1 block → not released · no FIX 35=D sent</span>
          <span className="text-mut">09:14:03.006</span>
        </div>

        <SheetMoment>The order stops in the OMS. Nothing reaches the broker until the block is cleared.</SheetMoment>
      </Sheet>
    </Figure>
  );
}
