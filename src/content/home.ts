// All copy on the home page, as data. Set verbatim from the design handoff
// (design_handoff_home/reference/3264 Home.dc.html) — do not rewrite, shorten or reorder.
//
// Two blocks are explicitly placeholder and say so on the page: the case-study figures and
// the team. Keep their notes until signed-off content replaces them.

export type Link = { label: string; href: string };

// Routes for pages that are designed but not built yet. They 404 until those pages ship.
export const routes = {
  aiEngineering: "/ai-engineering",
  aiTransformation: "/ai-transformation",
  privateCredit: "/industries/private-credit",
  company: "/company",
  companyWho: "/company#who",
  companyHow: "/company#how",
} as const;

// Where "book a session" actually happens. The CTAs above the closing pitch (header, hero) go
// to #contact to land on it; the closing button and everything below it come here.
// INTERIM: a pre-addressed email until the client supplies a booking URL (Calendly/HubSpot).
// Swapping that in is this one line; SmartLink opens an http(s) URL in a new tab.
export const booking = { href: "mailto:hello@3264.ai?subject=Mapping%20session" } as const;

export const nav: Link[] = [
  { label: "AI Engineering", href: routes.aiEngineering },
  { label: "AI Transformation", href: routes.aiTransformation },
  { label: "Industries", href: "#industries" },
  { label: "Work", href: "#work" },
  { label: "Playbooks", href: "#playbooks" },
  { label: "Company", href: routes.company },
];

export const headerCta: Link = { label: "Book a call", href: "#contact" };

export const hero = {
  titleLines: ["Deployment is", "the deliverable."],
  standfirst:
    "3264 builds and runs AI systems inside banking, fund management and asset management firms. Scope is fixed before we start. You are billed for what reaches production.",
  primary: { label: "Book a mapping session", href: "#contact" },
  secondary: { label: "How we charge", href: "#model" },
  cards: [
    {
      vig: "vigA",
      eyebrow: "Engagement",
      title: "Fixed scope, fixed price",
      body: "Each capability is priced and signed off before build begins. Change is quoted, never quietly absorbed.",
    },
    {
      vig: "vigB",
      eyebrow: "First release",
      title: "Six weeks to production",
      body: "A working release inside six weeks, then a release every fortnight against the agreed scope.",
    },
    {
      vig: "vigC",
      eyebrow: "After launch",
      title: "Accuracy held, not assumed",
      body: "We keep the evaluation suite. Drift is caught and corrected before it reaches anyone downstream.",
    },
  ],
} as const;

export const model = {
  eyebrow: "01 / The model",
  title: "You pay for what reaches production.",
  standfirst:
    "Consulting bills attention. We bill delivery. The commercial terms are written so that a feature nobody uses costs us, not you.",
  rows: [
    {
      label: "Scope",
      value:
        "Defined in a two-week diagnostic and frozen. Change requests are priced, never absorbed silently.",
    },
    {
      label: "Price",
      value:
        "Per delivered capability, invoiced on acceptance. No timesheets, no rate cards, no bench.",
    },
    {
      label: "Proof",
      value:
        "Cycle time, error rate and cost per file are measured before build and reported monthly after.",
    },
    {
      label: "Exit",
      value:
        "Source, prompts, evaluation sets and runbooks are yours from day one. Nothing is held hostage.",
    },
  ],
} as const;

export const capabilities = {
  eyebrow: "02 / Capabilities",
  title: "Three ways in. One accountable team.",
  standfirst:
    "Most firms arrive with a shortlist of ideas and no way to judge them. We start where the evidence is thinnest and stay until the system is in production and monitored.",
  // Left-column copy for the three acts. The stage panels are data-driven inside
  // src/motion/platform-sequence.js (phAudit / phCaps / phNights) and are not typed here.
  acts: [
    {
      num: "01",
      duration: "2 weeks",
      rail: "Assess",
      title: "Assess",
      body: "A function-by-function audit of where documents, handoffs and exceptions consume time. Ends in a ranked use-case ledger with cost, risk and expected return per item.",
      list: ["Workflow and data mapping", "Baseline instrumentation", "Build / buy recommendation"],
    },
    {
      num: "02",
      duration: "6–12 weeks",
      rail: "Build",
      title: "Build",
      body: "A small senior squad ships the system into your environment: retrieval, extraction, review interface, audit trail. Priced per capability, released fortnightly.",
      list: [
        "Document and decision pipelines",
        "Human-in-the-loop interfaces",
        "Integration into systems of record",
      ],
    },
    {
      num: "03",
      duration: "Ongoing",
      rail: "Run",
      title: "Run",
      body: "Deployed systems drift. We hold the evaluation suite, watch accuracy and cost per run, and retrain as models and regulation move underneath them.",
      list: [
        "Evaluation and regression suites",
        "Accuracy and spend monitoring",
        "Model migration as the frontier moves",
      ],
    },
  ],
} as const;

export const industries = {
  eyebrow: "03 / Industries",
  title: "Four sectors. The same bottleneck.",
  standfirst:
    "Every mandate we take on runs on documents that people read, summarise and re-key. That is the work we remove first, because it is measurable and it is where the risk sits.",
  rows: [
    {
      code: "R1",
      name: "Private Credit",
      body: "Loan origination and management, covenant testing, borrower monitoring, investor reporting and fund facility compliance.",
      href: routes.privateCredit,
    },
    {
      code: "R2",
      name: "Financial Services",
      body: "Credit memos, KYC and onboarding files, model lifecycle documentation, complaints triage and regulatory response.",
      href: "#industries",
    },
    {
      code: "R3",
      name: "Fund Management",
      body: "LP reporting cycles, capital calls and distributions, portfolio monitoring, side-letter obligations and data-room diligence.",
      href: "#industries",
    },
    {
      code: "R4",
      name: "Asset Management",
      body: "Research synthesis, mandate and guideline compliance, RFP and DDQ response, client reporting and attribution commentary.",
      href: "#industries",
    },
  ],
} as const;

