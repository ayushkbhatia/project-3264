import { test, Page } from "@playwright/test";
import fs from "fs";
import path from "path";

const REF = process.env.REF_URL ?? "http://localhost:4200/AI%20Engineering.dc.html?intro=off";
const PORT = process.env.PORT_URL ?? "http://localhost:3000/ai-engineering?intro=off";
const spec = JSON.parse(fs.readFileSync(path.join(__dirname, "scrub-points.json"), "utf8"));
const OUT = path.join(__dirname, "out");

async function trackEl(page: Page, name: string) {
  return page.evaluateHandle((n) => {
    const tagged = document.querySelector(`[data-track="${n}"]`);
    if (tagged) return tagged;
    const host = n === "premise" ? document.querySelector("section[data-screen-label='Premise']") : document.querySelector("#engagement");
    return host ? host.children[1] : null;
  }, name);
}

async function go(page: Page, p: any) {
  if (p.kind === "track") {
    const t = await trackEl(page, p.track);
    await page.evaluate(([el, m]: any) => {
      const top = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, top - 68 + m * (el.offsetHeight - (window.innerHeight - 68)));
    }, [t, p.m]);
    await page.waitForTimeout(350);
    return;
  }
  if (p.kind === "hold" || p.kind === "hold-complete") {
    await page.evaluate((sel) => { const el = document.querySelector(sel)!; window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY); }, p.selector);
    for (let i = 0; i < 40; i++) { await page.mouse.wheel(0, 120); await page.waitForTimeout(40); }
    if (p.kind === "hold-complete") await page.waitForFunction(() => (window as any).__rbCtl && (window as any).__rbCtl.shown >= 0.999, null, { timeout: 30000 });
    else await page.waitForTimeout(300);
    return;
  }
  await page.evaluate(([sel, off]: any) => {
    const el = document.querySelector(sel)!;
    window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - off);
  }, [p.selector, p.offset ?? 0]);
  await page.waitForTimeout(p.kind === "time" ? p.waitMs : 300);
}

for (const [w, h] of spec.viewports) {
  test.describe(`${w}x${h}`, () => {
    for (const p of spec.points) {
      test(p.id, async ({ browser }) => {
        const dir = path.join(OUT, `${w}x${h}`);
        fs.mkdirSync(dir, { recursive: true });
        for (const [label, url] of [["ref", REF], ["port", PORT]]) {
          const page = await browser.newPage({ viewport: { width: w, height: h } });
          await page.goto(url, { waitUntil: "networkidle" });
          await page.waitForTimeout(600);
          await go(page, p);
          await page.screenshot({ path: path.join(dir, `${p.id}-${label}.png`) });
          await page.close();
        }
      });
    }
  });
}
