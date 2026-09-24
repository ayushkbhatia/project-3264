# Handoff: 3264.ai — Private Credit

## Start here

1. Put this folder in the repo root as `/design_handoff_private_credit`.
2. Open `CLAUDE_CODE_PROMPT.md` and paste **Kickoff** into a fresh Claude Code session.
3. Run one phase per session, in order, using the prompts in that file. Each phase has a spec in
   `specs/` and a gate in `BUILD_PLAN.md`. Do not start the next phase until the gate passes.
4. Check every phase with `VISUAL_QA.md` against the reference. To view the reference, run
   `npx serve design_handoff_private_credit/reference -l 4100` and open
   `http://localhost:4100/Private%20Credit.dc.html`. It is self-contained and includes its assets.

This README is the overview and the specs hold the detail. If they disagree, the reference HTML wins.

If the Home page (`/design_handoff_home`) is already built, reuse its tokens, fonts, Header and
Footer primitives. The differences for this page are listed in `specs/00-foundation.md`.

## Overview

This is the industry page for private credit funds. The argument runs as one long scroll, and
four of its sections are pinned, scroll-scrubbed sequences:

| # | Section | id | Kind | Clock |
| --- | --- | --- | --- | --- |
| — | Intro overlay ("Reconciliation") | — | one-shot, skippable | timers, ~5.3s |
| — | Header | — | static, sticky | — |
| — | Hero | `#top` | static + canvas ring | time, 27s loop |
| 01 | Run a bigger book without a bigger back office | `#reality` | **pinned, 600vh** | scroll |
| — | CTA band · First step | — | static | — |
| 02 | Follow every deal in one system of record | `#platform` | **pinned, 700vh** | scroll |
| 03 | From sourced to funded, with the memo attached | `#origination` | **pinned, 600vh** | scroll |
| 04 | Interest, fees and resets read straight from the credit agreement | `#servicing` | 3 looping cards | time, 6.2s |
| — | CTA band · Think we're a fit? | — | static | — |
| 05 | Every deal matched to the money that can hold it | `#investors` | looping allocation engine | time, 9.4s/deal |
| 06 | From audit to live platform in eight weeks | `#delivery` | **pinned, 608vh**, dark | scroll |
| — | Footer | — | static | — |

Target: **Next.js (App Router) + React + TypeScript + Tailwind**, the same stack as Home.
Suggested route: `/industries/private-credit`. The QA scripts assume that route, so change it
there if you use a different one.

## About the design files

Everything in `reference/` is a **design reference built in HTML**: a prototype of the intended
look and behaviour, not production code to copy wholesale. Recreate the markup in the app using
its own components and conventions.

**`motion/` is the exception. It is production code and you should use it as is.**

The page is about 30% markup and 70% imperative motion code. The prototype's whole logic class
(about 3,400 lines) has been extracted verbatim into `motion/private-credit.js` as
`PrivateCreditMotion`. Only four small blocks were changed, and each is marked `PORT SHIM`.
Every timing window, easing curve, colour, number and string in that file is exactly what the
reference runs.

Why it wasn't rewritten as a spec: these sequences are not transitions. They are pure functions
of scroll progress. They include 248 individually styled tiles, a canvas-drawn ring, a
spreadsheet whose cells recompute under stress, and seven screens that rebuild as you scroll. A
prose spec would lose fidelity, and a rebuild on Framer Motion or GSAP would lose the scroll
coupling that lets them scrub in both directions. Mount the module and spend your effort on the
markup around it.

### How to read `reference/Private Credit.dc.html`

* The markup between `<x-dc>` and `</x-dc>` is the layout, in inline styles. Read it as plain HTML.
* `ref="{{ name }}"` marks an element the motion module needs. **These names are the DOM
  contract**, and every one is listed in `ELEMENTS` in `motion/private-credit.js` and in
  `_inventory.json`. Keep them.
