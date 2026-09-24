# 03 · §02 Platform (`#platform`): "Follow every deal in one system of record"

Pinned, **700vh**. One platform window stays on screen while five module screens pass through
it. Each screen has its own in-screen beat.

## Markup

PinnedStage shell (`specs/00`), with the extra `<div style="position:relative">` wrapper around
the track, a stage backdrop, MenuBar (the §02 variant) and ScrollBlip.

* `section#platform[data-screen-label="One platform"]`
* Head h2: "Follow every deal in one system of record, *fully trackable, auditable & traceable.*"
  The second clause is an italic `<span>`, with `&amp;` in source.

### Inside `stage` (1200×780)

| ref | Position | Notes |
| --- | --- | --- |
| `p2Title` | left 44, top 62, width 800 | **empty** `<h2>`, same style as the §01 titles |
| `p2Win` | left 70, top 180, 1060×518 | radius 11, `#FCFBF9`, border rgba(20,20,18,0.14), shadow `0 30px 74px rgba(20,20,18,0.24), 0 3px 12px rgba(20,20,18,0.14)`, `overflow: hidden; display: flex; flex-direction: column; opacity: 0` |
| `p2Cap` | left 44, bottom 36, width 820 | **empty** div, 20px / −0.024em / 1.32, ink, same text-shadow, `opacity: 0`. The module rewrites `bottom` from cropOf. |

`p2Win` holds a 34px title bar ("3264 · Private Credit Platform") and a body (`flex: 1 1 auto; min-height: 0; display: flex`) with:

| ref | Style |
| --- | --- |
| `p2Side` | **empty**; `flex: 0 0 186px; border-right: 1px solid rgba(20,20,18,0.08); padding: 16px 0; background: rgba(20,20,18,0.015); display: flex; flex-direction: column` |
| `p2Body` | **empty**; `flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column` |

## Motion

`p2Sync()`. See `ANIMATIONS.md` §4. Everything inside `p2Side`, `p2Body`, `p2Title` and
`p2Cap` is built by the module:

| Stage | Line (title), *emphasis* | Caption |
| --- | --- | --- |
| Pipeline | Every live deal, on the *board* your committee *actually uses* | Six stages, five asset classes, *one view.* |
| Underwriting | Risk scored on *your factors, your weights* | Base case and downside, side by side. *The rating falls out of the numbers.* |
| Credit memo | The memo *assembles itself* from the diligence | Every figure cites *the document and page it came from.* |
| Committee | Committee decides *once,* and the *conditions write themselves* | Approved with conditions. Seventeen of them, *each with an owner.* |
| Monitoring | Then it *monitors itself,* quarter after quarter | 24 positions tested on receipt. Two on watch, one breached, *everyone already knows.* |

This table is for reading. The source of truth is `this.p2Stages` in the module, so do not
re-type it anywhere.

**DOM contract:** `p2Track p2Pin p2Head p2Fit p2Wrap p2Stage p2Title p2Win p2Side p2Body p2Cap`.

## Verify at

0.02 backdrop only · 0.136 kanban · 0.245 deal panel open · 0.296 underwriting base ·
0.440 stress applied · 0.470 / 0.501 / 0.531 / 0.566 / 0.595 / 0.625 memo S, A–E · 0.741 committee ·
0.892 certificates arriving · 0.981 dossier open.

Scrub **slowly** through 0.34–0.44 and 0.46–0.64 as well. These are continuous interpolations,
so the numbers must move smoothly and match the reference at any p, not only at the points.

## Pitfalls specific to this section
* `p2Body` is emptied and rebuilt on every stage change. Anything React renders into it is
  deleted, so don't render into it.
* The memo stage has six absolutely stacked panels cross-fading over 0.03 of local progress.
  With a CSS transition on opacity added anywhere upstream, two panels will overlap.
* The deal panel and dossier are positioned `left: 186px; right: 16px; top: 78px; bottom: 16px`
  inside the window. They assume the 186px sidebar and 34px title bar exactly.
