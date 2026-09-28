# Handoff: 3264.ai Playbooks library page

Route: `/playbooks` · Status: design approved for build · Reference: `reference/Playbooks.dc.html`

## Overview
The Playbooks page is the index of 3264.ai's nine automation playbooks for private credit, fund management and asset management teams. A visitor lands on a full-bleed video hero, can filter or search the library, browse a rolling carousel of six featured playbooks, subscribe to updates, jump to the Private Credit platform page, scan the nine playbooks in three category rows, see what changed recently, and book a two-week audit.

Each playbook links to its own long-form page. Only **Loan Ops Ledger** exists today (`/playbooks/loan-ops-ledger`, built from a separate handoff). The other eight link to placeholders until their pages exist.

## About the design files
The files in this bundle are **design references created in HTML**: prototypes that show the intended look and behaviour. They are not production code to copy. The task is to **recreate this page in the target codebase's environment** (the 3264.ai site is Next.js App Router + React + TypeScript + Tailwind, per the earlier Private Credit handoff), using its established patterns and components.

`reference/Playbooks.dc.html` runs on a small prototype runtime (`support.js`). Do not port the runtime. Read the markup between `<x-dc>` and `</x-dc>` as plain HTML with inline styles, and the `class Component` script at the bottom as the behaviour reference. Three prototype-only constructs need translating:

| Prototype construct | Production equivalent |
|---|---|
| `<sc-for list="{{ x }}">` / `<sc-if value="{{ x }}">` | `.map()` / conditional rendering |
| `<x-import component-from-global-scope="image-slot" …>` (drag-and-drop image placeholder) | a plain `<img>` / `next/image` with `object-fit: cover`, using the `src` given |
| `{{ pb.mark }}` (glass icon badge built with `React.createElement`) | a `<PlaybookBadge icon=… size="34%">` component rendering the SVG from `icons/` |

To view the reference: `npx serve design_handoff_playbooks/reference -l 4200`, then open `http://localhost:4200/Playbooks.dc.html`.

## Fidelity
**High fidelity.** Colours, type, spacing, radii, shadows, copy and motion are final. Recreate them exactly: 13.5px is not 14px, `-0.035em` is not `tracking-tight`, and `rgba(20,20,18,0.13)` is not a Tailwind grey. Use arbitrary values or theme tokens that hold the exact value. No heading is heavier than weight 400.

## Page map (top to bottom)
| # | Section | Anchor | Spec | Screenshot |
|---|---|---|---|---|
| 0 | Sticky header | — | `specs/00-foundation.md` | `screenshots/desktop-1440/01-hero.png` |
| 1 | Video hero | `#top` | `specs/01-hero.md` | `01-hero.png`, `hero-frames/*` |
| 2 | Library controls (filter chips + search) | `#library` | `specs/02-library-controls-and-results.md` | `02-library-carousel-slide-1.png` |
| 3 | Featured carousel (6 slides) | — | `specs/03-featured-carousel.md` | `02-…`, `03-carousel-slide-2.png` |
| 4 | Two CTA cards (subscribe · platform) | — | `specs/04-library-ctas.md` | `04-ctas.png`, `states/s04-subscribed.png` |
| 5 | Category rows ×3 (3 tiles each) | `#private-credit` `#fund-management` `#asset-management` | `specs/05-category-rows-and-tiles.md` | `05-…`, `06-…`, `07-…` |
| 6 | Recently updated | — | `specs/06-recently-updated.md` | `08-recently-updated.png` |
| 7 | Results (replaces 3–6 while filtering) | — | `specs/02-library-controls-and-results.md` | `states/s01–s03` |
| 8 | Closing CTA tile | — | `specs/07-closing-and-footer.md` | `09-closing.png` |
| 9 | Footer | — | `specs/07-closing-and-footer.md` | `10-footer.png` |

Sections 3–6 render only while **browsing** (category = All and empty search). Section 7 renders only while **filtering**.