* The `class Component` at the bottom is the behaviour. It is already extracted to `motion/`.
* `reference/support.js` is the prototype runtime. Do not port it.
* The reference accepts two QA flags that the original does not: `?t=16` freezes the time loops
  and `?intro=off` skips the intro. The port accepts the same flags through `motion/react.js`.

## Fidelity

**High fidelity.** Colour, type, spacing, copy and motion are final. Recreate them pixel-accurately.
If a value here conflicts with the app's design system, the design system wins for *primitives*
(focus ring, base button radius) and this handoff wins for *composition* (section rhythm, type
scale, stage geometry).

All names, figures, funds and deals on the page are illustrative: Meridian Credit II, Northgate
Cold Chain, Ardyne Packaging and the rest. They are designed content, so set them verbatim. Do not
swap them for lorem or real client data.

## Design tokens

These are declared on `body` in the prototype. The motion module reads several of them as CSS
variables inside the DOM it builds, so **they must exist as CSS custom properties on `body`**,
not only as Tailwind theme values.

| Token | Value | Use |
| --- | --- | --- |
| `--a` accent | `#157F52` | passes, active nav, live tiles, accent dots. Written by the module from `options.accent`. |
| `--bad` | `#C4341E` | breach, `#REF!`, worsening |
| `--warn` | `#8A5A16` | watch, outstanding, in review, conditions |
| `--line` | `rgba(20,20,18,0.13)` | borders |
| `--line2` | `rgba(20,20,18,0.075)` | section dividers |
| `--mut` | `#6E6D67` | labels, mono captions |
| `--sec` | `#55544E` | secondary prose, nav |
| `--tex` | `1` | grid texture on/off. Written by the module from `options.gridTexture`. |
| ink | `#1A1917` | headings, primary |
| body ink | `#2C2B27` | table cells |
| emphasis ink | `#141412` | italic emphasised words in revealed titles |
| page | `#F6F5F2` | body background and intro overlay |
| window | `#FCFBF9` | faux-app window chrome |
| paper | `#F2EFE8` | servicing card stage, investors title bar |
| dark | `#0A0A0A` | delivery section |
| dark ink | `#F4F3F0` | delivery headings |

Accent is themeable. The prototype offers `#157F52`, `#1A5FB4`, `#8A4B2A` and `#1A1917`. Pass it
as `options.accent`, and the module writes `--a` and derives the "live" green
(`shade(accent, +0.10)`) itself.

Traffic lights in faux windows are `#FF5F57`, `#FEBC2E` and `#28C840`. The delivery gradient is
`linear-gradient(96deg,#A8C8E8 0%,#E9E4CF 26%,#F3C9A8 52%,#D9C3E8 76%,#AEC9DE 100%)`.

### Type

* **Instrument Sans** 400/500/600 + 400 italic, and **IBM Plex Mono** 400/500, self-hosted via
  **Fontsource**, which keeps the literal family names. The module sets
  `font-family:'IBM Plex Mono',ui-monospace,monospace` and draws canvas text with
  `"Instrument Sans"`. `next/font` renames families, so it cannot be the only loader, or the
  canvas text falls back to Helvetica. See `specs/00-foundation.md` → Fonts.
* Every heading is weight 400. Hierarchy comes from size, tracking and italics, never from bold.
* Numbers use `font-variant-numeric: tabular-nums`.
* Emphasis inside headlines is *italic*, set darker (`#141412`) against `rgba(20,20,18,0.74)`.

The full type scale is in `specs/00-foundation.md`.

## Animations

One module, eight systems, one clock. **Read `ANIMATIONS.md` before touching anything in
`motion/`.**

```jsx
// app/industries/private-credit/page.tsx
import { PrivateCreditMotionRoot } from "@/motion/react";
export default function Page() {
  return (
    <PrivateCreditMotionRoot options={{ accent: "#157F52" }}>
      <Intro /><Header /><Hero /><Reality /><CtaBand variant="audit" />
      <Platform /><Origination /><Servicing /><CtaBand variant="fit" />
      <Investors /><Delivery /><Footer />
    </PrivateCreditMotionRoot>
  );
}

// any section
"use client";
import { useBind } from "@/motion/react";
export function Hero() {
  const bind = useBind();
  return <canvas ref={bind("heroCv")} aria-hidden className="absolute inset-0 w-full h-full block" />;
}
```

