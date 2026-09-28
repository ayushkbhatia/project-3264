#!/usr/bin/env node
// Covenant Watch accessibility: axe-core (WCAG 2.1 AA + best practice) at 1440 and 390, with
// the FAQ and the phone contents open too; landmarks and the heading outline; a Tab sweep in
// which every stop shows a focus ring and none is hidden under the sticky header or the phone
// bar; hit areas of at least 24px; and no horizontal scroll from 320px up.
//
//   PORT_URL=… node qa/cw-a11y.mjs

import { createRequire } from "node:module";
import fs from "node:fs";
import { PORT, launch, loadAll } from "./cw-lib.mjs";

const AXE = fs.readFileSync(createRequire(import.meta.url).resolve("axe-core/axe.min.js"), "utf8");
let fails = 0;
const check = (b, msg) => {
  if (!b) fails++;
  console.log(`${b ? "ok  " : "FAIL"} ${msg}`);
};

async function axe(p, label) {
  await p.addScriptTag({ content: AXE });
  const r = await p.evaluate(() =>
    window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"] } }),
  );
  const v = r.violations.map((x) => `${x.id} (${x.impact}, ${x.nodes.length}): ${x.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`);
  check(!v.length, `axe ${label}: ${v.length ? "\n      " + v.join("\n      ") : "no violations"} (${r.incomplete.length} to review: ${r.incomplete.map((x) => x.id).join(", ") || "none"})`);
}

const browser = await launch();
try {
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: "reduce" });
    const p = await ctx.newPage();
    await p.goto(PORT, { waitUntil: "networkidle" });
    await loadAll(p);
    await axe(p, `@${w}`);
    for (let i = 1; i < 6; i++) await p.locator("#questions button").nth(i).click();
    if (w < 1048) await p.locator("[data-pb-tocbar] button").click();
    await axe(p, `@${w} FAQ${w < 1048 ? " and phone contents" : ""} open`);
    await ctx.close();
  }

  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
    const p = await ctx.newPage();
    await p.goto(PORT, { waitUntil: "networkidle" });
    const o = await p.evaluate(() => {
      const count = (s) => document.querySelectorAll(s).length;
      const visible = (e) => !e.closest("[aria-hidden='true'],[hidden]") && e.getClientRects().length > 0;
      const hs = [...document.querySelectorAll("h1,h2,h3")].filter(visible).map((e) => `${e.tagName[1]} ${e.textContent.trim().slice(0, 30)}`);
      // levels never skip downwards
      let prev = 1, skips = 0;
      for (const hh of hs) {
        const l = +hh[0];
        if (l > prev + 1) skips++;
        prev = l;
      }
      const lm = [...document.querySelectorAll("header,main,footer,nav,aside,section[aria-labelledby]")].filter(visible).map((e) => e.tagName.toLowerCase() + (e.getAttribute("aria-label") ? `(${e.getAttribute("aria-label")})` : ""));
      return { header: count("body > header"), main: count("main"), footer: count("footer"), h1: count("h1"), hs, skips, lm };
    });
    check(o.header === 1 && o.main === 1 && o.footer === 1 && o.h1 === 1 && o.skips === 0, `landmarks: header ${o.header}, main ${o.main}, footer ${o.footer}; one h1; heading levels never skip (${o.skips})`);
    console.log(`     landmarks: ${o.lm.join(", ")}`);
    console.log(`     outline: ${o.hs.join(" / ")}`);
    await ctx.close();
  }

  // Tab sweep: every stop has a visible outline, and sits clear of the sticky chrome.
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: "reduce" });
    const p = await ctx.newPage();
    await p.goto(PORT, { waitUntil: "networkidle" });
    const noRing = [], covered = [];
    let stops = 0;
    for (let i = 0; i < 160; i++) {
      await p.keyboard.press("Tab");
      const s = await p.evaluate(() => {
        const e = document.activeElement;
        if (!e || e === document.body) return null;
        const cs = getComputedStyle(e);
        const r = e.getBoundingClientRect();
        const bar = document.querySelector("[data-pb-tocbar]");
        const barBottom = bar && getComputedStyle(bar).display !== "none" ? bar.getBoundingClientRect().bottom : 0;
        const inChrome = !!e.closest("header, [data-pb-tocbar]");
        const limit = Math.max(69, barBottom);
        return {
          name: (e.textContent || e.getAttribute("aria-label") || e.tagName).trim().slice(0, 30),
          ring: cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) >= 2,
          covered: !inChrome && r.top < limit,
          footer: !!e.closest("footer"),
        };
      });
      if (!s) continue;
      stops++;
      if (!s.ring) noRing.push(s.name);
      if (s.covered) covered.push(s.name);
      if (s.footer && s.name === "LinkedIn") break;
    }
    check(!noRing.length, `@${w} Tab sweep: ${stops} stops, every one with a focus ring${noRing.length ? " (missing: " + noRing.join(", ") + ")" : ""}`);
    check(!covered.length, `@${w} Tab sweep: no stop hidden under the sticky header${w < 1048 ? " or the phone bar" : ""}${covered.length ? " (" + covered.join(", ") + ")" : ""}`);
    await ctx.close();
  }

  // Hit areas: every link and button at least 24px in each direction (WCAG 2.5.8), counting an
  // invisible ::before that enlarges it.
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: "reduce" });
    const p = await ctx.newPage();
    await p.goto(PORT, { waitUntil: "networkidle" });
    const small = await p.evaluate(() => {
      const out = [];
      for (const e of document.querySelectorAll("a, button")) {
        // the site header and footer are shared chrome, audited with the Playbooks page (their
        // links pass 2.5.8 by spacing)
        if (!e.getClientRects().length || e.closest("[hidden],footer,body > header")) continue;
        const r = e.getBoundingClientRect();
        const b = getComputedStyle(e, "::before");
        let hgt = r.height, wid = r.width;
        if (b.content !== "none" && b.position === "absolute") {
          hgt = Math.max(hgt, r.height - parseFloat(b.top) - parseFloat(b.bottom));
          wid = Math.max(wid, r.width - parseFloat(b.left) - parseFloat(b.right));
        }
        // inline links inside a line of text are exempt (2.5.8, "inline")
        const inline = getComputedStyle(e).display === "inline" && e.parentElement && e.parentElement.textContent.trim() !== e.textContent.trim();
        if (!inline && (hgt < 24 || wid < 24)) out.push(`${e.textContent.trim().slice(0, 24) || e.getAttribute("aria-label")} ${wid.toFixed(0)}×${hgt.toFixed(0)}`);
      }
      return out;
    });
    check(!small.length, `@${w} hit areas ≥ 24px${small.length ? ": " + small.join("; ") : ""}`);
    await ctx.close();
  }

  // No horizontal scroll.
  {
    const bad = [];
    for (const w of [320, 360, 390, 430, 560, 768, 1024, 1047, 1048, 1280, 1440]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, reducedMotion: "reduce" });
      const p = await ctx.newPage();
      await p.goto(PORT, { waitUntil: "networkidle" });
      const over = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (over > 0) bad.push(`${w}: +${over}px`);
      await ctx.close();
    }
    check(!bad.length, `no horizontal scroll at 320–1440${bad.length ? ": " + bad.join(", ") : ""}`);
  }
} finally {
  await browser.close();
}
console.log(fails ? `\n${fails} check(s) failed` : "\nall checks passed");
process.exitCode = fails ? 1 : 0;
