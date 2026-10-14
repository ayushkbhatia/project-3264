// Copy for the Production Assurance service page (/production-assurance), set verbatim from the
// design handoff (design_handoff_production_assurance: README, copy-deck.md and the prototype,
// reference/Production Assurance.dc.html, which wins where they disagree): the shared chrome
// (metadata, closing image, footer) and, in `page`, every word and figure the shared industry
// components draw (components/industry: the page is built on the industry pages' framework, as
// the handoff asks). The premise cards' three windows are markup, in
// components/production-assurance/windows.tsx.
//
// Every system, reference (CMA-01, CG-2, S-0904 and so on), date and figure is illustrative;
// each diagram carries its "Illustrative…" caption until signed-off engagement data replaces
// them. The case studies are sample data.

import type { FooterColumn } from "@/components/home/Footer";
import type { IndustryPageData } from "@/components/industry/types";
import { routes } from "./home";

export const route = routes.productionAssurance;

export const meta = {
  title: "3264.ai — Production Assurance",
  // The hero's lede, as the other industry and service pages use theirs.
  description: "AI systems drift. Models change underneath them, costs creep and the people who built them move on. We hold every live system to an agreed accuracy floor, catch problems before your team does, and keep the runbooks current, so the system stays trusted long after launch.",
} as const;

// The closing image (components/home/FooterImage.tsx): the night sky, with this page's copy.
export const closing = {
  title: "Keep it right after go-live.",
  cta: { label: "Book a health review", href: "#engagement" },
  positioning: "Monitoring, evaluation and runbooks for AI systems in production, held to an agreed accuracy floor.",
  sequence: "32 → 64",
  // one line on desktop (README, "Closing")
  wide: true,
} as const;

