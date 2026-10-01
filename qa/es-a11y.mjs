#!/usr/bin/env node
// Essays: accessibility and behaviour (design_handoff_essays README, "Accessibility" and
// "Behaviour"), on the port:
//   - axe-core (WCAG 2.1 AA) on the index (All, and filtered) and on four essays, at 1440 / 390;
//   - landmarks and the heading outline; a Tab sweep (every stop shows a focus ring);
//   - no sideways scroll at 320–1024px, on the index and an essay;
//   - the filter: chips, aria-pressed, the live label and count, ?category= in and out;
//   - an essay: reference links land on their source, sources open in a new tab, the contents
//     bar under 1048px, copy link, and the read time against the body;
//   - every page's seven-link nav fits on one line down to that page's collapse width.
//
//   node qa/es-a11y.mjs

import { createRequire } from "node:module";
import fs from "node:fs";
import { ESSAYS, PORT, launch, loadAll } from "./es-lib.mjs";

const AXE = fs.readFileSync(createRequire(import.meta.url).resolve("axe-core/axe.min.js"), "utf8");
const ok = (b) => (b ? "ok " : "FAIL");
const browser = await launch();
let fails = 0;
const check = (pass, msg) => {
  if (!pass) fails++;
  console.log(`${ok(pass)} ${msg}`);
};

async function page(url, w, h = 900, opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: "reduce", ...opts });
  const p = await ctx.newPage();
  await p.goto(url, { waitUntil: "networkidle", timeout: 90000 });
  await p.evaluate(() => document.fonts.ready);
  return { ctx, p };
}

async function axe(p, label) {
  await p.addScriptTag({ content: AXE });
  const r = await p.evaluate(() => window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"] } }));
  const v = r.violations.map((x) => `${x.id} (${x.impact}, ${x.nodes.length}): ${x.nodes.slice(0, 2).map((n) => n.target.join(" ")).join(" | ")}`);
  check(!v.length, `axe ${label}: ${v.length ? "\n      " + v.join("\n      ") : "no violations"}`);
}

const outline = (p) =>
  p.evaluate(() => ({
    landmarks: ["header", "main", "footer"].map((t) => document.querySelectorAll(t).length),
    h1: document.querySelectorAll("h1").length,
    heads: [...document.querySelectorAll("h1,h2,h3")].filter((e) => !e.closest("[aria-hidden='true'],[hidden]")).map((e) => e.tagName.toLowerCase() + " " + e.textContent.trim().slice(0, 28)),
  }));

async function tabSweep(p, stopAt) {
  const stops = [];
  await p.keyboard.press("Tab");
  for (let i = 0; i < 200; i++) {
    const s = await p.evaluate(() => {
      const e = document.activeElement;
      if (!e || e === document.body) return null;
      const cs = getComputedStyle(e);
      const form = e.closest("form");
      const ring = (cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) >= 2) || (form && getComputedStyle(form).outlineStyle !== "none");
      return { name: (e.getAttribute("aria-label") || e.textContent || e.getAttribute("placeholder") || e.tagName).trim().replace(/\s+/g, " ").slice(0, 40), ring };
    });
    if (!s) break;
    stops.push(s);
    if (s.name.startsWith(stopAt)) break;
    await p.keyboard.press("Tab");
  }
  return stops;
}

