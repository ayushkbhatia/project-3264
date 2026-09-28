// Shared helpers for the Covenant Watch QA scripts: the reference prototype on :4104 (see
// .claude/launch.json) against the port. Motion is frozen with reduced motion unless a script
// asks otherwise (the hero figure then shows its final state on both sides).
//
// The image waits here are bounded: under `next dev` the first request for each new image size
// is optimised on demand, and a wait with no limit can stall a run at a new width.

export { arg, diffPng, flag, launch, open, outDir, pct } from "./pb-lib.mjs";

export const REF = process.env.REF_URL || "http://127.0.0.1:4104/Covenant%20Watch.dc.html";
export const PORT = process.env.PORT_URL || "http://localhost:3000/playbooks/covenant-watch";

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
