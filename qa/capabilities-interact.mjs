#!/usr/bin/env node
// Capabilities interaction checks, reference vs port, motion ON unless --reduced.
//
//   node qa/capabilities-interact.mjs [rail|hover|resize|loops|reduced|all]
//
//   rail    click each rail tab: the scroll tweens (sampled mid-flight) and lands on its act
//   hover   tooltip over the stage; pointer leave clears it. The shipped diagrams have no
//           hover targets (phBuildScene is an empty hook), so a test mesh is injected into the
//           live instance through React's fiber to exercise the raycast → tooltip path
//   resize  at p=0.5, resize 1440→1280→1440: the act holds
//   loops   (port) Strict Mode: one phStep rAF loop, one WebGL context, no duplicated panel DOM,
//           across a reload, a destroy/rebuild over the 768px gate, and a navigate-away-and-back
//   reduced reduced motion: scroll still drives the sequence; nothing moves while idle
import { chromium } from "@playwright/test";

const REF = "http://127.0.0.1:4100/3264%20Home.dc.html";
const PORT = "http://localhost:3000/";
const which = process.argv[2] || "all";

// Instrumentation injected before any page script: counts phStep loop frames and WebGL
// context requests, and keeps console output.
const INIT = () => {
  window.__ph = { frames: 0, ticks: 0, gl: [], log: [] };
  const raf = window.requestAnimationFrame.bind(window);
  // baseline: the display's own frame rate, to turn phStep frames into a loop count
  const tick = () => { window.__ph.ticks++; raf(tick); };
  raf(tick);
  window.requestAnimationFrame = (cb) => {
    if (String(cb).includes("this.phStep(")) window.__ph.frames++;
    return raf(cb);
  };
  const gc = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (type, ...rest) {
    const ctx = gc.call(this, type, ...rest);
    if (/webgl/.test(type)) {
      if (!this.__id) this.__id = Math.random().toString(36).slice(2, 7);
      window.__ph.gl.push({ canvas: this.__id, type, same: !!this.__ctx && this.__ctx === ctx });
      this.__ctx = ctx;
    }
    return ctx;
  };
};

async function open(browser, url, { w = 1440, h = 900, reduced = false } = {}) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: reduced ? "reduce" : "no-preference" });
  const page = await ctx.newPage();
  const log = [];
  page.on("pageerror", (e) => log.push("pageerror: " + e.message));
  page.on("console", (m) => { if (["error", "warning"].includes(m.type()) && !/Failed to load resource/.test(m.text())) log.push(m.type() + ": " + m.text().split("\n")[0]); });
  page.on("response", (r) => { if (r.status() >= 400) log.push(`http ${r.status()}: ${r.url()}`); });
  await page.addInitScript(INIT);
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(1500);
  return { ctx, page, log };
}

// In-page helpers (serialisable).
const H = {
  geom: () => {
    const sc = [document.body, document.scrollingElement].find((e) => e.scrollHeight > e.clientHeight + 8);
    const track = document.querySelector("#capabilities > div:nth-child(2)");
    const hdr = document.querySelector("header");
    const avail = innerHeight - (hdr ? hdr.offsetHeight : 0);
    const top = track.getBoundingClientRect().top + sc.scrollTop;
    const span = track.offsetHeight - avail;
    return { y: sc.scrollTop, top, span, p: +((sc.scrollTop - top) / span).toFixed(4) };
  },
  scrub: (p) => {
    const sc = [document.body, document.scrollingElement].find((e) => e.scrollHeight > e.clientHeight + 8);
    const track = document.querySelector("#capabilities > div:nth-child(2)");
    const hdr = document.querySelector("header");
    const avail = innerHeight - (hdr ? hdr.offsetHeight : 0);
    const top = track.getBoundingClientRect().top + sc.scrollTop;
    sc.scrollTop = Math.round(top + p * (track.offsetHeight - avail));
  },
  act: () => {
    const grid = document.querySelector("#capabilities > div:nth-child(2)").firstElementChild.firstElementChild;
    const rail = [...grid.children[0].children[0].children];
    const foot = grid.children[1].lastElementChild;
    return {
      rail: rail.map((r) => (getComputedStyle(r).color === "rgb(26, 25, 23)" ? "ink" : "mut") + (r.getAttribute("aria-pressed") != null ? "/" + r.getAttribute("aria-pressed") : "")).join(" "),
      caption: [...foot.children].map((c) => c.textContent).join(" | "),
      panels: [...grid.children[0].children[1].children].map((n) => (+getComputedStyle(n).opacity).toFixed(2)).join(" "),
    };
  },
  // Find the live PlatformSequence instance: class component (reference) or useMotionSystem ref (port).
  inst: () => {
    const stage = document.querySelector("#capabilities > div:nth-child(2)").firstElementChild.firstElementChild.children[1];
    const key = Object.keys(stage).find((k) => k.startsWith("__reactFiber$"));
    for (let f = stage[key]; f; f = f.return) {
      if (f.stateNode && f.stateNode.phStep) return f.stateNode;
      if (f.stateNode && f.stateNode.logic && f.stateNode.logic.phStep) return f.stateNode.logic; // DC runtime
      for (let hk = f.memoizedState; hk && typeof hk === "object" && "next" in hk; hk = hk.next) {
        const c = hk.memoizedState && hk.memoizedState.current;
        if (c && c.phStep) return c;
      }
    }
    return null;
  },
};
const fn = (f) => `(${f})()`;

