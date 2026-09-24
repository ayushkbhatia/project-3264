#!/usr/bin/env node
// Capabilities fit / overflow check across viewport sizes, reference vs port, motion ON.
//
//   node qa/capabilities-fit.mjs [--sizes 1280x800,1440x900,1920x1080,...] [--shots]
//
// At each size and each p, on both sides:
//   * the module's chosen fit tiers (Assess log pane / rows, Build list tier, Run chart height,
//     stage height, left-panel min-height) — must equal the reference's
//   * every visible descendant of each visible stage panel sits inside that panel's box
//   * each left panel fits its wrapper; stage and left column sit inside the pin
//   * at the release (p = 1 and beyond) the pin ends at the track's end, above Industries
// --shots also writes the release boundary (pin bottom + top of Industries) for both sides.
import { chromium } from "@playwright/test";
import fs from "node:fs";

const REF = "http://127.0.0.1:4100/3264%20Home.dc.html";
const PORT = "http://localhost:3000/";
const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); if (i === -1) return d; const v = process.argv[i + 1]; return v === undefined || v.startsWith("--") ? true : v; };
const SIZES = String(arg("sizes", "1280x800,1280x900,1280x1080,1440x800,1440x900,1440x1080,1920x800,1920x900,1920x1080")).split(",").map((s) => s.split("x").map(Number));
const shots = !!arg("shots", false);
const PS = [0.1, 0.3, 0.5, 0.64, 0.9, 1.0, 1.06];
fs.mkdirSync("qa/__screens__/capabilities/fit", { recursive: true });

const scrub = (p) => {
  const sc = [document.body, document.scrollingElement].find((e) => e.scrollHeight > e.clientHeight + 8);
  const track = document.querySelector("#capabilities > div:nth-child(2)");
  const hdr = document.querySelector("header");
  const avail = innerHeight - (hdr ? hdr.offsetHeight : 0);
  const top = track.getBoundingClientRect().top + sc.scrollTop;
  sc.scrollTop = Math.round(top + p * (track.offsetHeight - avail));
};

const measure = () => {
  const stage0 = document.querySelector("#capabilities > div:nth-child(2)").firstElementChild.firstElementChild.children[1];
  const key = Object.keys(stage0).find((k) => k.startsWith("__reactFiber$"));
  let s = null;
  for (let f = stage0[key]; f && !s; f = f.return) {
    if (f.stateNode && f.stateNode.phStep) s = f.stateNode;
    else if (f.stateNode && f.stateNode.logic && f.stateNode.logic.phStep) s = f.stateNode.logic;
    else for (let hk = f.memoizedState; hk && typeof hk === "object" && "next" in hk; hk = hk.next) { const c = hk.memoizedState && hk.memoizedState.current; if (c && c.phStep) { s = c; break; } }
  }
  const track = s.phTrack.current, pin = s.phPin.current, stage = s.phStage.current, grid = s.phGrid.current;
  const R = (n) => n.getBoundingClientRect();
  const problems = [];
  // stage panels: every visible descendant inside the panel's box
  [["assess", s.phAssess.current], ["build", s.phBuildP.current], ["run", s.phRun.current]].forEach(([name, host]) => {
    if (+host.style.opacity < 0.02) return;
    const hb = R(host);
    if (host.scrollHeight > host.clientHeight + 1) problems.push(`${name}: host scrollHeight ${host.scrollHeight} > ${host.clientHeight}`);
    host.querySelectorAll("*").forEach((el) => {
      if (!el.offsetParent && getComputedStyle(el).position !== "fixed") return;
      const b = R(el);
      if (!b.height) return;
      // clipped by an overflow:hidden ancestor inside the host is fine only if that ancestor fits
      if (b.bottom > hb.bottom + 0.5 || b.right > hb.right + 0.5) problems.push(`${name}: <${el.tagName.toLowerCase()}> "${(el.textContent || "").trim().slice(0, 30)}" bottom ${b.bottom.toFixed(1)} > panel ${hb.bottom.toFixed(1)}`);
    });
  });
  if (s._as && s.phOverflows(s._as.led)) problems.push("assess ledger overflows");
  if (s._bd && s._bd.list.style.display !== "none" && s.phOverflows(s._bd.list)) problems.push("build list overflows");
  if (s._rn && s.phOverflows(s._rn.plotWrap)) problems.push("run plot overflows");
  // left column
  const panels = [s.phP0.current, s.phP1.current, s.phP2.current], wrap = panels[0].parentElement;
  panels.forEach((n, i) => { if (n.scrollHeight > wrap.clientHeight + 1) problems.push(`left panel ${i} ${n.scrollHeight} > wrapper ${wrap.clientHeight}`); });
  const pb = R(pin), sb = R(stage), lb = R(grid.firstElementChild);
  if (sb.top < pb.top - 0.5 || sb.bottom > pb.bottom + 0.5) problems.push(`stage ${sb.top.toFixed(0)}-${sb.bottom.toFixed(0)} outside pin ${pb.top.toFixed(0)}-${pb.bottom.toFixed(0)}`);
  if (lb.top < pb.top - 0.5 || lb.bottom > pb.bottom + 0.5) problems.push(`left column ${lb.top.toFixed(0)}-${lb.bottom.toFixed(0)} outside pin ${pb.top.toFixed(0)}-${pb.bottom.toFixed(0)}`);
  const ind = document.querySelector("#industries");
  if (pb.bottom > R(ind).top + 0.5) problems.push(`pin bottom ${pb.bottom} paints into Industries (top ${R(ind).top})`);
  if (pb.bottom > R(track).bottom + 0.5) problems.push("pin extends past the track");
  const tiers = {
    stageH: stage.style.height, wrapMin: wrap.style.minHeight, cols: grid.style.gridTemplateColumns,
    assess: s._as ? [s._as.pane.style.display, s._as.pane.style.height, s._as.headLabel.style.display, s._as.foot.style.display, s._as.rowLimit, s._as.rows[0].style.padding].join(" ") : null,
    build: s._bd ? [s._bd.headLabel.style.display, s._bd.list.style.display, s._bd.caps[0].row.style.padding, s._bd.caps[0].tg.style.display].join(" ") : null,
    run: s._rn ? [s._rn.H, s._rn.sliceRow.style.display, s._rn.axis.style.display, s._rn.headLabel.style.display, s._rn.pBody.style.webkitLineClamp || "-"].join(" ") : null,
  };
  return { problems, tiers };
};

