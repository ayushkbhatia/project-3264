#!/usr/bin/env node
// Generates the tab icon, the Apple touch icon and the share image:
//
//   src/app/icon.svg              "32" in white on an ink rounded square, glyphs as paths
//   src/app/apple-icon.png        the same mark, 180×180, full bleed (iOS rounds the corners)
//   src/app/opengraph-image.png   1200×630: the hero painting under the hero's own page-colour
//                                 scrim, the wordmark and the h1, as the hero looks at 1200px
//
//   node scripts/brand-assets.mjs [--out <dir>]    (--out previews somewhere other than src/app)
//
// The icon is a STOPGAP until the designer supplies a mark: the handoff has none, and the
// create-next-app default was a third party's logo. Rerun after changing the headline or the
// painting, and commit the outputs; the App Router serves them as static metadata files.
//
// Type is Instrument Sans as outlines (scripts/brand-glyphs.py, python3 with fontTools and
// brotli), taken from the woff2 next/font has already downloaded into .next, so nothing new is
// fetched; run `npm run dev` or `npm run build` once first. Rasterising and compositing is sharp.

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outFlag = process.argv.indexOf("--out");
const APP = outFlag === -1 ? path.join(ROOT, "src/app") : path.resolve(process.argv[outFlag + 1]);
const GLYPHS = path.join(ROOT, "scripts/brand-glyphs.py");
// The lossless original; public/img/hero-valley.webp is the same painting, re-encoded.
const PAINTING = path.join(ROOT, "design_handoff_home/assets/hero-valley.png");

// Tokens from src/app/globals.css.
const INK = "#1A1917";
const PAGE = [246, 245, 242];

const font = execFileSync("python3", [GLYPHS, "--find", ".next/static/media", ".next/dev/static/media"], {
  cwd: ROOT,
  encoding: "utf8",
}).trim();

/** Sets runs of type as SVG path data; see brand-glyphs.py for the run fields. */
function glyphs(runs) {
  return JSON.parse(execFileSync("python3", [GLYPHS, font], { cwd: ROOT, input: JSON.stringify(runs), encoding: "utf8" }));
}

/* ------------------------------------------------------------------- icon */

// 32-unit grid. Weight and tracking are the wordmark's (primitives.tsx). The figures sit on
// even units so the baseline and the flat of the 2 land on whole pixels at 16px as well.
const ICON_TYPE = { text: "32", weight: 500, size: 21, tracking: -0.03 };
const ICON_BASELINE = 24;

function iconSvg({ radius, precision }) {
  const [probe] = glyphs([{ ...ICON_TYPE, x: 0, y: 0 }]);
  const [x0, , x1] = probe.bbox;
  // Centred on the ink, not the advance: trailing letter-spacing would pull it left.
  const x = (32 - (x1 - x0)) / 2 - x0;
  const [run] = glyphs([{ ...ICON_TYPE, x, y: ICON_BASELINE, precision }]);
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">` +
    `<rect width="32" height="32"${radius ? ` rx="${radius}"` : ""} fill="${INK}"/>` +
    `<path fill="#fff" d="${run.d}"/></svg>\n`
  );
}

fs.writeFileSync(path.join(APP, "icon.svg"), iconSvg({ radius: 7, precision: 2 }));
await sharp(Buffer.from(iconSvg({ radius: 0, precision: 3 })), { density: (72 * 180) / 32 })
  .resize(180, 180)
  .flatten({ background: INK })
  .png({ compressionLevel: 9, palette: false })
  .toFile(path.join(APP, "apple-icon.png"));

/* ------------------------------------------------------------ share image */

