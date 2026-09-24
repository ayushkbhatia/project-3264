# Spec 00 — Foundation

Everything shared across sections. Values are copied from the reference; do not round them.

## Tokens

```css
:root {
  --a: #157F52;                    /* accent. Alternates: #0E6E7A #2E4EC8 #A8501C */
  --ink: #1A1917;                  /* headings, primary text, dark buttons */
  --ink-2: #2C2B27;                /* hero standfirst, model values */
  --sec: #55544E;                  /* secondary prose, nav, footer links */
  --mut: #6E6D67;                  /* eyebrows, labels, captions */
  --list: #46453F;                 /* list items, case-study row labels */
  --page: #F6F5F2;
  --card: #FFFFFF;
  --line: rgba(20,20,18,0.13);     /* borders, table rules, grid gaps */
  --line2: rgba(20,20,18,0.075);   /* section dividers, inner rules */
  --tex: 1;                        /* grid texture on/off multiplier */
  --art: 1;                        /* hero painting on/off multiplier */
}
body {
  margin: 0; background: var(--page); color: var(--ink);
  font-family: "Instrument Sans", "Helvetica Neue", Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility;
}
html, body { overflow-x: hidden; }
a { color: inherit; text-decoration: none; }
a:hover { color: var(--a); }
::selection { background: var(--a); color: #FFFFFF; }
@keyframes m3264-mark { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
```

Expose these in `tailwind.config` under `colors` using the CSS variables (`a: "var(--a)"`, …)
so accent stays themeable.

## Font

Instrument Sans via `next/font/google`: weights 400, 500, 600; styles normal and italic.
`display: "swap"`, applied on `<html>`. Nothing on the page uses 600 or italic today, but the
reference loads them. Keep them loaded so later pages match.

## Type scale

| Role | Size | Weight | Tracking | Leading | Other |
| --- | --- | --- | --- | --- | --- |
| Hero h1 | `clamp(38px,4.9vw,76px)` | 400 | `-0.038em` | 1.0 | `text-wrap: balance` |
| Closing h2 | `clamp(34px,4.6vw,68px)` | 400 | `-0.038em` | 1.02 | balance, max-w 900 |
| Footer-image h2 | `clamp(30px,3.6vw,54px)` | 400 | `-0.034em` | 1.04 | white, balance |
| Section h2 | `clamp(30px,3.1vw,44px)` | 400 | `-0.032em` | 1.06 | margin-top 22px |
| Act h3 | `clamp(28px,2.6vw,38px)` | 400 | `-0.03em` | 1.06 | |
| Industry h3 | `clamp(24px,2.4vw,34px)` | 400 | `-0.03em` | normal | |
| Case h3 | `26px` | 400 | `-0.028em` | 1.2 | |
| Playbook title | `20px` | 400 | `-0.024em` | normal | |
| Hero card title | `18px` | 400 | `-0.022em` | normal | |
| Team role | `17px` | 400 | `-0.02em` | normal | |
| Hero standfirst | `19px` | 400 | — | 1.55 | `--ink-2`, max-w 620 |
| Section standfirst | `16.5px` | 400 | — | 1.6 | `--sec`, max-w 560 (400 in Model/Playbooks left col) |
| Closing standfirst | `17px` | 400 | — | 1.6 | max-w 480 |
| Model value | `17px` | 400 | — | 1.5 | `--ink-2` |
| Eyebrow | `13px` | 400 | `-0.005em` | normal | `--mut` |
| Nav | `14px` | 400 | — | — | `--sec` |
| Footer head | `11px` | 500 | `0.11em` | — | uppercase, `--mut` |
| Footer link | `14.5px` | 400 | `-0.008em` | — | `--sec`, hover accent |
| Rail label / stage caption | `12.5px` / `12px` | 400 | `0.05em` | — | uppercase |
| Placeholder note | `13.5px` | 400 | — | 1.6 | `--mut` |

`text-wrap: pretty` on every paragraph. `font-variant-numeric: tabular-nums` on all figures.

## Layout constants

- Content column: `max-width: 1280px; margin: 0 auto;` with `40px` horizontal padding on the
  section (not the column).
- Standard section: `padding: 130px 40px; border-bottom: 1px solid var(--line2);`
  Exceptions: Capabilities `130px 0 0`; Stack `74px 40px`; Closing CTA `150px 40px 160px`;
  Hero `0 40px 118px`; Footer image `0 40px`; Footer `70px 40px 40px`.

## Primitives

**Eyebrow** — `13px / -0.005em / --mut`. Format `NN / Name` with spaces around the slash.

**SectionHeader** — flex, `gap: 72px`, `flex-wrap: wrap`, `align-items: flex-end`.
Left `flex: 1 1 280px; min-width: 0` holds Eyebrow + h2 (h2 `margin-top: 22px`).
Right is the standfirst `p`, `flex: 2 1 480px; min-width: 0; margin: 0; max-width: 560px`.
Used by Capabilities, Industries, Work, Team. Model and Playbooks use a variant: no
`align-items: flex-end`, the standfirst (if any) sits under the h2 in the left column, and the
right column is `flex: 2 1 540px`.

