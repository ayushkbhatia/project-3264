#!/usr/bin/env node
// Capabilities scrub captures: reference vs port, motion ON, at fixed sequence progress p.
//
//   node qa/capabilities-scrub.mjs [--w 1440] [--h 900] [--ps 0.10,0.30,...] [--fine]
//                                  [--reduced] [--out qa/__screens__/capabilities/scrub]
//
// For each p, scrolls each side to  trackTop + p * (track.offsetHeight - (innerHeight - header))
// — the module's own mapping (_phP: off 0, span = track height - avail) — waits, screenshots
// the pin, and dumps the module's state: left-panel opacities, rail, caption/counter, the
// three stage-panel opacities and the visible text inside each stage panel. The state dump is
// compared field by field; the PNGs are written side by side for inspection by eye.
//
// --fine: skip screenshots; sample p every 0.005 through 0.27–0.35 and 0.60–0.70 and report
// the stage-panel opacities (never blank, never two legible).
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

const REF = "http://127.0.0.1:4100/3264%20Home.dc.html";
const PORT = "http://localhost:3000/";
const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); if (i === -1) return d; const v = process.argv[i + 1]; return v === undefined || v.startsWith("--") ? true : v; };
const W = +arg("w", 1440), H = +arg("h", 900);
const PS = String(arg("ps", "0.10,0.30,0.36,0.50,0.64,0.70,0.90")).split(",").map(Number);
const fine = !!arg("fine", false);
const reduced = !!arg("reduced", false);
const out = String(arg("out", `qa/__screens__/capabilities/scrub-${W}x${H}${reduced ? "-reduced" : ""}`));
fs.mkdirSync(out, { recursive: true });

async function open(browser, url) {
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, reducedMotion: reduced ? "reduce" : "no-preference" });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push("pageerror: " + e));
  page.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") errors.push(m.type() + ": " + m.text()); });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.keyboard.press("Escape"); // dismiss the intro if one is playing
  await page.waitForTimeout(1500);
  return { ctx, page, errors };
}

// Runs in the page. Works whether <body> scrolls (the prototype) or the window does (the port).
const scrubTo = (p) => {
  const sc = [document.body, document.scrollingElement].find((e) => e.scrollHeight > e.clientHeight + 8);
  const track = document.querySelector("#capabilities > div:nth-child(2)");
  const hdr = document.querySelector("header");
  const avail = innerHeight - (hdr ? hdr.offsetHeight : 0);
  const top = track.getBoundingClientRect().top + sc.scrollTop;
  sc.scrollTop = Math.round(top + p * (track.offsetHeight - avail));
  return sc.scrollTop;
};

const state = () => {
  const track = document.querySelector("#capabilities > div:nth-child(2)");
  const grid = track.firstElementChild.firstElementChild;
  const left = grid.children[0], stage = grid.children[1];
  const rail = [...left.children[0].children];
  const panels = [...left.children[1].children];
  const hosts = [...stage.children].filter((c) => c.tagName === "DIV" && c.style.bottom === "40px" || c.className.includes("bottom-10"));
  const vis = (n) => [...n.querySelectorAll("*")].filter((e) => e.offsetParent !== null && e.childElementCount === 0 && e.textContent.trim()).map((e) => e.textContent.trim());
  const foot = stage.lastElementChild;
  const op = (n) => (+getComputedStyle(n).opacity).toFixed(2);
  return {
    panels: panels.map(op).join(" "),
    rail: rail.map((r) => (getComputedStyle(r).borderTopColor === "rgb(21, 127, 82)" ? "A" : "-") + (getComputedStyle(r).color === "rgb(26, 25, 23)" ? "ink" : "mut")).join(" "),
    caption: [...foot.children].map((c) => c.textContent).join(" | "),
    hostOp: hosts.map((h) => h.style.opacity).join(" "),
    hostText: hosts.map((h) => (+h.style.opacity > 0.02 ? vis(h).join(" · ") : "")).filter(Boolean),
  };
};

