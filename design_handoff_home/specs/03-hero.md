# Spec 03 — Hero `#top`

Client component (it mounts HeroArt and Vignettes). Read `ANIMATIONS.md` §3 and §4 first.

## Layer stack (back to front)

The section is `position: relative; padding: 0 40px 118px; border-bottom: 1px solid var(--line2); overflow: hidden`.

1. **`artCv` canvas**, the painting. `position: absolute; left: 0; right: 0; top: 0; width: 100%; aspect-ratio: 1376 / 768;`
   `background: url(/img/hero-valley.png) no-repeat center top / cover;`
   `opacity: calc(var(--art) * 0.95);`
   mask `linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.55) 9%, #000 26%, #000 82%, transparent 100%)` (plus `-webkit-`);
   `pointer-events: none; aria-hidden`.
   The CSS background is the fallback when WebGL is unavailable. HeroArt draws over it.
2. **Scrim**: `absolute inset-0`,
   `linear-gradient(to bottom, rgba(246,245,242,0.86) 0%, rgba(246,245,242,0.30) 15%, rgba(246,245,242,0.10) 34%, rgba(246,245,242,0.06) 56%, rgba(246,245,242,0.34) 78%, rgba(246,245,242,0.86) 100%)`.
3. **GridTexture** hero variant (ref `heroTex`, not used by motion, but keep the name).
4. **Content column**: `position: relative; max-width: 1280px; margin: 0 auto; padding-top: 150px`.

The header is sticky *above* the hero, so the hero's top 68px sits under the blurred header.

## Content

Centred block, `max-width: 880px; margin: 0 auto; text-align: center`:
- h1 `Deployment is<br/>the deliverable.`, with a hard `<br>`. Never let it rewrap differently.
- p `margin: 30px auto 0; max-width: 620px`, hero standfirst:
  `3264 builds and runs AI systems inside banking, fund management and asset management firms. Scope is fixed before we start. You are billed for what reaches production.`
- CTA row `display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; margin-top: 38px`:
  Primary `Book a mapping session` → `#contact`; Secondary `How we charge` → `#model`.

## Cards

HairlineGrid `repeat(auto-fit, minmax(272px, 1fr))`, `margin-top: 112px`.
Card: `background: rgba(255,255,255,0.93); backdrop-filter: blur(3px); padding: 24px 26px 30px`.
- Vignette box (`vigA` / `vigB` / `vigC`, add `data-vig`): `height: 150px; margin-bottom: 26px`. Empty; the module fills it.
- Eyebrow (13px/--mut) · Title (`18px/-0.022em`, `margin-top: 9px`) · Body (`14.5px/1.5/--sec`, `margin-top: 11px`).

| Ref | Eyebrow | Title | Body |
| --- | --- | --- | --- |
| vigA | Engagement | Fixed scope, fixed price | Each capability is priced and signed off before build begins. Change is quoted, never quietly absorbed. |
| vigB | First release | Six weeks to production | A working release inside six weeks, then a release every fortnight against the agreed scope. |
| vigC | After launch | Accuracy held, not assumed | We keep the evaluation suite. Drift is caught and corrected before it reaches anyone downstream. |

## Motion wiring

```tsx
"use client";
const art = useMotionSystem(HeroArt, {});
const vig = useMotionSystem(Vignettes, {});
<canvas ref={art("artCv")} … />
<div ref={vig("vigA")} data-vig … />
```

Both honour `prefers-reduced-motion` internally. `?motion=off` must skip mounting both.

## Checks specific to the hero

- The painting's top edge fades under the header. There's no hard edge anywhere.
- Cards read as frosted white over the lower part of the painting. The painting should be
  faintly visible through them at the 0.93 alpha.
- At 1440 the cards' top edge sits roughly at the painting's 82% mask stop. If it's
  noticeably off, check the h1 `line-height: 1.0` and the 150/30/38/112 vertical stack.
