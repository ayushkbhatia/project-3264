#!/usr/bin/env node
// Intro relief behaviour checks on the port (motion on, fresh context per check so
// sessionStorage starts empty). Prints PASS/FAIL with the evidence for each.
//
//   node qa/intro-interact.mjs [--only natural,click,key,dissolve,session,reduced,motionoff]
import { PORT, arg, launch, newIntroPage } from "./intro-lib.mjs";

const only = arg("only", null);
const want = (k) => !only || String(only).split(",").includes(k);
const results = [];
const report = (name, ok, evidence) => {
  results.push([name, ok]);
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}\n      ${evidence}`);
};

// Tracks the intro's own window listeners and rAF loop by their source (IntroRelief's resize
// handler calls iMeasure, its key handler skipIntro, its loop iStep), so other systems' listeners
// and loops do not count.
const LEAK_PROBE = () => {
  const L = (window.__leak = { listeners: new Map(), rafIntro: 0, rafIntroLast: 0 });
  const tag = (fn) => {
    const s = String(fn);
    return /skipIntro/.test(s) ? "intro-keydown" : /iMeasure/.test(s) ? "intro-resize" : null;
  };
  const add = window.addEventListener, rem = window.removeEventListener;
  window.addEventListener = function (type, fn, o) {
    const t = tag(fn);
    if (t) L.listeners.set(fn, t + ":" + type);
    return add.call(this, type, fn, o);
  };
  window.removeEventListener = function (type, fn, o) {
    L.listeners.delete(fn);
    return rem.call(this, type, fn, o);
  };
  const raf = window.requestAnimationFrame;
  window.requestAnimationFrame = function (cb) {
    if (/iStep/.test(String(cb))) { L.rafIntro++; L.rafIntroLast = performance.now(); }
    return raf.call(this, cb);
  };
};

async function fresh(browser, opts = {}, url = PORT) {
  const r = await newIntroPage(browser, opts);
  await r.page.addInitScript(LEAK_PROBE);
  await r.page.goto(url, { waitUntil: "commit" });
  return r;
}

const waitStart = (page) => page.waitForFunction(() => window.__intro && window.__intro.start != null, null, { timeout: 15000, polling: 16 });
const waitGone = (page) => page.waitForFunction(() => window.__intro && window.__intro.gone != null, null, { timeout: 15000, polling: 16 });
const sinceStart = (page) => page.evaluate(() => Math.round(performance.timeOrigin + performance.now() - window.__intro.start));
const wrapState = (page) =>
  page.evaluate(() => {
    const w = document.querySelector("[data-intro-wrap]");
    const cs = getComputedStyle(w);
    return { display: cs.display, pe: cs.pointerEvents, opacity: +cs.opacity };
  });
const linkBox = (page) =>
  page.evaluate(() => {
    const r = document.querySelector('header a[href="#industries"]').getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  });
const introStats = (page) =>
  page.evaluate(() => {
    const S = window.__intro, L = window.__leak, w = document.querySelector("[data-intro-wrap]"), cv = w.querySelector("canvas");
    return {
      caps: S.caps.map(([t, v]) => `${v}@${Math.round(t - S.start)}`),
      shownMs: S.gone && Math.round(S.gone - S.start),
      anims: S.anims,
      contexts: S.contexts,
      listeners: [...L.listeners.values()],
      rafIntro: L.rafIntro,
      liveAnimations: w.getAnimations ? w.getAnimations({ subtree: true }).length : -1,
      canvas: `${cv.width}x${cv.height}`,
      attr: document.documentElement.getAttribute("data-intro"),
    };
  });

// Clicks the header link straight after the overlay was dismissed and reports whether it fired.
async function clickNav(page, box) {
  const before = await page.evaluate(() => location.hash);
  const t = await sinceStart(page);
  await page.mouse.click(box.x, box.y);
  await page.waitForTimeout(250);
  const after = await page.evaluate(() => location.hash);
  return { fired: after === "#industries" && before !== "#industries", at: t, hash: after };
}

const browser = await launch();

if (want("natural")) {
  const { ctx, page, log } = await fresh(browser);
  await waitStart(page);
  await waitGone(page);
  await page.waitForTimeout(150);
  const a = await introStats(page);
  await page.waitForTimeout(1500);
  const b = await introStats(page);
  const capsOk = a.caps.map((c) => c.split("@")[0]).join(" · ") === "2 · 4 · 8 · 16 · 32 · 32 × 64";
  report("plays once, ~4s, caption 2 · 4 · 8 · 16 · 32 · 32 × 64", capsOk && a.shownMs > 3500 && a.shownMs < 4400 && a.anims === 101 && a.contexts === 1,
    `captions ${a.caps.join(" ")}; overlay up ${a.shownMs}ms; overlay animations started ${a.anims} (one pass = 101); WebGL contexts ${a.contexts}`);
  report("nothing of the intro keeps running after it ends", a.listeners.length === 0 && b.rafIntro === a.rafIntro && b.liveAnimations === 0 && b.canvas === "1x1",
    `intro listeners still attached: [${a.listeners}]; intro rAF calls ${a.rafIntro} at +150ms, ${b.rafIntro} at +1650ms; live animations under overlay ${b.liveAnimations}; canvas buffer ${b.canvas}; data-intro=${b.attr}`);
  const box = await linkBox(page);
  const nav = await clickNav(page, box);
  report("page interactive after natural end", nav.fired, `header "Industries" clicked at +${nav.at}ms → hash ${nav.hash}`);
  const bad = log.filter((l) => /^(error|warning|pageerror)/.test(l) && !/footer-nocturne|images\.qualities/.test(l));
  const hydration = log.filter((l) => /hydrat/i.test(l));
  const gl = log.filter((l) => /webgl|context/i.test(l));
  report("console clean (no errors, hydration or WebGL warnings)", bad.length === 0 && hydration.length === 0 && gl.length === 0,
    `errors/warnings: ${bad.length ? bad.join(" | ") : "none"}; hydration: ${hydration.length}; WebGL/context: ${gl.length}; (ignored, other area: ${log.filter((l) => /footer-nocturne/.test(l)).length} footer image-quality warning)`);

  // same tab = same session: a reload must not replay it
  await page.reload({ waitUntil: "commit" });
  await page.waitForTimeout(2500);
  const r = await page.evaluate(() => ({ attr: document.documentElement.getAttribute("data-intro"), shown: window.__intro.samples.length, start: window.__intro.start }));
  report("reload in the same session → no intro", r.attr == null && r.shown === 0 && r.start == null,
    `data-intro=${r.attr}; frames with overlay displayed: ${r.shown}`);
  await ctx.close();

  const n = await fresh(browser);
  const started = await waitStart(n.page).then(() => true, () => false);
  report("new session → intro plays again", started, `overlay shown in a new context: ${started}`);
  await n.ctx.close();
}

if (want("click")) {
  const { ctx, page } = await fresh(browser);
  await waitStart(page);
  const box = await linkBox(page);
  await page.waitForTimeout(1200);
  const t = await sinceStart(page);
  await page.mouse.click(720, 450);
  const s1 = await wrapState(page);
  const nav = await clickNav(page, box);
  await waitGone(page);
  const gone = await page.evaluate(() => Math.round(window.__intro.gone - window.__intro.start));
  report("click dismisses; first nav click after dismissal fires", s1.pe === "none" && nav.fired && gone - t < 450,
    `clicked overlay at +${t}ms → pointer-events ${s1.pe} at once; hidden at +${gone}ms (${gone - t}ms later); "Industries" clicked at +${nav.at}ms (mid-fade) → hash ${nav.hash}`);
  const st = await introStats(page);
  report("after a skip nothing keeps running", st.listeners.length === 0 && st.liveAnimations === 0,
    `intro listeners [${st.listeners}]; live animations ${st.liveAnimations}; canvas ${st.canvas}`);
  await ctx.close();
}

if (want("key")) {
  const { ctx, page } = await fresh(browser);
  await waitStart(page);
  const box = await linkBox(page);
  await page.waitForTimeout(900);
  const t = await sinceStart(page);
  await page.keyboard.press("a");
  const s1 = await wrapState(page);
  const nav = await clickNav(page, box);
  await waitGone(page);
  const gone = await page.evaluate(() => Math.round(window.__intro.gone - window.__intro.start));
  report("any keypress dismisses; first nav click after dismissal fires", s1.pe === "none" && nav.fired && gone - t < 450,
    `pressed "a" at +${t}ms → pointer-events ${s1.pe}; hidden at +${gone}ms; "Industries" clicked at +${nav.at}ms → hash ${nav.hash}`);
  await ctx.close();
}

if (want("dissolve")) {
  const { ctx, page } = await fresh(browser);
  await waitStart(page);
  const box = await linkBox(page);
  await page.waitForFunction(() => getComputedStyle(document.querySelector("[data-intro-wrap]")).pointerEvents === "none", null, { polling: 16, timeout: 8000 });
  const s = await wrapState(page);
  const nav = await clickNav(page, box);
  report("click during the natural dissolve reaches the page", nav.fired && s.display === "flex",
    `overlay still displayed (opacity ${s.opacity.toFixed(2)}) when "Industries" clicked at +${nav.at}ms → hash ${nav.hash}`);
  await ctx.close();
}

if (want("reduced")) {
  const { ctx, page } = await fresh(browser, { reducedMotion: "reduce" });
  await page.waitForTimeout(3000);
  const r = await page.evaluate(() => ({ attr: document.documentElement.getAttribute("data-intro"), shown: window.__intro.samples.length, anims: window.__intro.anims, ctx: window.__intro.contexts }));
  report("prefers-reduced-motion: reduce → no overlay at all", r.attr == null && r.shown === 0 && r.anims === 0 && r.ctx === 0,
    `data-intro=${r.attr}; frames with overlay displayed (sampled every frame from before first paint): ${r.shown}; animations ${r.anims}; GL contexts ${r.ctx}`);
  await ctx.close();
}

if (want("motionoff")) {
  const { ctx, page } = await fresh(browser, {}, PORT + "?motion=off");
  await page.waitForTimeout(3000);
  const r = await page.evaluate(() => ({ attr: document.documentElement.getAttribute("data-intro"), shown: window.__intro.samples.length }));
  report("?motion=off → no overlay", r.attr == null && r.shown === 0, `data-intro=${r.attr}; frames with overlay displayed: ${r.shown}`);
  await ctx.close();
}

await browser.close();
const failed = results.filter(([, ok]) => !ok).length;
console.log(`\n${results.length - failed}/${results.length} passed`);
process.exit(failed ? 1 : 0);
