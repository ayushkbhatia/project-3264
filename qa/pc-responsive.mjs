#!/usr/bin/env node
// Private Credit responsive sweep: horizontal overflow, header nav state, which branch
// (pinned vs fallback) renders, and full-page screenshots for review by eye.
//   node qa/pc-responsive.mjs [--vp 1024x768,900x1000,768x1024,390x844,320x640]
import { chromium } from "@playwright/test";
import fs from "node:fs";

const PORT = "http://localhost:3000/industries/private-credit?t=16&intro=off";
const i = process.argv.indexOf("--vp");
const vps = (i > -1 ? process.argv[i + 1] : "1024x768,900x1000,768x1024,390x844,320x640").split(",").map((v) => v.split("x").map(Number));
const OUT = "qa/__screens__/pc-resp";
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ channel: "chrome" });
try {
  for (const [w, h] of vps) {
    const mobile = w < 768;
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: mobile ? 2 : 1, isMobile: mobile, hasTouch: mobile });
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    await page.goto(PORT, { waitUntil: "networkidle" });
    await page.addStyleTag({ content: "nextjs-portal{display:none!important}" });
    await page.waitForTimeout(1200);
    const info = await page.evaluate(() => {
      const de = document.documentElement;
      const over = [...document.querySelectorAll("body *")]
        .filter((el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width && cs.visibility !== "hidden" && r.right > de.clientWidth + 1 && !el.closest("[aria-hidden='true']") && !el.closest("[style*='overflow']"); })
        .slice(0, 6).map((el) => `${el.tagName.toLowerCase()}.${(el.textContent || "").trim().slice(0, 24)}→${Math.round(el.getBoundingClientRect().right)}`);
      const nav = getComputedStyle(document.querySelector("header nav")).visibility;
      const pinned = ["#reality", "#platform", "#origination", "#delivery"].map((s) => {
        const sec = document.querySelector(s);
        const track = [...sec.querySelectorAll("div")].find((d) => d.firstElementChild && getComputedStyle(d.firstElementChild).position === "sticky");
        return track && track.offsetHeight > 0 ? "pinned" : "fallback";
      });
      return { scrollW: de.scrollWidth, clientW: de.clientWidth, over, nav, pinned, height: de.scrollHeight };
    });
    console.log(`${w}x${h}: scrollWidth ${info.scrollW}/${info.clientW} nav ${info.nav} sections ${info.pinned.join(",")} height ${info.height}${info.over.length ? "\n   overflow: " + info.over.join(" | ") : ""}${errors.length ? "\n   errors: " + errors.join(" / ") : ""}`);
    if (w < 1024) await page.screenshot({ path: `${OUT}/${w}x${h}.png`, fullPage: true });
    await ctx.close();
  }
} finally {
  await browser.close();
}
