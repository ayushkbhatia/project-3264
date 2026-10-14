#!/usr/bin/env node
// Encodes the site header's menu images from the design handoff into public/img/site-header:
//
//   design_handoff_site_header/reference/assets/playbooks/<slug>.png   -> thumb-<slug>.webp (×6)
//   design_handoff_site_header/reference/assets/playbooks/feat-*.png   -> feat-*.webp       (×2)
//   design_handoff_site_header/reference/assets/valley-pastel.png      -> feat-valley-pastel.webp
//
//   node scripts/site-header-assets.mjs
//
// The handoff PNGs are 1376×768 and 1.7–2.9MB each. The thumbnails display at 28–52px and the
// feature cards at about 340×236 (README, "Assets"), so they are cut to size here rather than
// served through next/image: 112px squares (the 52px tile at 2x, centre-cropped as the
// prototype's `center / cover` does) and 720px-wide cards. Static files, no optimiser calls.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "design_handoff_site_header/reference/assets");
const OUT = path.join(ROOT, "public/img/site-header");
fs.mkdirSync(OUT, { recursive: true });

const THUMBS = ["loan-ops-ledger", "covenant-watch", "nav-pack-review", "mandate-guardrails", "capital-call-flow", "side-letter-register"];
const FEATURES = [
  ["playbooks/feat-nav-pack-review.png", "feat-nav-pack-review.webp"],
  ["playbooks/feat-covenant-watch.png", "feat-covenant-watch.webp"],
  ["valley-pastel.png", "feat-valley-pastel.webp"],
];

const jobs = [
  ...THUMBS.map((slug) => ({
    from: `playbooks/${slug}.png`,
    to: `thumb-${slug}.webp`,
    run: (img) => img.resize(112, 112, { fit: "cover", position: "centre" }).webp({ quality: 82, effort: 6 }),
  })),
  ...FEATURES.map(([from, to]) => ({
    from,
    to,
    run: (img) => img.resize({ width: 720 }).webp({ quality: 80, effort: 6, smartSubsample: true }),
  })),
];

for (const { from, to, run } of jobs) {
  const src = path.join(SRC, from);
  const dest = path.join(OUT, to);
  await run(sharp(src)).toFile(dest);
  console.log(`${to.padEnd(30)} ${(fs.statSync(src).size / 1024).toFixed(0).padStart(6)}KB -> ${(fs.statSync(dest).size / 1024).toFixed(1).padStart(6)}KB`);
}
