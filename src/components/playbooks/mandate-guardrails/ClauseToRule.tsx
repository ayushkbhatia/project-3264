"use client";

import { useId, useRef } from "react";
import { tileImages } from "@/components/playbooks/media";
import { Figure, Sheet } from "@/components/playbooks/article/figure";
import { ON_TOP_IN_UPPER_65, useHeroReveal } from "@/components/playbooks/article/useHeroReveal";
import { CLIENT, Fictional, MANDATE, PartLabel, SheetHead, SheetMoment } from "./parts";

// F1, the hero figure: clause 4.2(c) of the Quillmere mandate's investment guidelines, the rule
// version it became (MG-0412 v3), and last night's batch result for the Brackwell Utilities
// group. The card is stacked top to bottom: the reading column is too narrow to set the clause
// beside its rule. All data fictional; the numbers reconcile (23.10 / 500.00 = 4.62%, headroom
// 0.38 pp of £500.00m = £1.90m).
//
// The reveal, once the card's top is in the upper 65% of the viewport (it is taller than a phone
// screen, so a share of it in view would never do): six steps 350ms apart from 300ms, of which
// the first three change something. "investment grade" is underlined (step 1), the
// interpretation note fades in (step 2), and the result turns PASS, green (step 3).

/** The reveal's six steps (README, F1), in ms after it starts. */
const SIX_STEPS = [300, 650, 1000, 1350, 1700, 2050];

const MONO_VALUE = "font-mono text-[11px] leading-[1.55] [overflow-wrap:anywhere]";

const SETTINGS: Array<[string, string]> = [
  ["Numerator", "market value, all issuers in parent group"],
  ["Denominator", "total portfolio market value incl. cash"],
  ["Limit", "≤ 5.00% · tested pre-trade and daily batch"],
  ["Warning", "4.50% · pre-trade and in-trade only"],
  ["Rating", "≥ BBB− at purchase · middle of 3, lower of 2"],
  ["Approved", "head of investment compliance · 2026-09-14 10:22"],
];

type Holding = { name: string; mv: string; pct: string; kind?: "total" | "base" };

const HOLDINGS: Holding[] = [
  { name: "Brackwell Utilities plc 4.25% 2031", mv: "11.25", pct: "2.25" },
  { name: "Brackwell Utilities Networks Finance 3.875% 2029", mv: "7.25", pct: "1.45" },
  { name: "Brackwell Utilities Holdings 4.50% 2030", mv: "2.60", pct: "0.52" },
  { name: "Brackwell Utilities Holdings 5.00% 2034 (bought 22 Sep)", mv: "2.00", pct: "0.40" },
  { name: "Issuer group total", mv: "23.10", pct: "4.62", kind: "total" },
  { name: "Portfolio incl. cash (denominator)", mv: "500.00", pct: "100.00", kind: "base" },
];

const VERSIONS = [
  { v: "v1", date: "2025-11-03", text: "onboarding: single issuer ≤ 5%" },
  { v: "v2", date: "2026-03-02", text: "amendment 1: issuer group" },
  { v: "v3", date: "2026-09-14", text: "rating rule defined", current: true },
];

const COLS = "grid grid-cols-[minmax(0,1fr)_78px_78px]";
const FIGURE_CELL = "text-right font-mono text-[11.5px]";

