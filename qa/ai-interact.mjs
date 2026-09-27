#!/usr/bin/env node
// AI Engineering interactions (port only; the reference behaves the same by construction, the
// logic being the prototype's):
//   * the 03 hold engages, keys (Space / ArrowDown) scrub it forward, and it releases on an
//     upward scroll and on an in-page anchor click;
//   * the Engagement spines are buttons: in the tab order only while showing, and they land
//     on their cards;
//   * hover states of the CTAs.
//
//   node qa/ai-interact.mjs

import { PORT, launch } from "./ai-lib.mjs";

const browser = await launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto(PORT, { waitUntil: "networkidle" });
const S = () => page.evaluate(() => [scrollY, +(window.__rbCtl?.shown ?? 0).toFixed(3)]);
const toRebuild = () => page.evaluate(() => { const el = document.querySelector("#rebuild"); scrollTo(0, el.getBoundingClientRect().top + scrollY); });
const wheel = async (n, dy) => { for (let i = 0; i < n; i++) { await page.mouse.wheel(0, dy); await page.waitForTimeout(50); } };

// hold + keys
await toRebuild();
await page.waitForTimeout(300);
await wheel(12, 120);
await page.waitForTimeout(200);
const a = await S();
await page.keyboard.press("Space");
await page.keyboard.press("ArrowDown");
await page.waitForTimeout(400);
const b = await S();
console.log(`hold: locked at ${a[0]} (built ${a[1]}); Space + ArrowDown -> ${b[0]} (built ${b[1]})  ${a[0] === b[0] && b[1] > a[1] ? "OK" : "CHECK"}`);

// release on upward scroll
await wheel(3, -120);
await page.waitForTimeout(200);
const c = await S();
await wheel(3, 120);
await page.waitForTimeout(200);
const d = await S();
console.log(`up-scroll: ${b[0]} -> ${c[0]}; down again -> ${d[0]}  ${c[0] < b[0] - 40 ? "released OK" : "CHECK"}`);

// release on an anchor click (reload so the hold is fresh)
await page.goto(PORT + "?intro=off", { waitUntil: "networkidle" });
await toRebuild();
await page.waitForTimeout(300);
await wheel(10, 120);
await page.waitForTimeout(200);
const e = await S();
await page.click("header a[href='#engagement']");
await page.waitForTimeout(1200);
const f = await page.evaluate(() => [scrollY, Math.round(document.querySelector("#engagement").getBoundingClientRect().top)]);
console.log(`anchor while held (${e[0]}, built ${e[1]}): -> scrollY ${f[0]}, #engagement top ${f[1]}px  ${f[1] < 120 && f[1] > -2 ? "OK" : "CHECK"}`);

// spines
const tabbable = () => page.evaluate(() => [...document.querySelectorAll("[data-ai-spine]")].map((s) => `${s.getAttribute("aria-label")}:${s.tabIndex}${s.getAttribute("aria-hidden") ? "(hidden)" : ""}`).join(", "));
const track = (m) => page.evaluate((m) => {
  const el = document.querySelector("[data-track='engagement']");
  scrollTo(0, el.getBoundingClientRect().top + scrollY - 68 + m * (el.offsetHeight - (innerHeight - 68)));
}, m);
await track(0.2);
await page.waitForTimeout(400);
console.log(`spines at m=.2: ${await tabbable()}`);
await page.focus("[data-ai-spine][aria-label='Show the build']");
await page.keyboard.press("Enter");
await page.waitForTimeout(1500);
const m1 = await page.evaluate(() => { const el = document.querySelector("[data-track='engagement']"); return +((68 - el.getBoundingClientRect().top) / (el.offsetHeight - (innerHeight - 68))).toFixed(3); });
console.log(`Enter on "Show the build": m -> ${m1} (enJump(.82))  spines now: ${await tabbable()}`);
const ring = await page.evaluate(() => { const s = document.querySelector("[data-ai-spine][aria-label='Show the audit']"); s.focus(); const cs = getComputedStyle(s); return `${cs.outlineStyle} ${cs.outlineWidth} ${cs.outlineColor} offset ${cs.outlineOffset}`; });
console.log(`focus ring on the audit spine: ${ring}`);

// hovers
for (const [sel, prop] of [["#top a[href='#engagement']", "backgroundColor"], ["#top a[href='#rebuild']", "borderColor"], ["header a[href='#engagement']", "color"], ["#engagement a[href^='mailto']", "backgroundColor"]]) {
  await page.evaluate((s) => document.querySelector(s).scrollIntoView({ block: "center" }), sel);
  await page.waitForTimeout(300);
  const before = await page.$eval(sel, (el, p) => getComputedStyle(el)[p], prop);
  await page.hover(sel);
  await page.waitForTimeout(250);
  const after = await page.$eval(sel, (el, p) => getComputedStyle(el)[p], prop);
  console.log(`hover ${sel} ${prop}: ${before} -> ${after}`);
}
await browser.close();
