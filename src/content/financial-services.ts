// Copy for the Financial Services page (/industries/financial-services), set verbatim from the
// design handoff (design_handoff_financial_services: README, copy-deck.md and the prototype,
// reference/Financial Services.dc.html, which wins where they disagree): the shared chrome
// (metadata, closing image, footer) and, in `page`, every word and figure the shared industry
// components draw (components/industry, which Private Equity and Fund Management share). The
// premise cards' three windows are markup, in components/financial-services/windows.tsx.
//
// Every bank, desk, borrower (Halden Logistics Ltd), reference (CR-20931, policy and rule codes)
// and figure is illustrative; each diagram carries its "Illustrative…" caption until signed-off
// engagement data replaces them. The case studies are sample data; the $6.4B memo case is the
// home page's, flagged there as a placeholder.

import type { FooterColumn } from "@/components/home/Footer";
import type { IndustryPageData } from "@/components/industry/types";
import { routes } from "./home";

export const route = routes.financialServices;

export const meta = {
  title: "3264.ai — Financial Services",
  // The hero's lede, as the other industry and service pages use theirs.
  description: "We rebuild the document-heavy work inside banks and lenders, from credit memos and KYC files to complaints and regulatory requests, onto one production platform in your environment. Every workflow has an owner, a measured baseline and an audit trail your second line, internal audit and regulator can follow.",
} as const;

// The closing image (components/home/FooterImage.tsx): the night sky, with this page's copy.
export const closing = {
  title: "Make every file stand up.",
  cta: { label: "Book an operations audit", href: "#engagement" },
  positioning: "Credit, onboarding and compliance workflows rebuilt on one production platform, with every decision on record.",
  sequence: "32 → 64",
} as const;

