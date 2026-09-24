# 00 · Foundation

Tokens, fonts, global CSS, Header, Footer, CtaBand and the PinnedStage shell. Values are copied
from `reference/Private Credit.dc.html`, and that file wins if anything here disagrees.

## Fonts: the family names must be literal

The motion module writes `font-family:'IBM Plex Mono',ui-monospace,monospace` into inline
styles and sets canvas fonts like `'400 12px "Instrument Sans", "Helvetica Neue", Helvetica, sans-serif'`.
`next/font` renames families (`__Instrument_Sans_abc123`), so it **cannot** be the only loader.

Use Fontsource, which self-hosts the files and declares the real family names:

```bash
npm i @fontsource/instrument-sans @fontsource/ibm-plex-mono
```

```ts
// app/layout.tsx
import "@fontsource/instrument-sans/400.css";
import "@fontsource/instrument-sans/500.css";
import "@fontsource/instrument-sans/600.css";
import "@fontsource/instrument-sans/400-italic.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
```

Preload the two faces used above the fold (Instrument Sans 400 and 400 italic) with
`<link rel="preload" as="font" type="font/woff2" crossorigin>`. If the Home build already uses
`next/font`, keep it for Home and add Fontsource for this route. Two copies of Instrument Sans
on one route is a bug, so check the network panel.

Check it with `document.fonts.check('12px "IBM Plex Mono"')`, which must be `true` after load.

## globals.css

```css
html, body { margin: 0; padding: 0; overflow-x: clip; }   /* clip, NOT hidden: sticky needs it */
body {
  --a:#157F52; --bad:#C4341E; --warn:#8A5A16;
  --line:rgba(20,20,18,0.13); --line2:rgba(20,20,18,0.075);
  --mut:#6E6D67; --sec:#55544E; --tex:1;
  background:#F6F5F2; color:#1A1917;
  font-family:"Instrument Sans","Helvetica Neue",Helvetica,sans-serif;
  -webkit-font-smoothing:antialiased; text-rendering:optimizeLegibility;
}
a { color:inherit; text-decoration:none; }
a:hover { color:var(--a); }
::selection { background:var(--a); color:#FFFFFF; }
@keyframes pcBlip { 0%, 100% { opacity:1 } 50% { opacity:0.16 } }
@media (prefers-reduced-motion: reduce) { [data-blip] { animation:none !important } }
```

The module overwrites `--a` and `--tex` on `body` from its options, and that is expected. Do not
put `scroll-behavior: smooth` on `html`.

## Type scale

| Role | Size | Tracking | Leading | Notes |
| --- | --- | --- | --- | --- |
| Hero h1 | `clamp(30px,3.4vw,50px)` | −0.036em | 1.04 | pretty |
| Servicing h2 | `clamp(30px,3.1vw,44px)` | −0.032em | 1.06 | centred, max 760 |
| Delivery h2 | `clamp(26px,2.7vw,42px)` | −0.034em | 1.08 | balance, `#F4F3F0` |
| CTA band h2 | `clamp(21px,2.4vw,35px)` | −0.032em | 1.14 | nowrap, `#F7F5F0` |
| Investors h2 | `clamp(21px,2.3vw,34px)` | −0.032em | 1.1 | centred, max 820 |
| Pinned-section h2 | `clamp(19px,2.05vw,30px)` | −0.032em | 1.1 | max 860 |
| In-stage title (§01/§02) | `31px` (stage px) | −0.03em | 1.12 | text-shadow `0 1px 18px rgba(252,251,249,0.9)` |
| In-stage caption (§02) | `20px` (stage px) | −0.024em | 1.32 | same text-shadow |
| Equation band | `clamp(19px,1.9vw,27px)` | −0.018em | 1 | |
| Hero standfirst | `15.5px` | — | 1.55 | `--sec`, max 470 |
| Footer link | `14.5px` | −0.008em | — | `--sec` |
| Nav | `14px` | — | — | `--sec`; the active item is ink |
| Button | `13.5px` | −0.008 / −0.01em | — | weight 500 on the dark fill only |
| Breadcrumb / small | `13px` | −0.005em | — | |
| Footer column head | `11px` / 500 | 0.11em, uppercase | — | `--mut` |
| Mono eyebrow | `10.5px` Plex Mono | 0.14em, uppercase | — | CTA bands |

