#!/usr/bin/env node
// AI Engineering: the time-driven and input-driven points of the handoff's scrub-points.json,
// reference vs port, side by side (pixel diffs are indicative only: frames can differ by one).
//
//   node qa/ai-motion.mjs [--vp 1440x900] [--only audit,hold,platform] [--out qa/__screens__/ai-motion]
//
//   audit     scroll #audit to 68px, capture at 2.4s, 7.5s, 11.8s, 14.0s, 18.0s of real time
//   hold      scroll #rebuild to the top, wheel down: the page must stop at 03 (scrollY fixed)
//             while the build advances; then wait for completion (__rbCtl.shown ≥ 0.999)
//   platform  after completion, scroll 04 to just under the header, capture 4.5s after landing
//
// Both pages run side by side in one browser; each point drives both at once so their clocks
// start together.

import fs from "node:fs";
import path from "node:path";
import { PORT, REF, arg, diff, launch, open, settleImages, side } from "./ai-lib.mjs";

const vps = String(arg("vp", "1440x900")).split(",").map((v) => v.split("x").map(Number));
const only = arg("only", "audit,hold,platform").split(",");
const outRoot = arg("out", "qa/__screens__/ai-motion");

const both = (pages, fn) => Promise.all(pages.map(fn));

async function scrollTo(page, sel, offset) {
  return page.evaluate(([sel, off]) => {
    const el = document.querySelector(sel);
    const y = Math.round(el.getBoundingClientRect().top + scrollY - off);
    scrollTo(0, y);
    return y;
  }, [sel, offset]);
}

const browser = await launch();
try {
  for (const [w, h] of vps) {
    const dir = path.join(outRoot, `${w}x${h}`);
    fs.mkdirSync(dir, { recursive: true });
    const shoot = async (pages, id) => {
      const [a, b] = await both(pages, (p) => p.screenshot());
      side(a, b, path.join(dir, `${id}.side.png`));
      console.log(`${w}x${h} ${id}: diff ${(diff(a, b) * 100).toFixed(2)}%`);
    };

    if (only.includes("audit")) {
      const sides = [await open(browser, REF, w, h), await open(browser, PORT, w, h)];
      const pages = sides.map((s) => s.page);
      await both(pages, (p) => scrollTo(p, "#audit", 68));
      await both(pages, settleImages);
      const t0 = Date.now();
      for (const ms of [2400, 7500, 11800, 14000, 18000]) {
        await new Promise((r) => setTimeout(r, Math.max(0, t0 + ms - Date.now())));
        await shoot(pages, `audit-${ms}`);
      }
      for (const s of sides) await s.ctx.close();
    }

    if (only.includes("hold") || only.includes("platform")) {
      const sides = [await open(browser, REF, w, h), await open(browser, PORT, w, h)];
      const pages = sides.map((s) => s.page);
      // approach 03 from above, as a reader does: park just above the hold point, then wheel
      await both(pages, (p) => scrollTo(p, "#rebuild", 0));
      await both(pages, settleImages);
      for (let i = 0; i < 12; i++) {
        await both(pages, (p) => p.mouse.wheel(0, 120));
        await new Promise((r) => setTimeout(r, 60));
      }
      await new Promise((r) => setTimeout(r, 400));
      const y1 = await both(pages, (p) => p.evaluate(() => [scrollY, window.__rbCtl && +window.__rbCtl.shown.toFixed(3)]));
      for (let i = 0; i < 8; i++) {
        await both(pages, (p) => p.mouse.wheel(0, 120));
        await new Promise((r) => setTimeout(r, 60));
      }
      await new Promise((r) => setTimeout(r, 300));
      const y2 = await both(pages, (p) => p.evaluate(() => [scrollY, window.__rbCtl && +window.__rbCtl.shown.toFixed(3)]));
      console.log(`${w}x${h} hold: [scrollY, shown] ref ${JSON.stringify(y1[0])} -> ${JSON.stringify(y2[0])}   port ${JSON.stringify(y1[1])} -> ${JSON.stringify(y2[1])}`);
      await shoot(pages, "rebuild-hold");
      await both(pages, (p) => p.waitForFunction(() => window.__rbCtl && window.__rbCtl.shown >= 0.999, null, { timeout: 30000 }));
      await new Promise((r) => setTimeout(r, 300));
      await shoot(pages, "rebuild-built");
      if (only.includes("platform")) {
        // 03 is complete: scroll on until 04's frame sits just under the header. The flight
        // (scroll-driven) lands on the way, which starts 04's clock.
        await both(pages, (p) => p.evaluate(() => {
          const f = document.querySelector("[data-svg='1a']").parentElement;
          scrollTo(0, Math.round(f.getBoundingClientRect().top + scrollY - 90));
        }));
        const [ra, pa] = await both(pages, (p) => p.evaluate(() => {
          const f = document.querySelector("[data-svg='1a']").parentElement.getBoundingClientRect();
          return [scrollY, Math.round(f.top)];
        }));
        console.log(`${w}x${h} platform: [scrollY, 04 top] ref ${ra}  port ${pa}`);
        await new Promise((r) => setTimeout(r, 4500));
        await shoot(pages, "platform-land");
      }
      for (const [label, s] of [["ref", sides[0]], ["port", sides[1]]]) if (s.errors.length) console.log(`  ${label} errors: ${s.errors.slice(0, 5).join(" / ")}`);
      for (const s of sides) await s.ctx.close();
    }
  }
} finally {
  await browser.close();
}