// The prototype's footer, with this site's routes for its links (README, "Header and menu
// linkage"): Financial Services is this page; Case studies is the home page's selected
// engagements until a /work page exists; Essays stands in for "Field notes", as on every other
// page. "Book a call" and LinkedIn (no URL yet) are this page's engagement cards.
export const footerColumns: FooterColumn[] = [
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
      // not marked current: the reference sets it in the ordinary link colour
      { label: "Financial Services", href: "#top" },
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
    steps: ["map the files", "rank by hours and risk", "ship the first workflow", "carry it to the next desk"],
    live: "5 desks live",
  },
  statements: [
    "Every desk assembles its files by hand. Most of the evidence lives in inboxes.",
    "Six desks, six ways of working. Nobody can say what a credit file costs.",
    "The regulator still samples the files, and every decision in them has to stand up.",
  ],
  // days off the 11-day credit memo and hours back a quarter as each workflow goes live, on days 42, 64 and 86
  plan: { kpi: [[42, 5, 420], [64, 2, 160], [86, 1, 240]], kpiText: (e) => Math.round(11 - e) + " days" },
  value: {
    run: (add) => (14.2 + add).toFixed(1),
    pct: (add) => "+" + ((add / 14.2) * 100).toFixed(1) + "%",
    ev: (p) => Math.round(3168 * p).toLocaleString("en-GB"),
  },
  // the audit loop's matrix and the five shortlisted cells' bubble targets (prototype dgData)
  audit: {
    cos: [
      ["Commercial credit", "Corporate lending"],
      ["Regulatory reporting", "Compliance"],
      ["Onboarding", "KYC and AML"],
      ["Complaints", "Customer operations"],
      ["Model risk", "Second line"],
      ["SME lending", "Business banking"],
    ],
    wf: [
      "Credit memos",
      "Covenant checks",
      "Customer letters",
      "Model docs",
      "Case files",
      "Regulatory returns",
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
  // Traceability: one borrower's credit memo; each figure carries four lineage steps (prototype trData)
  trace: [
    [
      "Revenue, FY2025",
      "£142.6m",
      [
        ["Source", "Audited accounts FY2025", "Halden-FY25-accounts.pdf · p. 14"],
        ["Matched to", "Spread into the credit model", "Model v3 · row 4"],
        ["Check", "Ties to the audited figure to the pound", "Rule SP-01 · passed"],
        ["Reviewed", "Credit analyst", "6 Oct 2026 · 09:12"],
      ],
    ],
    [
      "EBITDA, FY2025",
      "£21.4m",
      [
        ["Source", "Audited accounts plus management add-backs", "p. 16 · add-back schedule"],
        ["Matched to", "Model row 12, add-backs listed separately", "Model v3 · rows 12–15"],
        ["Check", "Add-backs within the 15% cap in the term sheet", "Policy CR-4.2 · passed"],
        ["Reviewed", "Credit analyst", "6 Oct 2026 · 10:03"],
      ],
    ],
    [
      "Net debt, 30 Jun",
      "£58.9m",
      [
        ["Source", "Bank confirmations and loan schedule", "Confirmations pack · 4 lenders"],
        ["Matched to", "Model row 22", "Model v3 · row 22"],
        ["Check", "Agrees to the existing lenders’ confirmations", "Rule SP-07 · passed"],
        ["Reviewed", "Credit analyst", "6 Oct 2026 · 10:41"],
      ],
    ],
    [
      "Leverage",
      "2.75x",
      [
        ["Source", "Computed: net debt ÷ EBITDA", "Computed by the platform"],
        [
          "Matched to",
          "Leverage definition in the draft facility agreement",
          "Facility agreement · cl. 21.1",
        ],
        ["Check", "Below the 3.50x policy limit for this rating", "Policy CR-2.1 · passed"],
        ["Reviewed", "Credit manager", "7 Oct 2026 · 08:30"],
      ],
    ],
    [
      "Interest cover",
      "4.8x",
      [
        ["Source", "Computed: EBITDA ÷ pro forma interest", "Pricing grid · 2.25% over SONIA"],
        [
          "Matched to",
          "Interest cover definition, facility agreement",
          "Facility agreement · cl. 21.2",
        ],
        ["Check", "Above the 3.0x policy floor", "Policy CR-2.3 · passed"],
        ["Reviewed", "Credit manager", "7 Oct 2026 · 08:41"],
      ],
    ],
    [
      "Recommended limit",
      "£18,000,000",
      [
        ["Source", "Term loan £12m plus revolving facility £6m", "Structure section · memo p. 2"],
        ["Matched to", "Limit request in the credit system", "Credit system · ref CR-20931"],
        ["Check", "Within the approver’s delegated authority", "Delegated authority matrix · passed"],
        ["Reviewed", "Credit committee", "8 Oct 2026 · 17:05"],
      ],
    ],
  ],
  copy: {
    introLabel: "Bank log",
    hero: {
      eyebrow: "Financial Services",
      title: ["Every file complete.", "Every decision on record."],
      lede: "We rebuild the document-heavy work inside banks and lenders, from credit memos and KYC files to complaints and regulatory requests, onto one production platform in your environment. Every workflow has an owner, a measured baseline and an audit trail your second line, internal audit and regulator can follow.",
      primary: "Book an operations audit",
      secondary: "See the first 100 days",
    },
    premise: {
      eyebrow: "01 / Premise",
      title: ["Every file is assembled by hand.", "Very little of it is reusable."],
      lede: "Credit, onboarding and compliance teams build each file from core systems, PDFs and email. The work is careful and slow, and it depends on who is on the desk. What is missing is the engineering that turns it into a process: measured, owned and evidenced.",
      cards: [
        { label: "what every desk has", eyebrow: "What every desk has" },
        { label: "what the CRO sees", eyebrow: "What the CRO sees" },
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
        "Commercial · credit memos",
        "Model risk · model docs",
        "Complaints · case files",
        "SME · credit memos",
        "Onboarding · KYC files",
      ],
      list: {
        title: "First builds · commercial bank",
        rows: [
          ["Commercial credit", "Credit memo drafting", "1.2 FTE", "6 wks"],
          ["Model risk", "Model documentation", "0.8 FTE", "5 wks"],
          ["Complaints", "Complaint case files", "0.7 FTE", "4 wks"],
          ["SME lending", "Credit memos, from build 01", "0.6 FTE", "3 wks"],
          ["Onboarding", "KYC case files", "0.9 FTE", "8 wks"],
        ],
        total: "4.2 FTE released across five builds",
        note: "Build 04 reuses build 01",
      },
      steps: [
        [
          "Days 1–6",
          "Walk-throughs with credit, onboarding, complaints and the second line",
          "→ workflow map",
        ],
        [
          "Days 7–9",
          "Each workflow scored on hours, error risk, data readiness and control gaps",
          "→ scored matrix",
        ],
        ["Day 10", "A ranked, costed plan for each desk and one for the platform", "→ first builds"],
      ],
      caption: "Illustrative bank. Real audits score every workflow on hours, error risk, data readiness and control gaps, with the working attached.",
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
      lede: "One senior squad works alongside your credit and operations teams. Each workflow ships behind an evaluation suite and reports against a baseline your COO signed before we started. By day 100 the platform runs in your own cloud and the first desk works on it.",
      window: "Build log — Commercial credit · Q3",
      rows: [
        ["Audit", "Days 0–14"],
        ["Platform", "Days 8–30"],
        ["Credit memo drafting", "Days 14–42"],
        ["KYC case files", "Days 36–64"],
        ["Complaint case files", "Days 56–86"],
        ["Evaluation and handover", "Days 70–100"],
      ],
      log: [
        ["D03", "Baseline signed by the COO: 11 days per credit memo, 6.2 FTE on drafting"],
        ["D14", "Audit closed. Three workflows, fortnightly releases"],
        ["D30", "Platform live in the bank’s own Azure tenant"],
        ["D42", "Credit memos live · every figure cited to its source page"],
        ["D64", "KYC files live · refresh packs assembled in minutes"],
        ["D86", "Complaints live · cases classified and drafted on arrival"],
        ["D100", "Evaluation suites handed over · memo turnaround measured at 3 days"],
      ],
      kpi: {
        label: "Days per credit memo",
        start: "11 days",
        sub: "Against the baseline signed on day 3",
        hours: "Hours back / qtr",
      },
      board: {
        title: "Desk checklist · Q3",
        items: ["Credit memo drafting", "KYC case files", "Complaint case files"],
      },
      note: "Every figure comes from the platform’s own logs, reconciled to the core systems each month.",
    },
    trace: {
      eyebrow: "Traceability",
      title: ["Click any figure.", "See where it came from."],
      lede: "Every number in a memo, a KYC file or a regulatory return carries its lineage: the source document, the system line it was matched to, the policy it was checked against and the person who signed it off. Your second line and your regulator follow the same trail.",
      window: "Credit memo — Halden Logistics Ltd · Q3 2026",
      investor: "Borrower 20931",
      period: "£ · FY2025 · at 30 Jun",
      pill: "Traced · 4 of 4 checks",
      pillNote: "Same trail in the regulator’s sample",
      caption: "Illustrative credit memo for one borrower. Names, references and figures are examples.",
    },
    portfolio: {
      label: "Across desks",
      eyebrow: "04 / Across desks",
      title: "Built once. Run across every desk.",
      glow: "Each desk goes live faster than the last.",
      lede: "A workflow built for one desk goes into a shared library on the platform. The next desk installs it, maps it to its own systems and credit policy, and goes live in weeks.",
      library: "Workflow library",
      slot: ["Credit memo drafting", "from Commercial credit · v1.4"],
      sum: ["Time to live", "6 weeks → 1 week"],
      rows: [
        ["Commercial credit", "Corporate lending · built here"],
        ["SME lending", "Business banking · installed"],
        ["Real estate", "Property finance · installed"],
        ["Asset finance", "Equipment lending · installed"],
        ["Leveraged finance", "Sponsor lending · installed"],
      ],
      deltas: ["First build", "−50%", "−67%", "−75%", "−83%"],
      chip: "Credit memos",
      caption: "Illustrative five-desk programme. Timings depend on each desk’s systems and policies.",
    },
    playbooks: {
      eyebrow: "Playbooks",
      title: ["Four workflows,", "written up from delivery."],
      lede: "What we measure first, what we build and how each one is checked. Read them before the audit, or bring them to it.",
      all: "All nine playbooks →",
      cards: [
        {
          href: `${routes.playbooks}/covenant-watch`,
          image: "/img/playbooks/covenant-watch.webp",
          title: "Covenant Watch",
          blurb: "Borrower certificates recomputed from the credit agreement's own definitions, with headroom, add-back caps and cure rights tracked every test date.",
        },
        {
          href: `${routes.playbooks}/loan-ops-ledger`,
          image: "/img/playbooks/loan-ops-ledger.webp",
          title: "Loan Ops Ledger",
          blurb: "Agent notices matched to the loan system every day, with each break explained before month end.",
        },
        {
          href: `${routes.playbooks}/mandate-guardrails`,
          image: "/img/playbooks/mandate-guardrails.webp",
          title: "Mandate Guardrails",
          blurb: "Investment guidelines turned into approved, versioned rules, tested before and after each trade, with every breach and override on record.",
        },
        {
          href: `${routes.playbooks}/research-intake`,
          image: "/img/playbooks/research-intake.webp",
          title: "Research Intake",
          blurb: "Overnight house-format notes from filings, transcripts and broker research. Every figure and quotation carries a source.",
        },
      ],
    },
    value: {
      eyebrow: "05 / Value",
      title: ["Capacity you can bridge,", "line by line."],
      lede: "Every workflow reports against a baseline your COO signed before the build. The management report carries measured numbers, and the same evidence answers internal audit and the regulator.",
      window: "Management report — commercial bank · Q3 update",
      chart: "Credit files completed per analyst, per month",
      axis: "files · axis starts at 12.0",
      from: "14.2 →",
      run: "14.2",
      pct: "+0.0%",
      labels: ["14.2", "+1.2", "+0.5", "+0.2", "+0.3", "16.4"],
      names: [
        ["Baseline capacity", "before the build"],
        ["Credit memos", "11 → 3 days"],
        ["KYC case files", "packs in minutes"],
        ["Complaint cases", "drafted on arrival"],
        ["Model docs", "3 weeks → 4 days"],
        ["Capacity", "measured at month 6"],
      ],
      ev: ["+2.2 files per analyst a month × 120 analysts", "0", "more files a year"],
      caption: "Illustrative bridge for one bank. Each line is measured against a baseline signed before the build.",
    },
    work: {
      eyebrow: "Related work",
      title: ["Measured against the week", "before we arrived."],
      lede: "Client names are withheld under mandate. Each engagement reports the baseline instrumented at the diagnostic and the figure at the third monthly review.",
      // The case studies have no pages yet: both go to the home page's selected engagements, as "All work" does, until /work/<slug> exists.
      cards: [
        {
          href: routes.caseStudies,
          image: "/img/playbooks/research-intake.webp",
          eyebrow: "Financial Services · AI Engineering",
          title: "Credit memo preparation across a $6.4B book",
          summary: "Every figure is extracted with a citation back to the page it came from. Credit officers review exceptions only, and the audit trail satisfied the bank’s model risk function without amendment.",
          metrics: [
            ["Time per memo", "6 hrs → 40 min"],
            ["Memos prepared", "1,240"],
            ["Field-level citations", "100%"],
          ],
        },
        {
          href: routes.caseStudies,
          image: "/img/playbooks/feat-covenant-watch.webp",
          eyebrow: "Lending · AI Engineering",
          title: "Covenant monitoring across a direct lending book",
          summary: "Borrower compliance certificates were checked by hand against each credit agreement. Covenants are now recomputed from the agreements’ own definitions, and an analyst signs off every test.",
          metrics: [
            ["Quarterly test cycle", "15 days → 3 days"],
            ["Facilities tested in full", "30 → 140"],
            ["Ratios re-keyed by hand", "None"],
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
          body: "We walk every document-heavy workflow across up to six desks, read the systems and policies and interview the team. You get a ranked, costed plan for each desk and one for the platform.",
          facts: [["Covers", "Up to six desks"], ["Access", "Read-only"], ["Output", "Ranked, costed plan"]],
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
          head: ["Engagement 03", "Ongoing · per desk"],
          title: "The platform rollout",
          body: "What worked for the first desk is installed for the next, mapped to its systems and policies, with an evaluation suite and a named owner for each. The evidence is ready when the regulator asks for it.",
          facts: [
            ["Reuses", "Platform and library"],
            ["Owner", "Named per desk"],
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
