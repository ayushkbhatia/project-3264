"use client";

import { useRef, useState, type ReactNode } from "react";
import { SmartLink } from "@/components/home/primitives";
import { Figure, Sheet, SheetTitle, cx } from "@/components/playbooks/article/figure";
import { ON_TOP_IN_UPPER_65, useHeroReveal } from "@/components/playbooks/article/useHeroReveal";
import { tileImages } from "@/components/playbooks/media";
import { playbookHref } from "@/content/playbooks";

// F1, the hero figure: one sentence of a Q2 2026 letter with every figure bound. The four
// figures in the sentence and the six rows of the binding table (the four, the gross pair's
// check and the NAV they rest on) point at each other: hovering either tints both. The reveal
// runs down the table: each row's dot turns green in turn and, for the four figures, the
// sentence's underline draws. All data fictional; the numbers reconcile, and the NAV is NAV
// Pack Review's post-rebook figure. The table's muted text is in --mut-ink-2, as it sits on the
// wash and, under the pointer, on the highlight.

/** Six steps, 150ms apart from 300ms: the rows in table order. */
const SCHEDULE = [300, 450, 600, 750, 900, 1050];

type Key = "1" | "2" | "g" | "3" | "4" | "n";

type Row = {
  key: Key;
  /** The footnote number shared with the sentence; none on the check and the NAV. */
  num?: string;
  figure: string;
  calc: string;
  basis: ReactNode;
  status: string;
  cells: string;
};

const ROWS: Row[] = [
  {
    key: "1",
    num: "1",
    figure: "11.8%",
    calc: "NIRR-ITD-Q2-26",
    basis: "Net · with facility · granular method · inception to 30 Jun 2026",
    status: "bound",
    cells: "CF-2026Q2.xlsx!Flows!B2:H389",
  },
  {
    key: "2",
    num: "2",
    figure: "10.9%",
    calc: "NIRR-ITD-Q2-26-XF",
    basis: "Net · without facility · same period and method",
    status: "bound",
    cells: "CF-2026Q2.xlsx!Flows · FAC-STMT-Q2-26!A2:F61",
  },
  {
    key: "g",
    figure: "15.6% / 14.1%",
    calc: "GIRR-ITD-Q2-26 / -XF",
    basis: "Gross pair, same period, method and facility treatment",
    status: "pass",
    cells: "pair check: gross and net share basis",
  },
  {
    key: "3",
    num: "3",
    figure: "1.21x",
    calc: "TVPI-ITD-Q2-26",
    basis: "(325.1m distributions + 831.8m NAV) ÷ 956.1m paid-in",
    status: "bound",
    cells: "INV-LEDGER!Dist!K2 · NAV-Q2-26 · !Calls!K2",
  },
  {
    key: "4",
    num: "4",
    figure: "0.34x",
    calc: "DPI-ITD-Q2-26",
    basis: "325.1m distributions ÷ 956.1m paid-in",
    status: "bound",
    cells: "INV-LEDGER!Dist!K2 · !Calls!K2",
  },
  {
    key: "n",
    figure: "831.8m",
    calc: "NAV-Q2-26",
    basis: (
      <>
        Net assets 831,827,358.01, approved after{" "}
        <SmartLink href={playbookHref("nav-pack-review")} className="border-b border-[rgba(20,20,18,0.3)] text-ink hover:border-a hover:text-a">
          NAV Pack Review
        </SmartLink>
      </>
    ),
    status: "tied",
    cells: "Northbay pack v3 (fictional) · fee-basis break rebooked",
  },
];

/** The reveal step at which each row turns green (and its figure's underline draws). */
const STEP = Object.fromEntries(ROWS.map((r, i) => [r.key, i + 1])) as Record<Key, number>;

/** The binding table's columns. From a 560px main column: #, figure, calculation, basis, status,
    with the source cells under the calculation and basis. Below it: #, figure (its calculation
    inline), status, with the basis and the source cells under them. */
const COLS =
  "grid-cols-[20px_minmax(0,1fr)_auto] @min-[559.5px]:grid-cols-[20px_minmax(0,0.72fr)_minmax(0,1.15fr)_minmax(0,1.6fr)_minmax(0,0.62fr)]";

const HL = "#F1E6CF";

