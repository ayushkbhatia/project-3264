import { test, expect, Page } from "@playwright/test";

// Pixel checks need the video on the same origin as the page (self-hosted), otherwise the canvas is tainted.
const URL = process.env.PORT_URL ?? "http://localhost:3000/ai-engineering?intro=off";

async function canvasAlphaAt(page: Page, x: number, y: number) {
  return page.evaluate(([px, py]) => {
    const c = document.querySelector("#top canvas") as HTMLCanvasElement;
    const r = c.getBoundingClientRect();
    return c.getContext("2d")!.getImageData(Math.floor(px - r.left), Math.floor(py - r.top), 1, 1).data[3];
  }, [x, y]);
}

test.use({ viewport: { width: 1440, height: 900 } });

test("video plays under a greyscale veil", async ({ page }) => {
  const plane: string[] = [];
  page.on("request", (r) => { if (r.url().includes("hero-plane")) plane.push(r.url()); });
  await page.goto(URL, { waitUntil: "networkidle" });
  const vid = page.locator("#top video");
  await expect.poll(() => vid.evaluate((v: HTMLVideoElement) => v.readyState >= 2 && !v.paused), { timeout: 15000 }).toBe(true);
  expect(await vid.evaluate((v: HTMLVideoElement) => v.src)).not.toContain("cloudfront.net");
  await expect.poll(() => vid.evaluate((v: HTMLVideoElement) => v.style.filter)).toBe("none");

  const px = await page.evaluate(() => {
    const c = document.querySelector("#top canvas") as HTMLCanvasElement;
    const d = c.getContext("2d")!.getImageData(Math.floor(c.width / 2), Math.floor(c.height * 0.85), 1, 1).data;
    return { a: d[3], spread: Math.max(d[0], d[1], d[2]) - Math.min(d[0], d[1], d[2]) };
  });
  expect(px.a).toBe(255);
  expect(px.spread).toBeLessThanOrEqual(2);
  expect(plane).toEqual([]);
});

test("pointer trail reveals colour and refills", async ({ page }) => {
  await page.goto(URL, { waitUntil: "networkidle" });
  await expect.poll(() => page.locator("#top video").evaluate((v: HTMLVideoElement) => v.style.filter)).toBe("none");
  const box = (await page.locator("#top").boundingBox())!;
  const x = box.x + box.width / 2, y = box.y + box.height * 0.85;
  for (let k = 0; k < 14; k++) await page.mouse.move(x - 140 + k * 20, y);
  await page.waitForTimeout(250);
  expect(await canvasAlphaAt(page, x, y)).toBeLessThan(200);
  await page.waitForTimeout(2700);
  expect(await canvasAlphaAt(page, x, y)).toBe(255);
});

test("reduced motion holds the first frame", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  expect(await page.locator("#top video").evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
});
