# 01 · Hero (`#top`)

## Markup

`section#top[data-screen-label="Hero"]`: `position: relative; padding: 0 40px 38px; border-bottom: 1px solid var(--line2); overflow: hidden`.

### Background layers (all `pointer-events: none`, `aria-hidden`)

1. A wrapper `absolute inset 0; overflow hidden` containing:
   * `hero-wash.png`, sharp: `inset 0; 100%×100%; cover; object-position: left center`, with
     `mask-image: linear-gradient(101deg, #000 0%, rgba(0,0,0,0.92) 32%, rgba(0,0,0,0.4) 56%, rgba(0,0,0,0) 76%)`
     (plus the `-webkit-` prefix).
   * `hero-wash.png`, blurred: `inset: -30px; width/height: calc(100% + 60px); cover; left center; filter: blur(26px); opacity: 0.62`,
     with `mask-image: linear-gradient(101deg, rgba(0,0,0,0) 34%, rgba(0,0,0,0.75) 62%, rgba(0,0,0,0.4) 86%, rgba(0,0,0,0.2) 100%)`.
   * Horizontal scrim: `linear-gradient(101deg, rgba(252,251,249,0.56) 0%, rgba(252,251,249,0.62) 40%, rgba(252,251,249,0.8) 66%, rgba(252,251,249,0.9) 100%)`.
   * Vertical scrim: `linear-gradient(180deg, rgba(252,251,249,0.28) 0%, rgba(252,251,249,0) 34%, rgba(252,251,249,0.52) 84%, rgba(252,251,249,0.92) 100%)`.
2. **GridTexture**: `absolute inset 0; opacity: calc(var(--tex) * 0.34)`,
   `background-image: linear-gradient(to right, rgba(20,20,18,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(20,20,18,0.05) 1px, transparent 1px)`,
   `background-size: calc(100% / 32) 68px`, masked `linear-gradient(to bottom, #000 0%, rgba(0,0,0,0.4) 52%, transparent 92%)`.
   Keep the 32 columns.

Both `<img>`s point at the same file. Use one optimised source (`next/image` with `priority`,
`sizes="100vw"`) for both, and don't ship two sizes.

### Content: `position: relative; max-width: 1280px; margin: 0 auto; padding: 34px 0 0`

* **Breadcrumb** (flex, `gap: 14px`, 13px, `--sec`): "Industries" (link to Home `#industries`,
  hovering to accent), "/" at `rgba(20,20,18,0.45)`, then "Private Credit" in ink.
* **Row** (`display: flex; gap: clamp(28px,3.6vw,56px); align-items: center; flex-wrap: wrap; margin-top: 12px`):
  * Left, `flex: 1 1 410px; min-width: 0; max-width: 560px`:
    * h1 "We build the platform your private credit fund runs on"
    * p (margin 22px 0 0): "Origination, KYC, credit, servicing, covenants and investor reporting on a single record — built to your process, in production inside eight weeks."
    * Buttons (`gap: 10px; margin-top: 26px`), both 38px tall with radius 5 and `padding: 0 17px`:
      * "Book a platform review": ink fill, white, 13.5px/500, −0.008em. Hover background is accent. `mailto:hello@3264.ai`.
      * "How we add value": 1px `--line` border, transparent, `--sec`, 13.5px. Hover border and text are accent. → `#platform`.
  * Right, the ring: `flex: 1 1 620px; min-width: 0; position: relative; aspect-ratio: 6 / 5; max-width: 680px; overflow: visible; margin-top: -26px`,
    containing `<canvas ref=heroCv>` at `absolute inset 0; 100%×100%; display: block`.
* **Equation band** (`margin: 44px 0 0; padding: 30px 0 0; border-top: 1px solid var(--line)`):
  * Row 1 (relative, centred): the equation in a wrapping flex, `row-gap: 16px`, at the
    equation size, ink:
    `3264.ai` (500) · `=` (`--mut`, margin 0 0.4em) · `∫` at 2.5em / weight 300 / lh 0.62 with the
    limits `T` over `0` in mono 10px `--mut` · a stacked fraction whose numerator is
    *Loan Origination* ⊕ *Loan Management* ⊕ *Covenant Engine* ⊕ *Investor Reporting* (14.5px
    italic, ⊕ in accent, `gap: 0.62em`, nowrap), a 1px `rgba(20,20,18,0.5)` rule, and a
    denominator of *one record* (14.5px italic `--sec`) · *dt* (italic).
    Then `(1)` mono 11px `--mut`, positioned absolutely at right 0, vertically centred.
  * Row 2 (`margin-top: 26px; padding-top: 18px; border-top: 1px solid var(--line2)`,
    centred, wrapping, `gap: clamp(16px,2.2vw,34px)`, 14.5px `--sec`):
    *subject to* (14px italic `--mut`) · `|S| = 9 → 1` (S italic) · `∂(handoff) = 0` · `T ≤ 8 weeks` (T italic).

Copy the exact entity characters from the reference (`&#8747;`, `&#8853;`, `&part;`, `&le;`, `&rarr;`).

## Motion

`heroCv` only. See `ANIMATIONS.md` §2. The canvas is sized by CSS; the module sets the backing
store at DPR ≤ 2.

**DOM contract:** `heroCv`.

## Checks
* The equation wraps as a whole group at narrow widths. Its parts are `flex: 0 0 auto`, so they never break internally.
* At 1280 the ring's left labels (Data Room, Investor Portal) do not collide with the standfirst.
* With `?t=16` the ring is in its resolved state (hub + spokes) and identical to the reference.
