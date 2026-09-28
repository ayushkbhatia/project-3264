# 00 · Foundation: tokens, type, layout, header, footer

## Fonts
- **Instrument Sans**: weights 400, 500, 600 and 400 italic. The page uses 400 and 500 only.
- **IBM Plex Mono**: 400 and 500 (dates in "Recently updated").
- Self-host with Fontsource (`@fontsource/instrument-sans`, `@fontsource/ibm-plex-mono`) and keep the family names exactly `"Instrument Sans"` and `"IBM Plex Mono"`. The prototype loads Google Fonts: `family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&family=IBM+Plex+Mono:wght@400;500`.
- Body stack: `"Instrument Sans","Helvetica Neue",Helvetica,sans-serif`. Mono stack: `'IBM Plex Mono', ui-monospace, monospace`.

## Global CSS (verbatim intent)
```css
html, body { margin:0; padding:0; overflow-x:clip; }
body {
  --a:#157F52; --bad:#C4341E; --line:rgba(20,20,18,0.13); --line2:rgba(20,20,18,0.075);
  --mut:#6E6D67; --sec:#55544E;
  background:#F6F5F2; color:#1A1917;
  font-family:"Instrument Sans","Helvetica Neue",Helvetica,sans-serif;
  -webkit-font-smoothing:antialiased; text-rendering:optimizeLegibility;
}
a { color:inherit; text-decoration:none; }
a:hover { color:var(--a); }
::selection { background:var(--a); color:#FFFFFF; }
```
Use `overflow-x: clip`, not `hidden`, so `position: sticky` keeps working.

## Colour tokens
| Name | Value | Where |
|---|---|---|
| paper | `#F6F5F2` | body |
| ink | `#1A1917` | text, dark buttons, active chip, section rules (1px) |
| sec | `#55544E` | nav links, blurbs, results label |
| mut | `#6E6D67` | carousel category, dates, footer headings, search icon |
| body-dark | `#2C2B27` | text on the pale washes (platform card, closing) |
| accent | `#157F52` | link hover, search focus border, subscribe button, status dot |
| accent-hover | `#0F6A43` | subscribe button hover |
| success-dot | `#6FCF97` | "You are on the list." dot on the red card |
| line | `rgba(20,20,18,0.13)` | chip, search, arrow, CTA and closing-tile borders; recent-row dividers |
| line2 | `rgba(20,20,18,0.075)` | header bottom border, footer dividers, closing section bottom border |
| hero-bg | `#0A0A0A` | hero behind the video |
| hero-fg | `#F4F3F0` | hero H1, light hero button background |
| slide-bg | `#EEECE7` | carousel slide card |
| tile-fallback | `#ECEAE5` (rows), `#E2DFD8` (carousel image) | behind images while loading |
| subscribe-card | `#B8321F` | fallback behind `subscribe-wash.png` |
| platform-card | `#E9C9B8` | fallback behind `platform-wash.png` |
| closing-tile | `#E8E2D2` | fallback behind `valley-pastel.png` |
| bad | `#C4341E` | declared, unused on this page |

## Type scale (all Instrument Sans unless noted)
| Role | Size | Weight | Letter-spacing | Line-height |
|---|---|---|---|---|
| Hero H1 | `clamp(34px, 4.2vw, 60px)` | 400 | -0.04em | 0.98 |
| Section H2 (category rows, Recently updated) | `clamp(32px, 3.2vw, 46px)` | 400 | -0.035em | 1.05 |
| Closing H2 | `clamp(32px, 3.6vw, 52px)` | 400 | -0.035em | 1.04 |
| Carousel title | `clamp(28px, 2.8vw, 40px)` | 400 | -0.034em | 1.06 |
| CTA card title | 24px | 400 | -0.025em | 1.2 |
| Tile title | 20px | 400 | -0.022em | 1.2 |
| Logo "3264.ai" | 19px | 500 | -0.03em | normal |
| Recent-row name | 18px | 400 | -0.02em | 1.25 |
| Closing body | 16.5px | 400 | normal | 1.6 |
| Carousel blurb, empty-state text | 16px | 400 | normal | 1.55 |
| Hero buttons, closing button | 15px | 500 | -0.01em | normal |
| Tile blurb, CTA body | 15px | 400 | normal | 1.55 |
| Subscribe input | 15px | 400 | normal | — |
| Subscribe button | 14.5px | 500 | normal | — |
| Footer links, platform link, recent note | 14.5px | 400 | -0.008em / -0.01em / normal | 1.5 |
| Nav links, section "How we work" links, results label, search input, carousel button | 14px | 400 (button 500) | -0.01em | — |
| Chips, header CTA | 13.5px | 400 | -0.01em | — |
| Carousel category, recent category, "Start" label | 13px | 400 | -0.005em | — |
| Footer bottom bar | 13px | 400 | -0.005em | — |
| Recent date (IBM Plex Mono) | 12px | 400 | normal | — |
| Footer column heading | 11px | 500 | 0.11em, uppercase | — |

`text-wrap: balance` on the H1, the carousel title and the closing H2. `text-wrap: pretty` on blurbs and body paragraphs.

