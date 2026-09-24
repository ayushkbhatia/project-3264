// Static-layout comparison, section by section. Reference vs port, same flags on both sides.
// Run:  npx playwright test qa/visual.spec.ts
import { test, expect, Page } from "@playwright/test";

const REF = "http://localhost:4100/Private%20Credit.dc.html";
const PORT = "http://localhost:3000/industries/private-credit";
const FLAGS = "?t=16&intro=off";          // same on both sides; see VISUAL_QA.md
const VIEWPORTS = [
  { width: 1280, height: 800 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
];

// Non-pinned sections compared whole. Pinned sections: only the part above the track
// (their sequences are covered by scrub.spec.ts).
const SECTIONS = [
  "header",
  "#top",
  "[data-screen-label='CTA · audit (after 01)']",
  "#servicing",
  "[data-screen-label='CTA · fit (after 04)']",
  "#investors",
  "footer",
];

async function load(page: Page, url: string) {
  await page.goto(url + FLAGS);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(700);            // builders run on first sync; 400ms fades settle
}

async function shoot(page: Page, sel: string) {
  const el = page.locator(sel).first();
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);            // time loops are frozen, but in-view gating needs a frame
  return el.screenshot({ mask: [page.locator("[data-blip]")], animations: "disabled" });
}

for (const vp of VIEWPORTS) {
  test.describe(`${vp.width}x${vp.height}`, () => {
    test.use({ viewport: vp, deviceScaleFactor: 2, reducedMotion: "reduce" });
    for (const sel of SECTIONS) {
      test(sel, async ({ page }) => {
        await load(page, REF);
        const ref = await shoot(page, sel);
        test.info().attach("reference", { body: ref, contentType: "image/png" });
        await load(page, PORT);
        const el = page.locator(sel).first();
        await el.scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);
        await expect(el).toHaveScreenshot(`${vp.width}-${sel.replace(/[^a-z0-9]+/gi, "_")}.png`, {
          mask: [page.locator("[data-blip]")],
          maxDiffPixelRatio: vp.width === 1440 ? 0.01 : 0.02,
          animations: "disabled",
        });
      });
    }
  });
}
