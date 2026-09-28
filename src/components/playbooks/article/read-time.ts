import type { Block, Inline, PlaybookArticle, Rich } from "./types";

type Link = { label: string; href: string };

/**
 * The hero's "N min read": the reference's rule (README, "Behaviour") applied to the article's
 * content on the server. It counts the words of the main column as the reference renders it at
 * desktop width, figures excluded (the eyebrows, buttons, table heads and arrows included, the
 * FAQ with only its first answer open), divides by 230 and rounds, minimum 1.
 */
export function readMinutes(article: PlaybookArticle, cta: Link, showBuilt: boolean): number {
  const parts: string[] = [];
  const add = (...s: Array<string | null | undefined>) => {
    for (const x of s) if (x) parts.push(x);
  };
  const rich = (r: Rich) => (typeof r === "string" ? add(r) : (Array.isArray(r) ? r : [r]).forEach((p) => add(p.lead, p.text)));
  const inline = (a: Inline) => (typeof a === "string" ? a : a.map((p) => (typeof p === "string" ? p : p.label)).join(""));

  const { hero } = article;
  add("Playbook ·", hero.category.label, hero.title, hero.oneLiner, article.reviewed.label, "Copy link");
  add(hero.standfirst, cta.label, hero.secondary.label);

  const block = (b: Block) => {
    switch (b.type) {
      case "p":
        return add(b.text);
      case "roles":
        b.items.forEach((it, i) => add(String(i + 1), it.role, it.text));
        return add(b.note);
      case "io":
        return b.cards.forEach((c) => add(c.label, ...c.items));
      case "breaks":
        return b.items.forEach((it, i) => add(String(i + 1), it.title, it.text));
      case "platformCard":
        return add(b.title, b.text, b.link.label, "→");
      case "related":
        return add(b.label, b.title, b.text, b.cta, "→");
      case "stepTable":
        add(...b.head);
        return b.rows.forEach((r) => add(r.step, ...r.cells.map((c) => (typeof c === "string" ? c : (c?.faint ?? b.empty ?? "—")))));
      case "callout":
        return add(b.label, b.text);
      case "figure":
        return;
      case "h3":
        return add(b.text);
      case "bullets":
        return b.items.forEach(rich);
      case "kept":
        return b.items.forEach((it, i) => add(String(i + 1).padStart(2, "0"), it));
      case "note":
        return add(b.text);
      case "hardWe":
        return b.items.forEach((it) => add(b.labels[0], it.hard, b.labels[1], it.we));
      case "midCta":
        return add(b.title, b.text, cta.label);
      case "linkCard":
        return add(b.label, b.title, b.link.label, "→");
      case "rules":
        add(b.status);
        b.items.forEach((it) => add(it.date, it.title, it.text));
        return add(b.note);
      case "terms":
        return b.items.forEach((it) => add(it.term, it.def, it.note));
      case "updates":
        return b.items.forEach((it) => (typeof it === "object" && "date" in it ? add(it.date, it.text) : rich(it)));
      case "faq":
        return b.items.forEach((it, i) => add(it.q, i === 0 ? "−" : "+", i === 0 ? inline(it.a) : null));
    }
  };

  for (const s of article.sections) {
    add(s.eyebrow);
    if (s.technical && !showBuilt) {
      s.blocks.forEach((b) => b.type === "linkCard" && block(b));
      continue;
    }
    add(s.title);
    s.blocks.forEach(block);
  }

  const words = parts.join(" ").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 230));
}
