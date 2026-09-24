#!/usr/bin/env node
// Hero motion QA: HeroArt (WebGL painting) and Vignettes, on the port and — where it helps —
// the reference. Prints one PASS / FAIL / INFO line per check and writes screenshots to
// qa/__screens__/hero/motion.
//
//   node qa/hero-motion.mjs [check ...]
//
// Checks: webgl, takeover, vignettes, gate, reduced, blocked, mobile, resize, side
// (default: all). Requires the dev server on :3000 and the reference on :4100.
//
// Instrumentation (injected before any page script):
//   __qa.draws        WebGL draw calls issued by canvases inside #top
//   __qa.glCtx        webgl getContext() calls on canvases inside #top (= renderers built)
//   __qa.raf          caller frames of requestAnimationFrame while __qa.counting is on
//   __qa.scroll       window scroll listener adds/removes, with caller frame
//   __qa.vig          [box index, ms, WAAPI animation count] for every vignette (re)build

import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

const PORT = process.env.PORT_URL || "http://localhost:3000/";
const REF = process.env.REF_URL || "http://127.0.0.1:4100/3264%20Home.dc.html";
const OUT = path.join("qa", "__screens__", "hero", "motion");
fs.mkdirSync(OUT, { recursive: true });

const only = process.argv.slice(2);
const want = (name) => only.length === 0 || only.includes(name);

const results = [];
function report(name, ok, evidence) {
  results.push({ name, ok, evidence });
  const tag = ok === true ? "PASS" : ok === false ? "FAIL" : "INFO";
  console.log(`${tag}  ${name}: ${evidence}`);
}

/* --------------------------------------------------------------- helpers */

const INSTR = () => {
  const Q = (window.__qa = { raf: [], counting: false, draws: 0, glCtx: 0, scroll: [], vig: [], motionFlag: [], observers: [] });
  // useMotionSystem's effect reads data-motion once per run: counts effect runs (Strict Mode = 2x)
  const oGA = Element.prototype.getAttribute;
  Element.prototype.getAttribute = function (n) {
    if (n === "data-motion" && this === document.documentElement) Q.motionFlag.push((new Error().stack || "").split("\n")[3] || "?");
    return oGA.call(this, n);
  };
  for (const name of ["IntersectionObserver", "ResizeObserver"]) {
    const O = window[name];
    if (!O) continue;
    window[name] = class extends O {
      constructor(...a) { super(...a); Q.observers.push([name, (new Error().stack || "").split("\n")[2] || "?"]); }
    };
  }
  const oRaf = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = function (cb) {
    if (Q.counting) Q.raf.push((new Error().stack || "").split("\n")[2] || "?");
    return oRaf(cb);
  };
  const inHero = (c) => !!(c && c.closest && c.closest("#top"));
  for (const P of [window.WebGLRenderingContext && WebGLRenderingContext.prototype, window.WebGL2RenderingContext && WebGL2RenderingContext.prototype]) {
    if (!P) continue;
    for (const fn of ["drawArrays", "drawElements"]) {
      const o = P[fn];
      P[fn] = function (...a) {
        if (inHero(this.canvas)) Q.draws++;
        return o.apply(this, a);
      };
    }
  }
  const oGC = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (type, ...a) {
    if (/webgl/.test(String(type)) && inHero(this)) Q.glCtx++;
    return oGC.call(this, type, ...a);
  };
  const oAdd = EventTarget.prototype.addEventListener, oRem = EventTarget.prototype.removeEventListener;
  EventTarget.prototype.addEventListener = function (t, fn, o) {
    if (t === "scroll" && this === window) Q.scroll.push(["+", (new Error().stack || "").split("\n")[2] || "?"]);
    return oAdd.call(this, t, fn, o);
  };
  EventTarget.prototype.removeEventListener = function (t, fn, o) {
    if (t === "scroll" && this === window) Q.scroll.push(["-", (new Error().stack || "").split("\n")[2] || "?"]);
    return oRem.call(this, t, fn, o);
  };
  const boxes = () => [...document.querySelectorAll("#top [data-vig], #top [style*='height: 150px']")];
  new MutationObserver((ms) => {
    for (const m of ms) for (const n of m.addedNodes) {
      if (n.nodeName !== "svg") continue;
      const i = boxes().indexOf(n.parentElement);
      if (i < 0) continue;
      // animations are created synchronously after the svg is appended, before this callback
      Q.vig.push([i, Math.round(performance.now()), n.getAnimations({ subtree: true }).length]);
    }
  }).observe(document, { subtree: true, childList: true });
};

