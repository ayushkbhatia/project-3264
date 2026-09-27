# 00 · Foundation

## Page shell

* `html, body { margin:0; padding:0; overflow-x:clip }`: clip, never hidden, or sticky breaks.
* `body`: tokens from README, `background:#F6F5F2; color:#1A1917;
  font-family:"Instrument Sans","Helvetica Neue",Helvetica,sans-serif; -webkit-font-smoothing:antialiased;
  text-rendering:optimizeLegibility`.
* `a { color:inherit; text-decoration:none } a:hover { color:var(--a) }`. The only link rule.
* `::selection { background:var(--a); color:#FFFFFF }`.
* Content column `max-width:1280px; margin:0 auto`. Sections `padding:118px 40px;
  border-bottom:1px solid var(--line2)` unless noted. Order: intro overlay, header, hero, Premise, Audit,
  Rebuild/Platform/Outcome, Engagement, footer.

## Fonts

Fontsource `@fontsource/instrument-sans` (400, 500, 600, 400-italic) and `@fontsource/ibm-plex-mono` (400,
500). Families must stay `Instrument Sans` and `IBM Plex Mono`. Mono stack: `'IBM Plex Mono', ui-monospace, monospace`.

## Type scale

| Role | Size | Tracking | Line-height |
| --- | --- | --- | --- |
| Hero h1 | clamp(36px, 4vw, 58px) | −0.038em | 1.0 |
| Section h2 (01, 06) | clamp(30px, 3.1vw, 44px) | −0.032em | 1.06 |
| Audit h2 | clamp(22px, 2.65vw, 34px) | −0.028em | 1.18 |
| Premise statement | clamp(30px, 3.9vw, 58px) card 1; clamp(30px, 3.7vw, 56px) cards 2–3 | −0.034em | 1.1 / 1.12 |
| Engagement card title | clamp(44px, min(4.6vw, 7.4vh), 64px) | −0.045em | 0.96 |
| Engagement paragraph | clamp(17px, min(1.55vw, 2.6vh), 22px) | −0.015em | 1.4 |
| Engagement fact value | clamp(15px, 1.4vw, 20px) | −0.02em | — |
| Dark-canvas h2 | 40px in the 1280 frame (scaled) | −0.034em | 1.12 |
| Leads | 16.5px / lh 1.6 (Premise); clamp(15.5px, 1.2vw, 17px) / lh 1.55 (hero) | — | — |
| Section label | 13px, −0.005em, `--mut` (or `#2C2B27` on imagery) | | |
| Mono label | 11.5px uppercase 0.04em (cards); 11px uppercase 0.16em (dark canvas); 10.5px uppercase 0.06em (facts) | | |
| Nav | 14px `--sec`, active `#1A1917` | | |
| Footer heading / link | 11px 500 uppercase 0.11em `--mut` / 14.5px −0.008em `--sec`, hover `--a` | | |

All weights 400 except the footer heading (500), button labels (500) and wordmarks (500).

## Buttons

* Primary: `height:46px; padding:0 24px; background:#1A1917; color:#FFFFFF; border-radius:6px; font-size:15px;
  font-weight:500; letter-spacing:-0.01em`; hover `background:var(--a)` (Engagement cards: `#157F52`).
* Secondary: same size, `border:1px solid var(--line); background:rgba(255,255,255,0.85)`; hover border/text `--a`.
* Header: `height:36px; padding:0 16px; border:1px solid var(--line); border-radius:6px; background:#FFFFFF;
  font-size:13.5px; letter-spacing:-0.01em`; hover border/text `--a`.

## Faux app window (01, 02)

`border-radius:11px; background:#FCFBF9; border:1px solid rgba(20,20,18,0.14); box-shadow:0 30px 74px
rgba(20,20,18,0.22), 0 4px 12px rgba(20,20,18,0.12); overflow:hidden`. Title bar 32–34px,
`rgba(20,20,18,0.045)`, bottom hairline `rgba(20,20,18,0.08)`, traffic lights 11–12px, centred 12–12.5px title.
Status pills: mono 9.5–10px uppercase 0.05em, radius 4px.

## Glass (02 calendar, 06 mini calendar)

`background:rgba(255,255,255,0.3); border:1px solid rgba(255,255,255,0.72); backdrop-filter:blur(18px)
saturate(1.1)`; inner rules `rgba(255,255,255,0.5–0.55)`.

## Pinned-stage pattern (01 and 06)

```
<div ref=track style="position:relative; min-height:760vh | 400vh; margin:62px 0 0">
  <div style="position:sticky; top:68px; height:calc(100vh - 68px); min-height:600px;
              display:flex; align-items:center; box-sizing:border-box; padding:24px 0">
    <div ref=stage style="position:relative; width:100%; max-width:1280px; margin:0 auto; height:100%;
                           max-height:780px (01) | 600px + overflow:hidden (06)">
      cards, absolutely positioned
```

The sticky element is the track's first child. No ancestor may have `overflow: hidden/auto` or a transform.
