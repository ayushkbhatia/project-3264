#!/usr/bin/env node
// Reads the Build panel's derived figures on the port at three points in act 2.
//   node qa/capabilities-price.mjs
import { chromium } from "@playwright/test";
const browser = await chromium.launch({ channel: "chrome" });
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
for (const p of [0.36, 0.5, 0.64]) {
  await page.evaluate((p) => { const sc = document.scrollingElement, t = document.querySelector("#capabilities > div:nth-child(2)");
    const top = t.getBoundingClientRect().top + sc.scrollTop; sc.scrollTop = Math.round(top + p * (t.offsetHeight - (innerHeight - document.querySelector("header").offsetHeight))); }, p);
  await page.waitForTimeout(400);
  console.log(`p=${p}`, await page.evaluate(() => {
    const host = document.querySelector("#capabilities > div:nth-child(2)").firstElementChild.firstElementChild.children[1].children[4];
    const plan = host.children[2];
    const waves = [...plan.children[0].children].map((c) => c.children[2].textContent).join(" | ");
    const foot = [...plan.children[1].children].map((c) => c.textContent).join("  ");
    return `counter ${host.children[0].lastElementChild.textContent} · waves [${waves}] · ${foot}`;
  }));
}
await browser.close();
