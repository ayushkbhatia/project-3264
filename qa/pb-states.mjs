#!/usr/bin/env node
// Playbooks: the interaction states against the reference (VISUAL_QA.md s01–s04), then the
// port-only production states (URL sync, Clear focus, subscribe invalid / submitting / error).
//
//   node qa/pb-states.mjs [--w 1440,1280]

import path from "node:path";
import { REF, PORT, arg, diffPng, launch, loadAll, open, outDir, pct, shootEl } from "./pb-lib.mjs";

const widths = String(arg("w", "1440")).split(",").map(Number);
const out = outDir("pb-states");
const RESULTS = '[data-screen-label="Results"]';
const CTAS = '[data-screen-label="Library CTAs"]';

const STATES = [
  { name: "s01-filter-private-credit", run: (p) => p.click('button[data-cat="Private Credit"]'), sel: [["library", "#library"], ["results", RESULTS]] },
  { name: "s02-search-one", run: async (p) => { await p.click('button[data-cat="All"]'); await p.fill('input[type="search"]', "covenant"); }, sel: [["library", "#library"], ["results", RESULTS]] },
  { name: "s03-search-none", run: (p) => p.fill('input[type="search"]', "zzz"), sel: [["results", RESULTS]] },
  {
    name: "s04-subscribed",
    run: async (p) => {
      await p.getByRole("button", { name: "Clear" }).click();
      await p.fill('input[type="email"]', "analyst@fund.com");
      await p.getByRole("button", { name: "Subscribe" }).click();
      await p.waitForTimeout(900); // the port's mock endpoint resolves after 600ms
    },
    sel: [["ctas", CTAS]],
  },
];

const text = (page, sel) => page.locator(sel).first().innerText().catch(() => "(missing)");

const browser = await launch();
try {
  for (const w of widths) {
    const ref = await open(browser, REF, w);
    const port = await open(browser, PORT, w);
    await Promise.all([loadAll(ref.page), loadAll(port.page)]);
    console.log(`@${w}`);
    for (const st of STATES) {
      await st.run(ref.page);
      await st.run(port.page);
      await port.page.waitForTimeout(100);
      const parts = [];
      for (const [name, sel] of st.sel) {
        const rf = path.join(out, `${w}-${st.name}-${name}-ref.png`), pf = path.join(out, `${w}-${st.name}-${name}-port.png`), df = path.join(out, `${w}-${st.name}-${name}-diff.png`);
        await shootEl(ref.page, sel, rf);
        await shootEl(port.page, sel, pf);
        const d = diffPng(rf, pf, df);
        parts.push(`${name} ${d.ref === d.port ? d.ref : `ref ${d.ref} port ${d.port}`} ${pct(d.ratio)}`);
      }
      const label = st.sel.some(([n]) => n === "results") ? `  label ref "${await text(ref.page, `${RESULTS} span`)}" port "${await text(port.page, `${RESULTS} span`)}"` : "";
      console.log(`  ${st.name.padEnd(26)} ${parts.join(" | ")}${label}`);
    }
    await ref.ctx.close();
    await port.ctx.close();
  }

  // Port-only behaviour.
  const { ctx, page } = await open(browser, PORT + "?category=fund-management&q=nav", 1440);
  await page.waitForTimeout(400);
  const live = () => page.locator("#library [aria-live]").innerText();
  console.log(`\nURL in: ?category=fund-management&q=nav -> "${await text(page, `${RESULTS} span`)}", live region "${await live()}", pressed "${await page.locator('#library button[aria-pressed="true"]').innerText()}"`);
  await page.click('button[data-cat="Asset Management"]');
  await page.fill('input[type="search"]', "research");
  await page.waitForTimeout(450);
  console.log(`URL out after Asset Management + "research": ${new URL(page.url()).search} (history length ${await page.evaluate(() => history.length)})`);
  await page.getByRole("button", { name: "Clear" }).click();
  await page.waitForTimeout(450);
  console.log(`Clear: url "${new URL(page.url()).search}", focus on ${await page.evaluate(() => document.activeElement?.getAttribute("type") || document.activeElement?.tagName)}, featured shown ${await page.locator('[data-screen-label="Featured"]').count() === 1}`);

  const email = page.locator('input[type="email"]');
  const btn = page.locator(`${CTAS} button[type="submit"]`);
  await btn.click();
  console.log(`subscribe empty: message "${await text(page, `${CTAS} [role="alert"]`)}", aria-invalid ${await email.getAttribute("aria-invalid")}, focus on input ${await email.evaluate((e) => e === document.activeElement)}`);
  await email.fill("not-an-email");
  await email.press("Enter");
  console.log(`subscribe malformed: message "${await text(page, `${CTAS} [role="alert"]`)}"`);
  await email.fill("someone@fund.invalid");
  const before = await btn.evaluate((b) => b.offsetWidth);
  await email.press("Enter");
  await page.waitForTimeout(100);
  console.log(`subscribing: label "${await btn.innerText()}", aria-busy ${await btn.getAttribute("aria-busy")}, width ${before} -> ${await btn.evaluate((b) => b.offsetWidth)}, input readonly ${await email.evaluate((e) => e.readOnly)}, focus kept ${await email.evaluate((e) => e === document.activeElement)}`);
  await page.waitForTimeout(800);
  console.log(`subscribe error: message "${await text(page, `${CTAS} [role="alert"]`)}", form kept ${await email.count() === 1}`);
  await email.fill("analyst@fund.com");
  await email.press("Enter");
  await page.waitForTimeout(900);
  console.log(`subscribe success: "${await text(page, `${CTAS} [tabindex="-1"]`)}", focused ${await page.evaluate(() => document.activeElement?.textContent)}`);
  await page.click('button[data-cat="Private Credit"]');
  await page.getByRole("button", { name: "Clear" }).click();
  console.log(`success survives filter + clear: ${(await text(page, CTAS)).includes("You are on the list.")}`);
  await ctx.close();
} finally {
  await browser.close();
}
