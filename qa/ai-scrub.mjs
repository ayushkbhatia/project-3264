#!/usr/bin/env node
// AI Engineering: reference vs port at the scroll-driven points of the handoff's
// qa/scrub-points.json (kinds `anchor` and `track`), plus any extra --points.
//
//   node qa/ai-scrub.mjs [--vp 1440x900,1280x800,1920x1080] [--only premise-010,footer]
//                        [--extra "track:premise:0.2,anchor:#audit:68"] [--out qa/__screens__/ai-scrub]
//                        [--reduced]   (both sides with prefers-reduced-motion: the static states)
//
// Both sides load with ?intro=off (the time loops keep running; the audit loop only starts
// once it is in view, and none of these points reach it). For each point: the viewport pixels
// (dev badge hidden), and the visible text of the section under test, which catches a wrong
// state outright. Writes <id>.side.png (reference left, port right) and <id>.diff.png.

import fs from "node:fs";
import path from "node:path";
import { PORT, REF, arg, diff, flag, go, launch, open, settleImages, side, strictDiff, visibleText } from "./ai-lib.mjs";

const spec = JSON.parse(fs.readFileSync("design_handoff_ai_engineering/qa/scrub-points.json", "utf8"));
const vps = String(arg("vp", "1440x900,1280x800,1920x1080")).split(",").map((v) => v.split("x").map(Number));
const only = arg("only", null)?.split(",");
const outRoot = arg("out", "qa/__screens__/ai-scrub");
const extra = (arg("extra", "") || "").split(",").filter(Boolean).map((s) => {
  const [kind, a, b] = s.split(":");
  return kind === "track"
    ? { id: `x-${a}-${b}`, kind, track: a, m: +b }
    : { id: `x-${a.replace(/\W/g, "")}-${b}`, kind: "anchor", selector: a, offset: +b };
});
const points = [
  ...spec.points.filter((p) => (p.kind === "anchor" || p.kind === "track") && (!only || only.includes(p.id))),
  ...extra,
];

const scope = (p) =>
  p.kind === "track" ? (p.track === "premise" ? "section[data-screen-label='Premise']" : "#engagement") : p.selector;

const browser = await launch();
let worst = 0, mismatches = 0, total = 0;
try {
  for (const [w, h] of vps) {
    const dir = path.join(outRoot, `${w}x${h}`);
    fs.mkdirSync(dir, { recursive: true });
    const ctxOpts = flag("reduced") ? { reducedMotion: "reduce" } : {};
    const ref = await open(browser, REF, w, h, ctxOpts);
    const port = await open(browser, PORT, w, h, ctxOpts);
    for (const p of points) {
      const [yr, yp] = [await go(ref.page, p), await go(port.page, p)];
      await Promise.all([settleImages(ref.page), settleImages(port.page)]);
      await ref.page.waitForTimeout(700);
      await port.page.waitForTimeout(100);
      const [ra, pa] = [await ref.page.screenshot(), await port.page.screenshot()];
      const [rt, pt] = [await visibleText(ref.page, scope(p)), await visibleText(port.page, scope(p))];
      const d = diff(ra, pa, path.join(dir, `${p.id}.diff.png`));
      const sd = strictDiff(ra, pa);
      side(ra, pa, path.join(dir, `${p.id}.side.png`));
      total++;
      const tm = rt !== pt;
      if (tm) mismatches++;
      worst = Math.max(worst, d);
      console.log(`${w}x${h} ${p.id}: y ${yr}/${yp}  diff ${(d * 100).toFixed(2)}%  strict ${(sd * 100).toFixed(2)}%${tm ? "  TEXT DIFFERS" : ""}${d > 0.005 || tm ? "  <<" : ""}`);
      if (tm) {
        let k = 0;
        while (rt[k] === pt[k]) k++;
        console.log(`   ref : …${rt.slice(Math.max(0, k - 100), k + 140)}`);
        console.log(`   port: …${pt.slice(Math.max(0, k - 100), k + 140)}`);
      }
    }
    for (const [label, s] of [["ref", ref], ["port", port]]) if (s.errors.length) console.log(`  ${label} errors: ${s.errors.slice(0, 5).join(" / ")}`);
    await ref.ctx.close();
    await port.ctx.close();
  }
} finally {
  await browser.close();
}
console.log(`\n${total} points, worst pixel diff ${(worst * 100).toFixed(2)}%, text mismatches ${mismatches}`);
