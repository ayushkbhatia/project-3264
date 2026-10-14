#!/usr/bin/env node
// Site header and menus (design_handoff_site_header: README and CHECKLIST.md), on the port:
//   - every page: one 68px sticky header, the bar's sizes, no sideways scroll at 320–1440px;
//   - desktop: hover intent (90ms open, instant switch, 120ms / 180ms closes, re-entry cancels),
//     click toggles, outside click and Escape close, Tab runs trigger → panel links → next
//     trigger, closed panels take no focus, panel switches without a fade, aria-current;
//   - compact: Menu ↔ Close, the sheet's height, scroll lock, focus in and trapped, one
//     accordion group at a time and its rows, Escape, crossing 1024px, an in-page anchor;
//   - axe-core (WCAG 2.1 AA) on the open panels and the open sheet;
//   - screenshots of each state beside the handoff's (qa/__screens__/site-header).
//
//   PORT_URL=http://localhost:3000 node qa/sh-header.mjs

import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { launch, outDir } from "./pb-lib.mjs";

const PORT = process.env.PORT_URL || "http://localhost:3100";
const AXE = fs.readFileSync(createRequire(import.meta.url).resolve("axe-core/axe.min.js"), "utf8");
const OUT = outDir("site-header");
const browser = await launch();
let fails = 0;
const check = (pass, msg) => {
  if (!pass) fails++;
  console.log(`${pass ? "ok  " : "FAIL"} ${msg}`);
};

async function open(url, w, h = 900, opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, ...opts });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(PORT + url + (url.includes("?") ? "&" : "?") + "motion=off", { waitUntil: "networkidle", timeout: 90000 });
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({ content: "nextjs-portal{display:none!important}" });
  return { ctx, page, errors };
}
const wait = (page, ms) => page.waitForTimeout(ms);
const expanded = (page, key) => page.getAttribute(`button[aria-controls="menu-${key}"]`, "aria-expanded");
const box = (page, sel) => page.locator(sel).first().boundingBox();
const center = async (page, sel) => {
  const b = await box(page, sel);
  return [b.x + b.width / 2, b.y + b.height / 2];
};
const active = (page) =>
  page.evaluate(() => {
    const a = document.activeElement;
    return { text: (a?.textContent || "").trim().slice(0, 40), inHeader: !!a?.closest("header"), tag: a?.tagName };
  });
async function axe(page, label) {
  await page.addScriptTag({ content: AXE });
  const r = await page.evaluate(async () => {
    const res = await window.axe.run(document.querySelector("header"), { runOnly: ["wcag2a", "wcag2aa", "wcag21aa"] });
    return res.violations.map((v) => `${v.id} (${v.nodes.length}): ${v.nodes[0]?.target}`);
  });
  check(r.length === 0, `axe ${label}${r.length ? ": " + r.join(" | ") : ""}`);
}

/* ------------------------------------------------------------------ every page */

const PAGES = ["/", "/ai-engineering", "/industries/private-credit", "/playbooks", "/playbooks/covenant-watch", "/essays", "/contact"];
{
  const { ctx, page } = await open("/essays", 1280);
  const essay = await page.evaluate(() => [...document.querySelectorAll('main a[href^="/essays/"]')][0]?.getAttribute("href"));
  if (essay) PAGES.push(essay);
  await ctx.close();
}
for (const url of PAGES) {
  const { ctx, page, errors } = await open(url, 1280);
  const r = await page.evaluate(() => {
    const hs = document.querySelectorAll("header");
    const h = hs[0];
    const cs = getComputedStyle(h);
    const bar = h.querySelector(":scope > div");
    const logo = bar.querySelector("a").getBoundingClientRect();
    const cta = [...bar.querySelectorAll("a")].at(-1).getBoundingClientRect();
    const panelInner = h.querySelector("#menu-engineering > div").getBoundingClientRect();
    return { count: hs.length, height: h.getBoundingClientRect().height, position: cs.position, logoX: logo.x, panelX: panelInner.x + 40, ctaH: cta.height };
  });
  check(
    r.count === 1 && r.height === 69 && r.position === "sticky" && r.ctaH === 38 && Math.abs(r.logoX - r.panelX) < 0.5 && !errors.length,
    `${url}: ${r.count} header, ${r.height}px ${r.position}, CTA ${r.ctaH}px, panel column at logo x (${r.logoX} / ${r.panelX})${errors.length ? " ERRORS " + errors.join(" / ") : ""}`,
  );
  for (const w of [320, 390, 600, 834, 1023, 1024, 1100, 1440]) {
    await page.setViewportSize({ width: w, height: 800 });
    const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (over > 0) check(false, `${url} @${w}: ${over}px sideways scroll`);
  }
  await ctx.close();
}

