// Capabilities probe: geometry of the pinned sequence on the reference (and port) at one size.
import { chromium } from "@playwright/test";
const REF = "http://127.0.0.1:4100/3264%20Home.dc.html";
const PORT = "http://localhost:3000/";
const which = process.argv[2] || "ref";
const w = +(process.argv[3] || 1440), h = +(process.argv[4] || 900);
const browser = await chromium.launch({ channel: "chrome", args: ["--hide-scrollbars"] });
const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: "reduce" });
const page = await ctx.newPage();
page.on("console", (m) => console.log("console." + m.type(), m.text()));
await page.goto(which === "ref" ? REF : PORT, { waitUntil: "networkidle" });
await page.waitForTimeout(800);
const info = await page.evaluate(() => {
  const sec = document.querySelector("#capabilities");
  const track = sec.children[1];
  const pin = track.firstElementChild;
  const grid = pin.firstElementChild;
  const stage = grid.children[1];
  const r = (el) => { const b = el.getBoundingClientRect(); return [Math.round(b.x), Math.round(b.y + (document.scrollingElement.scrollTop || document.body.scrollTop)), Math.round(b.width), Math.round(b.height)].join(","); };
  const sc = [document.scrollingElement, document.body].map((e) => e.tagName + ":" + e.scrollHeight + "/" + e.clientHeight + " ov=" + getComputedStyle(e).overflowY);
  return { sc, track: r(track) + " style=" + track.getAttribute("style"), pin: r(pin) + " style=" + pin.getAttribute("style"),
    grid: r(grid) + " style=" + grid.getAttribute("style"), stage: r(stage) + " style=" + stage.getAttribute("style"),
    left: r(grid.firstElementChild), wrap: grid.firstElementChild.children[1].getAttribute("style"),
    hosts: [...stage.children].map((c) => c.tagName + "#" + c.children.length),
    header: document.querySelector("header").offsetHeight };
});
console.log(JSON.stringify(info, null, 1));
await browser.close();
