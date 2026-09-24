# Handoff: 3264.ai — Home

## Start here

1. Drop this folder into the repo root as `/design_handoff_home`.
2. Open `CLAUDE_CODE_PROMPT.md` and paste **Kickoff** into a fresh Claude Code session.
3. Then run one phase per session, in order, using the prompts in that file. Each phase has a
   spec in `specs/` and a gate in `BUILD_PLAN.md`; do not advance until the gate passes.
4. Verify every phase with `VISUAL_QA.md` against the reference. To view the reference, run
   `npx serve design_handoff_home/reference` and open `3264 Home.dc.html`. It's self-contained, with assets included.

This README is the overview. The specs are the detail. Where they differ, the reference HTML wins.

## Overview

The marketing home page for 3264.ai, a firm that builds and runs AI systems inside banking,
fund management and asset management clients. One long scrolling page: hero, engagement model,
a three-act pinned scroll sequence for capabilities, industries, case studies, stack logos,
team, playbooks, closing CTA, footer.

Target: **Next.js (App Router) + React + Tailwind**.

## About the design files

Everything in `reference/` is a **design reference created in HTML** — a prototype showing
intended look and behaviour. It is not production code to copy wholesale. The task is to
recreate it in the app using its established patterns, components and conventions.

One deliberate exception: **`motion/` is real code, meant to be used**. See "Animations" below.

`reference/3264 Home.dc.html` is a single-file prototype built on a small in-house runtime
(`reference/support.js`) that renders an HTML template with `{{ }}` holes against a logic
class. You do not need to understand or port that runtime. Read the file as two things:

* the markup between `<x-dc>` and `</x-dc>` — the layout, in inline styles
* the `class Component` at the bottom — the behaviour, already extracted for you into `motion/`

`ref="{{ someName }}"` in the markup marks an element the motion code needs to reach. Those
names are exactly the element keys the motion modules expect, so they are the contract between
markup and behaviour. Keep them.

## Fidelity

**High-fidelity.** Colours, type, spacing and motion are final. Recreate pixel-accurately
using the app's existing primitives. Where a value below conflicts with your design system,
the design system wins for *primitives* (button radius, focus ring) and this document wins for
*composition* (section rhythm, type scale, the 32-column grid texture).

Content is not final. Two blocks are explicitly placeholder and say so on the page:

* case-study figures under "Selected engagements"
* team names, portraits and biographies

Keep those disclaimers until real content lands. Portrait placeholders are a 45° hatch.

## Design tokens

Declared on `body` in the prototype as CSS custom properties. Map to Tailwind theme values.

| Token | Value | Use |
| --- | --- | --- |
| `--a` accent | `#157F52` | links on hover, act markers, positive figures, status dot |
| ink | `#1A1917` | headings, primary text, dark buttons |
| body ink | `#2C2B27` | hero standfirst, model table right column |
| `--sec` | `#55544E` | secondary prose |
| `--mut` | `#6E6D67` | labels, eyebrows, captions |
| list ink | `#46453F` | list items inside the act panels |
| page | `#F6F5F2` | background |
| card | `#FFFFFF` | cards, stage; `rgba(255,255,255,0.93)` for the three hero cards |
| `--line` | `rgba(20,20,18,0.13)` | borders, table rules, grid gaps |
| `--line2` | `rgba(20,20,18,0.075)` | section dividers, inner rules |
| footer scrim | `rgba(10,14,32,0.74)` → transparent | left-to-right over the footer image |

Accent is themeable — the prototype ships alternates `#0E6E7A`, `#2E4EC8`, `#A8501C`. If the
app has a theme switch, wire accent through it; the motion modules take `accent` as an option.

### Type

**Instrument Sans** (Google Fonts, weights 400/500/600 + 400 italic). Load via
`next/font/google` so it is self-hosted and preloaded.

