// Shared helpers for the Contact QA scripts: the reference prototype served on :4112 (see
// .claude/launch.json, "design reference: contact") against the port, which should be the
// production build (`npm run build`, then `next start`), with CONTACT_WEBHOOK_URL pointing at a
// stand-in receiver for the form checks (see qa/ct-form.mjs).

export { arg, diffPng, flag, launch, outDir, pct } from "./pb-lib.mjs";

export const REF = process.env.REF_URL || "http://127.0.0.1:4112/Contact.dc.html";
export const BASE = (process.env.BASE_URL || "http://localhost:3100").replace(/\/$/, "");
export const PORT = `${BASE}/contact`;

/** Open a page with motion frozen (reduced motion holds both strips at their first frame), fonts
    loaded, every image decoded and the Next dev overlay hidden. */
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
  await page.evaluate(() => Promise.all([...document.images].map((i) => (i.complete ? i.decode().catch(() => {}) : new Promise((r) => { i.onload = i.onerror = r; })))));
  await page.addStyleTag({ content: "nextjs-portal{display:none!important} *{caret-color:transparent!important}" });
  await page.waitForTimeout(300);
  return { ctx, page, errors };
}

/** The elements both pages share, found by role or text so the two DOMs need not match. */
export const PARTS = {
  split: "#top",
  h1: "#top h1",
  lede: "#top h1 + p",
  builtOn: "text=Built on",
  strip: "img[alt='Anthropic'] >> xpath=ancestor::div[contains(@style,'overflow') or @data-logo-strip][1]",
  firstLogo: "#top img[alt='Anthropic']",
  card: "#top form >> xpath=..",
  nameLabel: "#top form span:text-is('Name')",
  name: "#top input[name=name]",
  email: "#top input[name=email]",
  message: "#top textarea[name=message]",
  submit: "#top button[type=submit]",
  note: "#top form span:text-is('We reply inside one business day.')",
  direct: "#top > div > p:has(> a[href^='mailto'])",
  footer: "footer",
};

/** Box of the first match, rounded to 0.1px, or null. */
export async function box(page, sel) {
  const loc = page.locator(sel).first();
  if (!(await loc.count())) return null;
  const b = await loc.boundingBox();
  return b && { x: +b.x.toFixed(1), y: +b.y.toFixed(1), w: +b.width.toFixed(1), h: +b.height.toFixed(1) };
}