Weight is 400 everywhere except: the wordmark (500), the dark primary button (500), footer
column heads (500), the menubar "3264" (600) and the "A" glyph (600).

## Header

`position: sticky; top: 0; z-index: 100; backdrop-filter: blur(14px); background: rgba(246,245,242,0.78); border-bottom: 1px solid var(--line2)`.
Inner: `max-width: 1280px; margin: 0 auto; padding: 0 40px; height: 68px; display: flex; align-items: center; gap: 48px`.

* Wordmark `3264.ai` at 19px / 500 / −0.03em, linking to Home.
* Nav at 14px, `gap: 30px`, `flex: 1`, colour `--sec`. The items are AI Engineering, AI
  Transformation, **Industries** (active, `#1A1917`), Work, Playbooks and Company.
* Right: outlined "Book a platform review", `height: 36px; padding: 0 16px; border: 1px solid var(--line); border-radius: 6px; background: #FFFFFF; font-size: 13.5px; letter-spacing: -0.01em`.
  On hover, the border and text go to accent.

**Header height is load-bearing.** Every pin is `top: 68px` and every pin is
`height: calc(100vh − 68px)`, and `lpFitNow()` subtracts 68. If the header's height ever
changes, change all of these together.

## CtaBand (two variants)

The outer section is `padding: 56px 40px`, then `max-width: 1280px; margin: 0 auto`. The card is
`position: relative; overflow: hidden; border-radius: 20px; border: 1px solid rgba(20,20,18,0.2)`.

* Background: `cta-valley.png`, cover, `object-position: center 64%`.
* Scrim: `linear-gradient(92deg, rgba(14,20,14,0.84) 0%, rgba(14,20,14,0.66) 44%, rgba(14,20,14,0.4) 74%, rgba(14,20,14,0.28) 100%)`.
* Grid: `grid-template-columns: minmax(0,1fr) auto; column-gap: 40px; align-items: center; padding: 52px clamp(28px,3.6vw,48px)`.
  * Row 1, col 1: eyebrow, mono 10.5px, 0.14em, uppercase, `rgba(255,255,255,0.72)`.
  * Row 2, col 1: h2 (see scale), `margin-top: 14px`, **nowrap**.
  * Row 2, col 2: button `padding: 15px 24px; background: #FFFFFF; color: #0A0A0A; font-size: 14.5px; letter-spacing: -0.01em`, with **no radius** and "Book a platform review →", where the arrow is its own span with `gap: 9px`. Hover background is `#E9E4CF`.
  * Row 3, col 2: note right-aligned, 13.5px, `rgba(255,255,255,0.8)`, nowrap, `margin-top: 13px`.

| Variant | data-screen-label | Eyebrow | Headline | Note |
| --- | --- | --- | --- | --- |
| audit (after §01) | `CTA · audit (after 01)` | First step | Start with a 2-week workflows &amp; processes audit. | The process map is yours, whether we build or not |
| fit (after §04) | `CTA · fit (after 04)` | Think we’re a fit? | Scale the book without scaling the back office. | The process map is yours, whether we build or not |

## PinnedStage shell (§01, §02, §03)

```
section#id           padding: 40px 0 0; border-bottom: 1px solid var(--line2)
└ track   [ref]      position: relative; min-height: 600vh (§02: 700vh)
  └ pin   [ref]      position: sticky; top: 68px; height: calc(100vh - 68px);
                     min-height: min(680px, calc(100vh - 68px));
                     display: flex; flex-direction: column; align-items: center; justify-content: center;
                     gap: clamp(12px,2.2vh,26px); padding: clamp(14px,2.6vh,30px) 40px; box-sizing: border-box
    ├ head [ref]     flex: 0 0 auto; width: 100%; max-width: 1200px; text-align: center
    │ └ h2           margin: 0 auto; max-width: 860px; (pinned h2 scale); text-wrap: balance
    └ fit  [ref]     flex: 1 1 auto; min-height: 0; width: 100%; display: flex; align-items: center; justify-content: center
      └ wrap [ref]   position: relative; width: 100%; max-width: 1200px; aspect-ratio: 1200 / 780; max-height: 100%;
                     border-radius: 12px; overflow: hidden; box-shadow: 0 30px 90px rgba(20,20,18,0.20)
        └ stage [ref] position: absolute; left: 0; top: 0; width: 1200px; height: 780px; transform-origin: top left
```

