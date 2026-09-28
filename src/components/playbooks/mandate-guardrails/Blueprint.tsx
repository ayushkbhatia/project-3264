import { Fragment } from "react";
import { tileImages } from "@/components/playbooks/media";
import { Figure, Sheet, cx, monoLabel } from "@/components/playbooks/article/figure";
import { PartLabel, SheetHead, SheetMoment, Status } from "./parts";

// F4, opening §05: how a clause becomes a rule and how the rule is proved. Two lanes: encoding
// time (the model drafts a rule spec, code checks it, compliance approves it into the rule
// library) and run time (only the rule engine tests orders; people decide; the model drafts the
// narrative afterwards). Then the approved spec for MG-0412 v3 and the synthetic boundary tests
// it had to pass. All data fictional.
//
// Layout by main-column width: the lanes side by side from 600px, stacked below; the tests'
// Expected column from 540px. The spec keeps its column alignment and scrolls sideways inside
// its own box where the column is too narrow for it, the page's only horizontal scroll.

type Kind = "data" | "model" | "code" | "person";

type Step = { name: string; tag?: string; text: string; kind: Kind; extra?: "library" | "engine" };

const BOX: Record<Kind, string> = {
  data: "border border-rule-2 bg-white",
  model: "border border-dashed border-ink bg-tile",
  code: "border border-ink bg-page",
  person: "border-2 border-ink bg-white",
};

const LANES: Array<{ label: string; steps: Step[] }> = [
  {
    label: "Encoding time · each new IMA, amendment or interpretation",
    steps: [
      { name: "IMA clause", text: "§4.2(c) p.14, with amendments and notes", kind: "data" },
      {
        name: "Model drafts",
        tag: "MODEL",
        text: "rule spec in the schema; lists interpretation choices (rating, denominator, timing)",
        kind: "model",
      },
      {
        name: "Code checks",
        tag: "CODE",
        text: "schema validation, compile, boundary tests on synthetic portfolios (below)",
        kind: "code",
      },
      { name: "Compliance approves", tag: "PERSON", text: "four-eyes; version, approver and timestamp recorded", kind: "person" },
      { name: "Rule library", text: "MG-0412 v3, read-only once approved; v1, v2 kept", kind: "data", extra: "library" },
    ],
  },
  {
    label: "Run time · every order, every execution, every night",
    steps: [
      { name: "Orders, positions", text: "FIX 35=D / 35=J; IBOR pre-trade, ABOR in the batch", kind: "data" },
      {
        name: "Rule engine",
        tag: "CODE ONLY",
        text: "every applicable rule, per account after allocation: pre-trade, in-trade, post-execution, daily batch. pass · warn · block; breaches classed active or passive",
        kind: "code",
        extra: "engine",
      },
      {
        name: "People decide",
        tag: "PERSON",
        text: "override a warning (reason); breach disposition; client and board notices",
        kind: "person",
      },
      {
        name: "Model drafts",
        tag: "MODEL",
        text: "breach narrative and review pack, from the record, after the decision",
        kind: "model",
      },
    ],
  },
];

/** The legend's swatches: content-box 16×10 plus a 1px border, as in the reference; the person
    swatch is border-box with its 2px border. */
const LEGEND: Array<{ label: string; swatch: string }> = [
  { label: "model", swatch: "box-content border border-dashed border-ink" },
  { label: "code", swatch: "box-content border border-ink" },
  { label: "person", swatch: "border-2 border-ink" },
  { label: "data or store", swatch: "box-content border border-rule" },
];

