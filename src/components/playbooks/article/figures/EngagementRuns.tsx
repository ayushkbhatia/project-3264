import type { StaticImageData } from "next/image";
import { Figure, Sheet } from "../figure";

// How an engagement runs (Covenant Watch F9), a house figure: a two-week assessment, a build
// released every fortnight with a shadow run at its end, acceptance, then production. From a
// 600px main column it is a timeline in four columns; below that, the phases stack.

type Step = { n: string; name: string; text: string };

const ASSESS: Step[] = [
  { n: "1", name: "Discovery, baseline", text: "cycle time and error rate from the firm's own logs" },
  { n: "2", name: "Golden set", text: "real cases, two labellers, agreement measured" },
];
const BUILD: Step[] = [
  { n: "3", name: "Prototype", text: "a thin slice sets the ceiling" },
  { n: "4", name: "Error analysis", text: "read traces, count failures" },
  { n: "5", name: "Eval-gated releases", text: "regression suite must pass" },
];
const SHADOW: Step[] = [
  { n: "6", name: "Shadow run", text: "incumbent stays in charge; disagreements logged" },
  { n: "7", name: "Acceptance", text: "owner signs thresholds and a stated sampling plan" },
];
const RUN: Step[] = [
  { n: "8", name: "Staged rollout", text: "one fund or desk first" },
  { n: "9–10", name: "Monitoring, drift", text: "overrides, cost, re-runs" },
  { n: "11", name: "Model migration", text: "regress, shadow, canary" },
];

const PHASE = "font-mono text-[10px] tracking-[0.07em] text-sec uppercase";
const RELEASES = ["R1", "R2", "R3", "R4", "R5", "R6"];

function Steps({ steps, className }: { steps: Step[]; className: string }) {
  return (
    <div className={className}>
      {steps.map((s) => (
        <div key={s.n}>
          <div className="text-[13px] font-medium">
            {s.n} {s.name}
          </div>
          <div className="mt-0.5 text-[12px] leading-[1.5] text-sec">{s.text}</div>
        </div>
      ))}
    </div>
  );
}

export function EngagementRuns({ image, veil, className }: { image: StaticImageData; veil: number; className?: string }) {
  const wideBox = "mt-2.5 box-border flex h-[50px] items-center justify-center rounded-[16px] border-[1.5px] border-ink text-[14px]";
  const narrowBox = "mt-2 box-border flex h-[46px] items-center justify-center rounded-[15px] border-[1.5px] border-ink text-[14px]";
  const wideSteps = "mt-[30px] grid content-start gap-3";
  const narrowSteps = "mt-3 grid gap-2.5";
  return (
    <Figure
      image={image}
      veil={veil}
      className={className}
      label="How an engagement runs"
      caption="A two-week assessment, a build released every fortnight with a shadow run, then production."
    >
      <Sheet pad="p-[18px]">
        {/* wide: a four-column timeline */}
        <div className="hidden grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)_minmax(0,1.1fr)_minmax(0,1fr)] gap-x-6 @min-[599.5px]:grid">
          <div className={PHASE}>Assess · 2 weeks</div>
          <div className={`${PHASE} col-span-2`}>Build · 6–12 weeks · release every fortnight</div>
          <div className={PHASE}>Run · ongoing</div>

          <div className={wideBox}>diagnostic</div>
          <div className="col-span-2 mt-2.5">
            <div className="box-border flex h-[50px] justify-end rounded-[16px] border-[1.5px] border-ink p-[5px]">
              <span className="flex w-2/5 items-center justify-center rounded-[11px] bg-wash text-[14px]">shadow run</span>
            </div>
            <div className="flex justify-between pr-[8%] pl-[10%]">
              {RELEASES.map((r) => (
                <span key={r} className="flex flex-col items-center gap-1">
                  <span aria-hidden="true" className="h-[11px] w-[1.5px] bg-ink" />
                  <span className="font-mono text-[10.5px]">{r}</span>
                </span>
              ))}
            </div>
          </div>
          <div className="relative mt-2.5">
            <span aria-hidden="true" className="absolute -top-2.5 -left-[13px] h-[92px] w-[1.5px] bg-ok" />
            <div className="box-border flex h-[50px] items-center justify-center rounded-[16px] border-[1.5px] border-ink text-[14px]">
              in production
            </div>
            <span className="absolute top-16 -left-1.5 text-[12px] text-ok">acceptance</span>
          </div>

          <Steps steps={ASSESS} className={wideSteps} />
          <Steps steps={BUILD} className={wideSteps} />
          <Steps steps={SHADOW} className={wideSteps} />
          <Steps steps={RUN} className={wideSteps} />
        </div>

        {/* narrow: the phases stacked */}
        <div className="grid gap-[22px] @min-[599.5px]:hidden">
          <div>
            <div className={PHASE}>Assess · 2 weeks</div>
            <div className={narrowBox}>diagnostic</div>
            <Steps steps={ASSESS} className={narrowSteps} />
          </div>
          <div>
            <div className={PHASE}>Build · 6–12 weeks · release every fortnight</div>
            <div className="mt-2 box-border flex h-[46px] justify-end rounded-[15px] border-[1.5px] border-ink p-1">
              <span className="flex w-1/2 items-center justify-center rounded-[11px] bg-wash text-[13.5px]">shadow run</span>
            </div>
            <div className="mt-1.5 font-mono text-[10.5px] text-sec">{RELEASES.join(" · ")}</div>
            <Steps steps={[...BUILD, ...SHADOW]} className={narrowSteps} />
          </div>
          <div className="flex items-center gap-2.5 text-[12px] text-ok">
            <span aria-hidden="true" className="h-[1.5px] flex-auto bg-ok" />
            acceptance
            <span aria-hidden="true" className="h-[1.5px] flex-auto bg-ok" />
          </div>
          <div>
            <div className={PHASE}>Run · ongoing</div>
            <div className={narrowBox}>in production</div>
            <Steps steps={RUN} className={narrowSteps} />
          </div>
        </div>
      </Sheet>
    </Figure>
  );
}
