#!/usr/bin/env node
// Playbooks motion (MOTION.md M1–M5, VISUAL_QA.md manual checks 1–3), on the port:
//   carousel: 7s dwell, 700ms track move, hover / keyboard-focus / pause holds, click on a
//             peeking slide, wrap-around, keys, swipe, resize without animation, off-screen
//             suspend, inert inactive slides, and no React commit per animation frame;
//   hero:     source choice, 500ms fade, boomerang duration, eased rate at the turns, the loop,
//             off-screen pause;
//   reduced motion: no video fetched or played, poster shown, no autoplay, active segment full.
//
//   node qa/pb-motion.mjs

import { PORT, launch } from "./pb-lib.mjs";

// Counts React commits: React reports each one to the devtools hook if one is installed.
const COMMIT_COUNTER = () => {
  window.__commits = 0;
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
    supportsFiber: true, isDisabled: false, renderers: new Map(),
    inject() { return 1; }, checkDCE() {}, onScheduleFiberRoot() {}, onCommitFiberUnmount() {}, onPostCommitFiberRoot() {},
    onCommitFiberRoot() { window.__commits++; },
  };
};

const ok = (b) => (b ? "ok " : "FAIL");
const browser = await launch();

async function page(w, h, opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: "no-preference", ...opts });
  await ctx.addInitScript(COMMIT_COUNTER);
  const p = await ctx.newPage();
  await p.goto(PORT, { waitUntil: "networkidle", timeout: 90000 });
  await p.evaluate(() => document.fonts.ready);
  return { ctx, p };
}

const state = (p) => p.evaluate(() => {
  const track = document.querySelector('[data-screen-label="Featured"] [data-slide]').parentElement;
  const slides = [...track.children];
  const active = slides.findIndex((s) => s.style.opacity === "1");
  const fills = [...document.querySelectorAll("[data-seg-fill]")].map((f) => parseFloat(f.style.width) || 0);
  return { active, fills, transform: track.style.transform, transition: getComputedStyle(track).transition, pad: track.style.paddingLeft, w: slides[0].style.width };
});

