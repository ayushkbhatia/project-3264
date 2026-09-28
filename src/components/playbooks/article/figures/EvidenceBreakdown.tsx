"use client";

import { useState } from "react";
import type { StaticImageData } from "next/image";
import { Figure, Sheet, cx, monoLabel } from "../figure";

// The evidence line, broken down (Covenant Watch F3, Loan Ops Ledger F4, Capital Call Flow F3,
// NAV Pack Review F3), a house figure: one test's evidence line, then its eight parts one per
// row. Hovering a row highlights its segment in the line and inks the row's label.

export type EvidencePart = {
  label: string;
  /** Printed before the value in the line: "", " · " or " → ". */
  sep: string;
  value: string;
  /** Row value set at line-height 1.6 (Covenant Watch sets every row so; Loan Ops Ledger only
      its long one). */
  tall?: boolean;
  /** Row value may break anywhere (long identifiers). */
  wrap?: boolean;
};

export function EvidenceBreakdown({
  image,
  veil,
  className,
  meta,
  metaRight,
  parts,
  caption,
}: {
  image: StaticImageData;
  veil: number;
  className?: string;
  meta: string;
  /** See Figure: Covenant Watch right-aligns the head's meta; Capital Call Flow and NAV Pack
      Review do not. */
  metaRight?: boolean;
  parts: readonly EvidencePart[];
  caption: string;
}) {
  const [hot, setHot] = useState(-1);
  return (
    <Figure
      image={image}
      veil={veil}
      className={className}
      label="Example evidence line"
      meta={meta}
      metaRight={metaRight}
      caption={caption}
    >
      <Sheet>
        <div className="font-mono text-[11.5px] leading-[1.9] text-ink [overflow-wrap:anywhere]">
          {parts.map((part, i) => (
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
          {parts.map((part, i) => (
            <div
              key={part.label}
              onMouseEnter={() => setHot(i)}
              onMouseLeave={() => setHot(-1)}
              className={cx("flex flex-wrap gap-x-[18px] gap-y-[3px] py-2", i < parts.length - 1 && "border-b border-rule-2")}
            >
              <span className={cx(monoLabel, "flex-[0_0_88px] pt-px", hot === i ? "text-ink" : "text-mut")}>{part.label}</span>
              <span
                className={cx(
                  "min-w-0 flex-[1_1_240px] font-mono text-[11.5px]",
                  part.tall && "leading-[1.6]",
                  part.wrap && "[overflow-wrap:anywhere]",
                )}
              >
                {part.value}
              </span>
            </div>
          ))}
        </div>
      </Sheet>
    </Figure>
  );
}
