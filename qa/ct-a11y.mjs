#!/usr/bin/env node
// Contact: accessibility and motion (design_handoff_contact, "Accessibility" and "Logo marquee"),
// on the port:
//   - axe-core (WCAG 2.1 AA) idle, with errors, failed and sent, at 1440 and 390;
//   - landmarks, the heading outline, the nav's current page; a Tab sweep (every stop shows its
//     focus: a ring on links and buttons, the accent border and halo on fields);
//   - the direct line's contrast over the painting, sampled behind the text at several widths;
//   - the strip: 32px a second, holding under the pointer and under the footer's pause control,
//     still under reduced motion (control hidden) and ?motion=off;
//   - the header: seven links on one line down to 1000px, the menu below;
//   - no sideways scroll from 320px up.
//
//   node qa/ct-a11y.mjs   (BASE_URL defaults to http://localhost:3100)

import { createRequire } from "node:module";
import fs from "node:fs";
import { PNG } from "pngjs";
import { BASE, launch, outDir, PORT } from "./ct-lib.mjs";

const AXE = fs.readFileSync(createRequire(import.meta.url).resolve("axe-core/axe.min.js"), "utf8");
const OUT = outDir("contact/a11y");
const API = `${BASE}/api/contact`;
const browser = await launch();
let fails = 0;
const check = (pass, msg) => {
  if (!pass) fails++;
  console.log(`${pass ? "ok  " : "FAIL"} ${msg}`);
};
let ipSeq = Math.floor(Math.random() * 200);

async function open(url, w, h = 900, opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: "reduce", extraHTTPHeaders: { "x-real-ip": `192.0.2.${(ipSeq++ % 250) + 1}` }, ...opts });
  const p = await ctx.newPage();
  await p.goto(url, { waitUntil: "networkidle", timeout: 90000 });
  await p.evaluate(() => document.fonts.ready);
  return { ctx, p };
}

