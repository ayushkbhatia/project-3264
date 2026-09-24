#!/usr/bin/env node
// Precise (unrounded) geometry of a section on the reference and on the port.
//   node qa/polish-measure.mjs --sel "#model" --w 1440 [--q "h2,p,dd"] [--h 900]
// Prints, per matched descendant, its box relative to the section root with two decimals, so a
// sub-pixel page offset (the hero stub) can be told apart from a real layout difference.

import { chromium } from "@playwright/test";

const REF = "http://127.0.0.1:4100/3264%20Home.dc.html";
const PORT = "http://localhost:3000/?motion=off";
const arg = (n, d) => {
  const i = process.argv.indexOf(`--${n}`);
  return i === -1 ? d : process.argv[i + 1];
};
const sel = arg("sel", "#model");
const q = arg("q", "*");
const widths = String(arg("w", "1440")).split(",").map(Number);
const height = Number(arg("h", 900));

const browser = await chromium.launch({ channel: "chrome", args: ["--hide-scrollbars"] });
for (const w of widths) {
  const rows = {};
  for (const [name, url] of [["ref", REF], ["port", PORT]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height }, reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    rows[name] = await page.evaluate(
      ([s, q]) => {
        const root = document.querySelector(s);
        const R = root.getBoundingClientRect();
        const f = (n) => n.toFixed(2);
        const out = [`ROOT y=${f(R.y + scrollY)} w=${f(R.width)} h=${f(R.height)}`];
        for (const el of root.querySelectorAll(q)) {
          const r = el.getBoundingClientRect();
          const t = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join(" ").trim();
          out.push(`${el.tagName.toLowerCase()} "${t.slice(0, 24)}" ${f(r.x - R.x)},${f(r.y - R.y)} ${f(r.width)}x${f(r.height)}`);
        }
        return out;
      },
      [sel, q],
    );
    await ctx.close();
  }
  console.log(`@${w} ${sel}`);
  const n = Math.max(rows.ref.length, rows.port.length);
  for (let i = 0; i < n; i++) {
    const a = rows.ref[i] ?? "", b = rows.port[i] ?? "";
    console.log(a === b ? `  = ${a}` : `  R ${a}\n  P ${b}`);
  }
}
await browser.close();
