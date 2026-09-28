"use client";

import { useRef } from "react";
import { tileImages } from "@/components/playbooks/media";
import { Dot, Figure, Sheet, SheetTitle, cx } from "@/components/playbooks/article/figure";
import { useHeroReveal } from "@/components/playbooks/article/useHeroReveal";
import { evidenceLine } from "./case";

// F1, the hero figure: the recompute that beats the certificate. The certificate's 4.25x is
// ringed (step 1), both headroom values fade in (step 2), then the checklist card rises in
// (step 3); see useHeroReveal. All data fictional.

type Row = { n: string; label: string; sub?: string; cert: string; re: string; src: string; shade?: boolean; ring?: boolean };

const ROWS: Row[] = [
  { n: "I", label: "Funded debt", cert: "182.40", re: "182.40", src: "Sch. 1 · p.3" },
  { n: "II", label: "Qualified cash", sub: "reported 9.80, capped at 7.50", cert: "7.50", re: "7.50", src: "Sch. 1 · p.3" },
  { n: "III", label: "Net debt", cert: "174.90", re: "174.90", src: "I − II" },
  { n: "IV", label: "Consolidated EBITDA, LTM", sub: "31.60 before add-backs", cert: "41.20", re: "37.92", src: "Sch. 4 · p.5", shade: true },
  { n: "V", label: "Total net leverage", cert: "4.25x", re: "4.61x", src: "III ÷ IV", shade: true, ring: true },
  { n: "VI", label: "Maximum from 30 Jun 2026", cert: "4.50x", re: "4.50x", src: "§7.03(a)" },
];

type Check = { tone: "ok" | "bad" | "next"; title: string; detail?: string[] };

const CHECKS: Check[] = [
  { tone: "ok", title: "Package received 12 Aug 2026", detail: ["2 files · sha256 recorded"] },
  { tone: "ok", title: "18 figures extracted, each with page and span" },
  { tone: "ok", title: "Schedule 4 cross-foots: four quarters sum to LTM" },
  {
    tone: "bad",
    title: "Shared Cap applied, Amd. No. 2 §3(c)",
    detail: ["claimed 5.10 + 3.20 + 1.30 = 9.60", "cap = greater of 5.00 and 20% × 31.60 = 6.32", "disallowed 3.28"],
  },
  { tone: "next", title: "Cure Amount 0.95", detail: ["cure window closes 29 Aug 2026"] },
  { tone: "next", title: "Routed to the credit analyst" },
];

/** Columns: # · line · certificate · recompute · source; the source drops below a 520px column. */
const COLS = "grid grid-cols-[22px_minmax(0,1fr)_auto_auto] @min-[519.5px]:grid-cols-[26px_minmax(0,1.7fr)_minmax(0,0.75fr)_minmax(0,0.75fr)_minmax(0,0.8fr)]";
const SRC = "hidden @min-[519.5px]:block";
const num = "text-right font-mono text-[11.5px]";

