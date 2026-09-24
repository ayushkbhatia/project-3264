// Scroll-linked captures for the four pinned sequences, reference and port side by side.
// Writes qa/__scrub__/<viewport>/<section>-<p>.{ref,port,side}.png and fails only on
// structural checks (pin stays pinned, stage never blank). Compare the side-by-sides by eye.
// Run:  npx playwright test qa/scrub.spec.ts
import { test, expect, Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import points from "./scrub-points.json";

const REF = "http://localhost:4100/Private%20Credit.dc.html?t=16&intro=off";
const PORT = "http://localhost:3000/industries/private-credit?t=16&intro=off";
const VIEWPORTS = [
  { width: 1440, height: 900 },
  { width: 1280, height: 800 },
  { width: 1920, height: 1080 },
  { width: 1440, height: 760 },   // short viewport: exercises pinFit / cropOf
];

async function scrubTo(page: Page, section: string, p: number) {
  await page.evaluate(({ section, p }) => {
    const sec = document.querySelector(section)!;
    const track = [...sec.querySelectorAll<HTMLElement>("div")].find((d) => !!d.firstElementChild && getComputedStyle(d.firstElementChild).position === "sticky")!;
    const pin = track.firstElementChild as HTMLElement;
    const top = track.getBoundingClientRect().top + scrollY;
    scrollTo(0, Math.round(top + p * (track.offsetHeight - pin.offsetHeight)));
  }, { section, p });
  // scroll handler + 400ms heartbeat + 400ms screen fade-ins
  await page.waitForTimeout(900);
}

async function pinRect(page: Page, section: string) {
  return page.evaluate((section) => {
    const sec = document.querySelector(section)!;
    const track = [...sec.querySelectorAll<HTMLElement>("div")].find((d) => !!d.firstElementChild && getComputedStyle(d.firstElementChild).position === "sticky")!;
    const r = (track.firstElementChild as HTMLElement).getBoundingClientRect();
    return { top: r.top, height: r.height };
  }, section);
}

async function sideBySide(page: Page, a: Buffer, b: Buffer, out: string) {
  const src = (x: Buffer) => "data:image/png;base64," + x.toString("base64");
  await page.setContent(`<body style="margin:0;display:flex;gap:12px;background:#222;padding:12px;font:12px monospace;color:#fff">
    <div><div>REFERENCE</div><img style="width:720px" src="${src(a)}"></div>
    <div><div>PORT</div><img style="width:720px" src="${src(b)}"></div></body>`);
  await page.screenshot({ path: out, fullPage: true });
}

for (const vp of VIEWPORTS) {
  test.describe(`${vp.width}x${vp.height}`, () => {
    test.use({ viewport: vp, deviceScaleFactor: 1, reducedMotion: "reduce" });
    for (const [name, def] of Object.entries(points).filter(([k]) => k !== "_doc") as any) {
      test(name, async ({ page, browser }) => {
        const dir = path.join("qa/__scrub__", `${vp.width}x${vp.height}`);
        fs.mkdirSync(dir, { recursive: true });
        const portPage = await browser.newPage({ viewport: vp, reducedMotion: "reduce" });
        await page.goto(REF); await page.evaluate(() => document.fonts.ready);
        await portPage.goto(PORT); await portPage.evaluate(() => document.fonts.ready);
        for (const pt of def.points) {
          await scrubTo(page, def.section, pt.p);
          await scrubTo(portPage, def.section, pt.p);
          // structural: the pin sits under the 68px header for the whole track
          const pr = await pinRect(portPage, def.section);
          expect(Math.abs(pr.top - 68), `${name}@${pt.p} pin top`).toBeLessThan(2);
          const ref = await page.screenshot({ mask: [page.locator("[data-blip]")] });
          const port = await portPage.screenshot({ mask: [portPage.locator("[data-blip]")] });
          const base = path.join(dir, `${name}-${pt.p.toFixed(3)}`);
          fs.writeFileSync(base + ".ref.png", ref);
          fs.writeFileSync(base + ".port.png", port);
          const tmp = await browser.newPage();
          await sideBySide(tmp, ref, port, base + ".side.png");
          await tmp.close();
          test.info().annotations.push({ type: "expect", description: `${name}@${pt.p}: ${pt.expect}` });
        }
        await portPage.close();
      });
    }
  });
}
