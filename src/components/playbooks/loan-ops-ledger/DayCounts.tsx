import { tileImages } from "@/components/playbooks/media";
import { Figure, Sheet, cx } from "@/components/playbooks/article/figure";

// F2 (§02, inside the second break): the same fictional loan accrued on two day-count bases;
// the agreement's clause decides which applies. From a 520px main column the inputs have a
// column of their own; below it they sit under each check.

const ROWS = [
  { check: "Interest at ACT/360", inputs: "24,750,000.00 × 9.5625% × 91/360", result: "598,253.91" },
  { check: "Interest at ACT/365", inputs: "24,750,000.00 × 9.5625% × 91/365", result: "590,058.65" },
  { check: "Difference", inputs: "598,253.91 − 590,058.65", result: "8,195.26", tone: "text-bad" },
  {
    check: 'Agreement basis, §1.01 "Interest computations" (fictional)',
    inputs: "360-day year, actual days",
    result: "ACT/360 applies",
    tone: "text-ok",
  },
];

const COLS = "grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 @min-[519.5px]:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)_minmax(0,0.7fr)]";
const WIDE = "hidden @min-[519.5px]:block";
const NARROW = "block @min-[519.5px]:hidden";

export function DayCounts() {
  return (
    <Figure
      image={tileImages["capital-call-flow"]}
      veil={0.7}
      metaRight={false}
      captionGap={6}
      className="mt-[22px]"
      label="Same loan, two day counts"
      meta="Penrose Vale Software TL · 31 Mar – 30 Jun 2026"
      moment="Same loan, same rate, same days. The basis changes the number."
      caption="The same fictional loan accrued on two day-count bases; the agreement's clause decides which applies."
    >
      <Sheet pad="px-4 pt-1.5 pb-1">
        <div role="table">
          <div role="row" className={cx(COLS, "border-b border-ink pt-2.5 pb-2 text-[11px] text-sec")}>
            <span role="columnheader">Check</span>
            <span role="columnheader" className={cx(WIDE, "text-right font-mono")}>
              Inputs
            </span>
            <span role="columnheader" className="text-right font-mono">
              Result
            </span>
          </div>
          {ROWS.map((r, i) => (
            <div key={r.check} role="row" className={cx(COLS, "items-baseline py-2.5", i < ROWS.length - 1 && "border-b border-rule-2")}>
              <span role="rowheader" className="min-w-0">
                <span className="block text-[13px] leading-[1.4]">{r.check}</span>
                <span className={cx(NARROW, "mt-[3px] font-mono text-[11px] text-sec [overflow-wrap:anywhere]")}>{r.inputs}</span>
              </span>
              <span role="cell" className={cx(WIDE, "text-right font-mono text-[11px]")}>
                {r.inputs}
              </span>
              <span role="cell" className={cx("text-right font-mono text-[11.5px]", r.tone)}>
                {r.result}
              </span>
            </div>
          ))}
        </div>
      </Sheet>
    </Figure>
  );
}
