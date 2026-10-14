// Copy for the Private Equity page, set verbatim from the design handoff
// (design_handoff_private_equity: copy-deck.md and the prototype, reference/Private Equity.dc.html,
// which wins where the two disagree): the shared chrome (metadata, closing image, footer) and,
// in `page`, every word and figure the shared industry components draw (components/industry,
// which Fund Management shares). The premise cards' three windows are markup, in
// components/private-equity/windows.tsx.
//
// All company names (Helix Logistics, Ardent Dental Group, Northfield Foods, Corvid Software,
// Beacon Claims, Tallis Engineering), "Fund III" and every £ figure are illustrative; each
// diagram carries its "Illustrative…" caption until signed-off engagement data replaces them.

import type { FooterColumn } from "@/components/home/Footer";
import type { IndustryPageData } from "@/components/industry/types";
import { routes } from "./home";

export const route = routes.privateEquity;

export const meta = {
  title: "3264.ai — Private Equity",
  // The hero's lede, as the other industry and service pages use theirs.
  description:
    "We find the workflows in each portfolio company where AI moves EBITDA, ship them onto one production platform, and carry what works to the next company. Every capability has an owner, a measured baseline and the evidence a buyer will ask for at exit.",
} as const;

// The closing image (components/home/FooterImage.tsx): the night sky, with this page's copy.
export const closing = {
  title: "Bring the evidence to exit.",
  cta: { label: "Book a portfolio audit", href: "#engagement" },
  positioning: "AI value creation for private equity portfolios, measured from the baseline to exit.",
  sequence: "32 → 64",
} as const;

// The prototype's footer, with this site's routes for its links (README, "Header and menu
// linkage"): Private Equity is this page; Case studies is the home page's selected engagements until a
// /work page exists; Essays stands in for "Field notes", as on every other page. "Book a call"
// and LinkedIn (no URL yet) are this page's engagement cards.
export const footerColumns: FooterColumn[] = [
  {
    head: "Services",
    links: [
      { label: "AI Engineering", href: routes.aiEngineering },
      { label: "AI Transformation", href: routes.aiTransformation },
      { label: "Production Assurance", href: routes.productionAssurance },
      { label: "Evaluation suites", href: "/#capabilities" },
    ],
  },
  {
    head: "Industries",
    links: [
      { label: "Private Credit", href: routes.privateCredit },
      // not marked current: the reference sets it in the ordinary link colour
      { label: "Private Equity", href: "#top" },
      { label: "Financial Services", href: routes.financialServices },
      { label: "Fund Management", href: routes.fundManagement },
      { label: "Asset Management", href: routes.assetManagement },
    ],
  },
  {
    head: "Company",
    links: [
      { label: "Who we are", href: routes.whoWeAre },
      { label: "How we work", href: routes.howWeWork },
      { label: "Case studies", href: routes.caseStudies },
      { label: "Contact", href: routes.contact },
    ],
  },
  {
    head: "Resources",
    links: [
      { label: "Playbooks", href: routes.playbooks },
      { label: "Essays", href: routes.essays },
      { label: "Security", href: routes.security },
    ],
  },
  {
    head: "Connect",
    links: [
      { label: "Book a call", href: "#engagement" },
      { label: "hello@3264.ai", href: "mailto:hello@3264.ai" },
      { label: "LinkedIn", href: "#engagement" },
    ],
  },
];

// ---------------------------------------------------------------- page (components/industry)

