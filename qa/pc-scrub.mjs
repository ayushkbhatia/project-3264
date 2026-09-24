#!/usr/bin/env node
// Private Credit: scrub captures of the four pinned sequences, reference vs port.
//
//   node qa/pc-scrub.mjs [--vp 1440x900,1280x800,1920x1080,1440x760] [--sections reality,platform]
//                        [--ps 0.1,0.2] [--out qa/__screens__/pc-scrub]
//
// For every point in design_handoff_private_credit/qa/scrub-points.json (or --ps), scrolls both
// sides to  trackTop + p * (track.offsetHeight - pin.offsetHeight)  — the module's own mapping —
// waits for the 400ms heartbeat and the 400ms screen fades, then compares:
//   * the viewport pixels (dev badge hidden, blip frozen by reduced motion)
//   * the pin's visible text (innerText), which catches wrong screens / figures outright
// and writes <section>-<p>.side.png (reference left, port right) for inspection by eye.
//
// Both sides load with ?t=16&intro=off. Requires the port on :3000 and the reference on :4101.

import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

const REF = "http://127.0.0.1:4101/Private%20Credit.dc.html?t=16&intro=off";
const PORT = process.env.PORT_URL || "http://localhost:3000/industries/private-credit?t=16&intro=off";

function arg(name, dflt) {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? dflt : process.argv[i + 1];
}
const vps = String(arg("vp", "1440x900,1280x800,1920x1080,1440x760")).split(",").map((v) => v.split("x").map(Number));
const only = arg("sections", null)?.split(",");
const customPs = arg("ps", null)?.split(",").map(Number);
const outRoot = arg("out", "qa/__screens__/pc-scrub");
const points = JSON.parse(fs.readFileSync("design_handoff_private_credit/qa/scrub-points.json", "utf8"));

async function open(browser, url, w, h) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({ content: "nextjs-portal{display:none!important} *{caret-color:transparent!important}" });
  await page.waitForTimeout(800);
  return { ctx, page, errors };
}

async function scrub(page, section, p) {
  return page.evaluate(({ section, p }) => {
    const sec = document.querySelector(section);
    const track = [...sec.querySelectorAll("div")].find(
      (d) => d.firstElementChild && getComputedStyle(d.firstElementChild).position === "sticky",
    );
    const pin = track.firstElementChild;
    const top = track.getBoundingClientRect().top + scrollY;
    const y = Math.round(top + p * (track.offsetHeight - pin.offsetHeight));
    scrollTo(0, y);
    return { y, track: track.offsetHeight, pin: pin.offsetHeight };
  }, { section, p });
}

async function pinState(page, section) {
  return page.evaluate((section) => {
    const sec = document.querySelector(section);
    const track = [...sec.querySelectorAll("div")].find(
      (d) => d.firstElementChild && getComputedStyle(d.firstElementChild).position === "sticky",
    );
    const pin = track.firstElementChild;
    const r = pin.getBoundingClientRect();
    // visible text only: walk text nodes whose element chain is not transparent
    const out = [];
    const walk = (el, op) => {
      const cs = getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden") return;
      const o = op * parseFloat(cs.opacity || "1");
      if (o < 0.05) return;
      for (const n of el.childNodes) {
        if (n.nodeType === 3) { const t = n.textContent.replace(/\s+/g, " ").trim(); if (t) out.push(t); }
        else if (n.nodeType === 1) walk(n, o);
      }
    };
    walk(pin, 1);
    return { top: Math.round(r.top), height: Math.round(r.height), text: out.join(" | ") };
  }, section);
}

function diff(a, b) {
  const A = PNG.sync.read(a), B = PNG.sync.read(b);
  const w = Math.min(A.width, B.width), h = Math.min(A.height, B.height);
  const n = pixelmatch(A.data, B.data, null, w, h, { threshold: 0.1 });
  return n / (w * h);
}

function side(a, b, file) {
  const A = PNG.sync.read(a), B = PNG.sync.read(b);
  const gap = 12, W = A.width + B.width + gap, H = Math.max(A.height, B.height);
  const o = new PNG({ width: W, height: H });
  o.data.fill(34);
  PNG.bitblt(A, o, 0, 0, A.width, A.height, 0, 0);
  PNG.bitblt(B, o, 0, 0, B.width, B.height, A.width + gap, 0);
  fs.writeFileSync(file, PNG.sync.write(o));
}

const browser = await chromium.launch({ channel: "chrome", args: ["--hide-scrollbars"] });
let worst = 0, textMismatch = 0, total = 0;
try {
  for (const [w, h] of vps) {
    const dir = path.join(outRoot, `${w}x${h}`);
    fs.mkdirSync(dir, { recursive: true });
    const ref = await open(browser, REF, w, h);
    const port = await open(browser, PORT, w, h);
    for (const [name, def] of Object.entries(points)) {
      if (name.startsWith("_") || (only && !only.includes(name))) continue;
      const ps = customPs || def.points.map((x) => x.p);
      for (const p of ps) {
        await scrub(ref.page, def.section, p);
        await scrub(port.page, def.section, p);
        await ref.page.waitForTimeout(950);
        await port.page.waitForTimeout(50);
        const [ra, pa] = [await ref.page.screenshot(), await port.page.screenshot()];
        const [rs, ps2] = [await pinState(ref.page, def.section), await pinState(port.page, def.section)];
        const d = diff(ra, pa);
        const tm = rs.text !== ps2.text;
        total++;
        if (tm) textMismatch++;
        worst = Math.max(worst, d);
        side(ra, pa, path.join(dir, `${name}-${p}.side.png`));
        const flag = d > 0.005 || tm ? "  <<" : "";
        console.log(`${w}x${h} ${name} p=${p}: diff ${(d * 100).toFixed(2)}%  pin ${rs.top}/${rs.height} vs ${ps2.top}/${ps2.height}${tm ? "  TEXT DIFFERS" : ""}${flag}`);
        if (tm) {
          let k = 0;
          while (rs.text[k] === ps2.text[k]) k++;
          console.log(`   ref : …${rs.text.slice(Math.max(0, k - 120), k + 160)}`);
          console.log(`   port: …${ps2.text.slice(Math.max(0, k - 120), k + 160)}`);
        }
      }
    }
    for (const [side_, s] of [["ref", ref], ["port", port]]) if (s.errors.length) console.log(`  ${side_} errors: ${s.errors.slice(0, 5).join(" / ")}`);
    const pe = await port.page.evaluate(() => window.__dcErrs || null);
    if (pe) console.log(`  port __dcErrs: ${JSON.stringify(pe)}`);
    await ref.ctx.close();
    await port.ctx.close();
  }
} finally {
  await browser.close();
}
console.log(`\n${total} points, worst pixel diff ${(worst * 100).toFixed(2)}%, text mismatches ${textMismatch}`);
