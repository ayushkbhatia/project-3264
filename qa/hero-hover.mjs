// Hero QA: CTA hover states, reference vs port (reduced motion on the reference, ?motion=off on the port).
import { chromium } from "@playwright/test";
import fs from "node:fs";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
const OUT = "qa/__screens__/hero/hover";
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", args: ["--hide-scrollbars"] });
const shots = {};
for (const [label, url] of [["ref", "http://127.0.0.1:4100/3264%20Home.dc.html"], ["port", "http://localhost:3000/?motion=off"]]) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({ content: "canvas, #top svg { visibility: hidden !important } nextjs-portal { display: none !important }" });
  for (const name of ["Book a mapping session", "How we charge"]) {
    const a = page.locator("#top a", { hasText: name });
    await a.hover();
    await page.waitForTimeout(250);
    const box = await page.locator("#top h1 + p + div").boundingBox();
    const buf = await page.screenshot({ clip: { x: box.x - 4, y: box.y - 4, width: box.width + 8, height: box.height + 8 } });
    const cs = await a.evaluate((el) => { const c = getComputedStyle(el); return `${c.color} / ${c.backgroundColor} / ${c.borderTopColor} / ${el.getBoundingClientRect().height}px`; });
    shots[`${label}-${name}`] = { buf, cs };
    fs.writeFileSync(`${OUT}/${label}-${name.replace(/\W+/g, "-")}.png`, buf);
  }
  await ctx.close();
}
for (const name of ["Book a mapping session", "How we charge"]) {
  const a = PNG.sync.read(shots[`ref-${name}`].buf), b = PNG.sync.read(shots[`port-${name}`].buf);
  const w = Math.min(a.width, b.width), h = Math.min(a.height, b.height);
  const n = a.width === b.width && a.height === b.height ? pixelmatch(a.data, b.data, null, w, h, { threshold: 0.1 }) : -1;
  console.log(`hover "${name}": ref ${shots[`ref-${name}`].cs} | port ${shots[`port-${name}`].cs} | diff ${n < 0 ? "size mismatch" : ((n / (w * h)) * 100).toFixed(2) + "%"}`);
}
await browser.close();
