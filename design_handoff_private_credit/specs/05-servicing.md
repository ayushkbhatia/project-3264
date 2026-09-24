# 05 · §04 Servicing (`#servicing`): "Interest, fees and resets read straight from the credit agreement."

Not pinned. There are three looping product cards, each on its own clock.

## Markup

`section#servicing[data-screen-label="Servicing"]`: `padding: 118px 40px; border-bottom: 1px solid var(--line2)`, max 1280.

* Heading block `max-width: 760px; margin: 0 auto; text-align: center`, with h2
  `clamp(30px,3.1vw,44px) / −0.032em / 1.06 / pretty`: "Interest, fees and resets read straight from the credit agreement."
* `servHost`: **empty**, `display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 26px; margin: 58px 0 0`.

## Motion

`buildServ()` / `loopServ()`. See `ANIMATIONS.md` §6. The module builds three cells:
* a stage `position: relative; height: 336px; background: #F2EFE8; border: 1px solid rgba(20,20,18,0.07); border-radius: 22px; overflow: hidden`
* a title under it: `margin-top: 24px`, 19px / −0.022em / 1.3, ink
* inside the stage, overlapping white "surfaces" (radius 14 or 10, shadow `0 18px 44px rgba(20,20,18,0.10), 0 2px 6px rgba(20,20,18,0.05)`) that deliberately bleed off the right edge, plus a floating pill chip (radius 999, shadow `0 10px 26px rgba(20,20,18,0.13)`)

| Card | Title | Surface content |
| --- | --- | --- |
| 1 | Interest that reprices itself. | Rate build: Base SOFR 30d 5.33%, Margin grid level 2 +6.25%, Floor not binding 1.00%, All-in 11.58%, Interest accrued 30/360 |
| 2 | Payments applied down the waterfall. | a single wire applied across ledgers |
| 3 | Notices drafted, sent and logged. | a notice document being drafted |

The copy for all three lives in the module.

**DOM contract:** `servHost`.

## Verify
* `?t=16`: all three cards visible in their "done" chip state. Compare with the reference at 1280, 1440 and 1920.
* `?t=0.2`, `?t=1.5`, `?t=3`, `?t=4.5`, `?t=5.8`: card 1 arriving (no chip), processing, processing, done, leaving. Cards 2 and 3 run 0.68s and 1.36s ahead of it.
* No `?t`: the loop pauses when the section is out of view (140px margin) and resumes in phase.
* At 1024 the three columns still fit; the surfaces are designed to overflow their stage.
