#!/usr/bin/env node
// Keyboard pass over the port: Tab through every stop, record the focused element and its
// computed outline, check the ring is not clipped by an overflow:hidden ancestor, and capture
// a few representative rings into qa/__screens__/polish/focus/.
//   node qa/polish-focus.mjs [--w 1440] [--url http://localhost:3000/?motion=off]

import { chromium } from "@playwright/test";
import fs from "node:fs";

const OUT = "qa/__screens__/polish/focus";
fs.mkdirSync(OUT, { recursive: true });
const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i === -1 ? d : process.argv[i + 1]; };
const W = Number(arg("w", 1440));
const URL = arg("url", "http://localhost:3000/?motion=off");
const SHOTS = new Set(["Book a call", "Industries", "R1 Private", "R4 Asset", "Playbook · 12", "Book a mapping session", "AI Engineering", "hello@3264.ai", "LinkedIn"]);

const browser = await chromium.launch({ channel: "chrome", args: ["--hide-scrollbars"] });
const ctx = await browser.newContext({ viewport: { width: W, height: 900 }, reducedMotion: "reduce" });
const page = await ctx.newPage();
await page.goto(URL, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.addStyleTag({ content: "nextjs-portal{display:none!important}" });

const total = await page.evaluate(() => document.querySelectorAll("a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])").length);
const seen = [];
let problems = 0;
for (let i = 0; i < total + 5; i++) {
  await page.keyboard.press("Tab");
  const info = await page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return null;
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const off = parseFloat(s.outlineOffset) + parseFloat(s.outlineWidth);
    // Is any overflow-clipping ancestor cutting the ring?
    let clipped = null;
    for (let a = el.parentElement; a && a !== document.documentElement; a = a.parentElement) {
      const as = getComputedStyle(a);
      if (as.overflow !== "visible" || as.overflowX === "clip") {
        const b = a.getBoundingClientRect();
        if (r.left - off < b.left || r.right + off > b.right || r.top - off < b.top || r.bottom + off > b.bottom) {
          clipped = a.tagName.toLowerCase() + (a.id ? "#" + a.id : "") + ` (${as.overflow})`;
          break;
        }
      }
    }
    const text = (el.innerText || el.getAttribute("aria-label") || "").replace(/\s+/g, " ").trim();
    const section = el.closest("[data-screen-label], header, footer");
    return {
      key: el.outerHTML.slice(0, 120),
      tag: el.tagName.toLowerCase(),
      text: text.slice(0, 44),
      where: section ? section.getAttribute("data-screen-label") || section.tagName.toLowerCase() : "-",
      outline: `${s.outlineStyle} ${s.outlineWidth} ${s.outlineColor} +${s.outlineOffset}`,
      visible: r.width > 0 && r.height > 0 && s.visibility !== "hidden",
      clipped,
    };
  });
  if (!info) break;
  if (seen.length && seen[0].key === info.key) break; // wrapped
  seen.push(info);
  const ok = info.outline === "solid 2px rgb(21, 127, 82) +2px" && info.visible && !info.clipped;
  if (!ok) problems++;
  console.log(`${ok ? "ok " : "BAD"} ${String(seen.length).padStart(2)} [${info.where}] <${info.tag}> ${info.text} :: ${info.outline}${info.clipped ? " CLIPPED by " + info.clipped : ""}${info.visible ? "" : " INVISIBLE"}`);
  const shotKey = [...SHOTS].find((k) => info.text.startsWith(k));
  if (shotKey) {
    const box = await page.evaluate(() => { const r = document.activeElement.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; });
    const clip = { x: Math.max(0, box.x - 14), y: Math.max(0, box.y - 14), width: Math.min(W - Math.max(0, box.x - 14), box.width + 28), height: box.height + 28 };
    await page.screenshot({ path: `${OUT}/${W}-${String(seen.length).padStart(2, "0")}-${shotKey.replace(/\W+/g, "-")}.png`, clip });
  }
}
console.log(`${seen.length} tab stops, ${total} focusable candidates in DOM, ${problems} problem(s)`);
await browser.close();