/** The page's words and the logic's data, for the shared industry components. */
export const page: IndustryPageData = {
  intro: {
    steps: [
      "audit the portfolio",
      "rank by EBITDA impact",
      "ship the first build",
      "carry it to the next company",
    ],
    live: "5 companies live",
  },
  statements: [
    "Every portfolio company has AI pilots. Most of them live on one person’s laptop.",
    "Six companies, six approaches. None of it rolls up into the board pack.",
    "The hold is still five years, and every number in the plan gets diligenced at exit.",
  ],
  // run-rate EBITDA (£m) and hours back a week added as each capability goes live, on days 42, 64 and 86
  plan: { kpi: [[42, 1.2, 310], [64, 0.5, 90], [86, 0.2, 140]], kpiText: (e) => "£" + e.toFixed(2) + "m" },
  value: {
    run: (add) => "£" + (14.2 + add).toFixed(1) + "m",
    pct: (add) => "+" + ((add / 14.2) * 100).toFixed(1) + "%",
    ev: (p) => "£" + (19.8 * p).toFixed(1) + "m",
  },
  // the audit loop's matrix and the five shortlisted cells' bubble targets (prototype dgData)
  audit: {
    cos: [
      ["Helix Logistics", "Logistics"],
      ["Ardent Dental Group", "Healthcare"],
      ["Northfield Foods", "Food distribution"],
      ["Corvid Software", "Vertical software"],
      ["Beacon Claims", "Insurance services"],
      ["Tallis Engineering", "Industrial services"],
    ],
    wf: [
      "Order to cash",
      "Procure to pay",
      "Month-end close",
      "Customer service",
      "Pricing and renewals",
      "Reporting",
    ],
    v: [
      [1.2, 0.5, 0.2, 0.3, 0.4, 0.1],
      [0.2, 0.1, 0.1, 0.5, 0.2, 0.1],
      [0.4, 0.3, 0.2, 0.1, 0.9, 0.2],
      [0.3, 0.1, 0.1, 0.5, 0.7, 0.2],
      [0.2, 0.2, 0.3, 0.8, 0.1, 0.3],
      [0.6, 0.4, 0.2, 0.1, 0.3, 0.1],
    ],
    top: {
      "0-0": [380, 82, 46],
      "2-4": [530, 209, 40],
      "4-3": [305, 251, 38],
      "3-4": [230, 293, 36],
      "5-0": [155, 336, 34],
    },
  },
  copy: {
    introLabel: "Portfolio log",
    hero: {
      eyebrow: "Private Equity",
      title: ["The value creation plan,", "in production by day 100."],
      lede: "We find the workflows in each portfolio company where AI moves EBITDA, ship them onto one production platform, and carry what works to the next company. Every capability has an owner, a measured baseline and the evidence a buyer will ask for at exit.",
      primary: "Book a portfolio audit",
      secondary: "See the first 100 days",
    },
    premise: {
      eyebrow: "01 / Premise",
      title: ["Every portfolio company is experimenting.", "Very little of it reaches EBITDA."],
      lede: "Operating partners are asked for an AI plan at every board meeting. The pilots are real and the intent is right. What is missing is the engineering that takes a pilot into production, measures it, and carries it to the next company.",
      cards: [
        { label: "what every company has", eyebrow: "What every company has" },
        { label: "what the fund sees", eyebrow: "What the fund sees" },
        { label: "what did not change", eyebrow: "What did not change" },
      ],
    },
    audit: {
      label: "Portfolio audit",
      eyebrow: "02 / Portfolio audit",
      title: "In two weeks, we walk the workflows in each portfolio company and rank where AI moves EBITDA.",
      yTicks: ["£0.4m", "£0.8m", "£1.2m"],
      yAxis: "EBITDA impact ↑",
      legend: "Estimated run-rate EBITDA, £m",
      bubbles: [
        "Helix · invoice matching",
        "Beacon · claims triage",
        "Corvid · renewal signals",
        "Tallis · invoice matching",
        "Northfield · promotion pricing",
      ],
      list: {
        title: "First builds · Fund III",
        rows: [
          ["Helix Logistics", "Freight invoice matching", "£1.2m", "6 wks"],
          ["Beacon Claims", "Claims triage", "£0.8m", "5 wks"],
          ["Corvid Software", "Renewal risk signals", "£0.7m", "4 wks"],
          ["Tallis Engineering", "Invoice matching, from build 01", "£0.6m", "3 wks"],
          ["Northfield Foods", "Promotion pricing", "£0.9m", "8 wks"],
        ],
        total: "£4.2m run-rate EBITDA across five builds",
        note: "Build 04 reuses build 01",
      },
      steps: [
        ["Days 1–6", "Interviews and system walk-throughs in every company", "→ workflow map"],
        [
          "Days 7–9",
          "Each workflow scored on impact, effort, data readiness and adoption risk",
          "→ scored matrix",
        ],
        ["Day 10", "A ranked, costed plan for each company and one for the fund", "→ first builds"],
      ],
      caption: "Illustrative portfolio. Real audits score every workflow on EBITDA impact, effort, data readiness and adoption risk, with the working attached.",
    },
    plan: {
      label: "First 100 days",
      eyebrow: "03 / First 100 days",
      title: ["The first hundred days,", "as a build log."],
      lede: "One senior squad works inside one portfolio company. Each capability ships behind an evaluation suite and reports against a baseline the company’s CFO signed before we started. By day 100 the platform runs in the company’s own cloud and the run-rate has been measured against that baseline.",
      window: "Build log — Helix Logistics · Fund III",
      rows: [
        ["Audit", "Days 0–14"],
        ["Platform", "Days 8–30"],
        ["Freight invoice matching", "Days 14–42"],
        ["Carrier rate checks", "Days 36–64"],
        ["Month-end accruals", "Days 56–86"],
        ["Evaluation and handover", "Days 70–100"],
      ],
      log: [
        ["D03", "Baseline signed by the CFO: 11.4 FTE on invoice matching"],
        ["D14", "Audit closed. Three capabilities, fortnightly releases"],
        ["D30", "Platform live in Helix’s own Azure tenant"],
        ["D42", "Invoice matching live · 93% matched without a person in week one"],
        ["D64", "Rate checks live · £38k of carrier overcharges flagged in month one"],
        ["D86", "Accruals live · month-end close down from 9 days to 6"],
        ["D100", "Evaluation suites handed over · run-rate measured at £1.9m"],
      ],
      kpi: {
        label: "Run-rate EBITDA impact",
        start: "£0.00m",
        sub: "Against the baseline signed on day 3",
        hours: "Hours back / wk",
      },
      board: {
        title: "Board pack · Q3",
        items: ["Freight invoice matching", "Carrier rate checks", "Month-end accruals"],
      },
      note: "Every figure comes from the platform’s own logs, reconciled to the ledger each month.",
    },
    portfolio: {
      label: "Portfolio",
      eyebrow: "04 / Portfolio",
      title: "Built once. Carried across the portfolio.",
      glow: "Each company goes live faster than the last.",
      lede: "A capability built at one company goes into a shared library on the platform. The next company installs it, adapts it to its own systems and data, and goes live in weeks.",
      library: "Capability library",
      slot: ["Invoice matching", "from Helix Logistics · v1.4"],
      sum: ["Time to live", "6 weeks → 1 week"],
      rows: [
        ["Helix Logistics", "Logistics · built here"],
        ["Tallis Engineering", "Industrial services · installed"],
        ["Northfield Foods", "Food distribution · installed"],
        ["Beacon Claims", "Insurance services · installed"],
        ["Ardent Dental Group", "Healthcare · installed"],
      ],
      deltas: ["First build", "−50%", "−67%", "−75%", "−83%"],
      chip: "Invoice matching",
      caption: "Illustrative five-company programme. Timings depend on each company’s systems and data.",
    },
    value: {
      eyebrow: "05 / Value",
      title: ["Value you can bridge,", "line by line."],
      lede: "Every capability reports against a baseline the portfolio company signed before the build. The value creation plan carries measured numbers, and the same evidence goes into the data room at exit.",
      window: "Board pack — Helix Logistics · Q3 value creation update",
      chart: "EBITDA bridge, run-rate",
      axis: "£m · axis starts at 12.0",
      from: "£14.2m →",
      run: "£14.2m",
      pct: "+0.0%",
      labels: ["£14.2m", "+£1.2m", "+£0.5m", "+£0.2m", "+£0.3m", "£16.4m"],
      names: [
        ["Entry EBITDA", "at acquisition"],
        ["Invoice matching", "11.4 → 3.1 FTE"],
        ["Carrier rate checks", "£38k a month recovered"],
        ["Month-end accruals", "close 9 → 6 days"],
        ["Service triage", "response 14h → 2h"],
        ["Run-rate EBITDA", "measured at day 180"],
      ],
      ev: ["+£2.2m run-rate EBITDA × 9.0× exit multiple", "£0.0m", "of enterprise value"],
      caption: "Illustrative bridge for one portfolio company. Each line is measured against a baseline signed before the build. The multiple is the fund’s own exit assumption.",
    },
    engagement: {
      eyebrow: "06 / Engagement",
      title: ["Three ways in.", "Each one earns the next."],
      cards: [
        {
          head: ["Engagement 01", "2 weeks · fixed fee"],
          title: "The portfolio audit",
          body: "We walk the workflows in up to six portfolio companies, read the systems and interview the operators. You get a ranked, costed plan for each company and one for the fund.",
          facts: [
            ["Covers", "Up to six companies"],
            ["Access", "Read-only"],
            ["Output", "Ranked, costed plan"],
          ],
          cta: "Book an audit",
        },
        {
          head: ["Engagement 02", "100 days · per capability"],
          title: "The first build",
          body: "A senior squad ships the top-ranked capabilities in one company onto a production platform in its own cloud. Each one reports against a baseline the CFO signed.",
          facts: [
            ["Runs in", "The company’s cloud"],
            ["Releases", "Fortnightly"],
            ["Measured", "Against baseline"],
          ],
          cta: "Book a call",
        },
        {
          head: ["Engagement 03", "Ongoing · per company"],
          title: "The portfolio rollout",
          body: "What worked at the first company is installed at the next, adapted to its systems, with an evaluation suite and a named owner at each. The evidence is ready when the buyer asks for it.",
          facts: [
            ["Reuses", "Platform and library"],
            ["Owner", "Named per company"],
            ["At exit", "Evidence in the data room"],
          ],
          cta: "Book a call",
        },
      ],
    },
  },
};
