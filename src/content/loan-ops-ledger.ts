// Copy for the Loan Ops Ledger playbook page (/playbooks/loan-ops-ledger), set verbatim from the
// design handoff (design_handoff_loan_ops_ledger: the prototype, Loan Ops Ledger.dc.html, wins
// over copy-deck.md and its README where they differ). Do not rewrite, shorten or reorder:
// straight quotes, minus signs and arrows are deliberate. The figures' text lives with the
// figures (src/components/playbooks/loan-ops-ledger/); every name and number there is
// fictional, and rates marked * are illustrative, not published fixings.
//
// Content rules from the handoff: the agent's register stays the record of ownership and
// analysts decide what is booked (the model proposes; code and people check); no "AI-powered",
// "real-time", "autonomous" or "100% accurate".

import type { PlaybookArticle } from "@/components/playbooks/article/types";
import { routes } from "./home";

export const loanOpsLedger: PlaybookArticle = {
  slug: "loan-ops-ledger",
  meta: {
    title: "Loan Ops Ledger — 3264.ai",
    description:
      "Agent notices matched daily to your loan system and bank cash, with each break classed and explained from the credit agreement, clause cited.",
  },
  reviewed: { iso: "2026-09-28", label: "Reviewed 28 September 2026" },
  hero: {
    category: { label: "Private Credit", href: routes.privateCredit },
    title: "Loan Ops Ledger",
    oneLiner:
      "Agent notices matched daily to the loan system, each break classed and explained from the credit agreement before month end.",
    standfirst:
      "Rate sets, interest and fee notices, paydowns and PIK capitalisations still reach loan operations by email, fax and portal. We read each agent notice, recompute the amount in code from the credit agreement's own conventions, and match it to your loan system and to the cash your bank reports. Every difference gets a class, an owner and an explanation with the clause cited. The agent's register stays the record of ownership. Your analysts decide what is booked.",
    secondary: { label: "See how it is built", href: "#built" },
    figure: "breakExplained",
  },
  // INTERIM: a pre-addressed email until there is a booking URL.
  cta: {
    mapping: { label: "Book a mapping session", href: "mailto:hello@3264.ai?subject=Loan%20Ops%20Ledger" },
    audit: { label: "Book a two-week audit", href: `${routes.aiEngineering}#engagement` },
  },
  back: { label: "All playbooks", href: routes.playbooks },
  overviewLabel: "Overview",
  sidebarCard: "Start with one month of agent notices",
  blockLabels: true,

  sections: [
    {
      id: "today",
      num: "01",
      label: "The work today",
      eyebrow: "01 / The work today",
      title: "Two records of each loan, kept in step every day",
      blocks: [
        {
          type: "p",
          text: "The administrative agent keeps the register of who owns each loan and sends the notices. Your loan operations team keeps its own record in the loan system. That record has to stay in step with the agent's, notice by notice, and with the cash that actually arrives.",
        },
        {
          type: "roles",
          items: [
            {
              role: "Loan operations analyst",
              text: "Receives agent notices by email, fax or portal: rate sets, interest and fee notices, paydowns, PIK capitalisations and borrowing requests relayed from the borrower.",
            },
            {
              role: "Loan operations analyst",
              text: "Checks each notice against the loan system: contract type, interest period, benchmark, margin and floor, principal, day count and the amount that results.",
            },
            {
              role: "Treasury, with the custodian",
              text: "Matches expected cash to bank statement files on each payment date, and chases the agent when a payment is short or missing.",
            },
            {
              role: "Loan operations lead",
              text: "Investigates each break with the agent, asks for its calculation, and decides which record needs correcting.",
            },
            {
              role: "Trade operations",
              text: "Settles loan trades through a settlement platform; the agent records the buyer as lender of record once the assignment is complete.",
            },
            {
              role: "Fund accounting, with the fund administrator",
              text: "Ties positions, accruals, PIK and fees at month end, and supplies loan data for the fund leverage facility's reporting.",
            },
          ],
          note: "Role titles are indicative.",
        },
        {
          type: "io",
          cards: [
            {
              label: "Inputs",
              items: [
                "Agent notices: rate set, interest, fee, principal paydown, PIK capitalisation",
                "Borrowing Requests and Interest Election Requests, relayed by the agent",
                "PIK Election notices, and PIK elections deemed by amendment",
                "Credit agreements and their amendments",
                "Loan system exports: contracts, accrual schedules, positions (traded and settled), cash projections",
                "Bank statement files (BAI2 / BTRS; ISO 20022)",
                "Settlement documents: trade confirmation, assignment and assumption, funding memo",
              ],
            },
            {
              label: "Outputs",
              items: [
                "Daily match file",
                "Break report: class, owner, age, explanation, status",
                "Bookings in the loan system, under the analyst's name",
                "Queries to the agent, with the agent's replies",
                "Month-end tie-out to the fund administrator and general ledger",
                "Loan data for the leverage facility's Monthly Report and borrowing base",
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
      title: "The breaks come from contract mechanics, not arithmetic",
      blocks: [
        {
          type: "breaks",
          items: [
            {
              title: "A partial PIK election",
              text: "In one filed amendment the borrower may pay up to 75% of interest in kind, by irrevocable notice at least 10 business days before the payment date. The same amendment deemed PIK elections for three 2025 payment dates, so no notice was ever sent. Miss one and cash, principal and accrual all break at once.",
            },
            {
              title: "A day count that looks like a data error",
              text: "The ARRC recommends Actual/360 for SOFR loans; sterling loans usually accrue on Actual/365, and an agreement can choose otherwise. On a $24.75m loan at 9.5625% for 91 days, the gap between the two is $8,195.26 (illustrative).",
              figure: "dayCounts",
            },
            {
              title: "The knock-on at fund level",
              text: "In one filed fund leverage facility, partial PIK loans currently paying in kind are capped at 10% of the pool, and PIK loans paying no cash interest are ineligible. A missed toggle can overstate the borrowing base, and a PIK amendment may need the leverage provider's consent.",
            },
            {
              title: "A payment that should never have been sent",
              text: "In August 2020 an administrative agent meant to pay lenders about $8m of interest and wired about $900m, principal included. The dispute ran until an appeals court ruled in September 2022. The LSTA published a form erroneous-payment provision in 2021.",
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
      title: "The model reads. Code computes. Your analyst decides.",
      blocks: [
        {
          type: "p",
          text: "Each notice follows the same fixed path. The model reads the notice and drafts explanations. Code does every calculation and every match. A named person decides anything that is booked, disputed or paid.",
        },
        {
          type: "stepTable",
          head: ["Step", "The model reads or drafts", "Code computes or decides", "A person signs"],
          rows: [
            {
              step: "1. Intake",
              cells: [
                "Classifies the notice: rate set, interest, fee, paydown, PIK, borrowing",
                "Routes it by type; logs the sender, the time received and the file hash",
                null,
              ],
            },
            {
              step: "2. Read",
              cells: [
                "Extracts facility, dates, rates and amounts, each with its place on the page",
                "Checks schema, ranges and cross-field arithmetic; matches each figure to its cited text",
                "Loan operations analyst reviews any field that fails a check",
              ],
            },
            {
              step: "3. Match",
              cells: [
                "Proposes a facility when the notice has no usable identifier",
                "Matches identifiers, dates and amounts to the expected event in the loan system",
                "Analyst confirms any proposed match",
              ],
            },
            {
              step: "4. Recompute",
              cells: [
                null,
                "Recomputes the amount from the agreement's conventions: benchmark, floor, margin, day count, lookback, PIK split, pro rata share",
                null,
              ],
            },
            {
              step: "5. Class the break",
              cells: [
                "Drafts the explanation from the calculation trace, citing the notice and the clause",
                "Assigns the break class by rule, ages it, and flags fund-facility impact for PIK",
                "Analyst accepts or edits the explanation",
              ],
            },
            {
              step: "6. Investigate",
              cells: [
                "Searches the loan system, past notices and correspondence with read-only tools, and proposes a cause",
                "Caps steps and tools; logs every call",
                "Loan operations lead accepts the agent's figure or raises a query",
              ],
            },
            {
              step: "7. Book",
              cells: [null, "Writes the run record", "Analyst books any adjustment under their own name; treasury releases cash"],
            },
          ],
        },
        {
          type: "callout",
          label: "Never automated",
          text: "The model never writes to the loan system, never changes settlement instructions and never releases cash. It cannot accept or dispute an agent's figure. Those decisions sit with your loan operations lead and treasury, under their own names. Where the agent's notice and your ledger differ, the playbook explains the difference. It does not overwrite either record.",
        },
        { type: "figure", id: "dailyMatch" },
      ],
    },
    {
      id: "evidence",
      num: "04",
      label: "The evidence",
      eyebrow: "04 / The evidence",
      title: "Every break closes with its reason on file",
      blocks: [
        {
          type: "p",
          text: "Each notice leaves one evidence line: where the figure came from, what code recomputed, which rule classed the difference, and who accepted it. Advisers must keep written communications about receipts and disbursements for at least five years, so the notice and the reason sit with the decision.",
        },
        { type: "figure", id: "evidenceLine" },
        { type: "h3", text: "Kept for every run" },
        {
          type: "kept",
          items: [
            "The original notice, with its file hash, sender and time received",
            "Each extracted field, with its place on the page",
            "The loan-system snapshot the notice was matched against",
            "The calculation trace: fixing date, rate, days, basis, rounding",
            "The break class, the explanation and the clause cited",
            "The reviewer's decision, any edits, and the time",
            "The prompt version, model version and check results for the run",
            "Booking references and bank statement references",
          ],
        },
        {
          type: "midCta",
          title: "What we need from you to start",
          text: "A month of historical agent notices with the breaks you already know about, read access to a loan system export, bank statement files for the same month, and two people who can label the answers.",
          tracked: true,
        },
      ],
    },
    {
      id: "built",
      num: "05",
      label: "How it is built",
      eyebrow: "05 / How it is built",
      title: "A fixed workflow, with one read-only loop",
      technical: true,
      blocks: [
        {
          type: "p",
          text: "Loan Ops Ledger is a workflow, not a free-roaming agent. A router sends each notice down a fixed path. Deterministic engines compute and match. The model reads, classifies and drafts. The one agent loop, break investigation, has read-only tools. This section is written for your engineers and your model-risk reviewers.",
        },
        { type: "figure", id: "modelCodePerson" },
        { type: "h3", id: "built-harness", text: "Harness" },
        {
          type: "bullets",
          items: [
            {
              lead: "Routing, then matching.",
              text: "Notices are routed by type into a deterministic matcher. Anthropic's guidance favours fixed workflows where a task is well defined and has to be predictable. Daily loan operations is that kind of task.",
            },
            {
              lead: "One bounded loop.",
              text: "Break investigation may query the loan system, past notices and correspondence. It has read-only tools and step and token caps, and it proposes a cause, never an adjustment.",
            },
            {
              lead: "Engines in code.",
              text: "An expected cash-flow calculator (accrual, day count, lookback, floor, rate reset, PIK split, pro rata share), a matcher with per-field tolerances, and break ageing.",
            },
            {
              lead: "Typed hand-offs.",
              text: "Everything the model passes to code is a typed record: field, value, unit, date, document, page, span, confidence and extractor version. Structured output guarantees the shape of that record, not its values, so code checks the values too.",
            },
          ],
        },
        { type: "figure", id: "anatomy" },
        { type: "h3", id: "built-data", text: "Data and integrations" },
        {
          type: "bullets",
          items: [
            {
              lead: "Agent notices:",
              text: 'email text and attachments sent to your designated "Agent Notices" address, faxes received as images, agent portal extracts, and agent data feeds where your agent contributes to one.',
            },
            {
              lead: "Loan system:",
              text: "contracts, accrual schedules, positions (traded and settled) and cash projections, read through vetted, parameterised queries rather than free-form SQL. Export formats differ by system; we map yours during the assessment.",
            },
            {
              lead: "Bank cash:",
              text: "BAI2 files (maintained by ASC X9 as BTRS, version 3.2 of April 2020) and ISO 20022 statements.",
            },
            {
              lead: "Settlement:",
              text: "trade confirmation, assignment and assumption, and funding memo from your settlement platform.",
            },
            {
              lead: "Credit agreements and amendments:",
              text: "one index per agreement. Each facility's conventions are held as versioned parameters linked to their clauses.",
            },
            {
              lead: "Fund facility:",
              text: "loan data for the collateral administrator's Monthly Report and for the Borrowing Base Calculation Statement attached to each Notice of Borrowing.",
            },
            { lead: "Cadence:", text: "notices daily; cash on each contract's payment dates; tie-out at month end." },
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
              hard: "Conventions change the number, not the words: day count, lookback fixing dates, business-day rolls.",
              we: "Encode each facility's conventions once per agreement version and recompute in code. Writing a program instead of computing in text raised accuracy by about 12% on average across eight maths and finance datasets (Program of Thoughts, Codex, 2022).",
            },
            {
              hard: "Notices are laid out differently by each agent, are often scanned, and carry global and per-lender amounts on the same page.",
              we: "Use layout-aware parsing, then check each figure literally against the text it came from. Tables remain the weak point: in late-2024 tests the best PDF parser scored about 79 of 100 on table structure, and GPT-4o 72 (OmniDocBench).",
            },
            {
              hard: "PIK arithmetic. Elections are partial, some are deemed by amendment and never arrive as notices, capitalised PIK itself bears interest, and cents must round the same way on both legs.",
              we: "Load elections and deemed elections from the agreement and its amendments, compute the split to the cent with a stated rounding rule, and treat PIK as its own break class.",
            },
            {
              hard: "A daily process needs the same answer every day. gpt-4o solved 61.2% of τ-bench retail tasks in one try, but fewer than a quarter consistently across eight tries (mid-2024).",
              we: "Measure pass^k on break explanations, keep each model step short, and run the golden set every night.",
            },
            {
              hard: "Sometimes the right answer is that the agent is right and your record is stale.",
              we: "Never let the matcher overwrite. The explanation says which record should move and why, and a person decides.",
            },
          ],
        },
        { type: "h3", id: "built-evals", text: "How we know it works" },
        {
          type: "bullets",
          items: [
            {
              lead: "Golden set:",
              text: "synthetic notices covering Term SOFR, Daily Simple SOFR with a lookback, ABR, floors, stub periods, month-end date rolls, partial PIK at 25%, 50% and 75%, deemed PIK, paydowns, fees and delayed settlement. Added to that is a month of your own notices with known breaks, labelled by two of your people independently.",
            },
            {
              lead: "Metrics, reported per field:",
              text: "extraction exact match; recomputed interest within $0.01 of the agent where conventions match; auto-match rate; false-match rate (a break wrongly closed), held near zero; unexplained-break rate; share of explanations the analyst accepts; pass^k on explanations.",
            },
            {
              lead: "Release gate:",
              text: "every fortnightly release passes the regression suite, and no field may regress beyond its tolerance. A new model version runs the full golden set, plus a replay of recent notices, before it goes live.",
            },
            {
              lead: "Shadow run:",
              text: "the playbook runs beside your current process through at least one month end. Your team's record stays authoritative, and every disagreement is logged with its root cause before you accept.",
            },
            {
              lead: "No public benchmark covers agent notices.",
              text: "Any accuracy figure we give you comes from your golden set, and we say so.",
            },
          ],
        },
        { type: "figure", id: "passk" },
        { type: "h3", id: "built-controls", text: "Controls and security" },
        {
          type: "bullets",
          items: [
            {
              lead: "Tool tiers:",
              text: "the model can read and propose. Execute actions (post a booking, release cash, change settlement instructions) are not exposed to it. They run from the approval screen under the approver's name, in line with OWASP's advice to require human approval for high-impact actions.",
            },
            {
              lead: "Notices are untrusted input.",
              text: "The component that reads them has no write tools and no network access, and it can only output a typed record. Text inside a notice cannot choose an action. In 2024 tests, limiting tools this way cut targeted prompt-injection success against GPT-4o agents from 47.7% to 7.5% (AgentDojo).",
            },
            {
              lead: "Bank details never change from a notice.",
              text: "Any email or notice asking for new wire instructions opens a blocked case with a call-back task. The FBI recommends verifying account changes through a second channel. Business email compromise losses reported to it were $2.77bn in 2024.",
            },
            {
              lead: "Separation of duties:",
              text: "the playbook counts as a maker. The person who accepts an explanation cannot also release the cash.",
            },
            {
              lead: "Records, not re-runs:",
              text: "every input, prompt version, model version, output and reviewer action is stored, so any result can be reconstructed without running the model again.",
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
      title: "The rules this work sits inside",
      blocks: [
        {
          type: "rules",
          status: "Status as of 28 September 2026",
          items: [
            {
              date: "2021-12-01",
              title: "LSTA Standard Terms, SOFR version",
              text: "Delayed-settlement cost of carry uses average SOFR on a 360-day basis, plus 11.448bp.",
            },
            {
              date: "2023-03-15",
              title: "ARRC statement on LIBOR fallbacks",
              text: "The fixed spread adjustments apply to fallback contracts, not to new SOFR loans.",
            },
            {
              date: "2026-04-16",
              title: "AIFMD II loan-origination rules apply",
              text: "EU loan-originating funds need policies for administering and monitoring loans, reviewed at least annually.",
            },
            {
              date: "2026-04-17",
              title: "SR 26-2 and OCC 2026-13 issued",
              text: "Revised US bank model-risk guidance; generative and agentic AI are outside its scope.",
            },
            {
              date: "2026-07-21",
              title: "LSTA private credit model provisions (PCC MCAPs) final",
              text: "Model credit agreement terms for private credit, based on the BSL MCAPs; members only.",
            },
          ],
          note: "Records: Advisers Act Rule 204-2 (in force) requires written communications about receipts and disbursements to be kept for at least five years.",
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
              term: "Administrative agent (US) / facility agent (UK/EU, LMA)",
              def: "The lender group's agent. It keeps the register, sends notices and distributes payments.",
            },
            {
              term: "Agent notice",
              def: "Any message from the agent to lenders about borrowings, rates, payments, fees or amendments.",
            },
            { term: "Rate set", def: "The agent's notice of the benchmark and all-in rate for an interest period." },
            {
              term: "Term SOFR / Daily Simple SOFR",
              def: "The forward-looking SOFR term rate, and daily SOFR accrued in arrears without compounding.",
            },
            {
              term: "Day count",
              def: "How days turn into interest. Actual/360 for USD SOFR loans; Actual/365 is the norm for sterling (US vs UK difference).",
            },
            {
              term: "Lookback",
              def: "Using the SOFR fixing from a set number of business days earlier, so the amount due is known before the payment date.",
            },
            { term: "Floor", def: "The minimum benchmark rate the agreement allows." },
            {
              term: "PIK toggle / PIK Election",
              def: "The borrower's option to pay part of the interest in kind, added to principal, by notice before the payment date.",
            },
            {
              term: "Break",
              def: "A difference between your record and the agent's, the custodian's or the bank's that must be explained. A practitioner term, with no formal definition.",
            },
            { term: "Register / lender of record", def: "The agent's book-entry record of who owns the loan." },
            {
              term: "Assignment and assumption",
              def: "The settlement document that transfers a loan interest (US usage; the LMA equivalent was not verified).",
            },
            {
              term: "Cost of carry / delayed compensation",
              def: "Compensation for a trade that settles late. The LSTA formula uses SOFR (US); LMA terms differ.",
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
            "PIK elections recognised as their own break class, with the fund-facility impact flagged.",
            "Rules and terms on this page reviewed as of 28 September 2026, including SR 26-2 and the LSTA's private credit model provisions.",
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
              q: "Does this replace the agent's record, or our loan system?",
              a: "No. The agent's register remains the record of who owns each loan, and your loan system remains your book. The playbook reads both, explains where they differ and proposes what should change. Your analyst books any change under their own name. Where the agent's figure needs challenging, your lead raises the query with the agent.",
            },
            {
              q: "What happens when we think the agent is wrong?",
              a: "The explanation shows both figures, the recompute, the clause, and which record would need to move. Your loan operations lead decides whether to accept the agent's figure or raise a query. The query, the agent's reply and the decision are kept with the notice. Nothing changes on either side until the agent answers.",
            },
            {
              q: "How do PIK toggles reach the fund's leverage facility?",
              a: "When a notice shows interest paid in kind, the break is classed as a PIK toggle and the capitalised amount is recomputed to the cent. The playbook then recalculates the loan's effect on your facility's PIK concentration and eligibility tests, using your facility's own definitions, and flags the result to the fund controller before the next borrowing base report.",
            },
            {
              q: "Where does the model run, and who sees our data?",
              a: "Notices are treated as untrusted input, and the component that reads them has no write access and no network egress. Model versions are pinned and named in every run record. We list the model providers and sub-processors for your vendor review, and for EU managers' DORA register of information.",
            },
            {
              q: "How do you know it still works six months after launch?",
              a: "The golden set runs every night and on every change. We track match rate, false matches, unexplained breaks, accepted explanations and consistency across repeated runs. Model versions are pinned, and a new version goes live only after the full suite and a replay of recent notices pass. Providers give at least 60 days' notice before retiring a model.",
            },
            {
              q: "What do you need from us to start?",
              a: "A mapping session, then a two-week assessment. For that we need a month of historical agent notices with the breaks you already know about, read access to a loan system export, bank statement files for the same month, and two people who can label the answers. Build then runs in fortnightly releases.",
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
        slug: "covenant-watch",
        blurb:
          "Borrower certificates recomputed from the credit agreement's own definitions, with headroom, add-back caps and cure rights tracked every test date.",
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
    title: "Start with one month of agent notices",
    text: "Bring a month of notices and the breaks you already know about. We will show you where the time goes and whether this is worth building.",
  },
};
