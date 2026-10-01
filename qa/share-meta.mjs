#!/usr/bin/env node
// Share cards: every page in the sitemap names the site share image (og:image with its size and
// alt), with the site name, locale and a large-image X card that falls back to it, and the image
// itself serves. A page that sets `openGraph` replaces the root layout's, share image included,
// unless it builds its metadata with pageMetadata (src/app/shared-metadata.ts); this catches one
// that does not. Plain HTTP, no browser.
//
//   BASE_URL=… node qa/share-meta.mjs
//
// Against the production build (`npm run build`, then `npx next start -p 3100`).

const BASE = process.env.BASE_URL || "http://localhost:3100";

const ENTITIES = { amp: "&", quot: '"', lt: "<", gt: ">", "#x27": "'" };
const decode = (s) => s.replace(/&(amp|quot|lt|gt|#x27);/g, (_, e) => ENTITIES[e]);

/** A page's <meta> tags as { property or name: content }; the first of a repeated key wins. */
function metaTags(html) {
  const tags = {};
  for (const [, attrs] of html.matchAll(/<meta\s([^>]*)>/g)) {
    const a = Object.fromEntries([...attrs.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, k, v]) => [k, decode(v)]));
    const key = a.property || a.name;
    if (key && !(key in tags)) tags[key] = a.content;
  }
  return tags;
}

/** The same path on BASE: the sitemap and og:image URLs carry the production origin. */
const onBase = (url) => {
  const u = new URL(url);
  return new URL(u.pathname + u.search, BASE).href;
};

const sitemap = await (await fetch(`${BASE}/sitemap.xml`)).text();
const pages = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, loc]) => new URL(loc).pathname);
if (!pages.length) throw new Error(`no <loc> in ${BASE}/sitemap.xml`);

let failures = 0;
const images = new Set();
for (const path of pages) {
  const res = await fetch(BASE + path);
  const tags = metaTags(await res.text());
  const problems = [];
  if (!res.ok) problems.push(`HTTP ${res.status}`);
  const expect = (key, ok) => {
    if (!ok(tags[key])) problems.push(`${key}=${JSON.stringify(tags[key] ?? null)}`);
  };
  expect("og:image", Boolean);
  expect("og:image:width", (v) => v === "1200");
  expect("og:image:height", (v) => v === "630");
  expect("og:image:alt", Boolean);
  expect("og:type", Boolean);
  expect("og:site_name", (v) => v === "3264.ai");
  expect("og:locale", (v) => v === "en_US");
  expect("twitter:card", (v) => v === "summary_large_image");
  expect("twitter:image", (v) => v && v === tags["og:image"]);
  if (tags["og:image"]) images.add(tags["og:image"]);
  if (problems.length) failures++;
  console.log(`${problems.length ? "FAIL" : "ok  "} ${path.padEnd(72)} ${problems.join(", ") || tags["og:image"]}`);
}

for (const url of images) {
  const res = await fetch(onBase(url));
  const type = res.headers.get("content-type");
  const ok = res.ok && type === "image/png";
  if (!ok) failures++;
  console.log(`${ok ? "ok  " : "FAIL"} image ${url} → ${res.status} ${type}`);
}

console.log(`${pages.length} pages, ${images.size} share image URL(s), ${failures} failure(s)`);
process.exitCode = failures ? 1 : 0;
