// Shared helpers for the playbook-page QA scripts: a page's reference prototype (served per
// .claude/launch.json) against the port. Pick the page with --page (default covenant-watch);
// point at the port with BASE_URL (default http://localhost:3000), or PORT_URL / REF_URL for
// full URLs. Motion is frozen with reduced motion unless a script asks otherwise (the hero
// figure then shows its final state on both sides).
//
// The image waits here are bounded: under `next dev` the first request for each new image size
// is optimised on demand, and a wait with no limit can stall a run at a new width.

import { arg } from "./pb-lib.mjs";

export { arg, diffPng, flag, launch, open, outDir, pct } from "./pb-lib.mjs";

// The hero reveal's parts, found in the port's DOM: `ring` (step 1), `fade` (step 2, "values")
// and `rise` (step 3, "card"), each a selector and optionally the text it contains. `settles`: the
// page's trigger gives up after 4s if the reader has not reached the figure (the final state).
const LOL_PARTS = { ring: { sel: '[data-reveal="ring"]' }, fade: { sel: '[data-reveal="fade"]' }, rise: { sel: '[data-reveal="rise"]' } };
const PAGES = {
  "covenant-watch": { file: "Covenant%20Watch.dc.html", refPort: 4104, reveal: LOL_PARTS },
  "loan-ops-ledger": { file: "Loan%20Ops%20Ledger.dc.html", refPort: 4105, reveal: LOL_PARTS, settles: true },
  // F1: the Total due ringed, then the tie-out check, then Lanvik's excuse and the trace
  "capital-call-flow": {
    file: "Capital%20Call%20Flow.dc.html",
    refPort: 4106,
    reveal: {
      ring: { sel: '[data-reveal="ring"]' },
      fade: { sel: '[data-reveal="fade"]', text: "Σ LP lines" },
      rise: { sel: '[data-reveal="fade"]', text: "investment base" },
    },
    settles: true,
  },
  // F1: the six rows 40ms apart, then the explanation as the break turns "Break · explained". No
  // ring, so its own check in playbook-behaviour.mjs; `rise` (the explanation) is what the
  // settle check reads.
  "nav-pack-review": {
    file: "NAV%20Pack%20Review.dc.html",
    refPort: 4107,
    reveal: { rise: { sel: '[data-reveal="fade"]', text: "Fee basis should step down" } },
    settles: true,
  },
  // F1: six status dots grey to green 150ms apart and, under the sentence's four figures, an
  // underline drawing. No ring or fades: its own check in playbook-behaviour.mjs, which also
  // covers the final state for a reader who has not reached the figure within 4s.
  "investor-reporting": { file: "Investor%20Reporting.dc.html", refPort: 4108, reveal: {} },
  // F1: the five register rows 150ms apart, then Tamsin's row turns red. No ring either (its own
  // check in playbook-behaviour.mjs); `rise` (the last row) is what the settle check reads.
  "side-letter-register": {
    file: "Side-Letter%20Register.dc.html",
    refPort: 4109,
    reveal: { rise: { sel: '[data-reveal="fade"]', text: "SL-LSH-9.0" } },
    settles: true,
  },
  // F1: "investment grade" underlined, then the interpretation note, then the result turning PASS
  // (its bar, dot and word). No ring, so its own check in playbook-behaviour.mjs; `rise` (the
  // note) is what the settle check reads.
  "mandate-guardrails": {
    file: "Mandate%20Guardrails.dc.html",
    refPort: 4110,
    reveal: { rise: { sel: '[data-reveal="fade"]', text: "Interpretation note" } },
    settles: true,
  },
};

export const PAGE = arg("page", "covenant-watch");
if (!PAGES[PAGE]) throw new Error(`--page must be one of ${Object.keys(PAGES).join(", ")}`);
export const REVEAL = PAGES[PAGE].reveal;
export const REVEAL_SETTLES = !!PAGES[PAGE].settles;

export const REF = process.env.REF_URL || `http://127.0.0.1:${PAGES[PAGE].refPort}/${PAGES[PAGE].file}`;
export const PORT = process.env.PORT_URL || `${process.env.BASE_URL || "http://localhost:3000"}/playbooks/${PAGE}`;

/** [name, port selector, reference selector]. */
export const SECTIONS = [
  ["header", "header", "header"],
  ["hero", "#top", "#top"],
  ["today", "#today", "#today"],
  ["breaks", "#breaks", "#breaks"],
  ["runs", "#runs", "#runs"],
  ["evidence", "#evidence", "#evidence"],
  ["built", "#built", "#built"],
  ["rules", "#rules", "#rules"],
  ["terms", "#terms", "#terms"],
  ["updated", "#updated", "#updated"],
  ["questions", "#questions", "#questions"],
  ["more", '[data-screen-label="More playbooks"]', '[data-screen-label="More playbooks"]'],
  ["closing", '[data-screen-label="Closing"]', '[data-screen-label="Closing"]'],
  ["footer", "footer", "footer"],
];

/** Every image under `root` loaded and decoded, lazy ones started, for at most `ms`. */
const IMAGES_READY = async (root, ms) => {
  const imgs = [...(root || document).querySelectorAll("img")];
  imgs.forEach((i) => {
    if (i.loading === "lazy") i.loading = "eager";
  });
  const done = (i) =>
    i.complete
      ? i.decode().catch(() => {})
      : new Promise((r) => {
          i.addEventListener("load", () => i.decode().catch(() => {}).then(r), { once: true });
          i.addEventListener("error", r, { once: true });
        });
  await Promise.race([Promise.all(imgs.map(done)), new Promise((r) => setTimeout(r, ms))]);
};

/** Scroll the whole page so every lazy image starts, then wait (bounded) for them. */
export async function loadAll(page, ms = 45000) {
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += 400) {
    await page.evaluate((y) => scrollTo(0, y), y);
    await page.waitForTimeout(60);
  }
  await page.evaluate(`(${IMAGES_READY})(document, ${ms}).then(() => scrollTo(0, 0))`);
  await page.waitForTimeout(300);
}

export async function shootEl(page, sel, file) {
  const loc = page.locator(sel).first();
  await loc.scrollIntoViewIfNeeded();
  await page.evaluate(`(${IMAGES_READY})(document.querySelector(${JSON.stringify(sel)}), 15000)`);
  await page.waitForTimeout(150);
  await loc.screenshot({ path: file, animations: "disabled" });
}

/** The reference's read time appears ~900ms after mount; the port's is server-rendered. */
export async function settle(page) {
  await page.waitForTimeout(1200);
}
