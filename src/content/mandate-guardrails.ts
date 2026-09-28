// Copy for the Mandate Guardrails playbook page (/playbooks/mandate-guardrails), set verbatim from
// the design handoff (design_handoff_mandate_guardrails: the prototype, Mandate Guardrails.dc.html,
// wins over copy-deck.md and its README where they differ). Do not rewrite, shorten or reorder:
// straight and curly quotes, minus signs and arrows are deliberate. The figures' text lives with
// the figures (src/components/playbooks/mandate-guardrails/); every name and number there is
// fictional, and the numbers reconcile (23.10 / 500.00 = 4.62%).
//
// Content rules from the handoff: no model sits between an order and its pass, warn or block;
// the model drafts rule specs at encoding time and breach narratives after a person has decided;
// a warning can be overridden with a reason, a block cannot; the page never claims to stop every
// breach; "middle of three" is this mandate's approved reading, not a market standard; F6 is
// illustrative maths; no "AI-powered", "real-time", "autonomous" or "100% accurate". The rules
// rows are as of 28 September 2026 and 2026-12-11 is a future date: re-check them before a later
// review date goes on the page. The FAQ's "Do we have to replace our order management system?"
// answer is suggested wording from the research handoff, for 3264 to confirm.

import type { PlaybookArticle } from "@/components/playbooks/article/types";
import { routes } from "./home";

