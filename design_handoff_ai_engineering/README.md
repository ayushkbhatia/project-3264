# Handoff: 3264.ai — AI Engineering

## Start here

1. Put this folder in the repo root as `/design_handoff_ai_engineering`.
2. Open `CLAUDE_CODE_PROMPT.md` and paste **Kickoff** into a fresh Claude Code session.
3. Run one phase per session, in order. Each phase has specs in `specs/` and a gate in `BUILD_PLAN.md`.
   Do not start the next phase until its gate passes.
4. Check every phase against the reference with `VISUAL_QA.md`. To view the reference, run
   `npx serve design_handoff_ai_engineering/reference -l 4200` and open
   `http://localhost:4200/AI%20Engineering.dc.html` (add `?intro=off` to skip the intro).

This README is the overview. The specs hold the detail. If anything disagrees, the reference HTML wins.

If the Home (`/design_handoff_home`) or Private Credit (`/design_handoff_private_credit`) pages are built,
reuse their tokens, fonts, Header and Footer. Differences are in `specs/00-foundation.md`.

## Overview

The AI Engineering service page. The argument: executives now build working software in an afternoon;
3264 audits it, rebuilds it and runs it to a regulated firm's standard. One long scroll with two
scroll-scrubbed pinned sequences, one time-based loop, and one dark canvas that holds the scroll until its
build finishes.

| # | Section | id | Kind | Clock |
| --- | --- | --- | --- | --- |
| — | Intro overlay ("Deploy log") | — | one-shot, skippable | timers, 4.8s |
| — | Header | — | sticky, 68px | — |
| — | Hero | `#top` | image + pointer-driven colour reveal | pointer |
| 01 | Premise: "Two things changed. One thing did not." | — | **pinned, 760vh**, 3 cards roll in | scroll |
| 02 | Audit: the two-week audit as a motion graphic | `#audit` | loop, 21.6s, starts in view | time |
| 03 | Rebuild: four tiers assemble | `#rebuild` | dark canvas, **scroll held until built** | scroll-fed + auto |
| 04 | Platform: sources → platform → stations | `#platform` | platform flies in from 03, then plays | scroll handoff, then time |
| 05 | Outcome: three outcomes fed by glass ducts | — | plays once reached | time |
| 06 | Engagement: two ways in | `#engagement` | **pinned, 400vh**, spine cards with a mini calendar and a platform snippet | scroll (+ idle motion) |
| — | Footer | — | static | — |

03, 04 and 05 are one continuous 1280×2980 dark canvas (`Rebuild Platform`), scaled to the 1280 max
container width. 03 is its own component (`Rebuild graphic`) mounted inside it.

Target: **Next.js (App Router) + React + TypeScript + Tailwind**, the same stack as Home and Private Credit.
Suggested route: `/ai-engineering`. The QA script assumes it.

## About the design files

Everything in `reference/` is a **design reference built in HTML**: a working prototype of the intended look
and behaviour, not production code to copy wholesale. Recreate the markup in the app with its own components
and conventions.

The page is roughly a third markup and two thirds imperative motion. The motion lives in three logic classes,
extracted verbatim into `motion/`:

| File | Drives |
| --- | --- |
| `motion/ai-engineering.logic.js` | intro, hero veil, 01 Premise, 02 Audit, 06 Engagement |
| `motion/rebuild-platform.logic.js` | the 03–05 canvas: scroll hold, platform flight, 04 and 05 scenes |
| `motion/rebuild-graphic.logic.js` | the 03 build (four tiers) |

**Port them as classes, do not rewrite them.** Each is already a React class component minus `render()`:
`this.props`, `this.state`, `setState`, `React.createRef()` and the normal lifecycle. Change
`extends DCLogic` to `extends React.Component`, add a `render()` that returns the section JSX built from
`reference/sections/*.html`, bind refs and values from `this.renderVals()`, and delete the dead code listed
at the top of each file. Every timing window, easing, colour, number and string then stays exactly as the
reference runs. The few required edits are the **PORT SHIMS** in `ANIMATIONS.md` §0.

