# Spec 05 — Intro relief overlay

Client component rendered once at the top of `<body>` on the home route only. Behaviour is in
`src/motion/intro-relief.js`; read `ANIMATIONS.md` §1.

## Markup contract

```
iWrap   div   position:fixed; inset:0; z-index:300; background:#F6F5F2; display:none;
              align-items:center; justify-content:center; overflow:hidden; cursor:pointer
              onClick → skip
├ iGrid div    absolute inset-0; opacity:0            (module paints the 32-col grid)
├ iCv   canvas absolute inset-0; w/h 100%; opacity:0
├ iMark div    relative; opacity:0; text-align:center
│ └ iLock div  font-size:clamp(48px,8vw,116px); weight 400; letter-spacing:-0.05em; line-height:1; nowrap
│              "3264" + <span iSfx style="opacity:0">.ai</span>
└ iCap  div    absolute; left 0; right 0; bottom 36px; centred; 13px/-0.005em/--mut; initial text "1"
```

`display: none` in the server HTML is deliberate: if JS never runs, there's no overlay.

## Options

`{ accent, introPace = 1, playIntro = true }`. Only play on a fresh load of `/`, not on
client-side navigation back to home. Store a `sessionStorage` flag after the first play.
(The reference plays on every load, and once per session is the intended production behaviour.)

## Must keep

- Skip on click (iWrap) and on any keydown.
- Dual teardown: `pointer-events: none` immediately when logically over; hide on
  `onfinish` **or** timeout, whichever fires first.
- Skip entirely under `prefers-reduced-motion: reduce` and under `?motion=off`.
- No focus trap, no `aria-modal`. Give iWrap `aria-hidden="true"`; it's decorative.