## Read in this order
1. `README.md` (this file)
2. `BUILD_PLAN.md`: phases and gates
3. `specs/00-foundation.md`: tokens, type, layout, header, footer
4. `specs/01…07`: one per section
5. `MOTION.md`: every moving part, with timings, easing and reduced-motion rules
6. `specs/08-responsive-a11y-perf.md`
7. `CONTENT.md`: all copy verbatim, plus `data/playbooks.json`
8. `VISUAL_QA.md` and `CHECKLIST.md`
9. `CLAUDE_CODE_PROMPT.md`: the prompts to paste, one phase per session

## Design tokens (summary; full list in `specs/00-foundation.md`)
| Token | Value | Use |
|---|---|---|
| paper | `#F6F5F2` | page background |
| ink | `#1A1917` | text, dark buttons, active chip |
| sec | `#55544E` | secondary text, nav links |
| mut | `#6E6D67` | muted labels, dates |
| body-dark | `#2C2B27` | body copy on washes |
| accent | `#157F52` | link hover, focus ring, subscribe button, progress |
| accent-hover | `#0F6A43` | subscribe button hover |
| line | `rgba(20,20,18,0.13)` | borders, dividers |
| line2 | `rgba(20,20,18,0.075)` | hairlines (header, footer) |
| hero-bg | `#0A0A0A` | hero behind video |
| hero-fg | `#F4F3F0` | hero text, light button |
| slide-bg | `#EEECE7` | carousel slide |
| tile-bg | `#ECEAE5` / `#E2DFD8` | image tile fallback (rows / carousel) |
| Type | Instrument Sans 400/500 (+ 400 italic, 600 loaded); IBM Plex Mono 400/500 | |

## Assets (all in `reference/assets/`)
| File | Used for |
|---|---|
| `playbooks/<slug>.png` ×9 (1376×768) | category tiles and results tiles |
| `playbooks/feat-<slug>.png` ×6 (1376×768) | carousel images (Covenant Watch, NAV Pack Review, Mandate Guardrails, Capital Call Flow, Side-Letter Register, Research Intake) |
| `subscribe-wash.png` | subscribe card background |
| `platform-wash.png` | platform card background |
| `valley-pastel.png` | closing tile background |
| `icons/<slug>.svg` ×9 (this folder root) | glass-badge icons; 48×48 viewBox, 2px stroke, `currentColor` |
| Hero video (external) | `https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_074625_a81f018a-956b-43fb-9aee-4d1508e30e6a.mp4`: 1756×1176, 13.04 s, 24 fps, H.264, ~13.5 MB. Self-host it and pre-render the boomerang version (see `MOTION.md`). |

Convert the PNG washes to AVIF/WebP at build time. They are decorative, so use `alt=""`.

## Files in this bundle
```
README.md                 this file
BUILD_PLAN.md             phased build with gates
CLAUDE_CODE_PROMPT.md     prompts to paste into Claude Code
MOTION.md                 motion flows (hero ping-pong, carousel, hovers, reduced motion)
CONTENT.md                every string on the page, verbatim
CHECKLIST.md              acceptance checklist
VISUAL_QA.md              screenshot index + how to capture baselines
specs/00-foundation.md … specs/08-responsive-a11y-perf.md
motion/hero-video.ts      production hero controller (boomerang loop + eased turns)
motion/carousel.ts        production carousel controller (framework-agnostic)
data/playbooks.json       the nine playbooks, featured order, recent updates
icons/*.svg               nine playbook icons
qa/capture-reference.ts   Playwright script: baseline captures from the reference
screenshots/              PNG references (see VISUAL_QA.md)
reference/                Playbooks.dc.html + runtime + assets (source of truth)
```

## Open items for 3264
1. **Recently updated** rows are placeholder dates and notes. Replace them with real changelog entries, or drive them from a CMS.
2. **Links not yet live:** Fund Management and Asset Management "How we work" links point to `/#industries`. Eight of nine playbook links point to their category page until each detail page ships.
3. **Subscribe** has no backend. It shows the success state locally. Wire it to the email provider, and add loading and error states (specified in `specs/04-library-ctas.md`).
4. **Header** has no collapsed state below ~1000px (the nav wraps; see `screenshots/tablet-924/01-hero.png`). This is a site-wide header issue. Use the site's mobile menu if one exists; otherwise see `specs/08`.
5. **Carousel pause control:** WCAG 2.2.2 needs a way to pause auto-advancing content. See `specs/03` for the recommended control.
