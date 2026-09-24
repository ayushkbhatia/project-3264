#!/usr/bin/env node
// Side-by-side visual diff of the port against the design reference.
//
//   node qa/compare.mjs --sel "#model" [--w 1440,1280,1920] [--h 900] [--out qa/__screens__/x]
//                       [--dpr 1] [--motion] [--no-mask] [--styles] [--scroll <px|sel>]
//                       [--full] [--wait 600]
//
// Default mode freezes motion on both sides: the reference runs with prefers-reduced-motion
// (no intro, vignettes at rest) and the port with ?motion=off. Canvases and vignette boxes
// are masked on both sides unless --no-mask, because the reference paints them and the port
// with motion off does not.
//
// Prints one line per width: sizes, diff ratio, and the three PNGs written (ref, port, diff).
// --styles also prints a computed-style diff of every element under the selector, paired by
// document order, which is usually faster than squinting at a diff image.
//
// Requires: `npm run dev` on :3000 and the reference served on :4100 (see .claude/launch.json).

import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

const REF = process.env.REF_URL || "http://127.0.0.1:4100/3264%20Home.dc.html";
const PORT = process.env.PORT_URL || "http://localhost:3000/";

function arg(name, dflt) {
  const i = process.argv.indexOf(`--${name}`);
  if (i === -1) return dflt;
  const v = process.argv[i + 1];
  return v === undefined || v.startsWith("--") ? true : v;
}

const sel = arg("sel", "body");
const widths = String(arg("w", "1440")).split(",").map(Number);
const height = Number(arg("h", 900));
const dpr = Number(arg("dpr", 1));
const motion = Boolean(arg("motion", false));
const mask = !arg("no-mask", false);
const styles = Boolean(arg("styles", false));
const full = Boolean(arg("full", false));
const wait = Number(arg("wait", 600));
const scroll = arg("scroll", null);
const slug = sel.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "page";
const out = String(arg("out", path.join("qa", "__screens__", slug)));
fs.mkdirSync(out, { recursive: true });

const HIDE_CSS = `
  canvas { visibility: hidden !important; }
  #top svg, [data-vig] svg { visibility: hidden !important; }
  * { caret-color: transparent !important; }
  nextjs-portal { display: none !important; }
`;

async function open(browser, url, w) {
  const ctx = await browser.newContext({
    viewport: { width: w, height },
    deviceScaleFactor: dpr,
    reducedMotion: motion ? "no-preference" : "reduce",
  });
  // Skip the port's once-per-session intro deterministically, before first paint.
  await ctx.addInitScript(() => { try { sessionStorage.setItem("3264:intro-played", "1"); } catch {} });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForSelector(sel, { state: "attached", timeout: 20000 });
  await page.evaluate(() => document.fonts.ready);
  if (mask) await page.addStyleTag({ content: HIDE_CSS });
  else await page.addStyleTag({ content: "nextjs-portal { display: none !important; }" });
  if (scroll != null) {
    await page.evaluate((s) => {
      const n = Number(s);
      if (!Number.isNaN(n)) window.scrollTo(0, n);
      else document.querySelector(s)?.scrollIntoView({ block: "start" });
    }, scroll);
  }
  await page.waitForTimeout(wait);
  return { ctx, page, errors };
}

async function shoot(page, file) {
  if (full) return page.screenshot({ path: file, fullPage: true });
  if (sel === "viewport") return page.screenshot({ path: file });
  const loc = page.locator(sel).first();
  // Lazy images (next/image) only load once scrolled near: bring the element into view and
  // wait for every image inside it to finish decoding before capturing.
  await loc.scrollIntoViewIfNeeded();
  await loc.evaluate(async (el) => {
    const imgs = [...el.querySelectorAll("img")];
    await Promise.all(imgs.map((i) => (i.complete ? i.decode().catch(() => {}) : new Promise((r) => { i.onload = i.onerror = r; }))));
  });
  await page.waitForTimeout(150);
  return loc.screenshot({ path: file, animations: "disabled" });
}

