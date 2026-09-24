"use client";

import type { ReactNode } from "react";
import { PlatformSequence, useMotionSystem } from "@/motion/react";

// The pinned three-act sequence. Everything that moves is owned by src/motion/platform-sequence.js;
// this file only lays down the DOM contract it binds to (specs/04-capabilities.md). Do not drive
// any of it from React state: the module writes styles and text into these nodes at runtime.
//
// INLINE STYLES are used only for properties the module rewrites inline (pin top/height, track
// height, grid columns/gap/alignment, stage order/height, panel position/opacity, rail colours,
// panel-host opacity, tooltip position). They are the initial values; a Tailwind class for the
// same property would be overridden the moment the module runs, or fight it on resize.
//
// INITIAL VALUES are what phLayout() is about to write, not the reference markup's raw
// pre-layout values (pin top 0 / 100vh, stage with no height, panel box 390px). The prototype
// ran phLayout() in componentDidMount, before first paint, so its raw markup was never on
// screen. Here the server HTML paints first and the module mounts after hydration, so the
// server HTML has to be the laid-out state already — otherwise a reload mid-sequence re-lays
// the pin in front of the reader, and on 768–940px screens (phLayout's single-column band,
// where the track is 40vh shorter) a deep link such as /#industries lands ~450px off target.
//
// Inline styles cannot carry a media query, so the initial values that differ between
// phLayout's two layouts read custom properties, set per band below at phLayout's own
// breakpoint (innerWidth < 940). The module replaces each inline value with a literal one when
// it runs, so these never compete with it.
const HEADER_H = 69; // the sticky header: 68px + 1px hairline

const PRE_LAYOUT = [
  // track height
  "[--ph-track:420vh] max-[940px]:[--ph-track:380vh]",
  // grid: columns, gap, alignment
  "[--ph-cols:minmax(0,0.86fr)_minmax(0,1.14fr)] max-[940px]:[--ph-cols:minmax(0,1fr)]",
  "[--ph-gap:56px] max-[940px]:[--ph-gap:26px]",
  "[--ph-align:center] max-[940px]:[--ph-align:start]",
  // stage: order, and phLayout's height — max(260, min(sw / 1.3, avail - 56)) beside the copy;
  // max(190, min(sw / 1.15, avail - copy - 58)) above it, where the copy block is a constant 206px
  // across that band. sw (the stage column) comes from container units on phGrid.
  "[--ph-order:0] max-[940px]:[--ph-order:-1]",
  "[--ph-stage:max(260px,min(calc((100cqw_-_56px)*0.57/1.3),calc(100vh_-_125px)))]",
  "max-[940px]:[--ph-stage:max(190px,min(calc(100cqw/1.15),calc(100vh_-_333px)))]",
  // left panels: wrapper margin, prose size/margin, list shown or not (see ActCopy)
  "[--ph-wrap-m:40px_0_0] max-[940px]:[--ph-wrap-m:20px_0_0]",
  "[--ph-p-fs:16.5px] max-[940px]:[--ph-p-fs:15.5px]",
  "[--ph-p-m:18px_0_0] max-[940px]:[--ph-p-m:14px_0_0]",
  "[--ph-ul:grid] max-[940px]:[--ph-ul:none]",
].join(" ");

// Read once when the system is built (see useMotionSystem).
const OPTS = { accent: "#157F52" };

// Mounted only where the pinned pane fits without clipping; everywhere else the track is
// display:none and CapabilitiesStatic renders instead, and the hook destroys/rebuilds the system
// as the viewport crosses the line. Width alone was not enough: on a phone held sideways
// (844x390, 932x430) the pane cut off the stage's top and the act copy for the whole track.
// The heights are measured with qa/fix-caps-threshold.mjs, with ~10px to spare: beside the copy
// (940px and up) the left column needs a 492px viewport at 940 wide (less when wider); stacked
// (768–939px) the copy plus the stage's smallest fitting height need 529px.
//
// THE SAME QUERY is written out twice more, because Tailwind reads class names as literal text:
// in PINNED_SHOW below and in CapabilitiesStatic's hide class. Change all three together.
const PINNED = "(min-width: 940px) and (min-height: 500px), (min-width: 768px) and (min-height: 540px)";
const PINNED_SHOW =
  "hidden [@media(min-width:940px)_and_(min-height:500px),(min-width:768px)_and_(min-height:540px)]:block";

const PANEL_KEYS = ["phP0", "phP1", "phP2"] as const;
const RAIL_KEYS = ["phR0", "phR1", "phR2"] as const;

