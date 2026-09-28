// Playwright: capture reference baselines from reference/Playbooks.dc.html.
// Usage:
//   npx serve design_handoff_playbooks/reference -l 4200
//   npx playwright test qa/capture-reference.ts   (or run with ts-node + playwright's chromium)
// Output: qa/baselines/<viewport>/<name>.png
//
// Motion is frozen with reducedMotion: "reduce" (the carousel stops autoplay and the hero video
// stays paused). The hero video is cross-origin in the reference, so hero captures show the poster
// area as black. Compare the hero against screenshots/hero-frames/* by eye.

import { test } from "@playwright/test";

const BASE = process.env.REF_URL ?? "http://localhost:4200/Playbooks.dc.html";
const VIEWPORTS = [
  { name: "1440", width: 1440, height: 900 },
  { name: "1280", width: 1280, height: 800 },
  { name: "1024", width: 1024, height: 768 },
  { name: "768", width: 768, height: 1024 },
  { name: "390", width: 390, height: 844 },
];
const SECTIONS: [string, string][] = [
  ["01-hero", "#top"],
  ["02-library", "#library"],
  ["03-featured", '[data-screen-label="Featured"]'],
  ["04-ctas", '[data-screen-label="Library CTAs"]'],
  ["05-private-credit", "#private-credit"],
  ["06-fund-management", "#fund-management"],
  ["07-asset-management", "#asset-management"],
  ["08-recently-updated", '[data-screen-label="Recently updated"]'],
  ["09-closing", '[data-screen-label="Closing"]'],
  ["10-footer", "footer"],
];

for (const vp of VIEWPORTS) {
  test(`reference @${vp.name}`, async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, reducedMotion: "reduce", deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: "networkidle" });
    await page.waitForSelector('[data-screen-label="Library CTAs"]');
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `qa/baselines/${vp.name}/00-full.png`, fullPage: true });
    for (const [name, sel] of SECTIONS) {
      const el = page.locator(sel).first();
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(250);
      await el.screenshot({ path: `qa/baselines/${vp.name}/${name}.png` });
    }
    // States
    await page.click('button[data-cat="Private Credit"]');
    await page.locator("#library").screenshot({ path: `qa/baselines/${vp.name}/s01-filter-bar.png` });
    await page.screenshot({ path: `qa/baselines/${vp.name}/s01-filter-page.png`, fullPage: true });
    await page.click('button[data-cat="All"]');
    await page.fill('input[type="search"]', "covenant");
    await page.screenshot({ path: `qa/baselines/${vp.name}/s02-search-one.png`, fullPage: true });
    await page.fill('input[type="search"]', "zzz");
    await page.screenshot({ path: `qa/baselines/${vp.name}/s03-search-none.png`, fullPage: true });
    await page.getByRole("button", { name: "Clear" }).click();
    await page.fill('input[type="email"]', "analyst@fund.com");
    await page.getByRole("button", { name: "Subscribe" }).click();
    await page.locator('[data-screen-label="Library CTAs"]').screenshot({ path: `qa/baselines/${vp.name}/s04-subscribed.png` });
    await ctx.close();
  });
}