function diff(aFile, bFile, dFile) {
  const a = PNG.sync.read(fs.readFileSync(aFile));
  const b = PNG.sync.read(fs.readFileSync(bFile));
  const w = Math.min(a.width, b.width), h = Math.min(a.height, b.height);
  const crop = (img) => {
    if (img.width === w && img.height === h) return img;
    const o = new PNG({ width: w, height: h });
    PNG.bitblt(img, o, 0, 0, w, h, 0, 0);
    return o;
  };
  const A = crop(a), B = crop(b), D = new PNG({ width: w, height: h });
  const n = pixelmatch(A.data, B.data, D.data, w, h, { threshold: 0.1 });
  fs.writeFileSync(dFile, PNG.sync.write(D));
  return { ratio: n / (w * h), ref: `${a.width}x${a.height}`, port: `${b.width}x${b.height}` };
}

async function computed(page) {
  return page.evaluate((s) => {
    const root = document.querySelector(s);
    if (!root) return [];
    const R = root.getBoundingClientRect();
    const els = [root, ...root.querySelectorAll("*")].filter((el) => {
      const cs = getComputedStyle(el);
      return cs.display !== "none" && !["SCRIPT", "STYLE", "CANVAS", "svg"].includes(el.tagName) && !el.closest("svg");
    });
    return els.map((el) => {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      const own = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join(" ").trim();
      return {
        tag: el.tagName.toLowerCase(),
        text: own.slice(0, 40),
        // box is relative to the selected root, so sections compare even when the page above differs
        box: [Math.round(r.x - R.x), Math.round(r.y - R.y), Math.round(r.width), Math.round(r.height)].join(","),
        fs: cs.fontSize, fw: cs.fontWeight, ls: cs.letterSpacing, lh: cs.lineHeight, c: cs.color,
        bg: cs.backgroundColor, m: cs.margin, p: cs.padding,
        bt: cs.borderTopWidth === "0px" ? "none" : cs.borderTop,
        bb: cs.borderBottomWidth === "0px" ? "none" : cs.borderBottom,
        gap: cs.gap, ff: cs.fontFamily.split(",")[0],
      };
    }).filter((e) => e.text);
  }, sel);
}

const browser = await chromium.launch({ channel: "chrome", args: ["--hide-scrollbars"] });
try {
  for (const w of widths) {
    const portUrl = PORT + (motion ? "" : (PORT.includes("?") ? "&" : "?") + "motion=off");
    const ref = await open(browser, REF, w);
    const port = await open(browser, portUrl, w);
    const rf = path.join(out, `${w}-ref.png`), pf = path.join(out, `${w}-port.png`), df = path.join(out, `${w}-diff.png`);
    await shoot(ref.page, rf);
    await shoot(port.page, pf);
    const d = diff(rf, pf, df);
    console.log(`@${w} ${sel}: ref ${d.ref} port ${d.port} diff ${(d.ratio * 100).toFixed(2)}%  -> ${df}`);
    if (port.errors.length) console.log(`  port console errors:\n   ${port.errors.join("\n   ")}`);
    if (styles) {
      const [a, b] = [await computed(ref.page), await computed(port.page)];
      const byText = new Map(b.map((e) => [e.tag + "|" + e.text, e]));
      let shown = 0;
      for (const e of a) {
        const m = byText.get(e.tag + "|" + e.text) || b.find((x) => x.text === e.text);
        if (m) byText.delete(m.tag + "|" + m.text);
        if (!m) { console.log(`  MISSING in port: <${e.tag}> "${e.text}"`); shown++; continue; }
        const keys = ["box", "fs", "fw", "ls", "lh", "c", "bg", "m", "p", "bt", "bb", "gap", "ff"];
        const diffs = keys.filter((k) => e[k] !== m[k] && !(k === "tag"));
        if (diffs.length) {
          console.log(`  <${e.tag}> "${e.text}": ` + diffs.map((k) => `${k} ref=${e[k]} port=${m[k]}`).join(" | "));
          shown++;
        }
      }
      if (!shown) console.log("  computed styles: no differences on text-bearing elements");
    }
    await ref.ctx.close();
    await port.ctx.close();
  }
} finally {
  await browser.close();
}
