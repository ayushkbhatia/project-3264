---
num: "09"
slug: "flexible-where-it-s-safe-fixed-where-it-matters"
title: "Flexible where it's safe, fixed where it matters"
dek: "Composable tools let an AI system choose its own path through an investigation. A money path should have no path to choose. Designing the tool layer for credit and fund workflows starts with knowing which is which."
category: "Engineering"
date: "2026-09-29"
image: "research-intake"
related: "loan-ops-ledger"
lead: false
startHere: false
draftWords: 1344
---

Enterprise AI design has swung like a pendulum. The first generation of systems wrapped unreliable models in rigid pipelines: extract, then validate, then format, then check again. That made sense. Models wandered off task and invented facts, so designers forced every request down a path they had foreseen.

As models improved, the advice swung the other way. Stop scripting, it says: give the model a small set of composable functions and let it work out the steps for itself. A scripted path cannot adapt when a request does not match what the designer expected, and every stage adds latency even when it is not needed.

Both positions are right, in different places. In fund and lending operations, the real design skill is drawing the line between them.

### Two kinds of work inside one process

Anthropic draws a useful distinction between *workflows*, where models and tools follow predefined code paths, and *agents*, where the model directs its own process and tool use. It recommends workflows when a task is well defined and needs to be predictable, and agents when the steps cannot be determined in advance [1].

Most operations processes contain both kinds of work. Take daily loan reconciliation. Matching each agent notice to the loan system happens the same way every day: parse the notice, find the facility, compare interest, principal and fees, record the result. That is a workflow. But explaining *why* a particular notice disagrees with the ledger is different every time. The cause might be a rate reset, a day-count convention, a PIK election, an amendment, or simply a late payment. The investigation cannot be scripted in advance, because its next step depends on what the last one found.

### Where composable tools earn their place: investigation

For investigation, a set of small, composable, read-only tools outperforms any pipeline. Here is a plausible tool set for explaining breaks in a loan book:

- `get_agent_notice(notice_id)` returns the parsed fields with their locators in the source document.
- `get_ledger_entries(facility_id, period)` returns the loan system's rows for the period.
- `get_facility_terms(facility_id, as_of)` returns rate, margin, floor, day count and PIK options, each with a clause reference.
- `compute_expected_interest(facility_id, period, assumptions)` is a deterministic calculator. The model supplies the assumptions and code does the arithmetic.
- `search_correspondence(facility_id, date_range, query)` searches messages from the agent bank.
- `propose_break_explanation(break_id, break_class, clause_ref, evidence_ids)` creates a proposal for an analyst to accept or reject.

Consider a fictional example. The notice for the Calder Ridge Software term loan shows interest of $598,253.91 for the quarter: $24.75m at 9.5625% for 91 days on an ACT/360 basis. Only half of that arrived as cash. The model fetches the facility terms and finds that a PIK toggle is permitted. It searches the correspondence and finds a borrower election to pay 50% in kind for the period. It asks the calculator for the expected cash and PIK split under that election, and the numbers agree. It then proposes the break class "PIK toggle", cites the election clause, and attaches the evidence.

A rate break takes a different route through the same tools. Suppose another facility's notice charges interest at a higher base rate than the ledger expects. Here the model starts with `get_facility_terms` and learns the rate mechanics: the benchmark, the margin, the floor and the date on which the base rate is fixed for each period. It then calls `compute_expected_interest` twice, once with the rate on the notice and once with the rate in the ledger. The notice turns out to be right. The ledger used the rate from a day too early. The model proposes "rate fixing date" as the break class, cites the interest period clause, and attaches both calculations.

A timing break, where the cash simply arrived a day late, would take a third route that barely touches the calculator at all. No pipeline anticipates every break. A good set of primitives covers all of them, and the evidence each investigation produces looks the same, whichever route it took.

### Where the path should be fixed: money and determinations

Now consider sending a capital call, signing off a NAV pack, deciding whether a covenant is breached, or checking an order against a mandate before it trades. Here the steps are known in advance, the consequences are irreversible or externally visible, and the evidence has to be produced the same way every time.

