import type { StaticImageData } from "next/image";
import { Figure, Sheet } from "../figure";

// Consistency across repeated runs (Covenant Watch F8), a house figure: at a 95% per-run
// success rate, pass^k (every one of k runs right) falls to 0.60 by ten runs while pass@k (at
// least one right) reaches ~1.00. Illustrative maths. The plot is an SVG stretched to its box
// (non-scaling strokes); the axes and labels are HTML around it, as in the reference.

const P = 0.95;
const K = 10;
/** y in the 900×400 viewBox, for a value on the 0.6–1.0 axis. */
const y = (v: number) => +(((1 - v) / 0.4) * 400).toFixed(1);
const points = (f: (k: number) => number) =>
  Array.from({ length: K }, (_, i) => `${i * 100},${y(f(i + 1))}`).join(" ");

const PASS_HAT = points((k) => P ** k); // 0,50 100,97.5 … 900,401.3
const PASS_AT = points((k) => 1 - (1 - P) ** k); // 0,50 100,2.5 200,0.1 300,0 …

const TICK = "absolute font-mono text-[10.5px] text-mut";

export function PassK({ image, veil, className }: { image: StaticImageData; veil: number; className?: string }) {
  return (
    <Figure
      image={image}
      veil={veil}
      className={className}
      label="Consistency across repeated runs"
      caption="Illustrative maths, not measured performance. At a 95% per-run success rate, all ten runs are correct about 60% of the time."
    >
      <Sheet>
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <span className="text-[12.5px] text-sec">Per-run success rate 0.95, runs independent</span>
          <span className="flex flex-wrap gap-x-[18px] gap-y-1.5 text-[12px]">
            <span className="inline-flex items-center gap-[7px]">
              <span aria-hidden="true" className="h-0.5 w-[22px] bg-ink" />
              pass^k — all k runs correct
            </span>
            <span className="inline-flex items-center gap-[7px]">
              <span aria-hidden="true" className="h-0 w-[22px] border-t-2 border-dashed border-faint" />
              pass@k — at least one
            </span>
          </span>
        </div>
        <div
          role="img"
          aria-label="Line chart over one to ten runs: pass^k falls from 0.95 to 0.60; pass@k rises from 0.95 to about 1.00 by the third run."
          className="relative mt-6 mr-24 mb-8 ml-[30px] h-[clamp(170px,20vw,220px)]"
        >
          <div aria-hidden="true">
            {["0", "25%", "50%", "75%"].map((top) => (
              <span key={top} className="absolute inset-x-0 border-t border-rule-2" style={{ top }} />
            ))}
            <span className="absolute inset-x-0 top-full border-t border-rule" />
            {["1.0", "0.9", "0.8", "0.7", "0.6"].map((v, i) => (
              <span key={v} className={`${TICK} -left-[30px] -translate-y-1/2`} style={{ top: `${i * 25}%` }}>
                {v}
              </span>
            ))}
            <svg
              viewBox="0 0 900 400"
              preserveAspectRatio="none"
              className="absolute top-0 left-0 size-full overflow-visible"
            >
              <polyline
                points={PASS_AT}
                fill="none"
                stroke="#8A887F"
                strokeWidth={1.75}
                strokeDasharray="6 5"
                vectorEffect="non-scaling-stroke"
              />
              <polyline points={PASS_HAT} fill="none" stroke="#1A1917" strokeWidth={1.75} vectorEffect="non-scaling-stroke" />
            </svg>
            <span className="absolute top-0 left-full size-2 -translate-1/2 rounded-full bg-faint" />
            <span className="absolute top-full left-full size-2 -translate-1/2 rounded-full bg-ink" />
            <span className="absolute top-0 left-[calc(100%+12px)] -translate-y-1/2 text-[12px] whitespace-nowrap">pass@k ≈ 1.00</span>
            <span className="absolute top-full left-[calc(100%+12px)] -translate-y-1/2 text-[12px] whitespace-nowrap">pass^k 0.60</span>
            {Array.from({ length: K }, (_, i) => (
              <span
                key={i}
                className={`${TICK} top-[calc(100%+9px)] -translate-x-1/2`}
                style={{ left: `${+((i / (K - 1)) * 100).toFixed(2)}%` }}
              >
                {i + 1}
              </span>
            ))}
            <span className={`${TICK} top-[calc(100%+9px)] left-[calc(100%+12px)] whitespace-nowrap`}>runs (k)</span>
          </div>
        </div>
      </Sheet>
    </Figure>
  );
}
