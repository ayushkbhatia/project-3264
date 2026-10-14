// The site header's content: the bar, the three desktop mega-panels and the phone sheet, set
// verbatim from the design handoff (design_handoff_site_header: menu-data.json, copy-deck.md and
// reference/Site Header.dc.html, which wins where they disagree). Do not rewrite, shorten or
// reorder. One source for both layouts, so the panels and the accordions cannot drift apart.
//
// Hrefs are this site's routes, not the handoff's suggested ones (its route map is a guide):
// - The five industry pages live under /industries.
// - Work has no page yet; it goes to the home page's case studies, as the old nav did. Swap in
//   "/work" here when that page ships.

import { routes } from "./home";

export type MenuKey = "engineering" | "transformation" | "industries";

export type MenuItem = {
  title: string;
  href: string;
  desc?: string;
  /** AI Transformation's programme steps: "01"–"04", in IBM Plex Mono. */
  num?: string;
  /** public/img/site-header thumbnail (scripts/site-header-assets.mjs). */
  thumb?: string;
  /** Left out of the phone sheet (AI Transformation's Engagement). */
  desktopOnly?: boolean;
};

export type MenuColumn = {
  label: string | null;
  layout: "grid-2" | "grid-2-numbered" | "compact-list" | "thumb-list" | "grid-2-thumb";
  items: MenuItem[];
  more?: { label: string; href: string };
  /** Left out of the phone sheet ("Built from playbooks": Playbooks is a top-level row there). */
  desktopOnly?: boolean;
};

export type Menu = {
  key: MenuKey;
  label: string;
  tagline: string;
  overview: { desktopLabel: string; mobileLabel: string; href: string };
  /** Pages at or under this path mark the trigger current (aria-current). */
  section: string;
  /** Grid template for the panel body: the columns, then the feature card. */
  grid: string;
  columns: MenuColumn[];
  feature: {
    eyebrow: string;
    title: string;
    cta: string;
    ctaStyle: "button" | "text";
    href: string;
    image: string;
    imagePosition?: string;
    /** The veil over the painting: [top, bottom] alpha, and where the bottom stop sits. */
    veil: [number, number, string];
    minHeight: number;
  };
};

export type PlainLink = { label: string; href: string };

const ai = routes.aiEngineering;
const at = routes.aiTransformation;
const img = (name: string) => `/img/site-header/${name}.webp`;