export function BoundSentence({ animate = true }: { animate?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  // the handoff's trigger: the figure's top in the upper 65% of the viewport, or the final state
  // if that has not happened within 4s of mount
  const step = useHeroReveal(ref, animate, ON_TOP_IN_UPPER_65, SCHEDULE);
  const [hot, setHot] = useState<Key | null>(null);
  const hover = (key: Key) => ({ onMouseEnter: () => setHot(key), onMouseLeave: () => setHot(null) });

  /** A figure in the sentence: mono, its underline drawn from the left once it is bound. */
  const fig = (key: Key, value: string) => (
    <span
      {...hover(key)}
      data-reveal="draw"
      className="cursor-default rounded-[2px] bg-[linear-gradient(#1A1917,#1A1917)] bg-left-bottom bg-no-repeat px-px pb-[3px] font-mono text-[0.92em] [transition:background-size_420ms_ease,background-color_160ms_ease]"
      style={{ backgroundColor: hot === key ? HL : "transparent", backgroundSize: step >= STEP[key] ? "100% 1.5px" : "0% 1.5px" }}
    >
      {value}
    </span>
  );
  /** Its footnote number, set as the browser sets <sup>: raised, on the sentence's line height. */
  const sup = (n: string) => <sup className="static ml-px align-super font-mono text-[10px] leading-[inherit] text-sec">{n}</sup>;

  return (
    <Figure
      ref={ref}
      data-reveal-root={animate ? "on" : "off"}
      image={tileImages["investor-reporting"]}
      veil={0.72}
      eager
      className="mt-9"
      label="Q2 2026 letter to limited partners · draft v4"
      aside={
        <span className="inline-flex items-baseline gap-1.5 font-mono text-[11px] text-ink-2">
          <span aria-hidden="true" className="size-[7px] flex-none rounded-full bg-ok" />
          <span>4 of 4 figures bound · 0 unbound · snapshot snap_2026Q2_07</span>
        </span>
      }
      evidence="LCOF-II-Q2-2026-letter · v4 · p.1 ¶2 fig 1 → 11.8% → bound to NIRR-ITD-Q2-26; recompute Δ 0.0 bp; gross/net basis match → pass → CFO · 2026-08-14 16:22 UTC"
      moment="An unbound number would block release. Gross and net are computed on the same period, method and facility treatment."
      caption="A Q2 2026 letter sentence for a fictional credit fund. Each figure links to the calculation that produced it and the cells it came from."
    >
      <Sheet>
        <SheetTitle>Larkspur Credit Opportunities Fund II (fictional)</SheetTitle>
        <div className="mt-3.5 text-[12.5px] text-mut">Performance</div>
        <p className="mt-1.5 mb-0 text-[clamp(17px,1.7vw,20px)] leading-[1.65] tracking-[-0.012em] text-ink">
          Since inception the Fund has generated a net IRR of {fig("1", "11.8%")}
          {sup("1")} ({fig("2", "10.9%")}
          {sup("2")} excluding the subscription facility), a net TVPI of {fig("3", "1.21x")}
          {sup("3")} and DPI of {fig("4", "0.34x")}
          {sup("4")}.
        </p>

        <div role="table" aria-label="How each figure is bound" className="mt-[18px]">
          <div
            role="row"
            className={cx("hidden gap-x-3 border-b border-ink px-2 pb-[7px] text-[10.5px] text-sec @min-[559.5px]:grid", COLS)}
          >
            <span role="columnheader">#</span>
            <span role="columnheader" className="text-right">
              Figure
            </span>
            <span role="columnheader">Calculation</span>
            <span role="columnheader">Basis · source cells</span>
            <span role="columnheader">Status</span>
          </div>
          {ROWS.map((row, i) => (
            <div
              key={row.key}
              role="row"
              {...hover(row.key)}
              className={cx(
                "grid items-baseline gap-x-3 gap-y-[3px] px-2 py-[9px] transition-[background] duration-[160ms] ease-[ease]",
                COLS,
                i < ROWS.length - 1 && "border-b border-rule-2",
              )}
              style={{ background: hot === row.key ? HL : row.num ? "transparent" : "#EEEBE4" }}
            >
              <span role="cell" className="font-mono text-[10.5px] text-mut-ink-2">
                {row.num}
              </span>
              <span role="rowheader" className="min-w-0 text-left font-mono text-[12px] font-medium @min-[559.5px]:text-right">
                {row.figure}
                <span className="ml-2 inline text-[10.5px] font-normal text-sec @min-[559.5px]:hidden">{row.calc}</span>
              </span>
              <span role="cell" className="hidden min-w-0 font-mono text-[10.5px] [overflow-wrap:anywhere] @min-[559.5px]:block">
                {row.calc}
              </span>
              <span role="cell" className="col-[2/-1] min-w-0 text-[12px] leading-[1.45] text-ink-2 @min-[559.5px]:col-auto">
                {row.basis}
              </span>
              <span
                role="cell"
                className="col-[3] row-[1] flex items-baseline gap-1.5 text-[12px] @min-[559.5px]:col-auto @min-[559.5px]:row-auto"
              >
                <span
                  aria-hidden="true"
                  data-reveal="wait"
                  className="size-[7px] flex-none rounded-full transition-[background] duration-[220ms] ease-[ease]"
                  style={{ background: step >= STEP[row.key] ? "#157F52" : "#D9D6CF" }}
                />
                <span>{row.status}</span>
              </span>
              <span
                role="cell"
                className="col-[2/-1] min-w-0 font-mono text-[10px] leading-[1.55] text-mut-ink-2 [overflow-wrap:anywhere] @min-[559.5px]:col-[3/5]"
              >
                {row.cells}
              </span>
            </div>
          ))}
        </div>
      </Sheet>
    </Figure>
  );
}
