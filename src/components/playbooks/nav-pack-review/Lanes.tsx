import type { ReactNode } from "react";
import { tileImages } from "@/components/playbooks/media";
import { Dot, Figure, Sheet, SheetTitle, cx, monoLabel } from "@/components/playbooks/article/figure";

// F5 (§05, after the harness anatomy): the seven steps in three lanes, the typed record the
// model hands to code, and the release gate's scorecard on the golden set. A dashed box is the
// model, a filled one code, an ink-ruled white one a person; "—" is an empty lane. From a 600px
// main column the lanes and the scorecard are grids; below it they stack, each lane labelled.
// The scorecard is fictional, not measured performance.

type Lane = "model" | "code" | "person";

/** A step's three lanes; null is "—". `gate`: the release hold, ruled in ink. */
type Step = { name: string; model: ReactNode; code: ReactNode; person: ReactNode; gate?: boolean };

const LANES: Array<{ key: Lane; name: string; sub: string }> = [
  { key: "model", name: "Model", sub: "reads, proposes, drafts" },
  { key: "code", name: "Code", sub: "computes, compares, decides pass or fail" },
  { key: "person", name: "Person", sub: "signs" },
];

const STEPS: Step[] = [
  { name: "1 Ingest", model: "Locate sections; extract tables from PDF packs", code: "Hash and version the file; cross-foot every table", person: null },
  {
    name: "2 Map lines",
    model: "Propose mapping for new labels, with confidence",
    code: "Apply confirmed maps; reject any unmapped numeric line",
    person: "Fund controller confirms each new mapping once",
  },
  { name: "3 Tie out", model: null, code: "TB → SAL → NAV; investors sum to fund; opening = prior close", person: null },
  {
    name: "4 Recalculate",
    model: "Read LPA fee terms into a term sheet",
    code: "Management fee, offsets, accruals, FX re-translation",
    person: "Fund controller approves the term sheet",
  },
  {
    name: "5 Test prices",
    model: null,
    code: "Bands per asset class; stale and single-source flags",
    person: "Valuation committee decides Level 3 overrides",
  },
  {
    name: "6 Explain",
    model: "Draft the cause, citing evidence lines; class the break",
    code: "Variance decomposition; cited figures must match",
    person: "Fund controller accepts or rejects each cause",
  },
  {
    name: "7 Release",
    model: null,
    code: "Hold release while any break is open outside tolerance",
    person: (
      <>
        <strong className="font-semibold">CFO signs</strong> the NAV
      </>
    ),
    gate: true,
  },
];

/** Result right-aligned in the grid, left when stacked. `hi`: the primary safety metric. */
const SCORES: Array<{ metric: string; result: string; gate: string; pass?: boolean; note: string; hi?: boolean }> = [
  {
    metric: "Tie-out completeness (numeric lines accounted for)",
    result: "4,212 / 4,212",
    gate: "100% required",
    pass: true,
    note: "Every line tied, within tolerance, or a logged break",
  },
  {
    metric: "Line extraction, exact match",
    result: "4,197 / 4,212 · 99.6%",
    gate: "misses routed 15 / 15",
    pass: true,
    note: "Each miss failed a cross-foot and went to review",
  },
  { metric: "New-mapping proposals accepted by controller", result: "142 / 150 · 94.7%", gate: "reported", note: "8 corrected once, then fixed in the map" },
  { metric: "Seeded errors detected", result: "42 / 42", gate: "all required", pass: true, note: "Modelled on documented failure types" },
  {
    metric: "False clears (primary safety metric)",
    result: "0 of 42",
    gate: "zero required",
    pass: true,
    note: "A break cleared that a reviewer reopens",
    hi: true,
  },
  { metric: "Explanation faithfulness (reviewer-graded)", result: "39 / 42 · 92.9%", gate: "reported", note: "3 rejected; controller wrote the cause" },
];

const LANE_COLS = "grid-cols-[minmax(0,1fr)] @min-[599.5px]:grid-cols-[minmax(0,0.62fr)_repeat(3,minmax(0,1fr))]";
const SCORE_COLS =
  "grid-cols-[minmax(0,1fr)] gap-x-3 @min-[599.5px]:grid-cols-[minmax(0,1.45fr)_minmax(0,0.95fr)_minmax(0,0.85fr)_minmax(0,1.25fr)]";

const BOX: Record<Lane, string> = {
  model: "border-dashed border-[#C9C5BC] bg-[#F6F5F2]",
  code: "border-rule bg-wash",
  person: "border-ink bg-white",
};

/** One lane of one step: its box, or "—"; stacked, with the lane's name on top. */
function Cell({ lane, name, gate, children }: { lane: Lane; name: string; gate?: boolean; children: ReactNode }) {
  const empty = children === null;
  return (
    <div
      role="cell"
      className={cx(
        "px-2.5 py-[7px] text-[12px] leading-[1.45]",
        empty ? "text-faint" : cx("box-border rounded-[9px] border text-ink", gate ? "border-ink bg-wash" : BOX[lane]),
      )}
    >
      {/* on the code lane's wash, the muted grey one step darker (globals.css, --mut-ink-2) */}
      <span
        className={cx(
          "mb-[3px] block text-[10.5px] font-medium @min-[599.5px]:hidden",
          lane === "code" && !empty ? "text-mut-ink-2" : "text-mut",
        )}
      >
        {name}
      </span>
      {empty ? "—" : children}
    </div>
  );
}

