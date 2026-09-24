#!/usr/bin/env node
// Lists every element whose own text is painted (partly) by a non-web font, on both sides.
//   node qa/polish-fallback-scan.mjs [--sel "#industries"]
import { chromium } from "@playwright/test";
const REF = "http://127.0.0.1:4100/3264%20Home.dc.html";
const PORT = "http://localhost:3000/?motion=off";
const i = process.argv.indexOf("--sel");
const scope = i === -1 ? "body" : process.argv[i + 1];
const browser = await chromium.launch({ channel: "chrome" });
for (const [name, url] of [["ref", REF], ["port", PORT]]) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("DOM.enable"); await cdp.send("CSS.enable");
  const { root } = await cdp.send("DOM.getDocument", { depth: -1 });
  const { nodeIds } = await cdp.send("DOM.querySelectorAll", { nodeId: root.nodeId, selector: `${scope} *` });
  const seen = new Map();
  for (const nodeId of nodeIds) {
    let fonts;
    try { ({ fonts } = await cdp.send("CSS.getPlatformFontsForNode", { nodeId })); } catch { continue; }
    const sys = fonts.filter((f) => !f.isCustomFont);
    if (!sys.length) continue;
    const { outerHTML } = await cdp.send("DOM.getOuterHTML", { nodeId });
    const own = outerHTML.replace(/<[^>]+>[\s\S]*?<\/[^>]+>/g, "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    const odd = [...own].filter((c) => c.charCodeAt(0) > 0x7e).join("");
    const key = sys.map((f) => f.familyName).join("+") + " " + odd;
    seen.set(key, (seen.get(key) || []).concat(own.slice(0, 40)));
  }
  for (const [k, v] of seen) console.log(`${name}: ${k} :: ${v.length} nodes, e.g. "${v[0]}"`);
  await ctx.close();
}
await browser.close();
