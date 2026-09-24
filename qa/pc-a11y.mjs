#!/usr/bin/env node
// Private Credit: reduced motion, the pause control, the delivery CTA's inert state, and the
// heading outline as assistive tech sees it.
import { chromium } from "@playwright/test";
const PORT = "http://localhost:3000/industries/private-credit";

const ringInk = (page) => page.evaluate(() => {
  const c = document.querySelector("#top canvas");
  const x = c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
  let n = 0; for (let i = 3; i < x.length; i += 4) if (x[i] > 0) n++;
  return n;
});
const snap = async (page) => (await page.locator("#top canvas").screenshot()).toString("base64");

const browser = await chromium.launch({ channel: "chrome" });
try {
  // reduced motion: no intro, ring drawn (resolved frame) and still
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto(PORT, { waitUntil: "networkidle" });
    await page.waitForTimeout(1500);
    const a = await snap(page); await page.waitForTimeout(1200); const b = await snap(page);
    console.log(`reduced motion: ring pixels ${await ringInk(page)}, still ${a === b}`);
    await ctx.close();
  }
  // pause control: the ring stops, then resumes
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(PORT + "?intro=off", { waitUntil: "networkidle" });
    await page.waitForTimeout(1500);
    const moving1 = await snap(page); await page.waitForTimeout(700); const moving2 = await snap(page);
    const btn = page.getByRole("button", { name: /animations/ });
    await btn.click();
    await page.waitForTimeout(300);
    const p1 = await snap(page); await page.waitForTimeout(900); const p2 = await snap(page);
    const label = await btn.textContent(), pressed = await btn.getAttribute("aria-pressed");
    await btn.click();
    await page.waitForTimeout(300);
    const r1 = await snap(page); await page.waitForTimeout(700); const r2 = await snap(page);
    console.log(`pause: moving before ${moving1 !== moving2}, still while paused ${p1 === p2} (label "${label}", aria-pressed ${pressed}), moving after resume ${r1 !== r2}`);

    // delivery CTA: inert until the module makes it clickable
    const at = async (p) => {
      await page.evaluate((p) => {
        const sec = document.querySelector("#delivery");
        const track = [...sec.querySelectorAll("div")].find((d) => d.firstElementChild && getComputedStyle(d.firstElementChild).position === "sticky");
        scrollTo(0, track.getBoundingClientRect().top + scrollY + p * (track.offsetHeight - track.firstElementChild.offsetHeight));
      }, p);
      await page.waitForTimeout(900);
      return page.evaluate(() => {
        const a = [...document.querySelectorAll("#delivery a")].find((x) => x.textContent.includes("Start with the audit") && x.offsetParent);
        const cta = a.closest("[style*='z-index']");
        return { inert: cta.inert, pe: getComputedStyle(cta).pointerEvents, op: getComputedStyle(cta).opacity };
      });
    };
    console.log(`delivery CTA at p=0.03: ${JSON.stringify(await at(0.03))}; at p=0.95: ${JSON.stringify(await at(0.95))}`);

    // heading outline as exposed to AT
    const outline = await page.evaluate(() => [...document.querySelectorAll("h1,h2,h3")]
      .filter((h) => h.offsetParent !== null && !h.closest("[aria-hidden='true']") && h.textContent.trim())
      .map((h) => `${h.tagName} ${h.textContent.trim().slice(0, 50)}`));
    console.log("outline:\n  " + outline.join("\n  "));
    await ctx.close();
  }
} finally {
  await browser.close();
}
