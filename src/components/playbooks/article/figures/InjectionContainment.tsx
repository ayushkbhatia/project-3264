import { Fragment, type ReactNode } from "react";
import type { StaticImageData } from "next/image";
import { Dot, Figure, Sheet } from "../figure";

// Injection containment (Covenant Watch F10, Loan Ops Ledger F8, NAV Pack Review F8), a house
// figure: the untrusted document passes through a quarantined reader (no tools, no egress) and
// leaves only as a typed record; beside it, a seeded red-team case. Each page names its document
// and case.

/** A pipeline box: name left, note right. */
function Stage({ name, note, strong, right }: { name: string; note?: string; strong?: boolean; right?: boolean }) {
  return (
    <div
      className={`flex items-baseline justify-between gap-3 bg-[#F8F7F4] px-3.5 py-[11px] ${
        strong ? "rounded-[10px] border-[1.5px] border-ink" : "rounded-[11px] border border-rule"
      }`}
    >
      <span className="text-[13px]">{name}</span>
      {note ? <span className={`text-[11.5px] text-sec ${right ? "text-right" : ""}`}>{note}</span> : null}
    </div>
  );
}

/** A downward arrow between stages. */
function Arrow() {
  return (
    <span aria-hidden="true" className="relative h-[18px] w-[1.5px] self-center bg-ink">
      <span className="absolute -bottom-px -left-[3.75px] size-0 border-x-[4.5px] border-t-[7px] border-x-transparent border-t-ink" />
    </span>
  );
}

export function InjectionContainment({
  image,
  veil,
  className,
  source,
  redTeam,
  caption,
}: {
  image: StaticImageData;
  veil: number;
  className?: string;
  /** The untrusted document at the top of the pipeline, e.g. "Borrower package". */
  source: string;
  redTeam: {
    /** "Seeded red-team case (fictional): white text on page 9 reads" */
    lead: string;
    /** The planted instruction, quotes included. */
    quote: string;
    /** What happened, after the red status dot. */
    result: ReactNode;
  };
  caption: string;
}) {
  const stages = [
    <Stage key="source" name={source} note="untrusted input" />,
    <div key="reader" className="relative rounded-[15px] border-[1.5px] border-ink px-2.5 pt-[26px] pb-2.5">
      <span className="absolute top-2 left-3.5 font-mono text-[10.5px] text-sec">no tools · no egress</span>
      <Stage name="Quarantined reader" note="model, read-only" strong />
    </div>,
    <Stage key="record" name="Typed record" note="fields only" />,
    <div key="validators" className="rounded-[11px] border border-rule bg-[#F8F7F4] px-3.5 py-[11px] text-[13px]">
      Validators
    </div>,
    <Stage key="engine" name="Engine, then review" note="code decides; a person signs" right />,
  ];
  return (
    <Figure image={image} veil={veil} className={className} label="Injection containment" caption={caption}>
      <Sheet className="flex flex-wrap items-center gap-x-[26px] gap-y-[18px]">
        <div className="flex min-w-0 flex-[1.1_1_280px] flex-col items-stretch">
          {stages.map((stage, i) => (
            <Fragment key={i}>
              {i ? <Arrow /> : null}
              {stage}
            </Fragment>
          ))}
        </div>
        {/* content-box, as in the reference: the 220px basis excludes the padding and rule */}
        <div className="box-content min-w-0 flex-[1_1_220px] rounded-[0_10px_10px_0] border-l-2 border-ink bg-[#F8F7F4] px-4 py-3.5">
          <div className="text-[12.5px] leading-[1.5] text-sec">{redTeam.lead}</div>
          <div className="mt-1.5 font-mono text-[11.5px] leading-[1.6] [overflow-wrap:anywhere]">{redTeam.quote}</div>
          <div className="mt-3.5 flex items-baseline gap-[9px] border-t border-rule-2 pt-3">
            <Dot tone="bad" />
            <span className="text-[12.5px] leading-[1.55]">{redTeam.result}</span>
          </div>
        </div>
      </Sheet>
    </Figure>
  );
}
