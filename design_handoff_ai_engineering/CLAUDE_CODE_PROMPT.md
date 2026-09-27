# Prompts for Claude Code — 3264.ai AI Engineering

Paste these in order, one prompt per session. Start a fresh session for each phase. Do not start a phase
until the previous one passed its gate in `BUILD_PLAN.md`.

---

## 0 · Kickoff (run once)

```
You are implementing the 3264.ai AI Engineering page from a high-fidelity design handoff in
/design_handoff_ai_engineering. The goal is a pixel-faithful port: side by side with the reference at
1440px, at any scroll position, a designer should not be able to tell them apart.

Read, in this order, before writing code:
  1. design_handoff_ai_engineering/README.md
  2. design_handoff_ai_engineering/BUILD_PLAN.md
  3. design_handoff_ai_engineering/ANIMATIONS.md  (skim now; read fully in Phase 3)
  4. design_handoff_ai_engineering/specs/00-foundation.md
  5. design_handoff_ai_engineering/VISUAL_QA.md

Serve the reference (npx serve design_handoff_ai_engineering/reference -l 4200) and open
http://localhost:4200/AI%20Engineering.dc.html. Scroll the whole page slowly, twice. Notice how 03 holds the
page until its build completes, then flies the platform into 04, and how 06's second card waits as a spine
on the right and rolls over the first. This file is the source of truth for layout, copy, colour and
motion. It runs on a small prototype runtime (support.js); do not port the runtime. Read the markup between
<x-dc> and </x-dc> as plain HTML with inline styles.

Rules for the whole project:
- Stack: Next.js App Router, React, TypeScript, Tailwind. No motion libraries.
- Copy is verbatim, including copy inside the logic files and the SVG scenes. Middle dots (·), en and em
  dashes are deliberate.
- Values are exact. 13.5px is not 14px, -0.032em is not tracking-tight, rgba(20,20,18,0.075) is not a
  Tailwind grey. Use arbitrary values or theme tokens with the exact value.
- No heading is heavier than weight 400.
- Port the three logic classes in motion/ as classes (extends React.Component), keeping every method body
  as is apart from the PORT SHIMS in ANIMATIONS.md. Do not rewrite them as hooks, do not move motion state
  into React, do not use Framer Motion or GSAP.
- Every ref="{{ name }}" in the reference is a DOM contract. Bind it to the same-named ref.
- Elements the logic fills or redraws (the [data-svg] hosts, the 06 snippet host, the intro stage) are
  EMPTY in JSX.
- One global link rule only (a { color:inherit } a:hover { color:var(--a) }).
- After each phase, run the QA harness and fix differences before reporting done.

First task: skeleton only. Next.js app, Tailwind, both fonts via Fontsource with exact family names (not
next/font), body custom properties from specs/00-foundation.md, globals.css with the body resets, link rule
and ::selection, assets copied to public/img, an empty /ai-engineering route. Set up Playwright per
VISUAL_QA.md and capture reference baselines at every viewport. Report what you set up and stop.
```

---

## Phase 1 · Foundation and shell

```
Phase 1 of design_handoff_ai_engineering/BUILD_PLAN.md. Read specs/00-foundation.md, specs/02-header-hero.md
(Header part) and specs/07-footer.md in full.

Build the Header and the Footer, plus empty placeholder <section>s for every other block with the right id,
data-screen-label, padding and bottom hairline. Give the pinned sections their real track heights (Premise
760vh, Engagement 400vh) and the dark canvas its scaled height (2980/1280 of its width) so scroll length
and anchors are right from the start.

Compare header and footer with qa/visual.spec.ts at 1280, 1440 and 1920. Fix every difference, then report
the Phase 1 gate.
```

## Phase 2 · Static markup, no motion

```
Phase 2. Read the "Markup" parts of specs/01-intro.md to specs/06-engagement.md.

Build every section's static markup from reference/sections/*.html: hero; the three Premise cards and their
app windows; the Audit tile (menu bar, heading, Gantt, panel, glass calendar, audit window); the 03–05 dark
canvas shell (1280x2980 frame, backdrop, lattice layer, three frames with headings and caption blocks, empty
[data-svg] hosts); the two Engagement cards with spines, the mini calendar and the empty platform-snippet
host. Bind every ref.

Render each element in its initial state (what the reference shows before motion: word spans at base
opacity, calendar bars hidden, the build card translated to its right-hand spine). Compare by eye with the
reference at ?intro=off, same scroll positions. Report the Phase 2 gate.
```

## Phase 3 · Port the logic classes

```
Phase 3. Read ANIMATIONS.md top to bottom, then the three files in motion/ top to bottom. They are long;
read them anyway. Most porting bugs come from not knowing which element a method reaches for.

Port per BUILD_PLAN.md → "Class port": extends React.Component, render() returns the Phase 2 JSX, refs and
values from this.renderVals(), dead code deleted, PORT SHIMS applied. Mount order: the page component, which
contains <RebuildPlatform/>, which contains <RebuildGraphic bare/>.

Verify each system in ANIMATIONS.md order at the points in qa/scrub-points.json: hero veil, 01 Premise,
02 Audit (time captures), 03 hold and build, the 03→04 flight, 04, 05, 06 Engagement (roll, calendar,
platform snippet). Report the Phase 3 gate per system.
```

## Phase 4 · Intro overlay

```
Phase 4. Read specs/01-intro.md and ANIMATIONS.md §2.

Confirm the overlay plays once per load for 4.8s, dismisses on click and any key with a 280ms fade, never
appears with reduced motion, playIntro=false or ?intro=off, and that the first click after dismissal
reaches the page. Resolve the open question in spec 01 with the team. Report the Phase 4 gate.
```

## Phase 5 · Responsive, accessibility, performance, checklist

```
Phase 5. Read specs/08-responsive-a11y-perf.md. Implement its gating and a11y items (including reduced-
motion handling for the 03 hold and buttons for the 06 spines), then walk CHECKLIST.md end to end. Report
each item as pass or fail, with a note for anything you could not verify. Do NOT design mobile layouts for
the pinned sections; list them as open.
```

---

## When something doesn't match

```
Section <name> at <viewport>, scrub point <id>, doesn't match. Capture both with qa/visual.spec.ts and list
every difference: position, size, type size, tracking, line-height, colour, opacity, border, shadow.

If it is inside an element the logic writes to (transform, opacity, an SVG host), the cause is almost always
outside the logic: a missing CSS variable on body, a font family mismatch, a Tailwind class adding
transform/overflow/gap on the element or an ancestor, or a ref on the wrong element. Compare computed styles.
Do not edit the ported math to compensate.
```

## When a pinned sequence stalls, jumps, or the page won't scroll

```
<Section> stalls at <position>. Check: (1) track and sticky child are the right elements, sticky child is
the track's first child; (2) no ancestor between body and the sticky element has overflow hidden/auto;
(3) no ancestor has a transform; (4) sticky top is 68px; (5) for 03: exactly one RebuildPlatform instance
(Strict Mode must leave one), window.__rbCtl is set, and the hold releases once window.__rbCtl.shown
reaches 1. Report which failed before changing anything.
```
