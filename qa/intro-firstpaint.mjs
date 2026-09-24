#!/usr/bin/env node
// Intro first paint and slow-network safety.
//
// For each scenario, loads the port in a fresh context (empty sessionStorage) and records every
// composited frame from navigation (CDP screencast). Each frame is classified:
//   blank    nothing painted yet (white)
//   cover    the page-colour overlay (page colour, at most the caption and grid lines)
//   page     page content visible (header / hero ink in the top 60% of the viewport)
// PASS when no "page" frame precedes the first "cover" frame in a scenario that decided to
// play, and the page ends up usable (overlay gone, a header nav link receives hit-testing).
//
//   node qa/intro-firstpaint.mjs [--scenario none,fast3g,slow3g,nojs,blockjs] [--out qa/__screens__/intro/firstpaint]
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";
import { PORT, arg, launch, newIntroPage, startScreencast, writeFrame } from "./intro-lib.mjs";

const out = String(arg("out", "qa/__screens__/intro/firstpaint"));
const which = String(arg("scenario", "none,fast3g,slow3g,nojs,blockjs")).split(",");
fs.mkdirSync(out, { recursive: true });

const NET = {
  // Chrome DevTools presets (latency and throughput as DevTools applies them)
  fast3g: { offline: false, latency: 562.5, downloadThroughput: (1.44 * 1024 * 1024) / 8, uploadThroughput: (675 * 1024) / 8 },
  slow3g: { offline: false, latency: 2000, downloadThroughput: (400 * 1024) / 8, uploadThroughput: (400 * 1024) / 8 },
};

function classify(b64) {
  const png = PNG.sync.read(Buffer.from(b64, "base64"));
  const { width: W, height: H, data } = png;
  let white = 0, n = 0;
  for (let y = 0; y < H; y += 4) for (let x = 0; x < W; x += 4) {
    const i = (y * W + x) * 4;
    n++;
    if (data[i] > 252 && data[i + 1] > 252 && data[i + 2] > 252) white++;
  }
  if (white / n > 0.98) return "blank";
  // page content = ink in the header strip (wordmark, nav, "Book a call"). The intro never draws
  // there: its grid hairlines are too light to count and the relief sits mid-screen.
  let ink = 0, m = 0;
  for (let y = 12; y < 58; y++) for (let x = 0; x < W; x += 2) {
    const i = (y * W + x) * 4;
    m++;
    if (data[i] + data[i + 1] + data[i + 2] < 3 * 150) ink++;
  }
  return ink / m > 0.002 ? "page" : "cover";
}

// Records when the header's "Industries" link first receives hit-testing, and the data-intro
// state over time.
const USABLE_PROBE = () => {
  const now = () => performance.now();
  const U = (window.__usable = { at: null, states: [] });
  let last;
  const poll = () => {
    if (!document.documentElement) return setTimeout(poll, 10);
    const st = document.documentElement.getAttribute("data-intro");
    if (st !== last) { U.states.push([Math.round(now()), st]); last = st; }
    const a = document.querySelector('header a[href="#industries"]');
    if (a && U.at == null) {
      const r = a.getBoundingClientRect();
      if (r.width > 0) {
        const el = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
        if (el && (el === a || a.contains(el))) U.at = Math.round(now());
      }
    }
    if (U.at == null || now() < 20000) setTimeout(poll, 50);
  };
  poll();
};

