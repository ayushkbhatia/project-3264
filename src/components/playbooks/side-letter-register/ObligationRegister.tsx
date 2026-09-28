"use client";

import { useId, useRef } from "react";
import { tileImages } from "@/components/playbooks/media";
import { Figure, Sheet, SheetTitle, cx } from "@/components/playbooks/article/figure";
import { ON_TOP_IN_UPPER_65, useHeroReveal } from "@/components/playbooks/article/useHeroReveal";

// F1, the hero figure: five of the register's 105 rows on 2026-11-17, each obligation with its
// clause, owner, next due date and proof. The reveal brings the rows in one after another, then
// flags the one without proof: Tamsin's look-through report, overdue by two Business Days (the
// only red on the tile). All data fictional; the fund and its LPs are Capital Call Flow's.
//
// Layout by main-column width, at the reference's threshold (Math.round(width) >= 560, so the
// query sits half a pixel below): four columns under a header row from 560px; below that each
// row stacks, and its due date carries an inline "Next due ·" label.

type Tone = "ok" | "open" | "bad";

type Row = {
  id: string;
  clause: string;
  investor: string;
  obligation: string;
  /** Type · owner. */
  kind: string;
  due: string;
  /** The period the due date is for. */
  period?: string;
  status: string;
  tone: Tone;
  proof: string;
};

const ROWS: Row[] = [
  {
    id: "SL-CCRS-4.1",
    clause: "side letter v2 · §4.1",
    investor: "Calder County Retirement System",
    obligation: "Quarterly ESG data within 60 days of quarter end",
    kind: "Recurring · Investor relations",
    due: "2026-11-29",
    period: "Q3 2026",
    status: "Q2 delivered",
    tone: "ok",
    proof: "portal receipt 2026-08-29",
  },
  {
    id: "SL-LSH-3.1",
    clause: "side letter v1 · §3.1",
    investor: "Lanvik Sovereign Holdings",
    obligation: "Excuse from restricted-sector investments",
    kind: "Event · capital call · Fund operations",
    due: "each call",
    status: "Applied to Call 07",
    tone: "ok",
    proof: "Call 07 notice 2026-09-30",
  },
  {
    id: "SL-TMI-5.1",
    clause: "side letter v1 · §5.1",
    investor: "Tamsin Mutual Insurance",
    obligation: "Solvency II look-through report within 30 Business Days of quarter end",
    kind: "Recurring · Fund controller",
    due: "2026-11-13",
    period: "Q3 2026",
    status: "Overdue · 2 Business Days",
    tone: "bad",
    proof: "no delivery to an approved contact",
  },
  {
    id: "SL-NUE-2.3",
    clause: "side letter v1 · §2.3",
    investor: "Northfield University Endowment",
    obligation: "Management fee discount of 15 bps from 1 Jan 2027",
    kind: "Economic · Fund accounting",
    due: "2027-01-01",
    period: "Q1 2027 fee",
    status: "Scheduled",
    tone: "open",
    proof: "Q4 2026 fee undiscounted",
  },
  {
    id: "SL-LSH-9.0",
    clause: "side letter v1 · §9",
    investor: "Lanvik Sovereign Holdings",
    obligation: "Sovereign immunity reservation",
    kind: "Interpretive · GP legal",
    due: "—",
    status: "No action",
    tone: "open",
    proof: "classification confirmed by counsel",
  },
];

/** Rows 1–5 fade in at 300, 450, 600, 750 and 900ms; at 1050 Tamsin's row turns red. */
const SCHEDULE = [300, 450, 600, 750, 900, 1050];
const FLAGGED = SCHEDULE.length;

/** One column; four from a 560px main column. */
const COLS =
  "grid-cols-[minmax(0,1fr)] @min-[559.5px]:grid-cols-[minmax(0,0.8fr)_minmax(0,1.7fr)_minmax(0,0.62fr)_minmax(0,1.2fr)]";

