// Copy for the Investor Reporting playbook page (/playbooks/investor-reporting), set verbatim
// from the design handoff (design_handoff_investor_reporting: the prototype, Investor
// Reporting.dc.html, wins over copy-deck.md and its README where they differ). Do not rewrite,
// shorten or reorder: straight quotes, minus signs and arrows are deliberate. The figures' text
// lives with the figures (src/components/playbooks/investor-reporting/); every name, identifier
// and number there is fictional, and the numbers reconcile.
//
// Content rules from the handoff: the model never computes a return, never chooses which figure
// goes into a sentence and never writes a DDQ answer that is not already in the approved
// library; every numeral is bound to a calculation, and an unbound number blocks release. Gross
// and net always share period, method and subscription-facility treatment. No "AI-powered",
// "real-time", "autonomous" or "100% accurate". The rules rows are stated as of 28 September
// 2026 (the 2027-03-31 row is a future expectation): re-check them, and the SEC figures in §02,
// before publishing.

import type { PlaybookArticle } from "@/components/playbooks/article/types";
import { routes } from "./home";

export const investorReporting: PlaybookArticle = {
  slug: "investor-reporting",
  meta: {
    title: "Investor Reporting — 3264.ai",
    description:
      "Quarterly letters, ILPA capital account statements and DDQ answers drafted from your books, with every figure traced to its calculation before release.",
  },
  reviewed: { iso: "2026-09-28", label: "Reviewed 28 September 2026" },
  hero: {
    // There is no Fund Management industry page yet: the Playbooks library's row stands in.
    category: { label: "Fund Management", href: `${routes.playbooks}#fund-management` },
    title: "Investor Reporting",
    oneLiner:
      "Letters, capital account statements and DDQ answers drafted from your books, with every figure traced to source before release.",
    standfirst:
      "Each quarter your team writes to limited partners: the letter, the capital account statements, the ILPA Reporting Template, and the due-diligence questionnaires that arrive in between. We build the system that drafts them from your approved NAV, ledger and cash flows. Performance is computed in code on one basis, gross and net, with and without the subscription facility. Every number in the text is bound to its calculation and source cells, and a number without one cannot ship. Your CFO and compliance team sign before release.",
    secondary: { label: "See how it is built", href: "#built" },
    figure: "boundSentence",
  },
  // INTERIM: a pre-addressed email until there is a booking URL.
  cta: {
    mapping: { label: "Book a mapping session", href: "mailto:hello@3264.ai?subject=Investor%20Reporting" },
    audit: { label: "Book a two-week audit", href: `${routes.aiEngineering}#engagement` },
  },
  back: { label: "All playbooks", href: routes.playbooks },
  overviewLabel: "Overview",
  sidebarCard: "Bring last quarter's letter. We will trace it.",

  sections: [
    {
      id: "today",
      num: "01",
      label: "The work today",
      eyebrow: "01 / The work today",
      title: "One quarter's figures, rebuilt in five documents",
      blocks: [
        {
          type: "p",
          text: "ILPA's framework gives a direct fund 60 days after each of the first three quarters, and 120 days after year-end, unless the LPA says otherwise. In that window the same NAV, returns and fees are written into the letter, the statements, the template and the DDQs.",
        },
        {
          type: "roles",
          items: [
            {
              role: "Fund administrator",
              text: "Closes the quarter, producing the books, capital activity, partner capital accounts, fee and expense schedules and reconciliations from the GL and investor ledger.",
            },
            {
              role: "Valuation committee",
              text: "Approves the marks and portfolio data, with an explanation of each quarter-on-quarter valuation change, as the ILPA Principles ask.",
            },
            {
              role: "Fund finance",
              text: "Computes gross and net IRR, TVPI and DPI, with and without the subscription facility, from one set of cash flows.",
            },
            {
              role: "IR lead",
              text: "Drafts the letter with the investment team and fills the ILPA Reporting Template in Excel.",
            },
            {
              role: "Fund controller and CCO",
              text: "Trace each figure to an approved source. Compliance reviews anything used as an advertisement under the Marketing Rule.",
            },
            {
              role: "GP leadership and IR",
              text: "Leadership approves and IR releases through the LP portal. Between quarters, IR and compliance answer DDQs from the approved answer library.",
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
                "Approved NAV and partner capital accounts from the administrator (XLSX or PDF)",
                "General ledger and trial balance",
                "Investor ledger: commitments, calls, distributions and transfers",
                "Cash flows by transaction type, fund-to-investor and fund-to-investment",
                "Subscription facility statements: draws, repayments, balances and costs",
                "Valuation memos and portfolio-company data",
                "Prior letters and the approved DDQ answer library",
              ],
            },
            {
              label: "Outputs",
              items: [
                "Quarterly letter to limited partners (PDF, through the LP portal)",
                "Capital account statements (PCAPs) per LP",
                "ILPA Reporting Template v2.0 in Excel",
                "ILPA Performance Template, with first delivery expected for Q1 2027",
                "DDQ responses: ILPA DDQ 2.0, AIMA's 2025 questionnaire, or the LP's own spreadsheet",
                "For EU AIFMs, the annual disclosure of fees, charges and expenses borne by investors",
              ],
            },
          ],
        },
        { type: "figure", id: "capitalAccount" },
      ],
    },
    {
      id: "breaks",
      num: "02",
      label: "Where it breaks",
      eyebrow: "02 / Where it breaks",
      title: "The same figure, written five times, drifts",
      blocks: [
        {
          type: "breaks",
          items: [
            {
              title: "Gross and net on different bases",
              text: "In February 2024 SEC staff said that an adviser which excludes subscription-facility effects from a private fund's gross IRR cannot include them in net IRR. The pair must share period and method, or the advertisement falls short of the Marketing Rule.",
            },
            {
              title: "Performance nobody can substantiate",
              text: "The Marketing Rule requires a reasonable basis to substantiate material statements of fact on SEC demand. In September 2024 the SEC charged nine advisers, with $1.24m in combined penalties, over untrue or unsubstantiated statements and testimonial and third-party rating failures.",
            },
            {
              title: "Fee and offset errors in capital accounts",
              text: "SEC orders in 2023 and 2025 over a management-fee basis and over fee offsets ended in money returned to funds and investors. A wrong fee line flows straight into each LP's statement.",
            },
            {
              title: "Questions that drift, answers that go stale",
              text: "The same question arrives worded differently in ILPA DDQ 2.0, AIMA's 2025 questionnaire and bespoke LP spreadsheets, and AIMA publishes a concordance just to map its own 2019 questions to 2025. The SEC's FY2026 exam priorities include the accuracy of what firms say about their use of AI.",
            },
          ],
        },
        {
          type: "related",
          slug: "nav-pack-review",
          label: "Related playbook · Fund Management",
          title: "NAV Pack Review",
          text: "Every letter starts from an approved NAV. NAV Pack Review ties the administrator's pack to your books, line by line, before the CFO signs.",
          cta: "Read the playbook",
        },
      ],
    },
    {
      id: "runs",
      num: "03",
      label: "How it runs",
      eyebrow: "03 / How it runs",
      title: "The model drafts. Code computes. Your team signs.",
      blocks: [
        {
          type: "p",
          text: "The workflow runs from a frozen, dated snapshot of your books. Every figure is computed once, in code, and then written into each document from that one result. The model's job is language: reading layouts, drafting commentary, matching questions.",
        },
        {
          type: "stepTable",
          plain: true,
          empty: "No model step",
          head: ["Step", "The model reads or drafts", "Code computes or decides", "A person signs"],
          rows: [
            {
              step: "Snapshot",
              cells: [
                "Reads administrator PCAP and NAV pack layouts into typed records",
                "Freezes an as-of snapshot and hashes every input",
                "Fund controller confirms the snapshot",
              ],
            },
            {
              step: "Performance",
              cells: [
                null,
                "IRR, TVPI, DPI and RVPI, gross and net, with and without the facility, over one period and method",
                "CFO approves the figures",
              ],
            },
            {
              step: "Capital accounts and ILPA template",
              cells: [
                "Suggests a row mapping for any new GL account",
                "Rolls each LP from beginning to ending NAV, applies each section's sign rules, checks that the LPs sum to the fund",
                "Fund controller confirms new mappings",
              ],
            },
            {
              step: "Letter",
              cells: [
                "Drafts commentary from approved facts and prior letters",
                "Binds every numeral to a calculation ID and blocks any number it cannot bind",
                "IR lead edits; CCO reviews content used in advertisements",
              ],
            },
            {
              step: "DDQ",
              cells: [
                "Matches a re-worded question to approved library items and adapts wording without changing facts",
                "Uses only approved, in-date items; drafts nothing when none exists",
                "CCO approves any new or changed answer",
              ],
            },
            {
              step: "Consistency",
              cells: [
                null,
                "Checks that each figure matches across letter, PCAP, ILPA template and DDQ",
                "Fund controller clears any mismatch",
              ],
            },
            {
              step: "Release",
              cells: [
                { faint: "The send tool is not exposed to the model" },
                "Locks the version and writes the distribution log",
                "GP leadership or CFO releases through the portal",
              ],
            },
          ],
        },
        { type: "figure", id: "ddq" },
        {
          type: "callout",
          quiet: true,
          label: "What is never automated",
          text: "Nothing reaches an investor until a named person releases it. The model never computes a return, never chooses which figure goes into a sentence, and never writes a DDQ answer that is not already in your approved library. Approving new answers, changing a performance method and releasing the package stay with your team.",
        },
      ],
    },
    {
      id: "evidence",
      num: "04",
      label: "The evidence",
      eyebrow: "04 / The evidence",
      title: "Every number in the letter has an address",
      blocks: [
        {
          type: "p",
          text: "For each release we keep the sentence, the number, the calculation that produced it and the cells it came from, with the snapshot and the approvals. Rule 204-2 asks advisers to keep the records that demonstrate a performance calculation, and copies of advertisements, for five years. The run record is built to that standard.",
        },
        { type: "figure", id: "evidenceLine" },
        { type: "h3", text: "Kept for every run" },
        {
          type: "kept",
          items: [
            "The data snapshot, its as-of date and a hash of every input",
            "For each figure: calculation ID, cash-flow inputs, method flags (granular or gross-up, facility on or off) and source cells",
            "Every draft version, with the IR lead's edits",
            "Prompt version and pinned model version for each drafted passage",
            "For each DDQ answer: library item, version, approver and review date",
            "Controller, CFO, compliance and release approvals, each with a timestamp",
            "The released copy and its distribution list",
            "Anything blocked, and why",
          ],
        },
        { type: "figure", id: "bundle" },
        {
          type: "midCta",
          title: "One letter, traced sentence by sentence",
          text: "We take a letter you have already sent and show where each figure would come from and who would sign it.",
        },
      ],
    },
    {
      id: "built",
      num: "05",
      label: "How it is built",
      eyebrow: "05 / How it is built",
      title: "A drafting loop that cannot invent a number",
      technical: true,
      blocks: [
        {
          type: "p",
          text: "Investor Reporting is a workflow, not a free-roaming agent. Code assembles the snapshot and computes every figure. The model drafts inside an evaluator–optimizer loop, and the evaluator is a deterministic check that each numeral binds to a calculation. People approve and release. The harness is ours to build and yours to own.",
        },
        { type: "figure", id: "blueprint" },
        { type: "h3", id: "built-harness", text: "Harness" },
        {
          type: "bullets",
          items: [
            {
              lead: "Pattern.",
              text: "Evaluator–optimizer drafting over a frozen snapshot and an approved answer library. Workflows are the right fit when a task is well defined and needs to be predictable.",
            },
            "The draft loop ends only when every numeral is bound and every required disclosure is present; otherwise the draft goes back or is blocked.",
            "The one agent-like loop is DDQ search, and it has read-only tools over the approved library.",
            "No agent sits in the send path. Outbound communications need a human release.",
            "Where a broker-dealer affiliate distributes material, FINRA's communications rule applies to AI-generated content as to any other.",
          ],
        },
        { type: "figure", id: "anatomy" },
        { type: "h3", id: "built-data", text: "Data and integrations" },
        {
          type: "bullets",
          items: [
            "Administrator NAV and partner capital accounts: XLSX or PDF, or a portal extract, quarterly.",
            "General ledger and trial balance: XLSX or CSV export, quarterly.",
            "Investor ledger (commitments, calls, distributions, transfers): administrator investor-services extract, per event.",
            "Cash flows mapped to ILPA transaction types for the Performance Template, by the granular or gross-up method.",
            "Subscription facility data from lender statements and the GL.",
            "Output: ILPA templates in Excel, which ILPA recommends over PDF; letters and statements as PDF through your LP portal.",
            "DDQs in ILPA DDQ 2.0 (Word or PDF), AIMA's modular 2025 questionnaire, or the LP's own spreadsheet.",
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
              hard: "A citation is a pointer, not proof. In a 2023 audit of four generative search engines (Bing Chat, NeevaAI, perplexity.ai, YouChat), only 51.5% of sentences were fully supported by their citations.",
              we: "A number-in-text verifier parses every numeral in the draft and matches it to the snapshot. A number it cannot bind blocks release.",
            },
            {
              hard: "Retrieval does not stop invention. Leading RAG-based legal research tools hallucinated 17–33% of the time in a preregistered 2024 study (Lexis+ AI, Westlaw AI-Assisted Research, Ask Practical Law AI; queries run March to May 2024).",
              we: "DDQ answers come only from your approved library. With no approved answer, nothing is drafted and the question goes to compliance.",
            },
            {
              hard: "Language models are unreliable at arithmetic in text. Having the model write a program instead improved accuracy by about 12% on average across 8 maths and finance datasets (Program of Thoughts, Codex, 2022).",
              we: "IRR, multiples and capital account roll-forwards run in unit-tested code. The model does no arithmetic.",
            },
            {
              hard: "Model judges carry bias. GPT-4 as a judge agreed with human preferences 85% of the time, but gave the same verdict when answer order was swapped in only 65% of cases (MT-Bench, 2023).",
              we: "The rubric judge for tone and required disclosures is validated against your IR lead's own labels before it gates anything.",
            },
            {
              hard: "One figure lives in many places, and ILPA's capital account section signs values by their effect on wealth (a carry increase is negative for LPs, positive for the GP and null for the total fund).",
              we: "Each figure has one calculation ID and is written into every document from it; sign rules are coded per section and column.",
            },
          ],
        },
        { type: "h3", id: "built-evals", text: "How we know it works" },
        {
          type: "bullets",
          items: [
            {
              lead: "Release gate.",
              text: "Number-tie rate of 100%. Every numeral in the letter bound to a calculation and source cells.",
            },
            {
              lead: "Numeric exact match",
              text: "against an independent recomputation: currency amounts exact after rounding rules, IRR within one basis point.",
            },
            {
              lead: "Pairing and consistency.",
              text: "Gross/net pairing pass rate, and cross-document mismatches across letter, PCAP, template and DDQ.",
            },
            {
              lead: "DDQ.",
              text: "Share of answers containing facts absent from the library, abstention rate on questions with no approved answer, and share of answers past their review date.",
            },
            {
              lead: "Golden set.",
              text: "A fictional fund with full cash-flow history and hand-verified IRR and TVPI pairs; the ILPA template filled for three quarters, including a legacy-fund case; 100+ DDQ questions with paraphrased variants and unanswerable ones; past letters with reviewer edits as labels.",
            },
            {
              lead: "Shadow run.",
              text: "One full quarter alongside your current process before the system drafts anything that is sent. These are our engineering targets; no published benchmark exists for this work.",
            },
          ],
        },
        { type: "figure", id: "routing" },
        { type: "h3", id: "built-controls", text: "Controls and security" },
        {
          type: "bullets",
          items: [
            "Tools are tiered read, propose and execute. The send tool is not exposed to the model; release runs from the approval screen under the approver's own identity.",
            "LP emails, administrator packs and bespoke DDQ spreadsheets are untrusted input. They are read by a component with no write tools and no network egress, and instructions found inside them are flagged, not followed.",
            "The answer library is versioned, with an owner, an approver and a review date on every item.",
            "Models are pinned to fixed versions and changed only after the full evaluation suite passes. Each run's inputs, prompt version, model version and output are stored, so a result can be reconstructed without re-running the model.",
          ],
        },
        { type: "figure", id: "injection" },
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
      // the date is in the title, so there is no separate "Status as of" line
      title: "The rules, as of 28 September 2026",
      blocks: [
        {
          type: "rules",
          items: [
            {
              date: "2024-02-06",
              title: "SEC staff Marketing Rule FAQ",
              text: "Gross and net IRR must share period, method and subscription-facility treatment.",
            },
            {
              date: "2024-06-05",
              title: "SEC private fund adviser rules vacated",
              text: "No SEC-mandated quarterly statement; content comes from your LPA, side letters and ILPA practice.",
            },
            {
              date: "2025-01-22",
              title: "ILPA Reporting Template v2.0 released",
              text: "Applies from Q1 2026 to funds in their investment period or launched from 1 January 2026.",
            },
            {
              date: "2025-11-17",
              title: "SEC FY2026 examination priorities",
              text: "Examiners check the accuracy of AI representations and how firms supervise AI, including in back-office work.",
            },
            {
              date: "2026-04-16",
              title: "AIFMD II transposition date",
              text: "EU AIFMs add annual disclosure of all fees and expenses borne by investors; national transposition is uneven.",
            },
            // a future expectation, not yet in force
            {
              date: "2027-03-31",
              title: "ILPA Performance Template",
              text: "First delivery expected for Q1 2027, after four quarters of data capture from Q1 2026.",
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
              term: "Capital account statement (PCAP)",
              def: 'A per-LP statement moving beginning NAV to ending NAV for the period. "PCAP" is US usage.',
            },
            {
              term: "ILPA Reporting Template",
              def: "ILPA's standard Excel template for fees, expenses and carried interest in a capital account layout; v2.0 released January 2025.",
            },
            {
              term: "ILPA Performance Template",
              def: "ILPA's standard template for cash flows and performance metrics, gross and net, with and without subscription facilities.",
            },
            {
              term: "Subscription facility (subscription line)",
              def: "A fund credit line secured on LP commitments. It delays capital calls and can raise reported IRR.",
            },
            {
              term: "Net IRR with and without the facility",
              def: "Investor-level IRR after fees and carry, shown including and excluding subscription-facility effects; ILPA calls these levered and unlevered.",
            },
            {
              term: "TVPI / DPI / RVPI",
              def: "Total value, distributions and residual value (NAV), each divided by paid-in capital.",
            },
            {
              term: "Granular vs gross-up method",
              def: "Performance from itemised fund-to-investor cash flows, or from fund-to-investment cash flows grossed up.",
            },
            {
              term: "Internal chargebacks",
              def: "Fees and expenses paid to the GP or related persons, shown separately from external partnership expenses.",
            },
            {
              term: "Offsets",
              def: "Management-fee reductions from portfolio-company fees, with a roll-forward of offsets not yet applied.",
            },
            {
              term: "Substantiation (US)",
              def: "Under the Marketing Rule, a reasonable basis to prove a material statement of fact on SEC demand.",
            },
            {
              term: "Advertisement (US) / financial promotion (UK)",
              def: 'The Marketing Rule\'s term and the FCA\'s term for regulated marketing communications; the UK standard is "fair, clear and not misleading".',
            },
            {
              term: "DDQ and approved answer library",
              def: "The investor's due-diligence questionnaire, and the versioned, approved answers used to reply to it.",
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
              text: "Rules strip reviewed: the SEC quarterly statement rule is shown as vacated, and ILPA Reporting Template v2.0 as applying from Q1 2026.",
            },
            {
              date: "2026-09-28",
              text: "Performance Template timing corrected to first delivery for Q1 2027, with data capture from Q1 2026.",
            },
            {
              date: "2026-09-28",
              text: "AIFMD II annual fee and expense disclosure added for EU AIFMs, subject to national transposition.",
            },
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
              q: "Does this replace our fund administrator?",
              a: "No. Your administrator still closes the books and produces the partner capital accounts. We read its output, recompute performance and the capital account roll-forwards independently, and tie every figure before anything is drafted. Your fund controller stays the checker. Where the numbers disagree, the difference goes to a named person; the system does not choose which figure is right.",
            },
            {
              q: "How does this fit with the Marketing Rule?",
              a: "Compliance with the Marketing Rule is your firm's, and whether a given letter is an advertisement is your compliance team's judgement. What we build is designed to support that review: gross and net computed over the same period and method, each figure backed by a stored calculation record, and copies of released material retained.",
            },
            {
              q: "Do you produce the ILPA templates?",
              a: "The design maps your ledger to ILPA Reporting Template v2.0 rows, in Excel, with each section's sign rules coded. The Reporting Template applies from Q1 2026 to funds in their investment period or launched from 1 January 2026. Performance Template first delivery is expected for Q1 2027.",
            },
            {
              q: "What happens to a DDQ question we have never answered?",
              a: "Nothing is drafted. The system uses only approved, in-date answers from your library, so a question with no match goes to your compliance team with the text and the nearest library items for reference. Once compliance approves an answer, it enters the library with a version, an owner and a review date, and is used from then on.",
            },
            {
              q: "Where does the model run, and who sees our data?",
              a: "We name the model providers and sub-processors for your due diligence, and EU clients can enter them in their DORA register of information. Models are pinned to fixed versions. Documents from outside the firm are read with no write tools and no network egress. Hosting region, data retention and deployment in your own cloud are agreed with each client and named in writing.",
            },
            {
              q: "What do you need from us to start?",
              a: "Four quarters of letters, capital account statements and NAV packs, the cash-flow history behind your performance figures, and your current DDQ answers. In a mapping session we trace one of your letters sentence by sentence and show where each figure would come from and who would sign it.",
            },
          ],
        },
        { type: "figure", id: "engagement" },
      ],
    },
  ],

  more: {
    title: "More playbooks",
    all: { label: "All nine playbooks", href: `${routes.playbooks}#library` },
    items: [
      {
        slug: "nav-pack-review",
        blurb: "Administrator NAV packs tied out line by line to your books, with every break explained before the CFO signs.",
      },
      {
        slug: "side-letter-register",
        blurb: "Every promise in your LPAs and side letters, tracked to its clause, owner and proof of delivery.",
      },
      {
        slug: "capital-call-flow",
        blurb: "Calls computed from the LPA and side letters, sent per investor, and matched to the wires that arrive.",
      },
    ],
  },
  closing: {
    title: "Bring last quarter's letter. We will trace it.",
    text: "In one session we take a letter you have already sent and show, sentence by sentence, where each figure would come from and who would sign it.",
  },
};
