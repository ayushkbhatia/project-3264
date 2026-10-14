// Copy for the Asset Management page (/industries/asset-management), set verbatim from the
// design handoff (design_handoff_asset_management: README, copy-deck.md and the prototype,
// reference/Asset Management.dc.html, which wins where they disagree): the shared chrome
// (metadata, closing image, footer) and, in `page`, every word and figure the shared industry
// components draw (components/industry, which Private Equity, Fund Management and Financial
// Services share). The premise cards' three windows are markup, in
// components/asset-management/windows.tsx.
//
// Every strategy, mandate (GE-07), fund name, reference (P-0930, A-0930, rule and guideline codes)
// and figure is illustrative; each diagram carries its "Illustrative…" caption until signed-off
// engagement data replaces them. The benchmark is deliberately generic ("Benchmark index"):
// confirm any real index name against licensing before publishing. The case studies are sample
// data.

import type { FooterColumn } from "@/components/home/Footer";
import type { IndustryPageData } from "@/components/industry/types";
import { routes } from "./home";

export const route = routes.assetManagement;

export const meta = {
  title: "3264.ai — Asset Management",
  // The hero's lede, as the other industry and service pages use theirs.
  description: "We rebuild the document-heavy work inside asset managers, from guideline checks and client reporting to research intake and RFP responses, onto one production platform in your environment. Every workflow has an owner, a measured baseline and an audit trail your compliance team, clients and consultants can follow.",
} as const;

// The closing image (components/home/FooterImage.tsx): the night sky, with this page's copy.
export const closing = {
  title: "Put every claim on record.",
  cta: { label: "Book an operations audit", href: "#engagement" },
  positioning: "Guideline checks, client reporting and research workflows rebuilt on one production platform, with every claim sourced.",
  sequence: "32 → 64",
} as const;

