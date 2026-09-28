import { Fragment, type ReactNode } from "react";
import { tileImages } from "@/components/playbooks/media";
import { Figure, Sheet, SheetTitle, cx, monoLabel } from "@/components/playbooks/article/figure";

// F5 (§05): the hero's ratio unfolded through the harness, step by step in three lanes: what
// the model reads, what code computes, who signs. Three columns from a 560px main column; below
// it the lanes stack and each cell carries its lane's name. Fictional data.

const LANES = [
  { title: "The model reads", sub: "extracts and drafts; every value carries page and span" },
  { title: "Code computes", sub: "deterministic, versioned, same answer every run" },
  { title: "A person signs", sub: "named approver, timestamped" },
];

type Cell =
  | null
  | {
      /** "read" and "compute" cells are grey boxes; "sign" is ink-bordered, "review" dashed. */
      kind: "box" | "sign" | "review";
      body: ReactNode;
      note?: ReactNode;
      /** A red result box under the cell. */
      alert?: ReactNode;
    };

/** Lines of mono figures; `muted` lines are the page references. */
function MonoLines({ lines }: { lines: Array<string | { muted: string }> }) {
  return (
    <div className="font-mono text-[11px] leading-[1.75]">
      {lines.map((l, i) => (
        <Fragment key={i}>
          {i ? <br /> : null}
          {typeof l === "string" ? l : <span className="text-mut">{l.muted}</span>}
        </Fragment>
      ))}
    </div>
  );
}

const STEPS: Array<{ title: string; cells: [Cell, Cell, Cell] }> = [
  {
    title: "1 · Encode the agreement",
    cells: [
      {
        kind: "box",
        body: "Drafts the covenant spec from “Consolidated EBITDA” (b)(v), §7.03(a) and Amd. No. 2 §3(c)",
        note: "clause spans attached",
      },
      {
        kind: "box",
        body: "Validates the spec: cap base = pre-adjustment; $12.00m fixed cap ends 31 Mar 2026; 4.50x max from 30 Jun 2026",
      },
      {
        kind: "sign",
        body: "Credit analyst approves spec v3",
        note: (
          <>
            once per agreement and per amendment
            <br />
            2026-05-18T09:15Z
          </>
        ),
      },
    ],
  },
  {
    title: "2 · Extract the certificate",
    cells: [
      {
        kind: "box",
        body: (
          <MonoLines
            lines={[
              "Funded debt 182.40",
              { muted: "Sch. 1 l.I · p.3" },
              "Qualified cash 9.80",
              { muted: "Sch. 1 l.II · p.3" },
              "EBITDA before add-backs 31.60",
              { muted: "Sch. 4 · p.5" },
              "Add-backs 5.10 · 3.20 · 1.30",
              { muted: "Sch. 4 · p.5" },
            ]}
          />
        ),
      },
      {
        kind: "box",
        body: "Checks each value: literal match to its span, units in $m, four quarters sum to LTM",
        note: "→ typed records only",
      },
      { kind: "review", body: "Analyst reviews any figure that fails a check or is abstained" },
    ],
  },
  {
    title: "3 · Recompute",
    cells: [
      null,
      {
        kind: "box",
        body: (
          <MonoLines
            lines={[
              "cash cap: min(9.80, 7.50) = 7.50",
              "net debt: 182.40 − 7.50 = 174.90",
              "Shared Cap: max(5.00, 0.20×31.60) = 6.32",
              "add-backs allowed 6.32 · disallowed 3.28",
              "EBITDA: 31.60 + 6.32 = 37.92",
            ]}
          />
        ),
        alert: (
          <>
            174.90 ÷ 37.92 = 4.61x &gt; 4.50x
            <br />
            headroom −2.5% · Cure Amount 0.95
          </>
        ),
      },
      null,
    ],
  },
  {
    title: "4 · Explain and decide",
    cells: [
      {
        kind: "box",
        body: "Drafts the variance note: certificate used the superseded $12.00m cap",
        note: "cites Amd. No. 2 §3(c)",
      },
      { kind: "box", body: "Checks every number in the note against the trace" },
      { kind: "sign", body: "Portfolio manager signs the breach memo; cure or waiver goes to the sponsor and lenders" },
    ],
  },
];

const CELL: Record<"box" | "sign" | "review", string> = {
  box: "border border-rule bg-[#F8F7F4]",
  sign: "border-[1.5px] border-ink bg-white",
  review: "border border-dashed border-[#BDB9AF] bg-white text-sec",
};

/** Shown only when the lanes stack (below a 560px column). */
const STACKED = "block @min-[559.5px]:hidden";

export function DefinitionTrace() {
  return (
    <Figure
      image={tileImages["client-reporting-flow"]}
      veil={0.66}
      className="mt-8"
      label="Covenant Watch · how it is built · definition trace"
      caption="The hero example traced through the harness: the model reads, code computes, people sign. Fictional data."
    >
      <Sheet>
        <SheetTitle>One ratio, unfolded: who reads, who computes, who signs</SheetTitle>
        <div className="mt-3.5 hidden grid-cols-[repeat(3,minmax(0,1fr))] gap-2.5 border-b border-ink pb-[9px] @min-[559.5px]:grid">
          {LANES.map((l) => (
            <span key={l.title}>
              <span className="block text-[13px] font-medium">{l.title}</span>
              <span className="mt-0.5 block text-[11px] leading-[1.4] text-sec">{l.sub}</span>
            </span>
          ))}
        </div>
        {STEPS.map((step) => (
          <div key={step.title} className="border-b border-dashed border-rule pt-3 pb-3.5">
            <div className={cx(monoLabel, "mb-2 text-sec")}>{step.title}</div>
            <div className="grid grid-cols-[minmax(0,1fr)] gap-2.5 @min-[559.5px]:grid-cols-[repeat(3,minmax(0,1fr))]">
              {step.cells.map((cell, i) => (
                <div key={LANES[i].title} className="min-w-0">
                  <span className={cx(STACKED, "mb-1 text-[11px] font-medium text-mut")}>{LANES[i].title}</span>
                  {cell ? (
                    <>
                      <div className={cx("box-border rounded-[10px] px-3 py-2.5 text-[12.5px] leading-[1.45]", CELL[cell.kind])}>
                        {cell.body}
                        {cell.note ? <div className="mt-[5px] font-mono text-[10.5px] leading-[1.6] text-mut">{cell.note}</div> : null}
                      </div>
                      {cell.alert ? (
                        <div className="mt-2 box-border rounded-[10px] border-[1.5px] border-bad bg-bad-bg px-3 py-2.5 font-mono text-[11px] leading-[1.75] text-bad-ink">
                          {cell.alert}
                        </div>
                      ) : null}
                    </>
                  ) : (
                    <span className={cx(STACKED, "text-[12px] text-faint")}>—</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="mt-3.5 rounded-[10px] bg-[#F3F0EA] px-3.5 py-3 font-mono text-[11px] leading-[1.75] text-ink-2 [overflow-wrap:anywhere]">
          spec TBC-TNL v3 · shared_cap {"{"}base: &quot;pre_adjustment&quot;, floor: 5.00, pct: 0.20, tests_from: &quot;2026-06-30&quot;,
          replaces: {"{"}fixed: 12.00, until: &quot;2026-03-31&quot;{"}}"} · max_ratio 4.50 from &quot;2026-06-30&quot;
          <br />
          regression case TBC_Q2FY26_cap_applied · expects 4.61x · re-run on every amendment, prompt or model change
        </div>
      </Sheet>
    </Figure>
  );
}
