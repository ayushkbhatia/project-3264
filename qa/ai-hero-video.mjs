#!/usr/bin/env node
// AI Engineering hero video (design_handoff_ai_engineering_hero_video): the handoff's
// qa/hero-video.spec.ts checks, plus the reference comparison and the port's own additions.
//
//   node qa/ai-hero-video.mjs [--base http://localhost:3000] [--out qa/__screens__/ai-hero-video]
//
//   1. loads: the video plays, self-hosted; the veil's first draw removes the video's CSS
//      filter; the canvas is opaque grey; no hero-plane.png request; the poster is fetched once
//      (its preload is reused) and is the LCP
//   2. never a flash of colour on load: sampled screenshots of the hero stay monochrome
//   3. the pointer trail reveals colour and refills to grey after ~2.4s
//   4. reference vs port, both videos parked on the same frame: identical hero
//   5. reduced motion: paused on the first frame, no trail; identical to the reference
//   6. the footer pause control pauses and resumes the video; off screen it pauses too

import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";
import { REF, arg, diff, launch, side } from "./ai-lib.mjs";

const BASE = arg("base", "http://localhost:3000");
const PORT = `${BASE}/ai-engineering?intro=off`;
const out = arg("out", "qa/__screens__/ai-hero-video");
fs.mkdirSync(out, { recursive: true });
const HERO = { x: 0, y: 69, width: 1440, height: 831 };

const browser = await launch();
const report = (ok, msg) => console.log(`${ok ? "pass" : "FAIL"}  ${msg}`);
const alphaAt = (page, x, y) => page.evaluate(([px, py]) => {
  const c = document.querySelector("#top canvas"), r = c.getBoundingClientRect();
  return c.getContext("2d").getImageData(Math.floor(px - r.left), Math.floor(py - r.top), 1, 1).data[3];
}, [x, y]);
const vstate = (page) => page.evaluate(() => {
  const v = document.querySelector("#top video");
  return { rs: v.readyState, paused: v.paused, t: +v.currentTime.toFixed(2), filter: v.style.filter, src: v.currentSrc };
});
const newPage = async (opts = {}) => {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, ...opts });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  return { ctx, page, errors };
};
// maximum chroma (max-min of RGB) over a PNG, ignoring a region
const chroma = (buf) => {
  const p = PNG.sync.read(buf);
  let worst = 0;
  for (let i = 0; i < p.data.length; i += 16) {
    const r = p.data[i], g = p.data[i + 1], b = p.data[i + 2];
    worst = Math.max(worst, Math.max(r, g, b) - Math.min(r, g, b));
  }
  return worst;
};