function line(label, a, b) {
  const same = JSON.stringify(a) === JSON.stringify(b);
  console.log(`  ${label.padEnd(22)} ${same ? "=" : "DIFF"}  ref ${JSON.stringify(a)}${same ? "" : `\n  ${"".padEnd(22)}       port ${JSON.stringify(b)}`}`);
  return same;
}

const browser = await chromium.launch({ channel: "chrome", args: ["--hide-scrollbars"] });
let fails = 0;
try {
  if (which === "rail" || which === "all") {
    console.log("\n== rail: click each tab from p=0.10");
    const ref = await open(browser, REF), port = await open(browser, PORT);
    for (const s of [ref, port]) { await s.page.evaluate(H.scrub, 0.10); await s.page.waitForTimeout(600); }
    for (const act of [2, 1, 0, 1]) {
      const res = {};
      for (const [name, s] of [["ref", ref], ["port", port]]) {
        const tab = s.page.locator("#capabilities > div:nth-child(2) > div > div > div:first-child > div:first-child > :nth-child(" + (act + 1) + ")");
        const before = await s.page.evaluate(fn(H.geom));
        await tab.click();
        const samples = [];
        for (let i = 0; i < 8; i++) { await s.page.waitForTimeout(60); samples.push((await s.page.evaluate(fn(H.geom))).p); }
        await s.page.waitForTimeout(1100);
        const after = await s.page.evaluate(fn(H.geom));
        res[name] = { from: before.p, midFlight: samples.slice(0, 4), landed: after.p, ...(await s.page.evaluate(fn(H.act))) };
      }
      console.log(` tab ${act}: port from p=${res.port.from} mid-flight ${res.port.midFlight.join(", ")} -> landed p=${res.port.landed} (target ${[0.06, 0.5, 0.9][act]})`);
      const tweened = res.port.midFlight.some((p) => Math.abs(p - res.port.from) > 0.01 && Math.abs(p - res.port.landed) > 0.01);
      if (!tweened) { fails++; console.log("  FAIL: no intermediate positions — jumped instead of tweening"); }
      if (Math.abs(res.port.landed - [0.06, 0.5, 0.9][act]) > 0.002) { fails++; console.log("  FAIL: did not land on the act"); }
      if (!line("landed p", res.ref.landed, res.port.landed)) fails++;
      line("rail (colour/aria)", res.ref.rail, res.port.rail.replace(/\/(true|false)/g, ""));
      console.log(`  ${"port aria-pressed".padEnd(22)}       ${res.port.rail}`);
      if (!line("caption", res.ref.caption, res.port.caption)) fails++;
      if (!line("left panels", res.ref.panels, res.port.panels)) fails++;
    }
    console.log("  console ref:", ref.log.filter((l) => !/404/.test(l)), " port:", port.log);
    await ref.ctx.close(); await port.ctx.close();
  }

  if (which === "hover" || which === "all") {
    console.log("\n== hover");
    const ref = await open(browser, REF), port = await open(browser, PORT);
    for (const [name, s] of [["ref", ref], ["port", port]]) {
      const { page } = s;
      await page.evaluate(H.scrub, 0.10);
      await page.waitForTimeout(400);
      const stage = page.locator("#capabilities > div:nth-child(2) > div > div > div:nth-child(2)");
      const box = await stage.boundingBox();
      const tip = () => page.evaluate(() => { const t = document.querySelector("#capabilities > div:nth-child(2) > div > div > div:nth-child(2)").children[6]; return { op: getComputedStyle(t).opacity, html: t.textContent }; });
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 4 });
      await page.waitForTimeout(400);
      const shipped = await tip();
      // inject a hover target into act 0 at the origin, which the camera centres on
      const ok = await page.evaluate(`(() => { const s = ${fn(H.inst)}; if (!s || !s.phGL) return "no instance";
        const T = s.phGL.T; const m = new T.Mesh(new T.BoxGeometry(3, 3, 3), new T.MeshBasicMaterial({ color: 0x157f52, transparent: true, opacity: 0.25 }));
        m.userData = { kind: "qa", id: "qa", t: "QA target", m: "raycast hit" }; m.name = "qa"; s.phGL.acts[0].add(m); window.__qaMesh = m; return "ok"; })()`);
      await page.mouse.move(box.x + box.width / 2 + 3, box.y + box.height / 2 + 2, { steps: 3 });
      await page.waitForTimeout(400);
      const over = await tip();
      await page.screenshot({ path: `qa/__screens__/capabilities/hover-${name}.png`, clip: { x: box.x + box.width / 2 - 150, y: box.y + box.height / 2 - 90, width: 300, height: 120 } });
      await page.mouse.move(box.x - 60, box.y + box.height / 2, { steps: 4 });
      await page.waitForTimeout(400);
      const left = await tip();
      await page.evaluate(() => { const m = window.__qaMesh; if (m) { m.parent.remove(m); m.geometry.dispose(); m.material.dispose(); } });
      console.log(`  ${name}: shipped scene -> tip opacity ${shipped.op}; injected target (${ok}) -> opacity ${over.op} "${over.html}"; after leave -> opacity ${left.op}`);
      if (name === "port" && !(shipped.op === "0" && over.op === "1" && /QA target/.test(over.html) && left.op === "0")) { fails++; console.log("  FAIL"); }
    }
    console.log("  console ref:", ref.log.filter((l) => !/404/.test(l)), " port:", port.log);
    await ref.ctx.close(); await port.ctx.close();
  }

  if (which === "resize" || which === "all") {
    console.log("\n== resize at p=0.5: 1440 -> 1280 -> 1440 (height 900)");
    const ref = await open(browser, REF), port = await open(browser, PORT);
    const res = { ref: [], port: [] };
    for (const [name, s] of [["ref", ref], ["port", port]]) {
      await s.page.evaluate(H.scrub, 0.5);
      await s.page.waitForTimeout(700);
      for (const w of [1440, 1280, 1440]) {
        await s.page.setViewportSize({ width: w, height: 900 });
        await s.page.waitForTimeout(800);
        const g = await s.page.evaluate(fn(H.geom)), a = await s.page.evaluate(fn(H.act));
        res[name].push({ w, p: g.p, caption: a.caption, panels: a.panels });
      }
    }
    res.port.forEach((r, i) => {
      console.log(`  @${r.w}: port p=${r.p} ${r.caption} [${r.panels}]   ref p=${res.ref[i].p} ${res.ref[i].caption}`);
      if (!/02 \/ 03/.test(r.caption) || r.panels !== "0.00 1.00 0.00") { fails++; console.log("  FAIL: act changed"); }
    });
    console.log("  console ref:", ref.log.filter((l) => !/404/.test(l)), " port:", port.log);
    await ref.ctx.close(); await port.ctx.close();
  }

  if (which === "loops" || which === "all") {
    console.log("\n== Strict Mode: loops, contexts, panel DOM (port, dev)");
    const port = await open(browser, PORT);
    const { page } = port;
    const cdp = await page.context().newCDPSession(page);
    // The module's own listeners, read from DevTools: window resize -> phLayout, stage pointer.
    const listeners = async () => {
      const count = async (expr, re) => {
        const { result } = await cdp.send("Runtime.evaluate", { expression: expr, objectGroup: "qa" });
        if (!result.objectId) return 0;
        const { listeners: ls } = await cdp.send("DOMDebugger.getEventListeners", { objectId: result.objectId });
        return ls.filter((l) => re.test(l.type) && /phLayout|phGL|phTip/.test(l.handler.description || "")).length;
      };
      return {
        resize: await count("window", /^resize$/),
        stage: await count("window.__stage || document.querySelector('#capabilities > div:nth-child(2)').firstElementChild.firstElementChild.children[1]", /^pointer(move|leave)$/),
      };
    };
    const snap = async (label, expectLoops) => {
      await page.evaluate(H.scrub, 0.5);
      await page.waitForTimeout(300);
      const [f0, t0] = await page.evaluate(() => [window.__ph.frames, window.__ph.ticks]);
      await page.waitForTimeout(1000);
      const r = await page.evaluate(`(() => {
        const s = ${fn(H.inst)};
        const stage = document.querySelector("#capabilities > div:nth-child(2)").firstElementChild.firstElementChild.children[1];
        const kids = [1, 3, 4, 5].map((i) => stage.children[i].childElementCount);
        const cv = stage.children[0];
        const mine = window.__ph.gl.filter((g) => g.canvas === cv.__id);
        const gl = s && s.phGL ? s.phGL.r.getContext() : null;
        return { frames: window.__ph.frames, ticks: window.__ph.ticks, kids, glCalls: mine.length, fresh: mine.filter((g) => !g.same).length,
          lost: gl ? gl.isContextLost() : null, inst: !!s, alive: !!(s && s.phGL) };
      })()`);
      const perSec = r.frames - f0, fps = r.ticks - t0;
      const loops = Math.round(perSec / fps);
      const L = await listeners();
      console.log(`  ${label.padEnd(30)} phStep ${String(perSec).padStart(3)} frames / ${fps} display frames (${loops} loop${loops === 1 ? "" : "s"})  hosts[labels,A,B,R] ${r.kids.join("/")}  phCv getContext ${r.glCalls}x -> ${r.fresh} context(s)  lost=${r.lost}  listeners resize=${L.resize} stage=${L.stage}`);
      if (expectLoops && (L.resize !== 1 || L.stage !== 2)) { fails++; console.log("  FAIL: listener count"); }
      if (loops !== expectLoops) { fails++; console.log("  FAIL: loop count"); }
      if (expectLoops && r.kids.join("/") !== "0/3/3/2") { fails++; console.log("  FAIL: panel DOM"); }
      if (expectLoops && r.fresh !== 1) { fails++; console.log("  FAIL: more than one WebGL context on phCv"); }
      if (expectLoops && r.lost !== false) { fails++; console.log("  FAIL: context"); }
      return r;
    };
    await snap("after load", 1);
    await page.reload({ waitUntil: "networkidle" }); await page.waitForTimeout(1500);
    await snap("after reload", 1);
    for (let i = 0; i < 3; i++) {
      await page.setViewportSize({ width: 700, height: 900 }); await page.waitForTimeout(500);
      const f0 = await page.evaluate(() => window.__ph.frames); await page.waitForTimeout(600);
      const f1 = await page.evaluate(() => window.__ph.frames);
      const kids = await page.evaluate(() => [...document.querySelector("#capabilities > div:nth-child(2)").firstElementChild.firstElementChild.children[1].children].slice(2, 6).map((c) => c.childElementCount).join("/"));
      const L = await listeners();
      console.log(`  below 768 (#${i + 1}): phStep frames in 600ms ${f1 - f0}, hosts ${kids} (destroyed, emptied), listeners resize=${L.resize} stage=${L.stage}`);
      if (f1 - f0 !== 0 || L.resize + L.stage !== 0) { fails++; console.log("  FAIL: loop or listeners survived destroy"); }
      await page.setViewportSize({ width: 1440, height: 900 }); await page.waitForTimeout(800);
      await snap(`rebuilt across 768 (#${i + 1})`, 1);
    }
    // Soft navigation: this app has a single route, so /?x=1 is the only client-side navigation
    // available (any other path is a hard load). It must leave exactly one live system.
    await page.evaluate(() => { window.__marker = 1; window.next.router.push("/?x=1"); });
    await page.waitForTimeout(1500);
    await page.goBack(); await page.waitForTimeout(1500);
    const soft = await page.evaluate(() => ({ url: location.pathname + location.search, sameDocument: window.__marker === 1 }));
    console.log(`  soft-navigated to /?x=1 and back (same document: ${soft.sameDocument}, now ${soft.url})`);
    await snap("after /?x=1 and history back", 1);

    // Unmount, in React's order: host nodes leave the document first, then the passive effect
    // cleanup calls destroy(). (A real client-side unmount needs a second route, which this app
    // does not have yet; this drives the same code path.)
    const un = await page.evaluate(`(() => {
      const s = ${fn(H.inst)};
      const track = document.querySelector("#capabilities > div:nth-child(2)");
      const cv = track.querySelector("canvas"), ctx = s.phGL.r.getContext();
      window.__stage = s.phStage.current;
      track.parentNode.removeChild(track);
      s.destroy();
      s.destroy(); // idempotent
      window.__f = window.__ph.frames;
      return { attached: cv.isConnected, lost: ctx.isContextLost(), gl: s.phGL };
    })()`);
    await page.waitForTimeout(600);
    const after = await page.evaluate(() => window.__ph.frames - window.__f);
    const L = await listeners();
    console.log(`  unmounted: canvas attached=${un.attached}, context released (lost)=${un.lost}, phGL=${un.gl}, phStep frames in 600ms ${after}, module listeners ${JSON.stringify(L)}`);
    if (un.lost !== true || after !== 0 || L.resize + L.stage !== 0) { fails++; console.log("  FAIL: unmount left something behind"); }
    console.log("  console:", port.log.length ? port.log : "(no errors or warnings)");
    await port.ctx.close();
  }

  if (which === "mobile" || which === "all") {
    console.log("\n== below 768: module not mounted, static fallback, no horizontal overflow (port)");
    for (const [w, h] of [[375, 812], [390, 844], [767, 1024], [768, 1024]]) {
      const port = await open(browser, PORT, { w, h });
      const { page } = port;
      await page.evaluate(() => document.querySelector("#capabilities").scrollIntoView());
      await page.waitForTimeout(600);
      const r = await page.evaluate(() => {
        const sec = document.querySelector("#capabilities");
        const track = sec.children[1], fallback = sec.children[2];
        const stage = track.firstElementChild.firstElementChild.children[1];
        const vis = (n) => getComputedStyle(n).display !== "none";
        const wide = [...sec.querySelectorAll("*")].filter((e) => vis(e) && e.offsetParent && e.getBoundingClientRect().right > innerWidth + 0.5).map((e) => e.tagName + ":" + e.getBoundingClientRect().right.toFixed(0));
        return { track: vis(track), fallback: vis(fallback), built: stage.children[3].childElementCount + stage.children[4].childElementCount + stage.children[5].childElementCount,
          frames: window.__ph.frames, h3: [...fallback.querySelectorAll("h3")].filter(vis).map((n) => n.textContent).join(","),
          scrollW: document.documentElement.scrollWidth, wide, sectionH: Math.round(sec.getBoundingClientRect().height) };
      });
      const mounted = w >= 768;
      console.log(`  @${w}x${h}: track ${r.track ? "shown" : "hidden"}, fallback ${r.fallback ? "shown [" + r.h3 + "]" : "hidden"}, module ${r.built ? "built" : "not built"} (phStep frames ${r.frames}), scrollWidth ${r.scrollW}, overflowing ${JSON.stringify(r.wide)}`);
      const ok = mounted ? r.track && !r.fallback && r.built === 8 && r.frames > 0 : !r.track && r.fallback && r.built === 0 && r.frames === 0 && r.h3 === "Assess,Build,Run";
      if (!ok || r.scrollW > w || r.wide.length) { fails++; console.log("  FAIL"); }
      if (!mounted) await page.locator("#capabilities").screenshot({ path: `qa/__screens__/capabilities/mobile-${w}.png` });
      console.log("  console:", port.log.length ? port.log : "(none)");
      await port.ctx.close();
    }
  }

  if (which === "reduced" || which === "all") {
    console.log("\n== reduced motion: scroll drives; idle is still");
    const ref = await open(browser, REF, { reduced: true }), port = await open(browser, PORT, { reduced: true });
    for (const p of [0.1, 0.5, 0.9]) {
      const r = {};
      for (const [name, s] of [["ref", ref], ["port", port]]) {
        await s.page.evaluate(H.scrub, p);
        await s.page.waitForTimeout(700);
        const pin = s.page.locator("#capabilities > div:nth-child(2) > div");
        const a = await pin.screenshot(); await s.page.waitForTimeout(1200); const b = await pin.screenshot();
        r[name] = { ...(await s.page.evaluate(fn(H.act))), idleStill: a.equals(b) };
      }
      console.log(`  p=${p}: port ${r.port.caption} [${r.port.panels}] idle-still=${r.port.idleStill} | ref ${r.ref.caption} [${r.ref.panels}] idle-still=${r.ref.idleStill}`);
      if (r.port.caption !== r.ref.caption || r.port.panels !== r.ref.panels || !r.port.idleStill) { fails++; console.log("  FAIL"); }
    }
    console.log("  console ref:", ref.log.filter((l) => !/404/.test(l)), " port:", port.log);
    await ref.ctx.close(); await port.ctx.close();
  }
} finally {
  await browser.close();
}
console.log(`\n${fails ? fails + " FAILURE(S)" : "all checks passed"}`);
process.exit(fails ? 1 : 0);
