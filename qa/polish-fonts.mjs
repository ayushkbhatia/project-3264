#!/usr/bin/env node
// Which platform fonts actually paint a node's text, on the reference and on the port.
//   node qa/polish-fonts.mjs "#industries a div:last-child" "#work dd" ...
// Uses CDP CSS.getPlatformFontsForNode, so fallback glyphs (e.g. an arrow the web font lacks)
// show up by the family that drew them.

import { chromium } from "@playwright/test";

const REF = "http://127.0.0.1:4100/3264%20Home.dc.html";
const PORT = "http://localhost:3000/?motion=off";
const sels = process.argv.slice(2);

const browser = await chromium.launch({ channel: "chrome" });
for (const [name, url] of [["ref", REF], ["port", PORT]]) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("DOM.enable");
  await cdp.send("CSS.enable");
  const { root } = await cdp.send("DOM.getDocument", { depth: -1 });
  for (const s of sels) {
    const { nodeIds } = await cdp.send("DOM.querySelectorAll", { nodeId: root.nodeId, selector: s });
    for (const nodeId of nodeIds.slice(0, 4)) {
      const { fonts } = await cdp.send("CSS.getPlatformFontsForNode", { nodeId });
      const { outerHTML } = await cdp.send("DOM.getOuterHTML", { nodeId });
      const text = outerHTML.replace(/<[^>]+>/g, "").slice(0, 30);
      console.log(`${name} ${s} "${text}": ${fonts.map((f) => `${f.familyName}${f.isCustomFont ? "*" : ""} x${f.glyphCount}`).join(", ")}`);
    }
  }
  await ctx.close();
}
await browser.close();
