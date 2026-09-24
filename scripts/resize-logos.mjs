#!/usr/bin/env node
// Re-exports the Stack section's vendor marks from the handoff originals at half size.
//
//   node scripts/resize-logos.mjs [--out <dir>]    (defaults to public/logos)
//
// The originals are 880×264. The page draws each one into a 50px-tall contain box, about
// 167×50 CSS px at 1440 (101×30 on phones), so 440×132 still covers a 2× desktop screen and
// a 3× phone. Halving is a plain 2×2 average on premultiplied colour: the same first
// reduction Chrome's mipmaps make of the full-size file, so the marks draw as they did from
// the originals (checked against the reference at 1× and 2× with qa/fix-meta-compare.mjs
// --logos). Lossless PNG; the page serves them as-is (Stack.tsx), no image optimizer.
//
// The handoff's brand4.png is the Cursor mark.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "design_handoff_home/assets/logos");
const outFlag = process.argv.indexOf("--out");
const OUT = outFlag === -1 ? path.join(ROOT, "public/logos") : path.resolve(process.argv[outFlag + 1]);
const RENAME = { "brand4.png": "cursor.png" };

fs.mkdirSync(OUT, { recursive: true });
for (const file of fs.readdirSync(SRC).filter((f) => f.endsWith(".png")).sort()) {
  const { data, info } = await sharp(path.join(SRC, file)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  if (width % 2 || height % 2) throw new Error(`${file}: ${width}×${height} does not halve evenly`);
  const w = width / 2, h = height / 2;
  const half = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let r = 0, g = 0, b = 0, a = 0;
      for (const [dx, dy] of [[0, 0], [1, 0], [0, 1], [1, 1]]) {
        const i = ((2 * y + dy) * width + 2 * x + dx) * 4;
        const alpha = data[i + 3];
        r += data[i] * alpha;
        g += data[i + 1] * alpha;
        b += data[i + 2] * alpha;
        a += alpha;
      }
      const o = (y * w + x) * 4;
      // Back to straight alpha for PNG; fully transparent pixels carry no colour.
      if (a) {
        half[o] = Math.round(r / a);
        half[o + 1] = Math.round(g / a);
        half[o + 2] = Math.round(b / a);
      }
      half[o + 3] = Math.round(a / 4);
    }
  }
  const name = RENAME[file] ?? file;
  await sharp(half, { raw: { width: w, height: h, channels: 4 } })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(path.join(OUT, name));
  console.log(`${name}: ${fs.statSync(path.join(SRC, file)).size} -> ${fs.statSync(path.join(OUT, name)).size} bytes, ${w}×${h}`);
}
