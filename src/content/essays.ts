// Copy and data for the Essays pages: the index (/essays) and the essay template
// (/essays/<slug>), set verbatim from the design handoff (design_handoff_essays: copy-deck.md,
// data/essays.json and the reference prototypes, Essays.dc.html and "Essay NN - ….dc.html").
//
// The essays themselves are Markdown, one file each in src/content/essays/ (frontmatter, then
// the article), loaded on the server by essays-source.ts. This module is client-safe: it holds
// the fixed strings, the nav and footer, and the types the pages pass to their client islands.

import type { HeaderNavItem } from "@/components/home/Header";
import { routes, type Link } from "./home";
import { siteFooter } from "./playbooks";

export const route = routes.essays;

/** The essay categories, in the filter chips' order. */
export const categories = ["Engineering", "Strategy", "Governance", "Product", "Operations"] as const;
export type EssayCategory = (typeof categories)[number];

/** An essay's frontmatter (src/content/essays/NN-<slug>.md), as the handoff's content model. */
export type EssayFront = {
  /** Two digits; shown as "No. 11". */
  num: string;
  slug: string;
  title: string;
  /** The italic summary under each heading in the drafts, set upright. */
  dek: string;
  category: EssayCategory;
  /** ISO. The drafting date for all fifteen; replace with real publish dates when scheduled. */
  date: string;
  /** The painting, by its handoff file name ("feat-capital-call-flow"): components/essays/media.ts. */
  image: string;
  /** The related playbook's slug. */
  related: string;
  /** The index's featured slots. */
  lead: boolean;
  startHere: boolean;
  /** The drafts' own word count, kept for reference (the read time is computed from the body). */
  draftWords: number;
};

/** What the index and the "More essays" cards need of an essay. */
export type EssaySummary = Pick<EssayFront, "num" | "slug" | "title" | "dek" | "category" | "image" | "lead" | "startHere"> & {
  readMinutes: number;
};

export function essayHref(slug: string): string {
  return `${routes.essays}/${slug}`;
}

/** "29 September 2026" for "2026-09-29". */
export function longDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][m - 1];
  return `${d} ${month} ${y}`;
}

/* ------------------------------------------------------------- site chrome */

const audit = `${routes.aiEngineering}#engagement`;

function siteNav(essays: HeaderNavItem): HeaderNavItem[] {
  return [
    { label: "AI Engineering", href: routes.aiEngineering },
    { label: "AI Transformation", href: routes.aiTransformation },
    { label: "Industries", href: "/#industries" },
    { label: "Work", href: "/#work" },
    { label: "Playbooks", href: routes.playbooks },
    essays,
    { label: "Contact", href: routes.contact },
  ];
}

/** The index: "Essays" is this page. */
export const nav = siteNav({ label: "Essays", href: "#top", current: true });

/** An essay page: "Essays" in ink, linking back to the index. */
export const articleNav = siteNav({ label: "Essays", href: routes.essays, current: "section" });

export const headerCta: Link = { label: "Book an audit", href: audit };

/** The Playbooks pages' footer, with Essays linking to the top of the index on the index. */
export const footerColumns = siteFooter(routes.playbooks, "#top");
export const articleFooterColumns = siteFooter(routes.playbooks, routes.essays);

/* ------------------------------------------------------------------ index */

export const meta = {
  title: "3264.ai — Essays",
  description:
    "Field notes for the executives, operators and engineers building AI systems at banks, fund managers and asset managers.",
} as const;

export const index = {
  title: "Essays",
  description:
    "Field notes for the executives, operators and engineers building AI systems at banks, fund managers and asset managers.",
  all: "All",
  filterLabel: "Filter by category",
  readLead: "Read the essay",
  allEssays: "All essays",
  /** "15 essays", "1 essay". */
  count: (n: number) => `${n} ${n === 1 ? "essay" : "essays"}`,
} as const;

export const signUp = {
  title: "Get new essays by email",
  body: "One email when we publish. Nothing else.",
} as const;

export const indexClosing = {
  label: "Start",
  /** Two lines with a hard break. */
  titleLines: ["Talk to the team behind these essays.", "A two-week audit starts with one process."],
  body: "We price the build against the baseline the audit measures, and you leave with a ranked use-case ledger either way.",
  cta: { label: "Book a two-week audit", href: audit },
} as const;

/* ------------------------------------------------------------- essay page */

/**
 * Every page CTA (sidebar card, mid-article band, closing) uses one of these; the reference's
 * `ctaLabel` prop picks the label, "Book a mapping session" by default. The mapping session is
 * a pre-addressed email until there is a booking URL (the handoff's open item).
 */
export const essayCta = {
  mapping: { label: "Book a mapping session", href: "mailto:hello@3264.ai?subject=Essays" },
  audit: { label: "Book a two-week audit", href: audit },
} as const;

export const page = {
  back: { label: "All essays", href: routes.essays },
  eyebrow: "Essay",
  overviewLabel: "Overview",
  sourcesLabel: "Sources",
  sidebarCard: "Questions about this essay? Talk to the team.",
  byline: { name: "3264.ai", mark: "3264", series: "Field notes" },
  midBand: {
    title: "Talk to the team",
    text: "Thirty minutes on one workflow: where its errors come from today, and what a harness would check before anything is relied on.",
  },
  relatedLabel: "Related playbook",
  relatedCta: "Read the playbook",
  more: { title: "More essays", all: { label: "All essays", href: routes.essays } },
  closing: {
    title: "Bring one process. We will measure it.",
    text: "Thirty minutes on one workflow: where its errors come from today, and what a harness would check.",
  },
} as const;

/**
 * The related-playbook card's line, verbatim from the essay prototypes. Four are the playbook
 * pages' own one-liners; Loan Ops Ledger's is its library blurb (its page's one-liner has moved
 * on since), and Client Reporting Flow's page has not shipped yet.
 */
export const relatedLines: Record<string, string> = {
  "covenant-watch":
    "Borrower certificates recomputed from the credit agreement's own definitions, with headroom, add-back caps and cure rights tracked every test date.",
  "capital-call-flow": "Calls computed from the LPA and side letters, sent per investor, and matched to the wires that arrive.",
  "loan-ops-ledger": "Agent notices matched to the loan system every day, with each break explained before month end.",
  "nav-pack-review": "Administrator NAV packs tied out line by line to your books, with every break explained before the CFO signs.",
  "investor-reporting":
    "Letters, capital account statements and DDQ answers drafted from your books, with every figure traced to source before release.",
  "client-reporting-flow":
    "Client reports built from reconciled books, each figure tied out and each commentary claim checked against attribution before release.",
};
