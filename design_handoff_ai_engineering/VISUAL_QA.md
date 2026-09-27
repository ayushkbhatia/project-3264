# Visual QA

Compare the port (`http://localhost:3000/ai-engineering?intro=off`) with the reference
(`http://localhost:4200/AI%20Engineering.dc.html?intro=off`) at 1280×800, 1440×900 and 1920×1080.

```
npx serve design_handoff_ai_engineering/reference -l 4200
npm i -D @playwright/test && npx playwright install chromium
npx playwright test design_handoff_ai_engineering/qa/visual.spec.ts
```

`qa/visual.spec.ts` scrolls both pages to each point in `qa/scrub-points.json` and writes
`qa/out/<viewport>/<id>-ref.png` and `-port.png`. Review side by side; a pixel diff will show small noise on
SVG and blurred glass.

## Point kinds

* `anchor`: element top `offset` px below the viewport top.
* `track`: pinned progress m, `scrollY = trackTop - 68 + m·(trackHeight - (innerHeight - 68))`. The Premise track
  is the second child of `section[data-screen-label='Premise']`, the Engagement track the second child of
  `#engagement`. Add `data-track="premise"` / `data-track="engagement"` in the port; the script prefers them.
* `time`: scroll into view, then wait `waitMs` (02 starts on entering view; 04 on landing). Allow ±1 frame.
* `hold` / `hold-complete`: scroll to 03, send wheel input; `hold-complete` waits for `__rbCtl.shown ≥ 0.999`.

Note: background tabs pause `requestAnimationFrame`. Run headed or keep the page visible, or nothing animates.

## Copy diff

Extract each section's text on both pages and diff against the `copy` arrays in `_inventory.json`. Any difference
is a bug unless it is a documented route change.
