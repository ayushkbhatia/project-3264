import type { ReactNode } from "react";
import { featureImages } from "@/components/playbooks/media";
import { Figure, Sheet } from "@/components/playbooks/article/figure";

// F7 (§05, "How we know it works"): where 1,000 extracted fields go. Filled bars for the fields
// that pass through, outlined bars for the ones a person reads. Illustrative counts.

function Row({ label, sub, children }: { label: string; sub?: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 py-[7px]">
      <div className="flex-[0_0_170px]">
        <div className="text-[13px]">{label}</div>
        {sub ? <div className="mt-0.5 text-[11px] text-sec">{sub}</div> : null}
      </div>
      {children}
    </div>
  );
}

function Bar({ pct, value }: { pct: string; value: string }) {
  return (
    <div className="min-w-0 flex-[1_1_240px]">
      <div
        className="box-border flex h-[22px] items-center justify-end rounded-[6px] bg-ink px-2 font-mono text-[11px] text-white"
        style={{ width: pct }}
      >
        {value}
      </div>
    </div>
  );
}

/** An outlined bar: `min` keeps the smallest ones visible. */
function Outline({ pct, min, className }: { pct: string; min: number; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`box-border h-[22px] rounded-[6px] border-[1.5px] border-ink ${className ?? ""}`}
      style={{ width: pct, minWidth: min }}
    />
  );
}

export function ReviewRouting() {
  return (
    <Figure
      image={featureImages["mandate-guardrails"]}
      veil={0.7}
      className="mt-8"
      label="Review routing · 1,000 extracted fields"
      caption="Fields that fail a validator or fall below the confidence threshold go to a person; a sample of the rest is checked by field class. Illustrative counts."
    >
      <Sheet>
        <Row label="Fields extracted">
          <Bar pct="100%" value="1,000" />
        </Row>
        <Row label="Passed validators">
          <Bar pct="91.2%" value="912" />
        </Row>
        <Row label="Auto-accepted" sub="support verified, confidence ≥ threshold">
          <Bar pct="86.1%" value="861" />
        </Row>
        <div className="my-2 border-t border-rule" />
        <Row label="Review queue" sub="88 failed a validator · 51 low confidence">
          <div className="flex min-w-0 flex-[1_1_240px] items-center gap-2.5">
            <Outline pct="8.8%" min={34} />
            <Outline pct="5.1%" min={22} className="-ml-[7px]" />
            <span className="font-mono text-[11px]">139 · every item read by a person</span>
          </div>
        </Row>
        <Row label="Sample of auto-accepted" sub="drawn per field class">
          <div className="flex min-w-0 flex-[1_1_240px] items-center gap-2.5">
            <Outline pct="6%" min={28} />
            <span aria-hidden="true" className="size-[7px] flex-none rounded-full bg-ok" />
            <span className="font-mono text-[11px] leading-[1.5]">60 checked · 0 errors → error rate below 5% at 95% confidence</span>
          </div>
        </Row>
      </Sheet>
    </Figure>
  );
}