async function axe(p, label) {
  await p.addScriptTag({ content: AXE });
  const r = await p.evaluate(() => window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"] } }));
  const v = r.violations.map((x) => `${x.id} (${x.impact}, ${x.nodes.length}): ${x.nodes.slice(0, 2).map((n) => n.target.join(" ")).join(" | ")}`);
  check(!v.length, `axe ${label}: ${v.length ? "\n      " + v.join("\n      ") : "no violations"} (needs review: ${r.incomplete.map((x) => x.id).join(", ") || "none"})`);
}

/** WCAG contrast of two sRGB colours. */
function contrast(a, b) {
  const lum = ([r, g, b]) => {
    const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}

try {
  /* ---------------------------------------------------------------- axe */
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    const { ctx, p } = await open(PORT, w, h);
    await axe(p, `@${w} idle`);
    await p.click("#top button[type=submit]");
    await axe(p, `@${w} errors`);
    await p.fill("input[name=name]", "Jane Doe");
    await p.fill("input[name=email]", "jane.doe@firm.com");
    await p.route(API, (route) => route.fulfill({ status: 502, contentType: "application/json", body: '{"ok":false}' }));
    await p.click("#top button[type=submit]");
    await p.waitForSelector("#top [role=alert]");
    await axe(p, `@${w} failed`);
    await p.unroute(API);
    await p.route(API, (route) => route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' }));
    await p.click("#top button[type=submit]");
    await p.waitForSelector("text=Message sent");
    await axe(p, `@${w} sent`);
    await ctx.close();
  }

  /* ------------------------------------------- landmarks, outline, Tab sweep */
  {
    const { ctx, p } = await open(PORT, 1440);
    const o = await p.evaluate(() => {
      const count = (s) => document.querySelectorAll(s).length;
      const hs = [...document.querySelectorAll("h1,h2,h3")].filter((e) => e.checkVisibility()).map((e) => `${e.tagName.toLowerCase()} ${e.textContent.trim()}`);
      // the inline nav (the menu sheet repeats it)
      const current = [...document.querySelector('header nav[aria-label="Primary"]').querySelectorAll("a")].map((a) => `${a.textContent}${a.getAttribute("aria-current") ? `[${a.getAttribute("aria-current")}]` : ""}`);
      const labels = [...document.querySelectorAll("#top form input, #top form textarea")].filter((e) => e.checkVisibility()).map((e) => e.labels?.[0]?.textContent.trim());
      const logos = [...document.querySelectorAll("#top img")].filter((i) => !i.closest("[aria-hidden=true]") && i.alt).map((i) => i.alt);
      return { header: count("header"), main: count("main"), footer: count("footer"), h1: count("h1"), hs, current, labels, logos };
    });
    check(o.header === 1 && o.main === 1 && o.footer === 1 && o.h1 === 1, `landmarks: header ${o.header}, main ${o.main}, footer ${o.footer}; h1 ${o.h1}; outline: ${o.hs.join(" / ")}`);
    check(o.current.at(-1) === "Contact[page]" && o.current.length === 7, `nav: ${o.current.join(" · ")}`);
    check(o.labels.join("|") === "Name|Work email|How can we help?", `fields labelled: ${o.labels.join(", ")}`);
    check(o.logos.length === 9, `strip: ${o.logos.length} marks announced once (${o.logos.join(", ")})`);

    const stops = [];
    await p.keyboard.press("Tab");
    for (let i = 0; i < 60; i++) {
      const s = await p.evaluate(() => {
        const e = document.activeElement;
        if (!e || e === document.body) return null;
        const cs = getComputedStyle(e);
        const ring = cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) >= 2;
        const halo = cs.boxShadow !== "none" && cs.borderTopColor === "rgb(21, 127, 82)";
        const name = (e.getAttribute("aria-label") || e.textContent || e.getAttribute("name") || e.tagName).trim().replace(/\s+/g, " ").slice(0, 28);
        return { name, shown: ring || halo, tag: e.tagName };
      });
      if (!s) break;
      stops.push(s);
      if (s.name === "LinkedIn") break;
      await p.keyboard.press("Tab");
    }
    const bad = stops.filter((s) => !s.shown);
    const order = stops.map((s) => s.name);
    check(!bad.length && stops.length > 25, `focus: ${stops.length} tab stops, ${bad.length} without a visible focus${bad.length ? ": " + bad.map((b) => b.name).join(", ") : ""}`);
    const iName = order.indexOf("name"), iSubmit = order.indexOf("Submit"), iMail = order.indexOf("hello@3264.ai");
    check(iName > 0 && order[iName + 1] === "email" && order[iName + 2] === "message" && iSubmit === iName + 3 && iMail === iSubmit + 1, `order: … ${order.slice(Math.max(0, iName - 1), iMail + 2).join(" → ")} …`);
    check(!order.includes("website"), "the honeypot is never a tab stop");
    await ctx.close();
  }

  /* -------------------------------------------- direct line over the painting */
  for (const [w, h] of [[1440, 900], [1280, 800], [1024, 768], [880, 800], [768, 1024], [390, 844], [320, 700]]) {
    const { ctx, p } = await open(PORT, w, h);
    const line = p.locator("#top > div > p:has(> a[href^='mailto'])");
    await line.scrollIntoViewIfNeeded();
    await p.addStyleTag({ content: "#top > div > p:has(> a[href^='mailto']), #top > div > p:has(> a[href^='mailto']) * { color: transparent !important; text-decoration-color: transparent !important }" });
    const file = `${OUT}/direct-${w}.png`;
    await line.screenshot({ path: file });
    const png = PNG.sync.read(fs.readFileSync(file));
    let worst = Infinity;
    for (let i = 0; i < png.data.length; i += 4) worst = Math.min(worst, contrast([26, 25, 23], [png.data[i], png.data[i + 1], png.data[i + 2]]));
    check(worst >= 4.5, `@${w} direct line #1A1917 over the painting: lowest ${worst.toFixed(2)}:1 behind the text`);
    await ctx.close();
  }

  /* -------------------------------------------------------------- the strip */
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const p = await ctx.newPage();
    await p.goto(PORT, { waitUntil: "networkidle" });
    const x = () => p.evaluate(() => new DOMMatrix(getComputedStyle(document.querySelector("[data-logo-strip] > div")).transform).m41);
    const speed = async (ms = 1000) => { const a = await x(); const t = Date.now(); await p.waitForTimeout(ms); return (a - (await x())) / ((Date.now() - t) / 1000); };
    await p.mouse.move(5, 300);
    const v = await speed();
    check(v > 28 && v < 36, `moves left at ${v.toFixed(1)}px/s (32 designed)`);
    const loop = await p.evaluate(() => { const t = document.querySelector("[data-logo-strip] > div"); return [t.scrollWidth / 2, t.firstElementChild.getBoundingClientRect().width, getComputedStyle(t).animationDuration]; });
    check(loop[0] === 1602 && loop[1] === 1602, `one loop is one set: ${loop[1]}px (9 × 160 + 9 × 18), ${loop[2]}`);
    await p.hover("[data-logo-strip]");
    await p.waitForTimeout(150);
    const hovered = await speed(600);
    await p.mouse.move(5, 300);
    check(Math.abs(hovered) < 1, `holds under the pointer (${hovered.toFixed(2)}px/s)`);
    const control = p.locator("footer button[aria-pressed]");
    check((await control.textContent()) === "Pause animations" && (await control.getAttribute("aria-pressed")) === "false", `footer control: "${await control.textContent()}"`);
    await control.click();
    await p.waitForTimeout(150);
    const paused = await speed(600);
    check(Math.abs(paused) < 1 && (await control.textContent()) === "Play animations" && (await control.getAttribute("aria-pressed")) === "true", `paused from the footer (${paused.toFixed(2)}px/s), now "${await control.textContent()}"`);
    await control.click();
    check((await speed(600)) > 28, "plays again");
    await ctx.close();

    for (const [label, opts, url] of [["reduced motion", { reducedMotion: "reduce" }, PORT], ["?motion=off", {}, `${PORT}?motion=off`]]) {
      const c = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...opts });
      const q = await c.newPage();
      await q.goto(url, { waitUntil: "networkidle" });
      const s = await q.evaluate(() => {
        const t = document.querySelector("[data-logo-strip] > div");
        const b = document.querySelector("footer button[aria-pressed]");
        return { anim: getComputedStyle(t).animationName, x: new DOMMatrix(getComputedStyle(t).transform).m41, control: b ? getComputedStyle(b).display : "absent" };
      });
      check(s.anim === "none" && s.x === 0, `${label}: the strip rests at its first frame (animation ${s.anim}, x ${s.x}); control ${s.control}`);
      await c.close();
    }
  }

  /* ------------------------------------------------------------- the header */
  for (const w of [1000, 999]) {
    const { ctx, p } = await open(PORT, w, 800);
    const n = await p.evaluate(() => {
      const nav = document.querySelector('header nav[aria-label="Primary"]');
      const last = nav.lastElementChild.getBoundingClientRect();
      return { visible: getComputedStyle(nav).visibility, menu: getComputedStyle(document.querySelector("[data-menu-button]")).display, overflow: nav.scrollWidth - nav.clientWidth, clear: Math.round(nav.getBoundingClientRect().right - 28 - last.right) };
    });
    if (w === 1000) check(n.visible === "visible" && n.menu === "none" && n.overflow <= 0 && n.clear >= 0, `@1000: seven links on one line, ${n.clear}px clear of the fade; menu button ${n.menu}`);
    else check(n.visible === "hidden" && n.menu === "flex", `@999: nav ${n.visible}, menu button ${n.menu}`);
    await ctx.close();
  }

  /* --------------------------------------------------------- no sideways scroll */
  for (const w of [320, 360, 390, 768, 879, 880, 1024, 1440]) {
    const { ctx, p } = await open(PORT, w, 800);
    const sw = await p.evaluate(() => { scrollTo(10000, window.scrollY); return [document.documentElement.scrollWidth, scrollX]; });
    check(sw[0] === w && sw[1] === 0, `@${w}: scrollWidth ${sw[0]}, scrollX after scrollTo(10000) ${sw[1]}`);
    await ctx.close();
  }
} finally {
  await browser.close();
}
console.log(fails ? `\n${fails} check(s) failed` : "\nall checks pass");
process.exitCode = fails ? 1 : 0;
