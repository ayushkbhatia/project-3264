# Prompts for Claude Code — 3264.ai Home

Paste these in order into Claude Code. Use **one prompt per session**. Start a fresh session
for each phase so the context holds only that phase's spec. Do not start a phase until the
previous one has passed its gate in `BUILD_PLAN.md`.

Put this folder in the repo at `/design_handoff_home` before starting.

---

## 0 · Kickoff (run once, before Phase 1)

```
You are implementing the 3264.ai marketing home page from a high-fidelity design handoff in
/design_handoff_home. The goal is a pixel-faithful port: when the port and the reference are
screenshotted side by side at 1440px, a designer should not be able to tell them apart.

Read, in this order, before writing any code:
  1. design_handoff_home/README.md
  2. design_handoff_home/BUILD_PLAN.md
  3. design_handoff_home/specs/00-foundation.md
  4. design_handoff_home/VISUAL_QA.md

Then open design_handoff_home/reference/3264 Home.dc.html in a browser (serve the reference/
folder statically, e.g. `npx serve design_handoff_home/reference`). This file is the source of
truth for every value: layout, copy, colour and motion. It is a prototype on a small custom
runtime. Do not port the runtime (support.js). Read the markup between <x-dc> and </x-dc> as
plain HTML with inline styles.

Rules for the whole project:
- Stack: Next.js App Router, React, TypeScript, Tailwind. three@0.161.0, lazy-imported only.
- Copy is verbatim. Do not rewrite, shorten, reorder or "improve" any text.
- Values are exact. When the reference says 16.5px, -0.032em, rgba(20,20,18,0.075), use those
  numbers. Do not round to the nearest Tailwind step; use arbitrary values or theme tokens
  defined with the exact value.
- No heading is ever heavier than weight 400.
- Files in design_handoff_home/motion/ are production code. Mount them; do not rewrite them,
  do not replace them with Framer Motion/GSAP, do not move their state into React.
- Every ref="{{ name }}" in the reference is a DOM contract with a motion module. Keep the name.
- After each phase, run the visual QA harness and fix differences before reporting done.

Your first task: set up the project skeleton only (Next.js app, Tailwind, fonts, tokens,
/motion copied to src/motion, three installed and three-loader.js repointed to npm). Do not
build any sections yet. Then set up the Playwright visual QA harness described in
VISUAL_QA.md and confirm it can screenshot the reference. Report what you set up and stop.
```

---

## Phase 1 · Foundation and shell

```
Phase 1 of design_handoff_home/BUILD_PLAN.md. Read specs/00-foundation.md in full.

Build: global tokens, Instrument Sans via next/font, body resets, link and selection styles,
the <GridTexture> primitive (both variants), <SectionHeader>, <HairlineGrid>, <Eyebrow>, the
sticky Header, the Footer image section and the Footer. Render them on the home route with
empty placeholder <section>s in between, each carrying the correct id and vertical padding,
so the page rhythm is already correct.

Compare header, footer image and footer against the reference at 1280, 1440 and 1920 with
the QA harness. Fix every visible difference. Then report the Phase 1 gate results.
```

## Phase 2 · Static sections

```
Phase 2. Read specs/02-static-sections.md.

Build sections in this order, one at a time, screenshotting each against the reference
before starting the next: Engagement model (#model), Industries (#industries), Selected
engagements (#work), Stack, Team (#company), Playbooks (#playbooks), Closing CTA (#contact).

Use the primitives from Phase 1. Hairline grids must be 1px gaps over the --line colour with
a 1px outer border, not Tailwind divide-*. Keep both placeholder notes. Render exactly nine
logos.

Report the Phase 2 gate results with per-section diff percentages.
```

## Phase 3 · Hero

```
Phase 3. Read specs/03-hero.md and ANIMATIONS.md sections 3 and 4.

Build the hero markup first, with motion disabled, and match it to the reference with
?motion=off on both sides. Then mount HeroArt and Vignettes through useMotionSystem, passing
the exact element keys (artCv, vigA, vigB, vigC). Keep the CSS background image on the canvas
as the no-WebGL fallback.

Verify: the painting displaces on scroll while the type above it stays still; vignettes loop
out of phase; nothing starts off-screen; blocking the three import leaves a static painting.
Report the Phase 3 gate results.
```

## Phase 4 · Capabilities (the set piece)

```
Phase 4. Read specs/04-capabilities.md and ANIMATIONS.md section 2 in full, then read
src/motion/platform-sequence.js top to bottom before writing markup.

Build the section header, then the 420vh track, sticky pin, two-column grid, act rail, three
stacked left panels and the stage, with every ref from the DOM contract table. The three data
panels (phAssess, phBuildP, phRun) are EMPTY positioned divs; the module builds their
contents. Do not create them in JSX.

Mount PlatformSequence. Then work through the Phase 4 gate in BUILD_PLAN.md, including the
scrub captures at p = 0.10, 0.30, 0.36, 0.50, 0.64, 0.70, 0.90. Wire the rail tabs with
bind.handler("phJump"). Below 768px, do not mount the module; render the static fallback
described in the spec.

This phase is most of the engineering. Do not report done until every item in the gate passes.
```

## Phase 5 · Intro relief

```
Phase 5. Read specs/05-intro.md and ANIMATIONS.md section 1.

Build the overlay markup (iWrap, iGrid, iCv, iMark, iLock, iSfx, iCap) and mount IntroRelief.
Keep the dual teardown (onfinish OR timeout) exactly as written. Confirm: plays once, skips on
click and keypress, never appears under reduced motion, and the page accepts a click on a nav
link immediately after dismissal. Report the Phase 5 gate results.
```

## Phase 6 · Responsive, accessibility, performance

```
Phase 6. Read specs/06-responsive-a11y-perf.md. Walk the whole of CHECKLIST.md and fix
everything that fails. Report each checklist item as pass/fail with a note on anything you
could not verify.
```

---

## When something doesn't match

Paste this whenever a section looks off:

```
Section <name> doesn't match the reference. Screenshot both at 1440 with ?motion=off, crop to
the section, and list every difference you can see: spacing, type size, tracking, line-height,
colour, border weight and alignment. Then open the reference markup for that section and
compare computed styles for each element, not your memory of the spec. Fix and re-screenshot
until the diff is under the threshold in VISUAL_QA.md.
```