// The prototype's footer, with this site's routes for its links (README, "Linkage"): Production
// Assurance, in Services, is this page; Case studies is the home page's selected engagements until
// a /work page exists; Essays stands in for "Field notes", as on every other
// page. "Book a call" and LinkedIn (no URL yet) are this page's engagement cards.
export const footerColumns: FooterColumn[] = [
  {
    head: "Services",
    links: [
      { label: "AI Engineering", href: routes.aiEngineering },
      { label: "AI Transformation", href: routes.aiTransformation },
      // not marked current: the reference sets it in the ordinary link colour
      { label: "Production Assurance", href: "#top" },
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
    steps: ["review what is live", "rank by risk", "fix the first system", "carry it to the next one"],
    live: "5 systems on watch",
  },
  statements: [
    "The pilot went live with a launch email and a demo that worked.",
    "Three months later, the model changed, costs crept up and the engineer who built it left.",
    "The business still relies on it, and the auditor still asks who is accountable.",
  ],
  // incidents closed and rework hours saved a quarter as each fix lands, on days 42, 64 and 86
  plan: { kpi: [[42, 5, 420], [64, 2, 160], [86, 1, 240]], kpiText: (e) => String(Math.round(11 - e)) },
  // the bridge on the framework's 12–16 scale offset by 80 (README, "Value")
  value: {
    run: (add) => (94.2 + add).toFixed(1) + "%",
    pct: (add) => "+" + add.toFixed(1) + " pts",
    ev: (p) => Math.round(902 * p).toLocaleString("en-GB"),
  },
  pfCount: ["0 run packs", "1 run pack"],
  trNoun: "incident",
  // the health review's matrix, live systems by signals, cells a risk score; the five shortlisted
  // cells' bubble targets (prototype dgData)
  audit: {
    cos: [
      ["Credit memo assistant", "Credit"],
      ["Client report drafter", "Client service"],
      ["Research notes", "Research"],
      ["Complaint drafter", "Customer ops"],
      ["Sanctions screener", "Compliance"],
      ["KYC file builder", "Onboarding"],
    ],
    wf: ["Accuracy drift", "Latency", "Model version", "Access", "Cost per case", "Ownership"],
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
  // Incidents: one system's September; each event carries its four handling steps (prototype trData)
  trace: [
    [
      "Model provider update",
      "Day 4",
      [
        ["Detected", "Provider released a new model version overnight", "Version watch · 04:10"],
        ["Contained", "New version held back; system pinned to the approved one", "Change gate CG-2 · held"],
        ["Fixed", "New version scored on the 1,200-case suite: 93.8%, above the floor", "Suite run S-0904"],
        ["Signed off", "Risk owner approved the migration", "6 Sep · 09:12"],
      ],
    ],
    [
      "Accuracy below the floor",
      "Day 11",
      [
        ["Detected", "Nightly score fell to 91.6% against a 92% floor", "Nightly suite · 02:00"],
        ["Contained", "Leverage section routed to analysts until fixed", "Fallback rule FB-3 · on"],
        ["Fixed", "New add-back format added to the parser and the suite", "Release R-0912 · 94.1%"],
        ["Signed off", "Credit manager", "12 Sep · 16:40"],
      ],
    ],
    [
      "Cost spike",
      "Day 15",
      [
        ["Detected", "Cost per case rose 38% in a day", "Spend monitor · 11:30"],
        ["Contained", "Retry loop on long documents found and capped", "Hotfix H-0915"],
        ["Fixed", "Long documents split before drafting", "Release R-0916 · £0.39 per case"],
        ["Signed off", "Service owner", "16 Sep · 10:05"],
      ],
    ],
    [
      "Access review",
      "Day 20",
      [
        ["Detected", "Quarterly review found two leavers with access", "Access report AR-Q3"],
        ["Contained", "Both accounts removed within the hour", "Identity provider · 14:22"],
        ["Fixed", "Access now tied to the HR leaver feed", "Change C-0921"],
        ["Signed off", "Information security", "21 Sep · 09:00"],
      ],
    ],
    [
      "New document format",
      "Day 26",
      [
        ["Detected", "Reviewer flagged a new auditor template", "Feedback queue · case 4,812"],
        ["Contained", "Affected memos marked for full human review", "Fallback rule FB-5 · on"],
        ["Fixed", "Template added; 40 new cases added to the suite", "Suite v2.7 · 1,240 cases"],
        ["Signed off", "Credit analyst lead", "27 Sep · 15:30"],
      ],
    ],
    [
      "Monthly run report",
      "Day 30",
      [
        ["Detected", "Accuracy 94.6% · cost £0.38 · 5 events, all closed", "Run report RR-09"],
        ["Contained", "No event reached a client or a decision", "Incident log · September"],
        ["Fixed", "Two suite additions, one parser change, one access control", "Change log · 4 items"],
        ["Signed off", "Risk committee", "2 Oct · 10:00"],
      ],
    ],
  ],
  copy: {
    introLabel: "Run log",
    hero: {
      eyebrow: "Production Assurance",
      title: ["Go-live is day one.", "We keep it right from there."],
      lede: "AI systems drift. Models change underneath them, costs creep and the people who built them move on. We hold every live system to an agreed accuracy floor, catch problems before your team does, and keep the runbooks current, so the system stays trusted long after launch.",
      primary: "Book a health review",
      secondary: "See how incidents are handled",
      secondaryHref: "#trace",
    },
    premise: {
      eyebrow: "01 / Premise",
      title: ["Launch is the easy part.", "Month three is where systems fail."],
      lede: "A pilot goes live with a demo that works. Then the model provider ships an update, document formats change, and the one engineer who understood the system leaves. Nobody notices the accuracy slipping until a client or an auditor does.",
      cards: [
        { label: "launch day", eyebrow: "Launch day" },
        { label: "month three", eyebrow: "Month three" },
        { label: "accountability", eyebrow: "Accountability" },
      ],
    },
    audit: {
      label: "Health review",
      eyebrow: "02 / Health review",
      title: "In two weeks, we review every AI system already in production, ours or anyone’s, and rank what to fix first by risk to the business.",
      yTicks: ["Low", "Medium", "High"],
      yAxis: "Risk to the business ↑",
      xAxis: "Effort to fix →",
      quadrant: "Fix first",
      legend: "Risk score, 0.1 to 1.2",
      bubbles: [
        "Memo assistant · accuracy drift",
        "Report drafter · access",
        "Complaint drafter · cost per case",
        "KYC builder · accuracy drift",
        "Research notes · cost per case",
      ],
      list: {
        title: "Fix first · live systems",
        rows: [
          ["Credit memo assistant", "Re-baseline and add a nightly suite", "High", "6 wks"],
          ["Client report drafter", "Remove shared service account", "High", "5 wks"],
          ["Complaint drafter", "Route simple cases to a smaller model", "Medium", "4 wks"],
          ["KYC file builder", "Nightly suite, from fix 01", "Medium", "3 wks"],
          ["Research notes", "Cache repeat sources", "Medium", "8 wks"],
        ],
        total: "Five fixes, ranked by risk and effort",
        note: "Fix 04 reuses fix 01",
      },
      steps: [
        [
          "Days 1–6",
          "Logs, access lists and run costs read for every live system",
          "→ system inventory",
        ],
        [
          "Days 7–9",
          "Each system scored on accuracy, drift, cost, access and ownership",
          "→ scored matrix",
        ],
        ["Day 10", "A ranked fix list and a run plan for every system", "→ fix list"],
      ],
      caption: "Illustrative estate of six live systems. Real reviews score each one on accuracy, drift, cost, access and ownership, with the evidence attached.",
    },
    band: {
      label: "CTA · health review",
      eyebrow: "First step",
      title: "Start with a two-week health review.",
      cta: "Book an audit",
      note: "The fix list is yours, whether we run it or not",
    },
    plan: {
      label: "First 100 days in production",
      eyebrow: "03 / First 100 days in production",
      title: ["The first hundred days,", "as a run log."],
      lede: "We take over monitoring, evaluation and on-call for your live systems, fix the highest risks first, and leave a runbook your team has rehearsed. Every change is scored against the suite before it ships.",
      window: "Run log — live systems · Q3",
      rows: [
        ["Health review", "Days 0–14"],
        ["Monitoring live", "Days 8–30"],
        ["Memo assistant re-baselined", "Days 14–42"],
        ["Model migration", "Days 36–64"],
        ["Cost tuning", "Days 56–86"],
        ["Evaluation and handover", "Days 70–100"],
      ],
      log: [
        ["D03", "Baseline signed: 11 open incidents, accuracy 79% against a 92% floor"],
        ["D14", "Review closed. Fix list agreed, on-call rota live"],
        ["D30", "Monitoring and nightly suites live in your own tenant"],
        ["D42", "Memo assistant back above the floor · 93%"],
        ["D64", "Model migrated · scored on the suite before release"],
        ["D86", "Cost per case down from £0.71 to £0.38"],
        ["D100", "Runbooks rehearsed with your team · 3 incidents open"],
      ],
      kpi: {
        label: "Open incidents",
        start: "11",
        sub: "Against the baseline signed on day 3",
        hours: "Rework hours saved / qtr",
      },
      board: {
        title: "Run checklist · Q3",
        items: ["Memo assistant re-baselined", "Model migration", "Cost tuning"],
      },
      note: "Every figure comes from the platform’s own logs, reported to you monthly.",
    },
    trace: {
      eyebrow: "Traceability",
      title: ["Click any incident.", "See how it was handled."],
      lede: "Every event in production is detected, contained, fixed and signed off, and each step is recorded. Your risk team and your auditor read the same log we do.",
      window: "Run log — Credit memo assistant · September 2026",
      investor: "System CMA-01",
      period: "1–30 Sep",
      pill: "Closed · 4 of 4 steps",
      pillNote: "Same log in the monthly run report",
      panel: "Handling",
      caption: "Illustrative month for one system. Names, references and figures are examples.",
    },
    portfolio: {
      label: "Across systems",
      eyebrow: "04 / Across systems",
      title: "Set up once. Run across every system.",
      glow: "Each system comes under watch faster than the last.",
      lede: "The monitoring, evaluation and runbook pack set up for the first system goes into a shared library. The next system adopts it, adds its own test cases, and is under watch in days rather than weeks.",
      library: "Run library",
      slot: ["Monitoring pack", "from Credit memo assistant · v1.4"],
      sum: ["Time to watch", "6 weeks → 1 week"],
      rows: [
        ["Credit memo assistant", "Credit · set up here"],
        ["KYC file builder", "Onboarding · adopted"],
        ["Complaint drafter", "Customer ops · adopted"],
        ["Client report drafter", "Client service · adopted"],
        ["Research notes", "Research · adopted"],
      ],
      deltas: ["First setup", "−50%", "−67%", "−75%", "−83%"],
      chip: "Monitoring pack",
      caption: "Illustrative five-system estate. Timings depend on each system’s logs and test data.",
    },
    playbooks: {
      label: "Playbooks",
      eyebrow: "Playbooks",
      title: ["Four systems we run,", "written up from delivery."],
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
      title: ["Accuracy you can bridge,", "line by line."],
      lede: "Every system reports against the floor agreed at handover. The monthly run report shows what moved accuracy and why, and the same evidence answers your risk team and your auditor.",
      window: "Monthly run report — Credit memo assistant · month 6",
      chart: "Cases right first time",
      axis: "% · axis starts at 92",
      from: "94.2% →",
      run: "94.2%",
      pct: "+0.0 pts",
      labels: ["94.2%", "+1.2 pts", "+0.5 pts", "+0.2 pts", "+0.3 pts", "96.4%"],
      ticks: ["96", "95", "94", "93", "92"],
      names: [
        ["At handover", "month 0"],
        ["Model migration", "scored before release"],
        ["Drift alerts", "caught within a day"],
        ["New formats", "added to the suite"],
        ["Reviewer feedback", "fed back weekly"],
        ["Accuracy", "measured at month 6"],
      ],
      ev: ["+2.2 pts on 41,000 cases a quarter", "0", "fewer cases reworked a quarter"],
      caption: "Illustrative bridge for one system. Each line is measured against the floor agreed at handover.",
    },
    work: {
      eyebrow: "Related work",
      title: ["Measured against the week", "before we arrived."],
      lede: "Client names are withheld under mandate. Each engagement reports the baseline instrumented at the diagnostic and the figure at the third monthly review.",
      // The case studies have no pages yet: both go to the home page's selected engagements, as "All work" does, until /work/<slug> exists.
      cards: [
        {
          href: routes.caseStudies,
          image: "/img/playbooks/loan-ops-ledger.webp",
          eyebrow: "Private Credit · Production Assurance",
          title: "Daily agent-notice reconciliation for a loan operations team",
          summary: "Agent notices were reconciled to the loan system at month end, so breaks piled up. Notices are now matched every day, and each break carries an explanation before close.",
          metrics: [
            ["Breaks open at month end", "86 → 4"],
            ["Notices matched each day", "1,900"],
            ["Breaks without an owner", "None"],
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
    offer: {
      label: "CTA · book an audit",
      eyebrow: "Not live yet?",
      title: "Start with a two-week workflows & processes audit.",
      line: "We map what your teams do today, measure the baseline and rank what is worth building, before anything goes into production.",
      cta: "Book an audit",
      // the audit is offered from AI Engineering
      href: `${routes.aiEngineering}#engagement`,
      note: "The process map is yours, whether we build or not",
      tone: "night",
    },
    engagement: {
      eyebrow: "06 / Engagement",
      title: ["Three ways in.", "Each one earns the next."],
      cards: [
        {
          head: ["Engagement 01", "2 weeks · fixed fee"],
          title: "The health review",
          body: "We review every AI system you already run, ours or anyone’s: accuracy, drift, cost per case, access and ownership. You get a ranked fix list and a run plan for each system.",
          facts: [["Covers", "Every live system"], ["Access", "Read-only"], ["Output", "Fix list and run plan"]],
          cta: "Book an audit",
        },
        {
          head: ["Engagement 02", "30 days · per system"],
          title: ["The handover", "to production"],
          body: "We take over monitoring, evaluation and on-call, fix the top risks first and agree the accuracy floor each system is held to.",
          facts: [["Runs in", "Your cloud"], ["On-call", "From day one"], ["Floor", "Agreed per system"]],
          cta: "Book a call",
        },
        {
          head: ["Engagement 03", "Monthly · per system"],
          title: "Ongoing assurance",
          body: "We hold the floor and drive cost per case down, with a one-page report every month. Your team can take it in-house at any point; the runbooks assume you will.",
          facts: [
            ["Report", "Monthly, one page"],
            ["Notice", "One month"],
            ["Exit", "Rehearsed handover"],
          ],
          cta: "Book a call",
        },
      ],
      rounded: true,
      strongLastVeil: true,
    },
  },
};