These processes should run on a fixed code path. The model contributes only in bounded steps, such as extracting terms or drafting the text of a notice, and it never chooses what happens next. Mandate compliance is the clearest case. A model can help translate an investment management agreement's clause into a rule, at encoding time, with a named person approving the translation. At run time, a rule engine tests each order against the approved rule. No model sits in that path.

### What makes a good primitive

A tool layer built for flexibility needs discipline in its parts:

- **Pure reads.** The same input gives the same output, with no side effects, so tools are safe to call repeatedly.
- **Typed contracts.** Explicit input and output schemas, with units, as-of dates and source locators on every value.
- **Narrow responsibility.** One job per tool. A `process_facility` tool that does five things is five tools in disguise, and harder to test.
- **Clear names.** `loans.get_facility_terms` and `funds.get_commitments` leave no doubt about what they do or which domain they belong to.
- **Risk tiers.** Every tool is either read, propose or execute. Execute tools are never exposed to the model.
- **Informative errors.** "No PIK election found for the period ending 30 June; the latest election on file covers 31 March" helps the model reason. An empty result invites a guess.
- **Idempotent proposals.** Calling a propose tool twice must not create two proposals.

Anthropic's guidance on writing tools for agents makes many of the same points about distinct tools, descriptive names and useful error messages [2].

### Short prompts, well-equipped tools

When facts arrive through tools, the system prompt no longer needs to carry them. It can shrink to what the model genuinely needs up front: the goal, the boundaries, when to escalate, and the house conventions for writing an explanation.

That matters for quality as well as cost. Prompts packed with policy text and reference data dilute the model's attention. In the GSM-Symbolic study, adding a single inconsequential clause cut accuracy by up to 65% on grade-school maths (2024 models) [3]. Retrieving the relevant clause at the moment it is needed keeps the context small and on point [4].

### Testing the tool layer

Composable systems need testing at two levels.

1. **Each tool on its own.** Unit tests for every primitive, most importantly the calculators, and contract tests to keep schemas stable across versions.
2. **Whole investigations.** Evaluate trajectories on a golden set of past breaks. Did the model reach the right class, with the right evidence, in a reasonable number of calls? Run each case several times, because consistency is its own metric. In τ-bench, gpt-4o solved 61.2% of retail tasks in one try but fewer than a quarter consistently across eight tries [5].

Add budgets as well. Cap the number of tool calls per investigation, the tokens and the wall-clock time. An investigation that hits a cap goes to an analyst with what it found so far. It does not run on.

### Choosing, step by step

A short set of questions settles most design decisions:

1. **Can the steps be listed in advance?** Use a workflow.
2. **Is any step irreversible or externally visible?** Fix the path, and put a named approver in front of that step.
3. **Does the next step depend on what the last one found?** Use primitives inside a bounded, read-only loop.
4. **Is the output a determination or a proposal?** Determinations, such as a breach or a pass or a fail, belong in tested code. Proposals can come from the model, with a reviewer deciding.

Pure pipelines are too rigid for investigation, and pure primitives are too loose for money. Good designs use each where it belongs. They define capabilities where flexibility is safe, and fix the path where it is not.

#### Sources

1. Building effective agents. Anthropic, 2024-12-19. <https://www.anthropic.com/engineering/building-effective-agents>
2. Writing effective tools for AI agents - using AI agents. Anthropic, 2025-09-11. <https://www.anthropic.com/engineering/writing-tools-for-agents>
3. GSM-Symbolic: Understanding the Limitations of Mathematical Reasoning in Large Language Models (Mirzadeh et al.). ICLR 2025, 2024-10-07. <https://arxiv.org/abs/2410.05229>
4. Effective context engineering for AI agents. Anthropic, 2025-09-29. <https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents>
5. tau-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains (Yao, Shinn, Razavi, Narasimhan). arXiv (Sierra), 2024-06-17. <https://arxiv.org/abs/2406.12045>