| Role | Size | Weight | Tracking | Leading |
| --- | --- | --- | --- | --- |
| Hero h1 | `clamp(38px, 4.9vw, 76px)` | 400 | `-0.038em` | 1.0 |
| Closing h2 | `clamp(34px, 4.6vw, 68px)` | 400 | `-0.038em` | 1.02 |
| Section h2 | `clamp(30px, 3.1vw, 44px)` | 400 | `-0.032em` | 1.06 |
| Act h3 | `clamp(28px, 2.6vw, 38px)` | 400 | `-0.03em` | 1.06 |
| Industry h3 | `clamp(24px, 2.4vw, 34px)` | 400 | `-0.03em` | — |
| Case-study h3 | `26px` | 400 | `-0.028em` | 1.2 |
| Hero standfirst | `19px` | 400 | — | 1.55 |
| Section standfirst | `16.5px` | 400 | — | 1.6 |
| Body / table | `17px` | 400 | — | 1.5 |
| Card body | `14.5–15.5px` | 400 | — | 1.5–1.58 |
| Eyebrow (`01 / The model`) | `13px` | 400 | `-0.005em` | — |
| Footer column head | `11px` | 500 | `0.11em`, uppercase | — |
| Act rail label | `12.5px` | 400 | `0.05em`, uppercase | — |

Everything is weight 400 except buttons, the wordmark and footer column heads (500). **No bold
headings anywhere** — the page gets its hierarchy from size and tracking. Numeric figures use
`font-variant-numeric: tabular-nums`.

### Layout

* Content column `max-width: 1280px`, `padding: 0 40px`, centred.
* Standard section padding `130px 40px`, with a `1px solid var(--line2)` bottom border.
* Two-column section header: eyebrow + h2 in a `flex: 1 1 280px` column, standfirst in
  `flex: 2 1 480px`, `gap: 72px`, `flex-wrap: wrap`.
* Card grids use `1px` gaps over a `var(--line)` background with a `1px` outer border, so the
  rules read as a single hairline table rather than as gutters. Reproduce exactly — Tailwind
  `divide-*` will not give the same result at the outer edge.
* Grid texture overlay: `linear-gradient` 1px lines at `calc(100% / 32)` horizontally and
  `68px` vertically, masked to fade out, `opacity: 0.34`. Appears in the hero and closing CTA.
  This is the page's 32-column signature. Keep the 32 divisions.

## Sections

In document order. Copy is final unless marked placeholder — set it verbatim.

1. **Header** — sticky, `height: 68px`, `backdrop-filter: blur(14px)` over
   `rgba(246,245,242,0.78)`, bottom hairline. Wordmark `3264.ai` at 19px/500. Nav at 14px:
   AI Engineering, AI Transformation, Industries, Work, Playbooks, Company. Right: outlined
   "Book a call", `36px` tall, `6px` radius, hover borders and colours to accent.

2. **Hero** (`#top`) — centred, `880px` max, `150px` top padding. H1 "Deployment is / the
   deliverable." with a hard break. Standfirst, then two CTAs (dark fill "Book a mapping
   session", outlined "How we charge"), `46px` tall. Behind: the displaced painting canvas
   (see Animations), a top-to-bottom page-colour scrim, and the grid texture. Below, at
   `112px`: three cards, each a `150px` vignette, an eyebrow, an 18px title and body.
   Cards are `rgba(255,255,255,0.93)` with `backdrop-filter: blur(3px)`.

3. **Engagement model** (`#model`) — eyebrow `01 / The model`. Four-row table: Scope, Price,
   Proof, Exit. Label column `flex: 1 1 180px` at 15px muted; value column `flex: 3 1 340px`
   at 17px. Rows separated by `var(--line)`, last row closed with a bottom border.

4. **Capabilities** (`#capabilities`) — the set piece. Section header, then a `420vh` scroll
   track containing a `100vh` sticky pane. Inside, a two-column grid
   (`minmax(0,0.86fr) minmax(0,1.14fr)`, `gap: 56px`): left is a three-tab rail (Assess /
   Build / Run, clickable) above three absolutely-stacked text panels; right is the stage — a
   white bordered box holding a canvas, a projected-label layer, three imperatively-built
   panels, a tooltip, and a caption/counter footer. Fully specified in `ANIMATIONS.md`.

