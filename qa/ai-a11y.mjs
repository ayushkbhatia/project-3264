#!/usr/bin/env node
// AI Engineering accessibility: axe (WCAG 2.x A/AA) at the top of each section, the heading
// outline and landmarks as assistive tech sees them, and the footer's pause control (the audit
// loop must stop while paused and resume after).
//
//   node qa/ai-a11y.mjs

import fs from "node:fs";
import { PORT, launch } from "./ai-lib.mjs";

const AXE = fs.readFileSync("node_modules/axe-core/axe.min.js", "utf8");
const browser = await launch();
try {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(PORT, { waitUntil: "networkidle" });
  await page.addScriptTag({ content: AXE });

  // headings and landmarks
  const outline = await page.evaluate(() => {
    const hidden = (el) => !!el.closest("[aria-hidden='true']");
    return [...document.querySelectorAll("h1,h2,h3,h4,main,header,footer,nav")]
      .filter((e) => !hidden(e))
      .map((e) => (/^H/.test(e.tagName) ? `${e.tagName} ${e.textContent.replace(/\s+/g, " ").trim().slice(0, 70)}` : `<${e.tagName.toLowerCase()}${e.getAttribute("aria-label") ? ` "${e.getAttribute("aria-label")}"` : ""}>`));
  });
  console.log("outline:\n  " + outline.join("\n  "));

  // axe at each section, in view (contrast on imagery depends on what is painted)
  const seen = new Map();
  for (const sel of ["#top", "section[data-screen-label='Premise']", "#audit", "#rebuild", "#engagement", "footer"]) {
    await page.evaluate((s) => { const el = document.querySelector(s); scrollTo(0, el.getBoundingClientRect().top + scrollY - 68); }, sel);
    await page.waitForTimeout(600);
    const res = await page.evaluate(async () => {
      const r = await window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] } });
      return r.violations.map((v) => ({ id: v.id, impact: v.impact, n: v.nodes.length, sample: v.nodes.slice(0, 3).map((n) => n.target.join(" ") + " :: " + (n.failureSummary || "").split("\n").slice(1, 2).join(" ")) }));
    });
    for (const v of res) {
      const k = v.id + v.sample[0];
      if (seen.has(k)) continue;
      seen.set(k, 1);
      console.log(`axe @ ${sel}: ${v.id} (${v.impact}) x${v.n}\n    ${v.sample.join("\n    ")}`);
    }
  }
  if (!seen.size) console.log("axe: no violations");

  // pause control
  const audit = async () => (await page.locator("#audit > div").screenshot()).toString("base64");
  await page.evaluate(() => { const el = document.querySelector("#audit"); scrollTo(0, el.getBoundingClientRect().top + scrollY - 68); });
  await page.waitForTimeout(6000);
  const btn = page.getByRole("button", { name: /animations/ });
  await btn.click();
  await page.waitForTimeout(300);
  const p1 = await audit(); await page.waitForTimeout(1500); const p2 = await audit();
  const label = await btn.textContent(), pressed = await btn.getAttribute("aria-pressed");
  await btn.click();
  await page.waitForTimeout(300);
  const r1 = await audit(); await page.waitForTimeout(1400); const r2 = await audit();
  console.log(`pause: "${label}" aria-pressed=${pressed}, audit still while paused ${p1 === p2}; moving again after play ${r1 !== r2}`);
  await ctx.close();
} finally {
  await browser.close();
}
