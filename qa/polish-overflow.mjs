#!/usr/bin/env node
// Horizontal-overflow sweep of the port. body is overflow-x:clip, so scrollWidth alone can hide
// content that is silently cut off; this also lists every element whose box pokes past the
// viewport and is not inside a container that deliberately clips it.
//   node qa/polish-overflow.mjs [--w 320,375,...] [--motion]

import { chromium } from "@playwright/test";

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i === -1 ? d : (process.argv[i + 1] ?? true); };
const widths = String(arg("w", "320,360,375,390,414,480,559,560,640,767,768,800,899,900,939,940,1024,1180,1280,1366,1440,1920,2560")).split(",").map(Number);
const motion = process.argv.includes("--motion");
const URL = "http://localhost:3000/" + (motion ? "" : "?motion=off");

const browser = await chromium.launch({ channel: "chrome", args: ["--hide-scrollbars"] });
for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 800 }, reducedMotion: motion ? "no-preference" : "reduce" });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(motion ? 1500 : 200);
  const res = await page.evaluate(() => {
    const de = document.documentElement;
    const cw = de.clientWidth;
    const bad = [];
    for (const el of document.body.querySelectorAll("*")) {
      const s = getComputedStyle(el);
      if (s.display === "none" || s.visibility === "hidden" || s.position === "fixed") continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (r.right <= cw + 0.5 && r.left >= -0.5) continue;
      // Skip if an ancestor inside the viewport clips it on purpose.
      let clipped = false;
      for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
        const as = getComputedStyle(a);
        if (as.overflowX !== "visible") {
          const b = a.getBoundingClientRect();
          if (b.right <= cw + 0.5 && b.left >= -0.5) { clipped = true; break; }
        }
      }
      if (clipped) continue;
      const sec = el.closest("[data-screen-label], header, footer");
      bad.push(`${sec ? sec.getAttribute("data-screen-label") || sec.tagName.toLowerCase() : "-"} <${el.tagName.toLowerCase()} class="${(el.getAttribute("class") || "").slice(0, 50)}"> ${r.left.toFixed(1)}..${r.right.toFixed(1)}`);
    }
    return { sw: de.scrollWidth, cw, bsw: document.body.scrollWidth, bad: bad.slice(0, 8), n: bad.length };
  });
  const ok = res.sw <= res.cw && res.n === 0;
  console.log(`${ok ? "ok " : "BAD"} @${w}: html scrollWidth ${res.sw} / clientWidth ${res.cw}, body scrollWidth ${res.bsw}, ${res.n} element(s) past the edge`);
  for (const b of res.bad) console.log(`     ${b}`);
  await ctx.close();
}
await browser.close();
