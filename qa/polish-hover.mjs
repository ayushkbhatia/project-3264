#!/usr/bin/env node
// Hover parity: hovers the same element on the reference and the port and compares the
// computed colours of the element and of every text-bearing descendant, then screenshots the
// hovered element (with a margin) on both sides into qa/__screens__/polish/hover/.
//   node qa/polish-hover.mjs [--w 1440]

import { chromium } from "@playwright/test";
import fs from "node:fs";

const REF = "http://127.0.0.1:4100/3264%20Home.dc.html";
const PORT = "http://localhost:3000/?motion=off";
const OUT = "qa/__screens__/polish/hover";
fs.mkdirSync(OUT, { recursive: true });
const wi = process.argv.indexOf("--w");
const W = wi === -1 ? 1440 : Number(process.argv[wi + 1]);

const TARGETS = [
  ["header-cta", "header a[href='#contact']", 0],
  ["hero-primary", "#top a[href='#contact']", 0],
  ["hero-secondary", "#top a[href='#model']", 0],
  ["nav-industries", "header nav a", 2],
  ["nav-company", "header nav a", 5],
  ["industry-r1", "#industries a", 0],
  ["industry-r4", "#industries a", 3],
  ["playbook-1", "#playbooks a", 0],
  ["playbook-3", "#playbooks a", 2],
  ["closing-primary", "#contact a", 0],
  ["footer-image-cta", "[data-screen-label='Footer image'] a", 0],
  ["footer-link", "footer a", 0],
  ["footer-mailto", "footer a[href^='mailto']", 0],
];

async function probe(page, sel, idx, hover) {
  const loc = page.locator(sel).nth(idx);
  await loc.scrollIntoViewIfNeeded();
  // Park the pointer away first so the "rest" state is really at rest.
  await page.mouse.move(1, 1);
  await page.waitForTimeout(80);
  if (hover) {
    await loc.hover();
    await page.waitForTimeout(250);
  }
  return loc.evaluate((el) => {
    const pick = (n) => {
      const s = getComputedStyle(n);
      return `c=${s.color} bg=${s.backgroundColor} bt=${s.borderTopColor} bb=${s.borderBottomWidth === "0px" ? "-" : s.borderBottomColor}`;
    };
    const rows = [`self ${pick(el)}`];
    for (const n of el.querySelectorAll("*")) {
      const own = [...n.childNodes].filter((x) => x.nodeType === 3).map((x) => x.textContent.trim()).join("").trim();
      if (own) rows.push(`"${own.slice(0, 18)}" c=${getComputedStyle(n).color}`);
    }
    return rows;
  });
}

const browser = await chromium.launch({ channel: "chrome", args: ["--hide-scrollbars"] });
const pages = {};
for (const [name, url] of [["ref", REF], ["port", PORT]]) {
  const ctx = await browser.newContext({ viewport: { width: W, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({ content: "canvas{visibility:hidden!important} nextjs-portal{display:none!important}" });
  pages[name] = page;
}
let bad = 0;
for (const [label, sel, idx] of TARGETS) {
  for (const hover of [false, true]) {
    const r = await probe(pages.ref, sel, idx, hover);
    const p = await probe(pages.port, sel, idx, hover);
    const same = JSON.stringify(r) === JSON.stringify(p);
    if (!same) bad++;
    console.log(`${same ? "OK  " : "DIFF"} ${label} ${hover ? "hover" : "rest "}`);
    if (!same) {
      for (let i = 0; i < Math.max(r.length, p.length); i++) {
        if (r[i] !== p[i]) console.log(`     R ${r[i]}\n     P ${p[i]}`);
      }
    }
    if (hover) {
      for (const side of ["ref", "port"]) {
        const page = pages[side];
        const box = await page.locator(sel).nth(idx).boundingBox();
        const clip = { x: Math.max(0, box.x - 12), y: Math.max(0, box.y - 12), width: Math.min(W - Math.max(0, box.x - 12), box.width + 24), height: box.height + 24 };
        await page.screenshot({ path: `${OUT}/${W}-${label}-${side}.png`, clip });
      }
    }
  }
}
console.log(bad ? `${bad} state(s) differ` : "all hover/rest states identical");
await browser.close();