export function Lanes() {
  return (
    <Figure
      image={tileImages["mandate-guardrails"]}
      veil={0.66}
      metaRight={false}
      className="mt-8"
      label="How it is built · NAV Pack Review"
      meta="workflow · no agent in the release path"
      moment="The model reads and drafts. Code ties out and holds release. A named person confirms, accepts and signs."
      caption="Seven steps, three lanes. Pass or fail is always code; every signature is a person. Scorecard figures are fictional, not measured performance."
    >
      <Sheet>
        <SheetTitle>Deterministic tie-out, model at the edges, a person at every signature</SheetTitle>

        <div role="table" aria-label="Seven steps in three lanes" className="mt-3.5">
          <div role="row" className={cx(LANE_COLS, "hidden gap-x-2 border-b border-ink pb-2 @min-[599.5px]:grid")}>
            <span role="cell" />
            {LANES.map((l) => (
              <span key={l.key} role="columnheader" className="min-w-0">
                <span className="block text-[12.5px] font-medium">{l.name}</span>
                <span className="block text-[11px] leading-[1.35] text-mut">{l.sub}</span>
              </span>
            ))}
          </div>
          {STEPS.map((s, i) => (
            <div
              key={s.name}
              role="row"
              className={cx(
                LANE_COLS,
                "grid items-stretch gap-x-2 gap-y-1.5 py-1.5",
                i < STEPS.length - 1 && "border-b border-rule-2",
              )}
            >
              <div role="rowheader" className="py-[7px] font-mono text-[10.5px] tracking-[0.06em] text-ink uppercase">
                {s.name}
              </div>
              <Cell lane="model" name="Model">
                {s.model}
              </Cell>
              <Cell lane="code" name="Code" gate={s.gate}>
                {s.code}
              </Cell>
              <Cell lane="person" name="Person">
                {s.person}
              </Cell>
            </div>
          ))}
        </div>

        <div className="mt-3.5 rounded-[9px] border border-rule-2 bg-[#F6F5F2] px-3 py-2.5 font-mono text-[10.5px] leading-[1.65] text-ink-2 [overflow-wrap:anywhere]">
          <span className="font-medium text-ink">Model → code hand-off (typed record)</span>
          {
            ' {line: "Mgmt fee accrual", value: -1262500.00, page: 4, cell: "SAL!F14", map: "2105 Management fee payable", confidence: 0.97, extractor: "pack_extract@v9"}'
          }
        </div>

        <div className="mt-[22px] border-t border-rule-2 pt-4">
          <span className={cx(monoLabel, "text-sec")}>Release gate · golden set v2</span>
        </div>
        <div className="mt-1 mb-3 font-mono text-[10.5px] leading-[1.6] text-mut">
          24 packs · 8 quarters × 3 administrator layouts · incl. a restated period and a multi-class FX case · fictional, not
          measured performance
        </div>
        <div role="table" aria-label="Release gate">
          <div
            role="row"
            className={cx(SCORE_COLS, "hidden border-b border-ink px-2 pb-[7px] text-[10.5px] text-sec @min-[599.5px]:grid")}
          >
            <span role="columnheader">Metric</span>
            <span role="columnheader" className="text-right">
              Result
            </span>
            <span role="columnheader">Gate</span>
            <span role="columnheader">Note</span>
          </div>
          {SCORES.map((r, i) => (
            <div
              key={r.metric}
              role="row"
              className={cx(
                SCORE_COLS,
                "grid items-baseline gap-y-[3px] px-2 py-[9px]",
                i < SCORES.length - 1 && "border-b border-rule-2",
                r.hi && "bg-[#F1EEE8]",
              )}
            >
              <span role="rowheader" className={cx("min-w-0 text-[12.5px] leading-[1.4]", r.hi && "font-medium")}>
                {r.metric}
              </span>
              <span
                role="cell"
                className={cx("min-w-0 text-left font-mono text-[11.5px] @min-[599.5px]:text-right", r.hi && "font-medium")}
              >
                {r.result}
              </span>
              <span role="cell" className="flex min-w-0 items-baseline gap-1.5 text-[12px] text-ink">
                {r.pass ? <Dot tone="ok" level /> : null}
                <span>{r.gate}</span>
              </span>
              <span role="cell" className="min-w-0 text-[12px] leading-[1.45] text-sec">
                {r.note}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3 font-mono text-[10.5px] leading-[1.6] text-sec">
          Seeded: fee basis 8 · fee offset 8 · wrong currency 6 · stale price 8 · missing accrual 6 · restated opening 6 = 42
        </div>
      </Sheet>
    </Figure>
  );
}