§02 has one extra `<div style="position:relative">` between the section and the track. Keep it.

§03 differs: the head is **left-aligned** with `max-width: 1240px` and a `text-wrap: pretty`
h2; the wrap is `max-width: 1240px; aspect-ratio: 1240 / 700` with **no radius and no shadow**;
and the stage is 1240×700.

§06 uses its own shell (see spec 07).

The module writes `max-width` on `wrap` and `transform` on `stage`. Put their initial values
in inline styles or classes, but never with `!important`.

### Stage backdrop (§01 and §02)

Inside `stage`, in order:
1. `<img src=valley-pastel.png>`, inset 0, cover.
2. Wash: `linear-gradient(118deg, rgba(252,251,249,0.72), rgba(252,251,249,0.52) 52%, rgba(252,251,249,0.44) 100%), linear-gradient(180deg, rgba(255,255,255,0.34), rgba(20,20,18,0.05))`.
3. **MenuBar**, a faux OS bar: `left 0; top 0; right 0; height: 28px; z-index: 50; gap: 18px; padding: 0 14px; background: rgba(252,251,249,0.62); backdrop-filter: blur(18px); border-bottom: 1px solid rgba(20,20,18,0.10); font-size: 12.5px`.
   From the left: a 9px ink diamond (a square rotated 45°), "3264" at 600, then File, Edit,
   View, Window and Help at `rgba(20,20,18,0.66)`, a spacer, an "A" badge (19×15, radius 3, ink
   background, 10.5px/600), signal bars (2px wide, 3/5/8/11px tall), a battery, and in §01 also
   a search glyph and a menu glyph, then "Tue 9 Jan  9:41 AM". §02's bar omits the search and
   menu glyphs and the battery nub. Copy it exactly from the reference; the two differ.
4. **ScrollBlip** (`data-blip="1"`): `right: 44px; top: 62px; height: 35px; gap: 10px; animation: pcBlip 1.15s ease-in-out infinite`.
   A 19×28 mouse outline (1.6px, radius 10, `rgba(255,255,255,0.6)` fill), a 2×8 wheel, a
   chevron, and "Continue scrolling" at 14px / −0.012em.

### FauxWindow

Title bar `height: 32px` (the platform window is 34px), `gap: 8px; padding: 0 12px (13px); background: rgba(20,20,18,0.045) (0.04); border-bottom: 1px solid rgba(20,20,18,0.08)`,
with three 11px lights and the title centred absolutely at 11.5px. Body backgrounds, borders and
shadows vary per window, so see each spec.

## Footer

`padding: 70px 40px 40px`, max 1280. There are five columns in
`grid-template-columns: repeat(auto-fit, minmax(168px,1fr))`. Every column after the first has
`border-left: 1px solid var(--line2); padding: 0 28px`, and the first has `padding: 0 28px 0 0`.
The head is 11px/500/0.11em uppercase `--mut`, and the links are a grid with `gap: 13px`,
`margin-top: 22px`, 14.5px, `--sec`, hovering to accent.

| Services | Industries | Company | Resources | Connect |
| --- | --- | --- | --- | --- |
| AI Engineering | **Private Credit** (ink, `#top`) | Who we are | Playbooks | Book a review |
| AI Transformation | Asset Management | How we work | Field notes | hello@3264.ai |
| Platform build → `#platform` | Fund Management | Case studies | Security → `#servicing` | LinkedIn |
| Evaluation suites → `#servicing` | Banking | | | |

Bottom bar: `margin-top: 64px; padding-top: 22px; border-top: 1px solid var(--line2); font-size: 13px; color: var(--mut)`,
`space-between`, wrapping. On the left, the wordmark (15px/500, ink) and
"© 2026 Bearing Deployment Company Inc. All rights reserved." On the right, a 6px accent dot and
"All systems operational".

**Link targets to confirm before launch:** "Evaluation suites" and "Security" point at
`#servicing`, and LinkedIn is a `mailto:`. These are placeholders in the prototype.
