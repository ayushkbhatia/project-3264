#!/usr/bin/env node
// Re-encodes the industry pages' paintings (Private Equity, Fund Management: the same files in
// both handoffs) from the design handoff into public/img/industry:
//
//   design_handoff_private_equity/reference/assets/{ai-eng-wash,audit-wash}.png  premise 1, value
//   design_handoff_private_equity/reference/assets/cta-a.jpeg                       premise 3
//   design_handoff_private_equity/reference/assets/{cta-e,cta-c}.webp               premise 2, portfolio
//
//   node scripts/industry-assets.mjs
//
// The PNGs become WebP at quality 92 (visually lossless on these washes), as
// scripts/playbooks-assets.mjs does; the JPEG and the two WebPs are copied as delivered (the
// grainy JPEG re-encodes larger than it arrived). next/image then serves them at the drawn size
// (components/ai-engineering/bg.ts). The pages' other images are already in public/ byte for
// byte: hero-valley (img/hero-valley.webp), valley-pastel and cta-valley (img/private-credit),
// cta-b and cta-d (img/ai-engineering) and footer-nocturne (img).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "design_handoff_private_equity/reference/assets");
const OUT = path.join(ROOT, "public/img/industry");
fs.mkdirSync(OUT, { recursive: true });

for (const f of ["ai-eng-wash.png", "audit-wash.png", "cta-a.jpeg", "cta-e.webp", "cta-c.webp"]) {
  const from = path.join(SRC, f);
  const to = path.join(OUT, f.replace(/\.png$/, ".webp"));
  if (!f.endsWith(".png")) fs.copyFileSync(from, to);
  else await sharp(from).webp({ quality: 92, effort: 6, smartSubsample: true }).toFile(to);
  console.log(`${path.basename(to).padEnd(20)} ${(fs.statSync(from).size / 1024).toFixed(0).padStart(6)}KB -> ${(fs.statSync(to).size / 1024).toFixed(0).padStart(5)}KB`);
}
