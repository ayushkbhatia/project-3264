# 07 · §06 Delivery (`#delivery`): "From audit to live platform in eight weeks"

Pinned, **608vh**, on a dark ground. Four stacked "plates" light one at a time as the four
two-week stages accumulate beside them. In the last beat the plates close into one unit and a
CTA takes over.

## Markup

`section#delivery[data-screen-label="Delivery"]`: `position: relative; background: #0A0A0A; border-top: 1px solid rgba(255,255,255,0.07); border-bottom: 1px solid rgba(255,255,255,0.07)`.

* Background (absolute, fills the section, overflow hidden): `delivery-bg.webp` cover, `object-position: center top`,
  plus a dot screen, `radial-gradient(rgba(255,255,255,0.045) 1px, transparent 1px)` at 3px × 3px and opacity 0.6.
  The image is 1920×5748. It spans the whole 608vh section, so the pinned view shows a slowly
  changing slice as you scroll. That is intended and free.
* `dTrack`: `position: relative; min-height: 608vh`
  * `dPin`: `position: sticky; top: 68px; height: calc(100vh - 68px); min-height: min(760px, calc(100vh - 68px)); display: flex; align-items: center; justify-content: center; padding: clamp(10px,2vh,26px) 40px; box-sizing: border-box; overflow: hidden`
    * `dInner`: `width: 100%; max-width: 1280px; margin: 0 auto; transform-origin: center center`
      * Heading `max-width: 880px; margin: 0 auto; text-align: center`, with h2
        `clamp(26px,2.7vw,42px) / −0.034em / 1.08 / balance / #F4F3F0`:
        "From audit to <span class=grad>live platform</span> in eight weeks". Here "live platform"
        uses the delivery gradient as `background-clip: text` with transparent colour.
      * Grid: `position: relative; margin: clamp(14px,3vh,40px) 0 0; display: grid; grid-template-columns: minmax(0,1fr) clamp(300px,30vw,400px) minmax(0,1fr); grid-template-rows: repeat(4, minmax(clamp(82px,17vh,138px), auto))`

### Grid children

| ref | Row | Col | Align | Content |
| --- | --- | --- | --- | --- |
| `dC1` | 1 | 1 | right | 01 · Weeks 1–2 · **Company-wide audit** · "Every agreement, spreadsheet and handoff between origination, servicing, fund operations and IR, mapped." |
| `dC2` | 2 | 3 | left | 02 · Weeks 3–4 · **Quick wins in automation** · "The covenant tracker, the accrual schedule, the certificate intake. Automated and in production first." |
| `dC3` | 3 | 1 | right | 03 · Weeks 5–6 · **Acceptance against your book** · "Your live portfolio runs in parallel and ties out line by line. Nothing signs off until the numbers agree." |
| `dC4` | 4 | 3 | left | 04 · Weeks 7–8 · **The platform, stitched together** · "Pipeline, underwriting, servicing, monitoring and investor reporting on one record, your team trained on it." |
| `dCta` | 1 / span 4 | 3 | left | CTA (below), `z-index: 3; opacity: 0; pointer-events: none` |
| `dStack` | 1 / span 4 | 2 | — | **empty**; `position: relative; perspective: 1600px; perspective-origin: 50% 50%; overflow: visible` |

Every stage cell: `position: relative; align-self: center; padding: 0 clamp(18px,2vw,30px); box-sizing: border-box; opacity: 0`.
* A number (mono 11px, 0.16em, `rgba(255,255,255,0.9)`) and a weeks label (mono 10px, 0.1em,
  uppercase, `rgba(255,255,255,0.66)`) in a baseline flex with `gap: 10px`, justified toward the stack.
* Title `margin-top: 9px; clamp(13.5px,1.1vw,15.5px); 0.08em; uppercase; #F4F3F0`.
* Body `margin-top: 7px; max-width: 34ch` (auto margin toward the stack),
  `clamp(12px,0.95vw,13.5px) / 1.5`, `rgba(255,255,255,0.6)`, pretty.
* **Last child**: `<div data-stub>` at `position: absolute; top: 50%; width: 0; height: 1px; background: rgba(255,255,255,0.28)`,
  anchored `right: 0` on left cells and `left: 0` on right cells. The module finds it as
  `lastElementChild` with `data-stub`, **so it must be the last child.**

`dCta`: eyebrow "Get started" (mono 10px, 0.16em, uppercase, `rgba(255,255,255,0.5)`) ·
"One platform, running your book." (`margin-top: 12px; clamp(19px,1.7vw,25px) / −0.024em / 1.18; #F4F3F0`) ·
"We start with a two-week audit of your desk. You keep the map whether or not we build the rest."
(`margin-top: 10px; max-width: 36ch; clamp(12.5px,1vw,13.5px) / 1.55; rgba(255,255,255,0.62)`) ·
a button, "Start with the audit →" (`margin-top: 18px; padding: 12px 20px; #FFFFFF; #0A0A0A; radius 7; 13.5px; −0.012em`, hover `#E9E4CF`) ·
a 2px × 120px gradient rule at opacity 0.85, `margin-top: 16px`.

## Motion

`dBuild()` / `dLayout()` / `dSync()`. See `ANIMATIONS.md` §8. The module builds the bloom, three
dashed rails and four pucks inside `dStack`. It writes `transform` on `dInner`, opacity and
transform on `dC1`–`dC4` and `dCta`, the stub widths, and `pointer-events` on `dCta`.

**DOM contract:** `dTrack dPin dInner dStack dCta dC1 dC2 dC3 dC4`.

## Verify at

0.03 headline only · 0.142 beat 1 · 0.326 beat 2 · 0.510 beat 3 · 0.694 beat 4 · 0.950 assembled, CTA live.

Check also:
* `dCta` is keyboard-focusable only once it is visible. Add `tabIndex={-1}` / `inert` handling
  if your a11y pass requires it (see spec 09). The module toggles `pointer-events` only.
* 1440×760: `dInner` scale stays ≥ 0.94, and the stack pitch tightens instead.
