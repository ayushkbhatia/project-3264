#!/usr/bin/env node
// Playbooks: every section, reference vs port, pixel diff per section and width (reduced
// motion on both sides, all lazy images loaded).
//
//   node qa/pb-sections.mjs [--w 1440,1280,1024,768,390] [--only featured,ctas]
//
// Writes ref / port / diff PNGs to qa/__screens__/pb-sections/. The hero differs only by the
// video's first frame (the reference streams the source clip, the port shows its poster).
// Below 1000px the port's header has the menu button the reference lacks (specs/08), and below
// 480px every section's side padding is 20px instead of 40px (specs/08): expect those diffs.

import path from "node:path";
import { REF, PORT, SECTIONS, arg, diffPng, launch, loadAll, open, outDir, pct, shootEl } from "./pb-lib.mjs";

const widths = String(arg("w", "1440,1280")).split(",").map(Number);
const only = arg("only", null)?.split(",");
const out = outDir("pb-sections");

const browser = await launch();
try {
  for (const w of widths) {
    const ref = await open(browser, REF, w);
    const port = await open(browser, PORT, w);
    await Promise.all([loadAll(ref.page), loadAll(port.page)]);
    const [hr, hp] = await Promise.all([ref.page, port.page].map((p) => p.evaluate(() => document.documentElement.scrollHeight)));
    console.log(`@${w}: document height ref ${hr} port ${hp}${hr === hp ? "" : "  <-- differs"}`);
    for (const [name, sel] of SECTIONS) {
      if (only && !only.includes(name)) continue;
      const rf = path.join(out, `${w}-${name}-ref.png`), pf = path.join(out, `${w}-${name}-port.png`), df = path.join(out, `${w}-${name}-diff.png`);
      await shootEl(ref.page, sel, rf);
      await shootEl(port.page, sel, pf);
      const d = diffPng(rf, pf, df);
      const size = d.ref === d.port ? d.ref : `ref ${d.ref} port ${d.port}`;
      console.log(`  ${name.padEnd(17)} ${size.padEnd(26)} ${pct(d.ratio)}`);
    }
    if (port.errors.length) console.log(`  port console errors:\n    ${port.errors.join("\n    ")}`);
    await ref.ctx.close();
    await port.ctx.close();
  }
} finally {
  await browser.close();
}
