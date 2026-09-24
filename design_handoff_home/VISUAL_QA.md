# Visual QA — how to verify the port matches

The port is judged by comparison against the reference, never by reading the spec from
memory. Every phase ends with the harness below.

## Serving both sides

```bash
npx serve design_handoff_home/reference -l 4100   # reference
npm run dev                                       # port on :3000
```

Reference URL: `http://localhost:4100/3264%20Home.dc.html`

## Freezing motion

Screenshots must be deterministic.

**Port:** `?motion=off` sets `data-motion="off"` on `<html>`; `useMotionSystem` skips mounting.
Vignette boxes stay empty, the hero shows its CSS background, no intro.

**Reference:** it has no URL flag. Launch the reference context with Playwright's
`reducedMotion: 'reduce'`. Every module honours it, so there is no intro, vignettes render once
in their resting state, and scroll systems still respond to scroll. Use `reducedMotion: 'reduce'`
for **both** sides when comparing static layout, and additionally hide the vignette and
canvas regions on both with a mask (see below), since the reference renders them and the port
with `?motion=off` does not.

## Harness (Playwright)

```ts
// qa/visual.spec.ts
import { test, expect } from "@playwright/test";

const REF = "http://localhost:4100/3264%20Home.dc.html";
const PORT = "http://localhost:3000/?motion=off";
const WIDTHS = [1280, 1440, 1920];
const SECTIONS = ["header", "#top", "#model", "#capabilities", "#industries", "#work",
  "[data-screen-label='Stack']", "#company", "#playbooks", "#contact",
  "[data-screen-label='Footer image']", "footer"];
const MASK = ["canvas", "[data-vig]"];            // add data-vig to the three vignette boxes in the port

for (const w of WIDTHS) {
  test.describe(`@${w}`, () => {
    test.use({ viewport: { width: w, height: 900 }, reducedMotion: "reduce", deviceScaleFactor: 2 });
    for (const sel of SECTIONS) {
      test(sel, async ({ page }) => {
        await page.goto(REF); await page.evaluate(() => document.fonts.ready);
        const ref = await page.locator(sel).first().screenshot({ mask: MASK.map(m => page.locator(m)) });
        await page.goto(PORT); await page.evaluate(() => document.fonts.ready);
        await expect(page.locator(sel).first()).toHaveScreenshot(`${w}-${sel}.png`, {
          mask: MASK.map(m => page.locator(m)), maxDiffPixelRatio: 0.01,
        });
        test.info().attach("reference", { body: ref, contentType: "image/png" });
      });
    }
  });
}
```

Seed the baselines from the reference (capture the reference into `qa/__screens__/` once and
use those files as the expected images), so the port is always diffed against the design,
never against a previous port.

**Threshold:** `maxDiffPixelRatio: 0.01` per section at 1440. At 1280 and 1920, allow 0.02 but
inspect every diff image by eye. Antialiasing noise is fine; a moved baseline is not.

The Capabilities section is 420vh tall. For static comparison, capture only its header block
(`#capabilities > div:first-child`); the track is covered by scrub captures below.

## Scroll-linked captures (Capabilities)

Run with normal motion (no reduced-motion), both sides, 1440×900:

```ts
async function scrubTo(page, p) {
  await page.evaluate((p) => {
    const t = document.querySelector("#capabilities > div:nth-child(2)") as HTMLElement;
    const top = t.getBoundingClientRect().top + scrollY;
    scrollTo(0, top + p * (t.offsetHeight - innerHeight));
  }, p);
  await page.waitForTimeout(400);   // let rAF settle
}
for (const p of [0.10, 0.30, 0.36, 0.50, 0.64, 0.70, 0.90]) { /* scrubTo + screenshot the pin */ }
```

Idle drift makes these slightly non-deterministic, so compare them by eye, side by side, not by
pixel ratio. What must match: which panel is visible, its opacity, the rail state, caption and
counter, and the panel's internal figures.

## Copy diff

```ts
const text = (page) => page.evaluate(() => document.body.innerText.replace(/\s+/g, " ").trim());
// assert port text === reference text, after removing the intro overlay's caption
```

Any difference is a bug unless it's listed as a deliberate deviation in `BUILD_PLAN.md`.

## Computed-style spot checks

When a diff shows up and the cause isn't obvious, compare computed styles element by element
rather than guessing:

```js
const pick = (el) => { const s = getComputedStyle(el);
  return { fs: s.fontSize, fw: s.fontWeight, ls: s.letterSpacing, lh: s.lineHeight,
           c: s.color, m: s.margin, p: s.padding, b: s.borderTop }; };
```

Run the same selector on both sides and diff the objects.
