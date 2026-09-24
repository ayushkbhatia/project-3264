#!/usr/bin/env node
// Layout shift when PlatformSequence mounts over the server-rendered state: reload mid-sequence
// (scroll restoration puts the pin on screen before hydration) and deep-link past the section.
//   node qa/capabilities-cls.mjs
import { chromium } from "@playwright/test";
const INIT = () => {
  window.__shifts = [];
  new PerformanceObserver((l) => l.getEntries().forEach((e) => { if (!e.hadRecentInput) window.__shifts.push({ v: +e.value.toFixed(4), t: Math.round(e.startTime),
    src: (e.sources || []).map((s) => (s.node && s.node.nodeType === 1 ? s.node.tagName + (s.node.id ? "#" + s.node.id : "") : "?") + " dy=" + Math.round(s.currentRect.y - s.previousRect.y) + " dh=" + Math.round(s.currentRect.height - s.previousRect.height)).slice(0, 4) }); }))
    .observe({ type: "layout-shift", buffered: true });
};
const browser = await chromium.launch({ channel: "chrome" });
for (const [w, h] of [[1440, 900], [1280, 800], [1920, 1080], [834, 1112], [900, 900]]) {
  for (const mode of ["reload@p0.5", "#industries"]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h } });
    const page = await ctx.newPage();
    await page.addInitScript(INIT);
    if (mode === "#industries") await page.goto("http://localhost:3000/#industries", { waitUntil: "networkidle" });
    else {
      await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
      await page.evaluate(() => { const t = document.querySelector("#capabilities > div:nth-child(2)"); const top = t.getBoundingClientRect().top + scrollY;
        scrollTo(0, top + 0.5 * (t.offsetHeight - (innerHeight - 69))); });
      await page.waitForTimeout(300);
      await page.reload({ waitUntil: "networkidle" });
    }
    await page.waitForTimeout(1500);
    const r = await page.evaluate(() => ({ shifts: window.__shifts, industriesTop: Math.round(document.querySelector("#industries").getBoundingClientRect().top) }));
    const cls = r.shifts.reduce((a, s) => a + s.v, 0);
    console.log(`@${w}x${h} ${mode.padEnd(12)} CLS ${cls.toFixed(4)}${mode === "#industries" ? `  (#industries top now ${r.industriesTop}px)` : ""}  ${r.shifts.map((s) => `${s.v}@${s.t}ms [${s.src.join(", ")}]`).join(" ; ")}`);
    await ctx.close();
  }
}
await browser.close();
