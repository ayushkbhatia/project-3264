import { categoryById, playbookBySlug } from "@/content/playbooks";
import { longDate, page, relatedLines, type EssayFront } from "@/content/essays";
import { plainText, type EssayBlock, type EssayDocument } from "./markdown";

/**
 * An essay's "N min read": the reference's rule applied on the server. The prototype counts the
 * words of the main column as it renders at desktop width (hero, body, the mid-article band,
 * the related-playbook card and the sources; there are no figures to leave out), divides by 230
 * and rounds, minimum 1. Computed once here so the index and the essay page agree; the index
 * prototype's "6 min read" is the drafts' earlier estimate, which the handoff asks production to
 * recompute from the body.
 */
export function essayReadMinutes(front: EssayFront, doc: EssayDocument, ctaLabel: string): number {
  const parts: string[] = [];
  const add = (...s: Array<string | undefined>) => {
    for (const x of s) if (x) parts.push(x);
  };
  const block = (b: EssayBlock) => {
    switch (b.t) {
      case "p":
        return add(plainText(b.c));
      case "ul":
        return b.items.forEach((it) => add(plainText(it)));
      case "ol":
        return b.items.forEach((it, i) => add(String(i + 1).padStart(2, "0"), plainText(it)));
      case "table":
        return [b.head, ...b.rows].forEach((row) => row.forEach((cell) => add(plainText(cell))));
      case "code":
        return add(...b.lines);
    }
  };

  add(page.eyebrow, "·", front.category, front.title, front.dek, longDate(front.date), "Copy link");
  add(page.byline.mark, page.byline.name, `${page.byline.series} · No. ${front.num}`);
  doc.intro.forEach(block);
  doc.sections.forEach((s) => {
    add(s.num, s.label);
    s.blocks.forEach(block);
  });
  add(page.midBand.title, page.midBand.text, ctaLabel);
  const playbook = playbookBySlug(front.related);
  if (playbook) add(`${page.relatedLabel} · ${categoryById(playbook.category).label}`, playbook.name, relatedLines[front.related], `${page.relatedCta} →`);
  add(page.sourcesLabel);
  doc.sources.forEach((s) => add(String(s.n), plainText(s.text), s.host));

  const words = parts.join(" ").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 230));
}
