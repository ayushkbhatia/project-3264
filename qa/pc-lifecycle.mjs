#!/usr/bin/env node
// Private Credit lifecycle checks on the dev server (React Strict Mode):
//   * window.__dcErrs undefined after scrolling top -> bottom -> top
//   * one instance, one rAF loop, one watchdog interval, one set of scroll listeners
//   * client-side navigation away (to Home) and back: no leaked loops, intervals or listeners
//   * copy: the page's visible text equals the reference's at the top, at mid-scroll points
import { chromium } from "@playwright/test";

const PORT = "http://localhost:3000/industries/private-credit?intro=off&t=16";
const REF = "http://127.0.0.1:4101/Private%20Credit.dc.html?intro=off&t=16";

const INSTRUMENT = () => {
  const counts = { raf: new Map(), scroll: 0, intervals: new Set() };
  window.__qa = counts;
  const raf = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = (cb) => {
    const k = cb.toString().slice(0, 80);
    counts.raf.set(k, (counts.raf.get(k) || 0) + 1);
    return raf(cb);
  };
  const add = window.addEventListener.bind(window), rem = window.removeEventListener.bind(window);
  window.addEventListener = (t, f, o) => { if (t === "scroll") counts.scroll++; return add(t, f, o); };
  window.removeEventListener = (t, f, o) => { if (t === "scroll") counts.scroll--; return rem(t, f, o); };
  const si = window.setInterval.bind(window), ci = window.clearInterval.bind(window);
  window.setInterval = (f, ms, ...a) => { const id = si(f, ms, ...a); counts.intervals.add(id + ":" + ms); return id; };
  window.clearInterval = (id) => { for (const k of counts.intervals) if (k.startsWith(id + ":")) counts.intervals.delete(k); return ci(id); };
};

async function loopStats(page) {
  return page.evaluate(async () => {
    const q = window.__qa;
    q.raf.clear();
    await new Promise((r) => setTimeout(r, 1000));
    const loops = [...q.raf.entries()].filter(([, n]) => n > 20).map(([k, n]) => `${n}x ${k.replace(/\s+/g, " ").slice(0, 50)}`);
    return { loops, scroll: q.scroll, intervals: [...q.intervals].map((k) => k.split(":")[1]).sort(), live: !!window.__pcLive, watch: window.__pcWatch, errs: window.__dcErrs || null };
  });
}

const text = (page) => page.evaluate(() => document.body.innerText.replace(/\s+/g, " ").trim());

const browser = await chromium.launch({ channel: "chrome" });
try {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(INSTRUMENT);
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => { if (["error", "warning"].includes(m.type())) errors.push(m.type() + ": " + m.text().slice(0, 200)); });
  await page.goto(PORT, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  console.log("after mount:", JSON.stringify(await loopStats(page)));

  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= H; y += 700) { await page.evaluate((y) => scrollTo(0, y), y); await page.waitForTimeout(60); }
  for (let y = H; y >= 0; y -= 1400) { await page.evaluate((y) => scrollTo(0, y), y); await page.waitForTimeout(40); }
  await page.waitForTimeout(900);
  console.log("after full scroll down+up:", JSON.stringify(await loopStats(page)));

  // client navigation: the header wordmark goes Home (next/link), then back
  await page.locator("header a").first().click();
  await page.waitForURL((u) => u.pathname === "/");
  await page.waitForTimeout(1200);
  console.log("on Home after client nav:", JSON.stringify(await loopStats(page)));
  await page.goBack();
  await page.waitForURL((u) => u.pathname.includes("private-credit"));
  await page.waitForTimeout(1500);
  const back = await loopStats(page);
  const dom = await page.evaluate(() => ({
    tiles: document.querySelector("#origination [style*='top: 172px']")?.children.length,
    serv: document.querySelector("#servicing [style*='grid']")?.children.length,
  }));
  console.log("back on Private Credit:", JSON.stringify(back), JSON.stringify(dom));
  console.log("console:", errors.length ? errors.slice(0, 8).join("\n  ") : "clean");
  await ctx.close();

  // copy diff at the top of the page (static markup + module text at t=16)
  const a = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const b = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await a.goto(REF, { waitUntil: "networkidle" });
  await b.goto(PORT, { waitUntil: "networkidle" });
  await a.waitForTimeout(1500); await b.waitForTimeout(1500);
  const [ta, tb] = [await text(a), await text(b)];
  if (ta === tb) console.log(`copy: identical (${ta.length} chars)`);
  else {
    let i = 0; while (ta[i] === tb[i]) i++;
    console.log(`copy differs at ${i}:\n  ref : …${ta.slice(Math.max(0, i - 80), i + 120)}\n  port: …${tb.slice(Math.max(0, i - 80), i + 120)}`);
  }
} finally {
  await browser.close();
}