export function ObligationRegister({ animate = true }: { animate?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  // the handoff's trigger: the figure's top in the upper 65% of the viewport, or the final state
  // if that has not happened within 4s of mount
  const step = useHeroReveal(ref, animate, ON_TOP_IN_UPPER_65, SCHEDULE);
  const titleId = useId();
  const flagged = step >= FLAGGED;

  return (
    <Figure
      ref={ref}
      data-reveal-root={animate ? "on" : "off"}
      image={tileImages["side-letter-register"]}
      veil={0.72}
      eager
      metaRight={false}
      className="mt-9"
      label="Aldercove Growth Fund III, L.P. · Side-letter obligation register"
      meta={
        <>
          as of 2026-11-17 · register v14
          <br />
          {"5 of 105 rows · 6 side letters + LPA"}
          <br />
          Business Days: New York banking calendar
        </>
      }
      evidence={
        <>
          SL-TMI-5.1 · Tamsin side letter v1 · §5.1 p.4 l.12–18 → due 2026-11-13 (Q3 end + 30 Business Days) → delivery log: none to an
          approved contact → <span className="font-medium text-bad">OVERDUE · 2 BD</span> → escalated to fund controller · 2026-11-17
          09:00 ET
        </>
      }
      moment="Due 13 Nov: 30 Business Days after quarter end. No delivery to an approved contact is logged, so the row stays open."
      caption="An obligation register for a fictional fund. Each row keeps its clause, owner and proof; the one without proof is flagged."
    >
      <Sheet>
        <SheetTitle id={titleId}>Five obligations, each with its clause, owner and proof</SheetTitle>
        <div role="table" aria-labelledby={titleId} className="mt-3">
          <div role="row" className={cx("hidden @min-[559.5px]:grid", COLS, "gap-x-3 border-b border-ink px-2 pb-[7px] text-[10.5px] text-sec")}>
            <span role="columnheader">Clause</span>
            <span role="columnheader">Investor · obligation</span>
            <span role="columnheader">Next due</span>
            <span role="columnheader">Evidence</span>
          </div>

          {ROWS.map((r, i) => {
            const bad = r.tone === "bad";
            const red = bad && flagged;
            // muted text on the red wash takes --mut-ink-2: the design's grey reads 4.19:1 there
            const mut = bad ? "text-mut-ink-2" : "text-mut";
            return (
              <div
                key={r.id}
                role="row"
                data-reveal="fade"
                className={cx(
                  "grid items-baseline gap-x-3 gap-y-1 px-2 py-2.5 [transition:opacity_300ms_ease,background_200ms_ease,box-shadow_200ms_ease]",
                  COLS,
                  i < ROWS.length - 1 && "border-b border-rule-2",
                )}
                style={{
                  opacity: step >= i + 1 ? 1 : 0,
                  ...(bad && {
                    background: red ? "#F6E3DF" : "transparent",
                    boxShadow: red ? "inset 2px 0 0 #C4341E" : "inset 0 0 0 0 transparent",
                  }),
                }}
              >
                <span role="rowheader" className="min-w-0">
                  <span className="block font-mono text-[11.5px]">{r.id}</span>
                  <span className={cx("mt-0.5 block font-mono text-[10px]", mut)}>{r.clause}</span>
                </span>
                <span role="cell" className="min-w-0">
                  <span className="block text-[13px] leading-[1.35] font-medium tracking-[-0.01em]">{r.investor}</span>
                  <span className="mt-[3px] block text-[13px] leading-[1.45] text-ink-2">{r.obligation}</span>
                  <span className={cx("mt-[3px] block text-[11.5px]", mut)}>{r.kind}</span>
                </span>
                <span role="cell" className="min-w-0">
                  <span className={cx("text-[11px] @min-[559.5px]:hidden", mut)}>Next due · </span>
                  <span className="font-mono text-[11.5px]">{r.due}</span>
                  {r.period ? <span className={cx("mt-0.5 block font-mono text-[10px]", mut)}>{r.period}</span> : null}
                </span>
                <span role="cell" className="min-w-0">
                  <Status row={r} red={red} />
                  <span className="mt-[3px] ml-[13px] block font-mono text-[10px] leading-[1.5] text-sec">{r.proof}</span>
                </span>
              </div>
            );
          })}
        </div>
        <p className="mt-3.5 mb-0 text-[14.5px] leading-[1.5] text-ink">
          Tamsin&apos;s Q3 look-through report has not reached an approved contact. The other four each carry their proof.
        </p>
      </Sheet>
    </Figure>
  );
}

/**
 * A row's status: a 7px dot and its words. Delivered or applied: green, solid. Scheduled or no
 * action: ink, a hollow grey ring. Overdue: ink with the hollow ring until the reveal flags it,
 * then red, solid (its words in --bad-ink, which passes AA on the red wash where the design's red
 * reads 4.40:1).
 */
function Status({ row, red }: { row: Row; red: boolean }) {
  const dot =
    row.tone === "ok"
      ? { background: "#157F52" }
      : row.tone === "open"
        ? { boxShadow: "inset 0 0 0 1px #8A887F" }
        : { background: red ? "#C4341E" : "transparent", boxShadow: `inset 0 0 0 1px ${red ? "#C4341E" : "#8A887F"}` };
  return (
    <span
      className={cx(
        "flex items-baseline gap-1.5 text-[12.5px] leading-[1.35]",
        row.tone === "ok" ? "text-ok" : red ? "text-bad-ink" : "text-ink",
      )}
    >
      <span
        aria-hidden="true"
        className={cx("size-[7px] flex-none rounded-full", row.tone === "bad" && "transition-[background] duration-200 ease-[ease]")}
        style={dot}
      />
      <span>{row.status}</span>
    </span>
  );
}