export function ClauseToRule({ animate = true }: { animate?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const step = useHeroReveal(ref, animate, ON_TOP_IN_UPPER_65, SIX_STEPS);
  const holdingsId = useId();
  const pass = step >= 3;

  return (
    <Figure
      ref={ref}
      data-reveal-root={animate ? "on" : "off"}
      image={tileImages["mandate-guardrails"]}
      veil={0.7}
      eager
      metaRight={false}
      className="mt-9"
      label="Clause-to-rule lineage · batch test"
      meta={
        <>
          IMA-QGCM-2025 · amendment 1 (2026-03-02)
          <br />
          run R-2026-09-27-0412 · snapshot SNAP-ABOR-20260926
        </>
      }
      evidence={
        <>
          IMA-QGCM-2025 amdt 1 · Sch.2 §4.2(c) p.14 → Brackwell Utilities group 23.10 / 500.00 = 4.62% → MG-0412 v3 ≤ 5.00% ·
          R-2026-09-27-0412 → <span className="font-medium text-ok">PASS</span> · headroom 0.38 pp → approved: head of investment
          compliance · 2026-09-14 10:22
        </>
      }
      moment="Split ratings: middle of three says investment grade; the lowest says high yield. Compliance chose the rule, and it is written into v3."
      caption="One clause, the rule version it became, and today's result. Every rule keeps its clause, its version history and its approver."
    >
      <Sheet>
        <SheetHead
          title={
            <>
              {MANDATE} <Fictional />
            </>
          }
          sub={CLIENT}
        />

        {/* the clause, as the guidelines schedule prints it */}
        <PartLabel className="mt-4 mb-2">Source · investment guidelines schedule</PartLabel>
        <div className="rounded-[10px] border border-rule-2 bg-white px-4 py-3.5">
          <div className="flex justify-between gap-3 font-mono text-[10.5px] text-mut">
            <span>Schedule 2 · Investment restrictions</span>
            <span>p.14</span>
          </div>
          {/* the first two lines wrap greedily, as in the reference (no text-wrap: pretty) */}
          <p className="mt-2.5 mb-0 text-[13.5px] leading-[1.55] [text-wrap:wrap]">4.2 Concentration. The Manager shall ensure that:</p>
          <p className="mt-2 mb-0 text-[13.5px] leading-[1.55] text-sec [text-wrap:wrap]">
            (b) no more than 10% of market value is invested in any one industry sub-group; and
          </p>
          <p className="mt-2 mb-0 text-[14.5px] leading-[1.6] text-ink">
            (c) no more than 5% of market value is invested in any one issuer group, and each security is{" "}
            <span
              data-reveal="draw"
              className="bg-[linear-gradient(#1A1917,#1A1917)] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-300 ease-[ease]"
              style={{ backgroundSize: step >= 1 ? "100% 1.5px" : "0% 1.5px" }}
            >
              investment grade
            </span>{" "}
            at purchase.
          </p>
          <div
            data-reveal="fade"
            className="mt-3 border-l-2 border-ink py-0.5 pl-3 transition-opacity duration-[350ms] ease-[ease]"
            style={{ opacity: step >= 2 ? 1 : 0 }}
          >
            <div className="font-mono text-[10.5px] text-sec">Interpretation note IN-4.2(c)-02 · approved</div>
            <div className="mt-1 text-[13px] leading-[1.55] text-pretty">
              “Investment grade” means Baa3 / BBB− or better on the middle of Moody’s, S&amp;P and Fitch; the lower of two if only two
              rate it. Tested at purchase only.
            </div>
          </div>
        </div>

        {/* the rule version the clause became */}
        <PartLabel className="mt-[18px] mb-1.5">Rule MG-0412 v3 · approved, read-only</PartLabel>
        <dl className="m-0">
          {SETTINGS.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[minmax(0,0.34fr)_minmax(0,1fr)] gap-2.5 py-[5px]">
              <dt className="text-[12px] text-sec">{k}</dt>
              <dd className={`m-0 ${MONO_VALUE}`}>{v}</dd>
            </div>
          ))}
        </dl>

        {/* the positions it tested last night */}
        <PartLabel id={holdingsId} className="mt-[18px] mb-2">
          Brackwell Utilities group (fictional) · 26 Sep 2026
        </PartLabel>
        <div role="table" aria-labelledby={holdingsId}>
          <div role="row" className={`${COLS} gap-x-3 border-b border-ink px-2 pb-[7px] text-[10.5px] text-sec`}>
            <span role="columnheader">Holding</span>
            <span role="columnheader" className="text-right">
              Market value £m
            </span>
            <span role="columnheader" className="text-right">
              % of portfolio
            </span>
          </div>
          {HOLDINGS.map((h) => (
            <div
              key={h.name}
              role="row"
              className={`${COLS} items-baseline gap-x-3 gap-y-[3px] border-b border-rule-2 p-2 ${
                h.kind === "total" ? "border-t border-t-ink font-medium" : h.kind === "base" ? "text-mut" : ""
              }`}
            >
              <span role="rowheader" className="min-w-0 text-[12.5px] leading-[1.4]">
                {h.name}
              </span>
              <span role="cell" className={FIGURE_CELL}>
                {h.mv}
              </span>
              <span role="cell" className={FIGURE_CELL}>
                {h.pct}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-2.5 flex flex-wrap items-baseline gap-x-3 gap-y-1 px-2">
          <span className="text-[12px] text-sec">Rating at purchase</span>
          <span className="font-mono text-[11px]">
            5.00% 2034: Baa3 · BB+ · BBB− → middle <strong className="font-semibold">BBB−</strong> · investment grade
          </span>
        </div>

        {/* today's result against the limit */}
        <div
          data-reveal="tint"
          className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-[10px] px-3.5 py-3 transition-[background] duration-200 ease-[ease]"
          style={{ background: pass ? "var(--ok-bg)" : "#F1EEE8" }}
        >
          <span
            data-reveal="wait"
            aria-hidden="true"
            className="size-2 flex-none rounded-full transition-[background] duration-200 ease-[ease]"
            style={{ background: pass ? "var(--ok)" : "#D9D6CF" }}
          />
          <span className="font-mono text-[20px] font-medium tracking-[-0.02em]">4.62%</span>
          <span className="min-w-0 flex-[1_1_200px] font-mono text-[11px] text-sec">vs 5.00% limit · headroom 0.38 pp (£1.90m)</span>
          {/* on the green tint the status word takes --ok-ink (AA; the design's green reads 4.28:1) */}
          <span
            data-reveal="word"
            className="font-mono text-[12px] font-medium transition-[color] duration-200 ease-[ease]"
            style={{ color: pass ? "var(--ok-ink)" : "#8A887F" }}
          >
            PASS
          </span>
        </div>

        <PartLabel className="mt-[18px] mb-2">Rule MG-0412 · version history</PartLabel>
        <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-x-3.5 gap-y-2.5 p-0">
          {VERSIONS.map((v) => (
            <li key={v.v} className={`min-w-0 border-t-2 pt-2 ${v.current ? "border-ink" : "border-rule"}`}>
              <div className="text-[12px]">
                <span className="font-semibold">{v.v}</span> · {v.date}
              </div>
              <div className="mt-0.5 text-[12px] leading-[1.45] text-sec">{v.text}</div>
            </li>
          ))}
        </ol>

        <SheetMoment>“Investment grade” read as the middle of three ratings, as compliance approved on 14 September.</SheetMoment>
      </Sheet>
    </Figure>
  );
}
