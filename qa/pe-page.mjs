#!/usr/bin/env node
// Private Equity page (design_handoff_private_equity: README and CHECKLIST.md), on the port:
//   - chrome and links: one sticky SiteHeader with Industries and the Private Equity item current,
//     the footer's links, every anchor landing below the header, overflow-x clip;
//   - motion: the intro's beats and skip, the hero veil, the premise stack's transforms at its
//     scroll windows, each diagram's state partway and at its end (audit, 100 days, portfolio,
//     value, engagement), with the KPI figures the checklist names;
//   - reduced motion: no intro, every diagram in its final frame;
//   - no sideways scroll from 320 to 1920px, every stage inside its frame;
//   - axe-core (WCAG 2.1 AA) on the page; screenshots in qa/__screens__/private-equity.
//
//   PORT_URL=http://localhost:3100 node qa/pe-page.mjs

import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { launch, outDir } from "./pb-lib.mjs";

const PORT = process.env.PORT_URL || "http://localhost:3100";
const URL = PORT + "/industries/private-equity";
const AXE = fs.readFileSync(createRequire(import.meta.url).resolve("axe-core/axe.min.js"), "utf8");
const OUT = outDir("private-equity");
const browser = await launch();
let fails = 0;
const check = (pass, msg) => {
  if (!pass) fails++;
  console.log(`${pass ? "ok  " : "FAIL"} ${msg}`);
};

async function open(w, h = 900, opts = {}, query = "?intro=off") {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, ...opts });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && !/Failed to load resource/.test(m.text()) && errors.push(m.text()));
  await page.goto(URL + query, { waitUntil: "networkidle", timeout: 120000 });
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({ content: "nextjs-portal{display:none!important}" });
  return { ctx, page, errors };
}
const wait = (page, ms) => page.waitForTimeout(ms);
/** Scroll a pinned track to progress m (the logic's prog(): (68 − top) / (height − (vh − 68))). */
const scrub = (page, sel, m) =>
  page.evaluate(
    ({ sel, m }) => {
      const t = document.querySelector(sel), r = t.getBoundingClientRect();
      scrollTo(0, scrollY + r.top - 68 + m * (r.height - (innerHeight - 68)));
    },
    { sel, m },
  );
/** Centre a section's diagram frame in the viewport, which starts its clock. */
const centre = (page, id) =>
  page.evaluate((id) => {
    const el = document.querySelector(`#${id} [style*="aspect-ratio"]`), r = el.getBoundingClientRect();
    scrollTo(0, scrollY + r.top + r.height / 2 - innerHeight / 2);
  }, id);
const texts = (page, sel) => page.$$eval(sel, (els) => els.map((e) => e.textContent.trim()));
const STACK = '[data-screen-label="Premise"] > div:nth-child(2)';

