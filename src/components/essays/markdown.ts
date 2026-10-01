// The essays' Markdown, parsed into the blocks the essay template renders (EssayBody.tsx).
//
// The drafts (design_handoff_essays/content/field-notes-drafts.md, split into
// src/content/essays/*.md) use a small, regular subset, and this parser covers exactly that:
//
//   text before the first "###"     the introduction; its first paragraph is the lede
//   ### Heading / ### 1. Heading    a section; "1." becomes its "01" and leaves the heading
//   paragraphs, "- " lists, "1. " lists, | tables |, ``` code fences, "---" (dropped)
//   **bold**, *italic*, `code`, and references: " [1]" or " [3, 4]" (the space dropped)
//   #### Sources, then "1. Reference text. <https://…>"
//
// It is not a general Markdown parser, and it fails loudly on anything outside that subset, so
// a new construct in a future essay is caught at build time rather than rendered as raw text.

export type EssayInline =
  | { t: "text"; v: string }
  | { t: "strong"; c: EssayInline[] }
  | { t: "em"; c: EssayInline[] }
  | { t: "code"; v: string }
  /** Numbered references, rendered as superscript links to #ref-n. */
  | { t: "refs"; n: number[] };

export type EssayBlock =
  | { t: "p"; c: EssayInline[] }
  | { t: "ul"; items: EssayInline[][] }
  | { t: "ol"; items: EssayInline[][] }
  | { t: "table"; head: EssayInline[][]; rows: EssayInline[][][] }
  | { t: "code"; lang: string; lines: string[] };

export type EssaySection = {
  /** The anchor: the heading as a slug, cut at 48 characters, as the reference has them. */
  id: string;
  /** "01" for a numbered heading ("### 1. Ownership"). */
  num?: string;
  /** The heading, without its number (it is the contents label too). */
  label: string;
  blocks: EssayBlock[];
};

export type EssaySource = {
  n: number;
  text: EssayInline[];
  url?: string;
  /** The link's text: the URL's host, without "www." ("arxiv.org", "sec.gov"). */
  host?: string;
};

export type EssayDocument = {
  intro: EssayBlock[];
  sections: EssaySection[];
  sources: EssaySource[];
};

/** The reference's anchor ids: lower case, runs of anything else as one hyphen, at most 48. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48)
    .replace(/-$/, "");
}

/* ----------------------------------------------------------------- inline */

// Order matters: code spans first (their contents are literal), then bold before italic.
const INLINE = /(`[^`]+`)|(\*\*(?:[^*]|\*(?!\*))+?\*\*)|(\*[^*\s](?:[^*]*[^*\s])?\*)|( ?\[\d+(?:, ?\d+)*\])/g;

export function parseInline(src: string): EssayInline[] {
  const out: EssayInline[] = [];
  const text = (v: string) => {
    if (!v) return;
    const last = out[out.length - 1];
    if (last?.t === "text") last.v += v;
    else out.push({ t: "text", v });
  };
  let at = 0;
  for (const m of src.matchAll(INLINE)) {
    text(src.slice(at, m.index));
    const [whole, code, strong, em, refs] = m;
    if (code) out.push({ t: "code", v: code.slice(1, -1) });
    else if (strong) out.push({ t: "strong", c: parseInline(strong.slice(2, -2)) });
    else if (em) out.push({ t: "em", c: parseInline(em.slice(1, -1)) });
    else if (refs) out.push({ t: "refs", n: refs.replace(/[^\d,]/g, "").split(",").map(Number) });
    at = m.index! + whole.length;
  }
  text(src.slice(at));
  // An unmatched marker means the text uses something this parser does not know.
  for (const node of out) {
    if (node.t === "text" && /\*\*|`/.test(node.v)) throw new Error(`essay markdown: unparsed inline markup in "${node.v.slice(0, 80)}"`);
  }
  return out;
}

