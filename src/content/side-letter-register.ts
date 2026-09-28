// Copy for the Side-Letter Register playbook page (/playbooks/side-letter-register), set verbatim
// from the design handoff (design_handoff_side_letter_register: the prototype, Side-Letter
// Register.dc.html, wins over copy-deck.md and its README where they differ). Do not rewrite,
// shorten or reorder: straight quotes, minus signs and arrows are deliberate. The figures' text
// lives with the figures (src/components/playbooks/side-letter-register/); every name and number
// there is fictional, and the counts reconcile (118 provisions → 64 obligations → 105 rows).
//
// Content rules from the handoff: the register records and schedules, it does not decide;
// counsel decides MFN eligibility and carve-outs, and nothing enters the register until a person
// confirms it; the page never claims to make a fund compliant with SEC side-letter rules (the
// Preferential Treatment Rule was vacated in 2024); F2 keeps its sample-assumption note; no
// "AI-powered", "real-time", "autonomous" or "100% accurate". The fund, its LPs and Call 07 are
// Capital Call Flow's. The rules rows are as of 28 September 2026 (the pay-to-play proposal's
// comments close 9 Nov 2026): re-check them before a later review date goes on the page.

import type { PlaybookArticle } from "@/components/playbooks/article/types";
import { routes } from "./home";

