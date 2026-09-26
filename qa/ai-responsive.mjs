#!/usr/bin/env node
// AI Engineering below the designed range (spec 08): no horizontal scroll at any width, the
// header nav collapsed below 1024px, and below 900px the interim rule: pinned sections
// stacked at their end states, no 03 hold. Captures each section at each width.
//
//   node qa/ai-responsive.mjs [--widths 1024,899,768,390,320] [--out qa/__screens__/ai-responsive]

import fs from "node:fs";
import path from "node:path";
import { PORT, arg, launch, settleImages } from "./ai-lib.mjs";

const widths = String(arg("widths", "1024,899,768,390,320")).split(",").map(Number);
const out = arg("out", "qa/__screens__/ai-responsive");
fs.mkdirSync(out, { recursive: true });
const SECTIONS = ["#top", "section[data-screen-label='Premise']", "#audit", "#rebuild", "#engagement", "footer"];

const browser = await launch();
try {
  for (const w of widths) {
    const h = w < 700 ? 844 : 900;
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, isMobile: w < 700, hasTouch: w < 700 });
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    await page.goto(PORT, { waitUntil: "networkidle" });
    await page.addStyleTag({ content: "nextjs-portal{display:none!important}" });
    const info = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - innerWidth,
      nav: getComputedStyle(document.querySelector("header nav")).visibility,
      height: document.documentElement.scrollHeight,
    }));
    // the 03 hold must not engage below 900px: wheel through the hold point
    await page.evaluate(() => { const el = document.querySelector("#rebuild"); scrollTo(0, el.getBoundingClientRect().top + scrollY); });
    await page.waitForTimeout(300);
    const y0 = await page.evaluate(() => scrollY);
    for (let i = 0; i < 20; i++) { await page.mouse.wheel(0, 150); await page.waitForTimeout(40); }
    await page.waitForTimeout(200);
    const y1 = await page.evaluate(() => scrollY);
    console.log(`${w}px: horizontal overflow ${info.overflow}px, nav ${info.nav}, page ${info.height}px, wheel through 03: ${y0} -> ${y1}${errors.length ? "  ERRORS " + errors.join(" / ") : ""}`);
    for (const [i, sel] of SECTIONS.entries()) {
      await page.evaluate((sel) => { const el = document.querySelector(sel); scrollTo(0, el.getBoundingClientRect().top + scrollY - 68); }, sel);
      await page.waitForTimeout(400);
      await settleImages(page);
      await page.screenshot({ path: path.join(out, `${w}-${i}.png`), fullPage: false });
    }
    await ctx.close();
  }
} finally {
  await browser.close();
}
