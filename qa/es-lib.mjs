// Shared helpers for the Essays QA scripts: the reference prototypes served on :4111 (see
// .claude/launch.json, "design reference: essays") against the port, which should be the
// production build (`npm run build`, then `next start`; dev's image optimiser stalls on first
// requests for new widths). Built on the Playbooks QA helpers (pb-lib.mjs).

import fs from "node:fs";

export { arg, diffPng, flag, launch, loadAll, outDir, pct, shootEl } from "./pb-lib.mjs";

export const REF = process.env.REF_URL || "http://127.0.0.1:4111";
export const PORT = process.env.PORT_URL || "http://localhost:3100";

/** The essays, from the handoff's data (num, slug, title, prototype file). */
export const ESSAYS = JSON.parse(fs.readFileSync(new URL("../design_handoff_essays/data/essays.json", import.meta.url), "utf8"));

export const refIndex = () => `${REF}/Essays.dc.html`;
export const portIndex = () => `${PORT}/essays`;
export const refEssay = (e) => `${REF}/${encodeURIComponent(e.prototypeFile)}`;
export const portEssay = (e) => `${PORT}/essays/${e.slug}`;

/** Open a page with motion frozen, fonts loaded and the Next dev overlay hidden. The essay
    prototypes compute their read time 900ms after mount; wait past that. */
export async function openPage(browser, url, w, h = 900, opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, reducedMotion: "reduce", ...opts });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => {
    if (m.type() === "error" && !/favicon|404 \(File not found\)|Failed to load resource/.test(m.text())) errors.push(m.text());
  });
  await page.goto(url, { waitUntil: "networkidle", timeout: 90000 });
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({ content: "nextjs-portal{display:none!important} *{caret-color:transparent!important}" });
  await page.waitForTimeout(1200);
  return { ctx, page, errors };
}

/** Whitespace-normalised text of an element, for content comparison. Superscript references
    and the copy-link label vary in spacing only. */
export const textOf = (page, sel) =>
  page.evaluate((s) => {
    const el = document.querySelector(s);
    return el ? el.innerText.replace(/\s+/g, " ").trim() : null;
  }, sel);

/** First point where two strings differ, with a little context. */
export function firstDiff(a, b) {
  if (a === b) return null;
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return `at ${i}: ref "…${a.slice(Math.max(0, i - 30), i + 40)}…" port "…${b.slice(Math.max(0, i - 30), i + 40)}…"`;
}
