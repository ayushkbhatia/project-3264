#!/usr/bin/env node
// Rail tabs: hover colour over the module's inline colour (the reference's hover is an
// !important :hover rule), keyboard focus ring and activation, and a console sweep.
//   node qa/capabilities-rail-a11y.mjs
import { chromium } from "@playwright/test";
const REF = "http://127.0.0.1:4100/3264%20Home.dc.html", PORT = "http://localhost:3000/";
const TAB = (i) => `#capabilities > div:nth-child(2) > div > div > div:first-child > div:first-child > :nth-child(${i + 1})`;
const scrub = (p) => { const sc = [document.body, document.scrollingElement].find((e) => e.scrollHeight > e.clientHeight + 8); const t = document.querySelector("#capabilities > div:nth-child(2)");
  const top = t.getBoundingClientRect().top + sc.scrollTop; sc.scrollTop = Math.round(top + p * (t.offsetHeight - (innerHeight - document.querySelector("header").offsetHeight))); };
const browser = await chromium.launch({ channel: "chrome" });
let fails = 0;
const res = {};
for (const [name, url] of [["ref", REF], ["port", PORT]]) {
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  const log = [];
  page.on("console", (m) => { if (["error", "warning"].includes(m.type()) && !/Failed to load resource|footer-nocturne/.test(m.text())) log.push(m.text().split("\n")[0]); });
  page.on("pageerror", (e) => log.push("pageerror " + e.message));
  await page.goto(url, { waitUntil: "networkidle" });
  await page.keyboard.press("Escape"); await page.waitForTimeout(1200);
  const color = (i) => page.evaluate((s) => getComputedStyle(document.querySelector(s)).color, TAB(i));
  const out = [];
  for (const [p, label] of [[0.1, "Assess active"], [0.5, "Build active"]]) {
    await page.evaluate(scrub, p); await page.waitForTimeout(600);
    for (const i of [0, 1, 2]) {
      await page.hover(TAB(i)); await page.waitForTimeout(150);
      out.push(`${label}, hover tab ${i}: ${await color(i)}`);
    }
    await page.mouse.move(5, 5);
  }
  res[name] = out;
  if (name === "port") {
    // keyboard: focus the Run tab and activate it with Enter, then Space on Assess
    await page.evaluate(scrub, 0.1); await page.waitForTimeout(500);
    await page.focus(TAB(2));
    await page.keyboard.press("Tab"); await page.keyboard.press("Shift+Tab"); // arrive by keyboard so :focus-visible applies
    const ring = await page.evaluate((s) => { const cs = getComputedStyle(document.querySelector(s)); return `${cs.outlineStyle} ${cs.outlineWidth} ${cs.outlineColor} offset ${cs.outlineOffset}`; }, TAB(2));
    await page.keyboard.press("Enter"); await page.waitForTimeout(1300);
    const afterEnter = await page.evaluate(() => document.querySelector("#capabilities > div:nth-child(2) [aria-pressed='true']").textContent);
    await page.focus(TAB(0)); await page.keyboard.press("Space"); await page.waitForTimeout(1300);
    const afterSpace = await page.evaluate(() => document.querySelector("#capabilities > div:nth-child(2) [aria-pressed='true']").textContent);
    console.log(`port keyboard: focus ring "${ring}"; Enter on Run -> pressed ${afterEnter}; Space on Assess -> pressed ${afterSpace}`);
    if (!/solid 2px rgb\(21, 127, 82\) offset 2px/.test(ring) || afterEnter !== "Run" || afterSpace !== "Assess") { fails++; console.log("FAIL keyboard"); }
  }
  console.log(`${name} console: ${log.length ? log.join(" | ") : "clean"}`);
  if (name === "port" && log.length) fails++;
}
res.ref.forEach((r, i) => { const same = r === res.port[i]; if (!same) fails++; console.log(`${same ? "=" : "DIFF"} ${r}${same ? "" : "   port: " + res.port[i]}`); });
await browser.close();
console.log(fails ? `${fails} FAILURE(S)` : "all checks passed");
process.exit(fails ? 1 : 0);
