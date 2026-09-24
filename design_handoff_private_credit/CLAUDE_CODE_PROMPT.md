# Prompts for Claude Code — 3264.ai Private Credit

Paste these in order. Use **one prompt per session**, and start a fresh session for each phase so
the context holds only that phase's spec. Do not start a phase until the previous one has passed
its gate in `BUILD_PLAN.md`.

---

## 0 · Kickoff (run once)

```
You are implementing the 3264.ai Private Credit industry page from a high-fidelity design
handoff in /design_handoff_private_credit. The goal is a pixel-faithful port. When the port and
the reference are screenshotted side by side at 1440px, at any scroll position, a designer
should not be able to tell them apart.

Read, in this order, before writing any code:
  1. design_handoff_private_credit/README.md
  2. design_handoff_private_credit/BUILD_PLAN.md
  3. design_handoff_private_credit/ANIMATIONS.md  (skim now; you will read it fully in Phase 3)
  4. design_handoff_private_credit/specs/00-foundation.md
  5. design_handoff_private_credit/VISUAL_QA.md

Then serve the reference (`npx serve design_handoff_private_credit/reference -l 4100`) and open
http://localhost:4100/Private%20Credit.dc.html. Scroll the whole page slowly, twice. This file
is the source of truth for every value: layout, copy, colour and motion. It runs on a small
prototype runtime. Do not port the runtime (support.js). Read the markup between <x-dc> and
</x-dc> as plain HTML with inline styles.

Rules for the whole project:
- Stack: Next.js App Router, React, TypeScript, Tailwind. No motion libraries.
- Copy is verbatim, including the imperative copy inside motion/private-credit.js. Do not
  rewrite, shorten, reorder or "improve" any text. Curly quotes, en dashes, middle dots (·),
  minus signs (−) and ≤ ≥ are deliberate.
- Values are exact. 13.5px is not 14px, -0.032em is not tracking-tight, and
  rgba(20,20,18,0.075) is not a Tailwind grey. Use arbitrary values or theme tokens holding
  the exact value.
- No heading is heavier than weight 400.
- motion/private-credit.js and motion/react.js are production code. Mount them. Do not rewrite,
  split, "clean up" or TypeScript-convert them, do not replace them with Framer Motion or GSAP,
  and do not move their state into React.
- Every ref="{{ name }}" in the reference is a DOM contract. Bind it with useBind()("name").
- Host elements the module fills (pfSide, pfMain, pfRail, p2Side, p2Body, oCount, oField,
  oVig, servHost, lpHost, dStack, iStage, and the titles titleA, titleB, p2Title, p2Cap) are
  EMPTY in JSX. Never render children into them.
- After each phase, run the QA harness and fix differences before reporting done.

First task: project skeleton only. That means the Next.js app, Tailwind, both fonts via
Fontsource with the exact family names from specs/00-foundation.md (not next/font), body CSS custom properties,
globals.css with the @keyframes and reduced-motion rule, motion/ copied to src/motion,
assets copied to public/img, and an empty /industries/private-credit route wrapped in
<PrivateCreditMotionRoot>. Then set up Playwright per VISUAL_QA.md, run
qa/capture-reference.ts, and confirm the reference baselines were written for every viewport.
Report what you set up and stop.
```

---

## Phase 1 · Foundation and shell

```
Phase 1 of design_handoff_private_credit/BUILD_PLAN.md. Read specs/00-foundation.md in full.

Build the tokens, the Header, the Footer and the <CtaBand> primitive (both variants), plus the
<PinnedStage> shell described in the spec (track → sticky pin → head → fit → wrap → stage),
with no content yet. Put empty placeholder <section>s for every other block on the route, each
with its correct id, data-screen-label, padding and bottom hairline. Give the pinned ones their
real track heights (600vh / 700vh / 600vh / 608vh) so scroll length and anchors are right from
the start.

Compare header, both CTA bands and the footer against the reference at 1280, 1440 and 1920
with qa/visual.spec.ts. Fix every visible difference, then report the Phase 1 gate.
```

## Phase 2 · Static markup for every section, motion not yet mounted