/* -------------------------------------------------------------- chrome and links */
{
  const { ctx, page, errors } = await open(1440);
  const r = await page.evaluate(() => {
    const h = document.querySelectorAll("header");
    const cur = [...h[0].querySelectorAll("[aria-current]")].map((e) => `${e.textContent.trim().slice(0, 14)}=${e.getAttribute("aria-current")}`);
    return {
      headers: h.length,
      sticky: getComputedStyle(h[0]).position,
      cur,
      clip: getComputedStyle(document.body).overflowX,
      title: document.title,
    };
  });
  check(r.headers === 1 && r.sticky === "sticky" && !errors.length, `one sticky header${errors.length ? "; ERRORS " + errors.join(" / ") : ""}`);
  check(r.cur.includes("Industries=true") && r.cur.some((c) => c.startsWith("Private Equity=page")), `aria-current: ${[...new Set(r.cur)].join(", ")}`);
  check(r.clip === "clip" && r.title === "3264.ai — Private Equity", `body overflow-x ${r.clip}; title "${r.title}"`);
  const footer = await page.$$eval("footer a", (as) => as.map((a) => `${a.textContent}→${a.getAttribute("href")}`));
  check(
    footer.includes("Private Equity→#top") && footer.includes("Private Credit→/industries/private-credit") && !footer.some((f) => f.split("→")[1] === "/company"),
    `footer: ${footer.slice(4, 9).join(", ")}`,
  );
  for (const id of ["audit", "plan", "portfolio", "value", "engagement"]) {
    await page.evaluate((id) => (location.hash = id), id);
    await wait(page, 300);
    const top = await page.$eval(`#${id}`, (e) => Math.round(e.getBoundingClientRect().top));
    check(top >= 68 && top <= 70, `#${id} lands at ${top}px`);
  }
  await page.evaluate(() => (location.hash = ""));
  await ctx.close();
}
for (const url of ["/", "/ai-engineering", "/industries/private-credit", "/contact", "/playbooks"]) {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto(PORT + url + "?intro=off", { waitUntil: "domcontentloaded" });
  const n = await page.$$eval('footer a[href="/industries/private-equity"], header a[href="/industries/private-equity"]', (as) => as.length);
  check(n >= 2, `${url}: ${n} links to Private Equity (menu + footer)`);
  await ctx.close();
}
{
  const r = await (await fetch(PORT + "/sitemap.xml")).text();
  check(r.includes("/industries/private-equity"), "sitemap lists the page");
}

/* -------------------------------------------------------------------- the intro */
{
  const { ctx, page } = await open(1440, 900, {}, "");
  const at = async (ms) => {
    await page.waitForFunction((ms) => performance.now() >= ms, ms);
    return page.evaluate(() => {
      const wrap = document.querySelector("[data-ind-intro-wrap]");
      const rows = [...wrap.querySelectorAll(":scope > div:first-child > div > div")].slice(0, 4).map((r) => +getComputedStyle(r).opacity);
      return { display: getComputedStyle(wrap).display, mark: +getComputedStyle(wrap.children[1]).opacity, rows, wrap: +getComputedStyle(wrap).opacity };
    });
  };
  const t0 = await page.evaluate(() => performance.now());
  const early = await at(t0 + 200);
  check(early.display === "flex" && early.rows.length === 4, `intro showing, 4 rows (${early.rows.map((x) => x.toFixed(2)).join(" ")})`);
  await page.screenshot({ path: path.join(OUT, "intro.png") });
  const done = await page.waitForFunction(() => getComputedStyle(document.querySelector("[data-ind-intro-wrap]")).display === "none", null, { timeout: 8000 }).then(() => page.evaluate(() => performance.now()));
  check(done - t0 < 6000, `intro gone after ${Math.round(done - t0)}ms (lifts at 4.26s + 0.56s)`);
  await ctx.close();
}
{
  const { ctx, page } = await open(1440, 900, {}, "");
  await wait(page, 600);
  await page.mouse.click(700, 450);
  await wait(page, 500);
  const d = await page.$eval("[data-ind-intro-wrap]", (e) => getComputedStyle(e).display);
  check(d === "none", `a click skips the intro (${d})`);
  await ctx.close();
}