## Layout
- One content container everywhere: `max-width: 1280px; margin: 0 auto`, inside section side padding of **40px**. At 1440 the content runs from x=80 to x=1360.
- Section vertical rhythm:

  | Section | Padding |
  |---|---|
  | Library bar | `64px 40px 0` |
  | Featured | `40px 0 0` (full-bleed track) |
  | Carousel controls row | `24px 40px 0` |
  | CTA cards | `56px 40px 0` |
  | Each category row | `96px 40px 0` |
  | Recently updated | `96px 40px 0` |
  | Results | `32px 40px 0`, `min-height: 44vh` |
  | Closing | `118px 40px` |
  | Footer | `70px 40px 40px` |

- The page uses **no media queries**. Everything reflows with `flex-wrap`, `auto-fit`/`auto-fill` grids, `clamp()` and `min()`. Keep that behaviour, and add breakpoints only where `specs/08` asks.

## Radii, borders and shadows
| Element | Radius | Border / shadow |
|---|---|---|
| Carousel slide | 22px | — |
| CTA cards, closing tile | 20px | closing tile: 1px `line` |
| Carousel image, category tile | 14px | — |
| Search input | 8px | 1px `line`; focus `#157F52` |
| Carousel button, subscribe form container | 8px / 10px | — |
| Subscribe button | 7px | — |
| Hero buttons, header CTA, closing button | 6px | header CTA: 1px `line` |
| Chips | 999px | 1px |
| Arrows | 50% | 1px `line` |
| Glass badge | 28% | 1px `rgba(255,255,255,0.72)`; shadow `inset 0 1px 0 rgba(255,255,255,0.85), 0 18px 40px -16px rgba(20,20,18,0.38)` |

## Header (sticky)
```
<header> position:sticky; top:0; z-index:100;
  backdrop-filter:blur(14px); background:rgba(246,245,242,0.78);
  border-bottom:1px solid rgba(20,20,18,0.075)
  inner: max-width:1280px; margin:0 auto; padding:0 40px; height:68px;
         display:flex; align-items:center; gap:48px
```
- Logo: `3264.ai`, 19px/500/-0.03em, links to `/`.
- Nav (`flex:1; display:flex; gap:30px; font-size:14px; color:#55544E`): AI Engineering · AI Transformation · Industries · Work · **Playbooks** (current page, `color:#1A1917`) · Company.
- Right CTA: "Book an audit". `display:flex; align-items:center; height:36px; padding:0 16px; border:1px solid rgba(20,20,18,0.13); border-radius:6px; background:#FFFFFF; font-size:13.5px; letter-spacing:-0.01em`. Hover: border and text `#157F52`. Links to `/ai-engineering#engagement`.
- The header is the site-wide component. If the codebase already has it, reuse it and set "Playbooks" as the active item.

## Footer
- Container `max-width:1280px`. Grid `repeat(auto-fit, minmax(168px, 1fr))`, five columns at desktop.
- Columns 2–5 have `border-left:1px solid rgba(20,20,18,0.075); padding:0 28px`. Column 1 has `padding:0 28px 0 0`.
- Column heading: 11px/500, `letter-spacing:0.11em`, uppercase, `#6E6D67`.
- Link list: `display:grid; gap:13px; margin-top:22px; font-size:14.5px; letter-spacing:-0.008em; color:#55544E`; hover `#157F52`.
- Columns and links (verbatim, with targets):
  - **Services:** AI Engineering (`/ai-engineering`), AI Transformation (`/ai-transformation`), Deployment & Run (`/#capabilities`), Evaluation suites (`/#capabilities`)
  - **Industries:** Private Credit (`/industries/private-credit`), Private Equity (`/industries/private-equity`), Fund Management (`/#industries`), Asset Management (`/#industries`)
  - **Company:** Who we are (`/company#who`), How we work (`/company#how`), Case studies (`/#work`)
  - **Resources:** Playbooks (`/playbooks`), Field notes (`/#playbooks`), Security (`/company#how`)
  - **Connect:** Book a call (`/ai-engineering#engagement`), hello@3264.ai (`mailto:`), LinkedIn (placeholder → `/ai-engineering#engagement`)
- Bottom bar: `margin-top:64px; padding-top:22px; border-top:1px solid rgba(20,20,18,0.075); display:flex; flex-wrap:wrap; gap:20px; justify-content:space-between; font-size:13px; color:#6E6D67`.
  - Left: "3264.ai" (15px/500/-0.03em, ink), then "© 2026 Bearing Deployment Company Inc. All rights reserved."
  - Right: a 6px `#157F52` dot and "All systems operational".

## Glass icon badge (shared component)
It is used on every playbook image: category tiles, results tiles and carousel images.
```
position:absolute; left:50%; top:50%; transform:translate(-50%,-50%);
height: 34% (tiles) | 30% (carousel); aspect-ratio:1/1; box-sizing:border-box;
display:flex; align-items:center; justify-content:center;
border-radius:28%;
background:rgba(250,249,246,0.62);
backdrop-filter:blur(18px) saturate(1.3); -webkit-backdrop-filter:blur(18px) saturate(1.3);
border:1px solid rgba(255,255,255,0.72);
box-shadow:inset 0 1px 0 rgba(255,255,255,0.85), 0 18px 40px -16px rgba(20,20,18,0.38);
pointer-events:none; aria-hidden="true"
svg: width:48%; height:48%; viewBox 0 0 48 48; fill none; stroke #1A1917; stroke-width 2; round caps and joins
```
The icons are in `icons/<slug>.svg`, with the stroke on `currentColor`. Set `color:#1A1917`.