/* --------------------------------------------------------------------- desktop */

{
  const { ctx, page } = await open("/playbooks", 1280, 800);
  const order = await page.$$eval('header nav[aria-label="Main"] > ul > li > :first-child', (els) =>
    els.filter((e) => e.getClientRects().length).map((e) => e.textContent.trim()),
  );
  check(order.join(" · ") === "AI Engineering · AI Transformation · Industries · Work · Playbooks · Essays · Contact", `order: ${order.join(" · ")}`);

  // hover intent
  const [ex, ey] = await center(page, 'button[aria-controls="menu-engineering"]');
  // timed in the page: from the pointer reaching the trigger to aria-expanded flipping
  await page.evaluate(() => {
    const btn = document.querySelector('button[aria-controls="menu-engineering"]');
    btn.addEventListener("pointerenter", () => (window.__enter = performance.now()), { once: true });
    new MutationObserver((_, o) => {
      if (btn.getAttribute("aria-expanded") === "true") (window.__opened = performance.now()), o.disconnect();
    }).observe(btn, { attributes: true });
  });
  await page.mouse.move(ex, ey);
  await wait(page, 250);
  const delay = await page.evaluate(() => Math.round(window.__opened - window.__enter));
  check(delay >= 85 && delay < 140, `hover opens after ${delay}ms (90ms intent)`);

  await page.mouse.move(ex, 300, { steps: 6 }); // down into the panel
  await wait(page, 400);
  check((await expanded(page, "engineering")) === "true", "moving from the trigger into its panel keeps it open");

  const [tx, ty] = await center(page, 'button[aria-controls="menu-transformation"]');
  await page.mouse.move(tx, ty);
  await wait(page, 16);
  const sw = await page.evaluate(() => {
    const p = document.getElementById("menu-transformation");
    return { op: getComputedStyle(p).opacity, eng: getComputedStyle(document.getElementById("menu-engineering")).visibility };
  });
  check((await expanded(page, "transformation")) === "true" && sw.op === "1" && sw.eng === "hidden", `switch is immediate and unfaded (opacity ${sw.op}, old panel ${sw.eng})`);

  const [wx, wy] = await center(page, 'header nav[aria-label="Main"] > ul > li > a[href="/#work"]');
  await page.mouse.move(wx, wy);
  await wait(page, 60);
  const stillOpen = await expanded(page, "transformation");
  await wait(page, 120);
  const after = await expanded(page, "transformation");
  check(stillOpen === "true" && after === "false", `hovering Work closes after ~120ms (60ms: ${stillOpen}, 180ms: ${after})`);

  await page.mouse.move(ex, ey);
  await wait(page, 150);
  await page.mouse.move(ex, 790); // below the panel: out of the header
  await wait(page, 100);
  await page.mouse.move(ex, 300); // back in before 180ms
  await wait(page, 300);
  check((await expanded(page, "engineering")) === "true", "re-entering within 180ms cancels the close");
  await page.mouse.move(ex, 790);
  await wait(page, 120);
  const mid = await expanded(page, "engineering");
  await wait(page, 120);
  check(mid === "true" && (await expanded(page, "engineering")) === "false", "leaving the header closes after ~180ms");

  // screenshots of the three panels, for comparison with the handoff's 02–04
  // (5, 200): inside each panel's left padding, so the pointer neither leaves the header nor
  // hovers an item
  for (const key of ["engineering", "transformation", "industries"]) {
    await page.click(`button[aria-controls="menu-${key}"]`);
    await page.mouse.move(5, 200);
    await wait(page, 500);
    await page.screenshot({ path: path.join(OUT, `desktop-${key}.png`), clip: { x: 0, y: 0, width: 1280, height: 500 } });
    await axe(page, `desktop ${key} panel`);
  }
  await page.click('button[aria-controls="menu-industries"]');
  await wait(page, 300);
  check((await expanded(page, "industries")) === "false", "clicking the open trigger closes it");

  await page.click('button[aria-controls="menu-engineering"]');
  await page.mouse.click(640, 700);
  await wait(page, 50);
  check((await expanded(page, "engineering")) === "false", "a click outside closes");

  // keyboard
  await page.focus('button[aria-controls="menu-engineering"]');
  await page.keyboard.press("Enter");
  await wait(page, 50);
  const stops = [];
  for (let i = 0; i < 14; i++) {
    await page.keyboard.press("Tab");
    stops.push((await active(page)).text);
  }
  const lastIdx = stops.findIndex((t) => t.startsWith("AI Transformation"));
  check(
    stops[0] === "Overview →" && stops[1] === "Two-week audit" + "We assess your systems and processes, then price the rebuild.".slice(0, 26) && lastIdx === 13,
    `Tab order: ${stops.map((s) => s.slice(0, 18)).join(" → ")}`,
  );
  check((await expanded(page, "engineering")) === "false", "Tab past the panel's last link closes it");
  await page.keyboard.press("Space");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Escape");
  const esc = await active(page);
  check((await expanded(page, "transformation")) === "false" && esc.text.startsWith("AI Transformation"), `Escape closes and focuses the trigger (${esc.text})`);
  const closedFocusable = await page.evaluate(() =>
    [...document.querySelectorAll("[data-sh-panel]:not([data-open]) a")].filter((a) => !a.closest("[inert]")).length,
  );
  check(closedFocusable === 0, "closed panels are inert");
  const current = await page.$$eval('header [aria-current]', (els) => els.filter((e) => e.getClientRects().length).map((e) => `${e.textContent.trim()}=${e.getAttribute("aria-current")}`));
  check(current.join() === "Playbooks=page", `aria-current on /playbooks: ${current.join(", ")}`);
  await ctx.close();
}
for (const [url, want] of [
  ["/playbooks/covenant-watch", ["Playbooks=true", "Covenant Watch=page"]],
  ["/industries/private-credit", ["Industries=true", "Private Credit"]],
  ["/ai-engineering", ["AI Engineering=page", "Overview →=page"]],
  ["/contact", ["Contact=page"]],
]) {
  const { ctx, page } = await open(url, 1280);
  const cur = await page.$$eval('header [aria-current]', (els) => els.map((e) => `${e.textContent.trim()}=${e.getAttribute("aria-current")}`));
  check(want.every((w) => cur.some((c) => c.startsWith(w))), `aria-current on ${url}: ${[...new Set(cur)].join(", ")}`);
  await ctx.close();
}
{
  // the bar still fits on one line at the breakpoint
  const { ctx, page } = await open("/", 1024);
  const r = await page.evaluate(() => {
    const items = [...document.querySelectorAll('header nav[aria-label="Main"] > ul > li > :first-child')].filter((e) => e.getClientRects().length);
    const mids = new Set(items.map((e) => { const r = e.getBoundingClientRect(); return Math.round(r.top + r.height / 2); }));
    const navRight = items.at(-1).getBoundingClientRect().right;
    const cta = [...document.querySelector("header > div").querySelectorAll("a")].at(-1).getBoundingClientRect();
    return { lines: mids.size, gap: Math.round(cta.left - navRight), ctaRight: cta.right };
  });
  check(r.lines === 1 && r.gap >= 20 && r.ctaRight <= 1024 - 40, `@1024: one line, ${r.gap}px before the CTA, CTA right ${r.ctaRight}`);
  await ctx.close();
}
{
  const { ctx, page } = await open("/", 1280, 800, { reducedMotion: "reduce" });
  await page.click('button[aria-controls="menu-engineering"]');
  const t = await page.evaluate(() => getComputedStyle(document.getElementById("menu-engineering")).transitionProperty + " / " + getComputedStyle(document.getElementById("menu-engineering")).transform);
  check(!t.includes("transform,") && t.endsWith("none"), `reduced motion: no slide (${t})`);
  await ctx.close();
}

