#!/usr/bin/env node
// Private Credit intro: frames from the reference and the port at matching moments after the
// overlay appears, plus the behaviour checks (first paint, skip by click/key, first click after,
// reduced motion, ?intro=off). The scrambled "reconciled" digits are random by design, so
// frames are compared by eye (qa/__screens__/pc-intro/<t>.side.png), not by pixel ratio.
//
//   node qa/pc-intro.mjs
import { chromium } from "@playwright/test";
import fs from "node:fs";
import { PNG } from "pngjs";

const REF = "http://127.0.0.1:4101/Private%20Credit.dc.html";
const PORT = "http://localhost:3000/industries/private-credit";
const OUT = "qa/__screens__/pc-intro";
fs.mkdirSync(OUT, { recursive: true });
const AT = [300, 1300, 2500, 3300, 4300, 5000, 5600];

function side(a, b, file) {
  const A = PNG.sync.read(a), B = PNG.sync.read(b);
  const o = new PNG({ width: A.width + B.width + 12, height: Math.max(A.height, B.height) });
  o.data.fill(34);
  PNG.bitblt(A, o, 0, 0, A.width, A.height, 0, 0);
  PNG.bitblt(B, o, 0, 0, B.width, B.height, A.width + 12, 0);
  fs.writeFileSync(file, PNG.sync.write(o));
}

async function frames(browser, url) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(url, { waitUntil: "domcontentloaded" });
  // t0 = when the module shows the table (the first row appears)
  await page.waitForFunction(() => {
    const w = document.querySelector("[data-pc-intro-wrap]") || [...document.querySelectorAll("div")].find((d) => d.style.zIndex === "300");
    return w && w.querySelector("div div div") && getComputedStyle(w).display !== "none";
  }, null, { timeout: 15000 });
  const t0 = Date.now();
  const shots = [];
  for (const at of AT) {
    const wait = at - (Date.now() - t0);
    if (wait > 0) await page.waitForTimeout(wait);
    await page.addStyleTag({ content: "nextjs-portal{display:none!important}" });
    shots.push(await page.screenshot());
  }
  const gone = await page.evaluate(() => {
    const w = document.querySelector("[data-pc-intro-wrap]") || [...document.querySelectorAll("div")].find((d) => d.style.zIndex === "300");
    return getComputedStyle(w).display;
  });
  await ctx.close();
  return { shots, gone, errors };
}

const browser = await chromium.launch({ channel: "chrome" });
try {
  const r = await frames(browser, REF);
  const p = await frames(browser, PORT);
  AT.forEach((at, i) => side(r.shots[i], p.shots[i], `${OUT}/${at}.side.png`));
  console.log(`after ${AT.at(-1)}ms overlay display: ref ${r.gone}, port ${p.gone}; port errors: ${p.errors.length ? p.errors.join(" / ") : "none"}`);

  // first paint: the earliest frame must be the cover, never the page
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page);
    await cdp.send("Network.enable");
    await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: 1.6e6 / 8, uploadThroughput: 750e3 / 8 });
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    await page.goto(PORT, { waitUntil: "commit" });
    await page.waitForFunction(() => document.body && document.querySelector("header"), null, { timeout: 30000 });
    const state = await page.evaluate(() => ({
      gate: document.documentElement.getAttribute("data-pc-intro"),
      cover: getComputedStyle(document.querySelector("[data-pc-intro-wrap]")).display,
    }));
    await page.screenshot({ path: `${OUT}/firstpaint-slow.png` });
    console.log(`first paint (slow 3G, 4x CPU): gate=${state.gate} overlay display=${state.cover}`);
    await page.waitForTimeout(9000);
    const end = await page.evaluate(() => ({
      gate: document.documentElement.getAttribute("data-pc-intro"),
      cover: getComputedStyle(document.querySelector("[data-pc-intro-wrap]")).display,
    }));
    console.log(`  after 9s: gate=${end.gate} overlay display=${end.cover}`);
    await ctx.close();
  }

  // skip by click at 1s, then a nav click must land on the first try
  for (const how of ["click", "key"]) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(PORT, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => getComputedStyle(document.querySelector("[data-pc-intro-wrap]")).display !== "none");
    await page.waitForTimeout(1000);
    if (how === "click") await page.mouse.click(700, 450);
    else await page.keyboard.press("Shift");
    await page.waitForTimeout(450);
    const shown = await page.evaluate(() => getComputedStyle(document.querySelector("[data-pc-intro-wrap]")).display);
    await page.getByRole("link", { name: "How we add value" }).click();
    await page.waitForTimeout(300);
    console.log(`skip by ${how}: overlay ${shown}; first click after → ${page.url().split("/").pop()}`);
    await ctx.close();
  }

  for (const [label, opts, url] of [
    ["reduced motion", { reducedMotion: "reduce" }, PORT],
    ["?intro=off", {}, PORT + "?intro=off"],
  ]) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...opts });
    const page = await ctx.newPage();
    let seen = false;
    await page.exposeFunction("__seen", () => { seen = true; });
    await page.addInitScript(() => {
      new MutationObserver(() => {
        const w = document.querySelector("[data-pc-intro-wrap]");
        if (w && getComputedStyle(w).display !== "none") window.__seen();
      }).observe(document, { subtree: true, attributes: true, childList: true });
    });
    await page.goto(url, { waitUntil: "load" });
    await page.waitForTimeout(2500);
    console.log(`${label}: overlay ever shown = ${seen}`);
    await ctx.close();
  }
} finally {
  await browser.close();
}
