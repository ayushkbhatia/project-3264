// Copy for the Capital Call Flow playbook page (/playbooks/capital-call-flow), set verbatim from
// the design handoff (design_handoff_capital_call_flow: the prototype, Capital Call Flow.dc.html,
// wins over copy-deck.md and its README where they differ). Do not rewrite, shorten or reorder:
// straight quotes, minus signs and arrows are deliberate. The figures' text lives with the
// figures (src/components/playbooks/capital-call-flow/); every name and number there is
// fictional, and the numbers reconcile to the cent.
//
// Content rules from the handoff: the model never computes an amount, releases a notice or
// changes bank details; the page never claims to stop wire fraud; US documents say capital
// call, UK and EU documents (and the ILPA Model LPA) say drawdown notice; the five-year records
// statement keeps "subject to your counsel"; no "AI-powered", "real-time", "autonomous" or
// "100% accurate". The rules rows, the TZP order and the IC3 figures are as of 28 September
// 2026: re-check them before a later review date goes on the page.

import type { PlaybookArticle } from "@/components/playbooks/article/types";
import { routes } from "./home";

export const capitalCallFlow: PlaybookArticle = {
  slug: "capital-call-flow",
  meta: {
    title: "Capital Call Flow — 3264.ai",
    description:
      "Capital calls computed from your LPA and side letters, released by a named approver, and matched to the wires that arrive, each figure traced to source.",
  },
  reviewed: { iso: "2026-09-28", label: "Reviewed 28 September 2026" },
  hero: {
    category: { label: "Private Credit", href: routes.privateCredit },
    title: "Capital Call Flow",
    oneLiner: "Calls computed from the LPA and side letters, sent per investor, and matched to the wires that arrive.",
    standfirst:
      "Each drawdown is computed from your fund's own documents: the allocation base the LPA sets for each purpose, excuse rights in the LPA and side letters, fee offsets, and equalisation for later closers. Every investor's amount traces to the clause that produced it, and the split ties out to the cent before anyone signs. A named approver releases the notices. Incoming wires are matched to investors, short payments are explained, and bank details change only after a call-back.",
    secondary: { label: "See how it is built", href: "#built" },
    figure: "callSplit",
  },
  // INTERIM: a pre-addressed email until there is a booking URL.
  cta: {
    mapping: { label: "Book a mapping session", href: "mailto:hello@3264.ai?subject=Capital%20Call%20Flow" },
    audit: { label: "Book a two-week audit", href: `${routes.aiEngineering}#engagement` },
  },
  back: { label: "All playbooks", href: routes.playbooks },
  overviewLabel: "Overview",
  sidebarCard: "Bring one past call. We will trace it.",

  sections: [
    {
      id: "today",
      num: "01",
      label: "The work today",
      eyebrow: "01 / The work today",
      title: "One call, several desks, one due date",
      blocks: [
        {
          type: "p",
          text: "A call starts with an investment closing or a fee date and ends when every investor's wire is on the books. Titles vary by firm; these are the ones the sources use. The notice period comes from your LPA, and many set at least ten business days.",
        },
        {
          type: "roles",
          items: [
            {
              role: "CFO or controller",
              text: "Sets the funding need from an investment committee approval, a management fee date or fund expenses, and decides whether to draw the subscription line first.",
            },
            {
              role: "Fund accountant at the administrator",
              text: "Splits the call by purpose: remaining commitments for a new investment, sharing percentages for a follow-on, commitments for expenses, and a per-investor fee.",
            },
            {
              role: "Controller or CFO",
              text: "Reviews the allocation schedule against Schedule 1, the side-letter register, excuse elections and fee income subject to offset.",
            },
            {
              role: "Investor services and IR",
              text: "Draft each notice: cover letter, description letter and the ILPA template, with balances before and after the call and LPA references.",
            },
            {
              role: "GP signatory",
              text: "Approves and releases notices by email or LP portal. An investor claiming excuse may still elect after the notice has gone.",
            },
            {
              role: "Treasury or fund accountant",
              text: "Reads bank reports, matches each credit to an investor, chases shortfalls, then the administrator books contributions and updates capital accounts.",
            },
          ],
        },
        {
          type: "io",
          cards: [
            {
              label: "Inputs",
              items: [
                "Limited partnership agreement and amendments",
                "Side letters (excuse, fee discount and notice-address clauses)",
                "Schedule 1 (partner commitments) and the administrator's capital activity export",
                "Excuse elections and officer certificates",
                "Fee income records (transaction, advisory and monitoring fees) for offsets",
                "Subsequent-closing data for equalisation",
                "Bank reports (BAI2 or ISO 20022 statements) and incoming payment messages",
              ],
            },
            {
              label: "Outputs",
              items: [
                "Per-investor allocation schedule",
                "Capital call notices: cover letter, description letter, ILPA Capital Call & Distribution Template",
                "Delivery record per investor (portal posting or email receipt)",
                "Funding tracker: funded, short, unmatched, late",
                "Revised notices, reminders and, where the GP decides, a Default Notice",
                "Updated capital accounts and unfunded balances for the quarterly partners' capital account statement",
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
      title: "Four places a call goes wrong",
      blocks: [
        {
          type: "breaks",
          items: [
            {
              title: "One base for every purpose",
              text: "The ILPA Model LPA splits a new investment by the remaining commitments of investors who are not excused, a follow-on by sharing percentage and expenses by commitment. Use a flat percentage for all of them, or miss an excuse, and notices have to be reissued.",
            },
            {
              title: "Fee offsets applied wrongly",
              text: "In August 2025 the SEC settled with TZP Management Associates. The firm left interest on deferred fees out of its offsets and reduced multi-fund allocations twice, charging $502,041 in excess management fees across nine funds between 2018 and 2023.",
            },
            {
              title: "Wire instructions changed by email",
              text: "Business email compromise losses reported to the FBI's IC3 reached about $3.05bn in 2025, from 24,768 complaints. In one documented private equity case, the fraudster wrote from a genuinely compromised investor mailbox, not a spoofed one.",
            },
            {
              title: "Cash that cannot be placed",
              text: "Payer names rarely match an investor's legal name, legacy MT103 remittance text holds four lines of 35 characters, and banks on the route can deduct charges. Money sits unapplied, or an investor is chased for a shortfall a bank created.",
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
      title: "The model reads and drafts. Code computes. People sign.",
      blocks: [
        {
          type: "p",
          text: "The money path is a fixed workflow. The model reads your documents and drafts letters. Every amount comes from a calculation engine, and nothing leaves the fund or changes a bank record without a named person.",
        },
        {
          type: "stepTable",
          head: ["Step", "The model reads or drafts", "Code computes or decides", "A person signs"],
          empty: "Nothing",
          rows: [
            {
              step: "Fund terms, once and at each amendment",
              cells: [
                "Reads the LPA and side letters into typed parameters, each with its clause",
                "Checks types and ranges; versions the parameter set",
                "Fund controller approves the parameters",
              ],
            },
            {
              step: "Compute the call",
              cells: [
                null,
                "Splits by purpose, removes excused investors, applies fee offsets and equalisation, rounds to a declared rule, sets the due date on a named holiday calendar",
                "Controller or CFO signs the allocation trace",
              ],
            },
            {
              step: "Draft notices",
              cells: [
                "Drafts the cover and description letters from computed figures",
                "Fills every amount and the bank details from the locked master record; checks each figure in the letter against the engine",
                "GP signatory releases, after maker and checker",
              ],
            },
            {
              step: "Excuse after the notice",
              cells: [
                "Reads the investor's election into a typed record with its source",
                "Recomputes, applies the reallocation cap, builds revised notices",
                "GP approves the excuse and the revised notices",
              ],
            },
            {
              step: "Match the cash",
              cells: [
                "Proposes an investor for payer text that names no one",
                "Matches on amount and reference; reads the charges field before calling anything short",
                "Fund accountant confirms each proposed match",
              ],
            },
            {
              step: "Late or short funding",
              cells: [
                "Drafts the reminder",
                "Tracks the due date, cure period and default interest the LPA sets",
                "GP decides on any Default Notice",
              ],
            },
            {
              step: "A request to change bank details",
              cells: [
                "Recognises the request and flags it",
                "Opens a blocked case; the master record cannot be changed from here",
                "Call-back to a known number, then a second approver",
              ],
            },
          ],
        },
        {
          type: "callout",
          label: "Never automated",
          text: "No model computes an amount, releases a notice or changes bank details. Approving the call, releasing notices, resolving an ambiguous clause, confirming an uncertain cash match, and deciding that an investor is in default all stay with named people at your firm. Bank details change only after a call-back and a second approval.",
        },
        { type: "figure", id: "wireMatch" },
      ],
    },
    {
      id: "evidence",
      num: "04",
      label: "The evidence",
      eyebrow: "04 / The evidence",
      title: "Each line traced from clause to wire",
      blocks: [
        {
          type: "p",
          text: "For every call we keep the inputs, the allocation trace and the decisions, so any figure on any notice can be rebuilt without re-running a model. Registered advisers must keep written communications about receipts and disbursements of funds for five years; we treat notices and wire correspondence as within that scope, subject to your counsel.",
        },
        { type: "figure", id: "evidenceLine" },
        { type: "h3", text: "Kept for every run" },
        {
          type: "kept",
          items: [
            "Input versions: LPA, amendments, side letters, Schedule 1 snapshot, rule-set version",
            "The clause span behind each parameter",
            "The allocation trace: base, share and rounding cents per investor",
            "Approver identities and timestamps, maker and checker",
            "Rendered notices with their hashes",
            "Delivery proof: send time, portal posting, read or failure receipts",
            "Bank records matched (BAI2 16 and 88 lines, payment message references)",
            "Each match decision and who confirmed it",
          ],
        },
        {
          type: "midCta",
          title: "Thirty minutes with your controller",
          text: "We take one call from LPA clause to matched wire, and tell you what it would take to build.",
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
          text: "Capital calls move money, so the core is deterministic code with unit tests, not a model. The model does the reading and drafting that code cannot, and hands over typed records that code checks. There is no agent in the send path: sending, releasing and paying run only from a person's approval.",
        },
        { type: "figure", id: "anatomy" },
        { type: "h3", id: "built-harness", text: "Harness" },
        {
          type: "bullets",
          items: [
            {
              lead: "Workflow, not agent.",
              text: "Predefined code paths suit well-defined tasks that need to be predictable; a call is one. The model never chooses the next step.",
            },
            {
              lead: "Deterministic allocation engine.",
              text: "Purpose-based allocation, excuse exclusion and capped reallocation, fee and offset arithmetic, equalisation, default interest, rounding and due dates, each rule linked to the clause it implements.",
            },
            {
              lead: "Drafting chain.",
              text: "The model writes cover and description letters around figures the engine has already fixed; a check confirms every number in the letter matches the engine.",
            },
            {
              lead: "Human gates.",
              text: "Parameters, the call pack, release and any bank-detail change each have a named approver. The harness counts as a maker, so a person is always the checker.",
            },
          ],
        },
        { type: "h3", id: "built-data", text: "Data and integrations" },
        {
          type: "bullets",
          items: [
            "LPAs and amendments as executed PDFs, often scanned, plus DOCX drafts; side letters as per-investor PDFs.",
            "Schedule 1 and the administrator's investor register as CSV or XLSX exports.",
            "Capital activity from the administrator's partnership accounting system; the ILPA Capital Call & Distribution Template in Excel, which ILPA recommends over PDF.",
            "Bank reporting as BAI2 files (16 transaction and 88 continuation records) or ISO 20022 statements, field mapping confirmed per bank.",
            "Incoming payments: cross-border Swift payments have used ISO 20022 (pacs.008) since 22 November 2025; Fedwire completed its ISO 20022 migration in July 2025. Payer text is still free text.",
            "Notice delivery by LP portal or email, with delivery receipts; e-signed records kept accurate, accessible and reproducible.",
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
              hard: 'One notice can mix four allocation bases, and "remaining commitment" depends on contributions, recallable returns and equalisation.',
              we: "Tag each line with its purpose, apply that purpose's base rule, and carry the definition chain as versioned parameters with clause references.",
            },
            {
              hard: "Arithmetic written out by a language model is unreliable. Having the model write a program instead improved accuracy by about 12% on average across eight maths and finance datasets (Program of Thoughts, Codex, 2022).",
              we: "Keep every amount in decimal code. The model never produces a figure that reaches a notice.",
            },
            {
              hard: "Side letters override the LPA for one investor, and an excuse can arrive up to five business days after the notice under the Model LPA.",
              we: "Hold side-letter terms per investor, and run a revised-notice path that recomputes within the reallocation cap.",
            },
            {
              hard: "No public convention exists for rounding a pro-rata split to the cent.",
              we: "Read the rule from your LPA or administrator policy, allocate the residual cents by a stated method, and show each investor's rounding cents.",
            },
            {
              hard: "Payer text is short and rarely names the investor, and charges can be deducted before the funds arrive.",
              we: "Match on amount and reference first; the model only proposes candidates for free text, and a person confirms them.",
            },
          ],
        },
        { type: "h3", id: "built-evals", text: "How we know it works" },
        {
          type: "bullets",
          items: [
            {
              lead: "Allocation, penny-exact.",
              text: "On the golden set, the investor lines must sum to the call with 0.00 variance, each line must equal an independent recompute, no investor is asked for more than its remaining commitment, and reallocation stays within the cap. There is no tolerance band for money lines.",
            },
            {
              lead: "Golden set.",
              text: "At least one case each of: pure investment, mixed purpose, excuse before the notice, excuse after it, subsequent-close equalisation, recyclable distribution, mid-quarter transfer, multi-currency, fee offset with carry-forward, default with reallocation, and a holiday-shifted due date.",
            },
            {
              lead: "Term extraction.",
              text: "Recall of excuse and economic clauses against a register built by your lawyers, with the threshold agreed with you.",
            },
            {
              lead: "Cash matching.",
              text: "Wrong-investor automatic matches must be zero; we also report the match rate by due date and time to resolve exceptions.",
            },
            {
              lead: "Release gate and shadow run.",
              text: "Each fortnightly release passes the regression suite first. Before go-live the workflow runs alongside your current process, which stays authoritative, and every disagreement is logged with its cause.",
            },
          ],
        },
        { type: "figure", id: "engagement" },
        { type: "h3", id: "built-controls", text: "Controls and security" },
        {
          type: "bullets",
          items: [
            {
              lead: "Three tool tiers.",
              text: "Read, propose and execute. Execute tools such as releasing a notice are not exposed to the model; they run from the approval screen under the approver's identity.",
            },
            {
              lead: "Bank details: call-back only.",
              text: "A document or email can never change standing instructions. A request opens a blocked case, verified by call-back to a number already on file and approved by a second person.",
            },
            {
              lead: "Untrusted text stays data.",
              text: "Investor emails, side letters and payer text are read by a component with no write tools and no network access, and only typed fields leave it. No prompt-injection defence is fool-proof, so actions never depend on document text.",
            },
            {
              lead: "Records.",
              text: "Each run stores inputs, prompt version, model version, outputs and reviewer decisions.",
            },
          ],
        },
        { type: "figure", id: "permissions" },
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
      title: "The rules around a call, as of 28 September 2026",
      blocks: [
        {
          type: "rules",
          items: [
            {
              date: "2024-06-05",
              title: "SEC Private Fund Adviser Rules vacated",
              text: "No SEC-mandated quarterly fee statement; your LPA and ILPA-style reporting set what investors receive.",
            },
            {
              date: "2025-07-15",
              title: "Fedwire Funds Service completes ISO 20022 migration",
              text: "US wires carry structured data; investors' payer text is still free text.",
            },
            {
              date: "2025-08-15",
              title: "SEC order against TZP Management Associates",
              text: "Fee offsets must follow the LPA as written; $502,041 in excess fees disgorged.",
            },
            {
              date: "2025-09-11",
              title: "ILPA Capital Call & Distribution Template v2.0",
              text: "Voluntary guidance. First delivery expected Q1 2027; Excel or digital, not PDF.",
            },
            {
              date: "2025-11-22",
              title: "Swift ends MT/ISO 20022 coexistence for cross-border payments",
              text: "Incoming payments arrive as pacs.008; MT103 senders are converted by Swift.",
            },
            {
              date: "2026-04-16",
              title: "AIFMD II transposition deadline (EU)",
              text: "New disclosure of fees, charges and expenses allocated to the fund.",
            },
          ],
          note: "Notice periods, excuse rights and default remedies are contractual. They come from your LPA and side letters, not from a regulation.",
          greedyNote: true,
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
              term: "Capital call / drawdown notice",
              def: "Notice requiring investors to contribute part of their commitment. US: capital call. UK/EU and the ILPA Model LPA: drawdown notice.",
            },
            { term: "Commitment", def: "The amount an investor has contractually agreed to fund over the fund's life." },
            {
              term: "Remaining commitment / unfunded commitment",
              def: 'Commitment not yet called, adjusted for recallable returns. "Remaining Commitment" is the Model LPA term; "Unfunded Commitment" is the ILPA template term.',
            },
            {
              term: "Due date",
              def: "The date the investor's wire must arrive; set by the LPA, often at least ten business days after the notice.",
            },
            {
              term: "Business day",
              def: "A day banks are open in the jurisdictions the LPA names. It drives the due-date arithmetic.",
            },
            {
              term: "Sharing percentage",
              def: "An investor's share of the capital used for a specific investment; the base for follow-ons.",
            },
            {
              term: "Excuse right / excused investor",
              def: "A right, in the LPA or a side letter, not to fund a particular investment. Excused investors still pay fees and expenses.",
            },
            {
              term: "Reallocation cap",
              def: "The limit on extra amounts other investors can be asked for when one is excused or defaults; a bracketed [50]% in the Model LPA.",
            },
            {
              term: "Management fee offset",
              def: "Reduction of the management fee by transaction, advisory or monitoring fees the manager receives from portfolio companies.",
            },
            {
              term: "Equalisation payment (US: equalization)",
              def: "Catch-up contribution by an investor admitted at a later closing, as if it had joined at the first.",
            },
            {
              term: "Default Notice / Defaulting Partner",
              def: "Formal notice of a missed contribution; the investor is in default only after the LPA's cure period.",
            },
            {
              term: "Call-back verification",
              def: "Confirming a change to wire instructions by phone, to a number already on file.",
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
            "Excuse rights applied at calculation, and re-applied if an LP elects after the notice",
            "Research refreshed 28 September 2026: ILPA's September 2025 template and Swift's move to ISO 20022 payment messages now reflected on this page.",
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
              a: "No. It reads the administrator's exports and your fund documents. It can run as an independent recompute of the administrator's split or produce the split for the administrator to book; we agree which in the mapping session.",
            },
            {
              q: "What happens when an investor claims an excuse after the notice has gone?",
              a: "Under the ILPA Model LPA an investor has five business days after the notice to claim. The engine recomputes the other investors' shares within the reallocation cap your LPA sets, the Model LPA's bracketed [50]%, and drafts revised notices. The GP approves the excuse and the revised notices before anything is sent.",
            },
            {
              q: "Does it stop wire fraud?",
              a: "No control can promise that. What it adds: bank details on notices come only from a locked master record, no email or document can change them, and any change needs a call-back to a known number and a second approver. The model has no tool that can change bank details.",
            },
            {
              q: "Where does the model run, and what can it see?",
              a: "It sees only the documents and payer text it is asked to read, and it cannot send, pay or change records. Credentials are held outside prompts and logs, and model versions are pinned. Hosting, model providers and data retention are agreed with each client and named in writing.",
            },
            {
              q: "Do you produce the ILPA Capital Call & Distribution Template?",
              a: "Our notices are aligned with the template ILPA released in September 2025. It is voluntary guidance, with first deliveries expected for Q1 2027, and ILPA recommends Excel or a digital format over PDF.",
            },
            {
              q: "How do you handle rounding to the cent?",
              a: "We use the rule your LPA or administrator's policy states. If none is written, we agree one with your controller before go-live. Each investor line is floored to the cent and the residual cents are placed by that rule, so the lines always sum exactly to the call, and each investor's rounding cents are shown.",
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
        slug: "side-letter-register",
        blurb: "Every promise in your LPAs and side letters, tracked to its clause, owner and proof of delivery.",
      },
      {
        slug: "covenant-watch",
        blurb:
          "Borrower certificates recomputed from the credit agreement's own definitions, with headroom, add-back caps and cure rights tracked every test date.",
      },
      {
        slug: "nav-pack-review",
        blurb: "Administrator NAV packs tied out line by line to your books, with every break explained before the CFO signs.",
      },
    ],
  },
  closing: {
    title: "Bring one past call. We will trace it.",
    text: "Thirty minutes with your controller: we take one call from LPA clause to matched wire, and tell you what it would take to build.",
  },
};