export function CapabilitiesSequence({ rail, panels }: { rail: string[]; panels: ReactNode[] }) {
  const bind = useMotionSystem(PlatformSequence, OPTS, [], PINNED);
  const jump = bind.handler("phJump");

  return (
    // data-ph-track: the no-JS rule in Capabilities.tsx hides this and shows the static acts.
    <div ref={bind("phTrack")} data-ph-track="" className={`relative mt-14 ${PINNED_SHOW} ${PRE_LAYOUT}`} style={{ height: "var(--ph-track)" }}>
      <div
        ref={bind("phPin")}
        className="flex items-center"
        style={{ position: "sticky", top: HEADER_H, height: `calc(100vh - ${HEADER_H}px)`, overflow: "hidden" }}
      >
        {/* @container: lets the stage's initial height read its column width (cqw). */}
        <div
          ref={bind("phGrid")}
          className="@container mx-auto box-content grid w-full max-w-[1280px] px-10"
          style={{ gridTemplateColumns: "var(--ph-cols)", gap: "var(--ph-gap)", alignItems: "var(--ph-align)" }}
        >
          {/* LEFT: rail + stacked act copy */}
          <div className="min-w-0">
            <div className="grid grid-cols-[repeat(3,1fr)]">
              {RAIL_KEYS.map((key, i) => (
                <button
                  key={key}
                  ref={bind(key)}
                  type="button"
                  data-act={i}
                  onClick={jump}
                  aria-controls={`capabilities-act-${i}`}
                  // The module keeps this in step with the active act (see phStep).
                  aria-pressed={i === 0}
                  // The reference's hover is an !important :hover rule, so it wins over the
                  // colour the module writes inline; `!` reproduces that. Only the tabs that
                  // start inactive carry it, as in the reference.
                  //
                  // Focus ring: drawn round the label (the span), not the cell. Each label starts
                  // at its cell's left edge, so a ring round the cell ran through the next tab's
                  // first letter and sat on top of the 2px progress rule; round the label it
                  // clears both (12px of padding above, 14px to the right).
                  //
                  // Forced colours replace the inline progress colours with one system colour,
                  // so every tab looked the same: mark the pressed tab with Highlight instead.
                  // `!` is needed to beat the module's inline border and text colours.
                  className={`group cursor-pointer border-t-2 pt-3 pr-3.5 text-left text-[12.5px] tracking-[0.05em] uppercase focus-visible:outline-none forced-colors:border-t-[color:GrayText]! forced-colors:text-[color:GrayText]! forced-colors:aria-pressed:border-t-[color:Highlight]! forced-colors:aria-pressed:text-[color:CanvasText]! ${i === 0 ? "" : "hover:text-ink!"}`}
                  style={{
                    borderTopColor: i === 0 ? "var(--a)" : "var(--line)",
                    color: i === 0 ? "#1A1917" : "var(--mut)",
                  }}
                >
                  <span className="group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-a group-focus-visible:outline-solid">
                    {rail[i]}
                  </span>
                </button>
              ))}
            </div>

            {/* Until the module runs, the three panels share one grid cell, so this box is exactly
                as tall as the tallest panel — the value phLayout() measures into min-height. It
                then positions them absolutely, as in the reference. */}
            <div className="grid" style={{ position: "relative", minHeight: 0, margin: "var(--ph-wrap-m)" }}>
              {PANEL_KEYS.map((key, i) => (
                <div
                  key={key}
                  ref={bind(key)}
                  id={`capabilities-act-${i}`}
                  style={{ position: "relative", gridArea: "1 / 1", opacity: i === 0 ? 1 : 0, pointerEvents: i === 0 ? "auto" : "none" }}
                >
                  {panels[i]}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: the stage. The whole subtree is content-box, as in the reference: the module
              builds padded, fixed-height rows in here and its fit pass measures them.
              aria-hidden: the stage is a visual demonstration. Its panels are mock data that
              changes with scroll position (two of the three at opacity 0 at any moment), and the
              act copy on the left already says what each one shows. Nothing inside can take
              focus: the Build scope rows are pointer-only toggles on plain divs. */}
          <div
            ref={bind("phStage")}
            aria-hidden="true"
            className="relative box-content w-full border border-line bg-white [&_*]:box-content"
            style={{ order: "var(--ph-order)", height: "var(--ph-stage)" }}
          >
            <canvas ref={bind("phCv")} className="absolute inset-0 h-full w-full" />
            <div ref={bind("phLabels")} className="pointer-events-none absolute inset-0 overflow-hidden" />
            <div
              ref={bind("phSlot")}
              className="pointer-events-none absolute inset-0 flex-col items-center justify-center gap-3.5"
              style={{ display: "none" }}
            >
              <div className="text-[12px] tracking-[0.06em] text-mut uppercase">Diagram slot</div>
              <div className="relative h-0.5 w-[180px] bg-[rgba(20,20,18,0.10)]">
                <div ref={bind("phBar")} className="absolute inset-y-0 left-0 bg-a" style={{ width: "0%" }} />
              </div>
            </div>

            {/* Filled, measured and faded by the module. Never render their contents here. */}
            <div ref={bind("phAssess")} className="absolute inset-x-0 top-0 bottom-10 flex flex-col overflow-hidden" style={{ opacity: 0 }} />
            <div ref={bind("phBuildP")} className="absolute inset-x-0 top-0 bottom-10 flex flex-col overflow-hidden" style={{ opacity: 0 }} />
            <div ref={bind("phRun")} className="absolute inset-x-0 top-0 bottom-10 flex flex-col overflow-hidden" style={{ opacity: 0 }} />

            <div
              ref={bind("phTip")}
              className="pointer-events-none absolute rounded-[5px] bg-ink px-3 pt-[9px] pb-[10px] whitespace-nowrap text-page shadow-[0_6px_22px_rgba(20,20,18,0.18)]"
              style={{ left: 0, top: 0, opacity: 0, transform: "translate(-50%,-124%)", transition: "opacity .16s ease" }}
            />

            {/* Caption and counter: initial text only; the module rewrites both per act. */}
            <div className="absolute inset-x-0 bottom-0 flex items-baseline justify-between px-5 pb-4 text-[12px] tracking-[0.05em] text-mut uppercase">
              <span ref={bind("phCap")}>Workflow and data map</span>
              <span ref={bind("phMetric")}>01 / 03</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
