// Copy for the Evaluation Suites service page (/evaluation-suites), set verbatim from the design
// handoff (design_handoff_evaluation_suites: README, copy-deck.md and the prototype,
// reference/Evaluation Suites.dc.html, which wins where they disagree): the shared chrome
// (metadata, closing image, footer) and, in `page`, every word and figure the shared industry
// components draw (components/industry: like Production Assurance, a service page built on the
// industry pages' framework). The premise cards' three windows are markup, in
// components/evaluation-suites/windows.tsx.
//
// Every system, case count, run reference (S-0922, G-0923 and so on), policy code and figure is
// illustrative; each diagram carries its "Illustrative…" caption until signed-off engagement data
// replaces them. The case studies are sample data; the $6.4B memo case is the home page's,
// flagged there as a placeholder.

import type { FooterColumn } from "@/components/home/Footer";
import type { IndustryPageData } from "@/components/industry/types";
import { routes } from "./home";

export const route = routes.evaluationSuites;

export const meta = {
  title: "3264.ai — Evaluation Suites",
  // The hero's lede, as the other industry and service pages use theirs.
  description: "A demo score tells you how a system did on someone else’s examples. We build a test suite from your own cases, labelled by your experts, and score every system against it every night and before every change. Your risk team gets evidence, not an opinion.",
} as const;

// The closing image (components/home/FooterImage.tsx): the night sky, with this page's copy.
export const closing = {
  title: "Know it works. Every night.",
  cta: { label: "Book an evaluation review", href: "#engagement" },
  positioning: "Evaluation suites built from your own cases, run every night and before every change.",
  sequence: "32 → 64",
  // one line on desktop (README, "Closing")
  wide: true,
} as const;