/** The approved spec, one line per row, spaced to its columns; `#` comments set grey. */
const SPEC: Array<[string, string?]> = [
  ["rule:        MG-0412"],
  ["version:     3            ", "# v1 2025-11-03 · v2 2026-03-02"],
  ["scope:       ACCT-ASHBY-01"],
  ["source:      IMA-QGCM-2025 amdt 1 · Sch.2 §4.2(c) p.14"],
  ["note:        IN-4.2(c)-02"],
  ["part_1:      ", "# issuer group concentration"],
  ["  numerator:   mv where issuer_group = $g"],
  ["  aggregation: parent_group"],
  ["  denominator: total_mv_incl_cash"],
  ['  operator:    "<="'],
  ["  limit:       0.0500"],
  ["  warn:        0.0450  stages: [pre_trade, in_trade]"],
  ["  stages:      [pre_trade, in_trade, post_exec, batch]"],
  ["part_2:      ", "# credit quality"],
  ["  test:        rating >= BBB-"],
  ["  rating_rule: middle_of_3_else_lower_of_2"],
  ["  timing:      at_purchase"],
  ["  unrated:     route_to_compliance"],
  ["effective:   2026-09-15"],
  ["drafted_by:  rule_draft@v5 · model snapshot pinned"],
  ["approved_by: head_of_investment_compliance"],
  ["approved_at: 2026-09-14T10:22"],
];

/** SYN-0412-01 … 07: the expected result is written before the engine runs. */
const TESTS: Array<[string, string, string]> = [
  ["SYN-0412-01", "Group at 4.99%", "pass"],
  ["SYN-0412-02", "Group at 5.00% (“no more than”)", "pass"],
  ["SYN-0412-03", "Group at 5.01%", "breach"],
  ["SYN-0412-04", "3 group issuers at 1.80% each = 5.40%", "breach"],
  ["SYN-0412-05", "Buy rated Baa3 · BB+ · BBB− (middle BBB−)", "pass"],
  ["SYN-0412-06", "Buy rated Baa3 · BB+ only (lower BB+)", "breach"],
  ["SYN-0412-07", "Held bond downgraded to BB+ after purchase", "no breach"],
];

/** Three tracks under a 540px column (no Expected), four from there. */
const TEST_TRACKS =
  "grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)_minmax(0,0.8fr)] @min-[539.5px]:grid-cols-[minmax(0,0.85fr)_minmax(0,1.9fr)_minmax(0,0.7fr)_minmax(0,0.8fr)]";
const EXPECTED = "hidden @min-[539.5px]:block";

function Box({ step }: { step: Step }) {
  return (
    <div className={cx("box-border rounded-[10px] px-3 py-[9px]", BOX[step.kind])}>
      <div className="flex items-baseline justify-between gap-2.5">
        <span className="text-[13px] font-medium">{step.name}</span>
        {step.tag ? <span className="flex-none font-mono text-[9.5px] tracking-[0.06em] text-sec">{step.tag}</span> : null}
      </div>
      <div className="mt-[3px] text-[12px] leading-[1.45] text-ink-2">{step.text}</div>
      {step.extra === "library" ? (
        <div className="mt-2 rounded-[6px] border border-dashed border-faint px-2 py-1.5 font-mono text-[10px] text-sec">
          approved versions → loaded into the rule engine
        </div>
      ) : step.extra === "engine" ? (
        <div className="mt-2 font-mono text-[10.5px] text-ink">no model between the order and pass / warn / block</div>
      ) : null}
    </div>
  );
}