5. **Industries** (`#industries`) — four full-width rows R1–R4 (Private Credit, Financial
   Services, Fund Management, Asset Management). Each row: code + h3 in `flex: 1 1 260px`,
   description in `flex: 2 1 360px`, `→` pushed right. Whole row is a link; hover moves the
   top border to accent. R1 links to the Private Credit page; R2–R4 are not built yet.

6. **Selected engagements** (`#work`) — two cards in a hairline grid. Each: sector eyebrow,
   26px title, body, then three label/value rows. Values right-aligned, tabular; the third
   value in each card is accent-coloured. **Figures are placeholder** — keep the note beneath.

7. **Stack** — "Built on" over a `repeat(5, minmax(0,1fr))` grid of nine logos, `50px` tall,
   `object-fit: contain`, `opacity: 0.78`. Note the prototype's grid has trailing empty cells;
   render only the nine.

8. **Team** (`#company`) — four portrait placeholders at `4/5` aspect with a 45° hatch, each
   with a role and a discipline. **All placeholder** — keep the note. Note the standalone
   Company page (not in this handoff) now carries the real founder content; when it ships,
   this block likely becomes a link to it rather than a duplicate.

9. **Playbooks** (`#playbooks`) — three stacked link rows, each a small eyebrow over a 20px
   title. Hover moves the border to accent.

10. **Closing CTA** (`#contact`) — `150px 40px 160px`, grid texture behind, large h2, standfirst
    and a dark CTA sharing a wrapping flex row aligned to `flex-end`.

11. **Footer image** — `1672/941` image with a left-to-right navy scrim, wordmark top-left,
    h2 "Win the next decade." and a white CTA at the vertical centre, capped at `min(560px, 62%)`.
    Beneath, a positioning line and `32 → 64`.

12. **Footer** — five columns (Services, Industries, Company, Resources, Connect) in
    `repeat(auto-fit, minmax(168px,1fr))`, divided by left hairlines. Bottom bar: wordmark,
    `© 2026 Bearing Deployment Company Inc. All rights reserved.`, and an accent status dot
    with "All systems operational".

## Animations

Four independent systems, extracted as drop-in ES modules in `motion/`. **Read
`ANIMATIONS.md` before touching them** — it documents each system's clock, DOM contract and
failure modes.

| Module | What it drives | Clock |
| --- | --- | --- |
| `intro-relief.js` | Load-time wordmark relief overlay | One-shot rAF, ~4s, skippable |
| `platform-sequence.js` | The three-act capabilities sequence | Scroll position |
| `vignettes.js` | Three looping SVG micro-diagrams in the hero cards | Staggered timers + IO |
| `hero-art.js` | Scroll-displaced hero painting | Scroll position, dirty-flagged |

They are plain classes: `new System(elementMap, options)`, then `start()`, then `destroy()`.
No React inside them. `motion/react.js` provides `useMotionSystem`, the only React-aware file.

```jsx
"use client";
import { PlatformSequence, useMotionSystem } from "@/motion/react";

export function Capabilities({ accent = "#157F52" }) {
  const bind = useMotionSystem(PlatformSequence, { accent });
  return (
    <div ref={bind("phTrack")} className="relative h-[420vh] mt-14">
      <div ref={bind("phPin")} className="sticky top-0 h-screen flex items-center overflow-hidden">
        {/* … */}
      </div>
    </div>
  );
}
```

Why extracted rather than described: these are not transitions. They are per-frame numeric
systems — a bitmap sampled into a WebGL relief, a scroll-derived three-act state machine with
projected DOM labels, a dirty-flagged texture displacement. A prose spec of any of them loses
the fidelity, and rebuilding them on a motion library loses the scroll coupling that makes
them scrubbable. Mount the modules and spend your effort on the markup.

## State

The page is presentational. No data fetching, no forms, no auth. All meaningful state lives
inside the motion modules (scroll progress, act index, hover target, intro completion) and
none of it needs to reach React. Do not lift it into state — re-rendering on scroll is exactly
what these modules are built to avoid.

The only React-level state worth having is theme accent, if the app has a theme.

