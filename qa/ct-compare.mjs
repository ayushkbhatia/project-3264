#!/usr/bin/env node
// Contact page against its prototype (design_handoff_contact/Contact.dc.html) at a range of
// widths: page height, the box of every shared part (headline, lede, strip, card, fields, button,
// note, direct line), the text of the split, and pixel diffs of the split, the card and the
// footer. Motion frozen on both (reduced motion: the strips rest at their first frame).
//
//   node qa/ct-compare.mjs [--w 1440] [--tol 0.6]
//
// Expected differences, by design: below 1000px the header collapses to the site's menu button
// (the prototype scrolls its nav); the footer reads Essays for "Field notes" (the handoff's open
// item) and steps its columns as every page's footer does; the panel painting is the optimiser's
// copy, so the right half differs a little where the painting shows.

import { arg, box, diffPng, launch, openPage, outDir, PARTS, pct, PORT, REF } from "./ct-lib.mjs";

const only = arg("w");
const tol = Number(arg("tol", "0.6"));
const WIDTHS = only ? [Number(only)] : [1440, 1280, 1024, 960, 880, 879, 768, 390, 375, 320];
const OUT = outDir("contact/compare");
const ok = (b) => (b ? "ok  " : "FAIL");

const browser = await launch();
let failures = 0;
try {
  for (const w of WIDTHS) {
    const h = w < 600 ? 844 : 900;
    const ref = await openPage(browser, REF, w, h);
    const port = await openPage(browser, PORT, w, h);
    console.log(`\n== ${w}×${h}`);

    const heights = await Promise.all([ref, port].map(({ page }) => page.evaluate(() => [document.documentElement.scrollHeight, document.querySelector("#top").getBoundingClientRect().height])));
    // The footer may differ in height where it steps its columns differently (752–919px), so the
    // split is the strict check and the page height is reported.
    const splitOk = Math.abs(heights[0][1] - heights[1][1]) <= tol;
    if (!splitOk) failures++;
    console.log(`${ok(splitOk)} split height ref ${heights[0][1]} port ${heights[1][1]}; page ${heights[0][0]} / ${heights[1][0]}`);

    const bad = [];
    for (const [name, sel] of Object.entries(PARTS)) {
      if (name === "footer") continue;
      const [a, b] = [await box(ref.page, sel), await box(port.page, sel)];
      if (!a || !b) { bad.push(`${name}: missing on ${a ? "port" : "ref"}`); continue; }
      const d = ["x", "y", "w", "h"].map((k) => +(b[k] - a[k]).toFixed(1));
      if (d.some((v) => Math.abs(v) > tol)) bad.push(`${name}: ref ${JSON.stringify(a)} port ${JSON.stringify(b)}`);
    }
    if (bad.length) failures++;
    console.log(`${ok(!bad.length)} ${Object.keys(PARTS).length - 1} part boxes within ${tol}px${bad.length ? "\n      " + bad.join("\n      ") : ""}`);

    const texts = await Promise.all([ref, port].map(({ page }) => page.evaluate(() => document.querySelector("#top").innerText.replace(/\s+/g, " ").trim())));
    if (texts[0] !== texts[1]) failures++;
    console.log(`${ok(texts[0] === texts[1])} split text${texts[0] === texts[1] ? "" : `\n      ref  ${texts[0]}\n      port ${texts[1]}`}`);

    // From the top each time: the header is translucent, so once the page has scrolled it shows
    // whatever is under it.
    for (const [name, sel] of [...(w >= 1000 ? [["header", "header"]] : []), ["split", "#top"], ["card", PARTS.card], ["footer", "footer"]]) {
      const files = ["ref", "port"].map((k) => `${OUT}/${w}-${name}-${k}.png`);
      for (const [i, { page }] of [ref, port].entries()) {
        await page.evaluate(() => scrollTo(0, 0));
        await page.locator(sel).first().screenshot({ path: files[i], animations: "disabled" });
      }
      const r = diffPng(files[0], files[1], `${OUT}/${w}-${name}-diff.png`);
      console.log(`     ${name.padEnd(6)} ${pct(r.ratio).padStart(7)} differ (ref ${r.ref}, port ${r.port})`);
    }
    for (const { page, errors } of [ref, port]) if (errors.length) console.log(`     console errors on ${page === ref.page ? "ref" : "port"}: ${errors.join(" | ")}`);
    await ref.ctx.close();
    await port.ctx.close();
  }
} finally {
  await browser.close();
}
console.log(failures ? `\n${failures} check(s) failed` : "\nall checks pass");
process.exitCode = failures ? 1 : 0;
