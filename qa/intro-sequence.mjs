#!/usr/bin/env node
// Intro relief: capture the reference and the port on a fresh load with motion on, align both
// on the moment the overlay is shown, and write side-by-side frames every --step ms
// (reference left, port right) plus a timeline summary.
//
//   node qa/intro-sequence.mjs [--w 1440] [--h 900] [--step 250] [--until 4500]
//                              [--only ref|port] [--warm] [--out qa/__screens__/intro/sequence]
// --warm loads each side once in a throwaway tab first, so the capture runs with a warm HTTP cache
// (the reference imports three.js from esm.sh at runtime; cold, that delays its relief clock).
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";
import { REF, PORT, arg, launch, newIntroPage, startScreencast, inkRatio } from "./intro-lib.mjs";

const W = Number(arg("w", 1440)), H = Number(arg("h", 900));
const step = Number(arg("step", 250)), until = Number(arg("until", 4500));
const only = arg("only", null);
const warm = Boolean(arg("warm", false));
const out = String(arg("out", "qa/__screens__/intro/sequence"));
fs.mkdirSync(out, { recursive: true });

async function capture(browser, name, url) {
  const { ctx, page, log } = await newIntroPage(browser, { width: W, height: H });
  if (warm) {
    // a separate tab has its own sessionStorage, so the port still plays in the capture tab
    const p0 = await ctx.newPage();
    await p0.goto(url, { waitUntil: "networkidle" });
    await p0.waitForTimeout(4500);
    await p0.close();
  }
  const sc = await startScreencast(page);
  await page.goto(url, { waitUntil: "commit" });
  await page.waitForFunction(() => window.__intro && window.__intro.gone != null, null, { timeout: 20000, polling: 100 }).catch(() => {});
  await page.waitForTimeout(400);
  await sc.stop();
  const S = await page.evaluate(() => {
    const s = window.__intro; return { t0: s.t0, start: s.start, gone: s.gone, glStart: s.glStart, caps: s.caps, samples: s.samples, anims: s.anims, contexts: s.contexts, attr: document.documentElement.getAttribute("data-intro") };
  });
  await ctx.close();
  return { name, S, frames: sc.frames, log };
}

function frameAt(frames, t) {
  let best = null;
  for (const f of frames) if (f.t <= t && (!best || f.t > best.t)) best = f;
  return best;
}

function half(png) {
  const w = png.width >> 1, h = png.height >> 1, o = new PNG({ width: w, height: h });
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) for (let c = 0; c < 4; c++) {
    const i = ((2 * y) * png.width + 2 * x) * 4 + c, j = i + png.width * 4;
    o.data[(y * w + x) * 4 + c] = (png.data[i] + png.data[i + 4] + png.data[j] + png.data[j + 4]) >> 2;
  }
  return o;
}

function sideBySide(a, b) {
  const w = a.width + 8 + b.width, h = Math.max(a.height, b.height), o = new PNG({ width: w, height: h });
  o.data.fill(255);
  PNG.bitblt(a, o, 0, 0, a.width, a.height, 0, 0);
  PNG.bitblt(b, o, 0, 0, b.width, b.height, a.width + 8, 0);
  return o;
}

function summary(r) {
  const { S } = r;
  const rel = (t) => (t == null ? "-" : Math.round(t - S.start));
  const firstBelow = S.samples.find((s) => s[0] > S.start && s[2] < 0.999);
  const peFirst = S.samples.find((s) => s[0] > S.start && s[3] === "none");
  console.log(`\n[${r.name}] overlay shown ${S.start ? Math.round(S.start - S.t0) : "never"}ms after navigation; data-intro=${S.attr}`);
  console.log(`  captions: ${S.caps.map(([t, v]) => `${v}@${rel(t)}`).join("  ")}`);
  console.log(`  canvas visible from +${rel(S.glStart)}ms; overlay opacity<1 from +${rel(firstBelow && firstBelow[0])}ms; pointer-events:none from +${rel(peFirst && peFirst[0])}ms; hidden at +${rel(S.gone)}ms`);
  console.log(`  overlay animations started: ${S.anims}; WebGL contexts requested on the intro canvas: ${S.contexts}`);
  const bad = r.log.filter((l) => /^(error|warning|pageerror)/.test(l));
  if (bad.length) console.log(`  console:\n    ${bad.join("\n    ")}`);
}

const browser = await launch();
const runs = [];
if (only !== "port") runs.push(await capture(browser, "ref", REF));
if (only !== "ref") runs.push(await capture(browser, "port", PORT));
await browser.close();
runs.forEach(summary);

const inks = {};
for (let ms = 0; ms <= until; ms += step) {
  const imgs = runs.map((r) => {
    const f = r.S.start && frameAt(r.frames, r.S.start + ms);
    if (!f) return null;
    (inks[r.name] ||= []).push(`${ms}:${inkRatio(f.data).toFixed(3)}`);
    return half(PNG.sync.read(Buffer.from(f.data, "base64")));
  });
  if (imgs.some((i) => !i)) continue;
  const img = imgs.length === 2 ? sideBySide(imgs[0], imgs[1]) : imgs[0];
  fs.writeFileSync(path.join(out, `t${String(ms).padStart(4, "0")}.png`), PNG.sync.write(img));
}
for (const [k, v] of Object.entries(inks)) console.log(`\n[${k}] ink ratio (centre 50%) by ms: ${v.join(" ")}`);
console.log(`\nframes → ${out}`);