Deep links: `#top`, `#model`, `#capabilities`, `#industries`, `#work`, `#company`,
`#playbooks`, `#contact`. Outbound page links: AI Engineering, AI Transformation, Private
Credit, Company — route as those pages land.

## Responsive

The prototype is desktop-first and its breakpoints are almost all intrinsic — `flex-wrap` plus
`flex-basis`, and `auto-fit` grids, so sections collapse without media queries. Two places
need real decisions on mobile, neither resolved in the prototype:

* **The capabilities sequence.** From 768 to 940px, the module switches itself to a single
  column. Below 768px, don't mount it; render the three acts as static stacked blocks
  (`specs/04-capabilities.md`). Gate the mount; don't try to restyle the pinned version.
* **The hero canvas.** Fine on mobile, but the texture is the largest asset on the page. Serve
  a smaller source below ~768px, or skip `hero-art.js` and let the `<img>` stand.

Everything else: confirm the header nav collapses to a menu (not designed — ask), and that the
five-column footer reflows to two.

## Accessibility

* `prefers-reduced-motion` is honoured by all four modules and must stay honoured. Intro skips
  entirely; vignettes build once and do not cycle; the scroll systems still track scroll (that
  is user-driven, not autoplay) but stop their idle animation.
* The intro overlay is dismissable by click and by any keypress, and tears itself down on a
  timeout even if its own completion callback never fires. Do not make it modal or blocking.
* Contrast: muted `#6E6D67` on `#F6F5F2` is ~4.6:1 — fine for the 13px labels it is used on,
  but do not push it lighter or onto white cards at smaller sizes.
* Industry and playbook rows are whole-row links; give them a visible focus ring, which the
  prototype lacks.
* The hero canvas and texture overlays are decorative: `aria-hidden`, `pointer-events: none`.

## Assets

In `assets/`, all already in the project:

* `hero-valley.png` — hero painting, used both as the canvas texture and as the CSS fallback
  background on the same element. Optimise but keep it a single source for both.
* `footer-nocturne.png` — footer image, `1672/941`.
* `logos/` — nine stack logos: anthropic, openai, aws, vercel, supabase, langchain, langgraph,
  n8n, brand4 (Cursor — filename is wrong, the alt text is right).

All are the client's own or vendor marks used as stack attribution. Confirm mark-usage rights
before launch; several of these vendors have brand guidelines about logo use on marketing
pages.

## Files

```
design_handoff_home/
├── README.md                     this document — overview
├── CLAUDE_CODE_PROMPT.md         kickoff + one prompt per phase, paste into Claude Code
├── BUILD_PLAN.md                 phases, target file structure, per-phase gates, common failures
├── VISUAL_QA.md                  Playwright side-by-side harness, scrub captures, copy diff
├── specs/
│   ├── 00-foundation.md          tokens, type scale, primitives, header, footer image, footer
│   ├── 02-static-sections.md     model, industries, work, stack, team, playbooks, closing CTA
│   ├── 03-hero.md                hero layers, cards, HeroArt + Vignettes wiring
│   ├── 04-capabilities.md        pinned sequence DOM contract + mobile fallback
│   ├── 05-intro.md               intro overlay contract
│   └── 06-responsive-a11y-perf.md
├── ANIMATIONS.md                 per-system motion spec — read before porting motion/
├── CHECKLIST.md                  verification list for the finished port
├── motion/
│   ├── react.js                  useMotionSystem hook + re-exports (the only React file)
│   ├── three-loader.js           lazy three.js resolver — repoint at npm
│   ├── intro-relief.js           IntroRelief
│   ├── platform-sequence.js      PlatformSequence
│   ├── vignettes.js              Vignettes
│   └── hero-art.js               HeroArt
├── assets/
│   ├── hero-valley.png
│   ├── footer-nocturne.png
│   └── logos/*.png
└── reference/                    serve this folder statically to view the prototype
    ├── 3264 Home.dc.html         the prototype — source of truth for layout and copy
    ├── support.js                prototype runtime, for reference only — do not port
    ├── assets/                   copies so the reference renders standalone
    └── logos/
```

## Build order

See `BUILD_PLAN.md`. In short: foundation → static sections → hero → capabilities → intro → hardening.
