// One-off: render the reference at every QA viewport and save it as the design baseline.
// Produces qa/reference-screens/<w>x<h>/{full.png, <section>.png, scrub/<section>-<p>.png}.
// Run once after `npx serve design_handoff_private_credit/reference -l 4100`:
//   npx tsx qa/capture-reference.ts
// Commit the output. Designers review diffs against these files, not against an earlier port.
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import points from "./scrub-points.json";

const REF = "http://localhost:4100/Private%20Credit.dc.html?t=16&intro=off";
const VIEWPORTS = [
  { width: 1024, height: 768 }, { width: 1280, height: 800 }, { width: 1440, height: 900 },
  { width: 1440, height: 760 }, { width: 1920, height: 1080 },
];
const STATIC = {
  header: "header", hero: "#top", "cta-audit": "[data-screen-label='CTA · audit (after 01)']",
  servicing: "#servicing", "cta-fit": "[data-screen-label='CTA · fit (after 04)']",
  investors: "#investors", footer: "footer",
};

(async () => {
  const browser = await chromium.launch();
  for (const vp of VIEWPORTS) {
    const dir = path.join("qa/reference-screens", `${vp.width}x${vp.height}`);
    fs.mkdirSync(path.join(dir, "scrub"), { recursive: true });
    const page = await browser.newPage({ viewport: vp, deviceScaleFactor: 2, reducedMotion: "reduce" });
    await page.goto(REF); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(800);
    for (const [name, sel] of Object.entries(STATIC)) {
      const el = page.locator(sel).first();
      await el.scrollIntoViewIfNeeded(); await page.waitForTimeout(500);
      await el.screenshot({ path: path.join(dir, `${name}.png`), mask: [page.locator("[data-blip]")] });
    }
    for (const [name, def] of Object.entries(points).filter(([k]) => k !== "_doc") as any) {
      for (const pt of def.points) {
        await page.evaluate(({ section, p }) => {
          const sec = document.querySelector(section)!;
          const track = [...sec.querySelectorAll<HTMLElement>("div")].find((d) => !!d.firstElementChild && getComputedStyle(d.firstElementChild).position === "sticky")!;
          const pin = track.firstElementChild as HTMLElement;
          const top = track.getBoundingClientRect().top + scrollY;
          scrollTo(0, Math.round(top + p * (track.offsetHeight - pin.offsetHeight)));
        }, { section: def.section, p: pt.p });
        await page.waitForTimeout(900);
        await page.screenshot({ path: path.join(dir, "scrub", `${name}-${pt.p.toFixed(3)}.png`), mask: [page.locator("[data-blip]")] });
      }
    }
    await page.close();
  }
  await browser.close();
})();
