#!/usr/bin/env node
// Header across the tablet band: one line per nav link, button fully inside the viewport and
// not wrapped. node qa/polish-header-band.mjs
import { chromium } from "@playwright/test";
const b = await chromium.launch({ channel: "chrome" });
for (const w of [375, 560, 768, 850, 900, 939, 940, 960, 1024, 1280]) {
  const p = await (await b.newContext({ viewport: { width: w, height: 600 }, reducedMotion: "reduce" })).newPage();
  await p.goto("http://localhost:3000/?motion=off", { waitUntil: "networkidle" }); await p.evaluate(() => document.fonts.ready);
  const r = await p.evaluate(() => {
    const [, nav, btn] = document.querySelector("header > div").children;
    const navVisible = getComputedStyle(nav).visibility !== "hidden";
    const wrapped = !navVisible ? [] : [...nav.children].filter((x) => x.getClientRects().length > 1 || x.getBoundingClientRect().height > 20).map((x) => x.textContent);
    const bb = btn.getBoundingClientRect();
    const lastLink = nav.lastElementChild.getBoundingClientRect();
    return { navVisible, wrapped, btnRight: +bb.right.toFixed(1), btnH: bb.height, vw: document.documentElement.clientWidth, overlap: navVisible && lastLink.right > bb.left };
  });
  const ok = r.btnRight <= r.vw - 23 && r.btnH === 38 && !r.wrapped.length && !r.overlap;
  console.log(`${ok ? "ok " : "BAD"} @${w} nav ${r.navVisible ? "shown" : "hidden"} wrapped=[${r.wrapped}] button right ${r.btnRight}/${r.vw} h=${r.btnH} overlap=${r.overlap}`);
}
await b.close();
