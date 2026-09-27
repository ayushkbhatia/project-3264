# 06 · Engagement (pinned, 400vh, spine cards with snippets)

Markup `reference/sections/06-engagement.html`. Motion `ANIMATIONS.md` §8.

## Markup

Section `#engagement` (`padding:118px 40px`). Header: "06 / Engagement" and h2 (max-width 760px) "Two ways in.
Neither of them starts with a platform licence." Pinned-stage pattern: `enTrack` 400vh; `enStage` max-width
1280, `max-height:600px`, `overflow:hidden`. Spine width S = `clamp(56px, 7.2vw, 104px)` everywhere.

### Cards

* Audit `enA`: `absolute; left:0; top:0; bottom:0; width:calc(100% - S); overflow:hidden;
  transform-origin:left center; background:#DCEAEE url(cta-d.avif) center / cover; border:1px solid
  rgba(20,20,18,0.13)`; veil `linear-gradient(90deg, rgba(246,245,242,0.74) 0%, rgba(246,245,242,0.56) 55%,
  rgba(246,245,242,0.3) 100%)`.
* Build `enB`: `absolute; left:S; right:0; top:0; bottom:0; transform:translateX(calc(100% - S))` (only its
  spine shows at first); `box-shadow:-18px 0 48px rgba(20,20,18,0.16); background:#EAE6DE url(cta-b.avif)
  center / cover`; veil `linear-gradient(90deg, rgba(248,246,240,0.5) 0%, rgba(248,246,240,0.3) 50%,
  rgba(248,246,240,0.1) 100%)`.

### Card content (`enAi`, `enBi`; `enBi` starts at opacity 0)

`padding:clamp(24px,3.6vh,40px) clamp(28px,4vw,56px) clamp(22px,3.4vh,36px); display:flex;
flex-direction:column; gap:22px`:

1. Top row, mono 11.5px uppercase 0.04em `#1A1917`, space-between: "Engagement 01" · "2 weeks · fixed fee" /
   "Engagement 02" · "per capability · fortnightly".
2. Middle (`flex:1 1 auto; min-height:0; display:flex; gap:clamp(24px,3.4vw,48px)`):
   * Left (`flex:0 0 clamp(300px,34%,372px)`, centred vertically): title "The audit" / "The build"; paragraph
     (margin-top clamp(14px,2.6vh,24px)) of word spans at .18:
     * A: "We read the code, the data path and the access model, then interview the people who use it. You get a
       written disposition per component and a costed build plan. No obligation to continue."
     * B: "A small senior squad builds onto the four tiers and ships into your environment. Priced per
       capability, released fortnightly, with the evaluation suite handed over at the end."
     * CTA (margin-top clamp(18px,3vh,30px)): primary "Book an audit" / "Book a call", `mailto:hello@3264.ai`,
       hover `#157F52`.
   * Right (`flex:1 1 auto`, centred both ways):
     * A — mini calendar `enCal`: `width:min(460px,100%); border-radius:14px`, glass (spec 00),
       `box-shadow:0 26px 70px -20px rgba(30,60,70,0.3)`. Header (padding 14px 16px, bottom rule): 36px date badge
       (OCT 8px / 6 13px), "Audit — Northgate Capital" 13.5px −0.015em, "10 working days · fixed fee" 11px
       `#2C2B27`. Weekdays Mon–Fri 10px. 2×5 cells, 100px tall, padding 9px, gap 9px, left/top rules
       `rgba(255,255,255,0.5)`; date 10.5px 500 (6, 7, 8, 9, 10, 13, 14, 15, 16; day 10 "17" in a 16px `#157F52`
       circle). Bars 8px tall, radius 4px, widths cycling 100/68/84% (index `(j + day) % 3`), greyscale by
       meeting type: `rgba(20,20,18,0.2)` access, `.4` code, `.58` interviews, `.76` obligations, `.9`
       disposition. Day 10 has two bars `rgba(21,127,82,0.35)` with a `#12A05C` overlay that turns on at the end.
       Bars per day: 3, 2, 2, 3, 3, 2, 2, 2, 3, 2 (24).
     * B — platform snippet host `enBld`: `width:min(540px,100%); aspect-ratio:715 / 425`, empty.
3. Facts: 3-column grid, `gap:32px; border-top:1px solid rgba(20,20,18,0.22); padding:16px 0 0`; label mono 10.5px
   uppercase 0.06em `#2C2B27`; value margin-top 8px, `#1A1917` unless noted:
   * A: Deliverable — Disposition and plan · Access needed — Read-only · Ends in a build — Not necessarily (`#46453F`)
   * B: Runs in — Your environment · Interface — Kept where sound · Handover — Suite and documentation

### Spines (`enAs` on A, starts hidden; `enBs` on B, starts visible)

`absolute; left:0; top:0; bottom:0; width:S; padding:30px 0 28px; display:flex; flex-direction:column;
align-items:center; justify-content:space-between; cursor:pointer`; hover `background:rgba(255,255,255,0.3)`.
Mono 12px "01"/"02"; title 32px −0.03em "The audit"/"The build" in `writing-mode:vertical-rl;
transform:rotate(180deg)`; mono 10.5px uppercase meta, also vertical. Click → `enJump(.2)` / `enJump(.82)`.

## Gate

At m = .20, .52, .80 and during the calendar fill (m ≈ .12) the port matches; the snippet lights one station per
fortnight between m ≈ .67 and .84; spine clicks land; resizing 1024–1920 keeps the spines flush.
