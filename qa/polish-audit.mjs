#!/usr/bin/env node
// Semantics / colour / copy audit of the static sections.
//   node qa/polish-audit.mjs
// 1. Headings: h1 count, every h1-h3 with computed weight (must be 400).
// 2. Images: alt text of the stack logos and the footer image.
// 3. aria-hidden decoratives present.
// 4. Accent at rest: every element whose colour, background or border resolves to the accent.
// 5. Tabular numerals on the case-study values.
// 6. Copy diff: innerText of each owned section, reference vs port, whitespace-normalised.

import { chromium } from "@playwright/test";

const REF = "http://127.0.0.1:4100/3264%20Home.dc.html";
const PORT = "http://localhost:3000/?motion=off";
const SECTIONS = ["header", "#model", "#industries", "#work", "[data-screen-label='Stack']", "#company", "#playbooks", "#contact", "[data-screen-label='Footer image']", "footer"];

const browser = await chromium.launch({ channel: "chrome" });
async function open(url) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  return page;
}
const ref = await open(REF);
const port = await open(PORT);

console.log("== headings (port)");
console.log(await port.evaluate(() => {
  const hs = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")];
  const lines = hs.map((h) => {
    const sec = h.closest("[data-screen-label], header, footer");
    return `${getComputedStyle(h).fontWeight === "400" ? "ok " : "BAD"} <${h.tagName.toLowerCase()}> w=${getComputedStyle(h).fontWeight} [${sec ? sec.getAttribute("data-screen-label") || sec.tagName.toLowerCase() : "-"}] ${h.textContent.replace(/\s+/g, " ").trim().slice(0, 50)}`;
  });
  return `h1 count: ${document.querySelectorAll("h1").length}\n` + lines.join("\n");
}));

console.log("== images (port)");
console.log(await port.evaluate(() => [...document.querySelectorAll("[data-screen-label='Stack'] img, [data-screen-label='Footer image'] img")]
  .map((i) => `alt="${i.getAttribute("alt")}" ${i.getAttribute("width")}x${i.getAttribute("height")} loading=${i.getAttribute("loading")} src=${i.getAttribute("src").slice(0, 60)}`).join("\n")));

console.log("== aria-hidden in owned sections (port)");
console.log(await port.evaluate((sels) => sels.flatMap((s) => [...document.querySelectorAll(`${s} [aria-hidden='true']`)]
  .map((e) => `${s} <${e.tagName.toLowerCase()}> "${e.textContent.trim().slice(0, 12)}" class="${(e.getAttribute("class") || "").slice(0, 40)}"`)).join("\n"), SECTIONS));

const accentScan = (sels) => sels.flatMap((s) => {
  const root = document.querySelector(s);
  if (!root) return [];
  return [root, ...root.querySelectorAll("*")].flatMap((e) => {
    const cs = getComputedStyle(e);
    const hits = [];
    const A = "rgb(21, 127, 82)";
    const own = [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (own && cs.color === A) hits.push("color");
    if (cs.backgroundColor === A) hits.push("background");
    for (const side of ["Top", "Right", "Bottom", "Left"])
      if (cs[`border${side}Width`] !== "0px" && cs[`border${side}Style`] !== "none" && cs[`border${side}Color`] === A) hits.push(`border-${side.toLowerCase()}`);
    return hits.length ? [`${s} <${e.tagName.toLowerCase()}> "${e.textContent.trim().slice(0, 24)}" ${hits.join("+")}`] : [];
  });
});
console.log("== accent at rest (ref)");
console.log((await ref.evaluate(accentScan, SECTIONS)).join("\n"));
console.log("== accent at rest (port)");
console.log((await port.evaluate(accentScan, SECTIONS)).join("\n"));

console.log("== tabular numerals on case-study values (port)");
console.log(await port.evaluate(() => [...document.querySelectorAll("#work dd")].map((d) => `${getComputedStyle(d).fontVariantNumeric} ${d.textContent}`).join("\n")));

console.log("== copy diff");
const text = (page) => page.evaluate((sels) => sels.map((s) => {
  const el = document.querySelector(s);
  return el ? el.innerText.replace(/\s+/g, " ").trim() : "(missing)";
}), SECTIONS);
const [a, b] = [await text(ref), await text(port)];
let diffs = 0;
SECTIONS.forEach((s, i) => {
  if (a[i] === b[i]) { console.log(`ok   ${s} (${a[i].length} chars)`); return; }
  diffs++;
  let k = 0; while (k < a[i].length && a[i][k] === b[i][k]) k++;
  console.log(`DIFF ${s} at char ${k}:\n   ref : …${a[i].slice(Math.max(0, k - 30), k + 50)}\n   port: …${b[i].slice(Math.max(0, k - 30), k + 50)}`);
});
console.log(diffs ? `${diffs} section(s) differ` : "copy identical in all owned sections");
await browser.close();
