# 08 · Intro overlay ("Reconciliation")

A ~5.3s load-time overlay. A six-line fund reconciliation scrambles and settles, the variance
counts down to `0.00`, the wordmark resolves and the overlay lifts.

## Markup

Render it as the **first child** inside `<PrivateCreditMotionRoot>`, before the header.

```
div[ref=iWrap] onClick={bind.handler("skipIntro")}
    position: fixed; inset: 0; z-index: 300; background: #F6F5F2;
    display: none;            ← the module sets flex when it plays
    align-items: center; justify-content: center; overflow: hidden; cursor: pointer
├ div[ref=iStage]   position: absolute; inset: 0            (empty; the module builds the table)
├ div[ref=iMark]    position: relative; opacity: 0; font-size: clamp(48px,8vw,116px);
│                   font-weight: 400; letter-spacing: -0.05em; line-height: 1; white-space: nowrap
│                   → "3264<span>.ai</span>"
├ div   absolute; left: 32px; bottom: 28px; 13px; −0.005em; --mut    "Reconciliation"
└ div   absolute; right: 32px; bottom: 28px; 13px; −0.005em; --mut   "click to skip"
```

`display: none` in the server HTML is important. Nothing flashes if JS is slow, and a
reduced-motion visitor never sees it.

## Motion

`runIntro()`. See `ANIMATIONS.md` §9 for the millisecond table. Table row styles: rows get
`padding: 13px 0; border-top: 1px solid rgba(20,20,18,0.12)`, labels 16px / −0.015em, values
15.5px tabular in 132px right-aligned columns ("reported" in `--mut`), and a footer with a
`rgba(20,20,18,0.28)` top rule, "Variance" 16px, and the value at 17px in a 264px column.

**DOM contract:** `iWrap iStage iMark`, plus the handler `skipIntro`.

## Rules
* Plays at most once per mount. Do not persist a "seen" flag unless product asks for it; the
  prototype plays it on every load.
* Never modal: no focus trap, no `aria-modal`. Mark it `aria-hidden="true"`, because it is
  decorative and the page beneath is live.
* Keep the dual teardown (animation `onfinish` **or** a timeout at duration + 140ms, whichever
  comes first). Collapsing it into one callback brings back the "invisible overlay swallowing
  clicks" bug.
* The keydown skip listener is `{ once: true }` and removed on destroy.

## Verify
* Normal load: the full sequence, then the page is interactive.
* A click at 1s fades out in 280ms, and a nav link click immediately afterwards navigates.
* Any key at 1s does the same.
* `prefers-reduced-motion: reduce` and `?intro=off`: never visible, `display: none` throughout.
* CPU throttle 6×: still tears down.
