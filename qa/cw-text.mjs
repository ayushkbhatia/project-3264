#!/usr/bin/env node
// Covenant Watch: the page's visible text, reference vs port, region by region (the copy is
// set verbatim from the prototype, so any difference is a transcription slip). Whitespace is
// normalised; the port's server-rendered read time is compared like any other string.
//
//   PORT_URL=… node qa/cw-text.mjs [--w 1440,390]

import { REF, PORT, arg, launch, open, settle } from "./cw-lib.mjs";

const widths = String(arg("w", "1440,390")).split(",").map(Number);
const REGIONS = [
  ["header", "header"],
  ["sidebar", "aside"],
  ["main", "main"],
  ["more", '[data-screen-label="More playbooks"]'],
  ["closing", '[data-screen-label="Closing"]'],
  ["footer", "footer"],
];

const norm = (s) => s.replace(/\s+/g, " ").trim();

function firstDiff(a, b) {
  let i = 0;
  while (i < a.length && a[i] === b[i]) i++;
  return i;
}

const browser = await launch();
let failures = 0;
try {
  for (const w of widths) {
    const ref = await open(browser, REF, w);
    const port = await open(browser, PORT, w);
    await settle(ref.page);
    for (const [name, sel] of REGIONS) {
      const get = (p) => p.evaluate((s) => document.querySelector(s)?.innerText ?? "", sel);
      const [a, b] = (await Promise.all([get(ref.page), get(port.page)])).map(norm);
      if (a === b) {
        console.log(`ok   @${w} ${name.padEnd(8)} ${a.length} chars`);
        continue;
      }
      failures++;
      const i = firstDiff(a, b);
      console.log(`DIFF @${w} ${name.padEnd(8)} at char ${i}:\n       ref:  …${a.slice(Math.max(0, i - 60), i + 80)}…\n       port: …${b.slice(Math.max(0, i - 60), i + 80)}…`);
    }
    await ref.ctx.close();
    await port.ctx.close();
  }
} finally {
  await browser.close();
}
process.exitCode = failures ? 1 : 0;
