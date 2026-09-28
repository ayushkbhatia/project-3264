import { Fragment } from "react";
import { tileImages } from "@/components/playbooks/media";
import { Figure, Sheet, SheetTitle, cx, monoLabel } from "@/components/playbooks/article/figure";

// F4 (opens §05): one fund's documents on their way to register rows, six stages in three lanes:
// what the model reads and proposes (it has no write tools), what code computes and decides,
// what a person signs and owns. A dashed "none" marks a lane left empty on purpose. The counts
// are fictional and tie: 7 documents → 118 provisions (77 operative, 41 interpretive) → 64
// obligations (77 − 13 duplicates) → 105 register rows (64 obligations + 41 no-action) → 64
// scheduled → 1 overdue on 2026-11-17, the hero's SL-TMI-5.1, whose typed record and lineage
// close the figure.
//
// Layout by main-column width: the stage grid under its lane headers from 600px (the reference's
// Math.round(width) >= 600, so the query sits half a pixel below); below that each stage stacks
// its lanes, each lane named inside its cell.

type Lane = "model" | "code" | "person";

type Stage = {
  n: string;
  name: string;
  count: string;
  unit: string;
  sub: string;
  /** Model, code, person; `null`: the lane is deliberately empty. */
  cells: [string | null, string | null, string | null];
};

const LANES: Array<{ key: Lane; name: string; sub: string }> = [
  { key: "model", name: "Model", sub: "reads, proposes; no write tools" },
  { key: "code", name: "Code", sub: "computes, decides pass/fail" },
  { key: "person", name: "Person", sub: "signs, owns" },
];

const STAGES: Stage[] = [
  {
    n: "01",
    name: "Read documents",
    count: "7",
    unit: "documents",
    sub: "LPA + 6 side letters",
    cells: [
      "Segments LPA, side letters and amendments into provisions, keeping each exact span",
      "Hashes each document version; checks every span matches the source character for character",
      null,
    ],
  },
  {
    n: "02",
    name: "Classify and extract",
    count: "118",
    unit: "provisions",
    sub: "77 operative · 41 interpretive",
    cells: [
      "Classifies type; extracts trigger, deadline, recipient, format with the source span",
      "Validates fields: schema, investor register, Business Day calendar",
      null,
    ],
  },
  {
    n: "03",
    name: "Merge duplicates",
    count: "64",
    unit: "obligations",
    sub: "77 − 13 duplicates merged",
    cells: [
      "Flags near-duplicates and one-word differences (“shall” vs “reasonable efforts”)",
      "Groups same duty to the same investor; keeps every source span",
      "Reviewer accepts or rejects each proposed merge",
    ],
  },
  {
    n: "04",
    name: "Confirm",
    count: "105",
    unit: "register rows",
    sub: "64 obligations (57 as proposed, 7 edited) + 41 no-action",
    cells: [
      "Drafts the plain-English summary shown to the reviewer",
      "Writes a register change only after sign-off; logs who and when",
      "Counsel or compliance confirms each new or changed obligation",
    ],
  },
  {
    n: "05",
    name: "Resolve and schedule",
    count: "64",
    unit: "scheduled",
    sub: "each with owner and next due date",
    cells: [
      null,
      "Effective terms: LPA → side letter → MFN election → amendment, by date. Due dates and event triggers",
      "Counsel decides MFN eligibility and carve-outs; CCO confirms completeness",
    ],
  },
  {
    n: "06",
    name: "Prove delivery",
    count: "1",
    unit: "overdue on 2026-11-17",
    sub: "SL-TMI-5.1",
    cells: [
      "Drafts the reminder or escalation note",
      "Matches delivery logs to an approved contact before the deadline; marks delivered or overdue",
      "Owner certifies each completion; changes to approved contacts need a named approver",
    ],
  },
];

/** Each lane's box: the model on the paper tone, code on the tile with a rule, a person in white
    under a dark border; an empty lane dashed. */
const LANE_BOX: Record<Lane, string> = {
  model: "border-rule-2 bg-page leading-[1.45] text-ink",
  code: "border-rule bg-tile leading-[1.45] text-ink",
  person: "border-sec bg-white leading-[1.45] text-ink",
};

/** One column; four from a 600px main column. */
const COLS = "grid-cols-[minmax(0,1fr)] @min-[599.5px]:grid-cols-[minmax(0,0.85fr)_repeat(3,minmax(0,1fr))]";