const browser = await chromium.launch({ channel: "chrome", args: ["--hide-scrollbars"] });
let fails = 0;
try {
  for (const [w, h] of SIZES) {
    const sides = {};
    for (const [name, url] of [["ref", REF], ["port", PORT]]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h } });
      const page = await ctx.newPage();
      const log = [];
      page.on("pageerror", (e) => log.push(String(e)));
      page.on("console", (m) => { if (m.type() === "error" && !/Failed to load resource/.test(m.text())) log.push(m.text()); });
      await page.goto(url, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      await page.keyboard.press("Escape");
      await page.waitForTimeout(1500);
      sides[name] = { ctx, page, log };
    }
    let line = `@${w}x${h}`, sizeOk = true, tierSig = "";
    for (const p of PS) {
      const res = {};
      for (const name of ["ref", "port"]) {
        await sides[name].page.evaluate(scrub, p);
        await sides[name].page.waitForTimeout(350);
        res[name] = await sides[name].page.evaluate(measure);
      }
      const same = JSON.stringify(res.ref.tiers) === JSON.stringify(res.port.tiers);
      if (!same) { sizeOk = false; fails++; console.log(`  p=${p} tiers DIFF\n    ref  ${JSON.stringify(res.ref.tiers)}\n    port ${JSON.stringify(res.port.tiers)}`); }
      if (res.port.problems.length) { sizeOk = false; fails++; console.log(`  p=${p} port problems: ${res.port.problems.join("; ")}`); }
      if (res.ref.problems.length) console.log(`  p=${p} (reference has the same kind of issue: ${res.ref.problems.join("; ")})`);
      tierSig = JSON.stringify(res.port.tiers);
    }
    console.log(`${line} ${sizeOk ? "OK" : "FAIL"}  tiers ${tierSig}`);
    if (shots) {
      for (const name of ["ref", "port"]) {
        const { page } = sides[name];
        await page.evaluate(scrub, 1.0);
        await page.waitForTimeout(400);
        // scroll so the end of the track sits in the middle of the viewport
        await page.evaluate(() => {
          const sc = [document.body, document.scrollingElement].find((e) => e.scrollHeight > e.clientHeight + 8);
          const t = document.querySelector("#capabilities > div:nth-child(2)");
          sc.scrollTop += t.getBoundingClientRect().bottom - innerHeight * 0.55;
        });
        await page.waitForTimeout(400);
        await page.screenshot({ path: `qa/__screens__/capabilities/fit/release-${w}x${h}-${name}.png` });
      }
    }
    for (const name of ["ref", "port"]) { if (sides[name].log.length) console.log(`  ${name} console: ${sides[name].log.join(" | ")}`); await sides[name].ctx.close(); }
  }
} finally {
  await browser.close();
}
console.log(fails ? `${fails} FAILURE(S)` : "all sizes fit, tiers identical to the reference");
process.exit(fails ? 1 : 0);
