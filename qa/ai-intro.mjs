#!/usr/bin/env node
// AI Engineering: the "Deploy log" intro, reference vs port.
//
//   node qa/ai-intro.mjs [--vp 1440x900] [--out qa/__screens__/ai-intro]
//
// 1. Frames: each side is captured at fixed offsets from the moment its intro starts (the
//    stage gets its box), so the two timelines line up whatever each page's load time.
// 2. First paint (port): the server HTML must already show the cover (the head gate), so the
//    page is never seen and then covered.
// 3. Skip: a click and a key each dismiss it in ~280ms, and the next click reaches the page.
// 4. Never plays under reduced motion or ?intro=off.

import fs from "node:fs";
import path from "node:path";
import { launch, side, diff, arg } from "./ai-lib.mjs";

const REF = "http://127.0.0.1:4102/AI%20Engineering.dc.html";
const PORT = "http://localhost:3000/ai-engineering";
const [w, h] = String(arg("vp", "1440x900")).split("x").map(Number);
const out = arg("out", "qa/__screens__/ai-intro");
fs.mkdirSync(out, { recursive: true });
const OFFSETS = [300, 800, 1400, 2200, 2750, 3400, 4000, 4700];

// the overlay's stage: the port marks the overlay; the reference's is the fixed z-index 300 div
const STAGE = () => {
  const wrap = document.querySelector("[data-ai-intro-wrap]") ||
    [...document.querySelectorAll("div")].find((d) => d.style.position === "fixed" && d.style.zIndex === "300");
  return wrap && wrap.firstElementChild;
};

const browser = await launch();
try {
  // 1. frames
  const shots = {};
  await Promise.all([["ref", REF], ["port", PORT]].map(async ([label, url]) => {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: "commit" });
    await page.waitForFunction(`(${STAGE.toString()})() && (${STAGE.toString()})().childElementCount > 0`, null, { polling: "raf", timeout: 60000 });
    const t0 = Date.now();
    await page.addStyleTag({ content: "nextjs-portal{display:none!important}" });
    shots[label] = [];
    for (const ms of OFFSETS) {
      await page.waitForTimeout(Math.max(0, t0 + ms - Date.now()));
      shots[label].push(await page.screenshot());
    }
    await ctx.close();
  }));
  OFFSETS.forEach((ms, i) => {
    side(shots.ref[i], shots.port[i], path.join(out, `intro-${ms}.side.png`));
    console.log(`intro +${ms}ms: diff ${(diff(shots.ref[i], shots.port[i]) * 100).toFixed(2)}%`);
  });

  // 2. first paint of the server HTML, before any script has run
  {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, javaScriptEnabled: true });
    const page = await ctx.newPage();
    // hold the app's scripts back: the server HTML and the inline head scripts only (aborting
    // them would fire script errors, which release the gate at once, by design)
    await page.route("**/_next/static/chunks/**", async (r) => { await new Promise((z) => setTimeout(z, 4000)); r.continue().catch(() => {}); });
    await page.goto(PORT, { waitUntil: "domcontentloaded" });
    const s = await page.evaluate(() => [document.documentElement.getAttribute("data-ai-intro"), getComputedStyle(document.querySelector("[data-ai-intro-wrap]")).display]);
    await page.waitForTimeout(1700);
    const s2 = await page.evaluate(() => [document.documentElement.getAttribute("data-ai-intro"), getComputedStyle(document.querySelector("[data-ai-intro-wrap]")).display]);
    console.log(`first paint (no app JS): gate ${s[0]}, overlay ${s[1]}; after the 1.5s grace: gate ${s2[0]}, overlay ${s2[1]}`);
    await ctx.close();
  }

  // 3. skip by click and by key; the next click must reach the page
  for (const how of ["click", "key"]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h } });
    const page = await ctx.newPage();
    await page.goto(PORT, { waitUntil: "networkidle" });
    await page.waitForFunction(`(${STAGE.toString()})().childElementCount > 0`);
    await page.waitForTimeout(600);
    const t0 = Date.now();
    if (how === "click") await page.mouse.click(w / 2, h / 2);
    else await page.keyboard.press("a");
    await page.waitForFunction(() => getComputedStyle(document.querySelector("[data-ai-intro-wrap]")).display === "none", null, { polling: 10, timeout: 3000 });
    const took = Date.now() - t0;
    const hit = await page.evaluate(([x, y]) => { const e = document.elementFromPoint(x, y); return e && (e.closest("[data-ai-intro-wrap]") ? "overlay" : e.tagName); }, [w / 2, 200]);
    console.log(`skip by ${how}: hidden after ${took}ms; element at the next click point: ${hit}`);
    await ctx.close();
  }

  // 4. never under reduced motion or ?intro=off
  for (const [label, opts, url] of [["reduced motion", { reducedMotion: "reduce" }, PORT], ["?intro=off", {}, PORT + "?intro=off"]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, ...opts });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    const s = await page.evaluate(() => [document.documentElement.getAttribute("data-ai-intro"), getComputedStyle(document.querySelector("[data-ai-intro-wrap]")).display]);
    console.log(`${label}: gate ${s[0]}, overlay ${s[1]}`);
    await ctx.close();
  }
} finally {
  await browser.close();
}
