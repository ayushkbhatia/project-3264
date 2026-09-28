"use client";

import { useState } from "react";
import { tileImages } from "@/components/playbooks/media";
import { Figure, Sheet, cx, monoLabel } from "@/components/playbooks/article/figure";

// F5 (§05): one notice's seven steps through the harness, in three lanes: what the model
// reads, drafts and proposes; what code computes, compares and routes; what a person signs,
// books and pays. A dashed box is a model proposal; "—" is an empty lane. A grid from a 540px
// main column (hovering a step tints its row), one card per step below it. Counts are one
// fictional day.

type Cell = null | { t: string; sub?: string; dash?: boolean };

const LANES = [
  { name: "Model", sub: "reads, drafts, proposes" },
  { name: "Code", sub: "computes, compares, routes" },
  { name: "Person", sub: "signs, books, pays" },
];

const STEPS: Array<[string, Cell, Cell, Cell]> = [
  ["Intake", { t: "Classify notice type" }, { t: "Route by type; hash, sender, time" }, null],
  ["Read", { t: "Extract fields with page spans", sub: "typed record" }, { t: "Schema, range and span checks" }, { t: "Reviews failed checks" }],
  ["Match", { t: "Propose facility if no ID", dash: true }, { t: "Match on IDs, dates, amounts" }, { t: "Confirms proposed matches" }],
  ["Recompute", null, { t: "Accrual, day count, floor, lookback, PIK split" }, null],
  ["Class", { t: "Draft explanation from calc trace" }, { t: "Break class by rule; ageing; facility flag" }, { t: "Analyst accepts or edits" }],
  ["Investigate", { t: "Read-only loop proposes a cause", sub: "tools: read" }, { t: "Step and token caps; log every call" }, { t: "Lead: accept agent figure or query" }],
  ["Book", null, { t: "Write run record" }, { t: "Analyst books; treasury releases cash" }],
];

/** A lane's text on the cards: the proposal and its sub-note run together. */
const cardText = (c: Cell) => (c ? c.t + (c.sub ? " · " + c.sub : "") + (c.dash ? " (proposal)" : "") : "—");

const GRID = "grid grid-cols-[92px_repeat(3,minmax(0,1fr))] gap-x-2.5";
const stepLabel = "font-mono text-[10.5px] tracking-[0.06em] uppercase";

const IO = [
  {
    label: "In (untrusted until checked)",
    items: [
      "Agent notices: email, fax image, portal extract, agent data feed",
      "Loan system export: contracts, accruals, positions traded and settled",
      "Bank statements: BAI2 / BTRS, ISO 20022",
      "Credit agreements and amendments, conventions versioned per facility",
    ],
  },
  {
    label: "Out",
    items: [
      "Daily match file and break report",
      "Queries to the agent, drafted for the lead to send",
      "Month-end tie-out to fund administrator and GL",
      "Run record per notice, kept for audit",
    ],
  },
];

export function ModelCodePerson() {
  const [hot, setHot] = useState(-1);
  return (
    <Figure
      image={tileImages["client-reporting-flow"]}
      veil={0.66}
      metaRight={false}
      captionGap={6}
      className="mt-8"
      label="How it is built · model / code / person"
      meta="loan_ops_ledger · one notice, seven steps"
      evidence={
        <>
          23 Jun 2026 · received 42 → parsed 42 → matched 39 · <span className="text-bad">break 3</span> → explained 3 → booked 1 ·
          query to agent 1 · awaiting cash 1 → run records 42
        </>
      }
      moment="The model never decides what is booked or paid; it proposes, and code and people check."
      caption="Loan Ops Ledger's harness: seven steps, three lanes, one read-only investigation loop. Counts are one fictional day."
    >
      <Sheet pad="px-4 py-3.5">
        {/* from a 540px column: the grid */}
        <div role="table" className="hidden @min-[539.5px]:block">
          <div role="row" className={cx(GRID, "items-end border-b border-ink pb-[9px]")}>
            <span role="cell" />
            {LANES.map((l) => (
              <span key={l.name} role="columnheader">
                <span className="block text-[13.5px] font-medium">{l.name}</span>
                <span className="mt-px block text-[11px] text-sec">{l.sub}</span>
              </span>
            ))}
          </div>
          {STEPS.map(([name, ...cells], i) => (
            <div
              key={name}
              role="row"
              onMouseEnter={() => setHot(i)}
              onMouseLeave={() => setHot(-1)}
              className={cx(
                GRID,
                "items-stretch border-b border-rule-2 py-[7px] transition-[background] duration-[160ms] ease-[ease]",
                hot === i ? "bg-[#F1EEE8]" : "bg-transparent",
              )}
            >
              <span role="rowheader" className={cx(stepLabel, "self-center", hot === i ? "text-ink" : "text-sec")}>
                {i + 1} {name}
              </span>
              {cells.map((c, j) => (
                <div key={LANES[j].name} role="cell" className="flex min-w-0">
                  {c ? (
                    <div
                      className={cx(
                        "box-border flex-auto rounded-[8px] border border-ink bg-white px-2.5 py-[7px] text-[12px] leading-[1.4]",
                        c.dash && "border-dashed",
                      )}
                    >
                      {c.t}
                      {c.dash ? <span className="sr-only"> (proposal)</span> : null}
                      {c.sub ? <div className="mt-[3px] font-mono text-[10.5px] text-sec">{c.sub}</div> : null}
                    </div>
                  ) : (
                    <span className="self-center px-2.5 text-[12px] text-faint">—</span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* below it: one card per step */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,220px),1fr))] gap-2.5 @min-[539.5px]:hidden">
          {STEPS.map(([name, ...cells], i) => (
            <div key={name} className="rounded-[10px] border border-rule-2 bg-white p-3.5">
              <div className={cx(stepLabel, "text-sec")}>
                {i + 1} {name}
              </div>
              <div className="mt-2.5 grid gap-2">
                {cells.map((c, j) => (
                  <div key={LANES[j].name}>
                    <div className="text-[11px] text-mut">{LANES[j].name}</div>
                    <div className={cx("mt-px text-[12.5px] leading-[1.45]", c ? "text-ink" : "text-faint")}>{cardText(c)}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2.5">
          {IO.map((box) => (
            <div key={box.label} className="box-border min-w-0 flex-[1_1_240px] rounded-[10px] border border-rule-2 bg-[#F8F7F4] px-4 py-3.5">
              <div className={cx(monoLabel, "text-sec")}>{box.label}</div>
              <ul className="mt-2 mb-0 grid list-disc gap-1 pl-[15px] text-[12.5px] leading-[1.5] text-ink-2">
                {box.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-3 mb-0 text-[12.5px] leading-[1.6] text-sec">
          Model tools: <span className="font-mono text-[11.5px] text-ink">read · propose</span>. Execute tier (
          <span className="font-mono text-[11.5px] text-ink">post booking · release cash · change settlement instructions</span>) is not
          exposed to the model.
        </p>
      </Sheet>
    </Figure>
  );
}
