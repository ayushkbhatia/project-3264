// Copy for the Fund Management page (/industries/fund-management), set verbatim from the design
// handoff (design_handoff_fund_management: copy-deck.md and the prototype, reference/Fund
// Management.dc.html, which wins where the two disagree): the shared chrome (metadata, closing
// image, footer) and, in `page`, every word and figure the shared industry components draw
// (components/industry, which Private Equity shares). The premise cards' three windows are
// markup, in components/fund-management/windows.tsx.
//
// All fund and vehicle names, investor 0042, every reference (FIII-CC-14, J-3381…), amount, FTE
// figure and margin are illustrative; each diagram carries its "Illustrative…" caption until
// signed-off engagement data replaces them. The case-study cards are sample data.

import type { FooterColumn } from "@/components/home/Footer";
import type { IndustryPageData } from "@/components/industry/types";
import { routes } from "./home";

export const route = routes.fundManagement;

export const meta = {
  title: "3264.ai — Fund Management",
  // The hero's lede, as the other industry and service pages use theirs.
  description: "We rebuild the fund operations that run on spreadsheets and email, from NAV review and capital activity to LP reporting and side-letter obligations, onto one production platform in your environment. Every process has an owner, a measured baseline and an audit trail your administrator, auditor and LPs can follow.",
} as const;

// The closing image (components/home/FooterImage.tsx): the night sky, with this page's copy.
export const closing = {
  title: "Close the quarter in days.",
  cta: { label: "Book an operations audit", href: "#engagement" },
  positioning: "Fund operations rebuilt on one production platform, with every figure traced to source.",
  sequence: "32 → 64",
} as const;

