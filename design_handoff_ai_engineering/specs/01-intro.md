# 01 · Intro overlay ("Deploy log")

Markup `reference/sections/00-intro-overlay.html`. Motion `ANIMATIONS.md` §2.

## Markup

* `iWrap`: `position:fixed; inset:0; z-index:300; background:#F6F5F2; display:none; align-items:center;
  justify-content:center; overflow:hidden; cursor:pointer`; `onClick = skipIntro`. First child of the page.
* `iStage`: `position:absolute; inset:0`, empty.
* `iMark`: `3264<span>.ai</span>`, `font-size:clamp(48px,8vw,116px); letter-spacing:-0.05em; line-height:1;
  white-space:nowrap; opacity:0`.
* Corner captions 13px −0.005em `var(--mut)` at 32px/28px: "Deploy log" (bottom-left), "click to skip" (bottom-right).

## Behaviour

Every load, 4.8s, unless reduced motion, `playIntro=false` or `?intro=off`. Click or any key skips (280ms).

## Open question

The overlay is `display:none` until mount, so SSR shows the page for an instant before the intro covers it.
Recommended: render it visible by default and hide it in an inline head script when it will not play. Also
decide whether it should play once per session rather than every load.
