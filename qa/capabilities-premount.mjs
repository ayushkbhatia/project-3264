#!/usr/bin/env node
// Server-rendered (pre-mount) geometry vs the module's laid-out geometry, on the port.
// ?motion=off never mounts the module, so it shows exactly what paints before hydration.
//   node qa/capabilities-premount.mjs
import { chromium } from "@playwright/test";
const geo = () => {
  const track = document.querySelector("#capabilities > div:nth-child(2)");
  const grid = track.firstElementChild.firstElementChild, left = grid.children[0], stage = grid.children[1];
  const R = (n) => { const b = n.getBoundingClientRect(); return [b.x, b.y - track.getBoundingClientRect().y, b.width, b.height].map((v) => Math.round(v * 10) / 10).join(","); };
  const cs = getComputedStyle(grid), p = left.querySelector("p"), ul = left.querySelector("ul");
  return { track: track.offsetHeight, cols: cs.gridTemplateColumns, gap: cs.columnGap + "/" + cs.rowGap, rail: R(left.children[0]), wrap: R(left.children[1]),
    panel0: R(left.children[1].children[0]), stage: R(stage), pFs: getComputedStyle(p).fontSize, pM: getComputedStyle(p).marginTop, ul: getComputedStyle(ul).display,
    doc: document.documentElement.scrollHeight };
};
const browser = await chromium.launch({ channel: "chrome", args: ["--hide-scrollbars"] });
let bad = 0;
for (const [w, h] of [[1440, 900], [1280, 800], [1920, 1080], [1440, 640], [1024, 768], [834, 1112], [900, 900], [768, 1024], [939, 800]]) {
  const r = {};
  for (const [name, q] of [["pre", "?motion=off"], ["mounted", ""]]) {
    const page = await (await browser.newContext({ viewport: { width: w, height: h } })).newPage();
    await page.goto("http://localhost:3000/" + q, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(900);
    r[name] = await page.evaluate(geo);
    await page.close();
  }
  const diffs = Object.keys(r.pre).filter((k) => {
    if (r.pre[k] === r.mounted[k]) return false;
    const a = String(r.pre[k]).split(/[,/ ]/).map(parseFloat), b = String(r.mounted[k]).split(/[,/ ]/).map(parseFloat);
    return !(a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= 1)); // sub-pixel rounding is fine
  });
  if (diffs.length) bad++;
  console.log(`@${w}x${h} ${diffs.length ? "DIFF " + diffs.map((k) => `${k}: pre ${r.pre[k]} | mounted ${r.mounted[k]}`).join("  ;  ") : "pre-mount == mounted"}   (stage ${r.mounted.stage}, wrap ${r.mounted.wrap})`);
}
await browser.close();
process.exit(bad ? 1 : 0);
