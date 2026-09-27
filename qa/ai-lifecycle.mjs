#!/usr/bin/env node
// AI Engineering lifecycle: the page's three rAF loops (page logic, 03–05 canvas, 03 build),
// its window listeners and window.__rbCtl must exist exactly once while the page is mounted
// (Strict Mode's double mount included) and be gone after a client-side navigation away,
// with a clean console throughout.
//
//   node qa/ai-lifecycle.mjs [--base http://localhost:3000]

import { arg, launch } from "./ai-lib.mjs";

const BASE = arg("base", "http://localhost:3000");

// Count rAF callbacks per frame and live window listeners by type.
const INSTRUMENT = () => {
  const raf = window.requestAnimationFrame.bind(window), caf = window.cancelAnimationFrame.bind(window);
  const pending = new Set();
  window.__rafPerFrame = 0;
  window.requestAnimationFrame = (cb) => { const id = raf((t) => { pending.delete(id); cb(t); }); pending.add(id); return id; };
  window.cancelAnimationFrame = (id) => { pending.delete(id); return caf(id); };
  const sample = () => { window.__rafPerFrame = pending.size; raf(sample); };
  raf(sample);
  const live = new Map();
  const add = window.addEventListener.bind(window), rem = window.removeEventListener.bind(window);
  const key = (t, f, o) => t + ":" + (typeof o === "object" ? !!o.capture : !!o);
  window.addEventListener = (t, f, o) => { const k = key(t, f, o); if (!live.has(k)) live.set(k, new Set()); live.get(k).add(f); return add(t, f, o); };
  window.removeEventListener = (t, f, o) => { const s = live.get(key(t, f, o)); if (s) s.delete(f); return rem(t, f, o); };
  window.__listeners = (types) => Object.fromEntries(types.map((t) => [t, (live.get(t + ":false")?.size || 0) + (live.get(t + ":true")?.size || 0)]));
};

const browser = await launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.addInitScript(INSTRUMENT);
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") errors.push(m.type() + ": " + m.text().slice(0, 200)); });

const state = async (label) => {
  await page.waitForTimeout(700);
  const s = await page.evaluate(() => ({
    path: location.pathname,
    raf: window.__rafPerFrame,
    rbCtl: window.__rbCtl === undefined ? "undefined" : window.__rbCtl === null ? "null" : "set",
    canvases: document.querySelectorAll("[data-svg='2a']").length,
    listeners: window.__listeners(["wheel", "touchmove", "touchstart", "keydown", "hashchange"]),
  }));
  console.log(`${label.padEnd(34)} ${s.path.padEnd(28)} rAF/frame ${s.raf}  __rbCtl ${s.rbCtl}  03 hosts ${s.canvases}  listeners ${JSON.stringify(s.listeners)}`);
};

await page.goto(`${BASE}/ai-engineering?intro=off`, { waitUntil: "networkidle" });
await state("load /ai-engineering");
await page.click("header a[href='/']");
await page.waitForURL(`${BASE}/`);
await state("client nav → home (wordmark)");
await page.goBack();
await page.waitForURL(/ai-engineering/);
await page.waitForTimeout(5200); // the intro plays on a client-side visit; let it finish
await state("back → /ai-engineering");
await page.click("footer a[href='/industries/private-credit']");
await page.waitForURL(/private-credit/);
await state("client nav → private credit");
await page.goBack();
await page.waitForURL(/ai-engineering/);
await page.waitForTimeout(5200);
await state("back → /ai-engineering");
console.log(errors.length ? "console:\n  " + errors.join("\n  ") : "console clean");
await browser.close();