Do not rebuild the sequences on Framer Motion or GSAP. They are pure functions of scroll position or elapsed
time and scrub both ways; a tween library loses that.

### Reading the reference

* `reference/AI Engineering.dc.html` is the page. The markup between `<x-dc>` and `</x-dc>` is the layout in
  inline styles. Read it as plain HTML. The same markup is split per section in `reference/sections/`.
* `ref="{{ name }}"` marks an element the logic needs. **These names are the DOM contract.** Keep them. They
  are listed per section in `_inventory.json`.
* Other `{{ name }}` holes are values from `renderVals()` (word arrays, audit findings, handlers).
  `<sc-for list="{{ xs }}" as="w">` is a loop over `xs`.
* `style-hover="…"` is a hover style. Port it to `hover:` classes.
* `<dc-import name="Rebuild Platform">` mounts `reference/Rebuild Platform.dc.html`, which mounts
  `Rebuild graphic.dc.html` with `bare`. Port each as its own client component.
* `reference/support.js` is the prototype runtime. Do not port it.

## Fidelity

**High fidelity.** Colour, type, spacing, copy and motion are final. If a value conflicts with the app's
design system, the design system wins for primitives (focus ring, base button radius) and this handoff wins
for composition (section rhythm, type scale, stage geometry).

Names, funds, figures and code on the page are illustrative content (Northgate Capital, Ashfield Pension
Trust, `postgres://admin:Nrthg8te!@prod-ledger`, the five audit findings). Set them verbatim.

## Design tokens

Declared on `body` in the prototype. Keep them as **CSS custom properties on `body`**: the markup and the
logic read `var(--a)` and friends.

| Token | Value | Use |
| --- | --- | --- |
| `--a` accent | `#157F52` | active states, "Keep", live dots, hovers. Written from `props.accent` by `applyTheme()` |
| `--bad` | `#C4341E` | "Rebuild", critical, issues |
| `--line` | `rgba(20,20,18,0.13)` | borders |
| `--line2` | `rgba(20,20,18,0.075)` | section hairlines |
| `--mut` | `#6E6D67` | labels, captions |
| `--sec` | `#55544E` | secondary prose, nav |
| `--tex` | `1` | grid texture flag (from `props.gridTexture`) |
| ink | `#1A1917` | headings, primary buttons |
| body ink | `#2C2B27` | labels on imagery, table text |
| page | `#F6F5F2` | body and intro overlay |
| window | `#FCFBF9` | faux app window chrome |
| dark | `#0A0A0A` | 03–05 canvas |
| dark ink | `#F4F3F0` | text on the dark canvas |
| highlight | `rgba(242,196,92,0.45)` | yellow text marks in app windows |
| green live | `#12A05C` | audit handover chips |

Accent is themeable (`#157F52`, `#1A5FB4`, `#8A4B2A`, `#1A1917`). Traffic lights `#FF5F57`, `#FEBC2E`,
`#28C840`. Pastel gradient (dark canvas, platform): `#A8C8E8 → #E9E4CF → #F3C9A8 → #D9C3E8 → #AEC9DE`.

Links: one global rule only, `a { color:inherit; text-decoration:none } a:hover { color:var(--a) }`. The
child components must not declare their own global link colours.

### Type

* **Instrument Sans** 400/500/600 + 400 italic and **IBM Plex Mono** 400/500 via **Fontsource**, so the family
  names stay literal. SVG scenes set `font-family="Instrument Sans, …"` / `"IBM Plex Mono, monospace"` as
  attributes, and `next/font` renames families, so it cannot be the only loader.
* Every heading is weight 400. Numbers use `font-variant-numeric: tabular-nums`.

Full scale in `specs/00-foundation.md`.

## Props

| Prop | Default | Effect |
| --- | --- | --- |
| `accent` | `#157F52` | writes `--a` |
| `gridTexture` | `true` | writes `--tex` |
| `motion` | `true` | `false`: word fills complete, hero veil and the 06 snippet hold still |
| `playIntro` | `true` | `false`: the intro never shows |