const browser = await chromium.launch({ channel: "chrome", args: ["--hide-scrollbars"] });
try {
  const ref = await open(browser, REF), port = await open(browser, PORT);
  const sides = [["ref", ref], ["port", port]];
  if (fine) {
    const samples = [];
    for (let p = 0.27; p <= 0.3501; p += 0.005) samples.push(+p.toFixed(3));
    for (let p = 0.60; p <= 0.7001; p += 0.005) samples.push(+p.toFixed(3));
    let worstBlank = 1, worstBoth = 0, mismatches = 0;
    for (const p of samples) {
      const row = {};
      for (const [name, s] of sides) {
        await s.page.evaluate(scrubTo, p);
        await s.page.waitForTimeout(120);
        row[name] = await s.page.evaluate(state);
      }
      const ops = row.port.hostOp.split(" ").map(Number);
      const sorted = [...ops].sort((a, b) => b - a);
      worstBlank = Math.min(worstBlank, sorted[0]);
      worstBoth = Math.max(worstBoth, sorted[1]);
      const same = row.ref.hostOp === row.port.hostOp;
      if (!same) mismatches++;
      console.log(`p=${p.toFixed(3)}  stage [A B R] ref ${row.ref.hostOp.padEnd(14)} port ${row.port.hostOp.padEnd(14)} ${same ? "=" : "DIFF"}  left ${row.port.panels}`);
    }
    console.log(`\nmin over samples of the most opaque stage panel: ${worstBlank.toFixed(2)} (stage never blank if > 0)`);
    console.log(`max over samples of the second most opaque:     ${worstBoth.toFixed(2)} (two panels never both legible if well under 0.5)`);
    console.log(`ref/port opacity mismatches: ${mismatches}/${samples.length}`);
  } else {
    let mism = 0;
    for (const p of PS) {
      const row = {};
      for (const [name, s] of sides) {
        const y = await s.page.evaluate(scrubTo, p);
        await s.page.waitForTimeout(600);
        row[name] = await s.page.evaluate(state);
        row[name].y = y;
        await s.page.locator("#capabilities > div:nth-child(2) > div").screenshot({ path: path.join(out, `p${p.toFixed(2)}-${name}.png`) });
      }
      const a = PNG.sync.read(fs.readFileSync(path.join(out, `p${p.toFixed(2)}-ref.png`)));
      const b = PNG.sync.read(fs.readFileSync(path.join(out, `p${p.toFixed(2)}-port.png`)));
      let ratio = NaN;
      if (a.width === b.width && a.height === b.height) {
        const d = new PNG({ width: a.width, height: a.height });
        ratio = pixelmatch(a.data, b.data, d.data, a.width, a.height, { threshold: 0.1 }) / (a.width * a.height);
        fs.writeFileSync(path.join(out, `p${p.toFixed(2)}-diff.png`), PNG.sync.write(d));
      }
      console.log(`\n=== p=${p.toFixed(2)}  scrollTop ref ${row.ref.y} port ${row.port.y}  pixel diff ${(ratio * 100).toFixed(2)}% (${a.width}x${a.height} vs ${b.width}x${b.height})`);
      for (const k of ["panels", "rail", "caption", "hostOp", "hostText"]) {
        const r = JSON.stringify(row.ref[k]), q = JSON.stringify(row.port[k]);
        if (r === q) console.log(`  ${k.padEnd(8)} = ${r}`);
        else { mism++; console.log(`  ${k.padEnd(8)} REF  ${r}\n  ${"".padEnd(8)} PORT ${q}`); }
      }
    }
    console.log(`\nstate mismatches: ${mism}`);
  }
  for (const [name, s] of sides) if (s.errors.length) console.log(`${name} console:\n  ` + s.errors.join("\n  "));
  await ref.ctx.close(); await port.ctx.close();
} finally {
  await browser.close();
}