export function Recompute({ animate = true }: { animate?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const step = useHeroReveal(ref, animate);
  return (
    <Figure
      ref={ref}
      data-reveal-root={animate ? "on" : "off"}
      image={tileImages["covenant-watch"]}
      veil={0.62}
      eager
      className="mt-11"
      label="Covenant Watch · recompute · total net leverage"
      meta="Larkspur Credit Opportunities Fund II · CC-2026Q2-TallisBrook.pdf · v1 · $m"
      evidence={evidenceLine.map((p) => p.sep + p.value).join("")}
      moment="The certificate applies the $12.00m fixed cap, which ended with the 31 Mar 2026 test period."
      caption="Fictional data. The difference is definitional: the certificate used a cap that an amendment had replaced."
    >
      <Sheet>
        <SheetTitle>Tallis Brook Components · test period ended 30 Jun 2026</SheetTitle>
        <div role="table" className="mt-3">
          <div role="row" className={cx(COLS, "gap-x-2.5 border-b border-ink px-1.5 pb-2 text-[11px] text-sec")}>
            {/* the line numerals need no header: an empty cell, as an empty <td> would be */}
            <span role="cell" />
            <span role="columnheader">Schedule 1 line</span>
            <span role="columnheader" className="text-right font-mono">
              Certificate
            </span>
            <span role="columnheader" className="text-right font-mono">
              Recompute
            </span>
            <span role="columnheader" className={SRC}>
              Source
            </span>
          </div>
          {ROWS.map((r) => (
            <div
              key={r.n}
              role="row"
              className={cx(COLS, "items-baseline gap-x-2.5 border-b border-rule-2 px-1.5 py-[9px]", r.shade && "bg-[#F3F0EA]")}
            >
              <span role="cell" className="font-mono text-[11px] text-sec">
                {r.n}
              </span>
              <span role="rowheader" className="min-w-0">
                <span className="block text-[13px] leading-[1.35]">{r.label}</span>
                {r.sub ? <span className="mt-0.5 block text-[11px] text-sec">{r.sub}</span> : null}
              </span>
              <span role="cell" className={num}>
                {r.ring ? (
                  <span
                    data-reveal="ring"
                    className="-mx-[5px] -my-px inline-block rounded-[5px] px-[5px] py-px transition-[box-shadow] duration-500 ease-[ease]"
                    style={{ boxShadow: step >= 1 ? "0 0 0 1.5px #1A1917" : "0 0 0 1.5px rgba(26,25,23,0)" }}
                  >
                    {r.cert}
                  </span>
                ) : (
                  r.cert
                )}
              </span>
              <span role="cell" className={num}>
                {r.re}
              </span>
              <span role="cell" className={cx(SRC, "font-mono text-[10.5px] text-mut")}>
                {r.src}
              </span>
            </div>
          ))}
          <div role="row" className={cx(COLS, "items-baseline gap-x-2.5 border-b border-ink px-1.5 py-2.5")}>
            <span role="cell" />
            <span role="rowheader" className="text-[13px] font-medium">
              Headroom on EBITDA
            </span>
            {[
              { v: "+5.7%", tone: "text-ok" },
              { v: "−2.5%", tone: "text-bad" },
            ].map((h) => (
              <span
                key={h.v}
                role="cell"
                data-reveal="fade"
                className={cx(num, h.tone, "transition-opacity duration-[450ms] ease-[ease]")}
                style={{ opacity: step >= 2 ? 1 : 0 }}
              >
                <span aria-hidden="true">●</span> {h.v}
              </span>
            ))}
            <span role="cell" className={SRC} />
          </div>
        </div>
      </Sheet>
      <div
        data-reveal="rise"
        className="mt-2.5 transition-[opacity,transform] duration-[450ms] ease-[ease]"
        style={{ opacity: step >= 3 ? 1 : 0, transform: step >= 3 ? "none" : "translateY(6px)" }}
      >
        <Sheet pad="px-4 py-2">
          {CHECKS.map((c) => (
            <div
              key={c.title}
              className={cx(
                "flex items-baseline gap-2.5",
                c.tone === "bad" ? "-mx-1 my-1 rounded-[10px] bg-bad-bg px-3 py-2.5" : "border-b border-rule-2 py-2.5",
              )}
            >
              {c.tone === "next" ? (
                <span aria-hidden="true" className="w-[7px] flex-none font-mono text-[11px] text-sec">
                  →
                </span>
              ) : (
                <Dot tone={c.tone} />
              )}
              <span className="min-w-0">
                <span className="block text-[13px] leading-[1.45]">{c.title}</span>
                {c.detail ? (
                  <span className="mt-[3px] block font-mono text-[11px] leading-[1.6] text-sec">
                    {c.detail.map((line, i) => (
                      <span key={line}>
                        {i ? <br /> : null}
                        {line}
                      </span>
                    ))}
                  </span>
                ) : null}
              </span>
            </div>
          ))}
        </Sheet>
      </div>
    </Figure>
  );
}
