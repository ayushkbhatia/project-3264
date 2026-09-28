"use client";

import { useState } from "react";
import { tileImages } from "@/components/playbooks/media";
import { Figure, Sheet, cx, monoLabel } from "@/components/playbooks/article/figure";
import { evidenceLine } from "./case";

// F3 (§04): the hero's evidence line, then its eight parts one per row. Hovering a row
// highlights its segment in the line and inks the row's label.

export function EvidenceLine() {
  const [hot, setHot] = useState(-1);
  return (
    <Figure
      image={tileImages["loan-ops-ledger"]}
      veil={0.72}
      className="mt-7"
      label="Example evidence line"
      meta="Tallis Brook Components · fictional"
      caption="One test's evidence line, split into its parts. Fictional data."
    >
      <Sheet>
        <div className="font-mono text-[11.5px] leading-[1.9] text-ink [overflow-wrap:anywhere]">
          {evidenceLine.map((part, i) => (
            <span key={part.label}>
              {part.sep}
              <span
                className={cx("rounded-[3px] transition-[background] duration-[160ms] ease-[ease]", hot === i ? "bg-hl" : "bg-transparent")}
              >
                {part.value}
              </span>
            </span>
          ))}
        </div>
        <div className="mt-4 border-t border-ink">
          {evidenceLine.map((part, i) => (
            <div
              key={part.label}
              onMouseEnter={() => setHot(i)}
              onMouseLeave={() => setHot(-1)}
              className={cx("flex flex-wrap gap-x-[18px] gap-y-[3px] py-2", i < evidenceLine.length - 1 && "border-b border-rule-2")}
            >
              <span className={cx(monoLabel, "flex-[0_0_88px] pt-px", hot === i ? "text-ink" : "text-mut")}>{part.label}</span>
              <span className="min-w-0 flex-[1_1_240px] font-mono text-[11.5px] leading-[1.6] [overflow-wrap:anywhere]">{part.value}</span>
            </div>
          ))}
        </div>
      </Sheet>
    </Figure>
  );
}
