import type { ReactNode } from "react";
import { Figure, Sheet, SheetTitle, cx } from "@/components/playbooks/article/figure";
import { tileImages } from "@/components/playbooks/media";

// F6 (opens §05): the harness blueprint. Seven steps in three lanes: what the model reads,
// matches and drafts; what code computes, binds and decides; who signs. Each lane has its own
// cell (the model's on paper, code's outlined in ink, a person's on the wash), and a dashed
// cell marks where the model is deliberately absent. Step 04 carries the one loop: a draft
// with an unbound number goes back, and code's gate lets through only a fully bound one. A
// grid from a 600px main column, the steps stacked (lane named in each cell) below it. The
// lane names and the "no model" words use the AA shades --mut-ink-2 and --faint-ink.

type Lane = "model" | "code" | "person";
/** A lane's cell; `none` for a step where the model deliberately has no part. */
type Cell = { t: string; extra?: ReactNode } | { none: string };

const LANES: Array<{ key: Lane; name: string; sub: string }> = [
  { key: "model", name: "Model", sub: "reads, matches, drafts" },
  { key: "code", name: "Code", sub: "computes, binds, decides" },
  { key: "person", name: "Person", sub: "signs" },
];

/** A mono line under a code cell's text. */
function Mono({ children }: { children: ReactNode }) {
  return <span className="mt-[5px] block font-mono text-[10.5px] text-ink">{children}</span>;
}

const STEPS: Array<{ n: string; name: string; cells: [Cell, Cell, Cell] }> = [
  {
    n: "01",
    name: "Snapshot",
    cells: [
      { t: "Reads administrator PCAP and NAV pack layouts into typed records" },
      { t: "Freezes the as-of snapshot; hashes every input", extra: <Mono>snap_2026Q2_07</Mono> },
      { t: "Fund controller confirms the snapshot" },
    ],
  },
  {
    n: "02",
    name: "Performance",
    cells: [
      { none: "No model step" },
      { t: "IRR, TVPI, DPI, RVPI · gross and net · with and without facility, one basis" },
      { t: "CFO approves the figures" },
    ],
  },
  {
    n: "03",
    name: "Capital accounts",
    cells: [
      { t: "Suggests an ILPA row mapping for a new GL account" },
      { t: "Rolls each LP from beginning to ending NAV; section sign rules; Σ LPs = fund" },
      { t: "Fund controller confirms new mappings" },
    ],
  },
  {
    n: "04",
    name: "Letter draft",
    cells: [
      {
        t: "Drafts commentary from approved facts and prior letters",
        extra: (
          <span className="mt-1.5 block">
            <span className="inline-block rounded-[4px] bg-wash px-1.5 py-px font-mono text-[10px]">↻ unbound → redraft</span>
          </span>
        ),
      },
      { t: "Number-in-text verifier binds each numeral to a calculation ID", extra: <Mono>gate: 100% bound</Mono> },
      { t: "IR lead edits the draft" },
    ],
  },
  {
    n: "05",
    name: "DDQ answers",
    cells: [
      { t: "Matches a re-worded LP question to approved library items" },
      { t: "Approved, in-date items only; none found → abstain and route" },
      { t: "CCO approves any new or changed answer" },
    ],
  },
  {
    n: "06",
    name: "Consistency",
    cells: [
      { none: "No model step" },
      { t: "Same figure across letter, PCAP, ILPA template and DDQ" },
      { t: "CCO reviews content used in advertisements" },
    ],
  },
  {
    n: "07",
    name: "Release",
    cells: [
      { none: "Send tool not exposed to the model" },
      { t: "Version lock; distribution log; run record kept" },
      { t: "GP leadership or CFO releases through the LP portal" },
    ],
  },
];

/** Each lane's cell, and its swatch in the legend. */
const CELL: Record<Lane | "none", string> = {
  model: "border border-rule bg-page",
  code: "border border-ink bg-white",
  person: "bg-wash",
  none: "border border-dashed border-[#C9C5BC]",
};

const LEGEND: Array<[keyof typeof CELL, string]> = [
  ["model", "Model task (inferential)"],
  ["code", "Deterministic code, unit-tested"],
  ["person", "Named approver"],
  ["none", "Deliberately no model"],
];

const COLS = "grid-cols-[minmax(0,1fr)] @min-[599.5px]:grid-cols-[minmax(0,0.62fr)_repeat(3,minmax(0,1fr))]";

export function HarnessBlueprint() {
  return (
    <Figure
      image={tileImages["mandate-guardrails"]}
      veil={0.66}
      className="mt-8"
      label="Investor Reporting · harness blueprint"
      moment="The model drafts; code binds every number; people sign. The send tool is never given to the model."
      caption="Investor Reporting harness: what the model reads and drafts, what code computes and decides, and who signs at each step."
    >
      <Sheet>
        <SheetTitle>
          Evaluator–optimizer drafting over a frozen snapshot and an approved library. The model drafts; code binds every number;
          people sign.
        </SheetTitle>

        <div role="table" aria-label="Harness blueprint" className="mt-3.5">
          <div role="row" className={cx("hidden gap-x-2 border-b border-ink pb-2 @min-[599.5px]:grid", COLS)}>
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
              key={s.n}
              role="row"
              className={cx("grid items-stretch gap-x-2 gap-y-1.5 py-1.5", COLS, i < STEPS.length - 1 && "border-b border-rule-2")}
            >
              <div role="rowheader" className="py-[7px] font-mono text-[10.5px] tracking-[0.06em] text-ink uppercase">
                <span className="text-mut">{s.n}</span> {s.name}
              </div>
              {s.cells.map((c, j) => (
                <div
                  key={LANES[j].key}
                  role="cell"
                  className={cx(
                    "box-border rounded-[9px] px-2.5 py-[7px] text-[12px] leading-[1.45]",
                    "none" in c ? cx(CELL.none, "text-faint-ink") : CELL[LANES[j].key],
                  )}
                >
                  <span className="mb-[3px] block text-[10.5px] font-medium text-mut-ink-2 @min-[599.5px]:hidden">{LANES[j].name}</span>
                  {"none" in c ? (
                    c.none
                  ) : (
                    <>
                      {c.t}
                      {c.extra}
                    </>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-3.5 flex flex-wrap gap-x-[18px] gap-y-2">
          {LEGEND.map(([key, text]) => (
            <span key={key} className="inline-flex items-center gap-[7px] text-[11.5px] text-ink-2">
              <span aria-hidden="true" className={cx("box-border h-[11px] w-[18px] flex-none rounded-[4px]", CELL[key])} />
              {text}
            </span>
          ))}
        </div>
        <p className="mt-3 mb-0 text-[12.5px] leading-[1.55] text-sec">
          Untrusted inputs (LP emails, administrator packs, bespoke DDQ spreadsheets) are read by a reader with no write tools and no
          egress. Its only output is a typed record.
        </p>
      </Sheet>
    </Figure>
  );
}
