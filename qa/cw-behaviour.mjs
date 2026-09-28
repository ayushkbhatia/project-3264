#!/usr/bin/env node
// Covenant Watch behaviour (README, "Interactions & behaviour"), port against the reference:
//   1. scroll-spy: active entry, active 05 subsection, rail height and progress bar at every
//      400px of scroll, at 1440 (sidebar) and 390 (the phone bar's label)
//   2. anchors: every contents link lands its target 120px below the viewport top
//   3. FAQ: independent toggles, first open, aria-expanded; section height after each toggle
//   4. copy link: clipboard, "Link copied" for 1.8s
//   5. phone bar: opens, closes on an entry, on Escape (focus returns) and on an outside click
//   6. evidence line: hovering a row highlights its segment and inks its label
//   7. hero reveal (motion on): held from the first frame, then ring / values / card in turn
//
//   PORT_URL=… node qa/cw-behaviour.mjs

import { REF, PORT, launch, open, settle } from "./cw-lib.mjs";

const ok = (b) => (b ? "ok  " : "FAIL");
let fails = 0;
const check = (b, msg) => {
  if (!b) fails++;
  console.log(`${ok(b)} ${msg}`);
};

const only = process.argv.includes("--only") ? process.argv[process.argv.indexOf("--only") + 1].split(",") : null;
const want = (k) => !only || only.includes(k);

const browser = await launch();

/** The reference's and the port's scroll-spy state, read the same way from each DOM. */
async function spyState(p, isRef) {
  return p.evaluate((isRef) => {
    const aside = document.querySelector("aside");
    const shown = aside && getComputedStyle(aside).display !== "none";
    const links = shown ? [...aside.querySelectorAll("nav a")] : [];
    const top = links.filter((a) => !a.parentElement.matches("div.grid, div[style*='grid']"));
    const isActive = (a) =>
      isRef ? getComputedStyle(a).backgroundColor === "rgb(238, 235, 228)" : a.getAttribute("aria-current") === "true" && a.closest("[data-toc]")?.firstElementChild === a;
    const active = top.find(isActive)?.textContent.trim() ?? null;
    const subs = links.filter((a) => a.style.borderLeft || a.className.includes("border-l"));
    const sub = subs.find((a) => getComputedStyle(a).borderLeftColor === "rgb(26, 25, 23)")?.textContent.trim() ?? null;
    const rail = shown ? aside.querySelector("nav > span:nth-child(2)") : null;
    const bar = isRef ? document.querySelector("header > div[aria-hidden]") : document.querySelector("[data-reading-progress]");
    const m = /scaleX\(([\d.]+)\)/.exec(bar?.style.transform ?? "");
    const phone = [...document.querySelectorAll("button")].find((b) => b.textContent.trim().startsWith("On this page"));
    return {
      active,
      sub,
      rail: rail ? parseFloat(rail.style.height) || 0 : null,
      progress: m ? +m[1] : null,
      phone: phone && getComputedStyle(phone).display !== "none" && phone.offsetParent ? phone.children[1].textContent.trim() : null,
      // the page's own measure, for when the two documents differ in height (the site footer)
      expected: +(Math.min(1, Math.max(0, scrollY / (document.documentElement.scrollHeight - innerHeight)))).toFixed(4),
    };
  }, isRef);
}

async function scrollAndWait(p, y) {
  await p.evaluate((y) => window.scrollTo(0, y), y);
  await p.waitForTimeout(260); // rAF, then the rail's 200ms transition
}