try {
  // 1. loads
  {
    const { ctx, page, errors } = await newPage();
    const plane = [], posters = [];
    page.on("request", (r) => {
      if (r.url().includes("hero-plane")) plane.push(r.url());
      if (r.url().includes("hero-poster")) posters.push(r.url());
    });
    await page.goto(PORT, { waitUntil: "networkidle" });
    await page.waitForFunction(() => { const v = document.querySelector("#top video"); return v.readyState >= 2 && !v.paused && v.style.filter === "none"; }, null, { timeout: 15000 });
    const v = await vstate(page);
    report(!v.paused && v.rs >= 2, `video playing (readyState ${v.rs}, t ${v.t}s)`);
    report(v.src.startsWith(BASE) && !v.src.includes("cloudfront"), `self-hosted: ${v.src.replace(BASE, "")}`);
    report(v.filter === "none", "veil drew its first frame and removed the video's grayscale filter");
    const px = await page.evaluate(() => {
      const c = document.querySelector("#top canvas");
      const d = c.getContext("2d").getImageData(Math.floor(c.width / 2), Math.floor(c.height * 0.85), 1, 1).data;
      return { a: d[3], spread: Math.max(d[0], d[1], d[2]) - Math.min(d[0], d[1], d[2]) };
    });
    report(px.a === 255 && px.spread <= 2, `veil pixel opaque grey (alpha ${px.a}, chroma ${px.spread})`);
    report(plane.length === 0, `hero-plane.png requests: ${plane.length}`);
    report(new Set(posters).size === 1 && posters.length === 1, `poster fetched ${posters.length}x (preload reused)`);
    const lcp = await page.evaluate(() => new Promise((res) => new PerformanceObserver((l) => {
      const e = l.getEntries().pop();
      res([Math.round(e.startTime), e.element && e.element.tagName, (e.url || "").replace(/^.*url=/, "").slice(0, 60)]);
    }).observe({ type: "largest-contentful-paint", buffered: true })));
    // Chrome reports the hero <video> itself (its poster, then its first frame) as the LCP element
    report(lcp[1] === "VIDEO", `LCP ${lcp[0]}ms: ${lcp[1]} ${decodeURIComponent(lcp[2])}`);

    // 3. trail reveals and refills
    const x = 720, y = 69 + 831 * 0.85;
    for (let k = 0; k < 14; k++) await page.mouse.move(x - 140 + k * 20, y);
    await page.waitForTimeout(250);
    const a1 = await alphaAt(page, x, y);
    await page.screenshot({ path: path.join(out, "trail.png"), clip: HERO });
    await page.waitForTimeout(2700);
    const a2 = await alphaAt(page, x, y);
    report(a1 < 200 && a2 === 255, `trail: veil alpha ${a1} under the pointer, ${a2} after 2.7s`);

    // 6. off screen: paused; back: playing
    await page.evaluate(() => document.querySelector("footer").scrollIntoView());
    await page.waitForTimeout(500);
    const off = await vstate(page);
    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForTimeout(700);
    const on = await vstate(page);
    report(off.paused && !on.paused, `off screen paused ${off.paused}; back on screen playing ${!on.paused}`);

    // 6. pause control (it sits in the footer: back to the hero after each click, since the
    //    video also pauses, correctly, while the hero is off screen)
    await page.getByRole("button", { name: /animations/ }).click();
    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForTimeout(500);
    const p1 = await vstate(page);
    await page.waitForTimeout(600);
    const p2 = await vstate(page);
    for (let k = 0; k < 14; k++) await page.mouse.move(x - 140 + k * 20, y - 200);
    await page.waitForTimeout(200);
    const aPaused = await alphaAt(page, x, y - 200);
    await page.getByRole("button", { name: /animations/ }).click();
    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForTimeout(800);
    const p3 = await vstate(page);
    report(p1.paused && p1.t === p2.t && aPaused === 255 && !p3.paused, `pause control: video paused ${p1.paused} (held at ${p2.t}s), no trail (alpha ${aPaused}); play resumes ${!p3.paused}`);
    report(errors.length === 0, `console: ${errors.length ? errors.join(" / ") : "clean"}`);
    await ctx.close();
  }

  // 2. no flash of colour while loading
  {
    const { ctx, page } = await newPage();
    await page.goto(PORT, { waitUntil: "commit" });
    let worst = 0;
    for (let i = 0; i < 25; i++) {
      try { worst = Math.max(worst, chroma(await page.screenshot({ clip: { x: 0, y: 420, width: 1440, height: 480 } }))); } catch {}
      await page.waitForTimeout(80);
    }
    report(worst <= 12, `load sequence stays monochrome (max chroma ${worst} over 25 captures)`);
    await ctx.close();
  }

  // 4. reference vs port on the same frame; 5. reduced motion
  for (const [label, opts, park] of [["same frame (t = 6s)", {}, 6], ["reduced motion (first frame)", { reducedMotion: "reduce" }, null]]) {
    const shots = [];
    for (const url of [REF, PORT]) {
      const { ctx, page } = await newPage(opts);
      await page.goto(url, { waitUntil: "networkidle" });
      if (url === REF) await page.addStyleTag({ content: "body{background:#F6F5F2!important}" });
      await page.waitForFunction(() => document.querySelector("#top video").readyState >= 2, null, { timeout: 15000 });
      if (park != null) {
        await page.evaluate((t) => new Promise((res) => {
          const v = document.querySelector("#top video");
          v.pause();
          v.addEventListener("seeked", () => requestAnimationFrame(() => requestAnimationFrame(res)), { once: true });
          v.currentTime = t;
        }), park);
      }
      await page.waitForTimeout(600);
      const st = await vstate(page);
      shots.push(await page.screenshot({ clip: HERO }));
      if (opts.reducedMotion) {
        for (let k = 0; k < 14; k++) await page.mouse.move(580 + k * 20, 700);
        await page.waitForTimeout(200);
        const a = await alphaAt(page, 720, 700);
        report(st.paused && st.t === 0 && a === 255, `${url === REF ? "reference" : "port"} under reduced motion: paused at ${st.t}s, no trail (alpha ${a})`);
      }
      await ctx.close();
    }
    const d = diff(shots[0], shots[1]);
    side(shots[0], shots[1], path.join(out, `${label.replace(/\W+/g, "-")}.side.png`));
    report(d < 0.005, `reference vs port, ${label}: diff ${(d * 100).toFixed(2)}%`);
  }
} finally {
  await browser.close();
}