**HairlineGrid** — `display: grid; gap: 1px; background: var(--line); border: 1px solid var(--line);`
Children carry their own background (`#FFF`, or `rgba(255,255,255,0.93)` + `backdrop-filter: blur(3px)` in the hero).

**GridTexture** — decorative, `aria-hidden`, `pointer-events: none`, `position: absolute; inset: 0`.
- *Hero variant*: `opacity: calc(var(--tex) * 0.34)`;
  `background-image: linear-gradient(to right, rgba(20,20,18,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(20,20,18,0.05) 1px, transparent 1px)`;
  `background-size: calc(100% / 32) 68px`;
  mask `linear-gradient(to bottom, #000 0%, rgba(0,0,0,0.35) 46%, transparent 88%)`.
- *Closing variant*: `opacity: calc(var(--tex) * 0.4)`; vertical lines only
  (`linear-gradient(to right, rgba(20,20,18,0.07) 1px, transparent 1px)`),
  `background-size: calc(100% / 32) 100%`; mask `linear-gradient(to top, #000 0%, transparent 80%)`.
Always set both `mask-image` and `-webkit-mask-image`.

**Buttons** (all `border-radius: 6px`, `letter-spacing: -0.01em`, `display: flex; align-items: center`)
| Variant | Height | Padding | Size/weight | Colours | Hover |
| --- | --- | --- | --- | --- | --- |
| Header outline | 36 | `0 16px` | 13.5 / 400 | white bg, `--line` border | border + text accent |
| Primary | 46 | `0 24px` | 15 / 500 | `#1A1917` bg, white text | bg accent |
| Primary large (closing) | 50 | `0 28px` | 15.5 / 500 | same | bg accent |
| Secondary | 46 | `0 24px` | 15 / 400 | white bg, `--line` border | border accent |
| On-image (footer image) | 46 | `0 24px` | 15 / 500 | white bg, `#1A1917` text | bg `#D8D6D1` |
Add a visible `:focus-visible` ring (2px accent, 2px offset). The reference lacks one.

## Header

`position: sticky; top: 0; z-index: 100; backdrop-filter: blur(14px); background: rgba(246,245,242,0.78); border-bottom: 1px solid var(--line2)`.
Inner: column, `height: 68px`, flex, `align-items: center`, `gap: 48px`.
- Wordmark `3264.ai` — `19px / 500 / -0.03em`, links to `#top`.
- Nav — `flex: 1`, `gap: 30px`, `14px`, `--sec`. Items in order: AI Engineering, AI
  Transformation, Industries (`#industries`), Work (`#work`), Playbooks (`#playbooks`), Company.
- "Book a call" header outline button → `#contact`.

## Footer image

Section `padding: 0 40px; border-top: 1px solid var(--line2)`. Column gets `padding-top: 96px`.
Frame: `position: relative; aspect-ratio: 1672 / 941; border: 1px solid var(--line2); overflow: hidden`.
- `<img footer-nocturne>` cover, centred. `alt=""`.
- Scrim, full size: `linear-gradient(to right, rgba(10,14,32,0.74) 0%, rgba(10,14,32,0.66) 62%, rgba(10,14,32,0.16) 88%, rgba(10,14,32,0) 100%)`.
- Wordmark top-left, white, `19px/500/-0.03em`, padding `clamp(22px,3.4%,38px) clamp(28px,5%,80px)`.
- Copy block: absolute, `top: 50%; transform: translateY(-50%)`, padding `0 clamp(28px,5%,80px)`,
  `max-width: min(560px, 62%)`. h2 "Win the next decade." then on-image button "Book a call",
  `margin-top: 28px`, `display: inline-flex`.
Below the frame: flex, space-between, baseline, `gap: 24px`, `margin-top: 16px`:
`AI software deployment for asset-heavy and document-heavy firms.` (14.5/1.55/--mut, max-w 620)
and `32 → 64` (13px eyebrow style).

## Footer

`padding: 70px 40px 40px`. Grid `repeat(auto-fit, minmax(168px, 1fr))`, five columns.
Column 1 padding `0 28px 0 0`; columns 2–5 `border-left: 1px solid var(--line2); padding: 0 28px`.
Each column: head (footer head style), then link list `display: grid; gap: 13px; margin-top: 22px`.

| Services | Industries | Company | Resources | Connect |
| --- | --- | --- | --- | --- |
| AI Engineering | Private Credit | Who we are | Playbooks | Book a call |
| AI Transformation | Financial Services | How we work | Field notes | hello@3264.ai (mailto) |
| Deployment & Run | Fund Management | Case studies | Security | LinkedIn |
| Evaluation suites | Asset Management | | | |

Bottom bar: `margin-top: 64px; padding-top: 22px; border-top: 1px solid var(--line2)`,
flex space-between, wrap, `gap: 20px`, 13px/--mut.
Left (gap 11): wordmark `15px/500/-0.03em/--ink`, then `© 2026 Bearing Deployment Company Inc. All rights reserved.`
Right: 6px accent dot, gap 7, `All systems operational`.

Link targets for pages not yet built: point to their future routes (`/ai-engineering`,
`/ai-transformation`, `/industries/private-credit`, `/company`, `/company#who`, `/company#how`)
and leave them as 404s until those pages ship.