const HIDE_CHROME = `nextjs-portal { display: none !important; } * { caret-color: transparent !important; }`;
const HIDE_VIG = `#top [data-vig] svg, #top [style*="height: 150px"] svg { visibility: hidden !important; }`;

async function open(browser, url, { w = 1440, h = 900, reduced = false, route = null } = {}) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: reduced ? "reduce" : "no-preference" });
  const page = await ctx.newPage();
  const log = { errors: [], warnings: [], pageerrors: [] };
  page.on("console", (m) => {
    if (m.type() === "error") log.errors.push(m.text());
    if (m.type() === "warning") log.warnings.push(m.text());
  });
  page.on("pageerror", (e) => log.pageerrors.push(e.stack || String(e)));
  await page.addInitScript(INSTR);
  if (route) await route(page);
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("#top", { state: "attached" });
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({ content: HIDE_CHROME });
  return { ctx, page, log };
}

// The intro overlay (fixed, z-index 300) covers the page for ~4s; any keypress skips it.
async function skipIntro(page) {
  await page.waitForTimeout(300);
  await page.keyboard.press("Shift").catch(() => {});
  await page.waitForFunction(() => ![...document.querySelectorAll("body *")].some((el) => {
    const cs = getComputedStyle(el);
    return cs.position === "fixed" && +cs.zIndex >= 300 && cs.display !== "none" && cs.visibility !== "hidden" && +cs.opacity > 0.01;
  }), null, { timeout: 12000 }).catch(() => {});
}

const qa = (page) => page.evaluate(() => ({ draws: __qa.draws, glCtx: __qa.glCtx, vig: __qa.vig.slice(), scroll: __qa.scroll.slice(), motionFlag: __qa.motionFlag.slice(), observers: __qa.observers.slice() }));

async function waitDraws(page, n, timeout = 20000) {
  return page.waitForFunction((n) => window.__qa.draws >= n, n, { timeout }).then(() => true, () => false);
}

// until draw count is stable for `ms`
async function settle(page, ms = 800, max = 8000) {
  const t0 = Date.now();
  let last = -1;
  while (Date.now() - t0 < max) {
    const d = await page.evaluate(() => __qa.draws);
    if (d === last) return d;
    last = d;
    await page.waitForTimeout(ms);
  }
  return last;
}

function png(buf) { return PNG.sync.read(buf); }
function diff(aBuf, bBuf, file) {
  const a = png(aBuf), b = png(bBuf);
  const w = Math.min(a.width, b.width), h = Math.min(a.height, b.height);
  const crop = (img) => { if (img.width === w && img.height === h) return img; const o = new PNG({ width: w, height: h }); PNG.bitblt(img, o, 0, 0, w, h, 0, 0); return o; };
  const A = crop(a), B = crop(b), D = new PNG({ width: w, height: h });
  const n = pixelmatch(A.data, B.data, D.data, w, h, { threshold: 0.1 });
  if (file) fs.writeFileSync(path.join(OUT, file), PNG.sync.write(D));
  return n / (w * h);
}
// mean absolute channel difference (0..255) — catches subtle warps pixelmatch's threshold ignores
function meanDelta(aBuf, bBuf) {
  const a = png(aBuf), b = png(bBuf);
  const n = Math.min(a.data.length, b.data.length);
  let s = 0, c = 0;
  for (let i = 0; i < n; i += 4) { s += Math.abs(a.data[i] - b.data[i]) + Math.abs(a.data[i + 1] - b.data[i + 1]) + Math.abs(a.data[i + 2] - b.data[i + 2]); c += 3; }
  return s / c;
}
const save = (name, buf) => fs.writeFileSync(path.join(OUT, name), buf);
const pct = (r) => (r * 100).toFixed(2) + "%";

// Map "chunk.js:LINE:COL" stack frames to the source module that owns that line.
const chunkCache = new Map();
async function moduleOf(frame) {
  const m = frame.match(/(https?:\/\/[^\s)]+?\.js):(\d+):\d+/);
  if (!m) return frame.trim();
  const [, url, line] = m;
  if (!chunkCache.has(url)) {
    const src = await fetch(url).then((r) => r.text()).catch(() => "");
    const heads = [];
    src.split("\n").forEach((l, i) => { const h = l.match(/^"\[project\]\/([^ "]+)/); if (h) heads.push([i + 1, h[1]]); });
    chunkCache.set(url, heads);
  }
  let owner = url.split("/").pop();
  for (const [ln, name] of chunkCache.get(url)) if (ln <= +line) owner = name;
  return owner;
}
async function bucket(frames) {
  const out = {};
  for (const f of frames) { const k = await moduleOf(f); out[k] = (out[k] || 0) + 1; }
  return out;
}

