import { featureImages } from "@/components/playbooks/media";
import { Dot, Figure, Sheet, SheetTitle, cx } from "@/components/playbooks/article/figure";

// F2 (§03): is the proposed equity cure allowed under this agreement? Eight quarters of cure
// history, then each limit checked. The limits are this fictional agreement's own.

type Quarter = { q: string; status: "cured" | "pass" | "cure proposed" };

const QUARTERS: Quarter[] = [
  { q: "Q3 FY24", status: "cured" },
  { q: "Q4 FY24", status: "pass" },
  { q: "Q1 FY25", status: "cured" },
  { q: "Q2 FY25", status: "pass" },
  { q: "Q3 FY25", status: "pass" },
  { q: "Q4 FY25", status: "pass" },
  { q: "Q1 FY26", status: "pass" },
  { q: "Q2 FY26", status: "cure proposed" },
];

const TOKEN: Record<Quarter["status"], string> = {
  cured: "border border-ink bg-ink text-white",
  pass: "border border-rule-2 bg-[#F8F7F4] text-mut",
  "cure proposed": "border-[1.5px] border-ok bg-ok-bg text-ok-ink",
};

const CHECKS = [
  ["Not in consecutive quarters", "Q1 FY2026 not cured"],
  ["No more than 2 cures in any 4 consecutive quarters", "Q3 FY2025 – Q2 FY2026: 1"],
  ["No more than 5 cures over the life of the facility", "this cure is 3 of 5"],
  ["Amount no more than the Cure Amount", "$0.95m proposed · $0.95m needed"],
  ["Funded within 15 days of the statements due date", "due 14 Aug 2026 → fund by 29 Aug 2026"],
  ["No pro forma reduction of debt from cure proceeds", "net debt held at $174.90m"],
  ["Pro forma leverage at or below the maximum", "174.90 ÷ 38.87 = 4.50x ≤ 4.50x"],
] as const;

/** Check and result side by side from a 560px column; below it the result wraps under. */
const CHECK_COLS = "grid grid-cols-[14px_minmax(0,1fr)] gap-x-3 gap-y-1 @min-[559.5px]:grid-cols-[14px_minmax(0,1.25fr)_minmax(0,1fr)]";
const RESULT_COL = "col-[2/-1] @min-[559.5px]:col-auto";

export function CureEligibility() {
  return (
    <Figure
      image={featureImages["covenant-watch"]}
      veil={0.72}
      className="mt-10"
      label="Covenant Watch · cure eligibility · per this agreement"
      meta={
        <>
          Larkspur Credit Opportunities Fund II
          <br />
          Credit agreement §8.04 Cure Right · as amended by Amd. No. 2
        </>
      }
      evidence="Credit agreement · Amd. No. 2 · §8.04(a)–(e) → cure 3 of 5, $0.95m → 7 checks → eligible → portfolio manager · 2026-08-13T15:20Z"
      moment="Cure EBITDA counts for the financial covenants only. It is disregarded for the pricing grid and baskets. The sponsor and lenders decide; the system does not."
      caption="Cure limits are this fictional agreement's own, not a market standard."
    >
      <Sheet>
        <SheetTitle>Tallis Brook Components · proposed equity cure, Q2 FY2026</SheetTitle>
        <div className="mt-3.5 grid grid-cols-[repeat(4,minmax(0,1fr))] gap-1.5 @min-[559.5px]:grid-cols-[repeat(8,minmax(0,1fr))]">
          {QUARTERS.map((t) => (
            <div key={t.q} className={cx("box-border rounded-[9px] px-1 py-2 text-center", TOKEN[t.status])}>
              <div className="font-mono text-[10.5px]">{t.q}</div>
              <div className="mt-[3px] text-[11.5px]">{t.status}</div>
            </div>
          ))}
          <div className="col-[1/-1] text-center @min-[559.5px]:col-[5/span_4]">
            {/* content-box, as in the reference: 7px plus its bottom border */}
            <div aria-hidden="true" className="box-content h-[7px] rounded-[0_0_6px_6px] border border-t-0 border-rule" />
            <div className="mt-1.5 font-mono text-[10.5px] text-sec">any 4 consecutive quarters: 1 cure</div>
          </div>
        </div>
        <div className="mt-4">
          <div className={cx(CHECK_COLS, "border-b border-ink pb-2 text-[11px] text-sec")}>
            <span />
            <span>Check, per this agreement</span>
            <span className={RESULT_COL}>Result</span>
          </div>
          {CHECKS.map(([check, result]) => (
            <div key={check} className={cx(CHECK_COLS, "items-baseline border-b border-rule-2 py-[9px]")}>
              <Dot tone="ok" />
              <span className="text-[13px] leading-[1.4]">{check}</span>
              <span className={cx(RESULT_COL, "font-mono text-[11.5px] text-ink-2")}>{result}</span>
            </div>
          ))}
        </div>
        <div className="mt-3.5 inline-flex items-center gap-2 rounded-full bg-ok-bg px-3.5 py-[7px] text-[13.5px] text-ok-ink">
          <Dot tone="ok" />
          Cure eligible · 2 lifetime uses remain
        </div>
      </Sheet>
    </Figure>
  );
}