## State

The page is presentational: no data fetching, forms or auth. All meaningful state (scroll
progress, active screen, beat, loop phase, intro completion) lives in the module and must never
reach React. Re-rendering on scroll is exactly what the module is built to avoid. The only
React-level state worth having is the theme accent, if the app has a theme switch.

Deep links: `#top`, `#reality`, `#platform`, `#origination`, `#servicing`, `#investors`,
`#delivery`. The hero's secondary CTA goes to `#platform`. Every "Book a platform review" CTA is
`mailto:hello@3264.ai` in the prototype, so confirm the real booking URL before launch.

## Responsive

The prototype is desktop-first. It has been checked at 1280, 1440 and 1920, and it works at 1024
with smaller stage type. **Nothing below 1024px has been designed.** See
`specs/09-responsive-a11y-perf.md` for known problems (the header nav wraps under about 1000px,
and stage text scales below legibility under about 900px) and for the interim gating rule.
Do not improvise mobile layouts for the pinned sections. Gate them and ask.

## Accessibility (summary)

* `prefers-reduced-motion`: the intro never plays and the "Continue scrolling" blip stops. The
  scroll sequences still follow scroll, because that is user-driven. See spec 09 for what else
  to add.
* The imperatively built stage content is decorative theatre over real headings. Mark stage
  hosts `aria-hidden` and put the argument in the real `h2`s, which already carry it.
* The intro can be dismissed by click and by any key, and it can never trap the page.

## Assets

In `assets/`:

| File | Size | Use |
| --- | --- | --- |
| `hero-wash.png` | 1344×752, 1.8MB | hero background, twice (sharp + blurred copy) |
| `valley-pastel.png` | — | backdrop of the §01 and §02 stages |
| `cta-valley.png` | — | both CTA bands |
| `routing-band.png` | 2160×639 | §05 background, `object-fit: fill` |
| `delivery-bg.webp` | 1920×5748 | §06 background, `object-fit: cover`, top |

Optimise them (AVIF/WebP, responsive sizes), but keep the crops and `object-position` values.
`hero-wash.png` is the heaviest thing above the fold, so give it priority.

## Files

```
design_handoff_private_credit/
├── README.md                 this overview
├── CLAUDE_CODE_PROMPT.md     kickoff + one prompt per phase
├── BUILD_PLAN.md             phases, file structure, gates, common failures
├── ANIMATIONS.md             every system: clock, windows, DOM contract, failure modes
├── VISUAL_QA.md              harness, flags, viewports, scrub captures, copy diff
├── CHECKLIST.md              final verification list
├── _inventory.json           DOM contract, method→section map, imperative copy strings
├── specs/
│   ├── 00-foundation.md      tokens, fonts, type scale, header, footer, CTA band, pinned-stage shell
│   ├── 01-hero.md
│   ├── 02-reality.md         §01 pinned
│   ├── 03-platform.md        §02 pinned
│   ├── 04-origination.md     §03 pinned
│   ├── 05-servicing.md       §04 loops
│   ├── 06-investors.md       §05 loop
│   ├── 07-delivery.md        §06 pinned, dark
│   ├── 08-intro.md
│   └── 09-responsive-a11y-perf.md
├── motion/
│   ├── private-credit.js     PrivateCreditMotion + ELEMENTS (production)
│   └── react.js              PrivateCreditMotionRoot + useBind (production)
├── qa/
│   ├── scrub-points.json     every scroll position to verify, with what must be on screen
│   ├── visual.spec.ts        static section diffs at 1280 / 1440 / 1920
│   ├── scrub.spec.ts         pinned-sequence captures, side-by-side PNGs
│   └── capture-reference.ts  renders the design baseline at every QA viewport
├── assets/
└── reference/                serve statically to view the prototype
    ├── Private Credit.dc.html
    ├── support.js
    └── assets/
```