## State

Presentational page: no data fetching, forms or auth. All motion state (scroll progress, loop time, hold
state, intro completion) lives in the logic classes and must stay out of React, with one exception: the
audit finding index `auJ` (0–4), which re-renders the findings pane every 1.3s in the 02 loop.
`BUILD_PLAN.md` explains how to isolate it.

Deep links: `#top`, `#audit`, `#rebuild`, `#platform`, `#engagement`. The header "Book an audit", the hero
"Book an audit" and the footer "Book a call" go to `#engagement`; the hero "See the process" goes to
`#rebuild`. The two CTAs inside the Engagement cards ("Book an audit", "Book a call") are
`mailto:hello@3264.ai`. **Confirm the real booking URL before launch.**

## Responsive

Desktop-first. Checked at 1280, 1440, 1920; works at 1024. **Nothing below 1024px is designed.** See
`specs/08-responsive-a11y-perf.md` for known issues and the interim rule. Do not improvise mobile layouts for
the pinned sections. Gate them and ask.

## Accessibility (summary)

* `prefers-reduced-motion`: intro skipped, hero veil still, word fills complete, the 02 loop shows a static
  frame, the 06 calendar shows complete and its platform snippet holds still. The 03 scroll hold does **not**
  yet respect reduced motion: open item in spec 08.
* Stage graphics are decorative over real headings: `aria-hidden` on stage hosts.
* The intro dismisses on click and any key and can never trap the page.

## Assets

In `assets/` (also `reference/assets/`, so the reference runs offline):

| File | Use |
| --- | --- |
| `ai-engineering-hero.mp4` + its first frame as poster | hero video under the greyscale veil (in the app: `public/video/`, `public/img/ai-engineering/hero-poster.jpg`; `reference/assets/` has the mp4). Superseded `hero-plane.png`, kept here for the record |
| `what-changed-wash.png` | 01 card 1 |
| `what-produced-wash.webp` | 01 card 2 |
| `valley-pastel.png` | 01 card 3 and the 02 Audit tile |
| `delivery-bg.webp` | 03–05 dark canvas |
| `cta-d.avif` | 06 audit card |
| `cta-b.avif` | 06 build card |

Optimise them (AVIF/WebP, responsive sizes) but keep crops and positions. The hero poster is the LCP.

## Files

```
design_handoff_ai_engineering/
├── README.md                  this overview
├── CLAUDE_CODE_PROMPT.md      kickoff + one prompt per phase
├── BUILD_PLAN.md              structure, class port, phases, gates, common failures
├── ANIMATIONS.md              every motion system: clock, windows, DOM contract, port shims
├── VISUAL_QA.md               comparing port and reference
├── CHECKLIST.md               final verification list
├── _inventory.json            refs, holes and copy per section; method map with live/dead flags; assets
├── specs/
│   ├── 00-foundation.md       tokens, fonts, type scale, buttons, windows, pinned-stage pattern
│   ├── 01-intro.md
│   ├── 02-header-hero.md
│   ├── 03-premise.md          01, pinned
│   ├── 04-audit.md            02, loop
│   ├── 05-rebuild-platform-outcome.md   03–05, dark canvas
│   ├── 06-engagement.md       06, pinned, with snippets
│   ├── 07-footer.md
│   └── 08-responsive-a11y-perf.md
├── motion/                    verbatim logic classes (port source)
├── qa/
│   ├── scrub-points.json      positions to verify and what must show
│   └── visual.spec.ts         Playwright captures, reference vs port
├── assets/
└── reference/                 serve statically to view the prototype
    ├── AI Engineering.dc.html   (adds the ?intro=off QA flag; otherwise identical to the design file)
    ├── Rebuild Platform.dc.html
    ├── Rebuild graphic.dc.html
    ├── support.js
    ├── assets/
    └── sections/              verbatim markup per section
```
