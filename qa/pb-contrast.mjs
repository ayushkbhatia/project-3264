#!/usr/bin/env node
// Playbooks: contrast of the text axe cannot judge, set over imagery (the hero video, the CTA
// washes, the closing valley). For each block, the text is hidden, the pixels behind it are
// captured (each rendered line's own box), and the worst case (the 95th-percentile pixel against the text: brightest behind
// light text, darkest behind dark text) is measured against the text colour.
// Large text (≥24px, or ≥18.66px bold) needs 3:1, the rest 4.5:1 (WCAG 1.4.3).
//
//   node qa/pb-contrast.mjs      (the hero is checked at three frames, incl. the brightest)

import { PNG } from "pngjs";
import { PORT, launch, loadAll } from "./pb-lib.mjs";

const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const L = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

const TARGETS = [
  ["hero h1", "#top h1"],
  ["hero secondary button", '#top a[href$="#engagement"]'],
  ["subscribe title", '[data-screen-label="Library CTAs"] h3 >> nth=0'],
  ["subscribe body", '[data-screen-label="Library CTAs"] p >> nth=0'],
  ["platform title", '[data-screen-label="Library CTAs"] h3 >> nth=1'],
  ["platform body", '[data-screen-label="Library CTAs"] p >> nth=1'],
  ["platform link", '[data-screen-label="Library CTAs"] a[href="/industries/private-credit"]'],
  ["closing label", '[data-screen-label="Closing"] h2 >> xpath=preceding-sibling::div'],
  ["closing h2", '[data-screen-label="Closing"] h2'],
  ["closing body", '[data-screen-label="Closing"] p'],
];

async function measure(page, name, sel) {
  const loc = page.locator(sel).first();
  await loc.scrollIntoViewIfNeeded();
  const info = await loc.evaluate((el) => {
    const cs = getComputedStyle(el);
    // Resolve through a canvas: Tailwind's opacity modifiers compute to oklab(), not rgb().
    const cx = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
    cx.fillStyle = cs.color;
    cx.fillRect(0, 0, 1, 1);
    const d = cx.getImageData(0, 0, 1, 1).data;
    const m = [d[0], d[1], d[2], d[3] / 255];
    const large = parseFloat(cs.fontSize) >= 24 || (parseFloat(cs.fontSize) >= 18.66 && Number(cs.fontWeight) >= 700);
    el.dataset.qaColor = el.style.color;
    el.style.setProperty("color", "transparent", "important");
    el.querySelectorAll("*").forEach((c) => c.style.setProperty("color", "transparent", "important"));
    return { rgba: m, large, size: cs.fontSize };
  });
  await page.waitForTimeout(60);
  // Only the boxes the text actually occupies, line by line (not the block's empty width).
  const rects = await loc.evaluate((el) => {
    const range = document.createRange();
    range.selectNodeContents(el);
    return [...range.getClientRects()].filter((r) => r.width > 2 && r.height > 2).map((r) => ({ x: r.x, y: r.y, width: r.width, height: r.height }));
  });
  const lum = [];
  for (const clip of rects) {
    const png = PNG.sync.read(await page.screenshot({ clip }));
    for (let i = 0; i < png.data.length; i += 4) lum.push({ l: L(png.data[i], png.data[i + 1], png.data[i + 2]), px: [png.data[i], png.data[i + 1], png.data[i + 2]] });
  }
  await loc.evaluate((el) => { el.style.removeProperty("color"); el.querySelectorAll("*").forEach((c) => c.style.removeProperty("color")); });
  lum.sort((a, b) => a.l - b.l);
  const [r, g, b, a = 1] = info.rgba;
  // light text: worst background is the bright end; dark text: the dark end (text-shadow halos,
  // part of how the design sets its type on the washes, stay in the sample)
  const worst = L(r, g, b) > 0.4 ? lum[Math.floor(lum.length * 0.95)] : lum[Math.floor(lum.length * 0.05)];
  // text with alpha: composite it over that worst pixel
  const t = [r, g, b].map((c, k) => c * a + worst.px[k] * (1 - a));
  const cr = ratio(L(...t), worst.l);
  const need = info.large ? 3 : 4.5;
  console.log(`${cr >= need ? "ok " : "FAIL"} ${name.padEnd(22)} ${cr.toFixed(2)}:1 (needs ${need}, ${info.size}${info.large ? " large" : ""})`);
  return cr >= need;
}

const browser = await launch();
try {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "no-preference" });
  const page = await ctx.newPage();
  await page.goto(PORT, { waitUntil: "networkidle" });
  await page.waitForFunction(() => { const v = document.querySelector("[data-hero-video]"); return v && v.readyState >= 3 && v.style.opacity === "1"; }, null, { timeout: 20000 });
  for (const t of [0, 6.5, 13]) {
    await page.evaluate(async (t) => { const v = document.querySelector("[data-hero-video]"); v.pause(); v.currentTime = t; await new Promise((r) => v.addEventListener("seeked", r, { once: true })); }, t);
    await page.evaluate(() => scrollTo(0, 0));
    console.log(`hero frame t=${t}s`);
    await measure(page, "hero h1", "#top h1");
    await measure(page, "hero secondary button", '#top a[href$="#engagement"]');
  }
  await loadAll(page);
  for (const [name, sel] of TARGETS.slice(2)) await measure(page, name, sel);
  await ctx.close();
} finally {
  await browser.close();
}
