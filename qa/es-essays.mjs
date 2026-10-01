#!/usr/bin/env node
// Essay pages: each essay against its prototype ("Essay NN - ….dc.html"): page height, then the
// header, the sidebar (from 1048px), the hero, the introduction, every section, the sources,
// More essays, the closing and the footer, each as a pixel diff and a text comparison.
//
//   node qa/es-essays.mjs [--w 1440] [--only 01,13] [--quiet]
//
// --quiet prints only sections above 0.5% or with different text. The reference's footer still
// says "Field notes" (the handoff asks for Essays): normalised before capturing.
// Writes ref / port / diff PNGs to qa/__screens__/es-essays/.

import path from "node:path";
import { ESSAYS, arg, diffPng, firstDiff, flag, launch, loadAll, openPage, outDir, pct, portEssay, refEssay, shootEl, textOf } from "./es-lib.mjs";

const widths = String(arg("w", "1440")).split(",").map(Number);
const only = arg("only", null)?.split(",");
const quiet = flag("quiet");
const out = outDir("es-essays");

const browser = await launch();
let flagged = 0;
try {
  for (const w of widths) {
    for (const essay of ESSAYS) {
      if (only && !only.includes(essay.num)) continue;
      const ref = await openPage(browser, refEssay(essay), w);
      const port = await openPage(browser, portEssay(essay), w);
      await Promise.all([loadAll(ref.page), loadAll(port.page)]);
      await ref.page.evaluate(() => {
        for (const a of document.querySelectorAll("footer a")) if (a.textContent === "Field notes") a.textContent = "Essays";
      });
      const ids = await ref.page.evaluate(() => [...document.querySelectorAll("main section[id], main [id='top']")].map((e) => e.id));
      const [hr, hp] = await Promise.all([ref.page, port.page].map((p) => p.evaluate(() => document.documentElement.scrollHeight)));
      const read = await Promise.all([ref.page, port.page].map((p) => p.evaluate(() => [...document.querySelectorAll("main span")].find((s) => /min read$/.test(s.textContent))?.textContent)));
      console.log(`@${w} ${essay.num} ${essay.slug}: height ref ${hr} port ${hp}${hr === hp ? "" : " <-- differs"}; ${read[0]} / ${read[1]}${read[0] === read[1] ? "" : " <-- differs"}`);
      if (hr !== hp || read[0] !== read[1]) flagged++;

      const sections = [
        ["header", "header"],
        ...(w >= 1048 ? [["sidebar", "aside"]] : []),
        ...ids.map((id) => [id, `[id="${id}"]`]),
        ["more", '[data-screen-label="More essays"]'],
        ["closing", '[data-screen-label="Closing"]'],
        ["footer", "footer"],
      ];
      for (const [name, sel] of sections) {
        const n = await Promise.all([ref.page, port.page].map((p) => p.locator(sel).count()));
        if (!n[0] || !n[1]) {
          console.log(`    ${name}: ${n[0] ? "" : "missing in reference "}${n[1] ? "" : "missing in port"}`);
          flagged++;
          continue;
        }
        // The header at the top of the page. The sidebar 200px down, where it has stuck at 40px
        // and fits the viewport exactly (at the top it runs 29px below it, on both sides, and
        // Chrome's capture beyond the viewport renders that part inconsistently).
        if (name === "header") await Promise.all([ref.page, port.page].map((p) => p.evaluate(() => scrollTo(0, 0))));
        if (name === "sidebar") await Promise.all([ref.page, port.page].map((p) => p.evaluate(() => scrollTo(0, 200))));
        const base = path.join(out, `${w}-${essay.num}-${name.slice(0, 40)}`);
        const shoot = async (p, file) => {
          if (name === "sidebar") {
            await p.waitForTimeout(250);
            await p.locator(sel).screenshot({ path: file, animations: "disabled" });
          } else await shootEl(p, sel, file);
        };
        await shoot(ref.page, `${base}-ref.png`);
        await shoot(port.page, `${base}-port.png`);
        const d = diffPng(`${base}-ref.png`, `${base}-port.png`, `${base}-diff.png`);
        const t = firstDiff(await textOf(ref.page, sel), await textOf(port.page, sel));
        const bad = d.ratio > 0.005 || d.ref !== d.port || t;
        if (bad) flagged++;
        if (!quiet || bad) {
          console.log(`    ${name.slice(0, 44).padEnd(46)} ${(d.ref === d.port ? d.ref : `ref ${d.ref} port ${d.port}`).padEnd(24)} ${pct(d.ratio).padStart(7)}${t ? `  TEXT ${t}` : ""}`);
        }
      }
      if (port.errors.length) console.log(`    port console errors:\n      ${port.errors.join("\n      ")}`);
      await ref.ctx.close();
      await port.ctx.close();
    }
  }
} finally {
  await browser.close();
}
console.log(flagged ? `\n${flagged} item(s) to look at` : "\nall sections match");
