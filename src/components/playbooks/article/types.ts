import type { Link } from "@/content/home";

// The content model shared by every playbook page (Covenant Watch, Loan Ops Ledger, Capital
// Call Flow, NAV Pack Review, …): one reusable template, PlaybookPage, fed by a per-page
// content module (src/content/<slug>.ts) and that page's figures.
//
// A page is a hero and a run of sections. Each section is a list of typed blocks, rendered in
// order with the reference's exact styles (blocks.tsx); a figure block names a slot in the
// page's figure map, so the illustrations stay per-page components.

/** A list item or paragraph with an optional bold lead-in (weight 500, ink). */
export type Rich = string | { lead: string; text?: string };

export type Block =
  /** Body paragraph: 15.5px / 1.7, 16px under what precedes it. */
  | { type: "p"; text: string }
  /** §01: who does each step today. Numbered rows, role left (210px), what they do right,
      and an optional small note under the list. */
  | { type: "roles"; items: Array<{ role: string; text: string }>; note?: string }
  /** §01: the Inputs and Outputs cards. */
  | { type: "io"; cards: Array<{ label: string; items: string[] }> }
  /** §02: numbered failure modes, each an h3 and a paragraph, optionally followed by a
      figure (a slot in the figure map) inside the same row. */
  | { type: "breaks"; items: Array<{ title: string; text: string; figure?: string }> }
  /** A card linking to a related page, with a painted thumbnail and playbook badges on it. */
  | { type: "platformCard"; icons: string[]; title: string; text: string; link: Link }
  /** §03: who does what at each step, in three lanes. `null` is an empty cell ("—"). */
  | {
      type: "stepTable";
      head: [string, string, string, string];
      rows: Array<{ step: string; cells: [string | null, string | null, string | null] }>;
    }
  /** A boxed note under an ink rule, e.g. "Never automated". */
  | { type: "callout"; label: string; text: string }
  /** A slot in the page's figure map. */
  | { type: "figure"; id: string }
  /** Subsection heading. With an id it is an anchor, listed under its section in the contents. */
  | { type: "h3"; text: string; id?: string; toc?: string }
  | { type: "bullets"; items: Rich[] }
  /** "Kept for every run": a two-column numbered list. */
  | { type: "kept"; items: string[] }
  /** "What is hard for machines": each difficulty beside what we do about it. */
  | { type: "hardWe"; labels: [string, string]; items: Array<{ hard: string; we: string }> }
  /** The dark mid-page band, with the page CTA. `tracked`: the button's -0.005em tracking,
      which Loan Ops Ledger has and Covenant Watch does not. */
  | { type: "midCta"; title: string; text: string; tracked?: boolean }
  /** A plain related-page card: small label, title, and an underlined link on the right. */
  | { type: "linkCard"; label: string; title: string; link: Link }
  /** Dated rules rows, optionally under a "Status as of …" line and over a closing note. */
  | { type: "rules"; items: Array<{ date: string; title: string; text: string }>; status?: string; note?: string }
  | { type: "terms"; items: Array<{ term: string; def: string }> }
  | { type: "updates"; items: Rich[] }
  | { type: "faq"; items: Array<{ q: string; a: string }> };

export type ArticleSection = {
  id: string;
  /** "01" … "06"; Terms, Recently updated and Questions have none. */
  num?: string;
  /** In the contents. */
  label: string;
  /** "01 / The work today". Without one the h2 has no top margin. */
  eyebrow?: string;
  /** Terms, Recently updated and Questions have an eyebrow-less h2 with no top margin. */
  title?: string;
  blocks: Block[];
  /** The engineering section: with `showBuilt` off it collapses to its eyebrow and its
      closing link card, and its subsections leave the contents. */
  technical?: boolean;
};

export type PlaybookArticle = {
  slug: string;
  meta: { title: string; description: string };
  /** ISO date and its display form ("Reviewed 28 September 2026"). */
  reviewed: { iso: string; label: string };
  hero: {
    /** "Playbook · " then this link. */
    category: Link;
    title: string;
    oneLiner: string;
    standfirst: string;
    /** The secondary hero button ("See how it is built"). */
    secondary: Link;
    /** Figure slot under the hero. */
    figure: string;
  };
  /** Every page CTA uses one of these, chosen by PlaybookPage's `cta` prop. */
  cta: { mapping: Link; audit: Link };
  back: Link;
  /** The contents entry for the hero. */
  overviewLabel: string;
  /** The sidebar card above the contents' CTA button. */
  sidebarCard: string;
  sections: ArticleSection[];
  more: {
    title: string;
    all: Link;
    items: Array<{ slug: string; blurb: string }>;
  };
  closing: { title: string; text: string };
  /** The mono labels on cards, the callout and the Hard / We pairs are block-level on some
      pages (Loan Ops Ledger) and inline on others (Covenant Watch), which changes their line
      box and so the spacing under them. */
  blockLabels?: boolean;
};

export type CtaVariant = keyof PlaybookArticle["cta"];

/** One contents entry (the sidebar and the phone bar share them). */
export type TocEntry = {
  id: string;
  num: string;
  label: string;
  subs: Array<{ id: string; label: string }>;
};