/* ---------------------------------------------------------------------- motion */
{
  const { ctx, page } = await open(1440, 900);
  // hero veil: pointer holes over the greyscale canvas (it ignores the pointer until its grey
  // copy is built, which is when the <img> drops its own grayscale filter)
  await page.waitForFunction(() => document.querySelector("#top img").style.filter === "none");
  await page.mouse.move(300, 300);
  for (let i = 0; i < 12; i++) await page.mouse.move(300 + i * 40, 320 + i * 10);
  await wait(page, 300);
  const veil = await page.evaluate(() => {
    const c = document.querySelector("#top canvas"), x = c.getContext("2d");
    const d = x.getImageData(440, 320, 120, 100).data; // a patch on the pointer's path
    let hole = 255;
    for (let i = 3; i < d.length; i += 4) hole = Math.min(hole, d[i]);
    const far = x.getImageData(1300, 600, 1, 1).data[3];
    return { hole, far, img: document.querySelector("#top img").style.filter };
  });
  check(veil.far === 255 && veil.hole < 200 && veil.img === "none", `hero veil: grey canvas (alpha ${veil.far}), hole under the pointer (alpha ${veil.hole})`);
  await page.screenshot({ path: path.join(OUT, "hero.png"), clip: { x: 0, y: 0, width: 1440, height: 700 } });

  // premise stack at its windows
  const tf = () => page.$$eval("[data-ind-card]", (els) => els.map((e) => new DOMMatrix(getComputedStyle(e).transform).m41 / e.offsetWidth));
  const words = (n) => page.$eval(`[data-ind-card]:nth-of-type(${n}) p`, (p) => [...p.children].filter((s) => +s.style.opacity > 0.99).length + "/" + p.children.length);
  for (const [m, expect] of [[0.2, [0, 1.08, 1.08]], [0.5, [-0.03, 0, 1.08]], [0.9, [-0.05, -0.03, 0]]]) {
    await scrub(page, STACK, m);
    await wait(page, 200);
    const x = await tf();
    check(x.every((v, i) => Math.abs(v - expect[i]) < 0.02), `premise m=${m}: card offsets ${x.map((v) => v.toFixed(3)).join(" ")}`);
    await page.screenshot({ path: path.join(OUT, `premise-${m}.png`) });
  }
  const w3 = await words(3);
  check(/^(\d+)\/\1$/.test(w3), `card 3 statement inked (${w3})`);

  // audit loop: mid-scan, then the ranked list
  await centre(page, "audit");
  await wait(page, 3000);
  const midCells = await page.$$eval("#audit [data-cell] > span", (s) => s.filter((x) => +x.style.opacity > 0.9).length);
  check(midCells > 0 && midCells < 36, `audit at ~3s: scanning (${midCells}/36 figures shown)`);
  await page.screenshot({ path: path.join(OUT, "audit-scan.png") });
  await wait(page, 10500);
  const list = await page.$eval("#audit [data-li]:last-child", (e) => +e.style.opacity);
  check(list > 0.99, `audit at ~13.5s: ranked list in (${list})`);
  await page.screenshot({ path: path.join(OUT, "audit-ranked.png") });

  // 100 days: halfway and at the end
  await scrub(page, "#plan > div:nth-child(2)", 0.04 + 0.88 * 0.65);
  await wait(page, 200);
  const mid = await texts(page, "#plan [data-kpi]");
  const day = await texts(page, "#plan [data-st]");
  check(/^£1\.2\dm$/.test(mid[0]) && mid[2] === "2 of 3" && day.join() === "Live,Live,Building", `day 65: ${mid.join(" · ")} · ${day.join(" ")}`);
  await page.screenshot({ path: path.join(OUT, "plan-65.png") });
  await scrub(page, "#plan > div:nth-child(2)", 1);
  await wait(page, 200);
  const end = await texts(page, "#plan [data-kpi]");
  check(end.join() === "£1.90m,540,3 of 3", `day 100: ${end.join(" · ")}`);

  // portfolio loop
  await centre(page, "portfolio");
  await wait(page, 14200);
  const pf = await page.evaluate(() => ({
    wk: [...document.querySelectorAll("#portfolio [data-pf-wk]")].map((e) => e.textContent),
    count: document.querySelector("#portfolio [data-pf-count]").textContent,
    sum: +document.querySelector("#portfolio [data-pf-sum]").style.opacity,
  }));
  check(pf.wk.join() === "6 wks,3 wks,2 wks,1.5 wks,1 wk" && pf.count === "1 capability" && pf.sum > 0.99, `portfolio at ~14s: ${pf.wk.join(" · ")}; ${pf.count}`);
  await page.screenshot({ path: path.join(OUT, "portfolio.png") });

  // value bridge
  await centre(page, "value");
  await wait(page, 7000);
  const vl = await texts(page, "#value [data-vl-run], #value [data-vl-pct], #value [data-vl-evn]");
  check(vl.join() === "£16.4m,+15.5%,£19.8m", `value: ${vl.join(" · ")}`);
  await page.screenshot({ path: path.join(OUT, "value.png") });

  // engagement
  await page.$eval("#engagement", (e) => e.scrollIntoView());
  await wait(page, 1400);
  const en = await page.$$eval("#engagement [data-en]", (els) => els.map((e) => +e.style.opacity));
  check(en.every((o) => o > 0.99), `engagement cards in (${en.join(" ")})`);
  await ctx.close();
}