async function heroRects(page) {
  return page.evaluate(() => {
    const q = (s) => { const r = document.querySelector(s)?.getBoundingClientRect(); return r ? [Math.round(r.left), Math.round(r.top + scrollY)] : null; };
    return JSON.stringify({ h1: q("#top h1"), cta: q("#top a[href='#contact']"), cards: q("#top [data-vig]") });
  });
}

const browser = await chromium.launch({ channel: "chrome", args: ["--hide-scrollbars"] });

try {
  /* ------------------------------------------------ webgl: render, scroll, idle, hygiene */
  if (want("webgl")) {
    const { ctx, page, log } = await open(browser, PORT);
    await skipIntro(page);
    const drew = await waitDraws(page, 1);
    await settle(page);
    const s = await qa(page);
    report("webgl.renders", drew && s.draws >= 1, `draw calls on artCv at load = ${s.draws}, renderers built = ${s.glCtx}`);

    // Painting pixels come from WebGL: hide the CSS background — the painting must still be there.
    const clip = { x: 0, y: 68, width: 1440, height: 560 };
    await page.addStyleTag({ content: HIDE_VIG });
    const normal = await page.screenshot({ clip });
    await page.evaluate(() => { document.querySelector("#top canvas").style.backgroundImage = "none"; });
    const glOnly = await page.screenshot({ clip });
    await page.evaluate(() => { document.querySelector("#top canvas").style.visibility = "hidden"; });
    const none = await page.screenshot({ clip });
    await page.evaluate(() => { const c = document.querySelector("#top canvas"); c.style.visibility = ""; c.style.backgroundImage = ""; });
    save("webgl-only.png", glOnly); save("webgl-none.png", none);
    const vsNone = diff(glOnly, none), vsNormal = diff(glOnly, normal);
    report("webgl.nonBlank", vsNone > 0.2 && vsNormal < 0.01, `WebGL-only vs no painting: ${pct(vsNone)} differ; WebGL-only vs WebGL+CSS bg: ${pct(vsNormal)}`);

    // Idle at the top: no rAF work from the hero, no draws.
    await page.waitForTimeout(1000);
    const d0 = await page.evaluate(() => { __qa.raf = []; __qa.counting = true; return __qa.draws; });
    await page.waitForTimeout(1000);
    const idle = await page.evaluate(() => { __qa.counting = false; return { raf: __qa.raf, draws: __qa.draws }; });
    const buckets = await bucket(idle.raf);
    const heroRaf = Object.entries(buckets).filter(([k]) => /hero|vignette/i.test(k)).reduce((a, [, v]) => a + v, 0);
    report("webgl.idleNoRaf", heroRaf === 0 && idle.draws === d0, `1s idle at top: hero rAF calls = ${heroRaf}, hero draws = ${idle.draws - d0}; all rAF callers: ${JSON.stringify(buckets)}`);

    // Scroll: displaces while energy is up, content does not move relative to the page.
    const rectsRest0 = await heroRects(page);
    const view = { x: 0, y: 0, width: 1440, height: 700 };
    const dA = await page.evaluate(() => { window.scrollTo(0, 120); return __qa.draws; });
    await page.waitForTimeout(30);
    const during = await page.screenshot({ clip: view });
    const rectsDuring = await heroRects(page);
    const dB = await page.evaluate(() => __qa.draws);
    // the ripple decays per rendered frame (x0.945), so how long it takes depends on frame rate
    const tSettle = Date.now();
    const dC = await settle(page, 400, 15000);
    const settleMs = Date.now() - tSettle;
    const rest = await page.screenshot({ clip: view });
    const rectsRest = await heroRects(page);
    await page.waitForTimeout(1000);
    const dD = await page.evaluate(() => __qa.draws);
    save("scroll-during.png", during); save("scroll-rest.png", rest);
    const scrollDiff = diff(during, rest, "scroll-diff.png"), scrollDelta = meanDelta(during, rest);
    report("webgl.displacesOnScroll", scrollDiff > 0.002 || scrollDelta > 0.5, `scrolled 0→120: during-vs-rest ${pct(scrollDiff)} px differ, mean |Δ| ${scrollDelta.toFixed(2)}/255; draws during ripple ${dC - dA} (first ${dB - dA} within 30ms)`);
    report("webgl.settles", dD === dC, `ripple rendered ${dC - dA} frames and parked within ${settleMs}ms; draws in the following 1000ms = ${dD - dC}`);
    report("webgl.contentStatic", rectsRest0 === rectsDuring && rectsDuring === rectsRest, `h1/CTA/cards page positions before ${rectsRest0} | during ${rectsDuring} | after ${rectsRest}`);

    // Wheel scroll, the way a person scrolls: draws follow, then stop.
    await page.evaluate(() => window.scrollTo(0, 0));
    await settle(page);
    const w0 = await page.evaluate(() => __qa.draws);
    await page.mouse.move(700, 400);
    for (let i = 0; i < 8; i++) { await page.mouse.wheel(0, 30); await page.waitForTimeout(40); }
    const w1 = await page.evaluate(() => __qa.draws);
    const w2 = await settle(page, 400, 15000);
    await page.waitForTimeout(1000);
    const w3 = await page.evaluate(() => __qa.draws);
    report("webgl.wheel", w1 - w0 > 5 && w3 === w2, `wheel scroll 240px: ${w1 - w0} draws while scrolling, ${w2 - w1} while settling, ${w3 - w2} in the following 1000ms`);

    // Strict Mode hygiene: one renderer, one window scroll listener from the hero, one svg per box.
    const s2 = await qa(page);
    const heroScroll = [];
    for (const [op, f] of s2.scroll) if (/hero/.test(await moduleOf(f))) heroScroll.push(op);
    const net = heroScroll.filter((o) => o === "+").length - heroScroll.filter((o) => o === "-").length;
    const svgs = await page.evaluate(() => [...document.querySelectorAll("#top [data-vig]")].map((b) => b.querySelectorAll(":scope > svg").length));
    // Strict Mode evidence: useMotionSystem effect runs (each reads data-motion via motionOff()).
    const effectRuns = s2.motionFlag.length;
    const vigObs = [];
    for (const [name, f] of s2.observers) if (/vignettes/.test(await moduleOf(f))) vigObs.push(name);
    report("webgl.strictModeDoubleMount", null, `useMotionSystem effect runs = ${effectRuns} for 4 hooks (Hero x2, Intro, Capabilities) — Strict Mode double-invokes; observers built by vignettes.js = ${JSON.stringify(vigObs)} (one IO + one RO: only the surviving instance started)`);
    report("webgl.strictModeHygiene", s2.glCtx === 1 && net === 1 && svgs.every((n) => n === 1), `renderers built on artCv = ${s2.glCtx}, hero window-scroll listeners live = ${net} (${heroScroll.join("")}), svgs per vignette box = ${svgs.join("/")}`);

    const hyd = log.errors.concat(log.warnings).filter((t) => /hydrat/i.test(t));
    const heroErrs = log.errors.concat(log.pageerrors);
    report("webgl.console", hyd.length === 0 && log.pageerrors.length === 0 && log.errors.length === 0,
      `errors ${log.errors.length}, pageerrors ${log.pageerrors.length}, hydration warnings ${hyd.length}; warnings: ${JSON.stringify(log.warnings.map((t) => t.slice(0, 110)))}${heroErrs.length ? " ERRORS: " + JSON.stringify(heroErrs.map((t) => t.slice(0, 200))) : ""}`);
    await ctx.close();
  }

  /* ---------------------------------------------- takeover: CSS painting → WebGL, no jump */
  if (want("takeover")) {
    const measure = async (url, pattern, label) => {
      let release;
      const gate = new Promise((r) => (release = r));
      const { ctx, page } = await open(browser, url, {
        route: (p) => p.route(pattern, async (r) => { await gate; await r.continue().catch(() => {}); }),
      });
      await skipIntro(page);
      await page.addStyleTag({ content: HIDE_VIG });
      await page.evaluate(() => document.documentElement.scrollTop = 0);
      await page.waitForTimeout(800);
      const clip = await page.evaluate(() => { const r = document.querySelector("#top").getBoundingClientRect(); return { x: 0, y: Math.max(0, r.top), width: innerWidth, height: 620 }; });
      const d0 = await page.evaluate(() => __qa.draws);
      const before = await page.screenshot({ clip });
      release();
      const drew = await waitDraws(page, d0 + 1, 30000);
      await settle(page);
      await page.waitForTimeout(300);
      const after = await page.screenshot({ clip });
      save(`takeover-${label}-css.png`, before); save(`takeover-${label}-webgl.png`, after);
      const r = diff(before, after, `takeover-${label}-diff.png`), m = meanDelta(before, after);
      await ctx.close();
      return { drew, r, m };
    };
    const port = await measure(PORT, /three-r161/, "port");
    const ref = await measure(REF, /esm\.sh/, "ref");
    report("takeover.noJump", port.drew && port.r < 0.01, `port CSS→WebGL: ${pct(port.r)} px differ, mean |Δ| ${port.m.toFixed(2)}/255 (reference's own takeover: ${ref.drew ? `${pct(ref.r)}, mean |Δ| ${ref.m.toFixed(2)}` : "WebGL did not start"})`);
  }

  /* ------------------------------------------------------ vignettes: cycle, stagger, hygiene */
  if (want("vignettes")) {
    const { ctx, page } = await open(browser, PORT);
    await skipIntro(page);
    await page.waitForTimeout(15500);
    const { vig } = await qa(page);
    const t0 = vig.length ? vig[0][1] : 0;
    const rel = vig.map(([i, t, a]) => [["A", "B", "C"][i], t - t0, a]);
    const anim = [0, 1, 2].map((i) => vig.filter((v) => v[0] === i && v[2] > 0).map((v) => v[1]));
    const periods = anim.map((ts) => ts.slice(2).map((t, k) => t - ts[k + 1])); // skip the pre-clobber first cycle
    const expect = [6200, 6600, 7000];
    const okPeriods = periods.every((ps, i) => ps.length >= 1 && ps.every((p) => Math.abs(p - expect[i]) < 120));
    const firstReal = anim.map((ts) => ts[1] - t0);
    const spread = Math.max(...firstReal) - Math.min(...firstReal);
    report("vignettes.cycle", okPeriods, `animated rebuild periods A/B/C = ${JSON.stringify(periods)} ms (expect 6200/6600/7000)`);
    report("vignettes.outOfPhase", spread >= 600, `first full cycles start at A ${firstReal[0]} / B ${firstReal[1]} / C ${firstReal[2]} ms after first paint (spread ${spread}ms, drifting 400ms per cycle)`);
    report("vignettes.timeline", null, `builds [box, ms, animations]: ${JSON.stringify(rel)}`);
    // A leaked second instance (Strict Mode) would run its own timer chain: two ANIMATED builds of
    // the same box close together. (An animated build followed ~10–40ms later by a still one is
    // the reference's own ResizeObserver first-callback repaint, reproduced faithfully.)
    const dup = vig.some((v, k) => v[2] > 0 && vig.some((u, j) => j > k && u[0] === v[0] && u[2] > 0 && Math.abs(u[1] - v[1]) < 1000));
    const stills = vig.filter((v) => v[2] === 0).length;
    report("vignettes.singleInstance", !dup && stills === 6, dup ? "two animated builds of one box within 1s (duplicate timer chain)" : `one timer chain per box; ${stills} still builds (3 initial + 3 from the ResizeObserver's first callback, as in the reference)`);

    // mid-cycle screenshot for the eye
    const shot = await page.locator("#top [data-vig]").first().evaluate((el) => el.closest("[class*='grid']").getBoundingClientRect().toJSON());
    await page.screenshot({ path: path.join(OUT, "vignettes-port-mid.png"), clip: { x: shot.x, y: shot.y, width: shot.width, height: 230 } });
    await ctx.close();
  }

  /* ------------------------------------------------- gate: no start until the card is on screen */
  if (want("gate")) {
    const { ctx, page } = await open(browser, PORT, { w: 1440, h: 480 });
    await skipIntro(page);
    const pos = await page.evaluate(() => Math.round(document.querySelector("#top [data-vig]").getBoundingClientRect().top));
    await page.waitForTimeout(8000);
    const before = (await qa(page)).vig.filter((v) => v[2] > 0).length;
    const tScroll = await page.evaluate(() => { window.scrollTo(0, 420); return Math.round(performance.now()); });
    await page.waitForTimeout(1500);
    const after = (await qa(page)).vig.filter((v) => v[2] > 0 && v[1] >= tScroll).map((v) => [["A", "B", "C"][v[0]], v[1] - tScroll]);
    report("gate.offscreenIdle", before === 0, `viewport 1440x480, vignette box top at ${pos}px (> 480 + 140 rootMargin): ${before} animated builds in 8s`);
    report("gate.startsOnScroll", after.length === 3 && after.every(([, dt]) => dt >= 200 && dt < 800), `after scrolling into view: ${JSON.stringify(after)} (box, ms after scroll)`);
    await ctx.close();
  }

  /* ------------------------------------------------------------------ reduced motion */
  if (want("reduced")) {
    const { ctx, page, log } = await open(browser, PORT, { reduced: true });
    await page.waitForTimeout(1500);
    const drew = await waitDraws(page, 1);
    await page.waitForTimeout(7500);
    const s = await qa(page);
    const animated = s.vig.filter((v) => v[2] > 0).length;
    report("reduced.vignettesStill", animated === 0 && s.vig.length > 0, `${s.vig.length} builds, ${animated} with animations, in 9s`);
    await page.addStyleTag({ content: HIDE_VIG });
    const view = { x: 0, y: 0, width: 1440, height: 700 };
    await page.evaluate(() => window.scrollTo(0, 120));
    await page.waitForTimeout(40);
    const d0 = await page.evaluate(() => __qa.draws);
    const during = await page.screenshot({ clip: view });
    await page.waitForTimeout(1500);
    const rest = await page.screenshot({ clip: view });
    const d1 = await page.evaluate(() => __qa.draws);
    const r = diff(during, rest);
    report("reduced.paintingStill", drew && d1 === d0 && r === 0, `painting rendered once (${s.draws} draw), draws after scroll ${d1 - d0}, during-vs-rest ${pct(r)}`);
    report("reduced.console", log.errors.length === 0 && log.pageerrors.length === 0, `errors ${log.errors.length}, pageerrors ${log.pageerrors.length}`);
    await ctx.close();
  }

  /* ------------------------------------------------ three blocked / no WebGL: static painting */
  if (want("blocked")) {
    // Block only the lazily fetched three chunk. In dev, Turbopack's tiny async-loader stub for
    // the dynamic import (also named *three*) is in the page's initial chunk list; aborting that
    // stops the whole page hydrating, which is not the failure being simulated.
    const html = await fetch(PORT).then((r) => r.text());
    const initial = new Set([...html.matchAll(/<script src="([^"]+)"/g)].map((m) => new URL(m[1], PORT).href));
    const offShot = async () => {
      const off = await open(browser, PORT + "?motion=off");
      await off.page.addStyleTag({ content: HIDE_VIG });
      await off.page.waitForTimeout(600);
      const b = await off.page.locator("#top").screenshot();
      await off.ctx.close();
      return b;
    };
    const ref = await offShot();
    const variants = {
      "three chunk aborted": async (p) => {
        const aborted = [];
        await p.route(/three/, (r) => {
          if (initial.has(r.request().url())) return r.continue();
          aborted.push(r.request().url().split("/").pop());
          return r.abort();
        });
        return aborted;
      },
      "WebGL unavailable": async (p) => {
        await p.addInitScript(() => {
          const o = HTMLCanvasElement.prototype.getContext;
          HTMLCanvasElement.prototype.getContext = function (t, ...a) { return /webgl/.test(String(t)) ? null : o.call(this, t, ...a); };
        });
        return [];
      },
    };
    for (const [label, setup] of Object.entries(variants)) {
      let aborted = [];
      const { ctx, page, log } = await open(browser, PORT, { route: async (p) => { aborted = await setup(p); } });
      await skipIntro(page);
      await page.waitForTimeout(3000);
      const s = await qa(page);
      const hydrated = await page.evaluate(() => Object.keys(document.querySelector("#top")).some((k) => k.startsWith("__react")));
      await page.addStyleTag({ content: HIDE_VIG });
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(300);
      const shot = await page.locator("#top").screenshot();
      const slug = label.replace(/\W+/g, "-");
      save(`blocked-${slug}.png`, shot);
      const r = diff(shot, ref, `blocked-${slug}-diff.png`);
      report(`blocked.staticPainting (${label})`, hydrated && s.draws === 0 && r < 0.001 && s.vig.length > 0,
        `aborted ${JSON.stringify(aborted)}; page hydrated ${hydrated}; hero draws ${s.draws}; hero vs ?motion=off ${pct(r)} (vignettes masked); vignettes built ${s.vig.length > 0}`);
      const other = log.errors.filter((t) => !/Failed to load resource/.test(t));
      // attribute each uncaught error to the source module of its first project frame
      const owners = [];
      for (const st of log.pageerrors) {
        let owner = "unknown";
        for (const line of st.split("\n").slice(1)) { const o = await moduleOf(line); if (/^src\//.test(o)) { owner = o; break; } }
        owners.push(owner);
      }
      const heroOwned = owners.filter((o) => /Hero|hero-art|vignettes/.test(o));
      report(`blocked.noUncaught (${label})`, heroOwned.length === 0,
        `uncaught from hero modules ${heroOwned.length}; all uncaught by module ${JSON.stringify(owners)}; ` +
        `console errors besides the aborted request: ${JSON.stringify(other.map((t) => t.slice(0, 140)))}; warnings ${JSON.stringify(log.warnings.map((t) => t.slice(0, 140)))}`);
      await ctx.close();
    }
  }

  /* ----------------------------------------------------------------- mobile / tablet */
  if (want("mobile")) {
    for (const [w, h] of [[320, 640], [375, 812], [768, 1024]]) {
      const { ctx, page, log } = await open(browser, PORT, { w, h });
      await skipIntro(page);
      await page.waitForTimeout(2500);
      const m = await page.evaluate(() => {
        const cards = [...document.querySelectorAll("#top [data-vig]")].map((b) => b.parentElement.getBoundingClientRect());
        const h1 = document.querySelector("#top h1");
        const cv = document.querySelector("#top canvas");
        const svgW = [...document.querySelectorAll("#top [data-vig]")].map((b) => { const s = b.querySelector("svg"); return s ? `${s.getAttribute("width")}/${b.clientWidth}` : "none"; });
        return {
          overflow: document.documentElement.scrollWidth - innerWidth,
          cols: new Set(cards.map((r) => Math.round(r.left))).size,
          cardRight: Math.max(...cards.map((r) => Math.round(r.right))),
          h1Lines: Math.round(h1.getBoundingClientRect().height / parseFloat(getComputedStyle(h1).lineHeight)),
          bg: getComputedStyle(cv).backgroundImage.replace(/^.*\/img\//, "").replace(/"?\)$/, ""),
          padX: getComputedStyle(document.querySelector("#top")).paddingLeft,
          padTop: getComputedStyle(document.querySelector("#top > .relative")).paddingTop,
          gridMt: getComputedStyle(document.querySelector("#top [data-vig]").parentElement.parentElement).marginTop,
          svgW,
        };
      });
      const s = await qa(page);
      const mobile = w < 768;
      const ok = m.overflow <= 0 && m.h1Lines === 2 && (mobile ? s.glCtx === 0 && m.bg === "hero-valley-900.webp" && m.cols === 1 : s.glCtx === 1 && m.bg === "hero-valley.webp");
      await page.screenshot({ path: path.join(OUT, `mobile-${w}.png`), fullPage: false });
      report(`mobile.${w}`, ok, `overflow ${m.overflow}px, card columns ${m.cols} (right edge ${m.cardRight}), h1 lines ${m.h1Lines}, bg ${m.bg}, HeroArt renderers ${s.glCtx}, section px ${m.padX}, top ${m.padTop}, cards mt ${m.gridMt}, vignette svg/box widths ${m.svgW.join(" ")}; errors ${log.errors.length + log.pageerrors.length}`);
      await ctx.close();
    }
  }

  /* ------------------------------------------------------------------------ resize */
  if (want("resize")) {
    const { ctx, page, log } = await open(browser, PORT);
    await skipIntro(page);
    await waitDraws(page, 1);
    await settle(page);
    await page.addStyleTag({ content: HIDE_VIG.replace(/visibility: hidden/g, "visibility: visible") });
    const widths = async () => page.evaluate(() => [...document.querySelectorAll("#top [data-vig]")].map((b) => {
      const s = b.querySelector("svg");
      const bb = s.getBBox();
      return { w: +s.getAttribute("width"), box: b.clientWidth, right: Math.round(bb.x + bb.width), left: Math.round(bb.x) };
    }));
    const out = [];
    for (const w of [1100, 900, 1440]) {
      await page.setViewportSize({ width: w, height: 900 });
      await page.waitForTimeout(700);
      const ws = await widths();
      out.push([w, ws]);
    }
    const okW = out.every(([, ws]) => ws.every((v) => v.w === Math.max(200, v.box) && v.right <= v.w + 1 && v.left >= -1));
    report("resize.vignettesRebuild", okW, out.map(([w, ws]) => `@${w}: ` + ws.map((v) => `svg ${v.w}/box ${v.box} ink ${v.left}..${v.right}`).join(", ")).join(" | "));

    // Across the 768 line: HeroArt torn down (canvas cleared to the CSS painting), then rebuilt on the same canvas.
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.addStyleTag({ content: HIDE_VIG });
    await settle(page);
    const clip = { x: 0, y: 68, width: 1440, height: 560 };
    const before = await page.screenshot({ clip });
    const s0 = await qa(page);
    await page.setViewportSize({ width: 700, height: 900 });
    await page.waitForTimeout(600);
    const s1 = await qa(page);
    const cleared = await page.evaluate(() => { const c = document.querySelector("#top canvas"); c.style.backgroundImage = "none"; return true; });
    const narrowNoBg = await page.screenshot({ clip: { x: 0, y: 68, width: 700, height: 300 } });
    await page.evaluate(() => { document.querySelector("#top canvas").style.visibility = "hidden"; });
    const narrowNone = await page.screenshot({ clip: { x: 0, y: 68, width: 700, height: 300 } });
    await page.evaluate(() => { const c = document.querySelector("#top canvas"); c.style.visibility = ""; c.style.backgroundImage = ""; });
    const staleFrame = diff(narrowNoBg, narrowNone);
    await page.setViewportSize({ width: 1440, height: 900 });
    await waitDraws(page, s1.draws + 1, 20000);
    await settle(page);
    await page.waitForTimeout(300);
    const after = await page.screenshot({ clip });
    const s2 = await qa(page);
    save("resize-before.png", before); save("resize-after.png", after);
    const r = diff(before, after, "resize-diff.png");
    const heroScroll = [];
    for (const [op, f] of s2.scroll) if (/hero/.test(await moduleOf(f))) heroScroll.push(op);
    report("resize.heroArtAcross768", cleared && staleFrame < 0.001 && s2.glCtx === s0.glCtx + 1 && r < 0.01,
      `below 768: WebGL frame cleared (canvas without CSS bg vs hidden: ${pct(staleFrame)}); back at 1440: renderers ${s0.glCtx}→${s2.glCtx}, draws ${s1.draws}→${s2.draws}, painting vs before ${pct(r)}; hero scroll listener ops ${heroScroll.join("")}; errors ${log.errors.length + log.pageerrors.length} ${JSON.stringify(log.errors.concat(log.pageerrors).map((t) => t.slice(0, 160)))}`);
    await ctx.close();
  }

  /* ------------------------------------ reduced motion: reference vs port, unmasked, at rest */
  if (want("reducedSide")) {
    const shots = {};
    for (const [label, url] of [["ref", REF], ["port", PORT]]) {
      const { ctx, page } = await open(browser, url, { h: 1200, reduced: true });
      await waitDraws(page, 1);
      await page.waitForTimeout(1500);
      shots[label] = await page.locator("#top").screenshot();
      save(`reduced-${label}.png`, shots[label]);
      await ctx.close();
    }
    const r = diff(shots.ref, shots.port, "reduced-diff.png");
    report("reducedSide.1440", r < 0.01, `reduced motion, nothing masked (WebGL painting + resting vignettes): reference vs port ${pct(r)} px differ`);
  }

  /* ------------------------------------------ side by side: reference vs port, motion on */
  if (want("side")) {
    const shoot = async (url, label, phase) => {
      const { ctx, page } = await open(browser, url, { h: 1200 });
      // Do NOT skip the intro here: in the reference, skipIntro clears the component's shared
      // timers array, which also holds the vignette cycles, so a skip freezes the vignettes.
      // Both intros finish on their own (~4s) before the first full vignette cycle (~6.5–7s).
      const ok = await page.waitForFunction(() => __qa.vig.filter((v) => v[0] === 0 && v[2] > 0).length >= 2, null, { timeout: 20000 }).then(() => true, () => false);
      if (!ok) console.log(label, "vig log:", JSON.stringify(await page.evaluate(() => __qa.vig)));
      await page.waitForTimeout(phase);
      const s = await qa(page);
      const buf = await page.locator("#top").screenshot({ animations: "allow" });
      save(`side-${label}-${phase}.png`, buf);
      await ctx.close();
      return { buf, s, ok };
    };
    for (const phase of [900, 1800]) {
      const ref = await shoot(REF, "ref", phase);
      const port = await shoot(PORT, "port", phase);
      const r = diff(ref.buf, port.buf, `side-diff-${phase}.png`);
      report(`side.motionOn1440@${phase}ms`, ref.ok && port.ok && r < 0.02, `reference vs port hero, motion on, ${phase}ms into A's first full cycle (B ${phase - 400}ms, C ${phase - 800}ms): ${pct(r)} px differ (WebGL draws ref ${ref.s.draws}, port ${port.s.draws})`);
    }
  }
} finally {
  await browser.close();
}

const failed = results.filter((r) => r.ok === false);
console.log(`\n${results.filter((r) => r.ok === true).length} pass, ${failed.length} fail, ${results.filter((r) => r.ok === null).length} info`);
process.exitCode = failed.length ? 1 : 0;