/* --------------------------------------------------------------------- compact */

for (const [w, h, shot] of [[390, 844, "phone"], [834, 1112, "tablet"]]) {
  const { ctx, page } = await open("/playbooks", w, h, { deviceScaleFactor: 2, hasTouch: true, isMobile: w < 600 });
  const bar = await page.evaluate(() => {
    const btn = document.querySelector('button[aria-controls="mobile-menu"]').getBoundingClientRect();
    const pill = [...document.querySelectorAll("header > div:nth-of-type(2) a")].find((a) => a.textContent === "Book an audit");
    return { btnH: btn.height, pill: pill.getClientRects().length ? pill.getBoundingClientRect().height : 0 };
  });
  check(bar.btnH === 44 && bar.pill === (w >= 600 ? 42 : 0), `@${w} bar: Menu ${bar.btnH}px, pill ${bar.pill || "hidden"}`);
  await page.screenshot({ path: path.join(OUT, `${shot}-closed.png`) });

  await page.tap('button[aria-controls="mobile-menu"]');
  await wait(page, 400);
  const s = await page.evaluate(() => {
    const sheet = document.getElementById("mobile-menu");
    const r = sheet.getBoundingClientRect();
    const btn = document.querySelector('button[aria-controls="mobile-menu"]');
    return {
      top: r.top, height: r.height, vis: getComputedStyle(sheet).visibility, label: btn.textContent.trim(), exp: btn.getAttribute("aria-expanded"),
      overflow: getComputedStyle(document.documentElement).overflow, focus: document.activeElement.textContent.trim(),
      cta: [...sheet.querySelectorAll("a")].find((a) => a.textContent === "Book a two-week audit").getBoundingClientRect().height,
    };
  });
  check(
    s.top === 69 && s.height === h - 69 && s.vis === "visible" && s.label === "Close" && s.exp === "true" && s.overflow === "hidden" && s.focus === "AI Engineering" && s.cta === 50,
    `@${w} open: sheet at ${s.top}, ${s.height}px (${h} - 69), ${s.label}, page overflow ${s.overflow}, focus "${s.focus}", CTA ${s.cta}px`,
  );
  await page.screenshot({ path: path.join(OUT, `${shot}-open.png`) });

  let escaped = 0;
  for (let i = 0; i < 20; i++) {
    await page.keyboard.press("Tab");
    if (!(await active(page)).inHeader) escaped++;
  }
  for (let i = 0; i < 5; i++) {
    await page.keyboard.press("Shift+Tab");
    if (!(await active(page)).inHeader) escaped++;
  }
  check(escaped === 0, `@${w} focus stays in the bar and sheet (${escaped} escapes)`);

  const rows = (key) =>
    page.evaluate((k) => {
      const g = document.getElementById(`mobile-group-${k}`);
      return {
        shown: !g.hidden,
        items: [...g.querySelectorAll(":scope > ul a")].map((a) => a.querySelector("span.font-mono")?.textContent ?? (a.querySelector("[aria-hidden]") ? `[${a.querySelector("[aria-hidden]").getBoundingClientRect().width}]` : "-")),
        over: g.querySelector(":scope > a").textContent,
      };
    }, key);
  await page.tap('button[aria-controls="mobile-group-engineering"]');
  const eng = await rows("engineering");
  check(eng.shown && eng.items.length === 6 && eng.over === "AI Engineering overview →", `@${w} AI Engineering: ${eng.items.length} rows, "${eng.over}"`);
  await page.screenshot({ path: path.join(OUT, `${shot}-engineering.png`) });
  await page.tap('button[aria-controls="mobile-group-transformation"]');
  const tra = await rows("transformation");
  const engAfter = await rows("engineering");
  check(tra.shown && !engAfter.shown && tra.items.join() === "01,02,03,04,-,-", `@${w} one group at a time; AI Transformation rows ${tra.items.join(" ")}`);
  await page.screenshot({ path: path.join(OUT, `${shot}-transformation.png`) });
  await page.tap('button[aria-controls="mobile-group-industries"]');
  const ind = await rows("industries");
  check(ind.items.join() === "[40],[40],[40],[40],[40]" && ind.over === "All industries →", `@${w} Industries: thumbnails ${ind.items.join(" ")}`);
  await page.screenshot({ path: path.join(OUT, `${shot}-industries.png`) });
  await axe(page, `@${w} open sheet`);
  await page.tap('button[aria-controls="mobile-group-industries"]');
  check(!(await rows("industries")).shown, `@${w} tapping the open group closes it`);

  await page.keyboard.press("Escape");
  await wait(page, 350);
  const closed = await page.evaluate(() => ({
    vis: getComputedStyle(document.getElementById("mobile-menu")).visibility,
    overflow: getComputedStyle(document.documentElement).overflowY,
    focus: document.activeElement.getAttribute("aria-controls"),
  }));
  check(closed.vis === "hidden" && closed.overflow !== "hidden" && closed.focus === "mobile-menu", `@${w} Escape: sheet ${closed.vis}, page overflow ${closed.overflow}, focus on Menu`);

  await page.tap('button[aria-controls="mobile-menu"]');
  const reset = await rows("industries");
  check(!reset.shown, `@${w} groups reset to collapsed on reopening`);
  await page.setViewportSize({ width: 1100, height: 800 });
  await wait(page, 350);
  const wide = await page.evaluate(() => ({
    exp: document.querySelector('button[aria-controls="mobile-menu"]').getAttribute("aria-expanded"),
    overflow: document.documentElement.style.overflow,
  }));
  check(wide.exp === "false" && wide.overflow === "", `@${w} → 1100: sheet closed (${wide.exp}), scroll unlocked`);
  await ctx.close();
}
{
  // an in-page anchor from the sheet: close first, then scroll
  const { ctx, page } = await open("/ai-engineering", 390, 844, { hasTouch: true, isMobile: true });
  await page.tap('button[aria-controls="mobile-menu"]');
  await page.tap('button[aria-controls="mobile-group-engineering"]');
  const href = await page.getAttribute('#mobile-group-engineering a:has-text("Platform")', "href");
  await page.tap('#mobile-group-engineering a:has-text("Platform")');
  await wait(page, 1200);
  const r = await page.evaluate(() => ({
    exp: document.querySelector('button[aria-controls="mobile-menu"]').getAttribute("aria-expanded"),
    top: Math.round(document.getElementById("platform").getBoundingClientRect().top),
    y: Math.round(scrollY),
    hash: location.hash,
  }));
  check(href === "#platform" && r.exp === "false" && r.hash === "#platform" && r.y > 0 && Math.abs(r.top - 69) <= 2, `anchor from the sheet: ${href}, closed, landed at ${r.top}px (scrollY ${r.y})`);
  await ctx.close();
}

await browser.close();
console.log(fails ? `\n${fails} failing` : "\nall passing");
process.exit(fails ? 1 : 0);
