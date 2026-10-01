import fs from "node:fs";
import path from "node:path";
import { parseEssay, type EssayDocument } from "@/components/essays/markdown";
import { essayImage } from "@/components/essays/media";
import { essayReadMinutes } from "@/components/essays/read-time";
import { playbookBySlug } from "./playbooks";
import { categories, essayCta, relatedLines, type EssayFront, type EssaySummary } from "./essays";

// The essays, read from src/content/essays/*.md on the server (at build time: every essay route
// is static). Each file is frontmatter (one `key: <JSON>` per line, see
// scripts/essays-content.mjs) and the article in Markdown (components/essays/markdown.ts).
// Server-only: client components get EssaySummary objects as props, never this module.

export type Essay = {
  front: EssayFront;
  doc: EssayDocument;
  readMinutes: number;
};

const DIR = path.join(process.cwd(), "src/content/essays");

function frontmatter(src: string, file: string): { front: EssayFront; body: string } {
  const m = src.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) throw new Error(`essays: ${file} has no frontmatter`);
  const front: Record<string, unknown> = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^(\w+): (.+)$/);
    if (!kv) throw new Error(`essays: ${file}: bad frontmatter line "${line}"`);
    front[kv[1]] = JSON.parse(kv[2]);
  }
  return { front: front as EssayFront, body: src.slice(m[0].length) };
}

function load(): Essay[] {
  const essays = fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((file) => {
      // Line endings normalised, so a checkout with CRLF endings parses the same.
      const { front, body } = frontmatter(fs.readFileSync(path.join(DIR, file), "utf8").replace(/\r\n/g, "\n"), file);
      // Fail the build on content the template cannot show, rather than shipping a broken page.
      if (`${front.num}-${front.slug}.md` !== file) throw new Error(`essays: ${file} does not match its num and slug`);
      if (!categories.includes(front.category)) throw new Error(`essays: ${file}: unknown category "${front.category}"`);
      if (!essayImage(front.image)) throw new Error(`essays: ${file}: unknown image "${front.image}"`);
      if (!playbookBySlug(front.related) || !relatedLines[front.related]) throw new Error(`essays: ${file}: unknown related playbook "${front.related}"`);
      const doc = parseEssay(body, file);
      return { front, doc, readMinutes: essayReadMinutes(front, doc, essayCta.mapping.label) };
    });
  if (essays.filter((e) => e.front.lead).length !== 1) throw new Error("essays: exactly one essay must be the lead");
  return essays;
}

let cache: Essay[] | undefined;

/** All essays, in number order. Read once per build; in development on every call, so an edit
    to the Markdown shows on the next reload without restarting the server. */
export function getEssays(): Essay[] {
  if (process.env.NODE_ENV !== "production") return load();
  return (cache ??= load());
}

export function getEssay(slug: string): Essay | undefined {
  return getEssays().find((e) => e.front.slug === slug);
}

export function summarize({ front, readMinutes }: Essay): EssaySummary {
  const { num, slug, title, dek, category, image, lead, startHere } = front;
  return { num, slug, title, dek, category, image, lead, startHere, readMinutes };
}