export const mandateGuardrails: PlaybookArticle = {
  slug: "mandate-guardrails",
  meta: {
    title: "Mandate Guardrails — 3264.ai",
    description:
      "IMA and prospectus restrictions turned into approved, versioned rules, tested on every order and in the daily batch, with breaches and overrides on record.",
  },
  reviewed: { iso: "2026-09-28", label: "Reviewed 28 September 2026" },
  hero: {
    // There is no Asset Management industry page yet: the handoff links the Playbooks index's row.
    category: { label: "Asset Management", href: `${routes.playbooks}#asset-management` },
    title: "Mandate Guardrails",
    oneLiner:
      "Investment guidelines turned into approved, versioned rules, tested before and after each trade, with every breach and override on record.",
    standfirst:
      "We read the IMA, its guideline schedule, the prospectus and the regulatory limits, and draft each restriction as a rule. Your compliance officer approves every rule version, and each one keeps a link to the clause it came from. At run time only the rule engine tests orders and positions: before each trade and again in the daily batch. Breaches are classed active or passive, given a remediation clock, and logged with any override reason and approver. The annual review then draws on that record.",
    secondary: { label: "See how it is built", href: "#built" },
    figure: "clauseToRule",
  },
  // INTERIM: a pre-addressed email until there is a booking URL.
  cta: {
    mapping: { label: "Book a mapping session", href: "mailto:hello@3264.ai?subject=Mandate%20Guardrails" },
    audit: { label: "Book a two-week audit", href: `${routes.aiEngineering}#engagement` },
  },
  back: { label: "All playbooks", href: routes.playbooks },
  overviewLabel: "Overview",
  sidebarCard: "Start with one mandate",

  sections: [
    {
      id: "today",
      num: "01",
      label: "The work today",
      eyebrow: "01 / The work today",
      title: "Guidelines live in a PDF; limits live in the OMS",
      blocks: [
        {
          type: "p",
          text: "Every restriction in an IMA or prospectus has to become a rule your order management system can test. Someone reads the clause, someone codes it, someone approves it, and the rule then runs on every order and every night until the mandate changes.",
        },
        {
          type: "roles",
          items: [
            {
              role: "Guideline analyst",
              text: "Reads the executed IMA, its investment guidelines schedule, amendments and side letters, and writes an interpretation note for each clause.",
            },
            {
              role: "Rule-coding analyst",
              text: "Codes each restriction as an OMS compliance rule from templates; a second person approves it before it goes live.",
            },
            {
              role: "Compliance analyst",
              text: 'Tests new or changed rules against current holdings, what-if trades and historical "as of" snapshots.',
            },
            {
              role: "Portfolio manager",
              text: "Creates the order; the OMS tests it before release. A warning can be overridden with a reason; compliance approves or rejects the override.",
            },
            {
              role: "Investment compliance",
              text: "Runs the daily batch on full positions, classes each breach active or passive, and sets its remediation deadline.",
            },
            {
              role: "Chief compliance officer",
              text: "Notifies the client, fund board or depositary as the IMA and the rules require, and signs the annual review.",
            },
          ],
        },
        {
          type: "io",
          roomy: true,
          cards: [
            {
              label: "Inputs",
              items: [
                "Investment management agreement (IMA) and its investment guidelines schedule",
                "Amendments, addenda and side letters",
                "Prospectus or SAI fundamental policies, including any 80% names policy; UCITS fund rules",
                "Regulatory limits (Investment Company Act, Rules 18f-4 and 22e-4, UCITS Art 52, FCA COLL 5)",
                "Security master: ratings from Moody's, S&P and Fitch; GICS sector; issuer-to-parent-group map",
                "Orders (FIX New Order-Single) and allocations (FIX Allocation Instruction)",
                "Positions: investment book of record (IBOR) and accounting book of record (ABOR)",
              ],
            },
            {
              label: "Outputs",
              items: [
                "Interpretation notes per clause",
                "Versioned rule set per account or account group",
                "Pre-trade results and override tickets",
                "Breach and exception log, with remediation deadlines",
                "Client, board and depositary notifications",
                "Annual review file and the CCO's report to the board",
              ],
            },
          ],
        },
      ],
    },
    {
      id: "breaks",
      num: "02",
      label: "Where it breaks",
      eyebrow: "02 / Where it breaks",
      title: "Where mandate compliance goes wrong",
      blocks: [
        {
          type: "breaks",
          items: [
            {
              title: "Limits breached, and missed",
              text: "The FCA fined Invesco Perpetual £18.6m in 2014 for 33 breaches of investment limits across 15 funds between 2008 and 2012. About £5m of losses was paid back to the funds.",
            },
            {
              title: "One clause, two codings",
              text: '"Investment grade" passes under the middle of three ratings and fails under the lowest; a 5% limit can pass against total assets and fail against net assets. A wrong reading misses breaches or raises alerts people learn to override.',
            },
            {
              title: "Passive breaches left to age",
              text: "Market moves create breaches without a trade, and they cannot be stopped before one. UCITS rules make remedying them a priority for sales; the Names Rule allows 90 consecutive days.",
            },
            {
              title: "A review without its evidence",
              text: "In September 2026 SEC exam staff reported that some advisers did not keep the documentation of their annual compliance-review testing.",
            },
          ],
        },
        {
          type: "related",
          slug: "covenant-watch",
          label: "Related playbook · Private Credit",
          title: "Covenant Watch",
          text: "The same problem in private credit: a ratio passes or fails on the agreement's own definitions. Covenant Watch recomputes each certificate from them.",
          cta: "Read the playbook",
        },
      ],
    },
    {
      id: "runs",
      num: "03",
      label: "How it runs",
      eyebrow: "03 / How it runs",
      title: "The model drafts rules. Code tests every order.",
      blocks: [
        {
          type: "p",
          text: "The model works where there is reading to do: clauses, amendments, breach narratives. Every limit test runs in the rule engine. Every rule version, override and client notice has a named person behind it.",
        },
        { type: "figure", id: "checkSequence" },
        {
          type: "stepTable",
          plain: true,
          spaceAbove: 36,
          head: ["Step", "The model reads or drafts", "Code computes or decides", "A person signs"],
          empty: "Nothing",
          rows: [
            {
              step: "Mandate intake",
              cells: [
                "Finds each restriction in the IMA, schedule, amendments and prospectus, with page and paragraph; flags ambiguous terms",
                "Checks every clause is accounted for: mapped to a rule, or marked manual with a reason",
                "Guideline analyst confirms coverage",
              ],
            },
            {
              step: "Rule drafting",
              cells: [
                "Drafts a rule spec per clause and lists the interpretation choices: rating rule, denominator, timing",
                "Validates the spec against the schema, compiles it and runs boundary tests",
                "Compliance officer approves each version (four-eyes)",
              ],
            },
            {
              step: "Pre-trade and in-trade",
              cells: [
                null,
                "Tests each order, per account after allocation, against every applicable rule: pass, warn or block",
                "Portfolio manager or compliance decides any warning override, with a reason",
              ],
            },
            {
              step: "Daily batch",
              cells: [
                null,
                "Tests full positions; classes each breach active or passive from trade history; starts the remediation clock",
                "Compliance confirms the disposition",
              ],
            },
            {
              step: "Breach record and notices",
              cells: [
                "Drafts the cause narrative and the notice text from the breach record",
                "Fills every figure from the record; tracks deadline and who has been told",
                "CCO or client service signs and sends",
              ],
            },
            {
              step: "IMA amendment",
              cells: [
                "Compares the amended clause with the live rule and drafts the change",
                'Re-runs boundary tests and an "as of" replay; keeps the old version read-only',
                "Compliance approves the new version",
              ],
            },
            {
              step: "Annual review",
              cells: ["Drafts the narrative summary", "Assembles testing records from the logs", "CCO signs"],
            },
          ],
        },
        {
          type: "callout",
          quiet: true,
          label: "Never automated",
          text: "The model never decides whether an order passes. Its part ends when compliance approves a rule; after that only the rule engine tests orders and positions. No rule goes live, no warning is overridden and no notice leaves without a named approver. Passive breaches cannot be prevented before a trade: they are caught in the batch and given a clock.",
        },
      ],
    },
    {
      id: "evidence",
      num: "04",
      label: "The evidence",
      eyebrow: "04 / The evidence",
      title: "Every result traces back to a clause and an approver",
      blocks: [
        {
          type: "p",
          text: "Each test result carries the clause it came from, the rule version that ran, the inputs it read and the person who approved that version. When the IMA changes, the old rule stays on record beside the new one, so any past result can be explained against the rule that produced it.",
        },
        { type: "figure", id: "evidenceLine" },
        { type: "h3", text: "Kept for every run" },
        {
          type: "kept",
          items: [
            "IMA version (hash), clause text and the approved interpretation note",
            "Rule version, who drafted it, who approved it, and when",
            "Boundary-test results for that rule version",
            "Each evaluation: order ID or snapshot ID, the inputs read, the result",
            "Overrides: reason, approver, time",
            "Breaches: when identified, active or passive, deadline, closure",
            "Notifications: who was told, when, and what they were sent",
            "For anything the model drafted: model version, prompt version and raw output",
          ],
        },
        {
          type: "note",
          text: "Retention: records rules such as SEC Rule 204-2 and FCA SYSC 9.1 generally set five years; the period and storage are agreed with each client.",
        },
        {
          type: "midCta",
          title: "Bring one IMA",
          text: "We will walk through how its clauses become versioned rules, where the interpretation calls sit, and who signs each one.",
        },
      ],
    },
    {
      id: "built",
      num: "05",
      label: "How it is built",
      eyebrow: "05 / How it is built",
      title: "Rule engine at run time; model at encoding time",
      technical: true,
      blocks: [
        {
          type: "p",
          text: "This is a workflow, not an agent. The model reads IMAs and drafts rule specs, which compliance approves. The approved rules run as deterministic code. The model is never in the path between an order and its pass, warn or block.",
        },
        { type: "figure", id: "blueprint" },
        { type: "h3", id: "built-harness", text: "Harness" },
        { type: "figure", id: "anatomy" },
        {
          type: "bullets",
          items: [
            {
              lead: "Pattern: deterministic rule engine, with the model only at encoding time.",
              text: "No agent loop runs at run time.",
            },
            {
              lead: "Why a workflow.",
              text: "Fixed code paths suit well-defined tasks that need predictability; mandate testing is one.",
            },
            {
              lead: "Why not a model at run time.",
              text: "Models apply policy inconsistently across runs: in τ-bench, gpt-4o (mid-2024) solved 61.2% of retail tasks once, but fewer than a quarter consistently across 8 tries.",
            },
            {
              lead: "Rules are governed as code.",
              text: "Versioned, tested, approved and read-only once live. Model-risk guidance treats deterministic methods as needing documented controls, and asks firms to consider more for material, complex ones.",
            },
            {
              lead: "Where the rules run:",
              text: "compiled to your OMS compliance module, or run in our engine beside it.",
            },
          ],
        },
        { type: "figure", id: "passk" },
        { type: "h3", id: "built-data", text: "Data and integrations" },
        {
          type: "bullets",
          items: [
            {
              lead: "Guideline sources:",
              text: "IMA and guideline schedule (PDF or Word, sometimes scanned), amendments and side letters; prospectus and SAI policies; UCITS fund rules.",
            },
            {
              lead: "Rule schema:",
              text: "scope, numerator filter, aggregation key, denominator, operator, limit and warning level, test stages, effective dates and source clause, per rule version.",
            },
            {
              lead: "Security master:",
              text: "ratings from Moody's, S&P and Fitch with an explicit selection rule; GICS sector (four tiers); an issuer-to-parent-group map for group limits.",
            },
            {
              lead: "Positions:",
              text: "IBOR for pre-trade (intraday, including pending orders); ABOR for the batch; custodian files for reconciliation. Every test names the book it read.",
            },
            {
              lead: "Orders:",
              text: "FIX 4.4 New Order-Single (35=D) with ClOrdID (11), Account (1) and pre-trade allocations (78/79/80); Allocation Instruction (35=J), whose quantities must sum to the order. Block orders are tested per account after allocation.",
            },
            {
              lead: "Derivatives:",
              text: "notional exposure, 10-year bond equivalents for rate derivatives and delta-adjusted options, where the Names Rule requires them.",
            },
            {
              lead: "Cadence:",
              text: "per order, per execution and in a daily batch, with month-, quarter- and year-end snapshots; Rule 18f-4 VaR each business day, 22e-4 liquidity at least monthly, the Names Rule basket at least quarterly.",
            },
          ],
        },
        {
          type: "h3",
          id: "built-hard",
          text: "What is hard for machines, and what we do about it",
          toc: "What is hard for machines",
        },
        {
          type: "hardWe",
          labels: ["Hard", "We"],
          items: [
            {
              hard: '"Investment grade" with split ratings. Baa3 / BB+ / BBB− is investment grade on the middle rating and high yield on the lowest.',
              we: "The model flags the term; compliance chooses the rule (Bloomberg's index methodology, for example, uses the middle of three, lower of two), and the choice is written into the rule version.",
            },
            {
              hard: "Which denominator, and when. The Names Rule uses net assets plus borrowings for investment purposes, tested at the time of investment; s.5(b)(1) uses total assets.",
              we: "Every rule names its denominator, book and timing. Boundary tests run under each variant (below).",
            },
          ],
        },
        { type: "figure", id: "denominators" },
        {
          type: "hardWe",
          labels: ["Hard", "We"],
          spaceAbove: 24,
          items: [
            {
              hard: "Issuers that belong to one group, and funds that hold other funds.",
              we: "A maintained parent hierarchy, with group companies counted as one body where UCITS requires it; a look-through flag on each rule.",
            },
            {
              hard: "Models drift. GPT-4's accuracy on one task fell from 84.0% to 51.1% between its March and June 2023 versions under the same name.",
              we: "Pinned model versions; after any model change, the rule drafts are re-tested before the model drafts again.",
            },
            {
              hard: "Passive breaches arrive without a trade.",
              we: 'The engine classes each breach from trade history ("no trade in scope since the last pass"), and compliance confirms it.',
            },
          ],
        },
        { type: "h3", id: "built-evals", text: "How we know it works" },
        {
          type: "bullets",
          items: [
            {
              lead: "Clause coverage:",
              text: "every clause in the golden IMAs maps to at least one rule or is marked manual with a reason. Target: 100% accounted for.",
            },
            {
              lead: "Rule correctness:",
              text: "each rule runs on synthetic boundary portfolios (1bp under, at, and 1bp over the limit) under each denominator and timing mode. The suite must pass 100% before a version is approved.",
            },
            {
              lead: "Seeded-breach replay:",
              text: "historical orders and batches replayed with planted breaches: split ratings, group issuers, look-through, derivatives notional, passive moves. Target: no misses.",
            },
            {
              lead: "Golden set:",
              text: "20–40 fictional clauses covering each hard case, plus several of your own mandates with known historical breaches.",
            },
            {
              lead: "Shadow run:",
              text: "results compared case by case with your incumbent compliance system, which stays authoritative; every disagreement is logged with its root cause.",
            },
            {
              lead: "In production:",
              text: "override rate per rule. A rule that is overridden often is usually specified wrongly.",
            },
          ],
        },
        {
          type: "note",
          spaceAbove: 12,
          greedy: true,
          text: "These targets are our proposals, not industry benchmarks; none has been published for this work.",
        },
        { type: "figure", id: "engagement" },
        { type: "h3", id: "built-controls", text: "Controls and security" },
        {
          type: "bullets",
          items: [
            {
              lead: "Four-eyes on every rule version.",
              text: "An approved version cannot be edited; a change creates a new version with its own approver.",
            },
            {
              lead: "Append-only records.",
              text: "Corrections stay visible and records are not otherwise altered, the pattern FCA SYSC 9.1 describes.",
            },
            {
              lead: "Least privilege.",
              text: "The model can read guideline documents and propose rule specs. It has no tool to change a live rule, release an order or send a notice; those run from the approval screen under the approver's identity.",
            },
            {
              lead: "Documents are data.",
              text: "Text inside an IMA, amendment or email fills typed fields; it cannot choose an action.",
            },
            {
              lead: "Where the model runs and what it sees:",
              text: "agreed with each client and named in writing. At encoding time it reads guideline documents only; it has no access to live order flow.",
            },
          ],
        },
        {
          type: "linkCard",
          label: "How we build",
          title: "The harness, evaluation suites and controls behind every playbook",
          link: { label: "AI Engineering", href: routes.aiEngineering },
        },
      ],
    },
    {
      id: "rules",
      num: "06",
      label: "Rules",
      eyebrow: "06 / Rules",
      // The date is in the heading, so there is no "Status as of" line.
      title: "The rules, as of 28 September 2026",
      blocks: [
        {
          type: "rules",
          items: [
            {
              date: "2025-05-21",
              title: "ESMA fund-names guidelines apply to existing funds",
              text: "An 80% threshold for ESG terms; temporary deviations are passive breaches to correct.",
            },
            {
              date: "2025-11-17",
              title: "SEC FY2026 exam priorities",
              text: "Fund portfolios checked for consistency with stated strategy, filings, marketing and the amended Names Rule.",
            },
            {
              date: "2026-06-11",
              title: "Names Rule compliance, fund groups of $1bn or more",
              text: "Each fund complies from its first annual prospectus update on or after this date.",
            },
            {
              date: "2026-09-14",
              title: "SEC risk alert on annual compliance reviews",
              text: "Staff found testing documentation not kept. The review needs its evidence on file.",
            },
            {
              // a future date as of the review
              date: "2026-12-11",
              title: "Names Rule compliance, fund groups under $1bn",
              text: "Quarterly review of the 80% basket; 90 consecutive days to return to compliance.",
            },
          ],
        },
      ],
    },
    {
      id: "terms",
      label: "Terms",
      title: "Terms",
      blocks: [
        {
          type: "terms",
          items: [
            {
              term: "Investment management agreement (IMA)",
              def: "The contract appointing a manager for a segregated account; the investment guidelines are usually a schedule to it.",
              note: 'UK/EU "IMA"; US also "investment advisory agreement".',
            },
            {
              term: "Investment guidelines / restrictions",
              def: "The client's limits on what, and how much, the manager may buy.",
              note: 'US "guidelines"; UK/EU often "restrictions".',
            },
            {
              term: "Pre-trade and in-trade compliance",
              def: "Tests of a proposed order before release, and of a trader's order before it is committed.",
            },
            { term: "Portfolio (batch) compliance", def: "A scheduled test of the whole book, usually daily." },
            { term: "Rule coding", def: "Turning a restriction into a compliance rule the OMS can run." },
            { term: "Four-eyes approval", def: "A second person approves a rule or change before it is used." },
            {
              term: "Hard and soft limit",
              def: "A hard limit blocks the order; a soft limit warns and can be overridden with a documented reason.",
            },
            {
              term: "Active and passive breach",
              def: "Caused by the manager's own trade, or by a market move or event outside its control.",
              note: 'UK/EU usage; US statute speaks of a "discrepancy".',
            },
            {
              term: "Issuer group aggregation",
              def: "Counting companies in the same group as one issuer.",
              note: "Explicit in UCITS.",
            },
            { term: "Look-through", def: "Testing limits against the holdings of funds the portfolio owns." },
            {
              term: "Middle rating",
              def: "The middle of the Moody's, S&P and Fitch ratings, or the lower of two if only two exist.",
            },
            {
              term: '80% basket and "Assets"',
              def: "The Names Rule requires at least 80% of Assets, meaning net assets plus borrowings for investment purposes, to match the fund's name.",
              note: "US; ESMA applies an 80% threshold to ESG names in the EU.",
            },
          ],
        },
      ],
    },
    {
      id: "updated",
      label: "Recently updated",
      title: "Recently updated",
      blocks: [
        {
          type: "updates",
          items: [
            {
              date: "2026-09-28",
              text: "Rules strip updated for the Names Rule compliance dates and the SEC's 14 September 2026 risk alert on annual compliance reviews.",
            },
            { date: "2026-09-28", text: "Evidence list now names the testing records an annual review draws on." },
          ],
        },
      ],
    },
    {
      id: "questions",
      label: "Questions",
      title: "Questions",
      blocks: [
        {
          type: "faq",
          items: [
            {
              q: "Does the model decide whether a trade is allowed?",
              a: "No. The model drafts rule specs from your IMA, and your compliance officer approves each version. From then on, orders and positions are tested by the rule engine alone. The model also drafts breach narratives and notices, but only from the recorded result, after the decision, and a person signs anything that leaves.",
            },
            {
              q: "Can it stop every breach?",
              a: "No. A pre-trade check can block or warn on an order that would breach a rule. It cannot stop a passive breach, which comes from a price move or an event with no trade behind it. Those are caught in the daily batch, classed from the trade history, and given a remediation deadline and an owner.",
            },
            {
              q: "What happens when the IMA is amended?",
              a: 'The amended clause is compared with the live rule, and a new rule version is drafted, tested and approved. The previous version stays on record, read-only. An "as of" replay can show what the new version would have said about past positions, and every past result stays tied to the version that produced it.',
            },
            {
              // Suggested wording from the research handoff: 3264 to confirm before publishing.
              q: "Do we have to replace our order management system?",
              a: "No. Most asset managers already run pre-trade rules in an OMS compliance module. We work on how rules get there: drafting from the clause, testing and approval, lineage and evidence. The approved rules either compile to your OMS or run beside it in shadow until you choose.",
            },
            {
              q: "Where does the model run, and what data does it see?",
              a: "At encoding time the model reads your guideline documents; it needs no access to live order flow. Where it is hosted, which provider and region, and what is retained are agreed with each client and named in writing. Every model call is logged with its model and prompt version.",
            },
            {
              q: "What does this give the annual compliance review?",
              a: "A record, not a rebuilt spreadsheet: rule versions with approvers, test results, overrides with reasons, and breaches with their deadlines and closures. Rule 38a-1 requires a fund CCO's annual written report to the board, and Rule 204-2 requires advisers to keep annual-review records. SEC staff found in 2026 that some advisers kept no testing documentation.",
            },
          ],
        },
      ],
    },
  ],

  more: {
    title: "More playbooks",
    all: { label: "All nine playbooks", href: `${routes.playbooks}#library` },
    items: [
      {
        slug: "client-reporting-flow",
        blurb:
          "Client reports built from reconciled books, each figure tied out and each commentary claim checked against attribution before release.",
      },
      {
        slug: "investor-reporting",
        blurb:
          "Letters, capital account statements and DDQ answers drafted from your books, with every figure traced to source before release.",
      },
      {
        slug: "covenant-watch",
        blurb:
          "Borrower certificates recomputed from the credit agreement's own definitions, with headroom, add-back caps and cure rights tracked every test date.",
      },
    ],
  },
  closing: {
    title: "Start with one mandate",
    text: "Bring one IMA. We will walk through how its clauses become versioned rules, where the interpretation calls sit, and who signs each one.",
  },
};
