// Shared helpers for the Playbooks QA scripts (reference on :4103, port on :3000; see
// .claude/launch.json).
//
// Motion is frozen with reduced motion unless a script asks otherwise: the reference's carousel
// stops and its hero video rests on the first frame, and the port does the same (the poster).

import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

export const REF = process.env.REF_URL || "http://127.0.0.1:4103/Playbooks.dc.html";
export const PORT = process.env.PORT_URL || "http://localhost:3000/playbooks";

export const SECTIONS = [
  ["header", "header"],
  ["hero", "#top"],
  ["library", "#library"],
  ["featured", '[data-screen-label="Featured"]'],
  ["ctas", '[data-screen-label="Library CTAs"]'],
  ["private-credit", "#private-credit"],
  ["fund-management", "#fund-management"],
  ["asset-management", "#asset-management"],
  ["recent", '[data-screen-label="Recently updated"]'],
  ["closing", '[data-screen-label="Closing"]'],
  ["footer", "footer"],
];

export function arg(name, dflt) {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? dflt : process.argv[i + 1];
}
export const flag = (name) => process.argv.includes(`--${name}`);

export async function launch() {
  return chromium.launch({ channel: "chrome", args: ["--hide-scrollbars"] });
}

export async function open(browser, url, w, h = 900, opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, reducedMotion: "reduce", ...opts });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => { if (m.type() === "error" && !/favicon|404 \(File not found\)/.test(m.text())) errors.push(m.text()); });
  await page.goto(url, { waitUntil: "networkidle", timeout: 90000 });
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({ content: "nextjs-portal{display:none!important} *{caret-color:transparent!important}" });
  return { ctx, page, errors };
}

/** Every image, decoded. Lazy ones are switched to eager first: the carousel's far slides sit
    beyond the lazy-load margin to the right and would otherwise never load (or resolve). */
export const IMAGES_READY = async (root) => {
  const imgs = [...(root || document).querySelectorAll("img")];
  imgs.forEach((i) => { if (i.loading === "lazy") i.loading = "eager"; });
  await Promise.all(imgs.map((i) => (i.complete ? i.decode().catch(() => {}) : new Promise((r) => { i.onload = i.onerror = r; }))));
};

/** Scroll through the page so every lazy image loads, then wait for them to decode. */
export async function loadAll(page) {
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += 600) {
    await page.evaluate((y) => scrollTo(0, y), y);
    await page.waitForTimeout(80);
  }
  await page.evaluate(`(${IMAGES_READY})().then(() => scrollTo(0, 0))`);
  await page.waitForTimeout(300);
}

export async function shootEl(page, sel, file) {
  const loc = page.locator(sel).first();
  await loc.scrollIntoViewIfNeeded();
  await page.evaluate(`(${IMAGES_READY})(document.querySelector(${JSON.stringify(sel)}))`);
  await page.waitForTimeout(150);
  await loc.screenshot({ path: file, animations: "disabled" });
}

/** Pixel diff of two PNGs (cropped to the smaller); returns the ratio and both sizes. */
export function diffPng(aFile, bFile, dFile) {
  const a = PNG.sync.read(fs.readFileSync(aFile));
  const b = PNG.sync.read(fs.readFileSync(bFile));
  const w = Math.min(a.width, b.width), h = Math.min(a.height, b.height);
  const crop = (img) => {
    if (img.width === w && img.height === h) return img;
    const o = new PNG({ width: w, height: h });
    PNG.bitblt(img, o, 0, 0, w, h, 0, 0);
    return o;
  };
  const D = new PNG({ width: w, height: h });
  const n = pixelmatch(crop(a).data, crop(b).data, D.data, w, h, { threshold: 0.1 });
  fs.writeFileSync(dFile, PNG.sync.write(D));
  return { ratio: n / (w * h), ref: `${a.width}x${a.height}`, port: `${b.width}x${b.height}` };
}

export function outDir(name) {
  const d = path.join("qa", "__screens__", name);
  fs.mkdirSync(d, { recursive: true });
  return d;
}

export const pct = (r) => (r * 100).toFixed(2) + "%";