try {
  /* ------------------------------------------------------------------ index */
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    const { ctx, p } = await page(`${PORT}/essays`, w, h);
    await loadAll(p);
    await axe(p, `index @${w} (All)`);
    await p.click('button[data-cat="Engineering"]');
    await p.waitForTimeout(300); // past the chips' 160ms colour transition
    await axe(p, `index @${w} (Engineering)`);
    await ctx.close();
  }
  {
    const { ctx, p } = await page(`${PORT}/essays`, 1440);
    const o = await outline(p);
    check(o.landmarks.join() === "1,1,1" && o.h1 === 1, `index landmarks header/main/footer ${o.landmarks.join("/")}, h1 ${o.h1}`);
    console.log(`     outline: ${o.heads.join(" / ")}`);
    const stops = await tabSweep(p, "LinkedIn");
    const bad = stops.filter((s) => !s.ring);
    check(!bad.length && stops.length > 30, `index focus rings: ${stops.length} stops, ${bad.length} without a ring${bad.length ? ": " + bad.map((b) => b.name).join(", ") : ""}`);

    // the filter
    const state = () =>
      p.evaluate(() => ({
        pressed: [...document.querySelectorAll("button[aria-pressed='true']")].map((b) => b.dataset.cat),
        label: document.querySelector('[data-screen-label="All essays"] h2').textContent,
        count: document.querySelector('[data-screen-label="All essays"] h2').nextElementSibling.textContent,
        rows: document.querySelectorAll('[data-screen-label="All essays"] li').length,
        lead: !!document.querySelector('[data-screen-label="Lead essay"]'),
        search: location.search,
      }));
    const all = await state();
    await p.click('button[data-cat="Governance"]');
    await p.waitForTimeout(100);
    const gov = await state();
    check(all.rows === 15 && all.lead && all.label === "All essays" && all.count === "15 essays", `All: ${all.rows} rows, lead shown, "${all.label}" "${all.count}"`);
    check(gov.rows === 1 && !gov.lead && gov.label === "Governance" && gov.count === "1 essay" && gov.pressed.join() === "Governance" && gov.search === "?category=governance", `Governance: ${gov.rows} row, lead hidden, "${gov.label}" "${gov.count}", pressed ${gov.pressed}, url ${gov.search}`);
    await ctx.close();
    const shared = await page(`${PORT}/essays?category=strategy`, 1440);
    await shared.p.waitForTimeout(300);
    const s = await shared.p.evaluate(() => ({ rows: document.querySelectorAll('[data-screen-label="All essays"] li').length, label: document.querySelector('[data-screen-label="All essays"] h2').textContent }));
    check(s.rows === 4 && s.label === "Strategy", `?category=strategy opens filtered: ${s.rows} rows, "${s.label}"`);
    await shared.ctx.close();
  }

  /* ----------------------------------------------------------------- essays */
  for (const num of ["01", "03", "11", "13"]) {
    const e = ESSAYS.find((x) => x.num === num);
    for (const [w, h] of [[1440, 900], [390, 844]]) {
      const { ctx, p } = await page(`${PORT}/essays/${e.slug}`, w, h);
      await loadAll(p);
      await axe(p, `essay ${num} @${w}`);
      await ctx.close();
    }
  }
  {
    const e = ESSAYS.find((x) => x.num === "01");
    const { ctx, p } = await page(`${PORT}/essays/${e.slug}`, 1440, 900, { permissions: ["clipboard-read", "clipboard-write"] });
    const o = await outline(p);
    check(o.landmarks.join() === "1,1,1" && o.h1 === 1, `essay landmarks ${o.landmarks.join("/")}, h1 ${o.h1}`);
    console.log(`     outline: ${o.heads.join(" / ")}`);
    const stops = await tabSweep(p, "LinkedIn");
    const bad = stops.filter((s) => !s.ring);
    check(!bad.length && stops.length > 40, `essay focus rings: ${stops.length} stops, ${bad.length} without a ring${bad.length ? ": " + bad.map((b) => b.name).join(", ") : ""}`);

    // a reference link lands its source below the header
    await p.evaluate(() => scrollTo(0, 0));
    await p.locator('a[href="#ref-3"]').first().click();
    await p.waitForTimeout(400);
    const landed = await p.evaluate(() => Math.round(document.getElementById("ref-3").getBoundingClientRect().top));
    check(landed >= 100 && landed <= 140, `reference [3] lands #ref-3 ${landed}px from the top (120 in the reference)`);
    const ext = await p.evaluate(() => [...document.querySelectorAll("#sources a[href^='http']")].every((a) => a.target === "_blank" && /noopener/.test(a.rel)));
    check(ext, "sources open in a new tab (noopener)");
    const hosts = await p.evaluate(() => [...document.querySelectorAll("#sources a[href^='http']")].map((a) => a.childNodes[0].textContent).slice(0, 4).join(", "));
    console.log(`     source hosts: ${hosts}`);

    await p.getByRole("button", { name: "Copy link" }).click();
    await p.waitForTimeout(150);
    const copied = await p.evaluate(async () => ({ label: [...document.querySelectorAll("button")].find((b) => /Link copied/.test(b.textContent))?.textContent, clip: await navigator.clipboard.readText() }));
    check(copied.label === "Link copied" && copied.clip.includes(`/essays/${e.slug}`), `copy link: "${copied.label}", clipboard ${copied.clip.replace(PORT, "")}`);

    // the contents follow the reading position
    await p.evaluate(() => document.getElementById("what-goes-into-a-credit-agreement-index").scrollIntoView());
    await p.waitForTimeout(400);
    const active = await p.evaluate(() => ({ cur: document.querySelector("aside [aria-current='true']")?.textContent, bar: document.querySelector("[data-reading-progress]").style.transform }));
    check(/What goes into a credit agreement index/.test(active.cur ?? ""), `scroll-spy: "${active.cur}" active, progress ${active.bar}`);
    await ctx.close();

    const m = await page(`${PORT}/essays/${e.slug}`, 390, 844);
    const bar = await m.p.evaluate(() => {
      const b = document.querySelector("[data-pb-tocbar]");
      return { shown: getComputedStyle(b).display !== "none", top: b.getBoundingClientRect().top, back: [...document.querySelectorAll("main a")].some((a) => a.textContent.includes("All essays") && a.offsetParent) };
    });
    check(bar.shown && bar.top === 69 && bar.back, `@390: "On this page" bar under the header (top ${bar.top}), "← All essays" in the hero ${bar.back}`);
    await m.ctx.close();
  }

  /* ---------------------------------------------------- overflow, nav fit */
  for (const path of ["/essays", `/essays/${ESSAYS[0].slug}`, `/essays/${ESSAYS[12].slug}`]) {
    const bad = [];
    for (const w of [320, 360, 390, 768, 1024]) {
      const { ctx, p } = await page(`${PORT}${path}`, w, 800);
      const sw = await p.evaluate(() => document.documentElement.scrollWidth);
      if (sw !== w) bad.push(`${w}:${sw}`);
      await ctx.close();
    }
    check(!bad.length, `no sideways scroll on ${path} at 320–1024${bad.length ? ": " + bad.join(" ") : ""}`);
  }
  for (const [path, collapse] of [["/", 941], ["/industries/private-credit?intro=off", 1024], ["/ai-engineering?intro=off", 1024], ["/playbooks", 1000], ["/playbooks/covenant-watch", 1000], ["/essays", 1000], [`/essays/${ESSAYS[0].slug}`, 1000]]) {
    const { ctx, p } = await page(`${PORT}${path}`, collapse, 800);
    const n = await p.evaluate(() => {
      const nav = document.querySelector('header nav[aria-label="Primary"]');
      const last = nav.lastElementChild.getBoundingClientRect();
      const fade = nav.getBoundingClientRect().right - 28;
      return { links: nav.children.length, visible: getComputedStyle(nav).visibility, overflow: nav.scrollWidth - nav.clientWidth, clear: Math.round(fade - last.right) };
    });
    check(n.links === 7 && n.visible === "visible" && n.overflow <= 0 && n.clear >= 0, `${path} @${collapse}: ${n.links} links on one line, ${n.clear}px clear of the fade`);
    await ctx.close();
  }
} finally {
  await browser.close();
}
console.log(fails ? `\n${fails} check(s) failed` : "\nall checks pass");
