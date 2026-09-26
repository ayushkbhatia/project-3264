# Build plan — AI Engineering

## File structure (suggested)

```
src/
├── app/ai-engineering/page.tsx          server component rendering <AIEngineeringPage />
├── components/ai-engineering/
│   ├── AIEngineeringPage.tsx            "use client"; class extends AIEngineeringLogic; render() = page JSX
│   ├── sections/                        stateless JSX pieces used by render():
│   │   IntroOverlay, Header, Hero, Premise, Audit, Engagement, Footer
│   ├── RebuildPlatform.tsx              "use client"; class extends RebuildPlatformLogic
│   └── RebuildGraphic.tsx               "use client"; class extends RebuildGraphicLogic
└── motion/ai-engineering/
    ├── ai-engineering.logic.js          from motion/, verbatim bodies + PORT SHIMS
    ├── rebuild-platform.logic.js
    └── rebuild-graphic.logic.js
public/img/                              the seven assets
```

Section pieces receive `v` (the `renderVals()` result) as a prop. They hold no state and no effects.

## Class port

1. Copy each file from `motion/` into `src/motion/ai-engineering/`. Replace
   `class Component extends DCLogic` with `export class AIEngineeringLogic extends React.Component`
   (`RebuildPlatformLogic`, `RebuildGraphicLogic`). Add `import React from "react"`.
2. Delete the dead code listed at the top of `ai-engineering.logic.js`, with its calls in
   `componentDidMount`, `tick` and `componentWillUnmount`, and the dead refs in the constructor list and
   `renderVals()`.
3. Apply the PORT SHIMS (`ANIMATIONS.md` §0).
4. `export default class AIEngineeringPage extends AIEngineeringLogic { render() { const v = this.renderVals(); return (…); } }`.
   Build the JSX from `reference/sections/*.html`: `ref="{{ x }}"` → `ref={v.x}`, `{{ x }}` → `{v.x}`,
   `<sc-for list="{{ xs }}" as="w">…</sc-for>` → `v.xs.map((w, i) => …)` with a stable key. Keep word spans as
   direct children of their `<p>`.
5. Mount `<RebuildPlatform />` where the reference has `<dc-import name="Rebuild Platform">`, and
   `<RebuildGraphic bare />` inside it where it has `<dc-import name="Rebuild graphic" bare="{{ true }}">`.

### Isolating the one piece of React state

`stepAuditLoop` calls `setState({ auJ })` every 1.3s while the 02 loop shows findings, re-rendering the page
component. It is safe (motion-written styles are not in the JSX style props, so React leaves them alone) but
wasteful. Recommended: move the findings list and pane into `<AuditFindings />` with its own state, expose a
setter through a ref, call that instead of `setState`, and move the `componentDidUpdate` pane fade into the
child. Keep `auPack(i)` as the data source.

## Phases and gates

| Phase | Scope | Gate |
| --- | --- | --- |
| 0 | skeleton, fonts, tokens, assets, Playwright | reference baselines at 1280/1440/1920 |
| 1 | header, footer, placeholders with real heights | visual diff clean; anchors land at the same scroll positions as the reference (±2px) |
| 2 | static markup | side by side at `?intro=off` matches at section tops and at each pinned stage's initial state |
| 3 | logic port | every point in `qa/scrub-points.json` matches; no console errors after a full scroll down and up |
| 4 | intro | plays, skips, never traps; skipped under reduced motion and `?intro=off` |
| 5 | responsive gating, a11y, perf | every `CHECKLIST.md` item pass or explicitly open |

## Common failures

* **Sticky stops working.** An ancestor has `overflow: hidden/auto` or a transform. `html, body` use
  `overflow-x: clip`.
* **The page sticks at 03.** `window.__rbCtl` missing (RebuildGraphic not mounted with `bare`, or twice), so
  `shown` never reaches 1; or a Strict Mode double mount left a wheel listener attached.
* **Links turn green.** A child component declared its own global `a` colour. There must be one link rule.
* **SVG text in Helvetica.** Fonts loaded through `next/font` only. Use Fontsource family names.
* **Hero stays grey.** The veil loads the image by path; after the path shim it must be `/img/hero-plane.png`,
  same origin (`getImageData`).
* **Word fills don't move.** Spans must be direct children of the ref'd `<p>`.
* **06 card jumps on resize.** The spine width is read from the build card's `offsetLeft`; keep
  `left: clamp(56px, 7.2vw, 104px)` on it and the same clamp on both spines.
* **06 platform snippet blank.** Its host must stay empty in JSX; `enRenderBuild` writes its `innerHTML` only
  while the build card is showing (`_enVB > 0.02`) and the section is on screen.