// The prototype's footer, with this site's routes for its links (README, "Header and menu
// linkage"): Fund Management is this page; Case studies is the home page's selected engagements
// until a /work page exists; Essays stands in for "Field notes", as on every other page. "Book a
// call" and LinkedIn (no URL yet) are this page's engagement cards.
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
      { label: "Financial Services", href: routes.financialServices },
      // not marked current: the reference sets it in the ordinary link colour
      { label: "Fund Management", href: "#top" },
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
      "audit the close",
      "rank by hours and risk",
      "ship the first process",
      "carry it to the next vehicle",
    ],
    live: "5 vehicles live",
  },
  statements: [
    "Every fund team closes the quarter. Most of it lives in spreadsheets and inboxes.",
    "Six vehicles, six close processes. Nobody can say what a quarter-end costs.",
    "LPs still expect the letter on time, and the auditor still tests every number in it.",
  ],
  // days off the 19-day close and hours back a quarter as each process goes live, on days 42, 64 and 86
  plan: { kpi: [[42, 6, 420], [64, 3, 160], [86, 2, 240]], kpiText: (e) => Math.round(19 - e) + " days" },
  value: {
    run: (add) => (14.2 + add).toFixed(1) + "%",
    pct: (add) => "+" + add.toFixed(1) + " pts",
    ev: (p) => "£" + (1.06 * p).toFixed(2) + "m",
  },
  // the audit loop's matrix and the five shortlisted cells' bubble targets (prototype dgData)
  audit: {
    cos: [
      ["Fund III", "Buyout · main fund"],
      ["Fund III Parallel", "Parallel vehicle"],
      ["Fund II", "Harvesting"],
      ["Co-invest I", "Co-investment"],
      ["Credit Opps II", "Private credit"],
      ["Cayman Feeder", "Feeder fund"],
    ],
    wf: [
      "NAV review",
      "Capital activity",
      "LP reporting",
      "Side letters",
      "Investor queries",
      "Fees and carry",
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
  // Traceability: one investor's capital account; each figure carries four lineage steps (prototype trData)
  trace: [
    [
      "Opening capital account",
      "£24,180,412",
      [
        [
          "Source",
          "Q2 capital account statement, signed 14 Jul 2026",
          "Administrator file FIII-Q2-CAS.pdf · p. 3",
        ],
        ["Matched to", "Q2 closing balance in the capital roll-forward", "Investor 0042 · row 42"],
        ["Check", "Rolls forward from the prior quarter to the penny", "Rule CA-01 · passed"],
        ["Reviewed", "Fund accountant", "6 Oct 2026 · 09:12"],
      ],
    ],
    [
      "Contributions",
      "£1,250,000",
      [
        ["Source", "Capital call notice FIII-CC-14, issued 2 Sep", "Notice register · call 14"],
        ["Matched to", "Wire received 9 Sep, ref NB-55102", "Bank statement · line 41"],
        ["Check", "2.5% of a £50m commitment, per LPA §4.2", "Rule CC-03 · passed"],
        ["Reviewed", "Investor operations", "6 Oct 2026 · 10:03"],
      ],
    ],
    [
      "Distributions",
      "(£820,000)",
      [
        ["Source", "Distribution notice FIII-D-07, issued 18 Aug", "Notice register · distribution 7"],
        ["Matched to", "Outgoing wire 22 Aug", "Bank statement · line 17"],
        ["Check", "Pro rata to commitments, withholding per side letter §3", "Rule DS-02 · passed"],
        ["Reviewed", "Fund accountant", "6 Oct 2026 · 10:41"],
      ],
    ],
    [
      "Management fee",
      "(£218,750)",
      [
        ["Source", "Administrator fee schedule, Q3", "FIII-fees.xlsx · Q3 tab · row 12"],
        ["Matched to", "GL 6100 management fees, journal J-3381", "General ledger · Fund III"],
        [
          "Check",
          "1.75% a year on commitments, less the 10% side-letter discount",
          "Rule MF-01 · passed",
        ],
        ["Reviewed", "CFO", "7 Oct 2026 · 08:30"],
      ],
    ],
    [
      "Net investment gain",
      "£1,612,904",
      [
        ["Source", "Q3 valuation pack, 14 portfolio companies", "Valuation committee pack · v3"],
        [
          "Matched to",
          "Unrealised gain, GL 4200, allocated by commitment share",
          "Allocation run A-0921",
        ],
        ["Check", "Ties to the NAV pack: 3,400 lines matched, 0 open breaks", "Rule NV-04 · passed"],
        ["Reviewed", "Valuation committee", "8 Oct 2026"],
      ],
    ],
    [
      "Closing capital account",
      "£26,004,566",
      [
        ["Source", "Sum of the five lines above", "Computed by the platform"],
        [
          "Matched to",
          "Administrator closing balance for investor 0042",
          "Administrator file FIII-Q3-CAS.pdf · p. 3",
        ],
        ["Check", "Agrees to the administrator to the penny", "Rule CA-02 · passed"],
        ["Reviewed", "CFO sign-off", "8 Oct 2026 · 17:05"],
      ],
    ],
  ],
  copy: {
    introLabel: "Fund log",
    hero: {
      eyebrow: "Fund Management",
      title: ["Quarter-end, closed in days.", "Every figure traced to source."],
      lede: "We rebuild the fund operations that run on spreadsheets and email, from NAV review and capital activity to LP reporting and side-letter obligations, onto one production platform in your environment. Every process has an owner, a measured baseline and an audit trail your administrator, auditor and LPs can follow.",
      primary: "Book an operations audit",
      secondary: "See the first quarter-end",
    },
    premise: {
      eyebrow: "01 / Premise",
      title: ["Every quarter-end is a project.", "Very little of it is repeatable."],
      lede: "Fund finance teams close each quarter on spreadsheets, administrator files and inboxes. The work gets done, by the same few people, every quarter. What is missing is the engineering that turns it into a process: measured, owned and auditable.",
      cards: [
        { label: "what every fund team has", eyebrow: "What every fund team has" },
        { label: "what the CFO sees", eyebrow: "What the CFO sees" },
        { label: "what did not change", eyebrow: "What did not change" },
      ],
    },
    audit: {
      label: "Operations audit",
      eyebrow: "02 / Operations audit",
      title: "In two weeks, we walk every fund operations process and rank where automation returns the most time and removes the most risk.",
      yTicks: ["0.4 FTE", "0.8 FTE", "1.2 FTE"],
      yAxis: "Capacity released ↑",
      legend: "Estimated FTE released per quarter",
      bubbles: [
        "Fund III · NAV review",
        "Credit Opps II · side letters",
        "Co-invest I · investor queries",
        "Cayman Feeder · NAV review",
        "Fund II · investor queries",
      ],
      list: {
        title: "First builds · fund operations",
        rows: [
          ["Fund III", "NAV pack tie-out", "1.2 FTE", "6 wks"],
          ["Credit Opps II", "Side-letter register", "0.8 FTE", "5 wks"],
          ["Co-invest I", "Investor query drafting", "0.7 FTE", "4 wks"],
          ["Cayman Feeder", "NAV tie-out, from build 01", "0.6 FTE", "3 wks"],
          ["Fund II", "LP query drafting", "0.9 FTE", "8 wks"],
        ],
        total: "4.2 FTE released across five builds",
        note: "Build 04 reuses build 01",
      },
      steps: [
        ["Days 1–6", "Walk-throughs with fund finance, IR and the administrator", "→ process map"],
        [
          "Days 7–9",
          "Each process scored on hours, error risk, data readiness and control gaps",
          "→ scored matrix",
        ],
        ["Day 10", "A ranked, costed plan for each vehicle and one for the platform", "→ first builds"],
      ],
      caption: "Illustrative fund platform. Real audits score every process on hours, error risk, data readiness and control gaps, with the working attached.",
    },
    band: {
      eyebrow: "First step",
      title: "Start with a two-week operations audit.",
      cta: "Book an audit",
      note: "The process map is yours, whether we build or not",
    },
    plan: {
      label: "First quarter-end",
      eyebrow: "03 / First quarter-end",
      title: ["The first quarter-end,", "as a build log."],
      lede: "One senior squad works alongside your fund finance team. Each process ships behind an evaluation suite and reports against a baseline your CFO signed before we started. By day 100 the platform runs in your own cloud and the next quarter-end closes on it.",
      window: "Build log — Fund III · Q3 close",
      rows: [
        ["Audit", "Days 0–14"],
        ["Platform", "Days 8–30"],
        ["NAV pack tie-out", "Days 14–42"],
        ["Capital activity and notices", "Days 36–64"],
        ["LP quarterly reporting", "Days 56–86"],
        ["Evaluation and handover", "Days 70–100"],
      ],
      log: [
        ["D03", "Baseline signed by the CFO: 19 days to close, 4.6 FTE on tie-out"],
        ["D14", "Audit closed. Three processes, fortnightly releases"],
        ["D30", "Platform live in the manager’s own Azure tenant"],
        ["D42", "NAV tie-out live · 3,400 lines matched, 11 breaks explained"],
        ["D64", "Capital activity live · notices sent and wires matched same day"],
        ["D86", "LP reporting live · letters drafted with every figure sourced"],
        ["D100", "Evaluation suites handed over · close measured at 8 days"],
      ],
      kpi: {
        label: "Days to close the quarter",
        start: "19 days",
        sub: "Against the baseline signed on day 3",
        hours: "Hours back / qtr",
      },
      board: {
        title: "Close checklist · Q3",
        items: ["NAV pack tie-out", "Capital activity and notices", "LP quarterly reporting"],
      },
      note: "Every figure comes from the platform’s own logs, reconciled to the administrator each month.",
    },
    trace: {
      eyebrow: "Traceability",
      title: ["Click any figure.", "See where it came from."],
      lede: "Every number the platform produces carries its lineage: the source document, the ledger line it was matched to, the rule it was checked against and the person who signed it off. Your auditor and your LPs follow the same trail.",
      window: "Capital account statement — Fund III · Q3 2026",
      investor: "Investor 0042",
      period: "£ · 1 Jul – 30 Sep",
      pill: "Traced · 4 of 4 checks",
      pillNote: "Same trail in the auditor’s view",
      caption: "Illustrative statement for one investor. Names, references and figures are examples.",
    },
    portfolio: {
      label: "Across vehicles",
      eyebrow: "04 / Across vehicles",
      title: "Built once. Run across every vehicle.",
      glow: "Each fund goes live faster than the last.",
      lede: "A process built for one fund goes into a shared library on the platform. The next vehicle installs it, maps it to its own administrator files and chart of accounts, and goes live in weeks.",
      library: "Process library",
      slot: ["NAV pack tie-out", "from Fund III · v1.4"],
      sum: ["Time to live", "6 weeks → 1 week"],
      rows: [
        ["Fund III", "Buyout · built here"],
        ["Fund III Parallel", "Parallel vehicle · installed"],
        ["Credit Opps II", "Private credit · installed"],
        ["Co-invest I", "Co-investment · installed"],
        ["Cayman Feeder", "Feeder fund · installed"],
      ],
      deltas: ["First build", "−50%", "−67%", "−75%", "−83%"],
      chip: "NAV tie-out",
      caption: "Illustrative five-vehicle programme. Timings depend on each administrator’s files and formats.",
    },
    playbooks: {
      eyebrow: "Playbooks",
      title: ["Four fund operations,", "written up from delivery."],
      lede: "What we measure first, what we build and how each one is checked. Read them before the audit, or bring them to it.",
      all: "All nine playbooks →",
      cards: [
        {
          href: `${routes.playbooks}/nav-pack-review`,
          image: "/img/playbooks/nav-pack-review.webp",
          title: "NAV Pack Review",
          blurb: "Administrator NAV packs tied out line by line to your books, with every break explained before the CFO signs.",
        },
        {
          href: `${routes.playbooks}/capital-call-flow`,
          image: "/img/playbooks/capital-call-flow.webp",
          title: "Capital Call Flow",
          blurb: "Calls computed from the LPA and side letters, sent per investor, and matched to the wires that arrive.",
        },
        {
          href: `${routes.playbooks}/investor-reporting`,
          image: "/img/playbooks/investor-reporting.webp",
          title: "Investor Reporting",
          blurb: "Letters, capital account statements and DDQ answers drafted from your books, with every figure traced to source before release.",
        },
        {
          href: `${routes.playbooks}/side-letter-register`,
          image: "/img/playbooks/side-letter-register.webp",
          title: "Side-Letter Register",
          blurb: "Every promise in your LPAs and side letters, tracked to its clause, owner and proof of delivery.",
        },
      ],
    },
    value: {
      eyebrow: "05 / Value",
      title: ["Margin you can bridge,", "line by line."],
      lede: "Every process reports against a baseline your fund finance team signed before the build. The management report carries measured numbers, and the same evidence answers the auditor and the LP.",
      window: "Management report — fund operations · Q3 update",
      chart: "Operating margin on management fees",
      axis: "% · axis starts at 12.0",
      from: "14.2% →",
      run: "14.2%",
      pct: "+0.0 pts",
      labels: ["14.2%", "+1.2 pts", "+0.5 pts", "+0.2 pts", "+0.3 pts", "16.4%"],
      names: [
        ["Baseline margin", "before the build"],
        ["NAV pack tie-out", "4.6 → 1.2 FTE"],
        ["Capital activity", "notices same day"],
        ["LP reporting", "cycle 12 → 4 days"],
        ["Investor queries", "response 5 → 1 day"],
        ["Operating margin", "measured at month 6"],
      ],
      ev: ["+2.2 pts of margin on £48m of management fees", "£0.0m", "a year"],
      caption: "Illustrative bridge for one manager. Each line is measured against a baseline signed before the build. Fee income is the manager’s own forecast.",
    },
    work: {
      eyebrow: "Related work",
      title: ["Measured against the quarter", "before we arrived."],
      lede: "Client names are withheld under mandate. Each engagement reports the baseline instrumented at the diagnostic and the figure at the third monthly review.",
      // The case studies have no pages yet: both go to the home page's selected engagements, as "All work" does, until /work/<slug> exists.
      cards: [
        {
          href: routes.caseStudies,
          image: "/img/playbooks/feat-nav-pack-review.webp",
          eyebrow: "Fund Management · AI Engineering",
          title: "NAV pack tie-out for a multi-strategy manager",
          summary: "The finance team ticked each administrator NAV pack against the books by hand. Packs are now tied out line by line, and only explained breaks reach the CFO.",
          metrics: [
            ["NAV review", "6 days → 1 day"],
            ["Lines tied out per pack", "3,400"],
            ["Breaks unexplained at sign-off", "None"],
          ],
        },
        {
          href: routes.caseStudies,
          image: "/img/playbooks/side-letter-register.webp",
          eyebrow: "Fund Management · AI Transformation",
          title: "An operating model for AI across fund operations",
          summary: "Operations had a long list of AI ideas and no way to rank them. We measured twelve processes, ranked them by cost and risk, and shipped the first build: a register of every side-letter obligation.",
          metrics: [
            ["Obligations with a named owner", "40% → 100%"],
            ["Processes measured", "12"],
            ["Obligations without proof of delivery", "None"],
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
          body: "We walk every fund operations process across up to six vehicles, read the administrator files and interview the team. You get a ranked, costed plan for each vehicle and one for the platform.",
          facts: [
            ["Covers", "Up to six vehicles"],
            ["Access", "Read-only"],
            ["Output", "Ranked, costed plan"],
          ],
          cta: "Book an audit",
        },
        {
          head: ["Engagement 02", "100 days · per process"],
          title: "The first build",
          body: "A senior squad ships the top-ranked processes onto a production platform in your own cloud. Each one reports against a baseline your CFO signed.",
          facts: [["Runs in", "Your cloud"], ["Releases", "Fortnightly"], ["Measured", "Against baseline"]],
          cta: "Book a call",
        },
        {
          head: ["Engagement 03", "Ongoing · per vehicle"],
          title: "The platform rollout",
          body: "What worked for the first fund is installed for the next, mapped to its administrator and data, with an evaluation suite and a named owner for each. The evidence is ready when the auditor asks for it.",
          facts: [
            ["Reuses", "Platform and library"],
            ["Owner", "Named per vehicle"],
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