/** The model's typed hand-off for the overdue obligation (two no-break spaces indent the rest). */
const RECORD = [
  '{ obligation_id: "SL-TMI-5.1", investor: "LP-04",',
  '\u00a0\u00a0type: "recurring", trigger: "quarter_end",',
  '\u00a0\u00a0deadline: "+30 Business Days", recipient: "approved_contact",',
  '\u00a0\u00a0format: "Solvency II look-through",',
  '\u00a0\u00a0source: "TMI side letter v1 §5.1 p.4 l.12–18",',
  '\u00a0\u00a0confidence: 0.93, extractor: "obl_extract@v9" }',
];

const panel = "box-border min-w-0 flex-[1_1_260px] rounded-[10px] border border-rule-2 bg-page px-3.5 py-3";
const code = "mt-2 font-mono text-[10.5px] leading-[1.75] text-ink-2 [overflow-wrap:anywhere]";

export function ClauseToRegister() {
  return (
    <Figure
      image={tileImages["mandate-guardrails"]}
      veil={0.66}
      className="mt-8"
      label="Side-letter register · harness blueprint · Aldercove Growth Fund III, L.P."
      caption="How one fund's documents become register rows. Counts are fictional and tie from 118 provisions to 64 obligations and 105 rows."
    >
      <Sheet>
        <SheetTitle id="slr-blueprint">From clause to register row: what the model, the code and a person each do</SheetTitle>
        <div role="table" aria-labelledby="slr-blueprint" className="mt-3.5">
          <div role="row" className={cx("hidden @min-[599.5px]:grid", COLS, "gap-x-2 border-b border-ink pb-2")}>
            <span role="columnheader" className="text-[11px] text-mut">
              Stage · count
            </span>
            {LANES.map((l) => (
              <span key={l.key} role="columnheader" className="min-w-0">
                <span className="block text-[12.5px] font-medium">{l.name}</span>
                <span className="block text-[11px] leading-[1.35] text-mut">{l.sub}</span>
              </span>
            ))}
          </div>

          {STAGES.map((s, i) => (
            <div
              key={s.n}
              role="row"
              className={cx("grid items-stretch gap-x-2 gap-y-1.5 py-1.5", COLS, i < STAGES.length - 1 && "border-b border-rule-2")}
            >
              <div role="rowheader" className="py-1.5">
                <div className="font-mono text-[10.5px] tracking-[0.06em] uppercase">
                  <span className="text-mut">{s.n}</span> {s.name}
                </div>
                <div className="mt-1.5 font-mono">
                  <span className="text-[15px] font-medium">{s.count}</span> <span className="text-[10.5px]">{s.unit}</span>
                </div>
                <div className="mt-0.5 font-mono text-[10px] leading-[1.5] text-mut">{s.sub}</div>
              </div>
              {s.cells.map((text, j) => {
                const lane = LANES[j];
                return (
                  <div
                    key={lane.key}
                    role="cell"
                    className={cx(
                      "box-border rounded-[9px] border px-2.5 py-[7px] text-[12px]",
                      // "none": the design's faint grey takes --faint-ink, the nearest shade that
                      // passes AA
                      text ? LANE_BOX[lane.key] : "border-dashed border-rule text-faint-ink",
                    )}
                  >
                    <span className="mb-[3px] block text-[10.5px] font-medium text-mut @min-[599.5px]:hidden">{lane.name}</span>
                    {text ?? "none"}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2.5">
          <div className={panel}>
            <span className={cx(monoLabel, "text-sec")}>Typed record, model → code</span>
            <div className={code}>
              {RECORD.map((line, i) => (
                <Fragment key={i}>
                  {i ? <br /> : null}
                  {line}
                </Fragment>
              ))}
            </div>
          </div>
          <div className={panel}>
            <span className={cx(monoLabel, "text-sec")}>Lineage of one obligation</span>
            <div className={code}>
              §5.1 span → confirmed by compliance 2026-03-06
              <br />→ scheduled: Q3 due 2026-11-13
              <br />→ delivery log: none to an approved contact
              <br />→ <span className="font-medium text-bad">overdue · 2 BD</span> → escalated to fund controller 2026-11-17
            </div>
          </div>
        </div>
        <p className="mt-3.5 mb-0 text-[14.5px] leading-[1.5] text-ink">
          Nothing enters the register until a person confirms it. The code, not the model, decides what is due and whether it was delivered.
        </p>
      </Sheet>
    </Figure>
  );
}