export const work = {
  eyebrow: "04 / Selected engagements",
  title: "Measured against the week before we arrived.",
  standfirst:
    "Client names are withheld under mandate. Each engagement below reports the baseline we instrumented at the diagnostic stage and the figure at the third monthly review.",
  // PLACEHOLDER figures — structure is final, numbers are not.
  cases: [
    {
      sector: "Fund management · Private markets",
      title: "Quarterly LP reporting for a $500MM growth fund",
      body: "Portfolio data arrived as 90-odd spreadsheets and PDF updates. We built extraction into the fund's own warehouse, with analyst review on every figure before it reaches an LP letter.",
      rows: [
        { label: "Reporting cycle", value: "11 days → 2 days" },
        { label: "Companies monitored", value: "94, continuously" },
        { label: "Figures re-keyed by hand", value: "None" },
      ],
    },
    {
      sector: "Financial services · Commercial bank",
      title: "Credit memo preparation across a $6.4B book",
      body: "Every figure extracted with a citation back to the page it came from. Credit officers review exceptions only; the audit trail satisfied the bank's internal model risk function without amendment.",
      rows: [
        { label: "Time per memo", value: "6 hrs → 40 min" },
        { label: "Memos prepared", value: "1,240" },
        { label: "Field-level citations", value: "100%" },
      ],
    },
  ],
  note: "Placeholder figures — structure is correct, numbers to be replaced with signed-off engagement data.",
} as const;

export const stack = {
  label: "Built on",
  logos: [
    { src: "/logos/anthropic.png", alt: "Anthropic" },
    { src: "/logos/openai.png", alt: "OpenAI" },
    { src: "/logos/aws.png", alt: "Amazon Web Services" },
    { src: "/logos/vercel.png", alt: "Vercel" },
    { src: "/logos/supabase.png", alt: "Supabase" },
    { src: "/logos/langchain.png", alt: "LangChain" },
    { src: "/logos/langgraph.png", alt: "LangGraph" },
    { src: "/logos/n8n.png", alt: "n8n" },
    { src: "/logos/cursor.png", alt: "Cursor" },
  ],
} as const;

export const team = {
  eyebrow: "05 / Who we are",
  title: "Engineers who have carried a pager.",
  standfirst:
    "The people who scope the work are the people who build it. No account layer, no offshore handoff, no partner you meet once at the pitch.",
  // PLACEHOLDER — names, portraits and biographies to come.
  people: [
    { role: "Managing Partner", discipline: "AI & Engineering" },
    { role: "Managing Partner", discipline: "Delivery & Operations" },
    { role: "Advisor", discipline: "Product & Applied AI" },
    { role: "Advisor", discipline: "Capital Markets" },
  ],
  portraitLabel: "portrait",
  note: "Names, photographs and biographies to be supplied.",
} as const;

export const playbooks = {
  eyebrow: "06 / Playbooks",
  title: "What we have learned, written down.",
  items: [
    { eyebrow: "Playbook · 12 pages", title: "Instrumenting a workflow before you automate it", href: "#playbooks" },
    { eyebrow: "Note", title: "Why document extraction pilots stall at 80% accuracy", href: "#playbooks" },
    { eyebrow: "Note", title: "A procurement checklist for AI vendors, from the build side", href: "#playbooks" },
  ],
} as const;

export const closing = {
  title: "The advantage compounds from the day it ships.",
  standfirst:
    "Thirty minutes, one workflow, no deck. We will tell you whether it is worth building and what it would cost before you commit to anything.",
  cta: { label: "Book a mapping session", href: booking.href },
} as const;

export const footerImage = {
  title: "Win the next decade.",
  cta: { label: "Book a call", href: booking.href },
  positioning: "AI software deployment for asset-heavy and document-heavy firms.",
  sequence: "32 → 64",
} as const;

export const footer = {
  columns: [
    {
      head: "Services",
      links: [
        { label: "AI Engineering", href: routes.aiEngineering },
        { label: "AI Transformation", href: routes.aiTransformation },
        { label: "Deployment & Run", href: "#capabilities" },
        { label: "Evaluation suites", href: "#capabilities" },
      ],
    },
    {
      head: "Industries",
      links: [
        { label: "Private Credit", href: routes.privateCredit },
        { label: "Financial Services", href: "#industries" },
        { label: "Fund Management", href: "#industries" },
        { label: "Asset Management", href: "#industries" },
      ],
    },
    {
      head: "Company",
      links: [
        { label: "Who we are", href: routes.companyWho },
        { label: "How we work", href: routes.companyHow },
        { label: "Case studies", href: "#work" },
      ],
    },
    {
      head: "Resources",
      links: [
        { label: "Playbooks", href: "#playbooks" },
        { label: "Field notes", href: "#playbooks" },
        { label: "Security", href: routes.companyHow },
      ],
    },
    {
      head: "Connect",
      links: [
        { label: "Book a call", href: booking.href },
        { label: "hello@3264.ai", href: "mailto:hello@3264.ai" },
        { label: "LinkedIn", href: "#contact" },
      ],
    },
  ] satisfies { head: string; links: Link[] }[],
  copyright: "© 2026 Bearing Deployment Company Inc. All rights reserved.",
  status: "All systems operational",
};
