#!/usr/bin/env node
// A playbook page's behaviour (its handoff README, "Interactions & behaviour"), port against
// the reference:
//   1. scroll-spy: active entry, active 05 subsection, rail height and progress bar at every
//      400px of scroll, at 1440 (sidebar) and 390 (the phone bar's label)
//   2. anchors: every contents link lands its target 120px below the viewport top
//   3. FAQ: independent toggles, first open, aria-expanded; section height after each toggle
//   4. copy link: clipboard, "Link copied" for 1.8s
//   5. phone bar: opens, closes on an entry, on Escape (focus returns) and on an outside click
//   6. evidence line: hovering a row highlights its segment and inks its label
//   7. hero reveal (motion on): held from the first frame, then its parts in turn; on Loan Ops
//      Ledger also the status dot's red-to-green; on NAV Pack Review the rows 40ms apart, then
//      the explanation and the break's "Break · explained"; on Side-Letter Register the rows
//      150ms apart, then the overdue row's red; on Mandate Guardrails the underline, the
//      interpretation note, then PASS; on Loan Ops Ledger, Capital Call Flow, NAV Pack Review,
//      Side-Letter Register and Mandate Guardrails the final state when the reader has not
//      reached the figure within 4s; and, arriving by a client-side navigation from /playbooks,
//      the parts start hidden and never fade out (no flash of the final state)
//   8. Loan Ops Ledger only: the hero notice's "Show full notice" toggle below a 500px column,
//      and F5's row hover
//   9. Capital Call Flow only: F1's amounts stay inside their cells at every main width (under
//      448px its lines stack), and F2 and F6 fold their columns at 600px as the reference does
//  10. Investor Reporting only: the hero reveal (six dots grey to green and four underlines
//      drawn, in the reference's order and 150ms rhythm), its final state for a reader who has
//      not reached it within 4s, and the two-way hover between the sentence and the table
//  11. Side-Letter Register only: every figure's height equals the reference's either side of
//      each fold (F2's election grid at a 520px column, F1 and F2's compendium at 560, F4, F5
//      and F8 at 600), and nothing runs past its cell at any width from 320 to 1440
//  12. Mandate Guardrails only: F2, F4 and F7 fold at the reference's thresholds, F4's rule spec
//      scrolls inside its own box, and on phones no figure text runs past its card
//
//   BASE_URL=… node qa/playbook-behaviour.mjs --page loan-ops-ledger [--only spy,reveal]