try {
  // 1. scroll-spy
  if (want("spy")) for (const [w, h] of [[1440, 900], [390, 844]]) {
    const ref = await open(browser, REF, w, h);
    const port = await open(browser, PORT, w, h);
    await settle(ref.page);
    const H = await port.page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
    const [hr, hp] = await Promise.all([ref.page, port.page].map((p) => p.evaluate(() => document.documentElement.scrollHeight)));
    const sameHeight = hr === hp;
    let mism = 0, n = 0, railMax = 0, progMax = 0;
    for (let y = 0; y <= H + 400; y += 400) {
      const yy = Math.min(y, H);
      await Promise.all([scrollAndWait(ref.page, yy), scrollAndWait(port.page, yy)]);
      const [a, b] = await Promise.all([spyState(ref.page, true), spyState(port.page, false)]);
      n++;
      const same = a.active === b.active && a.sub === b.sub && a.phone === b.phone;
      if (!same) {
        mism++;
        if (mism <= 5) console.log(`     @${w} y=${yy}: ref ${JSON.stringify(a)} port ${JSON.stringify(b)}`);
      }
      if (a.rail !== null) railMax = Math.max(railMax, Math.abs(a.rail - b.rail));
      // Same document height: the bars must agree. Otherwise (below 560px the site footer is
      // shorter than the reference's), each bar must match its own page's scroll share.
      progMax = Math.max(progMax, sameHeight ? Math.abs((a.progress ?? 0) - (b.progress ?? 0)) : Math.abs((b.progress ?? 0) - b.expected));
    }
    check(mism === 0, `@${w} scroll-spy: ${n} positions, ${mism} mismatches (active entry, 05 subsection${w < 1048 ? ", phone bar label" : ""})`);
    if (w >= 1048) check(railMax < 1.5, `@${w} coverage rail: max difference ${railMax.toFixed(2)}px`);
    check(progMax < 0.002, `@${w} progress bar: max difference ${progMax.toFixed(4)}`);
    const end = await spyState(port.page, false);
    check(end.progress === 1, `@${w} progress bar full at the bottom (${end.progress})`);
    await ref.ctx.close();
    await port.ctx.close();
  }

  // 2. anchors land 120px below the top (reduced motion: instant)
  if (want("anchors")) for (const [w, h] of [[1440, 900], [390, 844]]) {
    const port = await open(browser, PORT, w, h);
    const ids = ["today", "breaks", "runs", "evidence", "built", "built-harness", "built-data", "built-hard", "built-evals", "built-controls", "rules", "terms", "updated", "questions"];
    const bad = [];
    for (const id of ids) {
      await port.page.evaluate((id) => {
        const a = document.createElement("a");
        a.href = "#" + id;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }, id);
      await port.page.waitForTimeout(120);
      const top = await port.page.evaluate((id) => document.getElementById(id).getBoundingClientRect().top, id);
      if (Math.abs(top - 120) > 1) bad.push(`${id}:${top.toFixed(1)}`);
    }
    check(!bad.length, `@${w} anchors land at 120px${bad.length ? ": " + bad.join(" ") : ""}`);
    await port.ctx.close();
  }

  // 3. FAQ
  if (want("faq")) {
    const ref = await open(browser, REF, 1440, 900);
    const port = await open(browser, PORT, 1440, 900);
    await settle(ref.page);
    const state = (p) =>
      p.evaluate(() => {
        const q = document.getElementById("questions");
        return { h: q.offsetHeight, exp: [...q.querySelectorAll("button")].map((b) => b.getAttribute("aria-expanded")).join("") };
      });
    const [a0, b0] = await Promise.all([state(ref.page), state(port.page)]);
    check(a0.h === b0.h && b0.exp === "truefalsefalsefalsefalsefalse", `FAQ at rest: first open (${b0.exp.replace(/true/g, "1").replace(/false/g, "0")}), height ref ${a0.h} port ${b0.h}`);
    for (const i of [2, 0, 4, 5]) {
      await ref.page.locator("#questions button").nth(i).click();
      await port.page.locator("#questions button").nth(i).click();
      await Promise.all([ref.page.waitForTimeout(80), port.page.waitForTimeout(80)]);
      const [a, b] = await Promise.all([state(ref.page), state(port.page)]);
      check(a.h === b.h && a.exp === b.exp, `FAQ toggle ${i}: expanded ${b.exp.replace(/true/g, "1").replace(/false/g, "0")}, height ref ${a.h} port ${b.h}`);
    }
    const hidden = await port.page.evaluate(() => [...document.querySelectorAll("#questions [hidden]")].map((e) => e.getAttribute("hidden")));
    check(hidden.every((v) => v === "until-found"), `FAQ closed answers are hidden="until-found" (${hidden.length})`);
    await ref.ctx.close();
    await port.ctx.close();
  }

  // 4. copy link
  if (want("copy")) {
    const port = await open(browser, PORT, 1440, 900, { permissions: ["clipboard-read", "clipboard-write"] });
    const btn = port.page.getByRole("button", { name: /Copy link|Link copied/ });
    await btn.click();
    await port.page.waitForTimeout(100);
    const label = await btn.textContent();
    const clip = await port.page.evaluate(() => navigator.clipboard.readText());
    const status = await port.page.locator('[role="status"]').first().textContent();
    check(label === "Link copied" && clip === port.page.url() && status === "Link copied", `copy link: label "${label}", clipboard ${clip === port.page.url() ? "= page URL" : clip}, announced "${status}"`);
    await port.page.waitForTimeout(1900);
    check((await btn.textContent()) === "Copy link", "copy link reverts after 1.8s");
    await port.ctx.close();
  }

  // 5. phone bar
  if (want("phone")) {
    const port = await open(browser, PORT, 390, 844);
    const bar = port.page.locator("[data-pb-tocbar] button");
    const panel = port.page.locator("[data-pb-tocbar] [id]");
    await bar.click();
    check(await panel.isVisible(), "phone bar opens");
    await port.page.locator("[data-pb-tocbar] a", { hasText: "Rules" }).click();
    await port.page.waitForTimeout(200);
    const top = await port.page.evaluate(() => document.getElementById("rules").getBoundingClientRect().top);
    check(!(await panel.isVisible()) && Math.abs(top - 120) <= 1, `choosing an entry closes it and lands the section at ${top.toFixed(1)}px`);
    await port.page.waitForTimeout(300);
    check((await bar.locator("span").nth(1).textContent()) === "06 Rules", `bar label follows: "${await bar.locator("span").nth(1).textContent()}"`);
    await bar.click();
    await port.page.keyboard.press("Escape");
    const focused = await port.page.evaluate(() => document.activeElement?.closest("[data-pb-tocbar]") !== null && document.activeElement.tagName === "BUTTON");
    check(!(await panel.isVisible()) && focused, "Escape closes it and returns focus to the button");
    await bar.click();
    await port.page.mouse.click(200, 700);
    check(!(await panel.isVisible()), "a click outside closes it");
    await port.ctx.close();
  }

  // 6. evidence line hover
  if (want("evidence")) {
    const ref = await open(browser, REF, 1440, 900);
    const port = await open(browser, PORT, 1440, 900);
    // the highlighted segment's index in the line, read the same way on both sides
    const read = (p) =>
      p.evaluate(() => {
        const fig = [...document.querySelectorAll("figure")].find((f) => f.textContent.includes("Example evidence line"));
        const line = fig.querySelector("[class*='leading-[1.9]'], div[style*='line-height: 1.9']");
        const segs = [...line.querySelectorAll("span")].filter((s) => s.children.length === 0);
        return segs.findIndex((s) => getComputedStyle(s).backgroundColor === "rgb(241, 230, 207)");
      });
    let same = true;
    for (let i = 0; i < 8; i++) {
      const rowR = ref.page.locator("figure", { hasText: "Example evidence line" }).locator("div[data-ev]").nth(i);
      const rowP = port.page.locator("figure", { hasText: "Example evidence line" }).locator("div.border-t > div").nth(i);
      await rowR.hover();
      await rowP.hover();
      await Promise.all([ref.page.waitForTimeout(220), port.page.waitForTimeout(220)]);
      const [a, b] = await Promise.all([read(ref.page), read(port.page)]);
      if (a !== i || b !== i) {
        same = false;
        console.log(`     row ${i}: ref highlights ${a}, port ${b}`);
      }
    }
    check(same, "evidence line: each row highlights its own segment, as in the reference");
    await ref.ctx.close();
    await port.ctx.close();
  }

  // 7. hero reveal, motion on
  if (want("reveal")) for (const [w, h, label] of [[1440, 1300, "in view at load"], [1440, 800, "below the fold"]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: "no-preference" });
    const p = await ctx.newPage();
    // sample the parts from the first frame on
    await p.addInitScript(() => {
      window.__samples = [];
      const t0 = performance.now();
      const tick = () => {
        const ring = document.querySelector('[data-reveal="ring"]');
        const fade = document.querySelector('[data-reveal="fade"]');
        const rise = document.querySelector('[data-reveal="rise"]');
        if (ring) {
          window.__samples.push({
            t: Math.round(performance.now() - t0),
            ring: getComputedStyle(ring).boxShadow.includes("rgb(26, 25, 23)") && !getComputedStyle(ring).boxShadow.includes("rgba(26, 25, 23, 0)"),
            fade: +getComputedStyle(fade).opacity,
            rise: +getComputedStyle(rise).opacity,
            gate: document.documentElement.getAttribute("data-pb-reveal"),
          });
        }
        if (performance.now() - t0 < 9000) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    await p.goto(PORT, { waitUntil: "domcontentloaded" });
    if (h < 1000) {
      await p.waitForTimeout(1500);
      await p.evaluate(() => window.scrollTo(0, 500));
    }
    await p.waitForTimeout(h < 1000 ? 4500 : 6000);
    const s = await p.evaluate(() => window.__samples);
    const first = s[0];
    const shownEarly = s.filter((x) => x.gate !== "run" && (x.fade > 0 || x.rise > 0 || x.ring));
    const firstRing = s.find((x) => x.ring), firstFade = s.find((x) => x.fade > 0.99), firstRise = s.find((x) => x.rise > 0.99);
    check(!!first && !first.ring && first.fade === 0 && first.rise === 0, `reveal (${label}): first frame held at the start state (gate ${first?.gate})`);
    check(shownEarly.length === 0, `reveal (${label}): nothing shows, then hides, before the reveal`);
    check(!!(firstRing && firstFade && firstRise) && firstRing.t < firstFade.t && firstFade.t < firstRise.t, `reveal (${label}): ring ${firstRing?.t}ms, values ${firstFade?.t}ms, card ${firstRise?.t}ms`);
    const last = s[s.length - 1];
    check(last.ring && last.fade === 1 && last.rise === 1, `reveal (${label}): ends in the final state`);
    await ctx.close();
  }
} finally {
  await browser.close();
}
console.log(fails ? `\n${fails} check(s) failed` : "\nall checks passed");
process.exitCode = fails ? 1 : 0;
