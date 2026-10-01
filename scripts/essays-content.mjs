#!/usr/bin/env node
// Splits the Essays handoff's drafts into one Markdown file per essay:
//
//   design_handoff_essays/content/field-notes-drafts.md   the fifteen articles (Part 2)
//   design_handoff_essays/data/essays.json                 their metadata
//     -> src/content/essays/NN-<slug>.md                    frontmatter + the article body
//
//   node scripts/essays-content.mjs
//
// The body is the article as drafted, from its first paragraph through "#### Sources" and its
// list; the "## NN. Title" heading, the italic summary and the "Category · N min read · N words"
// line become frontmatter (title, dek), as the handoff's content model asks. Part 1 (editorial
// notes) and Part 3 (the combined source list) are not published and are not copied.
//
// The frontmatter values are JSON, one key per line (valid YAML too), so the loader needs no
// YAML parser. Titles and summaries are checked against essays.json; a mismatch stops the run.
// Rerun after the drafts change; edit the generated files directly once the drafts are retired.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const HANDOFF = path.join(ROOT, "design_handoff_essays");
const OUT = path.join(ROOT, "src/content/essays");

const drafts = fs.readFileSync(path.join(HANDOFF, "content/field-notes-drafts.md"), "utf8").replace(/\r\n/g, "\n");
const meta = JSON.parse(fs.readFileSync(path.join(HANDOFF, "data/essays.json"), "utf8"));

const part2 = drafts.slice(drafts.indexOf("## Part 2: The articles"), drafts.indexOf("## Part 3:"));
const chunks = part2.split(/^(?=## \d\d\. )/m).slice(1);
if (chunks.length !== meta.length) throw new Error(`found ${chunks.length} articles, essays.json has ${meta.length}`);

fs.mkdirSync(OUT, { recursive: true });
for (const old of fs.readdirSync(OUT)) if (old.endsWith(".md")) fs.unlinkSync(path.join(OUT, old));

const image = (p) => path.basename(p, path.extname(p)); // "assets/playbooks/feat-x.png" -> "feat-x"
const slugOf = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

for (const [i, chunk] of chunks.entries()) {
  const m = meta[i];
  const lines = chunk.replace(/\n---\s*$/, "").trimEnd().split("\n");
  const head = lines[0].match(/^## (\d\d)\. (.+)$/);
  if (!head || head[1] !== m.num || head[2] !== m.title) throw new Error(`article ${i + 1}: heading "${lines[0]}" vs ${m.num}. ${m.title}`);

  // "*Summary*", blank, "Category · N min read · N words", blank, then the body
  let k = 1;
  while (!lines[k].trim()) k++;
  const dek = lines[k].match(/^\*(.+)\*$/)?.[1];
  if (dek !== m.dek) throw new Error(`article ${m.num}: summary differs from essays.json`);
  k++;
  while (!lines[k].trim()) k++;
  const metaLine = lines[k].match(/^(\w+) · (\d+) min read · ([\d,]+) words$/);
  if (!metaLine || metaLine[1] !== m.category) throw new Error(`article ${m.num}: meta line "${lines[k]}"`);
  k++;
  while (!lines[k].trim()) k++;
  const body = lines.slice(k).join("\n").trim();

  const front = {
    num: m.num,
    slug: m.slug,
    title: m.title,
    dek: m.dek,
    category: m.category,
    date: m.date,
    image: image(m.image),
    related: slugOf(m.related),
    lead: m.lead,
    startHere: m.startHere,
    draftWords: Number(metaLine[3].replace(/,/g, "")),
  };
  const fm = Object.entries(front).map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join("\n");
  const file = path.join(OUT, `${m.num}-${m.slug}.md`);
  fs.writeFileSync(file, `---\n${fm}\n---\n\n${body}\n`);
  console.log(`${path.relative(ROOT, file)}  ${body.split(/\s+/).length} words`);
}
