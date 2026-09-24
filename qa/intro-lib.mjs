// Shared helpers for the intro QA scripts (qa/intro-*.mjs).
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";

export const REF = process.env.REF_URL || "http://127.0.0.1:4100/3264%20Home.dc.html";
export const PORT = process.env.PORT_URL || "http://localhost:3000/";

export function arg(name, dflt) {
  const i = process.argv.indexOf(`--${name}`);
  if (i === -1) return dflt;
  const v = process.argv[i + 1];
  return v === undefined || v.startsWith("--") ? true : v;
}

export async function launch() {
  return chromium.launch({ channel: "chrome" });
}

// Instrumentation injected before any page script. Finds the overlay (port: [data-intro-wrap];
// reference: the fixed z-index:300 div) and records, against a wall clock shared with CDP frame
// timestamps: when it is shown, every caption change, and per-frame overlay/canvas state.
export const PROBE = () => {
  const now = () => performance.timeOrigin + performance.now();
  const S = (window.__intro = { t0: now(), start: null, caps: [], samples: [], gone: null, anims: 0, glStart: null, errors: [] });
  const findWrap = () =>
    document.querySelector("[data-intro-wrap]") ||
    // the reference's <x-dc> holds its un-rendered template markup too; skip that copy
    [...document.querySelectorAll("div")].find((d) => d.style && d.style.zIndex === "300" && !d.closest("x-dc"));
  // count every WAAPI animation started on the overlay subtree (a second intro pass would double it)
  const origAnimate = Element.prototype.animate;
  Element.prototype.animate = function (...a) {
    try { if (S.wrap && S.wrap.contains(this)) S.anims++; } catch {}
    return origAnimate.apply(this, a);
  };
  const origGetContext = HTMLCanvasElement.prototype.getContext;
  S.contexts = 0;
  HTMLCanvasElement.prototype.getContext = function (type, ...rest) {
    const c = origGetContext.call(this, type, ...rest);
    if (/webgl/.test(type) && S.wrap && S.wrap.contains(this)) S.contexts++; // one call per WebGLRenderer
    return c;
  };
  const attach = (wrap) => {
    S.wrap = wrap;
    const cap = wrap.lastElementChild;
    const cv = wrap.querySelector("canvas");
    let lastCap = cap && cap.textContent;
    new MutationObserver(() => {
      const t = cap.textContent;
      if (t !== lastCap) { S.caps.push([now(), t]); lastCap = t; }
    }).observe(cap, { childList: true, characterData: true, subtree: true });
    const tick = () => {
      const cs = getComputedStyle(wrap);
      const shown = cs.display !== "none";
      if (shown && S.start == null && wrap.style.display === "flex") S.start = now();
      if (S.start != null && !shown && S.gone == null) S.gone = now();
      if (cv && S.glStart == null && cv.style.opacity && cv.style.opacity !== "0" && cv.style.opacity !== "0.000") S.glStart = now();
      if (shown || S.start != null) {
        S.samples.push([now(), cs.display, +cs.opacity, cs.pointerEvents, cv ? +(cv.style.opacity || 0) : 0, document.documentElement.getAttribute("data-intro")]);
      }
      if (S.gone == null || now() - S.gone < 500) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const mo = new MutationObserver(() => {
    const w = findWrap();
    if (w) { mo.disconnect(); attach(w); }
  });
  mo.observe(document, { childList: true, subtree: true });
};

export async function newIntroPage(browser, { width = 1440, height = 900, reducedMotion = "no-preference", dpr = 1, javaScriptEnabled = true } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: dpr, reducedMotion, javaScriptEnabled });
  const page = await ctx.newPage();
  const log = [];
  page.on("console", (m) => log.push(`${m.type()}: ${m.text()}`));
  page.on("pageerror", (e) => log.push(`pageerror: ${e}`));
  await page.addInitScript(PROBE);
  return { ctx, page, log };
}

export async function startScreencast(page) {
  const cdp = await page.context().newCDPSession(page);
  const frames = [];
  cdp.on("Page.screencastFrame", async (f) => {
    frames.push({ t: f.metadata.timestamp * 1000, data: f.data });
    try { await cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }); } catch {}
  });
  await cdp.send("Page.startScreencast", { format: "png", everyNthFrame: 1 });
  return { cdp, frames, stop: () => cdp.send("Page.stopScreencast").catch(() => {}) };
}

export function writeFrame(file, b64) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, Buffer.from(b64, "base64"));
}

// Fraction of pixels in a centred box that differ clearly from the page colour (F6F5F2).
export function inkRatio(b64, box = 0.5) {
  const png = PNG.sync.read(Buffer.from(b64, "base64"));
  const { width: W, height: H, data } = png;
  const x0 = Math.floor(W * (1 - box) / 2), x1 = Math.floor(W * (1 + box) / 2);
  const y0 = Math.floor(H * (1 - box) / 2), y1 = Math.floor(H * (1 + box) / 2);
  let n = 0, ink = 0;
  for (let y = y0; y < y1; y += 2) for (let x = x0; x < x1; x += 2) {
    const i = (y * W + x) * 4;
    const d = Math.abs(data[i] - 0xf6) + Math.abs(data[i + 1] - 0xf5) + Math.abs(data[i + 2] - 0xf2);
    n++; if (d > 60) ink++;
  }
  return ink / n;
}