/* -------------------------------------------------------------- reduced motion */
{
  const { ctx, page } = await open(1440, 900, { reducedMotion: "reduce" }, "");
  const intro = await page.$eval("[data-ind-intro-wrap]", (e) => getComputedStyle(e).display);
  await centre(page, "audit");
  await wait(page, 600);
  const list = await page.$eval("#audit [data-li]:last-child", (e) => +e.style.opacity);
  await scrub(page, "#plan > div:nth-child(2)", 0.1);
  await wait(page, 200);
  const kpi = await texts(page, "#plan [data-kpi]");
  await centre(page, "value");
  await wait(page, 600);
  const vl = await texts(page, "#value [data-vl-run], #value [data-vl-evn]");
  await scrub(page, STACK, 0.05);
  await wait(page, 200);
  const inked = await page.$eval("[data-ind-card] p", (p) => [...p.children].every((s) => +s.style.opacity > 0.99));
  check(intro === "none" && list > 0.99 && kpi[0] === "£1.90m" && vl.join() === "£16.4m,£19.8m" && inked,
    `reduced motion: no intro (${intro}), audit list ${list}, day-100 KPI ${kpi[0]} at 10% of the track, bridge ${vl.join(" ")}, statements inked ${inked}`);
  await page.addScriptTag({ content: AXE });
  const ax = await page.evaluate(async () => (await window.axe.run(document, { runOnly: ["wcag2a", "wcag2aa", "wcag21aa"] })).violations.map((v) => `${v.id} (${v.nodes.length}): ${v.nodes.slice(0, 3).map((n) => n.target).join(" ")}`));
  check(ax.length === 0, `axe: ${ax.length ? ax.join(" | ") : "no violations"}`);
  await ctx.close();
}

/* ------------------------------------------------------------------ responsive */
for (const w of [320, 375, 390, 600, 768, 834, 1024, 1280, 1526, 1920]) {
  const { ctx, page } = await open(w, w < 768 ? 844 : 900, { reducedMotion: "reduce" });
  const r = await page.evaluate(() => {
    const over = document.documentElement.scrollWidth - document.documentElement.clientWidth;
    // every fitted stage sits inside its frame (scaled box within the frame's box, 1px slack)
    const bad = [];
    for (const [fit] of [["#audit [style*='aspect-ratio']", 1120, 600], ["#portfolio [style*='aspect-ratio']", 1120, 520], ["#value [style*='aspect-ratio']", 1120, 600]]) {
      const f = document.querySelector(fit), s = f.firstElementChild, fr = f.getBoundingClientRect(), sr = s.getBoundingClientRect();
      if (sr.left < fr.left - 1 || sr.right > fr.right + 1 || sr.top < fr.top - 1 || sr.bottom > fr.bottom + 1) bad.push(fit.split(" ")[0]);
    }
    return { over, bad };
  });
  check(r.over <= 0 && !r.bad.length, `@${w}: sideways scroll ${r.over}px${r.bad.length ? ", stage outside frame: " + r.bad.join(" ") : ""}`);
  await ctx.close();
}

await browser.close();
console.log(fails ? `\n${fails} failing` : "\nall passing");
process.exit(fails ? 1 : 0);
