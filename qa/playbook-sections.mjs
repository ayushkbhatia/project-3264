#!/usr/bin/env node
// A playbook page: every section, reference vs port, pixel diff per section and width (reduced
// motion on both sides, every lazy image loaded), plus the document heights and the sidebar.
//
//   BASE_URL=http://localhost:3000 node qa/playbook-sections.mjs --page loan-ops-ledger [--w 1440,1280,1024,768,390] [--only hero,runs]
//
// Writes ref / port / diff PNGs to qa/__screens__/playbook-sections/<page>/. Expected differences: below
// 1000px the port's header has the menu button the reference lacks (the Playbooks page's
// specs/08), and below 480px the footer's side padding is 20px (the same).

import path from "node:path";
import { PAGE, REF, PORT, SECTIONS, arg, diffPng, launch, loadAll, open, outDir, pct, settle, shootEl } from "./playbook-lib.mjs";

const widths = String(arg("w", "1440,1280")).split(",").map(Number);

const hideSticky = (p) =>
  p.addStyleTag({ content: 'header, [data-pb-tocbar], [style*="top: 68px"] { visibility: hidden !important; }' });
const only = arg("only", null)?.split(",");
const out = outDir(`playbook-sections/${PAGE}`);

const browser = await launch();
try {
  for (const w of widths) {
    const ref = await open(browser, REF, w);
    const port = await open(browser, PORT, w);
    await Promise.all([loadAll(ref.page), loadAll(port.page), settle(ref.page)]);
    const [hr, hp] = await Promise.all([ref.page, port.page].map((p) => p.evaluate(() => document.documentElement.scrollHeight)));
    console.log(`@${w}: document height ref ${hr} port ${hp}${hr === hp ? "" : "  <-- differs"}`);
    const shots = [...SECTIONS];
    if (w >= 1048) shots.splice(1, 0, ["sidebar", "aside", "aside"]);
    for (const [name, psel, rsel] of shots) {
      if (only && !only.includes(name)) continue;
      const rf = path.join(out, `${w}-${name}-ref.png`), pf = path.join(out, `${w}-${name}-port.png`), df = path.join(out, `${w}-${name}-diff.png`);
      if (name === "sidebar") {
        // the contents' active state follows the scroll position: shoot both at the top
        await Promise.all([ref.page, port.page].map((p) => p.evaluate(() => scrollTo(0, 0))));
        await Promise.all([ref.page, port.page].map((p) => p.waitForTimeout(400)));
        await ref.page.locator(rsel).first().screenshot({ path: rf, animations: "disabled" });
        await port.page.locator(psel).first().screenshot({ path: pf, animations: "disabled" });
      } else {
        // Tall sections are captured in several scrolls: keep the sticky header and the phone
        // contents bar out of them (hidden, not removed, so nothing reflows).
        if (name !== "header") await Promise.all([ref.page, port.page].map(hideSticky));
        await shootEl(ref.page, rsel, rf);
        await shootEl(port.page, psel, pf);
      }
      const d = diffPng(rf, pf, df);
      const size = d.ref === d.port ? d.ref : `ref ${d.ref} port ${d.port}`;
      console.log(`  ${name.padEnd(10)} ${size.padEnd(26)} ${pct(d.ratio)}`);
    }
    if (port.errors.length) console.log(`  port console errors:\n    ${port.errors.join("\n    ")}`);
    await ref.ctx.close();
    await port.ctx.close();
  }
} finally {
  await browser.close();
}
