#!/usr/bin/env node
// Playbooks accessibility (specs/08, CHECKLIST.md): axe-core (WCAG 2.1 AA) in the browsing,
// filtering and subscribed states at 1440 and 390; landmarks and the heading outline; a Tab
// sweep checking every stop shows a focus ring; 44px hit areas; the header menu below 1000px;
// and no horizontal scroll down to 320px.
//
//   node qa/pb-a11y.mjs

import { createRequire } from "node:module";
import fs from "node:fs";
import { PORT, launch, loadAll } from "./pb-lib.mjs";

const AXE = fs.readFileSync(createRequire(import.meta.url).resolve("axe-core/axe.min.js"), "utf8");
const ok = (b) => (b ? "ok " : "FAIL");
const browser = await launch();

async function axe(p, label) {
  await p.addScriptTag({ content: AXE });
  const r = await p.evaluate(() => window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"] } }));
  const v = r.violations.map((x) => `${x.id} (${x.impact}, ${x.nodes.length}): ${x.nodes.slice(0, 2).map((n) => n.target.join(" ")).join(" | ")}`);
  console.log(`${ok(!v.length)} axe ${label}: ${v.length ? "\n      " + v.join("\n      ") : "no violations"} (${r.incomplete.length} need review: ${r.incomplete.map((x) => x.id).join(", ") || "none"})`);
}

try {
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: "reduce" });
    const p = await ctx.newPage();
    await p.goto(PORT, { waitUntil: "networkidle" });
    await loadAll(p);
    await axe(p, `@${w} browsing`);
    await p.click('button[data-cat="Private Credit"]');
    await axe(p, `@${w} filtered`);
    await p.fill('input[type="search"]', "zzz");
    await axe(p, `@${w} no results`);
    await p.getByRole("button", { name: "Clear" }).click();
    await p.fill('input[type="email"]', "analyst@fund.com");
    await p.locator('[data-screen-label="Library CTAs"] button[type="submit"]').click();
    await p.waitForTimeout(900);
    await axe(p, `@${w} subscribed`);
    await ctx.close();
  }

  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
    const p = await ctx.newPage();
    await p.goto(PORT, { waitUntil: "networkidle" });

    const outline = await p.evaluate(() => {
      const count = (s) => document.querySelectorAll(s).length;
      const hs = [...document.querySelectorAll("h1,h2,h3")].filter((e) => !e.closest("[aria-hidden='true'],[inert]")).map((e) => `${e.tagName.toLowerCase()} ${e.textContent.trim().slice(0, 34)}`);
      return { header: count("header"), main: count("main"), footer: count("footer"), h1: count("h1"), search: count("[role=search]"), hs };
    });
    console.log(`${ok(outline.header === 1 && outline.main === 1 && outline.footer === 1 && outline.h1 === 1 && outline.search === 1)} landmarks: header ${outline.header}, main ${outline.main}, footer ${outline.footer}, search ${outline.search}; h1 ${outline.h1}`);
    console.log(`     heading outline (exposed): ${outline.hs.join(" / ")}`);

    // Tab sweep: every stop has a visible ring (outline, or the search field's border ring).
    const stops = [];
    await p.keyboard.press("Tab");
    for (let i = 0; i < 90; i++) {
      const s = await p.evaluate(() => {
        const e = document.activeElement;
        if (!e || e === document.body) return null;
        const cs = getComputedStyle(e);
        const form = e.closest("form");
        const ring = (cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) >= 2) || (form && getComputedStyle(form).outlineStyle !== "none");
        const name = (e.getAttribute("aria-label") || e.textContent || e.getAttribute("placeholder") || e.tagName).trim().replace(/\s+/g, " ").slice(0, 32);
        return { name, ring, color: cs.outlineColor, inFooter: !!e.closest("footer") };
      });
      if (!s) break;
      stops.push(s);
      if (s.name === "LinkedIn") break;
      await p.keyboard.press("Tab");
    }
    const bad = stops.filter((s) => !s.ring);
    console.log(`${ok(!bad.length && stops.length > 40)} focus rings: ${stops.length} tab stops, ${bad.length} without a ring${bad.length ? ": " + bad.map((b) => b.name).join(", ") : ""}`);
    const heroRing = stops.find((s) => s.name === "Browse the library")?.color;
    console.log(`${ok(heroRing === "rgb(244, 243, 240)")} hero ring colour ${heroRing} (#F4F3F0 on the dark hero)`);
    const slideLinks = stops.filter((s) => s.name.startsWith("Read the playbook")).length;
    console.log(`${ok(slideLinks === 1)} carousel: ${slideLinks} "Read the playbook" stop (inactive slides skipped)`);

    // Hit areas: the visible chip is 34px and the segment 20px; ::before extends both to 44px.
    const hit = await p.evaluate(() => {
      const m = (e) => { const r = e.getBoundingClientRect(), b = getComputedStyle(e, "::before"); return r.height - parseFloat(b.top) - parseFloat(b.bottom); };
      return { chip: m(document.querySelector("#library button")), seg: m(document.querySelector('[aria-label="Show Covenant Watch"]')), arrow: document.querySelector('[aria-label="Next playbook"]').getBoundingClientRect().height };
    });
    console.log(`${ok(hit.chip >= 44 && hit.seg >= 44 && hit.arrow >= 44)} hit areas: chip ${hit.chip}px, segment ${hit.seg}px, arrow ${hit.arrow}px`);
    await ctx.close();
  }

  // Header menu below 1000px.
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
    const p = await ctx.newPage();
    await p.goto(PORT, { waitUntil: "networkidle" });
    const btn = p.locator("[data-menu-button]");
    const navHidden = await p.evaluate(() => getComputedStyle(document.querySelector("header nav")).visibility);
    const navLinks = await p.evaluate(() => document.querySelector("header nav").children.length);
    await btn.click();
    const open = await p.evaluate(() => { const s = document.querySelector("[data-menu-sheet]"); const r = s.getBoundingClientRect(); const rows = [...s.querySelectorAll("a")].map((a) => [a.textContent, a.getBoundingClientRect().height, getComputedStyle(a).fontSize]); return { hidden: s.hidden, top: r.top, w: r.width, rows }; });
    await p.keyboard.press("Escape");
    const after = await p.evaluate(() => ({ hidden: document.querySelector("[data-menu-sheet]").hidden, focus: document.activeElement?.hasAttribute("data-menu-button"), exp: document.querySelector("[data-menu-button]").getAttribute("aria-expanded") }));
    console.log(`${ok(navHidden === "hidden" && !open.hidden && open.rows.length === navLinks && open.rows.every(([, h, fs]) => h === 48 && fs === "16px") && open.w === 390)} menu @390: inline nav ${navHidden}; sheet at y=${open.top}, ${open.w}px wide, rows ${open.rows.map(([t]) => t).join(" · ")} (48px, 16px)`);
    console.log(`${ok(after.hidden && after.focus && after.exp === "false")} Escape closes (hidden ${after.hidden}), focus back on the button ${after.focus}, aria-expanded ${after.exp}`);
    await ctx.close();

    const wide = await browser.newContext({ viewport: { width: 1000, height: 800 } });
    const q = await wide.newPage();
    await q.goto(PORT, { waitUntil: "networkidle" });
    // one line: the first and last links share a top (the nav's own box carries focus-ring padding)
    const vis = await q.evaluate(() => {
      const nav = document.querySelector("header nav");
      const top = (el) => Math.round(el.getBoundingClientRect().top);
      return { nav: getComputedStyle(nav).visibility, btn: getComputedStyle(document.querySelector("[data-menu-button]")).display, oneLine: top(nav.firstElementChild) === top(nav.lastElementChild), links: nav.children.length };
    });
    console.log(`${ok(vis.nav === "visible" && vis.btn === "none" && vis.oneLine)} @1000: inline nav ${vis.nav}, ${vis.links} links on one line ${vis.oneLine}, menu button display ${vis.btn}`);
    await wide.close();
  }

  // No horizontal scroll.
  for (const w of [320, 360, 390, 768, 924, 1024]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 800 }, reducedMotion: "reduce" });
    const p = await ctx.newPage();
    await p.goto(PORT, { waitUntil: "networkidle" });
    const sw = await p.evaluate(() => { scrollTo(10000, 0); return [document.documentElement.scrollWidth, scrollX]; });
    console.log(`${ok(sw[0] === w && sw[1] === 0)} @${w}: scrollWidth ${sw[0]}, scrollX after scrollTo(10000) ${sw[1]}`);
    await ctx.close();
  }
} finally {
  await browser.close();
}