import { PAGE, REF, PORT, REVEAL, REVEAL_SETTLES, launch, open, settle } from "./playbook-lib.mjs";

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
      // the port's own rule, for where its layout differs from the reference's on purpose: the
      // last entry whose target's top is at or above min(170px, 30% of the viewport)
      rule: isRef
        ? null
        : [...document.querySelectorAll("[data-pb-tocbar] a")]
            .filter((a) => document.getElementById(a.hash.slice(1))?.getBoundingClientRect().top <= Math.min(170, innerHeight * 0.3))
            .map((a) => [...a.children].map((c) => c.textContent).join(" ").trim())
            .pop() ?? "Overview",
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
    // Capital Call Flow under a 488px viewport: F1 stacks its lines where the reference's
    // columns overprint (a departure), so the hero is taller and the same scroll position lands
    // elsewhere; there the phone bar is checked against the spy's rule on the port's own layout.
    const own = PAGE === "capital-call-flow" && w < 488;
    let mism = 0, n = 0, railMax = 0, progMax = 0;
    for (let y = 0; y <= H + 400; y += 400) {
      const yy = Math.min(y, H);
      await Promise.all([scrollAndWait(ref.page, yy), scrollAndWait(port.page, yy)]);
      const [a, b] = await Promise.all([spyState(ref.page, true), spyState(port.page, false)]);
      n++;
      const same = own ? b.phone === b.rule : a.active === b.active && a.sub === b.sub && a.phone === b.phone;
      if (!same) {
        mism++;
        if (mism <= 5) console.log(`     @${w} y=${yy}: ref ${JSON.stringify(a)} port ${JSON.stringify(b)}`);
      }
      if (a.rail !== null) railMax = Math.max(railMax, Math.abs(a.rail - b.rail));
      // Same document height: the bars must agree. Otherwise (below 560px the site footer is
      // shorter than the reference's), each bar must match its own page's scroll share.
      progMax = Math.max(progMax, sameHeight ? Math.abs((a.progress ?? 0) - (b.progress ?? 0)) : Math.abs((b.progress ?? 0) - b.expected));
    }
    check(mism === 0, `@${w} scroll-spy: ${n} positions, ${mism} mismatches (${own ? "phone bar label against the spy's rule on the port" : "active entry, 05 subsection" + (w < 1048 ? ", phone bar label" : "")})`);
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
  // (NAV Pack Review's figure has no ring: its reveal has a check of its own, below.)
  if (want("reveal") && REVEAL.ring) for (const [w, h, label] of [[1440, 1300, "in view at load"], [1440, 800, "below the fold"]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: "no-preference" });
    const p = await ctx.newPage();
    // sample the parts from the first frame on
    await p.addInitScript((parts) => {
      window.__samples = [];
      const t0 = performance.now();
      const pick = ({ sel, text }) => [...document.querySelectorAll(sel)].find((e) => !text || e.textContent.includes(text));
      const tick = () => {
        const ring = pick(parts.ring);
        const fade = pick(parts.fade);
        const rise = pick(parts.rise);
        const dot = document.querySelector('[data-reveal="dot"]');
        if (ring) {
          window.__samples.push({
            t: Math.round(performance.now() - t0),
            ring: getComputedStyle(ring).boxShadow.includes("rgb(26, 25, 23)") && !getComputedStyle(ring).boxShadow.includes("rgba(26, 25, 23, 0)"),
            fade: +getComputedStyle(fade).opacity,
            rise: +getComputedStyle(rise).opacity,
            dot: dot ? getComputedStyle(dot).backgroundColor : null,
            gate: document.documentElement.getAttribute("data-pb-reveal"),
          });
        }
        if (performance.now() - t0 < 9000) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, REVEAL);
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
    if (first?.dot) {
      const green = s.find((x) => x.dot === "rgb(21, 127, 82)");
      check(first.dot === "rgb(196, 52, 30)" && !!green && !!firstRise && green.t > firstRise.t, `reveal (${label}): status dot red, then green at ${green?.t}ms`);
    }
    await ctx.close();
  }

  // NAV Pack Review's reveal: its six rows fade in 40ms apart, then the explanation, as the break
  // turns from "Break" to "Break · explained". Sampled every frame from the first.
  if (want("reveal") && PAGE === "nav-pack-review") for (const [w, h, label] of [[1440, 1300, "in view at load"], [1440, 800, "below the fold"]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: "no-preference" });
    const p = await ctx.newPage();
    await p.addInitScript(() => {
      window.__samples = [];
      const t0 = performance.now();
      const tick = () => {
        const fades = document.querySelectorAll('[data-reveal-root] [data-reveal="fade"]');
        if (fades.length === 7) {
          const brk = [...fades[3].querySelectorAll("span")].find((s) => /^Break/.test(s.textContent));
          window.__samples.push({
            t: Math.round(performance.now() - t0),
            r0: +getComputedStyle(fades[0]).opacity,
            r5: +getComputedStyle(fades[5]).opacity,
            exp: +getComputedStyle(fades[6]).opacity,
            status: brk?.textContent ?? null,
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
    const first = s[0], last = s[s.length - 1];
    const shownEarly = s.filter((x) => x.gate !== "run" && (x.r0 > 0 || x.exp > 0));
    const row0 = s.find((x) => x.r0 > 0.99), row5 = s.find((x) => x.r5 > 0.99), exp = s.find((x) => x.exp > 0.99);
    const flip = s.find((x) => x.status === "Break · explained" && x.t > (row0?.t ?? Infinity));
    check(!!first && first.r0 === 0 && first.exp === 0, `reveal (${label}): first frame held at the start state (gate ${first?.gate})`);
    check(shownEarly.length === 0, `reveal (${label}): nothing shows, then hides, before the reveal`);
    check(!!(row0 && row5 && exp) && row0.t < row5.t && row5.t < exp.t, `reveal (${label}): first row ${row0?.t}ms, last row ${row5?.t}ms, explanation ${exp?.t}ms`);
    check(row0?.status === "Break" && !!flip && flip.t <= exp.t, `reveal (${label}): "Break" with the rows, "Break · explained" at ${flip?.t}ms`);
    check(last.r0 === 1 && last.r5 === 1 && last.exp === 1 && last.status === "Break · explained", `reveal (${label}): ends in the final state`);
    await ctx.close();
  }

  // Side-Letter Register's reveal: its five register rows fade in 150ms apart, then the overdue
  // row (Tamsin's, the third) turns red: wash, edge, words and dot. The row fades in neutral and
  // turns red only after the last row has started. Sampled every frame from the first.
  if (want("reveal") && PAGE === "side-letter-register") for (const [w, h, label] of [[1440, 1300, "in view at load"], [1440, 800, "below the fold"]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: "no-preference" });
    const p = await ctx.newPage();
    await p.addInitScript(() => {
      window.__samples = [];
      const t0 = performance.now();
      const tick = () => {
        const rows = document.querySelectorAll('[data-reveal-root] [data-reveal="fade"]');
        if (rows.length === 5) {
          window.__samples.push({
            t: Math.round(performance.now() - t0),
            r0: +getComputedStyle(rows[0]).opacity,
            r2: +getComputedStyle(rows[2]).opacity,
            r4: +getComputedStyle(rows[4]).opacity,
            bg: getComputedStyle(rows[2]).backgroundColor,
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
    const RED = "rgb(246, 227, 223)";
    const clear = (bg) => bg === "rgba(0, 0, 0, 0)";
    const first = s[0], last = s[s.length - 1];
    const shownEarly = s.filter((x) => x.gate !== "run" && (x.r0 > 0 || x.r2 > 0 || x.r4 > 0));
    const row0 = s.find((x) => x.r0 > 0.99), row4start = s.find((x) => x.r4 > 0), row4 = s.find((x) => x.r4 > 0.99);
    const tamsin = s.find((x) => x.r2 > 0);
    const redStart = s.find((x) => x.gate === "run" && x.r2 > 0 && !clear(x.bg));
    check(!!first && first.r0 === 0 && first.r4 === 0, `reveal (${label}): first frame held at the start state (gate ${first?.gate})`);
    check(shownEarly.length === 0, `reveal (${label}): nothing shows, then hides, before the reveal`);
    check(!!(row0 && row4) && row0.t < row4.t, `reveal (${label}): first row in at ${row0?.t}ms, last row at ${row4?.t}ms`);
    check(!!tamsin && clear(tamsin.bg) && !!redStart && !!row4start && redStart.t > row4start.t, `reveal (${label}): the overdue row fades in neutral, turns red at ${redStart?.t}ms (after the last row starts, ${row4start?.t}ms)`);
    check(last.r0 === 1 && last.r4 === 1 && last.bg === RED, `reveal (${label}): ends in the final state`);
    await ctx.close();
  }

  // Every page, arriving by a client-side navigation (a card on /playbooks): there is no head
  // gate then, so the hook holds the parts itself. The first frame shows them at their start
  // state, and no part ever goes backwards: that would be the final state flashing. Each part's
  // progress is read from what it animates: opacity (fade, rise), the ring's alpha, a dot's
  // green (dot, wait), an underline's width (draw), a bar's green tint (tint), a word's green
  // (word).
  if (want("reveal")) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 1300 }, reducedMotion: "no-preference" });
    const p = await ctx.newPage();
    // the library's hero video keeps the network busy: wait for load, not network idle
    await p.goto(new URL("/playbooks", PORT).href, { waitUntil: "load" });
    await p.waitForTimeout(1000);
    await p.evaluate(() => {
      window.__nav = [];
      const t0 = performance.now();
      const alpha = (c) => {
        const m = /rgba?\((\d+), (\d+), (\d+)(?:, ([\d.]+))?\)/.exec(c);
        return m && m[1] === "26" && m[2] === "25" && m[3] === "23" ? (m[4] === undefined ? 1 : +m[4]) : 0;
      };
      const progress = (e) => {
        const cs = getComputedStyle(e);
        switch (e.getAttribute("data-reveal")) {
          case "ring":
            return alpha(cs.boxShadow);
          case "dot":
          case "wait":
            return cs.backgroundColor === "rgb(21, 127, 82)" ? 1 : 0;
          case "draw":
            return (parseFloat(cs.backgroundSize) || 0) / 100;
          case "tint":
            return cs.backgroundColor === "rgb(228, 240, 234)" ? 1 : 0;
          case "word":
            return cs.color === "rgb(19, 120, 78)" ? 1 : 0;
          default:
            return +cs.opacity;
        }
      };
      const tick = () => {
        const parts = [...document.querySelectorAll("[data-reveal-root] [data-reveal]")];
        if (parts.length) window.__nav.push({ t: Math.round(performance.now() - t0), ops: parts.map(progress) });
        if (performance.now() - t0 < 6000) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    await p.locator(`section[id] a[href="/playbooks/${PAGE}"]`).first().click();
    await p.waitForTimeout(5500);
    const s = await p.evaluate(() => window.__nav);
    const drops = s.slice(1).filter((x, i) => x.ops.some((o, j) => o < s[i].ops[j] - 0.001));
    const last = s[s.length - 1];
    check(!!s.length && s[0].ops.every((o) => o === 0) && !drops.length && last.ops.every((o) => o === 1), `reveal (client-side navigation): first frame at the start state, ${drops.length} frames with a part going backwards, ends in the final state`);
    await ctx.close();
  }

  // Mandate Guardrails' reveal: "investment grade" underlined, then the interpretation note, then
  // the result turning PASS (its bar tinted green, its dot and word green). Sampled every frame
  // from the first.
  if (want("reveal") && PAGE === "mandate-guardrails") for (const [w, h, label] of [[1440, 1300, "in view at load"], [1440, 800, "below the fold"]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: "no-preference" });
    const p = await ctx.newPage();
    await p.addInitScript(() => {
      window.__samples = [];
      const t0 = performance.now();
      const tick = () => {
        const q = (part) => document.querySelector(`[data-reveal-root] [data-reveal="${part}"]`);
        const [draw, note, tint, wait, word] = ["draw", "fade", "tint", "wait", "word"].map(q);
        if (draw && note && tint && wait && word) {
          window.__samples.push({
            t: Math.round(performance.now() - t0),
            drawn: getComputedStyle(draw).backgroundSize,
            note: +getComputedStyle(note).opacity,
            tint: getComputedStyle(tint).backgroundColor,
            dot: getComputedStyle(wait).backgroundColor,
            word: getComputedStyle(word).color,
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
    const GREEN_BAR = "rgb(228, 240, 234)", HELD_BAR = "rgb(241, 238, 232)", GREEN = "rgb(21, 127, 82)", GREY = "rgb(217, 214, 207)";
    const OK_INK = "rgb(19, 120, 78)", FAINT = "rgb(138, 136, 127)";
    const passed = (x) => x.tint === GREEN_BAR && x.dot === GREEN && x.word === OK_INK;
    const first = s[0], last = s[s.length - 1];
    const shownEarly = s.filter((x) => x.gate !== "run" && (x.drawn !== "0% 1.5px" || x.note > 0 || x.tint !== HELD_BAR));
    const drawn = s.find((x) => x.drawn.startsWith("100%")), note = s.find((x) => x.note > 0.99), pass = s.find(passed);
    check(
      !!first && first.drawn === "0% 1.5px" && first.note === 0 && first.tint === HELD_BAR && first.dot === GREY && first.word === FAINT,
      `reveal (${label}): first frame held at the start state (gate ${first?.gate})`,
    );
    check(shownEarly.length === 0, `reveal (${label}): nothing shows, then hides, before the reveal`);
    check(!!(drawn && note && pass) && drawn.t < note.t && note.t < pass.t, `reveal (${label}): underline ${drawn?.t}ms, note ${note?.t}ms, PASS ${pass?.t}ms`);
    check(!!last && last.drawn === "100% 1.5px" && last.note === 1 && passed(last), `reveal (${label}): ends in the final state`);
    await ctx.close();
  }

  // Loan Ops Ledger, Capital Call Flow, NAV Pack Review, Side-Letter Register and Mandate
  // Guardrails: a reader who has not reached the hero within 4s gets its final state.
  if (want("reveal") && REVEAL_SETTLES) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 800 }, reducedMotion: "no-preference" });
    const p = await ctx.newPage();
    await p.goto(PORT, { waitUntil: "domcontentloaded" });
    const read = () =>
      p.evaluate((parts) => {
        const pick = ({ sel, text }) => [...document.querySelectorAll(sel)].find((e) => !text || e.textContent.includes(text));
        const dot = document.querySelector('[data-reveal="dot"]');
        return { rise: +getComputedStyle(pick(parts.rise)).opacity, dot: dot ? getComputedStyle(dot).backgroundColor : null };
      }, REVEAL);
    await p.waitForTimeout(2500);
    const before = await read();
    await p.waitForTimeout(3000);
    const after = await read();
    check(before.rise === 0 && after.rise === 1 && (after.dot === null || after.dot === "rgb(21, 127, 82)"), `reveal (not reached): held at 2.5s, final state after 4s (${JSON.stringify(after)})`);
    await ctx.close();
  }

  // Investor Reporting: the hero reveal, port against reference. Each side samples its six
  // status dots (grey #D9D6CF, then green) and four underlines (0%, then 100% wide) on every
  // frame from the first; the order and the gaps between the parts must match.
  if (want("reveal") && PAGE === "investor-reporting") {
    const sampler = () => {
      window.__samples = [];
      const t0 = performance.now();
      const tick = () => {
        const fig = document.querySelector("figure");
        const isRef = !document.querySelector("[data-reveal]");
        const dots = fig ? (isRef ? [...fig.querySelectorAll("div[data-f] > span:nth-last-child(2) > span[aria-hidden]")] : [...fig.querySelectorAll('[data-reveal="wait"]')]) : [];
        const unders = fig ? (isRef ? [...fig.querySelectorAll("p span[data-f]")] : [...fig.querySelectorAll('[data-reveal="draw"]')]) : [];
        if (dots.length === 6 && unders.length === 4)
          window.__samples.push({
            t: Math.round(performance.now() - t0),
            gate: document.documentElement.getAttribute("data-pb-reveal"),
            dots: dots.map((d) => getComputedStyle(d).backgroundColor),
            unders: unders.map((u) => parseFloat(getComputedStyle(u).backgroundSize) || 0),
          });
        if (performance.now() - t0 < 9000) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const GREEN = "rgb(21, 127, 82)", GREY = "rgb(217, 214, 207)";
    /** When each part reached its final state, relative to the first part's. */
    const landings = (s) => {
      const at = (f) => s.find(f)?.t ?? null;
      const d = [0, 1, 2, 3, 4, 5].map((i) => at((x) => x.dots[i] === GREEN));
      const u = [0, 1, 2, 3].map((i) => at((x) => x.unders[i] >= 100));
      const t0 = Math.min(...d.filter((x) => x !== null));
      return { d: d.map((x) => (x === null ? null : x - t0)), u: u.map((x) => (x === null ? null : x - t0)) };
    };
    for (const [w, h, label] of [[1440, 1300, "in view at load"], [1440, 800, "below the fold"], [390, 844, "phone, below the fold"]]) {
      const runs = [];
      for (const url of [REF, PORT]) {
        const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: "no-preference" });
        const p = await ctx.newPage();
        await p.addInitScript(sampler);
        await p.goto(url, { waitUntil: "domcontentloaded" });
        if (h < 1000) {
          await p.waitForTimeout(1500);
          await p.evaluate(() => window.scrollTo(0, document.querySelector("figure").getBoundingClientRect().top + scrollY - 200));
        }
        await p.waitForTimeout(h < 1000 ? 4500 : 6000);
        runs.push(await p.evaluate(() => window.__samples));
        await ctx.close();
      }
      const [r, s] = runs;
      const first = s[0];
      check(!!first && first.dots.every((c) => c === GREY) && first.unders.every((u) => u === 0), `IR reveal (${label}): first frame held at the start state (gate ${first?.gate})`);
      // before the port's reveal owns the parts, nothing may show its final state
      const early = s.filter((x) => x.gate !== "run" && (x.dots.some((c) => c === GREEN) || x.unders.some((u) => u > 0)));
      check(early.length === 0, `IR reveal (${label}): nothing shows, then hides, before the reveal`);
      const a = landings(r), b = landings(s);
      const order = (l) => [...l.d.map((t, i) => ["d" + i, t]), ...l.u.map((t, i) => ["u" + i, t])].sort((x, y) => x[1] - y[1]).map((x) => x[0]).join(" ");
      const gap = Math.max(...[...a.d.map((t, i) => Math.abs(t - b.d[i])), ...a.u.map((t, i) => Math.abs(t - b.u[i]))]);
      check(
        [...b.d, ...b.u].every((t) => t !== null) && order(a) === order(b) && gap <= 60,
        `IR reveal (${label}): dots at ${b.d.join(", ")}ms, underlines at ${b.u.join(", ")}ms (reference ${a.d.join(", ")} / ${a.u.join(", ")}; max gap ${gap}ms)`,
      );
      const last = s[s.length - 1];
      check(last.dots.every((c) => c === GREEN) && last.unders.every((u) => u >= 100), `IR reveal (${label}): ends in the final state`);
    }

    // a reader who has not reached the figure within 4s gets its final state, held till then
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 800 }, reducedMotion: "no-preference" });
    const p = await ctx.newPage();
    await p.goto(PORT, { waitUntil: "domcontentloaded" });
    const read = () =>
      p.evaluate(() => ({
        green: [...document.querySelectorAll('[data-reveal="wait"]')].filter((d) => getComputedStyle(d).backgroundColor === "rgb(21, 127, 82)").length,
        drawn: [...document.querySelectorAll('[data-reveal="draw"]')].filter((u) => parseFloat(getComputedStyle(u).backgroundSize) >= 100).length,
      }));
    await p.waitForTimeout(2500);
    const before = await read();
    await p.waitForTimeout(3000);
    const after = await read();
    check(before.green === 0 && before.drawn === 0 && after.green === 6 && after.drawn === 4, `IR reveal (not reached): held at 2.5s, final state after 4s (${JSON.stringify(after)})`);
    await ctx.close();
  }

  // Investor Reporting: hovering a figure in the sentence or its row tints both #F1E6CF; the
  // gross pair's check and the NAV (no figure in the sentence) tint their row alone, over the
  // wash they rest on.
  if (want("hover") && PAGE === "investor-reporting") {
    for (const [w, h] of [[1440, 900], [390, 844]]) {
      const ref = await open(browser, REF, w, h);
      const port = await open(browser, PORT, w, h);
      await settle(ref.page);
      const state = (p) =>
        p.evaluate(() => {
          const fig = document.querySelector("figure");
          const rows = [...fig.querySelectorAll('[role="row"], div[data-f]')].filter((r) => r.querySelector("span") && !/Calculation/.test(r.textContent));
          const unders = [...fig.querySelectorAll("p > span")].filter((u) => /^[\d.]+[%x]$/.test(u.textContent));
          return {
            rows: rows.map((r) => getComputedStyle(r).backgroundColor).join(" "),
            figs: unders.map((u) => getComputedStyle(u).backgroundColor).join(" "),
          };
        });
      const targets = [
        ["the sentence's 1.21x", (p) => p.locator("figure").first().locator("p > span", { hasText: /^1\.21x$/ })],
        ["row 2", (p) => p.locator("figure").first().getByText("Net · without facility · same period and method")],
        ["the gross pair's row", (p) => p.locator("figure").first().getByText("pair check: gross and net share basis")],
        ["the NAV row", (p) => p.locator("figure").first().getByText("Northbay pack v3 (fictional) · fee-basis break rebooked")],
      ];
      const [a0, b0] = await Promise.all([state(ref.page), state(port.page)]);
      check(a0.rows === b0.rows && a0.figs === b0.figs, `IR hover @${w} at rest: rows ${b0.rows.split(" rgb").length} alike, the wash on the pair and the NAV`);
      for (const [name, loc] of targets) {
        await loc(ref.page).hover();
        await loc(port.page).hover();
        await Promise.all([ref.page.waitForTimeout(260), port.page.waitForTimeout(260)]);
        const [a, b] = await Promise.all([state(ref.page), state(port.page)]);
        const lit = (x) => (x.rows.match(/rgb\(241, 230, 207\)/g) || []).length + (x.figs.match(/rgb\(241, 230, 207\)/g) || []).length;
        check(a.rows === b.rows && a.figs === b.figs && lit(b) >= 1, `IR hover @${w} on ${name}: ${lit(b)} part(s) tinted, as in the reference`);
      }
      await ref.page.mouse.move(5, 5);
      await port.page.mouse.move(5, 5);
      await Promise.all([ref.page.waitForTimeout(260), port.page.waitForTimeout(260)]);
      const [a1, b1] = await Promise.all([state(ref.page), state(port.page)]);
      check(a1.rows === b1.rows && a1.figs === b1.figs && b1.rows === b0.rows, `IR hover @${w}: leaving resets both`);
      await ref.ctx.close();
      await port.ctx.close();
    }
  }

  // Loan Ops Ledger: the notice toggle below a 500px column, and F5's row hover.
  if (want("lol") && PAGE === "loan-ops-ledger") {
    const ref = await open(browser, REF, 390, 844);
    const port = await open(browser, PORT, 390, 844);
    await settle(ref.page);
    const noticeState = (p) =>
      p.evaluate(() => {
        const fig = document.querySelector("figure");
        const btn = [...fig.querySelectorAll("button")].find((b) => /full notice/.test(b.textContent));
        return { label: btn?.textContent.trim(), fields: [...fig.querySelectorAll("div")].filter((d) => d.textContent === "Borrower" && d.getClientRects().length).length, h: fig.offsetHeight };
      });
    const [a0, b0] = await Promise.all([noticeState(ref.page), noticeState(port.page)]);
    check(a0.label === "Show full notice" && b0.label === "Show full notice" && a0.fields === 0 && b0.fields === 0 && a0.h === b0.h, `notice @390 at rest: collapsed, button "${b0.label}", figure height ref ${a0.h} port ${b0.h}`);
    for (const p of [ref.page, port.page]) await p.locator("figure").first().getByRole("button", { name: /full notice/ }).click();
    await Promise.all([ref.page.waitForTimeout(150), port.page.waitForTimeout(150)]);
    const [a1, b1] = await Promise.all([noticeState(ref.page), noticeState(port.page)]);
    const expanded = await port.page.locator("figure").first().getByRole("button", { name: /full notice/ }).getAttribute("aria-expanded");
    check(a1.label === "Hide full notice" && b1.label === "Hide full notice" && a1.fields === 1 && b1.fields === 1 && a1.h === b1.h && expanded === "true", `notice @390 opened: "${b1.label}", aria-expanded ${expanded}, figure height ref ${a1.h} port ${b1.h}`);
    await ref.ctx.close();
    await port.ctx.close();

    const r2 = await open(browser, REF, 1440, 900);
    const p2 = await open(browser, PORT, 1440, 900);
    const rowBg = (p, i) =>
      p.evaluate((i) => {
        const fig = [...document.querySelectorAll("figure")].find((f) => f.textContent.includes("model / code / person"));
        const rows = [...fig.querySelectorAll("div")].filter((d) => /^\d (Intake|Read|Match|Recompute|Class|Investigate|Book)$/.test(d.firstElementChild?.textContent?.trim() ?? ""));
        return rows.map((r) => getComputedStyle(r).backgroundColor)[i];
      }, i);
    let ok = true;
    for (const i of [0, 3, 6]) {
      for (const p of [r2.page, p2.page]) {
        const fig = p.locator("figure", { hasText: "model / code / person" });
        await fig.getByText(new RegExp(`^${i + 1} `)).first().hover();
      }
      await Promise.all([r2.page.waitForTimeout(250), p2.page.waitForTimeout(250)]);
      const [a, b] = await Promise.all([rowBg(r2.page, i), rowBg(p2.page, i)]);
      if (a !== "rgb(241, 238, 232)" || b !== a) {
        ok = false;
        console.log(`     F5 row ${i}: ref ${a} port ${b}`);
      }
    }
    check(ok, "F5: hovering a step tints its row #F1EEE8, as in the reference");
    await r2.ctx.close();
    await p2.ctx.close();
  }
  // Capital Call Flow: F1's amounts never run past their cells (the reference's four columns
  // overprint under a 448px main column, where the port stacks each line instead), and the
  // tables fold at the reference's thresholds.
  if (want("ccf") && PAGE === "capital-call-flow") {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
    const p = await ctx.newPage();
    await p.goto(PORT, { waitUntil: "networkidle" });
    const worst = [];
    for (let w = 1440; w >= 320; w -= w > 720 ? 120 : 8) {
      await p.setViewportSize({ width: w, height: 900 });
      await p.waitForTimeout(60);
      const r = await p.evaluate(() => {
        const fig = document.querySelector("main figure");
        const mw = Math.round(document.querySelector("main").getBoundingClientRect().width);
        let over = 0;
        for (const cell of fig.querySelectorAll("[role=cell], [role=rowheader], [role=columnheader]")) {
          if (!cell.getClientRects().length) continue;
          const cr = cell.getBoundingClientRect();
          const walk = document.createTreeWalker(cell, NodeFilter.SHOW_TEXT);
          for (let n = walk.nextNode(); n; n = walk.nextNode()) {
            if (n.parentElement.closest(".sr-only")) continue;
            const range = document.createRange();
            range.selectNodeContents(n);
            for (const rr of range.getClientRects()) if (rr.width) over = Math.max(over, rr.right - cr.right, cr.left - rr.left);
          }
        }
        return { mw, over: +over.toFixed(1), stacked: getComputedStyle(fig.querySelector("[role=row]")).display === "none" };
      });
      // from 640px the reference's six columns spill ~6px into their 8px gaps; the port keeps that
      if (r.over > (r.mw >= 640 && r.mw < 700 ? 6.5 : 0.5)) worst.push(`${w}px (main ${r.mw}): ${r.over}px`);
      if ((r.mw < 448) !== r.stacked) worst.push(`${w}px (main ${r.mw}): stacked ${r.stacked}`);
    }
    check(!worst.length, `F1 amounts stay inside their cells from 1440 to 320px, stacked under a 448px column${worst.length ? ": " + worst.slice(0, 6).join("; ") : ""}`);
    await ctx.close();

    const ref = await open(browser, REF, 1440, 900);
    const port = await open(browser, PORT, 1440, 900);
    const fold = (pg) =>
      pg.evaluate(() => {
        const figs = [...document.querySelectorAll("main figure")];
        const f2 = figs.find((f) => f.textContent.includes("Wires matched to investors"));
        const f6 = figs.find((f) => f.textContent.includes("What the model may touch"));
        const visible = (f, t) => [...f.querySelectorAll("span")].some((s) => s.textContent === t && s.getClientRects().length > 0);
        return [f2.offsetHeight, f6.offsetHeight, visible(f2, "Received"), visible(f6, "Approval before effect")].join(" ");
      });
    let same = true;
    for (const w of [652, 651, 600, 390]) {
      await Promise.all([ref.page, port.page].map((pg) => pg.setViewportSize({ width: w, height: 900 })));
      await Promise.all([ref.page, port.page].map((pg) => pg.waitForTimeout(250)));
      const [a, b] = await Promise.all([fold(ref.page), fold(port.page)]);
      if (a !== b) {
        same = false;
        console.log(`     @${w}: ref ${a} port ${b}`);
      }
    }
    check(same, "F2 and F6 fold their columns at a 600px column, figure heights equal to the reference's");
    await ref.ctx.close();
    await port.ctx.close();
  }

  // Side-Letter Register: the figures fold where the reference's do. Main widths either side of
  // 520 (F2's election grid), 560 (F1, F2's compendium) and 600 (F4, F5, F8): viewports 566/565,
  // 609/608 and 653/652 put the column at 520.3/519.4, 560.3/559.4 and 600.8/599.8.
  if (want("slr") && PAGE === "side-letter-register") {
    const ref = await open(browser, REF, 1440, 900);
    const port = await open(browser, PORT, 1440, 900);
    const heights = (pg) =>
      pg.evaluate(() => [...document.querySelectorAll("main figure")].map((f) => f.offsetHeight).join(" "));
    let same = true;
    for (const w of [1440, 1047, 700, 653, 652, 609, 608, 566, 565, 480, 390, 320]) {
      await Promise.all([ref.page, port.page].map((pg) => pg.setViewportSize({ width: w, height: 900 })));
      await Promise.all([ref.page, port.page].map((pg) => pg.waitForTimeout(300)));
      const [a, b] = await Promise.all([heights(ref.page), heights(port.page)]);
      if (a !== b) {
        same = false;
        console.log(`     @${w}: ref ${a}\n            port ${b}`);
      }
    }
    check(same, "every figure's height equals the reference's either side of each fold (520, 560 and 600px columns), 1440 to 320");
    await ref.ctx.close();
    await port.ctx.close();

    // Nothing in a figure runs past the box it sits in (long ids and mono lines wrap anywhere).
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
    const p = await ctx.newPage();
    await p.goto(PORT, { waitUntil: "networkidle" });
    const worst = [];
    for (let w = 1440; w >= 320; w -= w > 720 ? 120 : 10) {
      await p.setViewportSize({ width: w, height: 900 });
      await p.waitForTimeout(60);
      const r = await p.evaluate(() => {
        let over = 0, where = "";
        for (const fig of document.querySelectorAll("main figure")) {
          for (const box of fig.querySelectorAll("[role=cell], [role=rowheader], [role=columnheader], dd, dt, div, span, p")) {
            if (!box.getClientRects().length || box.closest(".sr-only") || getComputedStyle(box).display === "inline") continue;
            const cr = box.getBoundingClientRect();
            const walk = document.createTreeWalker(box, NodeFilter.SHOW_TEXT);
            for (let n = walk.nextNode(); n; n = walk.nextNode()) {
              if (n.parentElement.closest(".sr-only")) continue;
              // only text laid out in this box, not in a block descendant (checked on its own)
              let el = n.parentElement;
              while (el !== box && getComputedStyle(el).display === "inline") el = el.parentElement;
              if (el !== box) continue;
              const range = document.createRange();
              range.selectNodeContents(n);
              for (const rr of range.getClientRects()) {
                const o = Math.max(rr.right - cr.right, cr.left - rr.left);
                if (rr.width && o > over) {
                  over = o;
                  where = n.textContent.trim().slice(0, 30);
                }
              }
            }
          }
        }
        return { over: +over.toFixed(1), where };
      });
      if (r.over > 0.5) worst.push(`${w}px: ${r.over}px ("${r.where}")`);
    }
    check(!worst.length, `no figure text runs past its box from 1440 to 320px${worst.length ? ": " + worst.slice(0, 6).join("; ") : ""}`);
    await ctx.close();
  }

  // Mandate Guardrails: the figures fold at the reference's thresholds (F2's check table at a
  // 560px column, F4's lanes at 600 and its Expected column at 540, F7's table at 540), with
  // figure heights equal to the reference's. Between 540 and 560 the reference switches F2's
  // cells but not its columns (a broken two-column grid); the port folds both at 560, so F2 is
  // compared outside that band and checked on its own inside it (and not under a 334px column,
  // where the port wraps its order line). And F4's rule spec scrolls sideways inside its own
  // box, from the keyboard too, while the page never does.
  if (want("mg") && PAGE === "mandate-guardrails") {
    const ref = await open(browser, REF, 1440, 900);
    const port = await open(browser, PORT, 1440, 900);
    const fold = (pg) =>
      pg.evaluate(() => {
        const figs = [...document.querySelectorAll("main figure")];
        const find = (t) => figs.find((f) => f.textContent.includes(t));
        const f2 = find("Pre-trade compliance"), f4 = find("clause → rule → test"), f7 = find("which denominator?");
        const visible = (f, t) => [...f.querySelectorAll("span")].some((s) => s.textContent.trim() === t && s.getClientRects().length > 0);
        const mw = Math.round(document.querySelector("main").getBoundingClientRect().width);
        return {
          mw,
          f2: `${f2.offsetHeight} ${visible(f2, "Projected")}`,
          f4: `${f4.offsetHeight} ${visible(f4, "Expected")}`,
          f7: `${f7.offsetHeight} ${visible(f7, "Denominator £m")}`,
        };
      });
    const bad = [];
    for (const w of [652, 651, 609, 608, 587, 586, 430, 390, 320]) {
      await Promise.all([ref.page, port.page].map((pg) => pg.setViewportSize({ width: w, height: 900 })));
      await Promise.all([ref.page, port.page].map((pg) => pg.waitForTimeout(250)));
      const [a, b] = await Promise.all([fold(ref.page), fold(port.page)]);
      const band = a.mw >= 540 && a.mw < 560;
      // under a 334px column the port wraps F2's order line where the reference overflows its card
      const own = a.mw < 334;
      for (const k of ["f4", "f7", ...(band || own ? [] : ["f2"])]) if (a[k] !== b[k]) bad.push(`@${w} (main ${a.mw}) ${k}: ref ${a[k]} port ${b[k]}`);
      if (band && !b.f2.endsWith("false")) bad.push(`@${w} (main ${b.mw}) f2: the port's columns show under 560 (${b.f2})`);
    }
    check(!bad.length, `F2, F4 and F7 fold at the reference's thresholds, heights equal to its${bad.length ? ":\n      " + bad.join("\n      ") : ""}`);
    await ref.ctx.close();
    await port.ctx.close();

    const spec = [];
    for (const w of [320, 390, 1440]) {
      const pg = await open(browser, PORT, w, 900);
      const r = await pg.page.evaluate(() => {
        const pre = [...document.querySelectorAll("main pre")].find((e) => e.textContent.includes("rule_draft@v5"));
        const page = document.documentElement.scrollWidth - document.documentElement.clientWidth;
        return { overflow: pre.scrollWidth - pre.clientWidth, tab: pre.tabIndex, page };
      });
      if (r.tab !== 0 || r.page > 0 || (w < 400 && r.overflow <= 0)) spec.push(`@${w}: ${JSON.stringify(r)}`);
      if (w === 390) {
        await pg.page.locator("main pre").focus();
        await pg.page.keyboard.press("ArrowRight");
        await pg.page.keyboard.press("ArrowRight");
        await pg.page.waitForTimeout(400); // Chrome animates keyboard scrolling
        const x = await pg.page.evaluate(() => document.querySelector("main pre").scrollLeft);
        if (!(x > 0)) spec.push(`@390: arrow keys did not scroll the spec (${x})`);
      }
      await pg.ctx.close();
    }
    check(!spec.length, `F4's rule spec scrolls inside its box (keyboard too), the page does not${spec.length ? ": " + spec.join("; ") : ""}`);

    // On phones no figure text runs past its white card (or, outside one, its band). The
    // reference's F2 order line does under a 334px column; the port lets that value wrap.
    const spill = [];
    for (const w of [430, 390, 375, 360, 320]) {
      const pg = await open(browser, PORT, w, 900);
      const r = await pg.page.evaluate(() => {
        const out = [];
        for (const fig of document.querySelectorAll("main figure")) {
          const band = fig.firstElementChild.getBoundingClientRect();
          const walk = document.createTreeWalker(fig, NodeFilter.SHOW_TEXT);
          for (let n = walk.nextNode(); n; n = walk.nextNode()) {
            const el = n.parentElement;
            if (!n.textContent.trim() || !el.getClientRects().length || el.closest("pre")) continue;
            let card = el;
            while (card !== fig && getComputedStyle(card).backgroundColor !== "rgba(255, 255, 255, 0.93)") card = card.parentElement;
            const box = card === fig ? band : card.getBoundingClientRect();
            const range = document.createRange();
            range.selectNodeContents(n);
            for (const rr of range.getClientRects())
              if (rr.right - box.right > 0.5 || box.left - rr.left > 0.5) out.push(n.textContent.trim().slice(0, 32));
          }
        }
        return [...new Set(out)];
      });
      if (r.length) spill.push(`@${w}: ${r.join(" | ")}`);
      await pg.ctx.close();
    }
    check(!spill.length, `no figure text runs past its card from 320 to 430px${spill.length ? ": " + spill.join("; ") : ""}`);
  }
} finally {
  await browser.close();
}
console.log(fails ? `\n${fails} check(s) failed` : "\nall checks passed");
process.exitCode = fails ? 1 : 0;
