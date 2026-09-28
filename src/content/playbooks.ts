// Copy and data for the Playbooks library page (/playbooks), set verbatim from the design
// handoff (design_handoff_playbooks: CONTENT.md, data/playbooks.json and the reference
// prototype, reference/Playbooks.dc.html). Do not rewrite, shorten or reorder: curly quotes,
// arrows and line breaks are deliberate.
//
// "Recently updated" is PLACEHOLDER content (illustrative dates and notes). Replace it with the
// real changelog before launch; see `recentlyUpdated` below.

import type { HeaderNavItem } from "@/components/home/Header";
import type { FooterColumn } from "@/components/home/Footer";
import { routes, type Link } from "./home";

export const route = routes.playbooks;

export const meta = {
  title: "3264.ai — Playbooks",
  // New for this page (CONTENT.md: "suggested, for review").
  description:
    "Nine automation playbooks for private credit, fund management and asset management teams, each drawn from a workflow we have shipped.",
} as const;

// "Book an audit" and "Book a two-week audit" land on the AI Engineering page's engagement
// cards, where the audit is described and booked.
const audit = `${routes.aiEngineering}#engagement`;

function siteNav(playbooks: HeaderNavItem): HeaderNavItem[] {
  return [
    { label: "AI Engineering", href: routes.aiEngineering },
    { label: "AI Transformation", href: routes.aiTransformation },
    { label: "Industries", href: "/#industries" },
    { label: "Work", href: "/#work" },
    playbooks,
    { label: "Company", href: routes.company },
  ];
}

export const nav = siteNav({ label: "Playbooks", href: "#top", current: true });

/** The playbook pages (/playbooks/<slug>): "Playbooks" in ink, linking back to the library. */
export const articleNav = siteNav({ label: "Playbooks", href: routes.playbooks, current: "section" });

export const headerCta: Link = { label: "Book an audit", href: audit };

// "Deployment & Run", "Evaluation suites" and LinkedIn are placeholders in the handoff too.
function siteFooter(playbooksHref: string): FooterColumn[] {
  return [
    {
      head: "Services",
      links: [
        { label: "AI Engineering", href: routes.aiEngineering },
        { label: "AI Transformation", href: routes.aiTransformation },
        { label: "Deployment & Run", href: "/#capabilities" },
        { label: "Evaluation suites", href: "/#capabilities" },
      ],
    },
    {
      head: "Industries",
      links: [
        { label: "Private Credit", href: routes.privateCredit },
        { label: "Private Equity", href: routes.privateEquity },
        { label: "Fund Management", href: "/#industries" },
        { label: "Asset Management", href: "/#industries" },
      ],
    },
    {
      head: "Company",
      links: [
        { label: "Who we are", href: routes.companyWho },
        { label: "How we work", href: routes.companyHow },
        { label: "Case studies", href: "/#work" },
      ],
    },
    {
      head: "Resources",
      links: [
        // the reference sets it in the ordinary link colour, not as the current page
        { label: "Playbooks", href: playbooksHref },
        { label: "Field notes", href: "/#playbooks" },
        { label: "Security", href: routes.companyHow },
      ],
    },
    {
      head: "Connect",
      links: [
        { label: "Book a call", href: audit },
        { label: "hello@3264.ai", href: "mailto:hello@3264.ai" },
        { label: "LinkedIn", href: audit },
      ],
    },
  ];
}

export const footerColumns = siteFooter("#top");

/** The playbook pages' footer: the same columns, with Playbooks linking to the library. */
export const articleFooterColumns = siteFooter(routes.playbooks);

/* ------------------------------------------------------------------ data */

export type CategoryId = "private-credit" | "fund-management" | "asset-management";

export type Category = {
  id: CategoryId;
  label: string;
  /** "How we work in …"; the row header appends " →". */
  linkLabel: string;
  href: string;
};

export type Playbook = {
  slug: string;
  name: string;
  category: CategoryId;
  /** The one-liner, used by the tiles, the results and the carousel. */
  blurb: string;
  /** A detail page exists in this codebase. Until it does, /playbooks/<slug> redirects to the
      category page (src/app/playbooks/[slug]/page.tsx), so card links never need to change. */
  live: boolean;
};

export type RecentItem = {
  /** ISO date, for <time datetime>. */
  date: string;
  /** As displayed. */
  label: string;
  slug: string;
  note: string;
};

// Fund Management and Asset Management have no industry page yet: their "How we work" links
// point at the home page's industries section, as in the handoff.
export const categories: Category[] = [
  { id: "private-credit", label: "Private Credit", linkLabel: "How we work in Private Credit", href: routes.privateCredit },
  { id: "fund-management", label: "Fund Management", linkLabel: "How we work in Fund Management", href: "/#industries" },
  { id: "asset-management", label: "Asset Management", linkLabel: "How we work in Asset Management", href: "/#industries" },
];

