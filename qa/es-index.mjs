#!/usr/bin/env node
// Essays index: every section against the reference (pixel diff and text), at each width, then
// each category filter (chips and the list). Reduced motion on both sides.
//
//   node qa/es-index.mjs [--w 1440,1280,1024,768,390]
//
// Two deliberate differences are normalised on the reference before capturing, so the diff shows
// layout: its cards read "6 min read" (the drafts' estimate; the port computes each essay's time
// from its body, as the handoff asks), and its footer still says "Field notes" (the handoff asks
// for Essays). Writes ref / port / diff PNGs to qa/__screens__/es-index/.

import path from "node:path";
import { arg, diffPng, firstDiff, launch, loadAll, openPage, outDir, pct, portIndex, refIndex, shootEl, textOf } from "./es-lib.mjs";

const widths = String(arg("w", "1440,1280")).split(",").map(Number);
const out = outDir("es-index");
const SECTIONS = [
  ["header", "header"],
  ["essays-header", '[data-screen-label="Essays header"]'],
  ["lead", '[data-screen-label="Lead essay"]'],
  ["start-here", '[data-screen-label="Start here"]'],
  ["all-essays", '[data-screen-label="All essays"]'],
  ["subscribe", '[data-screen-label="Subscribe"]'],
  ["closing", '[data-screen-label="Closing"]'],
  ["footer", "footer"],
];

async function normaliseRef(ref, port) {
  const minutes = await port.evaluate(() =>
    Object.fromEntries(
      [...document.querySelectorAll("span")]
        .filter((s) => /^No\. \d\d$/.test(s.textContent))
        .map((s) => [s.textContent, s.parentElement.lastElementChild.textContent]),
    ),
  );
  await ref.evaluate((m) => {
    for (const s of document.querySelectorAll("span")) {
      if (/^No\. \d\d$/.test(s.textContent) && m[s.textContent]) s.parentElement.lastElementChild.textContent = m[s.textContent];
    }
    for (const a of document.querySelectorAll("footer a")) if (a.textContent === "Field notes") a.textContent = "Essays";
  }, minutes);
}

async function compare(ref, port, w, tag, sections) {
  for (const [name, sel] of sections) {
    const exists = await Promise.all([ref, port].map((p) => p.locator(sel).count()));
    if (!exists[0] || !exists[1]) {
      console.log(`  ${name.padEnd(14)} ${exists[0] ? "" : "ref missing "}${exists[1] ? "" : "port missing"}`);
      continue;
    }
    const base = path.join(out, `${w}-${tag}${name}`);
    await shootEl(ref, sel, `${base}-ref.png`);
    await shootEl(port, sel, `${base}-port.png`);
    const d = diffPng(`${base}-ref.png`, `${base}-port.png`, `${base}-diff.png`);
    const [a, b] = await Promise.all([textOf(ref, sel), textOf(port, sel)]);
    const t = firstDiff(a, b);
    console.log(`  ${(tag + name).padEnd(26)} ${(d.ref === d.port ? d.ref : `ref ${d.ref} port ${d.port}`).padEnd(26)} ${pct(d.ratio).padStart(7)}${t ? `  TEXT ${t}` : ""}`);
  }
}

const browser = await launch();
try {
  for (const w of widths) {
    const ref = await openPage(browser, refIndex(), w);
    const port = await openPage(browser, portIndex(), w);
    await Promise.all([loadAll(ref.page), loadAll(port.page)]);
    await normaliseRef(ref.page, port.page);
    const [hr, hp] = await Promise.all([ref.page, port.page].map((p) => p.evaluate(() => document.documentElement.scrollHeight)));
    console.log(`@${w}: document height ref ${hr} port ${hp}${hr === hp ? "" : "  <-- differs"}`);
    await compare(ref.page, port.page, w, "", SECTIONS);
    for (const cat of ["Engineering", "Strategy", "Governance"]) {
      await Promise.all([ref.page, port.page].map((p) => p.click(`button[data-cat="${cat}"]`)));
      await port.page.waitForTimeout(150);
      await compare(ref.page, port.page, w, `${cat.toLowerCase()}:`, [SECTIONS[1], SECTIONS[4]]);
    }
    await Promise.all([ref.page, port.page].map((p) => p.click('button[data-cat="All"]')));
    if (port.errors.length) console.log(`  port console errors:\n    ${port.errors.join("\n    ")}`);
    await ref.ctx.close();
    await port.ctx.close();
  }
} finally {
  await browser.close();
}
