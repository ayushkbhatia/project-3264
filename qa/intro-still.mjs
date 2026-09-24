#!/usr/bin/env node
// Intro overlay stills: pixel diff of the overlay's DOM layer (grid lines + caption) between the
// reference and the port. Every Web Animation on both sides is paused and seeked to the same
// time T, the caption text is set to the same value, and the WebGL canvas is hidden (the relief
// is compared as a sequence by intro-sequence.mjs). The dev-only Next indicator is hidden.
//
//   node qa/intro-still.mjs [--w 1440,1280,1920,390] [--t 700,1500,2600] [--out qa/__screens__/intro/still]
import fs from "node:fs";
import path from "node:path";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import { REF, PORT, arg, launch, newIntroPage } from "./intro-lib.mjs";

const widths = String(arg("w", "1440,1280,1920,390")).split(",").map(Number);
const times = String(arg("t", "700,1500,2600")).split(",").map(Number);
const out = String(arg("out", "qa/__screens__/intro/still"));
fs.mkdirSync(out, { recursive: true });
const CAP = { 700: "2", 1500: "32", 2600: "32 × 64" };

async function still(browser, url, w, T) {
  const h = w < 768 ? 844 : 900;
  const { ctx, page } = await newIntroPage(browser, { width: w, height: h });
  await page.goto(url, { waitUntil: "commit" });
  await page.waitForFunction(() => window.__intro && window.__intro.start != null, null, { timeout: 20000, polling: 16 });
  await page.evaluate(({ T, cap }) => {
    const w = window.__intro.wrap;
    for (const a of w.getAnimations({ subtree: true })) { a.pause(); a.currentTime = T; }
    w.lastElementChild.textContent = cap;
    w.querySelector("canvas").style.visibility = "hidden";
    const s = document.createElement("style");
    s.textContent = "nextjs-portal{display:none!important}";
    document.head.appendChild(s);
  }, { T, cap: CAP[T] ?? "2" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(120);
  // re-assert the caption: the module's own step timers keep running while animations are paused
  await page.evaluate((cap) => { window.__intro.wrap.lastElementChild.textContent = cap; }, CAP[T] ?? "2");
  const buf = await page.screenshot();
  const capBox = await page.evaluate(() => {
    const c = window.__intro.wrap.lastElementChild, r = c.getBoundingClientRect(), cs = getComputedStyle(c);
    return { top: Math.round(r.top * 10) / 10, h: Math.round(r.height * 10) / 10, font: `${cs.fontSize} ${cs.fontWeight} ${cs.letterSpacing} ${cs.color} ${cs.fontFamily.split(",")[0]}` };
  });
  await ctx.close();
  return { png: PNG.sync.read(buf), capBox };
}

const browser = await launch();
for (const w of widths) for (const T of times) {
  const a = await still(browser, REF, w, T);
  const b = await still(browser, PORT, w, T);
  const { width, height } = a.png;
  const diff = new PNG({ width, height });
  const n = pixelmatch(a.png.data, b.png.data, diff.data, width, height, { threshold: 0.1 });
  const base = path.join(out, `${w}-t${T}`);
  fs.writeFileSync(`${base}-ref.png`, PNG.sync.write(a.png));
  fs.writeFileSync(`${base}-port.png`, PNG.sync.write(b.png));
  fs.writeFileSync(`${base}-diff.png`, PNG.sync.write(diff));
  console.log(`${w}px T=${T}ms  diff ${((100 * n) / (width * height)).toFixed(3)}%  caption ref ${JSON.stringify(a.capBox)} port ${JSON.stringify(b.capBox)}`);
}
await browser.close();