// Order matters: the rows show them in this order, three per category.
//
// Loan Ops Ledger is `live` in the handoff (its detail page was built from a separate handoff),
// but that page is not in this codebase yet, so it redirects like the others until it lands.
// Covenant Watch is live: src/app/playbooks/covenant-watch.
export const playbooks: Playbook[] = [
  { slug: "covenant-watch", name: "Covenant Watch", category: "private-credit", blurb: "Borrower reporting packages read and tested against the credit agreement, with breaches flagged before quarter close.", live: true },
  { slug: "capital-call-flow", name: "Capital Call Flow", category: "private-credit", blurb: "Notices computed from the LPA, sent per investor and reconciled to the cash that actually arrives.", live: false },
  { slug: "loan-ops-ledger", name: "Loan Ops Ledger", category: "private-credit", blurb: "Agent notices matched to the loan system every day, with each break explained before month end.", live: false },
  { slug: "nav-pack-review", name: "NAV Pack Review", category: "fund-management", blurb: "Administrator NAV packs tied out line by line to your own records before the CFO signs.", live: false },
  { slug: "investor-reporting", name: "Investor Reporting", category: "fund-management", blurb: "Letters, statements and DDQ answers drafted from the systems of record and checked before they go out.", live: false },
  { slug: "side-letter-register", name: "Side-Letter Register", category: "fund-management", blurb: "Obligations read out of LPAs and side letters into a live register, with proof of delivery attached.", live: false },
  { slug: "mandate-guardrails", name: "Mandate Guardrails", category: "asset-management", blurb: "IMA restrictions encoded once, screened before and after every trade, and attested with evidence.", live: false },
  { slug: "client-reporting-flow", name: "Client Reporting Flow", category: "asset-management", blurb: "Performance and holdings reports composed per client and reconciled to the books before release.", live: false },
  { slug: "research-intake", name: "Research Intake", category: "asset-management", blurb: "Research, filings and transcripts summarised overnight in the house format, every claim cited.", live: false },
];

/** The carousel, in this fixed order. */
export const featured = [
  "covenant-watch",
  "nav-pack-review",
  "mandate-guardrails",
  "capital-call-flow",
  "side-letter-register",
  "research-intake",
] as const;

export type FeaturedSlug = (typeof featured)[number];

// PLACEHOLDER: illustrative entries from the handoff ("the research pack validated the need for
// each feature, not the build"). Replace with the real changelog, or drive from a CMS, before
// launch.
export const recentlyUpdated: RecentItem[] = [
  { date: "2026-09-22", label: "Sep 22", slug: "nav-pack-review", note: "Tolerance bands now set per asset class" },
  { date: "2026-09-18", label: "Sep 18", slug: "covenant-watch", note: "Equity-cure testing and cure-cap tracking" },
  { date: "2026-09-12", label: "Sep 12", slug: "research-intake", note: "Earnings-call transcripts added as a source" },
  { date: "2026-09-09", label: "Sep 9", slug: "loan-ops-ledger", note: "New break class for PIK toggles" },
  { date: "2026-09-02", label: "Sep 2", slug: "side-letter-register", note: "MFN elections tracked per investor" },
  { date: "2026-08-29", label: "Aug 29", slug: "capital-call-flow", note: "Side-letter excuse rights applied when each call is computed" },
];

export function playbookBySlug(slug: string): Playbook | undefined {
  return playbooks.find((p) => p.slug === slug);
}

export function categoryById(id: CategoryId): Category {
  return categories.find((c) => c.id === id)!;
}

/** Every card links here; see Playbook.live. */
export function playbookHref(slug: string): string {
  return `${routes.playbooks}/${slug}`;
}

/* ------------------------------------------------------------------ copy */

export const hero = {
  /** Two lines with a hard break after the comma. */
  titleLines: ["Every workflow we have shipped,", "drawn so you can start from it."],
  primary: { label: "Browse the library", href: "#library" },
  secondary: { label: "Book a two-week audit", href: audit },
} as const;

export const library = {
  all: "All",
  filterLabel: "Filter by industry",
  searchLabel: "Search playbooks",
  /** The bar is the page's search landmark (chips and search filter the same library). */
  regionLabel: "Playbook library",
} as const;

export const carousel = {
  regionLabel: "Featured playbooks",
  cta: "Read the playbook",
  show: (name: string) => `Show ${name}`,
  slideLabel: (n: number, total: number, name: string) => `${n} of ${total}: ${name}`,
  prev: "Previous playbook",
  next: "Next playbook",
  // Production addition (specs/03): WCAG 2.2.2 pause control.
  pause: "Pause carousel",
  play: "Play carousel",
} as const;

export const subscribe = {
  title: "Get new playbooks as they ship",
  body: "One email when a playbook is published or revised. Nothing else.",
  placeholder: "Work email",
  button: "Subscribe",
  success: "You are on the list.",
  // Production additions (specs/04, "new, for review").
  submitting: "Subscribing…",
  invalid: "Enter a work email address.",
  error: "Couldn't subscribe. Try again in a minute.",
} as const;

export const platform = {
  title: "See three playbooks on one platform",
  body: "Covenant Watch, Capital Call Flow and Loan Ops Ledger, running on the same record for a private credit fund.",
  /** Rendered with a trailing " →", hidden from screen readers. */
  link: { label: "See the Private Credit platform", href: routes.privateCredit },
} as const;

export const recent = {
  title: "Recently updated",
} as const;

export const results = {
  clear: "Clear",
  empty: "No playbook matches that search. Try a process name, such as covenant, capital call or NAV.",
  /** "3 playbooks in Private Credit", "1 playbook matching “covenant”". */
  label(n: number, category: string | null, query: string) {
    return (
      n +
      (n === 1 ? " playbook" : " playbooks") +
      (category ? " in " + category : "") +
      (query ? " matching “" + query + "”" : "")
    );
  },
} as const;

export const closing = {
  label: "Start",
  /** Two lines with a hard break. */
  titleLines: ["Pick the nearest playbook.", "A two-week audit matches your process to one of the nine."],
  body: "We price the build against the baseline the audit measures. If none of the nine fits, you leave with a ranked use-case ledger and no obligation to continue.",
  cta: { label: "Book a two-week audit", href: audit },
} as const;