// The prototype's footer, with this site's routes for its links (README, "Header and menu
// linkage"): Asset Management is this page; Case studies is the home page's selected
// engagements until a /work page exists; Essays stands in for "Field notes", as on every other
// page. "Book a call" and LinkedIn (no URL yet) are this page's engagement cards.
export const footerColumns: FooterColumn[] = [
  {
    head: "Services",
    links: [
      { label: "AI Engineering", href: routes.aiEngineering },
      { label: "AI Transformation", href: routes.aiTransformation },
      { label: "Production Assurance", href: routes.productionAssurance },
      { label: "Evaluation Suites", href: routes.evaluationSuites },
    ],
  },
  {
    head: "Industries",
    links: [
      { label: "Private Credit", href: routes.privateCredit },
      { label: "Private Equity", href: routes.privateEquity },
      { label: "Financial Services", href: routes.financialServices },
      { label: "Fund Management", href: routes.fundManagement },
      // not marked current: the reference sets it in the ordinary link colour
      { label: "Asset Management", href: "#top" },
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
    steps: ["map the mandates", "rank by hours and risk", "ship the first workflow", "carry it to the next strategy"],
    live: "5 strategies live",
  },
  statements: [
    "Every team assembles its reports by hand. Most of the evidence lives in inboxes.",
    "Six strategies, six ways of working. Nobody can say what a client report costs.",
    "Clients still expect the report on time, and every claim in it has to stand up.",
  ],
  // days off the 11-day client report and hours back a quarter as each workflow goes live, on days 42, 64 and 86
  plan: { kpi: [[42, 5, 420], [64, 2, 160], [86, 1, 240]], kpiText: (e) => Math.round(11 - e) + " days" },
  value: {
    run: (add) => (14.2 + add).toFixed(1),
    pct: (add) => "+" + ((add / 14.2) * 100).toFixed(1) + "%",
    ev: (p) => Math.round(352 * p).toLocaleString("en-GB"),
  },
  // the audit loop's matrix and the five shortlisted cells' bubble targets (prototype dgData)
  audit: {
    cos: [
      ["Global equity", "Long-only"],
      ["Liquid alternatives", "Absolute return"],
      ["Multi-asset", "Solutions"],
      ["Fixed income", "Credit and rates"],
      ["Emerging markets", "EM equity"],
      ["UK equity income", "Income"],
    ],
    wf: [
      "Guideline checks",
      "Trade allocation",
      "Research intake",
      "Attribution",
      "Client reports",
      "RFP and DDQ",
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
  // Traceability: one mandate's client report; each figure or claim carries four lineage steps (prototype trData)
  trace: [
    [
      "Fund return, Q3",
      "+3.4%",
      [
        ["Source", "Daily NAV series from the fund accountant", "NAV file GE-NAV-Q3 · 64 days"],
        ["Matched to", "Time-weighted return, net of fees", "Performance engine · run P-0930"],
        ["Check", "Agrees to the published NAV for every day in the quarter", "Rule PF-01 · passed"],
        ["Reviewed", "Performance analyst", "3 Oct 2026 · 09:12"],
      ],
    ],
    [
      "Benchmark return",
      "+2.1%",
      [
        ["Source", "Benchmark index, total return in GBP", "Index vendor feed · 30 Sep close"],
        ["Matched to", "Benchmark named in the mandate schedule", "IMA schedule 2 · cl. 1.3"],
        ["Check", "Same index, currency and return type as the mandate", "Rule PF-04 · passed"],
        ["Reviewed", "Performance analyst", "3 Oct 2026 · 09:40"],
      ],
    ],
    [
      "Active return",
      "+1.3 pts",
      [
        ["Source", "Computed: fund less benchmark", "Computed by the platform"],
        ["Matched to", "Attribution: selection +1.0, allocation +0.3", "Attribution run A-0930"],
        ["Check", "Attribution effects sum to the active return", "Rule AT-02 · passed"],
        ["Reviewed", "Portfolio manager", "4 Oct 2026 · 11:05"],
      ],
    ],
    [
      "Largest overweight",
      "Technology +4.2 pts",
      [
        ["Source", "Holdings at 30 Sep from the order system", "OMS holdings export · 30 Sep"],
        ["Matched to", "Sector weights against the benchmark", "Exposure report E-0930"],
        ["Check", "Within the ±5 pt sector limit in the guidelines", "Guideline G-11 · passed"],
        ["Reviewed", "Compliance", "4 Oct 2026 · 14:20"],
      ],
    ],
    [
      "Commentary: “selection in technology led”",
      "+0.8 pts",
      [
        ["Source", "Draft commentary, paragraph 2", "Client report draft v2 · p. 3"],
        ["Matched to", "Technology selection effect in the attribution", "Attribution run A-0930 · sector 45"],
        ["Check", "Largest positive selection effect in the quarter", "Rule CM-01 · passed"],
        ["Reviewed", "Portfolio manager", "5 Oct 2026 · 10:15"],
      ],
    ],
    [
      "Guideline breaches",
      "None",
      [
        ["Source", "Pre- and post-trade checks on 1,240 orders", "Guardrails log · Q3"],
        ["Matched to", "Approved mandate rules, version 14", "Rule set GE-07 · v14"],
        ["Check", "No breach or unrecorded override in the quarter", "Rule GR-09 · passed"],
        ["Reviewed", "Head of compliance", "8 Oct 2026 · 17:05"],
      ],
    ],
  ],
  copy: {
    introLabel: "Mandate log",
    hero: {
      eyebrow: "Asset Management",
      title: ["Every mandate checked.", "Every claim sourced."],
      lede: "We rebuild the document-heavy work inside asset managers, from guideline checks and client reporting to research intake and RFP responses, onto one production platform in your environment. Every workflow has an owner, a measured baseline and an audit trail your compliance team, clients and consultants can follow.",
      primary: "Book an operations audit",
      secondary: "See the first 100 days",
    },
    premise: {
      eyebrow: "01 / Premise",
      title: ["Every client report is a project.", "Very little of it is reusable."],
      lede: "Investment, compliance and client teams build each report, check and response from order systems, PDFs and email. The work is careful and slow, and it depends on who is on the desk. What is missing is the engineering that turns it into a process: measured, owned and evidenced.",
      cards: [
        { label: "what every team has", eyebrow: "What every team has" },
        { label: "what the COO sees", eyebrow: "What the COO sees" },
        { label: "what did not change", eyebrow: "What did not change" },
      ],
    },
    audit: {
      label: "Operations audit",
      eyebrow: "02 / Operations audit",
      title: "In two weeks, we walk every document-heavy workflow and rank where automation returns the most time and removes the most risk.",
      yTicks: ["0.4 FTE", "0.8 FTE", "1.2 FTE"],
      yAxis: "Capacity released ↑",
      legend: "Estimated FTE released per quarter",
      bubbles: [
        "Global equity · guideline checks",
        "EM · attribution",
        "Fixed income · client reports",
        "UK income · guideline checks",
        "Multi-asset · client reports",
      ],
      list: {
        title: "First builds · asset manager",
        rows: [
          ["Global equity", "Pre-trade guideline checks", "1.2 FTE", "6 wks"],
          ["Emerging markets", "Attribution commentary", "0.8 FTE", "5 wks"],
          ["Fixed income", "Client report drafting", "0.7 FTE", "4 wks"],
          ["UK equity income", "Guideline checks, from build 01", "0.6 FTE", "3 wks"],
          ["Multi-asset", "Client report drafting", "0.9 FTE", "8 wks"],
        ],
        total: "4.2 FTE released across five builds",
        note: "Build 04 reuses build 01",
      },
      steps: [
        [
          "Days 1–6",
          "Walk-throughs with investment, compliance and client service",
          "→ workflow map",
        ],
        [
          "Days 7–9",
          "Each workflow scored on hours, error risk, data readiness and control gaps",
          "→ scored matrix",
        ],
        ["Day 10", "A ranked, costed plan for each strategy and one for the platform", "→ first builds"],
      ],
      caption: "Illustrative asset manager. Real audits score every workflow on hours, error risk, data readiness and control gaps, with the working attached.",
    },
    band: {
      eyebrow: "First step",
      title: "Start with a two-week operations audit.",
      cta: "Book an audit",
      note: "The process map is yours, whether we build or not",
    },
    plan: {
      label: "First 100 days",
      eyebrow: "03 / First 100 days",
      title: ["The first hundred days,", "as a build log."],
      lede: "One senior squad works alongside your investment and client teams. Each workflow ships behind an evaluation suite and reports against a baseline your COO signed before we started. By day 100 the platform runs in your own cloud and the first strategy works on it.",
      window: "Build log — Global equity · Q3",
      rows: [
        ["Audit", "Days 0–14"],
        ["Platform", "Days 8–30"],
        ["Pre-trade guideline checks", "Days 14–42"],
        ["Client report drafting", "Days 36–64"],
        ["Attribution commentary", "Days 56–86"],
        ["Evaluation and handover", "Days 70–100"],
      ],
      log: [
        ["D03", "Baseline signed by the COO: 11 days per client report, 6.2 FTE on drafting"],
        ["D14", "Audit closed. Three workflows, fortnightly releases"],
        ["D30", "Platform live in the manager’s own Azure tenant"],
        ["D42", "Guideline checks live · 420 rules tested before every trade"],
        ["D64", "Client reports live · every figure tied to the books"],
        ["D86", "Commentary live · each claim checked against attribution"],
        ["D100", "Evaluation suites handed over · report turnaround measured at 3 days"],
      ],
      kpi: {
        label: "Days per client report",
        start: "11 days",
        sub: "Against the baseline signed on day 3",
        hours: "Hours back / qtr",
      },
      board: {
        title: "Quarter checklist · Q3",
        items: ["Pre-trade guideline checks", "Client report drafting", "Attribution commentary"],
      },
      note: "Every figure comes from the platform’s own logs, reconciled to the books each month.",
    },
    trace: {
      eyebrow: "Traceability",
      title: ["Click any figure.", "See where it came from."],
      lede: "Every number and claim in a client report carries its lineage: the source in the books or the order system, the attribution it was matched to, the guideline it was checked against and the person who signed it off. Your compliance team and your clients follow the same trail.",
      window: "Client report — Global Equity Fund · Q3 2026",
      investor: "Mandate GE-07",
      period: "Quarter to 30 Sep",
      pill: "Traced · 4 of 4 checks",
      pillNote: "Same trail in the consultant’s review",
      caption: "Illustrative client report for one mandate. Names, references and figures are examples.",
    },
    portfolio: {
      label: "Across strategies",
      eyebrow: "04 / Across strategies",
      title: "Built once. Run across every strategy.",
      glow: "Each strategy goes live faster than the last.",
      lede: "A workflow built for one strategy goes into a shared library on the platform. The next strategy installs it, maps it to its own mandates and data, and goes live in weeks.",
      library: "Workflow library",
      slot: ["Guideline checks", "from Global equity · v1.4"],
      sum: ["Time to live", "6 weeks → 1 week"],
      rows: [
        ["Global equity", "Long-only · built here"],
        ["UK equity income", "Income · installed"],
        ["Fixed income", "Credit and rates · installed"],
        ["Multi-asset", "Solutions · installed"],
        ["Emerging markets", "EM equity · installed"],
      ],
      deltas: ["First build", "−50%", "−67%", "−75%", "−83%"],
      chip: "Guideline checks",
      caption: "Illustrative five-strategy programme. Timings depend on each strategy’s mandates and data.",
    },
    playbooks: {
      eyebrow: "Playbooks",
      title: ["Four workflows,", "written up from delivery."],
      lede: "What we measure first, what we build and how each one is checked. Read them before the audit, or bring them to it.",
      all: "All nine playbooks →",
      cards: [
        {
          href: `${routes.playbooks}/mandate-guardrails`,
          image: "/img/playbooks/mandate-guardrails.webp",
          title: "Mandate Guardrails",
          blurb: "Investment guidelines turned into approved, versioned rules, tested before and after each trade, with every breach and override on record.",
        },
        {
          href: `${routes.playbooks}/client-reporting-flow`,
          image: "/img/playbooks/client-reporting-flow.webp",
          title: "Client Reporting Flow",
          blurb: "Client reports built from reconciled books, each figure tied out and each commentary claim checked against attribution before release.",
        },
        {
          href: `${routes.playbooks}/research-intake`,
          image: "/img/playbooks/research-intake.webp",
          title: "Research Intake",
          blurb: "Overnight house-format notes from filings, transcripts and broker research. Every figure and quotation carries a source.",
        },
        {
          href: `${routes.playbooks}/investor-reporting`,
          image: "/img/playbooks/investor-reporting.webp",
          title: "Investor Reporting",
          blurb: "Letters, statements and DDQ answers drafted from your books, with every figure traced to source before release.",
        },
      ],
    },
    value: {
      eyebrow: "05 / Value",
      title: ["Capacity you can bridge,", "line by line."],
      lede: "Every workflow reports against a baseline your COO signed before the build. The management report carries measured numbers, and the same evidence answers compliance and your clients.",
      window: "Management report — asset manager · Q3 update",
      chart: "Client reports completed per analyst, per quarter",
      axis: "reports · axis starts at 12.0",
      from: "14.2 →",
      run: "14.2",
      pct: "+0.0%",
      labels: ["14.2", "+1.2", "+0.5", "+0.2", "+0.3", "16.4"],
      names: [
        ["Baseline capacity", "before the build"],
        ["Client reports", "11 → 3 days"],
        ["Guideline checks", "before every trade"],
        ["Commentary", "checked on drafting"],
        ["RFP and DDQ", "answers in a day"],
        ["Capacity", "measured at month 6"],
      ],
      ev: ["+2.2 reports per analyst a quarter × 40 analysts", "0", "more reports a year"],
      caption: "Illustrative bridge for one asset manager. Each line is measured against a baseline signed before the build.",
    },
    work: {
      eyebrow: "Related work",
      title: ["Measured against the week", "before we arrived."],
      lede: "Client names are withheld under mandate. Each engagement reports the baseline instrumented at the diagnostic and the figure at the third monthly review.",
      // The case studies have no pages yet: both go to the home page's selected engagements, as "All work" does, until /work/<slug> exists.
      cards: [
        {
          href: routes.caseStudies,
          image: "/img/playbooks/feat-mandate-guardrails.webp",
          eyebrow: "Asset Management · AI Engineering",
          title: "Pre-trade mandate checks for a multi-asset manager",
          summary: "Investment guidelines lived in PDFs and in the compliance team’s heads. They are now approved, versioned rules, tested before and after every trade.",
          metrics: [
            ["Post-trade breach review", "2 days → Same day"],
            ["Rules under version control", "420"],
            ["Overrides without a record", "None"],
          ],
        },
        {
          href: routes.caseStudies,
          image: "/img/playbooks/client-reporting-flow.webp",
          eyebrow: "Asset Management · Production Assurance",
          title: "Client reporting across an institutional book",
          summary: "Quarterly client reports took six people most of a month. Reports are now built from reconciled books, and each commentary claim is checked against attribution before release.",
          metrics: [
            ["Report production", "18 days → 5 days"],
            ["Reports per quarter", "640"],
            ["Claims checked against attribution", "100%"],
          ],
        },
      ],
      all: "All work →",
    },
    engagement: {
      eyebrow: "06 / Engagement",
      title: ["Three ways in.", "Each one earns the next."],
      cards: [
        {
          head: ["Engagement 01", "2 weeks · fixed fee"],
          title: "The operations audit",
          body: "We walk every document-heavy workflow across up to six strategies, read the systems and mandates and interview the team. You get a ranked, costed plan for each strategy and one for the platform.",
          facts: [["Covers", "Up to six strategies"], ["Access", "Read-only"], ["Output", "Ranked, costed plan"]],
          cta: "Book an audit",
        },
        {
          head: ["Engagement 02", "100 days · per workflow"],
          title: "The first build",
          body: "A senior squad ships the top-ranked workflows onto a production platform in your own cloud. Each one reports against a baseline your COO signed.",
          facts: [["Runs in", "Your cloud"], ["Releases", "Fortnightly"], ["Measured", "Against baseline"]],
          cta: "Book a call",
        },
        {
          head: ["Engagement 03", "Ongoing · per strategy"],
          title: "The platform rollout",
          body: "What worked for the first strategy is installed for the next, mapped to its mandates and data, with an evaluation suite and a named owner for each. The evidence is ready when the client or consultant asks for it.",
          facts: [
            ["Reuses", "Platform and library"],
            ["Owner", "Named per strategy"],
            ["At audit", "Evidence on file"],
          ],
          cta: "Book a call",
        },
      ],
      rounded: true,
      strongLastVeil: true,
    },
  },
};