export const menus: Menu[] = [
  {
    key: "engineering",
    label: "AI Engineering",
    tagline: "Prototypes your team built, rebuilt to hold in production.",
    overview: { desktopLabel: "Overview →", mobileLabel: "AI Engineering overview →", href: ai },
    section: ai,
    grid: "minmax(0,1.5fr) minmax(0,1fr) minmax(0,1.05fr)",
    columns: [
      {
        label: "How it works",
        layout: "grid-2",
        items: [
          { title: "Two-week audit", desc: "We assess your systems and processes, then price the rebuild.", href: `${ai}#audit` },
          { title: "Rebuild", desc: "The prototype rebuilt to production standard, with tests and evaluation suites.", href: `${ai}#rebuild` },
          { title: "Platform", desc: "Runs in your cloud, under your access controls and audit trail.", href: `${ai}#platform` },
          { title: "Engagement", desc: "Two ways in. Neither starts with a platform licence.", href: `${ai}#engagement` },
          // design_handoff_production_assurance and _evaluation_suites, "Linkage": the two service
          // pages, recommended here
          { title: "Production Assurance", desc: "Held to an accuracy floor after go-live.", href: routes.productionAssurance },
          { title: "Evaluation Suites", desc: "Scored on your own cases, every night.", href: routes.evaluationSuites },
        ],
      },
      {
        label: "Built from playbooks",
        layout: "thumb-list",
        desktopOnly: true,
        items: [
          { title: "Loan Ops Ledger", href: `${routes.playbooks}/loan-ops-ledger`, thumb: img("thumb-loan-ops-ledger") },
          { title: "Covenant Watch", href: `${routes.playbooks}/covenant-watch`, thumb: img("thumb-covenant-watch") },
          { title: "NAV Pack Review", href: `${routes.playbooks}/nav-pack-review`, thumb: img("thumb-nav-pack-review") },
          { title: "Mandate Guardrails", href: `${routes.playbooks}/mandate-guardrails`, thumb: img("thumb-mandate-guardrails") },
        ],
        more: { label: "All nine playbooks →", href: routes.playbooks },
      },
    ],
    feature: {
      eyebrow: "Start here",
      title: "Measure one workflow before anything is built.",
      cta: "Book a two-week audit",
      ctaStyle: "button",
      href: `${ai}#audit`,
      image: img("feat-valley-pastel"),
      imagePosition: "center 60%",
      veil: [0.15, 0.82, "70%"],
      minHeight: 236,
    },
  },
  {
    key: "transformation",
    label: "AI Transformation",
    tagline: "Move a cost line, not just a pilot.",
    overview: { desktopLabel: "Overview →", mobileLabel: "AI Transformation overview →", href: at },
    section: at,
    grid: "minmax(0,1.5fr) minmax(0,1fr) minmax(0,1.05fr)",
    columns: [
      {
        label: "The programme",
        layout: "grid-2-numbered",
        items: [
          { num: "01", title: "Discover", desc: "Four weeks, fixed fee. Know what the process costs first.", href: `${at}#discover` },
          { num: "02", title: "Rewire", desc: "Rebuild the process instead of bolting AI onto it.", href: `${at}#rewire` },
          { num: "03", title: "Run", desc: "Agents run it. Your people hold the decisions.", href: `${at}#run` },
          { num: "04", title: "Optimise", desc: "Every cycle should cost less than the last.", href: `${at}#optimise` },
        ],
      },
      {
        label: "Foundations",
        layout: "compact-list",
        items: [
          { title: "Integration", desc: "Runs on top of the systems you already have.", href: `${at}#integration` },
          { title: "Control", desc: "Every change evidenced for risk and audit.", href: `${at}#control` },
          { title: "Engagement", desc: "Three ways in, each ending with something you keep.", href: `${at}#engagement`, desktopOnly: true },
        ],
      },
    ],
    feature: {
      eyebrow: "Work",
      title: "Engagements measured against the week before we arrived.",
      cta: "See the work →",
      ctaStyle: "text",
      href: routes.caseStudies,
      image: img("feat-nav-pack-review"),
      veil: [0.1, 0.86, "72%"],
      minHeight: 236,
    },
  },
  {
    key: "industries",
    label: "Industries",
    tagline: "Regulated finance, where every figure needs a source.",
    overview: { desktopLabel: "All industries →", mobileLabel: "All industries →", href: "/#industries" },
    section: "/industries",
    grid: "minmax(0,2.5fr) minmax(0,1.05fr)",
    columns: [
      {
        label: null,
        layout: "grid-2-thumb",
        items: [
          { title: "Private Credit", desc: "Covenant monitoring, agent notices and loan operations.", href: routes.privateCredit, thumb: img("thumb-covenant-watch") },
          { title: "Private Equity", desc: "Capital calls, LP reporting and portfolio monitoring.", href: routes.privateEquity, thumb: img("thumb-capital-call-flow") },
          { title: "Financial Services", desc: "Credit memos, KYC files, complaints and regulatory requests.", href: routes.financialServices, thumb: img("thumb-research-intake") },
          { title: "Fund Management", desc: "LP reporting cycles, distributions and side-letter obligations.", href: routes.fundManagement, thumb: img("thumb-side-letter-register") },
          { title: "Asset Management", desc: "Research synthesis, mandate compliance and client reporting.", href: routes.assetManagement, thumb: img("thumb-mandate-guardrails") },
        ],
      },
    ],
    feature: {
      eyebrow: "Playbooks",
      title: "Nine workflows, filed by industry.",
      cta: "Browse playbooks →",
      ctaStyle: "text",
      href: routes.playbooks,
      image: img("feat-covenant-watch"),
      veil: [0.1, 0.86, "72%"],
      minHeight: 200,
    },
  },
];

export const links: PlainLink[] = [
  { label: "Work", href: routes.caseStudies },
  { label: "Playbooks", href: routes.playbooks },
  { label: "Essays", href: routes.essays },
  { label: "Contact", href: routes.contact },
];

const audit = `${ai}#engagement`;

export const cta = {
  bar: { label: "Book an audit", href: audit },
  sheet: { label: "Book a two-week audit", href: audit },
  email: "hello@3264.ai",
} as const;
