import { featureImages } from "@/components/playbooks/media";
import { Figure, Sheet, cx } from "@/components/playbooks/article/figure";
import { SheetHead, SheetMoment, Status } from "./parts";

// F7 (§05, "What is hard for machines"): one £4.9m holding tested against one "no more than
// 5.00%" limit under four readings of the denominator. It passes against total assets and fails
// against the other three. A fictional portfolio; each percentage is 4.9 over its denominator.
//
// Layout by main-column width: four columns from 540px; below, the amount moves under the
// denominator's name and the table keeps three columns.

const ROWS: Array<{ name: string; amount: string; pct: string; pass: boolean }> = [
  { name: "Total assets", amount: "98.0", pct: "5.00", pass: true },
  { name: "Net assets", amount: "95.1", pct: "5.15", pass: false },
  { name: "Net assets + £2.3m borrowings for investment purposes", amount: "97.4", pct: "5.03", pass: false },
  { name: "Invested assets, excluding cash", amount: "91.3", pct: "5.37", pass: false },
];

const TRACKS =
  "grid-cols-[minmax(0,1fr)_auto_auto] @min-[539.5px]:grid-cols-[minmax(0,2fr)_minmax(0,0.8fr)_minmax(0,0.7fr)_minmax(0,0.6fr)]";
const WIDE = "hidden @min-[539.5px]:block";

export function Denominators() {
  return (
    <Figure
      image={featureImages["nav-pack-review"]}
      veil={0.72}
      className="mt-6"
      label="Why it is hard · which denominator?"
      caption="Rules differ: the Names Rule uses net assets plus borrowings for investment purposes; s.5(b)(1) uses total assets."
    >
      <Sheet>
        <SheetHead
          title="One holding, one “5%” limit, four readings"
          sub="A fictional portfolio · holding in one issuer: £4.9m · limit: no more than 5.00%"
        />
        <div role="table" aria-label="One holding tested under four denominators" className="mt-3">
          <div role="row" className={cx("grid", TRACKS, "gap-x-3 border-b border-ink px-2 pb-[7px] text-[10.5px] text-sec")}>
            <span role="columnheader">Denominator</span>
            <span role="columnheader" className={cx(WIDE, "text-right")}>
              Denominator £m
            </span>
            <span role="columnheader" className="text-right">
              Holding %
            </span>
            <span role="columnheader">Result</span>
          </div>
          {ROWS.map((r, i) => (
            <div
              key={r.name}
              role="row"
              className={cx("grid", TRACKS, "items-baseline gap-x-3 gap-y-[3px] px-2 py-[9px]", i < ROWS.length - 1 && "border-b border-rule-2")}
            >
              <span role="rowheader" className="min-w-0 text-[12.5px] leading-[1.4]">
                {r.name}
                <span className="block font-mono text-[10px] text-mut @min-[539.5px]:hidden">£{r.amount}m</span>
              </span>
              <span role="cell" className={cx(WIDE, "text-right font-mono text-[11.5px]")}>
                {r.amount}
              </span>
              <span role="cell" className="text-right font-mono text-[11.5px]">
                {r.pct}
              </span>
              <span role="cell">
                <Status tone={r.pass ? "ok" : "bad"}>{r.pass ? "pass" : "fail"}</Status>
              </span>
            </div>
          ))}
        </div>
        <SheetMoment>The same words pass under one denominator and fail under three. The rule has to name which.</SheetMoment>
      </Sheet>
    </Figure>
  );
}