/** The inline's text as the browser lays it out (references run on: "arithmetic3,4."). */
export function plainText(nodes: EssayInline[]): string {
  return nodes
    .map((n) => (n.t === "text" || n.t === "code" ? n.v : n.t === "refs" ? n.n.join(",") : plainText(n.c)))
    .join("");
}

/* ----------------------------------------------------------------- blocks */

const cells = (row: string) =>
  row
    .trim()
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((c) => parseInline(c.trim()));

function parseBlocks(lines: string[], where: string): EssayBlock[] {
  const blocks: EssayBlock[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim() || line.trim() === "---") {
      i++;
    } else if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const body: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) body.push(lines[i++]);
      if (i === lines.length) throw new Error(`essay markdown: unclosed code fence in ${where}`);
      i++;
      blocks.push({ t: "code", lang, lines: body });
    } else if (line.startsWith("|")) {
      const rows: string[] = [];
      while (i < lines.length && lines[i].startsWith("|")) rows.push(lines[i++]);
      if (rows.length < 2 || !/^\|[\s|:-]+\|$/.test(rows[1].trim())) throw new Error(`essay markdown: malformed table in ${where}`);
      blocks.push({ t: "table", head: cells(rows[0]), rows: rows.slice(2).map(cells) });
    } else if (/^- /.test(line)) {
      const items: EssayInline[][] = [];
      while (i < lines.length && /^- /.test(lines[i])) items.push(parseInline(lines[i++].slice(2)));
      blocks.push({ t: "ul", items });
    } else if (/^\d+\. /.test(line)) {
      const items: EssayInline[][] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) items.push(parseInline(lines[i++].replace(/^\d+\. /, "")));
      blocks.push({ t: "ol", items });
    } else if (/^(#|>|\s+[-*\d])/.test(line)) {
      throw new Error(`essay markdown: unsupported line in ${where}: "${line.slice(0, 80)}"`);
    } else {
      const para: string[] = [];
      while (i < lines.length && lines[i].trim() && !/^(```|\||- |\d+\. |#|---$)/.test(lines[i])) para.push(lines[i++].trim());
      blocks.push({ t: "p", c: parseInline(para.join(" ")) });
    }
  }
  return blocks;
}

function parseSources(lines: string[], where: string): EssaySource[] {
  return lines
    .filter((l) => l.trim())
    .map((l, k) => {
      const m = l.match(/^(\d+)\. (.*?)(?: <(https?:\/\/[^>]+)>)?$/);
      if (!m || Number(m[1]) !== k + 1) throw new Error(`essay markdown: source ${k + 1} in ${where} reads "${l.slice(0, 80)}"`);
      const url = m[3];
      return { n: Number(m[1]), text: parseInline(m[2]), url, host: url ? new URL(url).hostname.replace(/^www\./, "") : undefined };
    });
}

/** Parses an essay's body (the Markdown after its frontmatter). `where` names it in errors. */
export function parseEssay(markdown: string, where: string): EssayDocument {
  const all = markdown.replace(/\r\n/g, "\n").split("\n");
  const s = all.findIndex((l) => l.trim() === "#### Sources");
  const body = s < 0 ? all : all.slice(0, s);
  const sources = s < 0 ? [] : parseSources(all.slice(s + 1), where);

  const heads = body.flatMap((l, k) => (l.startsWith("### ") ? [k] : []));
  const intro = parseBlocks(body.slice(0, heads[0] ?? body.length), `${where} (introduction)`);
  const sections = heads.map((h, k) => {
    const heading = body[h].slice(4).trim();
    const numbered = heading.match(/^(\d+)\. (.+)$/);
    const label = numbered ? numbered[2] : heading;
    return {
      id: slugify(label),
      num: numbered ? numbered[1].padStart(2, "0") : undefined,
      label,
      blocks: parseBlocks(body.slice(h + 1, heads[k + 1] ?? body.length), `${where} / ${label}`),
    };
  });
  const ids = new Set(sections.map((x) => x.id));
  if (ids.size !== sections.length) throw new Error(`essay markdown: two sections share an anchor in ${where}`);
  return { intro, sections, sources };
}
