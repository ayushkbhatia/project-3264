#!/usr/bin/env node
// Clean responsive captures of the owned sections, reference beside port, one sheet per width.
// The header is made non-sticky for the capture only (Playwright stitches tall element shots
// and a sticky header would be painted into the middle of them).
//   node qa/polish-resp.mjs --w 375,560 [--only "#work,footer"] [--port-only]

import { chromium } from "@playwright/test";
import fs from "node:fs";
import { PNG } from "pngjs";

const REF = "http://127.0.0.1:4100/3264%20Home.dc.html";
const PORT = "http://localhost:3000/?motion=off";
const OUT = "qa/__screens__/polish/resp";
fs.mkdirSync(OUT, { recursive: true });
const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i === -1 ? d : process.argv[i + 1]; };
const widths = String(arg("w", "375")).split(",").map(Number);
const ALL = ["header", "#model", "#industries", "#work", "[data-screen-label='Stack']", "#company", "#playbooks", "#contact", "[data-screen-label='Footer image']", "footer"];
const only = arg("only", null);
const sels = only ? only.split(",") : ALL;
const portOnly = process.argv.includes("--port-only");
const CSS = "header{position:relative!important} canvas{visibility:hidden!important} nextjs-portal{display:none!important}";

const browser = await chromium.launch({ channel: "chrome", args: ["--hide-scrollbars"] });
for (const w of widths) {
  const shots = {};
  for (const [side, url] of portOnly ? [["port", PORT]] : [["ref", REF], ["port", PORT]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.addStyleTag({ content: CSS });
    await page.waitForTimeout(150);
    shots[side] = [];
    for (const s of sels) {
      // next/image is lazy: bring the section into view and let its images finish first.
      await page.locator(s).first().scrollIntoViewIfNeeded();
      await page.waitForFunction((sel) => [...document.querySelector(sel).querySelectorAll("img")].every((i) => i.complete && i.naturalWidth > 0), s, { timeout: 10000 }).catch(() => {});
      const buf = await page.locator(s).first().screenshot({ animations: "disabled" });
      shots[side].push(PNG.sync.read(buf));
    }
    await ctx.close();
  }
  // Compose: one column per side, sections stacked with a 12px magenta separator.
  const sides = Object.keys(shots);
  const colW = w, gap = 24;
  const colH = (side) => shots[side].reduce((h, p) => h + p.height + 12, 0);
  const H = Math.max(...sides.map(colH));
  const out = new PNG({ width: sides.length * colW + (sides.length - 1) * gap, height: H });
  out.data.fill(0x40);
  sides.forEach((side, ci) => {
    let y = 0;
    for (const p of shots[side]) {
      PNG.bitblt(p, out, 0, 0, Math.min(p.width, colW), p.height, ci * (colW + gap), y);
      y += p.height;
      for (let yy = y; yy < y + 12 && yy < H; yy++)
        for (let x = ci * (colW + gap); x < ci * (colW + gap) + colW; x++) {
          const i = (yy * out.width + x) * 4; out.data[i] = 255; out.data[i + 1] = 0; out.data[i + 2] = 255; out.data[i + 3] = 255;
        }
      y += 12;
    }
  });
  const file = `${OUT}/sheet-${w}${only ? "-" + only.replace(/\W+/g, "") : ""}.png`;
  fs.writeFileSync(file, PNG.sync.write(out));
  console.log(`@${w}: ${file} (${out.width}x${out.height})`);
}
await browser.close();