export const sideLetterRegister: PlaybookArticle = {
  slug: "side-letter-register",
  meta: {
    title: "Side-Letter Register — 3264.ai",
    description:
      "Every promise in your LPAs and side letters, tracked to its clause, owner and proof of delivery. How the playbook runs, and how we build it.",
  },
  reviewed: { iso: "2026-09-28", label: "Reviewed 28 September 2026" },
  hero: {
    // There is no Fund Management industry page yet: the handoff links the Playbooks index's row.
    category: { label: "Fund Management", href: `${routes.playbooks}#fund-management` },
    title: "Side-Letter Register",
    oneLiner: "Every promise in your LPAs and side letters, tracked to its clause, owner and proof of delivery.",
    standfirst:
      "Side letters change how the LPA applies, investor by investor: a fee discount here, an excuse right or a reporting duty there. Each one is a promise the GP has to keep, and prove it kept, for the life of the fund. We read your LPA, side letters and amendments into a register of obligations. Each entry keeps its source clause, investor, trigger, deadline and owner, feeds the process that performs it, and stores proof of delivery when it is done.",
    secondary: { label: "See how it is built", href: "#built" },
    figure: "register",
  },
  // INTERIM: a pre-addressed email until there is a booking URL.
  cta: {
    mapping: { label: "Book a mapping session", href: "mailto:hello@3264.ai?subject=Side-Letter%20Register" },
    audit: { label: "Book a two-week audit", href: `${routes.aiEngineering}#engagement` },
  },
  back: { label: "All playbooks", href: routes.playbooks },
  overviewLabel: "Overview",
  sidebarCard: "Know which promise is due, and prove it was kept",

  sections: [
    {
      id: "today",
      num: "01",
      label: "The work today",
      eyebrow: "01 / The work today",
      title: "Side letters are signed at closing and kept for years",
      blocks: [
        {
          type: "p",
          text: "Each closing adds side letters. After the final close comes the MFN round. Then every provision has to become an obligation someone owns, performs and can prove, until the fund winds up and the terms roll into the next one.",
        },
        {
          type: "roles",
          items: [
            {
              role: "Fund-formation counsel and investor relations",
              text: "Negotiate each LP's side letter at its closing, starting from house wording and folding common requests into the LPA where possible.",
            },
            { role: "Fund counsel", text: "Keeps a side-letter summary: each provision listed once, with the investors who hold it." },
            {
              role: "GP legal or the CCO, with fund counsel",
              text: "After the Final Closing, circulate the MFN compendium, check each election against tiers and carve-outs, and acknowledge it in writing.",
            },
            {
              role: "Compliance and fund operations",
              text: "Turn provisions into obligations, each with an owner, trigger, deadline, delivery method and evidence field.",
            },
            {
              role: "Investor relations, the fund controller and fund operations",
              text: "Send the reports, apply fee discounts and excuse rights in calls, seek consents, and keep proof of delivery.",
            },
            {
              role: "The CCO",
              text: "Tests the matrix before reporting cycles, capital calls, distributions, transfers and admissions; business owners certify it periodically.",
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
                "LPA and amendments (executed PDF, often scanned)",
                "Side letters and later letters, one set per LP",
                "Subscription documents: notice addresses and approved contacts",
                "Investor register (Schedule 1): legal name, commitment, closing date",
                "MFN compendium and signed election forms",
                "Delivery logs: investor portal, email, e-signature audit trails",
              ],
            },
            {
              label: "Outputs",
              items: [
                "Obligation register (the side-letter matrix)",
                "MFN election record with the GP's written acknowledgements",
                "Input to the AIFMD Art. 23(1)(j) / FUND 3.2.2R preferential-treatment disclosure (EU and UK managers)",
                "Proof of delivery for each completed obligation",
                "Periodic owner certifications",
                "A master compendium carried into the successor fund",
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
      title: "Where side-letter promises are missed",
      blocks: [
        {
          type: "breaks",
          items: [
            {
              title: "Letters archived after closing",
              text: "When side letters are filed away, marketing teams break name-use restrictions and portfolio teams miss restricted-investment terms. The promise was made; nobody downstream knew.",
            },
            {
              title: "The MFN snowball",
              text: "Circulating side letters after every closing produces repeated, ever-larger election rounds. Law firms recommend a single round after the Final Closing; a vendor says rounds meant to take 90 days can stretch to 9–12 months.",
            },
            {
              title: "Preferential terms not disclosed",
              text: "The SEC's 2020 risk alert found side letters granting preferential liquidity without adequate disclosure to other investors. In Galois Capital (September 2024), some investors redeemed on shorter notice than the fund had disclosed.",
            },
            {
              title: "Fee terms applied wrongly",
              text: "In TZP (August 2025), the SEC found $502,041 of excess management fees from offsets applied contrary to the LPAs. A negotiated fee discount sits in the same calculation, with the same exposure.",
            },
          ],
        },
        {
          // the same fictional fund and Call 07 as Capital Call Flow
          type: "related",
          slug: "capital-call-flow",
          label: "Related playbook · Private Credit",
          title: "Capital Call Flow",
          text: "Lanvik's excuse and Northfield's fee discount on this page feed the same fund's Call 07. Capital Call Flow computes each call from the LPA and side letters.",
          cta: "Read the playbook",
        },
      ],
    },
    {
      id: "runs",
      num: "03",
      label: "How it runs",
      eyebrow: "03 / How it runs",
      title: "The model reads the letters; code keeps the calendar",
      blocks: [
        {
          type: "p",
          text: "The model finds and structures what each document says. Code resolves which terms apply to whom and when, and checks delivery. Counsel, compliance and each owner sign the parts that carry legal or investor consequences.",
        },
        {
          type: "stepTable",
          plain: true,
          head: ["Step", "The model reads or drafts", "Code computes or decides", "A person signs"],
          rows: [
            {
              step: "Read the documents",
              cells: [
                "Splits the LPA, side letters and amendments into provisions, keeping the exact source span",
                "Hashes each document version; checks each span matches the source character for character",
                null,
              ],
            },
            {
              step: "Build obligations",
              cells: [
                "Classifies each provision; extracts trigger, deadline, recipient and format; flags near-duplicates",
                "Validates fields against the schema, the investor register and the Business Day calendar",
                "Counsel or compliance confirms each new or changed obligation",
              ],
            },
            {
              step: "Resolve effective terms",
              cells: [
                "Drafts a plain-English summary for the reviewer",
                "Applies LPA, then side letter, then MFN election, then amendment, in date order",
                "Counsel confirms where terms conflict",
              ],
            },
            {
              step: "Run the MFN round",
              cells: [
                "Drafts compendium entries and flags packaged provisions",
                "Tests each election: originating commitment against the electing LP's, the carve-out table, package links",
                "Counsel decides eligibility and carve-outs; the GP acknowledges each election in writing",
              ],
            },
            {
              step: "Schedule",
              cells: [
                null,
                "Computes due dates and event triggers; feeds excuse and fee terms to the capital call engine and reporting duties to the reporting calendar",
                "Owner assigned; the CCO confirms the register is complete",
              ],
            },
            {
              step: "Prove delivery",
              cells: [
                "Drafts the reminder or escalation note",
                "Matches delivery logs to an approved contact before the deadline; marks delivered or overdue",
                "Owner certifies each completion",
              ],
            },
          ],
        },
        { type: "figure", id: "mfn" },
        {
          type: "callout",
          quiet: true,
          label: "Never automated",
          text: "The register records MFN eligibility; counsel decides it. Nothing enters the register until counsel or compliance confirms it. The system sends nothing to an LP, cannot change an approved contact or wire details (a named approver does, after a call-back), and never marks an obligation complete without a delivery record.",
        },
      ],
    },
    {
      id: "evidence",
      num: "04",
      label: "The evidence",
      eyebrow: "04 / The evidence",
      title: "Proof of delivery, obligation by obligation",
      blocks: [
        {
          type: "p",
          text: "When an LP, an auditor or an examiner asks whether you did what the side letter says, the answer is a record, not a recollection. Each obligation links back to its clause and forward to the delivery that discharged it.",
        },
        { type: "figure", id: "evidenceLine" },
        { type: "h3", text: "Kept for every run" },
        {
          type: "kept",
          items: [
            "Source document version and hash",
            "Page, section and clause span for each obligation",
            "Extraction model version, prompt version and the reviewer who confirmed it",
            "Owner and backup",
            "Each delivery: artefact, recipient, channel, timestamp, receipt",
            "MFN election forms, counsel's determination and the GP's acknowledgement",
            "Register change log: who changed what, and when",
          ],
        },
        {
          type: "midCta",
          title: "One fund, your side letters, thirty minutes",
          text: "We will map where each obligation lives today and tell you whether a register is worth building.",
        },
      ],
    },
    {
      id: "built",
      num: "05",
      label: "How it is built",
      eyebrow: "05 / How it is built",
      title: "A workflow with review gates, not an agent",
      technical: true,
      blocks: [
        {
          type: "p",
          text: "Side-letter work is well defined and must be predictable, so we build a fixed workflow: an extraction chain, deterministic engines and review gates. The model proposes register entries. It never writes to the register, sends to an investor or decides eligibility.",
        },
        { type: "figure", id: "blueprint" },
        { type: "h3", id: "built-harness", text: "Harness" },
        {
          type: "bullets",
          items: [
            {
              lead: "Pattern:",
              text: "an extraction chain plus classification; register writes are proposals. No agent loop anywhere in the playbook.",
            },
            {
              lead: "Why a workflow:",
              text: "fixed code paths suit well-defined tasks that need consistency; free-roaming agents add cost and compounding errors.",
            },
            {
              lead: "Deterministic engines:",
              text: "an obligation scheduler (dates, recurrences, Business Days), MFN tier and carve-out logic, an effective-terms resolver, and a delivery-proof matcher. All unit-tested code.",
            },
            {
              lead: "Typed hand-off:",
              text: "each extraction reaches code as a schema-checked record with its source span, then code checks the values.",
            },
            { lead: "Pinned models:", text: "fixed model versions, migrated only after the full evaluation suite passes." },
          ],
        },
        { type: "figure", id: "anatomy" },
        { type: "h3", id: "built-data", text: "Data and integrations" },
        {
          type: "bullets",
          items: [
            "LPA and amendments: executed PDF (scans common), DOCX drafts.",
            "Side letters: PDF per LP, including later letters; each governs over the LPA for its signatory.",
            "MFN compendium and election forms: DOCX or PDF from counsel; signed forms.",
            "Investor register: Schedule 1, or a CSV/XLSX export from the administrator or CRM (legal name, affiliates, commitment, closing date).",
            "Delivery evidence: investor-portal posting logs, email send and receipt logs, e-signature audit trails. Under the ILPA Model LPA an email notice is deemed given one Business Day after sending, absent a failure notice.",
            "Downstream: capital call engine (excuse rights, fee discounts), reporting calendar, IR CRM, compliance calendar.",
            "Volume: one vendor reports a median of 20 obligations per side letter in 2024 (vendor data).",
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
              hard: 'Side-letter clauses lean on LPA definitions ("Portfolio Investment", "Business Day"). Models recall rules poorly: GPT-4 scored 59.2 on legal rule recall against 89.9 on conclusions from rules it was given (LegalBench, 2023).',
              we: "Pass the governing LPA definitions in with every clause, and never rely on the model's memory.",
            },
            {
              hard: "A side letter overrides the LPA for one investor, and elections and amendments change it again.",
              we: "A deterministic resolver applies LPA, side letter, election and amendment in date order, and shows its trace.",
            },
            {
              hard: 'Exceptions ("except", "other than") and one-word qualifiers ("shall" against "reasonable efforts") change the obligation. ContractNLI (2021) found negation by exception a main source of error.',
              we: "Each obligation test has three outcomes (applies, carved out, silent) with its evidence span, and near-duplicates go to a person rather than being merged silently.",
            },
            {
              hard: "A missed obligation costs far more than a false alarm.",
              we: "We tune for recall and report misses by class. Clause-finding research reports precision at a fixed high recall for this reason (CUAD, 2021).",
            },
            {
              hard: "Relevant text in the middle of a long document is easier to miss. GPT-3.5-Turbo's accuracy fell from 75.8% to 53.8% when the answer moved from first to middle of 20 documents (Lost in the Middle, 2023).",
              we: "Retrieval works clause by clause within one fund's documents, and returns citable spans.",
            },
          ],
        },
        { type: "h3", id: "built-evals", text: "How we know it works" },
        {
          type: "bullets",
          items: [
            {
              lead: "Obligation recall",
              text: "against a register built by your counsel, with the miss rate reported separately for economic, excuse, reporting and consent obligations.",
            },
            [
              { lead: "Field accuracy:", text: "exact match on trigger, deadline, recipient and format." },
              { lead: "Span fidelity:", text: "extracted text matches the source character for character." },
            ],
            [
              {
                lead: "MFN engine:",
                text: "full agreement with counsel's eligibility decisions on golden cases: equal tier, larger originating LP, each carve-out category, packaged provisions, affiliate aggregation.",
              },
              { lead: "Evidence coverage:", text: "every completed recurring obligation carries a delivery record." },
            ],
            {
              lead: "Golden set:",
              text: "an LPA, 6–10 side letters (a sovereign, a US public pension, an insurer, an ERISA plan, an endowment), a compendium, election forms, one amendment and one transfer. Two labellers; we aim for kappa of 0.80 or more before the set is used.",
            },
            {
              lead: "Release gate and shadow run:",
              text: "each fortnightly release must pass the regression suite. Before go-live the harness runs alongside your current matrix for a full reporting cycle; your matrix stays authoritative and every disagreement is logged. There is no industry benchmark for these metrics, so thresholds are set with your general counsel.",
            },
          ],
        },
        { type: "figure", id: "routing" },
        { type: "h3", id: "built-controls", text: "Controls and security" },
        {
          type: "bullets",
          items: [
            {
              lead: "Side letters are untrusted input.",
              text: "The component that reads them has no write tools and no network access; its only output is a typed record. Text in a document cannot choose an action.",
            },
            {
              lead: "Three tool tiers:",
              text: "read (fetch a document), propose (a register change), execute. Execute-tier actions are not exposed to the model; they run from the approval screen under the approver's identity.",
            },
            {
              lead: "Named approvals:",
              text: "counsel or compliance confirms every new or changed obligation; changes to approved contacts or wire details need a named approver and a call-back.",
            },
            {
              lead: "Confidentiality:",
              text: "the register keeps investor identities under access control; compendium exports are anonymised.",
            },
            {
              lead: "Records:",
              text: "each run stores inputs, prompt version, model version, output and reviewer decision, so a result can be reconstructed without re-running the model.",
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
      title: "What the rules require, and what they no longer do",
      blocks: [
        {
          // in the prototype's order, which is not strictly by date
          type: "rules",
          status: "Status as of 28 September 2026",
          tight: true,
          items: [
            {
              date: "2024-06-05",
              title: "SEC Preferential Treatment Rule vacated (Fifth Circuit)",
              text: "No SEC side-letter disclosure rule applies. Your LPA, side letters and anti-fraud duties still do.",
            },
            {
              date: "2025-11",
              title: "SEC FY2026 examination priorities",
              text: "Examiners review differential treatment of investors, including side letters, at advisers new to private funds.",
            },
            {
              date: "2026-09-28",
              title: "Advisers Act Rule 206(4)-8, in force",
              text: "What investors were told must match what was done; basis of preferential-treatment enforcement.",
            },
            {
              date: "2026-09-28",
              title: "AIFMD Art. 23(1)(j) and FUND 3.2.2R(10)–(11), in force",
              text: "EU and UK managers describe preferential treatment before investment; the register is an input.",
            },
            {
              date: "2026-04-16",
              title: "AIFMD II transposition deadline",
              text: "Adds fee, liquidity-tool and loan-origination disclosures. Check your member state's implementing law.",
            },
            {
              date: "2026-09-03",
              title: "SEC proposes rescinding pay-to-play Rule 206(4)-5 (comments due 9 Nov 2026)",
              text: "Pay-to-play representations in side letters may need review.",
            },
          ],
        },
      ],
    },
    {
      id: "terms",
      label: "Terms",
      title: "Terms used on this page",
      blocks: [
        {
          type: "terms",
          items: [
            {
              term: "Side letter",
              def: "An agreement with one LP that supplements, clarifies or changes how the fund documents apply to that LP.",
            },
            {
              term: "MFN (most favoured nation)",
              def: 'An LP\'s right to elect terms granted to other LPs in their side letters. US spelling: "most favored nation".',
            },
            {
              term: "MFN compendium",
              def: 'A list of every side-letter provision, each shown once, circulated for elections. Also "side-letter summary" or "disclosure package".',
            },
            {
              term: "MFN election and election window",
              def: "An LP's written choice of provisions, typically made within 30 days of circulation.",
            },
            {
              term: "Tiering by commitment size",
              def: "An LP may elect only provisions granted to LPs with an equal or smaller commitment.",
            },
            {
              term: "Carve-out (non-electable provision)",
              def: "A term excluded from MFN, such as an LPAC seat, excuse rights or investor-specific regulatory terms.",
            },
            {
              term: "Package concept",
              def: "Drafting that ties a better term to a less favourable one, so both must be elected together.",
            },
            {
              term: "Excuse right",
              def: "An LP's right not to fund a particular investment on legal, regulatory, tax or policy grounds. The excused LP still pays fees and expenses.",
            },
            {
              term: "Obligation matrix (side-letter register)",
              def: "The operating table of obligations, each with owner, trigger, deadline, delivery method and evidence.",
            },
            { term: "Inadvertent side letter", def: "An obligation created informally, by email or verbal agreement." },
            {
              term: "Preferential treatment",
              def: "Terms better than other investors receive. EU and UK: disclosure required. US: the SEC rule was vacated in 2024.",
            },
            {
              term: "Capital call / drawdown notice",
              def: 'The GP\'s demand for LP funding. "Capital call" is US usage; UK and EU documents and the ILPA Model LPA say "drawdown notice".',
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
            { lead: "MFN elections tracked per investor, with tier and carve-out checks." },
            {
              lead: "Rules strip checked as of 28 September 2026.",
              text: "Wording that relied on the vacated SEC Preferential Treatment Rule removed.",
            },
            { lead: "Pay-to-play note added", text: "after the SEC's 3 September 2026 proposal to rescind Rule 206(4)-5." },
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
              q: "Does the register decide whether an LP can elect a term?",
              a: "No. Counsel decides. The register shows the tier test (originating commitment against the electing LP's) and the carve-out that applies, so counsel sees why a cell reads eligible or not. It then records counsel's decision, the signed election form and the GP's written acknowledgement.",
            },
            {
              q: "Does this make us compliant with SEC side-letter rules?",
              a: "The SEC's Preferential Treatment Rule was vacated in June 2024, and we found no SEC rule requiring a side-letter register. What remains is the LPA and side letters themselves, the anti-fraud rule 206(4)-8, examiner attention to side letters and books-and-records duties. For EU and UK managers, the register is an input to the Art. 23 / FUND 3.2.2R disclosure; the disclosure stays yours.",
            },
            {
              q: "How does it connect to capital calls and reporting?",
              a: [
                "Excuse rights and fee discounts feed the capital call calculation; reporting duties feed the reporting calendar. In our sample fund, Lanvik's excuse is applied to Call 07, and Northfield's 15 bps discount starts with the Q1 2027 fee, so Call 07 charges the full Q4 fee. See ",
                { label: "Capital Call Flow", href: `${routes.playbooks}/capital-call-flow` },
                ".",
              ],
            },
            {
              q: "What happens when the model misreads a clause?",
              a: "It cannot change the register on its own. Every proposed obligation shows its source span, and counsel or compliance confirms it before it is scheduled. We measure misses against a register your counsel built, by obligation class, and every reviewer edit goes back into the regression suite.",
            },
            {
              q: "Where does the model run, and who sees our side letters?",
              a: "Side letters are read by a component with no write tools and no network access. Investor identities stay under access control, and each run's record is retained under your records policy. Hosting (your cloud tenancy or ours) and the named model providers, which EU clients need for their DORA register, are confirmed per engagement.",
            },
            {
              q: "What does an engagement look like?",
              a: "Two weeks to assess: we map where each obligation lives today and build a golden set with your counsel. Then six to twelve weeks of fortnightly releases, ending in a shadow run beside your current matrix. After that you run it, and hold the evaluation suite.",
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
        slug: "investor-reporting",
        blurb:
          "Letters, capital account statements and DDQ answers drafted from your books, with every figure traced to source before release.",
      },
      {
        slug: "capital-call-flow",
        blurb: "Calls computed from the LPA and side letters, sent per investor, and matched to the wires that arrive.",
      },
    ],
  },
  closing: {
    title: "Know which promise is due, and prove it was kept",
    text: "Thirty minutes, one fund, your side letters. We will map where each obligation lives today and tell you whether a register is worth building.",
  },
};