// The hero at a 1200px viewport, measured on the page (qa/fix-meta-hero-measure.mjs): the
// painting canvas is 1200×669.77 from the top of a 1058px section, faded by ART_MASK at 0.95
// opacity, under the section scrim (Hero.tsx). Both gradients are evaluated here per row, in
// px, exactly as the page lays them out, then cut at 630.
const W = 1200;
const H = 630;
const CANVAS_H = 669.765625;
const SECTION_H = 1058.15625;
const ART_MASK = [[0, 0], [0.09, 0.55], [0.26, 1], [0.82, 1], [1, 0]].map(([t, a]) => [t * CANVAS_H, a]);
const SCRIM = [[0, 0.86], [0.15, 0.3], [0.34, 0.1], [0.56, 0.06], [0.78, 0.34], [1, 0.86]].map(([t, a]) => [t * SECTION_H, a]);

function ramp(stops, y) {
  if (y <= stops[0][0]) return stops[0][1];
  for (let i = 1; i < stops.length; i++) {
    const [y1, a1] = stops[i];
    if (y <= y1) {
      const [y0, a0] = stops[i - 1];
      return a0 + ((a1 - a0) * (y - y0)) / (y1 - y0);
    }
  }
  return stops[stops.length - 1][1];
}

const art = await sharp(PAINTING)
  .resize(W, Math.round(CANVAS_H), { fit: "cover", position: "top" })
  .extract({ left: 0, top: 0, width: W, height: H })
  .removeAlpha()
  .raw()
  .toBuffer();

const base = Buffer.alloc(W * H * 3);
for (let y = 0; y < H; y++) {
  const cy = y + 0.5; // pixel centres, as the browser samples gradients
  const paint = ramp(ART_MASK, cy) * 0.95;
  const scrim = ramp(SCRIM, cy);
  for (let x = 0; x < W; x++) {
    for (let c = 0; c < 3; c++) {
      const i = (y * W + x) * 3 + c;
      const over = PAGE[c] * (1 - paint) + art[i] * paint;
      base[i] = Math.round(over * (1 - scrim) + PAGE[c] * scrim);
    }
  }
}

// Wordmark in the header's place, scaled up for thumbnails; the h1 two lines, centred, at
// line-height 1 like the page. Tracking is the site's: -0.03em and -0.038em.
const WORDMARK = { text: "3264.ai", weight: 500, size: 30, tracking: -0.03 };
const H1 = { weight: 400, size: 84, tracking: -0.038 };
const H1_LINES = ["Deployment is", "the deliverable."];
const H1_TOP = 212; // top of the first line box
// Line box of `line-height: 1`: half-leading + hhea ascent (970/1000, descent 250).
const baselineInBox = (size) => (size - size * 1.22) / 2 + size * 0.97;

const probes = glyphs(H1_LINES.map((text) => ({ ...H1, text })));
const runs = glyphs([
  { ...WORDMARK, x: 64, y: 56 + baselineInBox(WORDMARK.size) },
  ...H1_LINES.map((text, i) => ({
    ...H1,
    text,
    // text-align: center on the advance, trailing letter-spacing included, as Chrome does.
    x: (W - probes[i].advance) / 2,
    y: H1_TOP + i * H1.size + baselineInBox(H1.size),
  })),
]);
const type = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">` +
    runs.map((r) => `<path fill="${INK}" d="${r.d}"/>`).join("") +
    `</svg>`,
);

// Full colour, with every channel rounded to an even value: never more than 1/255 off, which
// no one can see and which cannot band the scrim, and ~530KB instead of ~655KB, under the
// ~600KB some messaging apps accept for a link-preview image. (A 256-colour palette was
// smaller still but dithered visible checkerboard patches into the hills.)
const { data: rgb } = await sharp(base, { raw: { width: W, height: H, channels: 3 } })
  .composite([{ input: type }])
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
for (let i = 0; i < rgb.length; i++) rgb[i] = Math.min(255, Math.round(rgb[i] / 2) * 2);
await sharp(rgb, { raw: { width: W, height: H, channels: 3 } })
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toFile(path.join(APP, "opengraph-image.png"));

for (const f of ["icon.svg", "apple-icon.png", "opengraph-image.png"]) {
  console.log(`${f}: ${fs.statSync(path.join(APP, f)).size} bytes`);
}