```
Phase 2. Read specs/01-hero.md, 02-reality.md, 03-platform.md, 04-origination.md,
05-servicing.md, 06-investors.md and 07-delivery.md. Only the "Markup" part of each; the
"Motion" part is for Phase 3.

Build every section's static markup: the hero with its equation band, the four faux windows
and platform window shell in §01, the §02 window shell, the §03 stage hosts, the §04 and §05
host containers, and the §06 grid with its four stage cells, CTA cell and stack host. Every
ref from each spec's DOM-contract table gets bound with useBind(). All host elements stay
empty.

In this phase <PrivateCreditMotionRoot> should be rendered with options={{ motion: false,
playIntro: false }} AND a temporary guard in react.js that skips start() when
?nomount=1 is present, so you can compare pure markup. Remove the guard at the end of the
phase.

Compare with qa/visual.spec.ts (hero, CTA bands, footer) and by eye for the pinned shells
(both sides at the same scroll position, with the reference's ?t=16&intro=off). Report the
Phase 2 gate.
```

## Phase 3 · Mount the motion module

```
Phase 3. Read ANIMATIONS.md from top to bottom, then read src/motion/private-credit.js from
top to bottom. It is long; read it anyway. Most porting bugs in this kind of page come from
not knowing which element a method reaches for.

Remove the Phase 2 guard and mount the module for real. Check in DevTools that
window.__dcErrs is undefined after a full scroll to the bottom and back. Any entry there means
a missing or misnamed ref, so fix the ref and do not touch the module.

Then work through each system in ANIMATIONS.md order: hero ring, §01, §02, §03, §04, §05, §06.
For each one, run qa/scrub.spec.ts (pinned) or visual.spec.ts with ?t=16 (loops) and compare
the side-by-side PNGs at 1440x900 first, then at the other viewports. Report the Phase 3 gate
per system.
```

## Phase 4 · Intro overlay

```
Phase 4. Read specs/08-intro.md and ANIMATIONS.md §9.

Build the overlay markup (iWrap, iStage, iMark and the two corner captions) as the first child
of the page, with onClick={bind.handler("skipIntro")}. Confirm that it plays once, takes about
5.3s, skips on click and on any key, never appears with reduced motion or ?intro=off, and that
a nav link fires on the first click after dismissal. Report the Phase 4 gate.
```

## Phase 5 · Responsive, accessibility, performance, full checklist

```
Phase 5. Read specs/09-responsive-a11y-perf.md. Implement the gating and a11y items it lists,
then walk CHECKLIST.md end to end. Report each item as pass or fail, with a note for anything
you could not verify. Do NOT design mobile layouts for the pinned sections; list them as open.
```

---

## When something doesn't match

```
Section <name> at <viewport>, scroll p = <value>, doesn't match the reference. Capture both
with qa/scrub.spec.ts (or visual.spec.ts for static sections) and list every difference you
can see: position, size, type size, tracking, line-height, colour, opacity, border and shadow.

If the difference is INSIDE a module-built host, the cause is almost always outside the
module: a missing CSS variable on body, a font family name mismatch, a Tailwind class on the
host or an ancestor (transform, overflow, gap, font-size inheritance), or a ref bound to the
wrong element. Compare computed styles of the host and its ancestors on both sides. Do not
edit motion/private-credit.js to compensate.

If it is OUTSIDE a host, open the reference markup for that element and compare computed
styles, not your memory of the spec. Fix it and re-capture.
```

## When a sequence stalls, jumps or goes blank

```
<Section> stalls/jumps/blanks at p ≈ <value>. First check window.__dcErrs in the console.
Then check: (1) track and pin refs are on the right elements, with the pin as the track's
FIRST child; (2) no ancestor between body and the pin has overflow other than visible/clip,
because overflow hidden or auto breaks position: sticky; (3) no ancestor has a transform;
(4) the pin's top is 68px and it sits under the header; (5) only one PrivateCreditMotion
instance exists (Strict Mode double-mount must leave one; check window.__pcLive).
Report which of these failed before changing anything.
```
