---
num: "10"
slug: "what-coding-agents-teach-us-about-back-office-automation"
title: "What coding agents teach us about back-office automation"
dek: "Coding agents became genuinely useful before most enterprise agents did. The reasons are structural: a tight loop, tools that fail loudly, and an environment full of checks. Operations teams can borrow all three."
category: "Engineering"
date: "2026-09-29"
image: "side-letter-register"
related: "loan-ops-ledger"
lead: false
startHere: false
draftWords: 1394
---

Over the past two years, coding agents such as Claude Code and Codex went from novelty to everyday tool for many software engineers. Over the same period, plenty of enterprise agent pilots in finance never made it past the demonstration.

The difference is not the model. Coding agents and enterprise agents are built on the same families of models, often the same versions. What coding agents have is a better setup around the model. That setup is worth studying closely by anyone automating back-office work, because most of it can be copied.

### 1. The loop runs on evidence

A coding agent works in a cycle. It gathers context by reading files and searching the codebase. It acts by editing code or running a command. Then it verifies by running the tests, checking the output and reading the error, and it repeats until the evidence is clean. Small requests finish in a few turns. Larger ones loop many times.

Every agent loops. What makes this loop work is that each turn produces evidence the model can check against something outside itself: a failing test, a compiler error, a diff. The model is not asked to judge whether it did well. It is shown.

**For operations:** design the process so that every step produces checkable evidence. That means a tie-out result, a reconciliation difference, or a validator's verdict on an extracted figure, not the model's own summary of what it believes it did.

### 2. The environment does most of the verifying

Software comes with a dense layer of automatic checks that grew up over decades: type checkers, compilers, linters, test suites, build pipelines. A coding agent inherits all of it on day one. When its change breaks something, the environment says so immediately and precisely. That is the main reason coding agents can be trusted with long tasks.

Back-office work has very little of this. There is no compiler for a covenant calculation and no linter for an investor letter. So the first job in automating an operations process is to build the checks the environment is missing:

- tie-outs to a book of record;
- tolerance engines for line-by-line comparisons;
- recomputation of every derived figure from its cited inputs;
- number-binding checks that stop drafted text quoting a figure no calculation produced.

We think this is the most underrated part of AI delivery in finance. You buy the model. You have to build the checks.

### 3. Tools fail loudly

The tools a coding agent uses are narrow and strict. Anthropic's text editor tool, for example, replaces a string only when the text to be replaced matches exactly and uniquely. If it matches nowhere, or in several places, the tool returns an error instead of guessing. That failure is useful. It sends the agent back to gather more evidence before trying again.

**For operations:** give tools preconditions that turn ambiguity into errors.

- A `post_adjustment` action refuses unless the break is in an accepted state and the amount matches the accepted explanation.
- A `propose_break_explanation` tool refuses without evidence identifiers attached.
- A payment release refuses without a valid approval from someone other than the preparer.

Strict tools convert ambiguity into errors, and errors into investigation. Lenient tools convert ambiguity into data.

### 4. Context is a budget, and memory lives in files

Coding agents treat the context window as scarce. They read files on demand rather than loading whole repositories. When the window fills, they summarise older history. And they keep durable rules in a project instructions file instead of relying on the conversation to remember them. For long tasks, state lives outside the chat altogether. Anthropic's harness for long-running agents uses a progress file and the version history as the source of truth about what has been done [1].

**For operations:** keep a run ledger for every case, holding its status, open questions, decisions and evidence. The system reads its state from the ledger, not from chat history. Put standing policies, such as house conventions and escalation rules, into versioned configuration. They should not be restated in every prompt and then forgotten when the conversation is compacted.

### 5. Sub-tasks get their own workspace

Coding agents can hand a scoped job, such as searching a large codebase or reviewing a change, to a sub-agent with its own context window. The sub-agent returns a condensed result. That keeps noisy exploration out of the main thread and lets independent work run in parallel.

This is powerful and easy to overdo. A 2025 study of seven open-source multi-agent frameworks found failure rates between 41% and 86.7% across 1,642 traces [2]. OpenAI's guide to building agents recommends starting with a single agent and adding more only when the task demands it [3]. Delegation works best when the sub-task is well scoped and its result can be verified.

