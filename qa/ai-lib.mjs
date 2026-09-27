// Shared helpers for the AI Engineering QA scripts (reference on :4102, port on :3000).
//
// Both sides load with ?intro=off. Positions are computed the same way on both pages, so a
// capture compares like with like:
//   anchor  element top `offset` px below the viewport top
//   track   pinned progress m: scrollY = trackTop - 68 + m·(trackHeight - (innerHeight - 68))
// The 03 hold (RebuildPlatform) locks the page when 03's top reaches 88px from below; a jump
// that lands well past it marks 03 complete, so programmatic scrolls past 03 are safe.

import { chromium } from "@playwright/test";
import fs from "node:fs";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

export const REF = process.env.REF_URL || "http://127.0.0.1:4102/AI%20Engineering.dc.html?intro=off";
export const PORT = process.env.PORT_URL || "http://localhost:3000/ai-engineering?intro=off";

export function arg(name, dflt) {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? dflt : process.argv[i + 1];
}
export const flag = (name) => process.argv.includes(`--${name}`);

export async function launch() {
  return chromium.launch({ channel: "chrome", args: ["--hide-scrollbars"] });
}

export async function open(browser, url, w, h, opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, ...opts });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({ content: "nextjs-portal{display:none!important} *{caret-color:transparent!important}" });
  // The reference's two embedded canvas prototypes (Rebuild Platform, Rebuild graphic) carry
  // their standalone preview's `body { background:#E9E7E2 }`, and the prototype runtime injects
  // it page-wide once they mount. The page's own style and spec 00 say #F6F5F2, which the port
  // keeps; restore it on the reference so captures compare the design, not the leak.
  if (url.includes(":4102")) await page.addStyleTag({ content: "body{background:#F6F5F2!important}" });
  await page.waitForTimeout(800);
  return { ctx, page, errors };
}

/** Scroll to a scrub point. Returns the scrollY used. */
export async function go(page, p) {
  return page.evaluate((p) => {
    if (p.kind === "track") {
      const el = document.querySelector(`[data-track="${p.track}"]`) ||
        (p.track === "premise" ? document.querySelector("section[data-screen-label='Premise']").children[1] : document.querySelector("#engagement").children[1]);
      const top = el.getBoundingClientRect().top + scrollY;
      const y = Math.round(top - 68 + p.m * (el.offsetHeight - (innerHeight - 68)));
      scrollTo(0, y);
      return y;
    }
    const el = document.querySelector(p.selector);
    const y = Math.round(el.getBoundingClientRect().top + scrollY - (p.offset ?? 0));
    scrollTo(0, y);
    return y;
  }, p);
}

/** Wait for every <img> in view to be decoded (next/image lazy-loads). */
export async function settleImages(page) {
  await page.evaluate(async () => {
    const imgs = [...document.images].filter((i) => {
      const r = i.getBoundingClientRect();
      return r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth && getComputedStyle(i).display !== "none";
    });
    const one = (i) => (i.complete ? i.decode().catch(() => {}) : new Promise((r) => { i.onload = i.onerror = r; }));
    await Promise.race([Promise.all(imgs.map(one)), new Promise((r) => setTimeout(r, 20000))]);
  });
}

export function diff(a, b, out) {
  const A = PNG.sync.read(a), B = PNG.sync.read(b);
  const w = Math.min(A.width, B.width), h = Math.min(A.height, B.height);
  const D = out ? new PNG({ width: w, height: h }) : null;
  const n = pixelmatch(A.data, B.data, D ? D.data : null, w, h, { threshold: 0.1 });
  if (out) fs.writeFileSync(out, PNG.sync.write(D));
  return n / (w * h);
}

/** Share of pixels where any channel differs by more than `tol` (catches the colour shifts
 *  pixelmatch's perceptual threshold lets through, e.g. a page background a few shades off). */
export function strictDiff(a, b, tol = 6) {
  const A = PNG.sync.read(a), B = PNG.sync.read(b);
  const w = Math.min(A.width, B.width), h = Math.min(A.height, B.height);
  let n = 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = (y * A.width + x) * 4, j = (y * B.width + x) * 4;
    if (Math.abs(A.data[i] - B.data[j]) > tol || Math.abs(A.data[i + 1] - B.data[j + 1]) > tol || Math.abs(A.data[i + 2] - B.data[j + 2]) > tol) n++;
  }
  return n / (w * h);
}

export function side(a, b, file) {
  const A = PNG.sync.read(a), B = PNG.sync.read(b);
  const gap = 12, W = A.width + B.width + gap, H = Math.max(A.height, B.height);
  const o = new PNG({ width: W, height: H });
  o.data.fill(34);
  PNG.bitblt(A, o, 0, 0, A.width, A.height, 0, 0);
  PNG.bitblt(B, o, 0, 0, B.width, B.height, A.width + gap, 0);
  fs.writeFileSync(file, PNG.sync.write(o));
}

/** Visible text inside `root` (opacity-aware), for a copy/state comparison. */
export async function visibleText(page, selector) {
  return page.evaluate((sel) => {
    const root = document.querySelector(sel);
    if (!root) return "";
    const out = [];
    const walk = (el, op) => {
      const cs = getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden") return;
      const o = op * parseFloat(cs.opacity || "1");
      if (o < 0.05) return;
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      for (const n of el.childNodes) {
        if (n.nodeType === 3) { const t = n.textContent.replace(/\s+/g, " ").trim(); if (t) out.push(t); }
        else if (n.nodeType === 1) walk(n, o);
      }
    };
    walk(root, 1);
    return out.join(" | ");
  }, selector);
}