export function Blueprint() {
  return (
    <Figure
      image={tileImages["mandate-guardrails"]}
      veil={0.66}
      className="mt-8"
      label="How it is built · clause → rule → test"
      evidence={
        <>
          MG-0412 v3 · spec sha256 3be1…9a70 → 7 boundary tests → 7/7 as expected → <span className="font-medium text-ok">approved</span> →
          head of investment compliance · 2026-09-14 10:22
        </>
      }
      moment="Expected outcomes are written before the engine runs. A version is approved only when every synthetic case matches."
      caption="The model drafts rule specs at encoding time. Approved rules run as deterministic code. People approve rules, overrides and notices."
    >
      <Sheet>
        <SheetHead
          title="The model drafts rules. It never tests an order."
          sub="Mandate Guardrails harness · rule MG-0412 v3 · Quillmere Global Credit Mandate (fictional)"
        />

        <div className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-x-[22px] gap-y-5 @min-[599.5px]:grid-cols-[repeat(2,minmax(0,1fr))]">
          {LANES.map((lane) => (
            <div key={lane.label} className="min-w-0">
              <span className={cx(monoLabel, "text-sec")}>{lane.label}</span>
              <ol className="mt-2 mb-0 list-none p-0">
                {lane.steps.map((step, i) => (
                  <li key={step.name + i}>
                    {i > 0 ? (
                      <div aria-hidden="true" className="py-0.5 pl-4 font-mono text-[11px] text-sec">
                        ↓
                      </div>
                    ) : null}
                    <Box step={step} />
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>

        <div className="mt-3.5 flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-sec">
          {LEGEND.map((l) => (
            <span key={l.label} className="inline-flex items-center gap-1.5">
              <span aria-hidden="true" className={cx("h-2.5 w-4 rounded-[3px]", l.swatch)} />
              {l.label}
            </span>
          ))}
        </div>

        <PartLabel className="mt-5 mb-2">Rule spec · approved · MG-0412 v3</PartLabel>
        {/* focusable, so the keyboard can scroll it where it overflows */}
        <pre
          tabIndex={0}
          role="region"
          aria-label="Rule spec MG-0412 version 3, approved"
          className="m-0 overflow-x-auto rounded-[10px] bg-wash px-3.5 py-3 font-mono text-[11px] leading-[1.7] text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-a"
        >
          {SPEC.map(([code, comment], i) => (
            <Fragment key={i}>
              {i > 0 ? "\n" : null}
              {code}
              {/* the design's #8A887F reads 3.0:1 on the wash: --mut-ink-2, the nearest step that passes AA */}
              {comment ? <span className="text-mut-ink-2">{comment}</span> : null}
            </Fragment>
          ))}
        </pre>

        <PartLabel className="mt-5 mb-2">Boundary tests · synthetic portfolios · run before approval</PartLabel>
        <div role="table" aria-label="Boundary tests for rule MG-0412 version 3">
          <div role="row" className={cx("grid", TEST_TRACKS, "gap-x-3 border-b border-ink px-2 pb-[7px] text-[10.5px] text-sec")}>
            <span role="columnheader">Test</span>
            <span role="columnheader">Setup</span>
            <span role="columnheader" className={EXPECTED}>
              Expected
            </span>
            <span role="columnheader">Engine</span>
          </div>
          {TESTS.map(([id, setup, expected], i) => (
            <div
              key={id}
              role="row"
              className={cx("grid", TEST_TRACKS, "items-baseline gap-x-2.5 gap-y-[3px] p-2", i < TESTS.length - 1 && "border-b border-rule-2")}
            >
              <span role="rowheader" className="min-w-0 font-mono text-[10.5px]">
                {id}
              </span>
              <span role="cell" className="min-w-0 text-[12px] leading-[1.4]">
                {setup}
              </span>
              <span role="cell" className={cx(EXPECTED, "font-mono text-[11px]")}>
                {expected}
              </span>
              {/* the engine's result, green where it matches the expected one (all seven) */}
              <Status role="cell" tone="ok">
                {expected}
              </Status>
            </div>
          ))}
        </div>
        <div className="mt-2.5 flex flex-wrap items-baseline gap-x-2.5 gap-y-1.5 px-2 font-mono text-[11px]">
          <span aria-hidden="true" className="size-[7px] flex-none rounded-full bg-ok" />
          <span className="font-medium text-ok">7 / 7 as expected</span>
          <span className="text-sec">· suite must pass 100% before approval</span>
        </div>

        <SheetMoment>Rules change by version, each tested and approved. At run time, only code decides.</SheetMoment>
      </Sheet>
    </Figure>
  );
}