**For operations:** a natural fit is one extraction worker per document, each returning a typed record to an orchestrator that validates it before anything downstream uses it.

### 6. Permissions are explicit, and undo is cheap

Coding agents run under explicit permission settings. Risky commands wait for a person to approve them. Behind all of it sits version control, which makes most mistakes reversible: a bad change is one revert away.

Operations has actions with no revert. A released wire, a capital call notice in an investor's inbox and a regulatory filing cannot be taken back with a command. So the permission design has to be stricter than a coding agent's. Tools are tiered into read, propose and execute. Execute actions run under a named person's identity, never the model's, and with four eyes wherever money moves.

### 7. The plan is an artefact

For larger tasks, coding agents commonly write a plan before they act: what they intend to change, in what order, and how they will know it worked. Some tools make this a separate mode, in which the person reviews and edits the plan before any code is touched. The plan then stays visible, often as a to-do list the agent updates as it goes, so a long task does not lose its thread.

**For operations:** write the run plan down, and for high-stakes cases review it before the work starts. A covenant test plan might list the definitions to resolve, the figures to extract from the certificate, the amendments to check and the tests to run, with the order and the evidence each step should produce. Reviewing a plan takes a credit analyst two minutes. Unpicking a test built on the wrong definition takes much longer. The plan also belongs in the run record, because it explains what the system meant to do as well as what it did.

### Where the analogy breaks

The comparison is useful, but it is not exact.

- **Ground truth is contractual.** In software, tests encode what the code is supposed to do. In operations, correct is defined by credit agreements, partnership agreements, side letters and policies, which are sometimes ambiguous and often amended. Someone has to decide what correct means for each clause, and write it down.
- **Consistency matters more than peak performance.** A coding agent can retry until the tests pass. An operations process runs every day and must be right every day. METR's 2026 measurements show how much reliability costs. Frontier models' task horizons at 80% reliability were several times shorter than at 50%: for Claude Opus 4.6, 69.9 minutes against 718.8 [4]. Long, unsupervised tasks at high reliability remain hard.
- **The record has to satisfy a regulator, not just a reviewer.** A coding agent's history lives in version control. An operations run needs a retained record of its inputs, model version, outputs and approvals, of the kind supervisors now expect [5, 6].

### What to borrow

1. Make every step produce evidence that can be checked outside the model.
2. Build the checks before you automate the work.
3. Make tools strict, and let them fail loudly.
4. Keep state and rules in files and ledgers, not in conversation.
5. Delegate only scoped sub-tasks whose results can be verified.
6. Wherever an action cannot be undone, replace "undo" with approval.
7. Write the plan down, review it when the stakes are high, and keep it in the record.

Coding agents look like a triumph of models. Look closer and they are a triumph of environments. The back office can have an environment like that too, but nobody will ship it pre-installed. It has to be built.

#### Sources

1. Effective harnesses for long-running agents. Anthropic, 2025-11-26. <https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents>
2. Why Do Multi-Agent LLM Systems Fail? (MAST) (Cemri et al.). NeurIPS 2025 Datasets and Benchmarks Track (spotlight), 2025-03-17. <https://arxiv.org/abs/2503.13657>
3. A practical guide to building agents (PDF). OpenAI, 2025 (PDF undated; circulated April 2025). <https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf>
4. Task-completion time horizons, Time Horizon 1.1 data (benchmark_results_1_1.yaml; page last updated 2026-05-08). METR, 2026-05-08. <https://metr.org/time-horizons/>
5. 2026 FINRA Annual Regulatory Oversight Report (PDF), GenAI section. FINRA, 2025-12. <https://www.finra.org/sites/default/files/2025-12/2026-annual-regulatory-oversight-report.pdf>
6. 17 CFR 275.204-2 Books and records to be maintained by investment advisers. Cornell LII (text of SEC rule), current text. <https://www.law.cornell.edu/cfr/text/17/275.204-2>
