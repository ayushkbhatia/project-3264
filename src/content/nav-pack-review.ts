// Copy for the NAV Pack Review playbook page (/playbooks/nav-pack-review), set verbatim from the
// design handoff (design_handoff_nav_pack_review: the prototype, NAV Pack Review.dc.html, wins
// over copy-deck.md and its README where they differ). Do not rewrite, shorten or reorder:
// straight quotes, minus signs and arrows are deliberate. The figures' text lives with the
// figures (src/components/playbooks/nav-pack-review/); every name and number there is
// fictional, the tolerances are illustrative, and the F5 scorecard is not measured performance.
//
// Content rules from the handoff: the review is an additional control on top of the
// administrator's own; the model never sets a mark, clears a break or releases a NAV; keep the
// "$0.01 per share or 0.5% of NAV" qualifier (a US registered-fund reference, not a
// private-fund rule); no "AI-powered", "real-time", "autonomous" or "100% accurate".

import type { PlaybookArticle } from "@/components/playbooks/article/types";
import { routes } from "./home";

export const navPackReview: PlaybookArticle = {
  slug: "nav-pack-review",
  meta: {
    title: "NAV Pack Review — 3264.ai",
    description:
      "Administrator NAV packs tied out line by line to your books, fees recalculated from the LPA, and every break explained before the CFO signs.",
  },
  reviewed: { iso: "2026-09-28", label: "Reviewed 28 September 2026" },
  hero: {
    // There is no Fund Management industry page yet: the handoff links the Playbooks index's row.
    category: { label: "Fund Management", href: `${routes.playbooks}#fund-management` },
    title: "NAV Pack Review",
    oneLiner: "Administrator NAV packs tied out line by line to your books, with every break explained before the CFO signs.",
    standfirst:
      "Each period your administrator sends a NAV pack. We read it into a structured ledger, tie each line to your books and the trial balance, and test prices against the tolerances in your pricing policy. Management fees, offsets and accruals are recalculated from the LPA rather than taken from the pack. Every difference is either inside tolerance or carries a written cause, its evidence and an owner. Your fund controller clears exceptions; the CFO signs a NAV whose review trail an auditor can follow.",
    secondary: { label: "See how it is built", href: "#built" },
    figure: "tieOut",
  },
  // INTERIM: a pre-addressed email until there is a booking URL.
  cta: {
    mapping: { label: "Book a mapping session", href: "mailto:hello@3264.ai?subject=NAV%20Pack%20Review" },
    audit: { label: "Book a two-week audit", href: `${routes.aiEngineering}#engagement` },
  },
  back: { label: "All playbooks", href: routes.playbooks },
  overviewLabel: "Overview",
  sidebarCard: "Start with one fund and one period.",

  sections: [
    {
      id: "today",
      num: "01",
      label: "The work today",
      eyebrow: "01 / The work today",
      title: "The administrator strikes the NAV. Your team proves it.",
      blocks: [
        {
          type: "p",
          text: "Your administrator books activity, prices positions, reconciles cash and holdings, accrues fees and calculates the NAV. Before it is released, your finance team reviews the pack against its own records. AIMA describes that review as an additional control; it does not replace the administrator's own.",
        },
        {
          type: "roles",
          items: [
            {
              role: "Administrator fund accountant",
              text: "Books trades, capital calls, distributions and investor dealing into the fund's books of record through to period-end.",
            },
            {
              role: "Pricing team and your valuation function",
              text: "Value each position from vendor files, broker quotes and, for Level 3 assets, models and memos, under a board-approved pricing policy.",
            },
            {
              role: "Administrator",
              text: "Reconciles cash and positions to custodians, banks and counterparties, accrues fees and expenses, allocates the NAV and issues the pack.",
            },
            {
              role: "Fund controller",
              text: "Ties the pack to internal records: cash, positions, prices, FX, accruals, capital activity and investor allocations. Logs every exception.",
            },
            {
              role: "Fund controller with the administrator",
              text: 'Resolves each break: the administrator rebooks, or you document acceptance. One approved final version, no competing "finals".',
            },
            {
              role: "CFO, with the valuation committee for material marks",
              text: "Agrees the NAV with the administrator and signs. The approved NAV then feeds capital account statements and quarterly reporting.",
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
                "Administrator NAV pack (PDF report and/or XLSX workbook)",
                "Trial balance or general-ledger extract",
                "Schedule of investments with valuation summary; valuation memos for Level 3 positions",
                "Custodian, prime broker and bank statements",
                "Pricing vendor files and broker quotes",
                "LPA, side letters and fee schedule",
                "Investor ledger and capital activity (call and distribution notices)",
              ],
            },
            {
              label: "Outputs",
              items: [
                "Tie-out and break log (the review workpaper)",
                "Explained or corrected breaks, each with an owner",
                "Agreed NAV and the one approved pack version",
                "CFO sign-off and archived review evidence",
                "Input to capital account statements and quarterly investor reporting",
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
      title: "Fee terms and prices are where the NAV goes wrong.",
      blocks: [
        {
          type: "breaks",
          items: [
            {
              title: "Fee basis calculated wrongly",
              text: "In June 2023 the SEC found that Insight Venture Management had calculated management fees on aggregated invested capital at portfolio-company level rather than per security, and had not disclosed a conflict in its impairment criteria for reducing the fee basis. It paid a $1.5m penalty and $864,958 in disgorgement and interest, returned to the funds.",
            },
            {
              title: "Fee offsets missed or counted twice",
              text: "In August 2025 the SEC found that TZP Management had left interest on deferred transaction fees out of its fee offsets and duplicated transaction-fee reductions. Excess fees exceeded $500,000; it paid $508,877 in disgorgement, including interest, and a $175,000 penalty.",
            },
            {
              title: "Prices that were not independent",
              text: "The SEC alleged that Infinity Q's founder manipulated valuation models and altered the inputs of a pricing service presented as independent, overvaluing assets by more than $1bn between 2017 and 2021. The fund suspended redemptions and liquidated.",
            },
            {
              title: "Breaks carried into the NAV",
              text: "AIMA's sound practice is that material differences are understood and documented before the NAV is struck. Where they are not, errors reach investors: about 129 US registered funds reported NAV restatements in the 2022 period Ignites studied, including a swap booked in the wrong currency.",
            },
          ],
        },
        {
          type: "related",
          slug: "capital-call-flow",
          label: "Related playbook · Private Credit",
          title: "Capital Call Flow",
          text: "The fee basis and offsets that break a NAV also set each capital call. Capital Call Flow computes calls from the same LPA clauses.",
          cta: "Read the playbook",
        },
      ],
    },
    {
      id: "runs",
      num: "03",
      label: "How it runs",
      eyebrow: "03 / How it runs",
      title: "Code ties out. The model explains. People sign.",
      blocks: [
        {
          type: "p",
          text: "Every figure passes through the same seven steps each period. The model reads documents and drafts explanations. Code does the arithmetic and decides pass or fail. Your team confirms anything new and signs anything final.",
        },
        {
          type: "stepTable",
          plain: true,
          head: ["Step", "The model reads or drafts", "Code computes or decides", "A person signs"],
          rows: [
            {
              step: "Ingest the pack",
              cells: [
                "Locates sections and extracts tables from PDF packs",
                "Hashes and versions the file; records page and cell for every figure; cross-foots each table",
                null,
              ],
            },
            {
              step: "Map lines to your chart of accounts",
              cells: [
                "Proposes a mapping for any newly labelled line, with a confidence score",
                "Applies confirmed mappings; rejects any numeric line left unmapped",
                "Fund controller confirms each new mapping once",
              ],
            },
            {
              step: "Tie out",
              cells: [
                null,
                "Trial balance to statement of assets and liabilities to NAV; investors sum to the fund; opening NAV equals the prior approved close",
                null,
              ],
            },
            {
              step: "Recalculate fees and accruals",
              cells: [
                "Reads fee terms from the LPA and side letters into a term sheet",
                "Recomputes the management fee (basis, rate, step-down), offsets, expense accruals and FX",
                "Fund controller approves the term sheet",
              ],
            },
            {
              step: "Test prices",
              cells: [
                null,
                "Applies your tolerances per asset class; flags stale and single-source prices",
                "Valuation committee decides any Level 3 override",
              ],
            },
            {
              step: "Explain differences",
              cells: [
                "Drafts the cause of each break, citing the evidence lines, and classes it",
                "Computes the variance decomposition; checks every figure the draft cites",
                "Fund controller accepts or rejects each explanation",
              ],
            },
            {
              step: "Release",
              cells: [null, "Holds release while any break is open and outside tolerance", "CFO signs the NAV"],
            },
          ],
        },
        { type: "figure", id: "priceTests" },
        {
          type: "callout",
          quiet: true,
          label: "What is never automated",
          text: "The model never sets a mark, clears a break or releases a NAV. Level 3 valuations stay with your valuation function: IPEV's December 2025 guidelines keep the valuer fully accountable for AI-assisted outputs. Pass or fail is a coded tolerance rule. Your governing body stays responsible for valuation, as it is today.",
        },
      ],
    },
    {
      id: "evidence",
      num: "04",
      label: "The evidence",
      eyebrow: "04 / The evidence",
      title: "Every difference carries its cause.",
      blocks: [
        {
          type: "p",
          text: "A review is only as good as what it leaves behind. For each line we keep the pack figure and where it sits, the book figure it was tied to, the tolerance applied, and who accepted the outcome. An auditor can follow any figure from the signed NAV back to the page it came from.",
        },
        { type: "figure", id: "evidenceLine" },
        { type: "h3", text: "Kept for every run" },
        {
          type: "kept",
          items: [
            "The pack file's hash and version, and any superseded versions",
            "The source page or cell of every figure",
            "Each mapping decision and who confirmed it",
            "The calculation trace: inputs, formula version and LPA clause",
            "The tolerance applied and the pricing-policy version it came from",
            "Every exception, its explanation, reviewer and timestamp",
            "For each drafted explanation: model version, prompt version and raw output",
            "Reruns and the final approval",
          ],
        },
        {
          type: "midCta",
          title: "Thirty minutes on one fund's NAV cycle",
          text: "We will tell you what a tie-out ledger would hold and what it would cost to build.",
        },
      ],
    },
    {
      id: "built",
      num: "05",
      label: "How it is built",
      eyebrow: "05 / How it is built",
      title: "A deterministic tie-out with the model at the edges.",
      technical: true,
      blocks: [
        {
          type: "p",
          text: "NAV review is a well-defined, repeating task, so we build it as a workflow rather than a free-roaming agent. Tie-outs, recalculations and tolerance tests run in code. The model does the parts code cannot: reading packs that differ by administrator, proposing mappings and drafting explanations.",
        },
        { type: "h3", id: "built-harness", text: "Harness" },
        {
          type: "bullets",
          items: [
            {
              lead: "Workflow, not agent.",
              text: "Fixed code paths suit well-defined tasks that need predictable results; agent loops are for steps that cannot be set in advance.",
            },
            {
              lead: "One bounded loop.",
              text: "When a break needs investigating, a read-only loop may query the pack, the ledger and the LPA. It can propose a cause; it cannot book, clear or release anything.",
            },
            {
              lead: "Typed hand-offs.",
              text: "The model passes a record (line, value, page, cell, proposed account, confidence, extractor version) to code, which validates it before use.",
            },
            { lead: "Code decides.", text: "Tolerances, tie-outs and the release hold are rules your team can read and test." },
          ],
        },
        { type: "figure", id: "anatomy" },
        { type: "figure", id: "lanes" },
        { type: "h3", id: "built-data", text: "Data and integrations" },
        {
          type: "bullets",
          items: [
            "Administrator NAV pack as PDF and/or XLSX, or a portal extract; layouts differ by administrator and there is no public standard.",
            "Trial balance or GL extract (XLSX or CSV) from the administrator's fund accounting system.",
            "Schedule of investments and valuation summary; valuation memos (PDF or DOCX) for Level 3 positions.",
            "Custodian, prime broker and bank position and cash files.",
            "Pricing vendor files and broker quotes, per the source hierarchy in your pricing policy.",
            "LPA, side letters and fee schedule (PDF), read once into an approved term sheet and re-read on amendment.",
            "Investor ledger and capital activity from the administrator's investor-services extract.",
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
              hard: "Packs are mostly tables, and tables are where parsers fail. In late-2024 tests the best table-structure score for PDF parsers was about 79 of 100, with GPT-4o at 72 (OmniDocBench, CVPR 2025).",
              we: "Cross-foot every parsed table and tie every subtotal. A table that does not sum is not used; it goes to a person.",
            },
            {
              hard: "Large workbooks. On synthetic private-equity portfolio spreadsheets the best model (Gemini 3.1 Pro, March 2026) answered 82.4% correctly; on the largest file, ten model configurations averaged 48.6% (FinSheet-Bench, preprint).",
              we: "Read spreadsheets cell by cell into a ledger. No total is ever read off a sheet by the model.",
            },
            {
              hard: "Signs and subtotals change between packs. Even ILPA's own template flips signs by section and warns against adding across sections.",
              we: "Normalise every line into one sign convention, then test that each roll-forward holds at fund and investor level.",
            },
            {
              hard: "The fee basis, step-downs and offsets live in the LPA, not in the pack.",
              we: "Extract fee terms into a term sheet your controller approves, then recompute fees in code. Programs beat in-text arithmetic by about 12% on average across eight maths and finance datasets (Program of Thoughts, Codex, 2022).",
            },
            {
              hard: "A Level 3 value is a documented judgement, and IPEV 2025 says the price of a recent investment is not a default.",
              we: "Test inputs and moves against your tolerances and route exceptions to the valuation function, which sets the mark.",
            },
          ],
        },
        { type: "h3", id: "built-evals", text: "How we know it works" },
        {
          type: "bullets",
          items: [
            {
              lead: "Metrics.",
              text: "Tie-out completeness (every numeric line tied, within tolerance or logged as a break); line-extraction exact match; mapping precision and recall by administrator layout; explanation faithfulness, graded by a reviewer.",
            },
            {
              lead: "Primary safety metric.",
              text: "False clears: breaks the system cleared that a reviewer later reopens. The target on seeded errors is zero.",
            },
            {
              lead: "Golden set.",
              text: "Several quarters of fictional or anonymised packs in at least three administrator layouts, with known breaks and approved explanations, plus a restated period and a multi-class FX case. We seed errors modelled on documented failures: fee basis, missed offsets, wrong currency, stale prices, missing accruals.",
            },
            {
              lead: "Release gate.",
              text: "Each fortnightly release passes the full regression suite before it ships; a regression blocks it.",
            },
            {
              lead: "Shadow run.",
              text: "The harness runs alongside your current review for at least one full month-end or quarter-end, with your process authoritative, before anyone relies on it.",
            },
            {
              lead: "Reviewer load.",
              text: "At quarter-end we cap review queues and seed known exceptions, because over-reliance on automated output is well documented.",
            },
          ],
        },
        { type: "figure", id: "engagement" },
        { type: "figure", id: "routing" },
        { type: "h3", id: "built-controls", text: "Controls and security" },
        {
          type: "bullets",
          items: [
            {
              lead: "Packs are untrusted input.",
              text: "Text in a document can act as an instruction to a model, and no fool-proof prevention is known. The reader that handles the pack has no write tools and no network access; it emits typed fields only.",
            },
            {
              lead: "Least privilege.",
              text: "The model can read and propose. It cannot post to the ledger, clear a break or release a NAV; those actions run from the review screen under a named person's identity.",
            },
            {
              lead: "Maker and checker.",
              text: "The system counts as a maker. The person who accepts an explanation is not the person who signs the NAV.",
            },
            {
              lead: "Change control.",
              text: "The tolerance policy, mappings, prompts and model versions are versioned, and each change is approved and logged. Where you rely on the administrator's own controls, its SOC 1 report is referenced in the file.",
            },
            {
              lead: "Records, not re-runs.",
              text: "Model output can vary between runs, so we store every input, prompt version, model version and output rather than re-running the model later.",
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
      title: "The rules this review answers to.",
      blocks: [
        {
          type: "rules",
          tight: true,
          status: "Status as of 28 September 2026.",
          items: [
            {
              date: "2021-03-08",
              title: "SEC Rule 2a-5 effective (US registered funds only)",
              text: "$0.01 per share or 0.5% of NAV is a registered-fund reference for material NAV errors, not a private-fund rule.",
            },
            {
              date: "2024-06-05",
              title: "SEC private fund adviser rules vacated",
              text: "The quarterly statement and private fund audit rules no longer apply; the LPA and ILPA practice govern reporting.",
            },
            {
              date: "2025-11-17",
              title: "SEC exam priorities for FY2026",
              text: "Valuation and fees are core exam areas; examiners also review how advisers supervise AI in back-office work.",
            },
            {
              date: "2026-04-01",
              title: "IPEV Valuation Guidelines, December 2025 edition, apply",
              text: "The valuer stays fully accountable for AI-assisted outputs; the price of a recent investment is not a default.",
            },
            {
              date: "2026-09-10",
              title: "SEC proposal IA-6994 makes conforming changes to Rule 204-2",
              text: "Records are still kept five years, the first two in an office. Broader amendments remain on the agenda.",
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
              term: "NAV pack",
              def: 'The administrator\'s periodic package supporting the NAV: roll-forward, statement of assets and liabilities, investments, fees, capital activity, allocations. Common in UK, EU and offshore usage; US teams also say "NAV package".',
            },
            {
              term: "Tie-out",
              def: "Proving a figure equals its source or sum, such as fund NAV to the statement of assets and liabilities.",
            },
            { term: "Break", def: "A difference between two records of the same item that must be explained." },
            {
              term: "Tolerance",
              def: "The variance allowed before a difference is flagged; for prices, set by asset class and instrument.",
            },
            {
              term: "NAV roll-forward",
              def: "The walk from opening to closing NAV through contributions, distributions, fees, expenses, income and gains.",
            },
            {
              term: "Fee basis",
              def: "The capital the management fee rate applies to, such as commitments during the investment period and invested capital after it.",
            },
            {
              term: "Fee offset",
              def: "A reduction in management fees for portfolio-company fees the adviser receives, as the LPA sets out.",
            },
            { term: "Price challenge", def: "A formal query to a pricing vendor disputing its price, with evidence." },
            {
              term: "Stale price",
              def: "A price that has not changed or traded; there is no common definition, so your pricing policy sets one.",
            },
            {
              term: "Level 3",
              def: "Fair value measured with unobservable inputs (ASC 820 in the US; IFRS 13 uses the same hierarchy).",
            },
            {
              term: "Shadow accounting / NAV oversight",
              def: "Shadow accounting recalculates the whole NAV independently; oversight reviews, reconciles and approves it without a duplicate book.",
            },
            {
              term: "Capital account statement",
              def: 'The per-investor statement of capital movements. US: partners\' capital account statement (PCAP); UK/EU: often "investor statement".',
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
            { lead: "Tolerance bands set per asset class and per line." },
            {
              lead: "Updated for the IPEV Valuation Guidelines, December 2025 edition,",
              text: "which apply to quarterly periods beginning on or after 1 April 2026. (Page content update, 28 September 2026.)",
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
              q: "Does this replace our administrator or our shadow books?",
              a: "No. Your administrator still strikes the NAV, and your governing body remains responsible for valuation. AIMA describes the manager's pre-release review as an additional control, not a replacement. EY reports that managers want to keep moving away from full shadow accounting; this playbook is the oversight that remains: tie-outs, recalculations and exception review, at whatever depth you choose.",
            },
            {
              q: "What tolerances do you use?",
              a: "Yours. Price tolerances come from your pricing policy, set by asset class and instrument. Line tolerances are usually an absolute amount plus basis points of NAV, set by fund type. The values in our examples are illustrative, not industry standards. The $0.01-per-share or 0.5%-of-NAV figure you may have seen is a reference for US registered funds, not a private-fund rule.",
            },
            {
              q: "Can the model set or change a valuation?",
              a: "No. It can read a valuation memo, flag a move outside your tolerance and draft a note on it. The mark is set by your valuation function and, for material Level 3 positions, your valuation committee. IPEV's December 2025 guidelines say the valuer remains fully accountable for AI-assisted outputs, and that is how the system is designed.",
            },
            {
              q: "Where does the model run, and what leaves our environment?",
              a: "Hosting and model providers are agreed with each client and named in writing. What holds in every design: the component that reads a pack has no write access and no network access of its own; model versions are pinned; and every input, prompt, model version and output is stored. EU clients subject to DORA will need us and our model providers in their register of information.",
            },
            {
              q: "How do we know it works before we rely on it?",
              a: "We build a golden set from your own past packs, seeded with the errors that have caused real restatements and enforcement actions. The system then runs alongside your current review for at least one full cycle, with your process authoritative. Your fund controller and CFO sign off against thresholds agreed before the build starts.",
            },
            {
              q: "What happens when the administrator changes its pack layout?",
              a: "Any numeric line that does not map to a confirmed account is rejected, and any table that does not cross-foot is set aside. Both go to your fund controller, who confirms the new mapping once. The next pack in that layout then maps automatically, and the change is logged.",
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
        slug: "investor-reporting",
        blurb:
          "Letters, capital account statements and DDQ answers drafted from your books, with every figure traced to source before release.",
      },
      {
        slug: "covenant-watch",
        blurb:
          "Borrower certificates recomputed from the credit agreement's own definitions, with headroom, add-back caps and cure rights tracked every test date.",
      },
      {
        slug: "capital-call-flow",
        blurb: "Calls computed from the LPA and side letters, sent per investor, and matched to the wires that arrive.",
      },
    ],
  },
  closing: {
    title: "Start with one fund and one period.",
    text: "Thirty minutes on one fund's NAV cycle. We will tell you what a tie-out ledger would hold and what it would cost to build.",
  },
};
