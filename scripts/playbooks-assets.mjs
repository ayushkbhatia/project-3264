#!/usr/bin/env node
// Re-encodes the Playbooks page images from the design handoff into public/img/playbooks:
//
//   design_handoff_playbooks/reference/assets/playbooks/<slug>.png       tiles (×9)
//   design_handoff_playbooks/reference/assets/playbooks/feat-<slug>.png  carousel (×6)
//   design_handoff_playbooks/reference/assets/{subscribe,platform}-wash.png   CTA cards
//
//   node scripts/playbooks-assets.mjs
//
// The handoff PNGs are 1376×768 and 1.7–2.9MB each (~38MB in all). They become WebP sources
// at quality 92, visually lossless on these painted washes, so the repo does not carry the
// PNG weight twice; next/image then serves AVIF/WebP at the rendered size from these. The
// closing tile's valley-pastel.png is byte-identical to public/img/private-credit's and is
// reused from there. The originals stay in the handoff folder: rerun after replacing one.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "design_handoff_playbooks/reference/assets");
const OUT = path.join(ROOT, "public/img/playbooks");
fs.mkdirSync(OUT, { recursive: true });

const jobs = [
  ...fs.readdirSync(path.join(SRC, "playbooks")).filter((f) => f.endsWith(".png")).map((f) => path.join("playbooks", f)),
  "subscribe-wash.png",
  "platform-wash.png",
];

let before = 0, after = 0;
for (const rel of jobs) {
  const from = path.join(SRC, rel);
  const to = path.join(OUT, path.basename(rel, ".png") + ".webp");
  await sharp(from).webp({ quality: 92, effort: 6, smartSubsample: true }).toFile(to);
  const a = fs.statSync(from).size, b = fs.statSync(to).size;
  before += a; after += b;
  console.log(`${path.basename(to).padEnd(32)} ${(a / 1024).toFixed(0).padStart(6)}KB -> ${(b / 1024).toFixed(0).padStart(5)}KB`);
}
console.log(`total ${(before / 1048576).toFixed(1)}MB -> ${(after / 1048576).toFixed(1)}MB`);