try {
  /* ---------------------------------------------------------------- carousel */
  {
    const { ctx, p } = await page(1440, 900);
    const featured = p.locator('[data-screen-label="Featured"]');
    await featured.scrollIntoViewIfNeeded();
    await p.mouse.move(5, 5);
    await p.waitForTimeout(300);
    const s0 = await state(p);
    await p.waitForTimeout(1000);
    const s1 = await state(p);
    const rate = s1.fills[0] - s0.fills[0];
    console.log(`${ok(Math.abs(rate - 14.3) < 2.5)} dwell: fill grows ${rate.toFixed(1)}%/s (7s dwell = 14.3%/s); track ${s0.transition}`);
    console.log(`${ok(parseFloat(s0.pad) === 120 && parseFloat(s0.w) === 1200)} geometry @1440: padding-left ${s0.pad}, slide ${s0.w}`);

    const c0 = await p.evaluate(() => window.__commits);
    await p.waitForTimeout(2000);
    const c1 = await p.evaluate(() => window.__commits);
    console.log(`${ok(c1 === c0)} React commits during 2s of animation: ${c1 - c0}`);

    // wait out the dwell
    await p.waitForFunction(() => document.querySelectorAll("[data-slide]")[1].style.opacity === "1", null, { timeout: 9000 });
    const s2 = await state(p);
    console.log(`${ok(s2.active === 1 && /translateX\(-1224(\.0)?px\)/.test(s2.transform))} auto-advance: slide ${s2.active + 1}, ${s2.transform}; fills ${s2.fills.map((f) => f.toFixed(0)).join(",")}`);

    // hover hold
    const box = await p.locator('[data-screen-label="Featured"] > div').first().boundingBox();
    await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await p.waitForTimeout(200);
    const h0 = await state(p); await p.waitForTimeout(1000); const h1 = await state(p);
    await p.mouse.move(5, 5);
    await p.waitForTimeout(600);
    const h2 = await state(p);
    console.log(`${ok(h0.fills[1] === h1.fills[1] && h2.fills[1] > h1.fills[1])} hover hold: ${h0.fills[1].toFixed(1)} -> ${h1.fills[1].toFixed(1)} held, resumes to ${h2.fills[1].toFixed(1)}`);

    // click a peeking slide (the next one, on the right): activates, does not navigate
    const url = p.url();
    await p.mouse.click(1400, box.y + 200);
    await p.waitForTimeout(800);
    const s3 = await state(p);
    console.log(`${ok(s3.active === 2 && p.url() === url)} click peeking slide: slide ${s3.active + 1}, url unchanged ${p.url() === url}`);

    // wrap-around
    const prev = p.getByRole("button", { name: "Previous playbook" }), next = p.getByRole("button", { name: "Next playbook" });
    await p.getByRole("button", { name: "Show Covenant Watch" }).click();
    await prev.click(); const w1 = (await state(p)).active;
    await next.click(); const w2 = (await state(p)).active;
    console.log(`${ok(w1 === 5 && w2 === 0)} wrap: ← from 1 gives ${w1 + 1}, → from 6 gives ${w2 + 1}`);

    // inert: only the active slide's link is reachable
    const inert = await p.evaluate(() => [...document.querySelectorAll("[data-slide]")].map((s) => [s.getAttribute("aria-hidden"), [...s.children].every((c) => c.inert)]));
    const reachable = await p.evaluate(() => [...document.querySelectorAll("[data-slide] a")].filter((a) => !a.closest("[inert]")).map((a) => a.textContent));
    console.log(`${ok(inert[0][0] === "false" && !inert[0][1] && inert.slice(1).every(([h, i]) => h === "true" && i) && reachable.length === 1)} inactive slides aria-hidden + inert children; reachable links: ${JSON.stringify(reachable)}`);

    // pause toggle
    const pause = p.getByRole("button", { name: "Pause carousel" });
    await pause.click();
    await p.mouse.move(5, 5);
    const q0 = await state(p); await p.waitForTimeout(900); const q1 = await state(p);
    const playLabel = await p.getByRole("button", { name: "Play carousel" }).count();
    await p.getByRole("button", { name: "Play carousel" }).click();
    await p.mouse.move(5, 5);
    await p.waitForTimeout(600);
    const q2 = await state(p);
    console.log(`${ok(q0.fills[0] === q1.fills[0] && playLabel === 1 && q2.fills[0] > q1.fills[0])} pause toggle: held ${q0.fills[0].toFixed(1)} -> ${q1.fills[0].toFixed(1)}, label flips, resumes ${q2.fills[0].toFixed(1)}`);

    // keys from the segments; keyboard focus holds
    await p.getByRole("button", { name: "Show Covenant Watch" }).focus();
    await p.keyboard.press("ArrowRight");
    const k1 = await state(p);
    const focused = await p.evaluate(() => document.activeElement?.getAttribute("aria-label"));
    await p.keyboard.press("Tab"); await p.keyboard.press("Shift+Tab"); // make it :focus-visible
    const f0 = await state(p); await p.waitForTimeout(900); const f1 = await state(p);
    console.log(`${ok(k1.active === 1 && focused === "Show NAV Pack Review")} ArrowRight on a segment: slide ${k1.active + 1}, focus "${focused}"`);
    console.log(`${ok(f0.fills[k1.active] === f1.fills[k1.active])} keyboard focus in controls holds: ${f0.fills[k1.active].toFixed(1)} -> ${f1.fills[k1.active].toFixed(1)}`);
    await p.evaluate(() => document.activeElement.blur());

    // resize: no animated slide
    await p.setViewportSize({ width: 1100, height: 900 });
    await p.waitForTimeout(60);
    const r = await state(p);
    const tr = await p.evaluate(() => { const t = document.querySelector("[data-slide]").parentElement; return new DOMMatrix(getComputedStyle(t).transform).m41; });
    console.log(`${ok(parseFloat(r.w) === 1020 && Math.abs(tr - -(1020 + 24) * r.active) < 1)} resize to 1100: slide ${r.w}, rendered x ${tr.toFixed(1)} = −${r.active}×1044 at once`);
    await p.setViewportSize({ width: 1440, height: 900 });

    // off-screen suspend
    await p.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
    await p.waitForTimeout(300);
    const o0 = await state(p); await p.waitForTimeout(1500); const o1 = await state(p);
    await featured.scrollIntoViewIfNeeded(); await p.mouse.move(5, 5); await p.waitForTimeout(700);
    const o2 = await state(p);
    console.log(`${ok(o0.fills[o0.active] === o1.fills[o1.active] && o2.fills[o2.active] > o1.fills[o1.active])} off screen: held ${o0.fills[o0.active].toFixed(1)} -> ${o1.fills[o1.active].toFixed(1)}, resumes ${o2.fills[o2.active].toFixed(1)}`);
    await ctx.close();
  }

  /* ------------------------------------------------------------------- swipe */
  {
    const { ctx, p } = await page(390, 844, { hasTouch: true, isMobile: true });
    await p.locator('[data-screen-label="Featured"]').scrollIntoViewIfNeeded();
    const box = await p.locator('[data-screen-label="Featured"] > div').first().boundingBox();
    const cdp = await ctx.newCDPSession(p);
    const swipe = async (x0, x1, y) => {
      await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: x0, y }] });
      for (let i = 1; i <= 6; i++) await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x0 + ((x1 - x0) * i) / 6, y }] });
      await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
      await p.waitForTimeout(800);
    };
    const y = box.y + 120;
    await swipe(300, 120, y); const a = (await state(p)).active;
    await swipe(120, 300, y); const b = (await state(p)).active;
    await swipe(200, 180, y); const c = (await state(p)).active;
    console.log(`${ok(a === 1 && b === 0 && c === 0)} swipe @390: left -> slide ${a + 1}, right -> slide ${b + 1}, 20px nudge -> slide ${c + 1} (below the 40px threshold)`);
    await ctx.close();
  }

  /* -------------------------------------------------------------------- hero */
  {
    const { ctx, p } = await page(1440, 900);
    await p.waitForFunction(() => { const v = document.querySelector("[data-hero-video]"); return v && v.style.opacity === "1" && !v.paused; }, null, { timeout: 20000 });
    const v = await p.evaluate(() => { const v = document.querySelector("[data-hero-video]"); return { src: v.currentSrc.replace(location.origin, ""), d: v.duration, t: v.style.transition, rate: v.playbackRate, muted: v.muted, hidden: v.getAttribute("aria-hidden") }; });
    console.log(`${ok(v.src === "/video/playbooks-hero.mp4" && Math.abs(v.d - 26) < 0.05 && v.t.includes("500ms linear") && v.muted)} hero @1440: ${v.src}, ${v.d.toFixed(2)}s boomerang, fade "${v.t}", muted ${v.muted}, aria-hidden ${v.hidden}`);
    const rateAt = async (t) => {
      await p.evaluate((t) => { document.querySelector("[data-hero-video]").currentTime = t; }, t);
      await p.waitForTimeout(250);
      return p.evaluate(() => { const v = document.querySelector("[data-hero-video]"); return [v.currentTime, v.playbackRate]; });
    };
    const mid = await rateAt(6.5);
    const turn = await rateAt(12.95);
    const end = await rateAt(25.93);
    await p.waitForTimeout(700);
    const looped = await p.evaluate(() => document.querySelector("[data-hero-video]").currentTime);
    console.log(`${ok(mid[1] === 1 && turn[1] <= 0.45 && end[1] <= 0.45)} eased turns: rate ${mid[1]} mid-run (t ${mid[0].toFixed(2)}), ${turn[1]} at the first turn (t ${turn[0].toFixed(2)}), ${end[1]} into the loop point (t ${end[0].toFixed(2)})`);
    console.log(`${ok(looped < 2)} loops: t ${looped.toFixed(2)} after crossing 26.0s`);
    await p.evaluate(() => scrollTo(0, 3000));
    await p.waitForTimeout(400);
    const off = await p.evaluate(() => document.querySelector("[data-hero-video]").paused);
    await p.evaluate(() => scrollTo(0, 0));
    await p.waitForTimeout(600);
    const on = await p.evaluate(() => document.querySelector("[data-hero-video]").paused);
    console.log(`${ok(off && !on)} off-screen pause: paused ${off} when scrolled away, playing again ${!on}`);
    await ctx.close();

    const m = await page(390, 844, { isMobile: true, hasTouch: true });
    await m.p.waitForFunction(() => document.querySelector("[data-hero-video]")?.currentSrc, null, { timeout: 20000 });
    const ms = await m.p.evaluate(() => document.querySelector("[data-hero-video]").currentSrc.replace(location.origin, ""));
    console.log(`${ok(ms === "/video/playbooks-hero-960.mp4")} hero @390 picks ${ms}`);
    await m.ctx.close();
  }

  /* ---------------------------------------------------------- reduced motion */
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
    const p = await ctx.newPage();
    const videoRequests = [];
    p.on("request", (r) => { if (r.url().includes("/video/")) videoRequests.push(r.url()); });
    await p.goto(PORT, { waitUntil: "networkidle" });
    await p.waitForTimeout(1200);
    const v = await p.evaluate(() => { const v = document.querySelector("[data-hero-video]"); return { op: v.style.opacity, paused: v.paused, sources: v.querySelectorAll("source").length, poster: !!v.poster }; });
    await p.locator('[data-screen-label="Featured"]').scrollIntoViewIfNeeded();
    const s0 = await state(p); await p.waitForTimeout(1500); const s1 = await state(p);
    const pauseShown = await p.getByRole("button", { name: "Pause carousel" }).isVisible();
    console.log(`${ok(v.op === "1" && v.paused && v.sources === 0 && videoRequests.length === 0)} reduced motion hero: poster at opacity ${v.op}, paused ${v.paused}, sources ${v.sources}, video requests ${videoRequests.length}`);
    console.log(`${ok(s0.fills[0] === 100 && s1.active === 0 && !pauseShown)} reduced motion carousel: active fill ${s0.fills[0]}%, still on slide ${s1.active + 1}, pause toggle hidden ${!pauseShown}`);
    await ctx.close();
  }
} finally {
  await browser.close();
}