// The prototype's footer, with this site's routes for its links (README, "Linkage"): Evaluation
// Suites, in Services, is this page; Case studies is the home page's selected engagements until
// a /work page exists; Essays stands in for "Field notes", as on every other page. "Book a call"
// and LinkedIn (no URL yet) are this page's engagement cards.
export const footerColumns: FooterColumn[] = [
  {
    head: "Services",
    links: [
      { label: "AI Engineering", href: routes.aiEngineering },
      { label: "AI Transformation", href: routes.aiTransformation },
      { label: "Production Assurance", href: routes.productionAssurance },
      // not marked current: the reference sets it in the ordinary link colour
      { label: "Evaluation Suites", href: "#top" },
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
    steps: ["sample your cases", "label with your experts", "score every night", "gate every change"],
    live: "5 systems scored",
  },
  statements: [
    "The vendor quoted one number, measured on examples they chose.",
    "In production, the errors clustered in the cases that matter most.",
    "Model risk still asks how you know it works, and a headline number is not an answer.",
  ],
  // case types brought under test and cases labelled as each piece of the suite lands, on days 42, 64 and 86
  plan: { kpi: [[42, 5, 420], [64, 2, 160], [86, 1, 240]], kpiText: (e) => String(Math.round(11 - e)) },
  // the bridge on the framework's 12–16 scale offset by 80 (README, "Value")
  value: {
    run: (add) => (94.2 + add).toFixed(1) + "%",
    pct: (add) => "+" + add.toFixed(1) + " pts",
    ev: (p) => Math.round(902 * p).toLocaleString("en-GB"),
  },
  pfCount: ["0 evaluation packs", "1 evaluation pack"],
  trNoun: "score",
  // the evaluation review's matrix, systems by evaluation signals, cells the gap in evidence; the
  // five shortlisted cells' bubble targets (prototype dgData)
  audit: {
    cos: [
      ["Credit memo assistant", "Credit"],
      ["Client report drafter", "Client service"],
      ["Research notes", "Research"],
      ["Complaint drafter", "Customer ops"],
      ["Sanctions screener", "Compliance"],
      ["KYC file builder", "Onboarding"],
    ],
    wf: ["Severity", "Refusals", "Drift", "Citations", "Edge cases", "Change gate"],
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
  // The nightly run: one system's night 22; each score carries the four steps behind it (prototype trData)
  trace: [
    [
      "Overall accuracy",
      "94.6%",
      [
        ["Measured", "1,173 of 1,240 cases right, weighted by severity", "Run S-0922 · 02:00"],
        ["Compared with", "Floor 92% · last night 94.4%", "Floor agreed 3 Jul"],
        ["Evidence", "Every case, answer and expected answer stored with the run", "Run S-0922 · case list"],
        ["Reviewed", "Model owner", "22 Sep 2026 · 08:30"],
      ],
    ],
    [
      "Leverage section",
      "91.2%",
      [
        ["Measured", "Case type below its own floor of 92%", "Run S-0922 · slice LV"],
        ["Compared with", "Last night 94.0% · new add-back format in 6 cases", "Diff against S-0921"],
        ["Evidence", "The six failing cases, with the expected answers", "Cases 4,801–4,806"],
        ["Reviewed", "Credit analyst lead · section routed to people until fixed", "22 Sep 2026 · 09:05"],
      ],
    ],
    [
      "Citation coverage",
      "99.4%",
      [
        ["Measured", "Figures with a source page that contains them", "Run S-0922 · citation check"],
        ["Compared with", "Floor 99% · last night 99.5%", "Floor agreed 3 Jul"],
        ["Evidence", "Seven uncited figures, each flagged in the draft", "Citation report C-0922"],
        ["Reviewed", "Model owner", "22 Sep 2026 · 08:34"],
      ],
    ],
    [
      "Severe errors",
      "0.1%",
      [
        ["Measured", "Errors that would change a credit decision", "Severity weight 10×"],
        ["Compared with", "Limit 0.5% · last night 0.1%", "Severity policy SV-1"],
        ["Evidence", "One case, reviewed and corrected", "Case 2,214"],
        ["Reviewed", "Risk owner", "22 Sep 2026 · 10:00"],
      ],
    ],
    [
      "Refusals",
      "1.8%",
      [
        ["Measured", "Cases the system declined to answer and sent to a person", "Run S-0922 · refusals"],
        ["Compared with", "Target under 3% · last night 1.7%", "Run history · 30 nights"],
        ["Evidence", "Each refusal with the reason given", "Refusal log R-0922"],
        ["Reviewed", "Model owner", "22 Sep 2026 · 08:40"],
      ],
    ],
    [
      "Release gate",
      "Passed",
      [
        ["Measured", "Candidate release R-0923 scored on the full suite", "Gate run G-0923"],
        ["Compared with", "Must not lower any case type by more than 0.5 pts", "Change policy CG-2"],
        ["Evidence", "Before and after scores for all 18 case types", "Gate report G-0923"],
        ["Reviewed", "Change approver", "23 Sep 2026 · 11:15"],
      ],
    ],
  ],
  copy: {
    introLabel: "Eval log",
    hero: {
      eyebrow: "Evaluation Suites",
      title: ["Accuracy is a number.", "We measure it every night."],
      lede: "A demo score tells you how a system did on someone else’s examples. We build a test suite from your own cases, labelled by your experts, and score every system against it every night and before every change. Your risk team gets evidence, not an opinion.",
      primary: "Book an evaluation review",
      secondary: "See a nightly run",
      secondaryHref: "#trace",
    },
    premise: {
      eyebrow: "01 / Premise",
      title: ["“91% accurate” means nothing.", "Which 9% fails, and does it matter?"],
      lede: "Vendors quote one headline number from a sample they chose. In production the errors are not spread evenly: they cluster in the cases that matter most, and nobody is measuring them by type or by severity.",
      cards: [
        { label: "the demo", eyebrow: "The demo" },
        { label: "in production", eyebrow: "In production" },
        { label: "what did not change", eyebrow: "Model risk review" },
      ],
    },
    audit: {
      label: "Evaluation review",
      eyebrow: "02 / Evaluation review",
      title: "In two weeks, we test every AI system you run or are buying against your own cases, and rank where the evidence is thinnest.",
      yTicks: ["Low", "Medium", "High"],
      yAxis: "Gap in evidence ↑",
      xAxis: "Effort to test →",
      quadrant: "Test first",
      legend: "Evidence gap, 0.1 to 1.2",
      bubbles: [
        "Memo assistant · severity",
        "Report drafter · citations",
        "Complaint drafter · edge cases",
        "KYC builder · severity",
        "Research notes · edge cases",
      ],
      list: {
        title: "Test first · your systems",
        rows: [
          ["Credit memo assistant", "Severity-weighted suite, 1,200 cases", "High", "6 wks"],
          ["Client report drafter", "Citation check on every figure", "High", "5 wks"],
          ["Complaint drafter", "Add 300 edge cases from history", "Medium", "4 wks"],
          ["KYC file builder", "Severity suite, from test 01", "Medium", "3 wks"],
          ["Research notes", "Add unsupported-claim cases", "Medium", "8 wks"],
        ],
        total: "Five suites, ranked by evidence gap",
        note: "Suite 04 reuses suite 01",
      },
      steps: [
        [
          "Days 1–6",
          "A sample of your historic cases drawn for every system",
          "→ case sample",
        ],
        [
          "Days 7–9",
          "Each system scored on accuracy, severity, citations, refusals and edge cases",
          "→ scored matrix",
        ],
        ["Day 10", "A scored report and a suite plan for every system", "→ suite plan"],
      ],
      caption: "Illustrative estate of six systems. Real reviews score each one against your own cases, with every failure attached.",
    },
    band: {
      label: "CTA · health review",
      eyebrow: "First step",
      title: "Start with a two-week evaluation review.",
      cta: "Book an audit",
      note: "The scored report is yours, whatever you decide",
    },
    plan: {
      label: "Building the suite",
      eyebrow: "03 / Building the suite",
      title: ["From your history", "to a nightly score."],
      lede: "We draw cases from your own history, your experts label the right answers, and the suite runs every night from then on. Every prompt, model or rule change is scored against it before release.",
      window: "Suite log — Credit memo assistant · Q3",
      rows: [
        ["Case sampling", "Days 0–14"],
        ["Expert labelling", "Days 8–30"],
        ["Severity scoring", "Days 14–42"],
        ["Citation checks", "Days 36–64"],
        ["Nightly runs and floor", "Days 56–86"],
        ["Evaluation and handover", "Days 70–100"],
      ],
      log: [
        ["D03", "Baseline: 11 case types untested, one headline score of 91%"],
        ["D14", "Sample closed: 1,200 cases drawn from 18 months"],
        ["D30", "Labelling complete with four credit analysts"],
        ["D42", "Severity weights agreed with the risk owner"],
        ["D64", "Every figure checked for a source citation"],
        ["D86", "Nightly runs live · floor set at 92%"],
        ["D100", "Change gate live · suite handed to your team"],
      ],
      kpi: {
        label: "Case types untested",
        start: "11",
        sub: "Against the baseline signed on day 3",
        hours: "Cases labelled",
      },
      board: {
        title: "Suite checklist · Q3",
        items: ["Severity scoring", "Citation checks", "Nightly runs and floor"],
      },
      note: "Every figure comes from the platform’s own logs, scored again every night.",
    },
    trace: {
      eyebrow: "Traceability",
      title: ["Click any score.", "See what is behind it."],
      lede: "Every score in a nightly run can be opened: what was measured, what it was compared with, the cases behind it and who reviewed it. Your model risk team reads the same run we do.",
      window: "Evaluation run — Credit memo assistant · night 22",
      investor: "Suite v2.7 · 1,240 cases",
      period: "22 Sep · 02:00",
      pill: "Evidenced · 4 of 4",
      pillNote: "Same run in the model risk file",
      panel: "Behind the score",
      caption: "Illustrative run for one system. Names, references and figures are examples.",
    },
    portfolio: {
      label: "Across systems",
      eyebrow: "04 / Across systems",
      title: "Built once. Scored across every system.",
      glow: "Each system gets its first score faster than the last.",
      lede: "The scoring, severity weights and change gate built for the first system go into a shared library. The next system adds its own cases and gets its first nightly score in days rather than weeks.",
      library: "Evaluation library",
      slot: ["Evaluation pack", "from Credit memo assistant · v1.4"],
      sum: ["Time to first score", "6 weeks → 1 week"],
      rows: [
        ["Credit memo assistant", "Credit · built here"],
        ["KYC file builder", "Onboarding · adopted"],
        ["Complaint drafter", "Customer ops · adopted"],
        ["Client report drafter", "Client service · adopted"],
        ["Research notes", "Research · adopted"],
      ],
      deltas: ["First setup", "−50%", "−67%", "−75%", "−83%"],
      chip: "Evaluation pack",
      caption: "Illustrative five-system estate. Timings depend on how many cases each system needs labelled.",
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
      title: ["Errors caught you can bridge,", "line by line."],
      lede: "Each addition to the suite catches errors that used to reach a reviewer or a client. The model risk file shows which addition caught what.",
      window: "Suite report — Credit memo assistant · month 6",
      chart: "Errors caught before a person sees them",
      axis: "% · axis starts at 92",
      from: "94.2% →",
      run: "94.2%",
      pct: "+0.0 pts",
      labels: ["94.2%", "+1.2 pts", "+0.5 pts", "+0.2 pts", "+0.3 pts", "96.4%"],
      ticks: ["96", "95", "94", "93", "92"],
      names: [
        ["Headline suite", "month 0"],
        ["Severity weights", "severe errors first"],
        ["Edge cases", "300 from history"],
        ["Citation checks", "every figure"],
        ["Change gate", "before every release"],
        ["Caught", "measured at month 6"],
      ],
      ev: ["+2.2 pts on 41,000 cases a quarter", "0", "fewer errors reaching reviewers a quarter"],
      caption: "Illustrative bridge for one system. Each line is measured on the same 1,240-case suite.",
    },
    work: {
      eyebrow: "Related work",
      title: ["Measured against the week", "before we arrived."],
      lede: "Client names are withheld under mandate. Each engagement reports the baseline instrumented at the diagnostic and the figure at the third monthly review.",
      // The case studies have no pages yet: both go to the home page's selected engagements, as "All work" does, until /work/<slug> exists.
      cards: [
        {
          href: routes.caseStudies,
          image: "/img/playbooks/feat-covenant-watch.webp",
          eyebrow: "Financial Services · Evaluation suites",
          title: "Credit memo preparation across a $6.4B book",
          summary: "Every figure is extracted with a citation back to the page it came from. The suite scores citations nightly, and the audit trail satisfied the bank’s model risk function without amendment.",
          metrics: [
            ["Time per memo", "6 hrs → 40 min"],
            ["Memos prepared", "1,240"],
            ["Field-level citations", "100%"],
          ],
        },
        {
          href: routes.caseStudies,
          image: "/img/playbooks/research-intake.webp",
          eyebrow: "Asset Management · Evaluation suites",
          title: "Overnight research intake for an equity team",
          summary: "Analysts started each day reading filings and broker notes. House-format notes are now ready overnight, and the suite holds back any statement without a source.",
          metrics: [
            ["Morning reading", "2 hrs → 25 min"],
            ["Sources read each night", "300+"],
            ["Unsourced statements published", "None"],
          ],
        },
      ],
      all: "All work →",
    },
    offer: {
      label: "CTA · book an audit",
      eyebrow: "Not built yet?",
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
          title: "The evaluation review",
          body: "We test any AI system you run or are buying, ours or anyone’s, against a sample of your own cases. You get a scored report showing where it fails and how badly.",
          facts: [["Covers", "Any system, any vendor"], ["Access", "Read-only"], ["Output", "Scored report"]],
          cta: "Book an audit",
        },
        {
          head: ["Engagement 02", "6 weeks · per system"],
          title: ["The suite build", "for production"],
          body: "We build a suite from your own history, labelled by your experts, weighted by severity, and agree the floor each system is held to.",
          facts: [["Runs in", "Your cloud"], ["Cases", "Your history"], ["Floor", "Agreed per system"]],
          cta: "Book a call",
        },
        {
          head: ["Engagement 03", "Monthly · per system"],
          title: "Nightly evaluation",
          body: "Every system is scored every night and every change is scored before release. The suite is yours from day one, and your team can run it without us.",
          facts: [
            ["Report", "Monthly, one page"],
            ["Notice", "One month"],
            ["Exit", "Suite handed over"],
          ],
          cta: "Book a call",
        },
      ],
      rounded: true,
      strongLastVeil: true,
    },
  },
};
