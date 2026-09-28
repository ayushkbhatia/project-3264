import type { StaticImageData } from "next/image";
import { Figure, Sheet } from "../figure";

// The harness anatomy (Covenant Watch F6, Loan Ops Ledger F6, Capital Call Flow F4, NAV Pack
// Review F4), a house figure for every playbook's "How it is built": the pinned model in the
// middle of the eight parts that instruct, constrain and check it, framed by the four that watch
// every run. From a 600px main column it is the framed 3×3 grid with the four edge labels; below
// that, a stacked list.

const PARTS = [
  { n: "02", name: "Instructions", text: "versioned prompts and rubrics, one per release" },
  { n: "03", name: "Tools", text: "few, namespaced, each rated read / propose / execute" },
  { n: "04", name: "Retrieval and context", text: "the clauses and ledger rows this step needs, just in time" },
  { n: "05", name: "State", text: "a run ledger per case, never the chat history" },
  { n: "06", name: "Validators", text: "schema, range, units, and does the cited span support it" },
  { n: "07", name: "Deterministic engines", text: "ratios, allocations, tie-outs, limit tests: unit-tested code" },
  { n: "08", name: "Orchestration", text: "workflow code; any loop has step, time and cost caps" },
  { n: "09", name: "Human review", text: "named approvers; four-eyes wherever money moves" },
];

const EDGES = {
  top: { n: "10", text: "Observability — every span records model, prompt version, tokens, latency, cost" },
  bottom: { n: "11", text: "Eval suites — golden set, regression, capability and red-team cases, run on every change" },
  right: { n: "12", text: "Cost and latency budgets per run" },
  left: { n: "13", text: "Permissions — read · propose · execute" },
};

function Num({ n }: { n: string }) {
  return <span className="font-mono text-[10.5px] text-mut">{n}</span>;
}

function Edge({ e }: { e: { n: string; text: string } }) {
  return (
    <>
      <Num n={e.n} /> {e.text}
    </>
  );
}

function Model({ gap }: { gap: string }) {
  return (
    <>
      <div className="text-[14.5px] font-medium">Model</div>
      <div className={`${gap} font-mono text-[10.5px] text-[rgba(255,255,255,0.72)]`}>01 · pinned snapshot</div>
    </>
  );
}

function Card({ part }: { part: (typeof PARTS)[number] }) {
  return (
    <div className="box-border min-h-[100px] rounded-[12px] border border-rule-2 bg-[#F8F7F4] px-3.5 py-[13px]">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[13.5px] font-medium">{part.name}</span>
        <Num n={part.n} />
      </div>
      <div className="mt-1.5 text-[12px] leading-[1.5] text-sec">{part.text}</div>
    </div>
  );
}

export function HarnessAnatomy({ image, veil, className }: { image: StaticImageData; veil: number; className?: string }) {
  return (
    <Figure
      image={image}
      veil={veil}
      className={className}
      label="Harness anatomy"
      caption="The pinned model sits inside twelve layers that instruct, constrain, check and record it."
    >
      <Sheet pad="p-3.5">
        {/* wide: the framed grid */}
        <div className="relative hidden rounded-[18px] border-[1.5px] border-ink px-11 py-[46px] @min-[599.5px]:block">
          <div className="absolute inset-x-11 top-[15px] text-center text-[12.5px] leading-[1.4]">
            <Edge e={EDGES.top} />
          </div>
          <div className="absolute inset-x-11 bottom-[15px] text-center text-[12.5px] leading-[1.4]">
            <Edge e={EDGES.bottom} />
          </div>
          <div className="absolute inset-y-[46px] left-3 flex items-center justify-center">
            <span className="rotate-180 text-[12.5px] whitespace-nowrap [writing-mode:vertical-rl]">
              <Edge e={EDGES.left} />
            </span>
          </div>
          <div className="absolute inset-y-[46px] right-3 flex items-center justify-center">
            <span className="text-[12.5px] whitespace-nowrap [writing-mode:vertical-rl]">
              <Edge e={EDGES.right} />
            </span>
          </div>
          <div className="grid grid-cols-[repeat(3,minmax(0,1fr))] gap-3.5">
            {PARTS.slice(0, 4).map((p) => (
              <Card key={p.n} part={p} />
            ))}
            <div className="relative flex min-h-[100px] items-center justify-center">
              <span aria-hidden="true" className="absolute -top-3.5 bottom-1/2 left-1/2 w-px bg-rule" />
              <span aria-hidden="true" className="absolute top-1/2 -bottom-3.5 left-1/2 w-px bg-rule" />
              <span aria-hidden="true" className="absolute top-1/2 right-1/2 -left-3.5 h-px bg-rule" />
              <span aria-hidden="true" className="absolute top-1/2 -right-3.5 left-1/2 h-px bg-rule" />
              <div className="relative box-border w-4/5 rounded-[12px] bg-ink px-2.5 py-3.5 text-center text-white">
                <Model gap="mt-1" />
              </div>
            </div>
            {PARTS.slice(4).map((p) => (
              <Card key={p.n} part={p} />
            ))}
          </div>
        </div>

        {/* narrow: stacked */}
        <div className="grid gap-2 rounded-[16px] border-[1.5px] border-ink p-3 @min-[599.5px]:hidden">
          <div className="rounded-[12px] bg-ink p-3.5 text-center text-white">
            <Model gap="mt-[3px]" />
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,200px),1fr))] gap-2">
            {PARTS.map((p) => (
              <div key={p.n} className="rounded-[12px] border border-rule-2 bg-[#F8F7F4] px-3.5 py-3">
                <div className="text-[13.5px] font-medium">
                  <span className="font-mono text-[10.5px] font-normal text-mut">{p.n}</span> {p.name}
                </div>
                <div className="mt-[3px] text-[12px] leading-[1.45] text-sec">{p.text}</div>
              </div>
            ))}
          </div>
          <div className="grid gap-[5px] border-t border-rule-2 px-1 pt-2.5 pb-0.5 text-[12.5px] leading-[1.45]">
            {[EDGES.top, EDGES.bottom, EDGES.right, EDGES.left].map((e) => (
              <div key={e.n}>
                <Edge e={e} />
              </div>
            ))}
          </div>
        </div>
      </Sheet>
    </Figure>
  );
}