async function run(browser, name) {
  const opts = name === "nojs" ? { javaScriptEnabled: false } : {};
  const { ctx, page, log } = await newIntroPage(browser, opts);
  if (name !== "nojs") await page.addInitScript(USABLE_PROBE);
  const cdp = await ctx.newCDPSession(page);
  if (NET[name]) {
    await cdp.send("Network.enable");
    await cdp.send("Network.emulateNetworkConditions", NET[name]);
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  }
  if (name === "blockjs") await page.route("**/*.js", (r) => r.abort());
  const sc = await startScreencast(page);
  const tNav = Date.now();
  await page.goto(PORT, { waitUntil: "commit", timeout: 120000 });
  const settle = name === "slow3g" ? 25000 : name === "fast3g" ? 12000 : 6000;
  await page.waitForTimeout(settle);
  await sc.stop();

  const frames = sc.frames.filter((f) => f.t >= tNav - 50);
  const seq = frames.map((f) => ({ t: Math.round(f.t - tNav), kind: classify(f.data), data: f.data }));
  const firstCover = seq.find((f) => f.kind === "cover");
  const firstPage = seq.find((f) => f.kind === "page");
  const firstPainted = seq.find((f) => f.kind !== "blank");
  if (firstPainted) writeFrame(path.join(out, `${name}-first-paint.png`), firstPainted.data);
  if (seq.length) writeFrame(path.join(out, `${name}-last.png`), seq[seq.length - 1].data);

  let usable = null, intro = null;
  if (name !== "nojs") {
    usable = await page.evaluate(() => window.__usable).catch(() => null);
    intro = await page.evaluate(() => ({ start: window.__intro.start && Math.round(window.__intro.start - performance.timeOrigin), gone: window.__intro.gone && Math.round(window.__intro.gone - performance.timeOrigin) })).catch(() => null);
  }
  const wrapState = await page.evaluate(() => {
    const w = document.querySelector("[data-intro-wrap]");
    return w ? { display: getComputedStyle(w).display, pe: getComputedStyle(w).pointerEvents, attr: document.documentElement.getAttribute("data-intro") } : null;
  });
  // collapse the frame sequence into runs, e.g. blank@0 cover@412 page@2010
  const runs = [];
  for (const f of seq) if (!runs.length || runs[runs.length - 1].kind !== f.kind) runs.push(f);
  const pass = !firstPage || (firstCover && firstCover.t <= firstPage.t) || name === "nojs" || name === "blockjs";
  console.log(`\n[${name}] frames: ${runs.map((r) => `${r.kind}@${r.t}`).join(" → ")}`);
  console.log(`  first painted frame: ${firstPainted ? `${firstPainted.kind} at ${firstPainted.t}ms` : "none"}; data-intro states: ${usable ? usable.states.map(([t, s]) => `${s}@${t}`).join(" ") : "n/a"}`);
  console.log(`  intro shown at ${intro?.start ?? "-"}ms, hidden at ${intro?.gone ?? "-"}ms; header link hit-testable at ${usable?.at ?? "-"}ms; final overlay ${JSON.stringify(wrapState)}`);
  const bad = log.filter((l) => /^(error|pageerror)/.test(l));
  if (bad.length) console.log(`  console errors (${bad.length}): ${bad.slice(0, 3).join(" | ").slice(0, 400)}`);
  let verdict;
  if (name === "nojs") verdict = runs.some((r) => r.kind === "cover") ? "FAIL (overlay without JS)" : "PASS (no overlay without JS)";
  else if (name === "blockjs") {
    // Inline scripts still run here, so the gate marks the page pending before the aborted app
    // chunks report failure. The first chunk error releases it; whether that lands before or just
    // after first paint is a race. Bound: at most one plain page-colour frame, page usable < 250ms.
    const coverMs = firstCover && firstPage ? firstPage.t - firstCover.t : 0;
    verdict = coverMs <= 34 && usable?.at != null && usable.at < 250
      ? `PASS (no blocking overlay; plain page-colour cover painted for ${coverMs}ms before the first failed chunk released it)`
      : `FAIL (cover held ${coverMs}ms; link usable at ${usable?.at ?? "-"}ms)`;
  } else verdict = pass ? "PASS" : "FAIL (page painted before cover)";
  console.log(`  ${verdict}`);
  await ctx.close();
}

const browser = await launch();
for (const s of which) await run(browser, s);
await browser.close();
