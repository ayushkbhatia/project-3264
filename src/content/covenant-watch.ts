// Copy for the Covenant Watch playbook page (/playbooks/covenant-watch), set verbatim from the
// design handoff (design_handoff_covenant_watch: the prototype, Covenant Watch.dc.html, wins
// over copy-deck.md where they differ). Do not rewrite, shorten or reorder: straight quotes,
// minus signs and arrows are deliberate. The figures' text lives with the figures
// (src/components/playbooks/covenant-watch/); every name and number there is fictional.
//
// Content rules from the handoff: the model never decides a breach ("a named person signs
// every breach"); no "AI-powered", "real-time", "autonomous" or "100% accurate"; and never the
// old one-liner "breaches flagged before quarter close", which is inaccurate.

import type { PlaybookArticle } from "@/components/playbooks/article/types";
import { routes } from "./home";

export const covenantWatch: PlaybookArticle = {
  slug: "covenant-watch",
  meta: {
    title: "Covenant Watch — 3264.ai",
    description:
      "Compliance certificates recomputed from the credit agreement's own definitions, with headroom, add-back caps and cure rights tracked every test date.",
  },
  reviewed: { iso: "2026-09-28", label: "Reviewed 28 September 2026" },
  hero: {
    category: { label: "Private Credit", href: routes.privateCredit },
    title: "Covenant Watch",
    oneLiner:
      "Borrower certificates recomputed from the credit agreement's own definitions, with headroom, add-back caps and cure rights tracked every test date.",
    standfirst:
      "Each quarter your borrowers send financial statements and a signed compliance certificate, typically 45 to 60 days after quarter end. We read the package against the credit agreement as amended: the caps on EBITDA add-backs, the limit on netted cash, the step-down schedule. Code recomputes every ratio. Where the result differs from the certificate, you see why, line by line, with the clause cited. Headroom, cure windows and cure counts are tracked per borrower, and a named person signs every breach.",
    secondary: { label: "See how it is built", href: "#built" },
    figure: "recompute",
  },
  // INTERIM: a pre-addressed email until there is a booking URL (then swap the href here;
  // SmartLink opens an http(s) URL in a new tab). The two-week audit is booked on AI
  // Engineering's engagement cards.
  cta: {
    mapping: { label: "Book a mapping session", href: "mailto:hello@3264.ai?subject=Covenant%20Watch" },
    audit: { label: "Book a two-week audit", href: `${routes.aiEngineering}#engagement` },
  },
  back: { label: "All playbooks", href: routes.playbooks },
  overviewLabel: "Overview",
  sidebarCard: "Bring one agreement and its latest certificate",

  sections: [
    {
      id: "today",
      num: "01",
      label: "The work today",
      eyebrow: "01 / The work today",
      title: "A quarterly test that starts after the quarter ends",
      blocks: [
        {
          type: "p",
          text: "Covenant monitoring runs on documents the borrower prepares. The credit agreement sets the definitions; the compliance certificate applies them. Your team checks one against the other, borrower by borrower, and has to act while the cure window is still open.",
        },
        {
          type: "roles",
          items: [
            {
              role: "Credit analyst, with deal counsel",
              text: "Abstracts each covenant, the EBITDA definition with its add-back caps, and the cure clause, at closing and at every amendment.",
            },
            {
              role: "Portfolio monitoring analyst",
              text: "Keeps each borrower's reporting calendar: monthly statements, quarterly statements with the compliance certificate, audited annual accounts.",
            },
            {
              role: "Borrower's Responsible Officer",
              text: "Sends the statements and a signed compliance certificate by email or portal, each ratio shown line by line.",
            },
            {
              role: "Credit or portfolio analyst",
              text: "Spreads the financials, recomputes EBITDA and each ratio under the agreement's definitions, compares them with the certificate and measures headroom.",
            },
            {
              role: "Portfolio manager or credit committee",
              text: "Reviews headroom trends, watchlists tightening names, and weighs cure, waiver or amendment when a test fails.",
            },
            {
              role: "Administrative agent",
              text: "Circulates certificates and notices to the lender group; waivers and amendments go to the Required Lenders for consent.",
            },
          ],
        },
        {
          type: "io",
          cards: [
            {
              label: "Inputs",
              items: [
                "Credit agreement, with schedules, exhibits and every amendment",
                "Compliance certificate with its covenant schedules",
                "Monthly, quarterly and audited annual financial statements",
                "Sponsor or base-case model",
                "Borrowing base certificate, on asset-based deals",
              ],
            },
            {
              label: "Outputs",
              items: [
                "Covenant abstract per agreement",
                "Watchlist row per borrower and covenant: level, actual, headroom, status, next deadline",
                "Exception or breach memo",
                "Cure log",
                "Covenant status for the valuation committee, investor reporting and fund-facility reporting",
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
      title: "Four places a covenant test goes wrong",
      blocks: [
        {
          type: "breaks",
          items: [
            {
              title: "Taking the certificate's arithmetic",
              text: 'Certificates are prepared by the borrower. Run-rate add-backs for new customer contracts and revenue synergies can "meaningfully inflate covenant headroom" (Practical Law, 2025). A missed breach is a lost negotiating moment.',
            },
            {
              title: "Testing against a superseded term",
              text: 'Add-back caps and covenant levels are negotiated per deal and change by amendment. In one filed amendment, the conformed text runs deleted and inserted words together, so a plain extract reads "iswas". Miss that and you test the wrong level.',
            },
            {
              title: "A cure clock missed or misread",
              text: "Equity cure funding is typically due 10 to 15 days after the financial statements are required. Cure proceeds count only towards the financial covenants, not pricing. A missed date loses the cure; a misapplied one hides the breach.",
            },
            {
              title: "Stress hidden from breach counts",
              text: "Lincoln International attributes a lower-than-expected covenant default rate partly to amendments that pre-empt defaults and to elevated PIK use; 11% of the loans it valued carried PIK in 2025. Breach counts alone understate stress.",
            },
          ],
        },
        {
          type: "platformCard",
          icons: ["covenant-watch", "capital-call-flow", "loan-ops-ledger"],
          title: "See three playbooks on one platform",
          text: "Covenant Watch, Capital Call Flow and Loan Ops Ledger, running on the same record for a private credit fund.",
          link: { label: "See the Private Credit platform", href: routes.privateCredit },
        },
      ],
    },
    {
      id: "runs",
      num: "03",
      label: "How it runs",
      eyebrow: "03 / How it runs",
      title: "The model reads, code computes, a person signs",
      blocks: [
        {
          type: "p",
          text: "Covenant Watch is a fixed workflow, not a free-roaming agent. The model reads and drafts. Code computes and compares. A named person approves the covenant spec, reviews anything flagged, and signs every breach.",
        },
        {
          type: "stepTable",
          head: ["Step", "The model reads or drafts", "Code computes or decides", "A person signs"],
          rows: [
            {
              step: "1. Encode the agreement",
              cells: [
                "Locates the covenants, defined terms, cap formulas, step-down table and cure clause; drafts the covenant spec with each clause cited",
                "Validates the spec: cap base (before or after add-backs), dates in order, amendment chain applied in sequence",
                "Credit analyst approves the spec, once per agreement and once per amendment",
              ],
            },
            {
              step: "2. Log the package",
              cells: [
                "Classifies each document: certificate, statements, borrowing base certificate",
                "Checks delivery against the reporting calendar, records file hashes, scans for hidden text, lists anything missing",
                "Portfolio monitoring analyst chases missing items",
              ],
            },
            {
              step: "3. Extract",
              cells: [
                "Reads each certificate line and EBITDA build line, with page and span",
                "Matches each value to its span, checks units, cross-foots the schedules; failures go to review",
                "Analyst reviews every flagged or abstained figure",
              ],
            },
            {
              step: "4. Recompute",
              cells: [
                null,
                "Applies add-back caps and the cash-netting cap, rolls the test period, computes each ratio to two decimals, compares with the step-down level, computes headroom and the Cure Amount",
                null,
              ],
            },
            {
              step: "5. Explain the difference",
              cells: [
                "Drafts a variance note from the calculation trace, citing the clause",
                "Checks every number in the note against the trace",
                "Analyst accepts or edits the note",
              ],
            },
            {
              step: "6. Cure and calendar",
              cells: [
                null,
                "Dates the cure window; checks cure count and amount limits per the agreement",
                "Sponsor and lenders decide; the portfolio manager records the decision",
              ],
            },
            {
              step: "7. Decide and escalate",
              cells: [
                "Drafts the exception memo",
                "Updates watchlist status only after sign-off",
                "Portfolio manager or credit committee signs every breach and near-breach",
              ],
            },
          ],
        },
        {
          type: "callout",
          label: "Never automated",
          text: "Breach determinations, cure acceptance, waiver and amendment decisions, and every message to the borrower, the administrative agent or the lender group stay with your team. The covenant spec never changes without an analyst's approval. The system proposes; it cannot send, post or sign.",
        },
        { type: "figure", id: "cure" },
      ],
    },
    {
      id: "evidence",
      num: "04",
      label: "The evidence",
      eyebrow: "04 / The evidence",
      title: "Every figure traces to a page and a clause",
      blocks: [
        {
          type: "p",
          text: "Each test leaves an evidence line: where the figure came from, which version of the agreement governed it, what code did with it, and who signed. Records are stored, not regenerated, because model output can vary between runs. Your reviewer, auditor or valuation committee can follow any number back to its source.",
        },
        { type: "figure", id: "evidenceLine" },
        { type: "h3", text: "Kept for every run" },
        {
          type: "kept",
          items: [
            "Agreement version and amendment chain, with file hashes",
            "Covenant spec version and the analyst who approved it",
            "File hashes for every document in the package",
            "Page and span for each extracted value",
            "The calculation trace: inputs, caps, ratio, headroom, Cure Amount",
            "Prompt versions and the pinned model version",
            "Validator results and flags",
            "Reviewer decision, edits and timestamps",
          ],
        },
        { type: "figure", id: "bundle" },
        {
          type: "midCta",
          title: "Thirty minutes, one borrower.",
          text: "We will walk the definitions with you, show where the recompute could differ, and tell you what it would take to build.",
        },
      ],
    },
    {
      id: "built",
      num: "05",
      label: "How it is built",
      eyebrow: "05 / How it is built",
      title: "A fixed workflow with the model at the edges",
      technical: true,
      blocks: [
        {
          type: "p",
          text: "For engineers and technical reviewers. The breach decision has to be a calculation over cited inputs, so the model never makes it. It reads long agreements and messy schedules into typed records; deterministic code does every piece of arithmetic; people approve the rules and sign the results.",
        },
        { type: "figure", id: "trace" },
        { type: "h3", id: "built-harness", text: "Harness" },
        {
          type: "bullets",
          items: [
            {
              lead: "Pattern: prompt chaining, one section per covenant.",
              text: "Locate definitions, extract figures, then test deterministically. Anthropic recommends fixed workflows over agents where a task is well defined and needs to be predictable.",
            },
            {
              lead: "One bounded agent loop, read-only.",
              text: "Resolving a definition chain across amendments may need several lookups; that loop can read documents and nothing else.",
            },
            {
              lead: "Typed hand-off.",
              text: "Every model output crossing into code is a record: field, value, unit, as-of date, document, page, span, extractor version. It is schema-checked, then value-checked.",
            },
            {
              lead: "Deterministic engines.",
              text: "A ratio calculator driven by the encoded definitions and step-down schedule; a headroom and cure calculator; date logic for test periods and cure windows.",
            },
          ],
        },
        { type: "figure", id: "anatomy" },
        { type: "h3", id: "built-data", text: "Data and integrations" },
        {
          type: "bullets",
          items: [
            "Credit agreements and amendments as PDF or HTML, including conformed changed pages",
            "Signed compliance certificates (PDF) with covenant schedules; monthly and quarterly variants",
            "Financial statements as PDF or Excel: monthly, quarterly and audited annual",
            "Borrowing base certificates on asset-based deals; sponsor model and agreement-fixed EBITDA for pre-closing quarters",
            "Facility data read from your loan system; prior-quarter test results",
            "Arrives by borrower portal or email; no industry message standard for certificates exists",
            "Outputs to your watchlist or portfolio monitoring platform, and to valuation and fund-facility reporting",
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
              hard: "Definitions chain across clauses and amendments. On 170 EDGAR credit agreements averaging about 84,000 tokens, the 16 models tested (2024–25, including GPT-4o) struggled with multi-hop and set questions (KG-MuLQA, 2025 preprint).",
              we: "Store each agreement's definitions as a graph, test the multi-hop chains, and have an analyst approve the encoded spec.",
            },
            {
              hard: "Finding the right page. In FinanceBench (Nov 2023), GPT-4-Turbo answered 19% of questions correctly with a shared vector store and 85% when handed the right pages.",
              we: "Keep one index per agreement and per package, never a shared pool, and measure retrieval on its own.",
            },
            {
              hard: "Tables. In late-2024 tests the best PDF parser scored about 79 of 100 on table structure, and GPT-4o 72 (OmniDocBench).",
              we: "Parse layout first, then cross-foot every schedule: quarters sum to the test period, net debt equals debt less capped cash, units agree.",
            },
            {
              hard: "Arithmetic in text. Writing programs instead of computing in text improved accuracy by about 12% (Program of Thoughts, Codex, 2022); one inconsequential clause cut accuracy by up to 65% (GSM-Symbolic, 2024 models).",
              we: "Compute every cap, ratio, headroom figure and Cure Amount in code, from cited inputs only.",
            },
            {
              hard: "Borrower documents are untrusted input. Undefended, targeted prompt injection succeeded in 47.7% of AgentDojo security cases against GPT-4o (2024-05-13); a least-privilege tool filter cut that to 7.5%.",
              we: "The reader has no write tools and no network access, returns typed fields only, and seeded injection cases sit in the test set.",
            },
          ],
        },
        { type: "h3", id: "built-evals", text: "How we know it works" },
        {
          type: "bullets",
          items: [
            {
              lead: "Golden set, built with your team.",
              text: "Past quarters across several of your deals, plus public EDGAR agreements and synthetic certificates with fictional names: amended agreements, caps taken before and after add-backs, step-down boundary dates, negative EBITDA, cure events, scanned certificates, injected text. Two reviewers label independently; we measure their agreement.",
            },
            {
              lead: "Scored per field, not on average.",
              text: 'Exact match on certificate lines, test levels and dates; recomputed ratios agreeing at the two-decimal "x.xx to 1.00" presentation; breach recall weighted above precision; share of differences explained with a clause cited.',
            },
            {
              lead: "Release gate.",
              text: "Each fortnightly release passes the full regression suite, including every known breach in the golden set, before it ships.",
            },
            {
              lead: "Consistency, not one good run.",
              text: "The same package is run several times and must give the same result every time (pass^k).",
            },
            {
              lead: "Shadow run, then acceptance.",
              text: "One full quarterly test cycle alongside your current process, which stays authoritative. Each disagreement is logged with its cause. Your business owner signs against agreed thresholds and a stated sampling plan.",
            },
            {
              lead: "Regression on change.",
              text: "The suite re-runs on every amendment, prompt change and model migration. Models are pinned to fixed versions.",
            },
          ],
        },
        { type: "figure", id: "routing" },
        { type: "figure", id: "passk" },
        { type: "figure", id: "engagement" },
        { type: "h3", id: "built-controls", text: "Controls and security" },
        {
          type: "bullets",
          items: [
            {
              lead: "Least privilege.",
              text: "The model can read documents and draft proposals. No tool that sends, posts or signs is exposed to it.",
            },
            {
              lead: "Two approvals.",
              text: "An analyst approves the covenant spec; a portfolio manager or credit officer signs every breach and near-breach memo. The system counts as the maker, so a person is always the checker.",
            },
            {
              lead: "Documents are data.",
              text: "Every package is scanned for hidden text. An instruction found inside a document is flagged and routed to review, never followed.",
            },
            {
              lead: "Secrets and traces.",
              text: "Credentials are vault-held and never enter prompts or logs; capture of prompt content in traces is opt-in and redacted.",
            },
            {
              lead: "Hosting and providers.",
              text: "Agreed with each client and named in writing: where the model runs, which providers process data, and where it is stored.",
            },
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
      title: "The rules around covenant monitoring, as of 28 September 2026",
      blocks: [
        {
          type: "rules",
          items: [
            {
              date: "2025-03-05",
              title: "FCA multi-firm review of private market valuation practices",
              text: "Expects documented valuation decisions and a process whose adherence can be tested. Covenant status feeds those decisions.",
            },
            {
              date: "2025-11-17",
              title: "SEC Division of Examinations, FY2026 priorities",
              text: "Names private credit among alternative investments, and checks that firms' AI claims are accurate and their AI use supervised.",
            },
            {
              date: "2026-04-16",
              title: "AIFMD II, Directive (EU) 2024/927",
              text: "Loan-originating AIFs need policies for monitoring their credit portfolio, reviewed at least annually. Transposition varies by member state.",
            },
            {
              date: "2026-04-17",
              title: "Fed SR 26-2 / OCC Bulletin 2026-13",
              text: "Revised US bank model-risk guidance. Generative and agentic AI are outside its scope; your wider governance applies.",
            },
            {
              date: "2026-05-06",
              title: "FSB, Vulnerabilities in Private Credit",
              text: "Proposes monitoring covenant breaches, waivers and amend-extends alongside PIK share, not breaches alone.",
            },
            {
              date: "2026-07-21",
              title: "LSTA model provisions for private corporate credit deals (PCC MCAPs), final",
              text: "Model terms for private credit, members only. Definitions and caps are still negotiated deal by deal.",
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
              term: "Compliance certificate",
              def: "Officer-signed certificate delivered with the financial statements, showing the covenant calculations and confirming no default. Same term US and UK/EU.",
            },
            {
              term: "Maintenance covenant",
              def: "A financial test the borrower must pass on every test date, usually quarterly. Same term US and UK/EU.",
            },
            {
              term: "Headroom / cushion",
              def: 'The EBITDA underperformance against plan that would cause a breach. "Headroom" in UK/EU usage; US commentary often says "cushion".',
            },
            {
              term: "EBITDA add-backs",
              def: "Adjustments such as synergies, restructuring and transaction costs that the agreement lets the borrower add to EBITDA.",
            },
            {
              term: "Shared cap (combined cap)",
              def: "One cap across several add-back categories, often the greater of a dollar amount and a percentage of EBITDA, taken before or after add-backs.",
            },
            { term: "Step-down", def: "A scheduled tightening of a covenant level on set dates." },
            {
              term: "Test period (LTM)",
              def: 'The four consecutive fiscal quarters ending on the test date. LMA-style drafting often says "Relevant Period" (not verified).',
            },
            {
              term: "Equity cure (Cure Right)",
              def: "A sponsor equity contribution deemed to increase EBITDA to cure a financial covenant breach, within limits the agreement sets.",
            },
            {
              term: "Cure Amount",
              def: "The amount needed to restore compliance; contributions above it are usually not allowed.",
            },
            {
              term: "Springing covenant",
              def: "A test that applies only when revolver usage passes a threshold or a trigger event occurs. Mainly US usage.",
            },
            {
              term: "Administrative agent / facility agent",
              def: 'The lender group\'s agent that circulates certificates and notices. "Administrative agent" in US drafting; "facility agent" in LMA/UK usage.',
            },
            {
              term: "Required Lenders",
              def: 'The lender majority whose consent approves most waivers and amendments. LMA-style drafting says "Majority Lenders" (not verified).',
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
            { lead: "Cure eligibility and cure-count tracking per agreement." },
            {
              lead: "Rules strip brought up to date as of 28 September 2026:",
              text: "the revised US bank model-risk guidance, AIFMD II's application date and the final LSTA private credit model provisions.",
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
              q: "When do we see a result for the quarter?",
              a: "When the package arrives. Quarterly certificates typically come 45 to 60 days after quarter end, so no test result can exist at quarter close. The run starts on receipt, and your analyst has the recompute, the explanation of any difference and the cure dates while the cure window is still open.",
            },
            {
              q: "Does the system decide whether a borrower is in breach?",
              a: "No. Code computes each ratio from the encoded definitions and marks the test pass or fail. A portfolio manager or credit officer signs every breach and near-breach memo. Cure acceptance, waivers, amendments and anything sent to the borrower, the agent or the lender group stay with your team.",
            },
            {
              q: "How are amendments handled?",
              a: "Each amendment creates a new version of the covenant spec. The model drafts the changes with the clause cited, code checks dates and sequence, and a credit analyst approves. Earlier versions are kept, so a past quarter is always tested against the terms then in force, and the regression suite re-runs on the new version.",
            },
            {
              q: "Where does the model run, and what happens to our borrower data?",
              a: "Hosting, model providers and data residency are agreed with each client and named in writing. In every set-up, borrower documents are read by a component with no write access and no network egress, model versions are pinned, and each run's inputs, prompts, model version and outputs are stored for the retention period you set.",
            },
            {
              q: "Will it catch borrower fraud?",
              a: "It is not built to. Covenant Watch tests the borrower's arithmetic against the agreement; it does not verify collateral or the borrower's books. First Brands, which disclosed about $2.3bn of unpaid factoring obligations in its 2025 Chapter 11, and Tricolor, whose former executives the SEC charged with double-pledging loans, were collateral cases, not covenant arithmetic.",
            },
            {
              q: "How does this sit with bank model-risk guidance?",
              a: "The US bank guidance revised on 17 April 2026 (SR 26-2 / OCC Bulletin 2026-13) puts generative and agentic AI outside its scope and excludes deterministic rule-based processes from its definition of a model. We make no compliance claim. We design to its principles, independent challenge, outcomes analysis and ongoing monitoring, and your own governance sets the controls.",
            },
          ],
        },
      ],
    },
  ],

  // Blurbs as written for this page; they differ from the library's (content/playbooks.ts).
  more: {
    title: "More playbooks",
    all: { label: "All nine playbooks", href: `${routes.playbooks}#library` },
    items: [
      {
        slug: "loan-ops-ledger",
        blurb: "Agent notices matched to the loan system every day, with each break explained before month end.",
      },
      {
        slug: "capital-call-flow",
        blurb: "Calls computed from the LPA and side letters, sent per investor, and matched to the wires that arrive.",
      },
      {
        slug: "nav-pack-review",
        blurb: "Administrator NAV packs tied out line by line to your books, with every break explained before the CFO signs.",
      },
    ],
  },
  closing: {
    title: "Bring one agreement and its latest certificate",
    text: "Thirty minutes, one borrower. We will walk the definitions with you, show where the recompute could differ, and tell you what it would take to build.",
  },
};
