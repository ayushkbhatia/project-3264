# 3264 Field Notes: article drafts

Fifteen original articles for the 3264.ai field notes, written 29 September 2026. Status: drafts for review. Total length: 20,355 words; every article is at least 1,250 words.

## Contents

- Part 1: Research and editorial notes
- Part 2: The articles
  - 01. An index is not understanding
  - 02. Twelve rules for AI agents that touch money
  - 03. A procurement checklist for AI vendors, from the build side
  - 04. Chat is an input, not an interface
  - 05. Draft, check, repeat: review loops that converge
  - 06. When the people who run the process can change the software
  - 07. Define done before you build
  - 08. A workshop, not the vault
  - 09. Flexible where it's safe, fixed where it matters
  - 10. What coding agents teach us about back-office automation
  - 11. Why document extraction pilots stall at 80% accuracy
  - 12. Instrumenting a workflow before you automate it
  - 13. Generated interfaces need schemas
  - 14. Many lanes, one production
  - 15. When reading is nearly free
- Part 3: All sources cited

---

## Part 1: Research and editorial notes

### What these are

Each article is an original piece written in 3264's voice for its audience: executives, operators and engineers at banks, fund managers and asset managers. Each one takes a single insight from the research notes (`Blog Extraction - Notes.md`, one note per insight) as its starting point, then develops it with 3264's own frameworks, examples from private credit and fund operations, and evidence from 3264's Playbook Research pack of 28 September 2026 (`research/playbooks/`: `SYNTHESIS.md`, `harness-sdlc.md`, `ai-research.md`, `regulatory-status.md` and `sources.csv`).

### How originality was handled

- Titles, wording, examples and arguments are new, and each piece is built around 3264's own domain and research. Ideas were carried over from the notes. Where an article covers ground the notes also cover, such as the three kinds of blocker in article 08 or the design principles in article 02 that overlap with common practice, it does so in its own terms and with its own examples. No text, headings, coined terms, pattern names, experiment results or examples from the source posts were reused.
- The examples are set in 3264's own domain: covenant testing, capital calls, loan operations, NAV review, investor reporting and mandate compliance.
- The worked examples reuse the fictional cast from the Playbook Research pack (Harrow Industrial Holdings, Aldercove Growth Fund III, Calder Ridge Software, Larkspur Credit Opportunities Fund II), so the articles and the playbook pages share one fictional universe. Their figures are the pack's re-checked sample arithmetic.

### Claims policy applied

- **No invented track record.** The drafts make no claims about 3264 clients, engagements, measured savings or past results. Method statements are phrased as recommendations or "our approach".
- **Benchmarks carry their model and date,** following the pack's "Numbers we can cite safely" table. Illustrative figures are labelled as illustrative.
- **Regulatory wording follows the pack's findings.** SR 11-7 is described as superseded by SR 26-2 / OCC Bulletin 2026-13 (17 April 2026), and EU AI Act Annex III dates follow the Digital Omnibus.
- **The pack's claims-to-avoid list was followed.** The drafts do not say "hallucination-free", "real-time", "deterministic AI" or "autonomous agents run your back office", and they borrow no productivity multipliers from other fields.

### Article map

| # | Title | Category | Words | Starting insight (note #) | Notes |
|---|---|---|---|---|---|
| 01 | An index is not understanding | Engineering | 1,436 | #01: repository maps for coding agents |  |
| 02 | Twelve rules for AI agents that touch money | Governance | 1,347 | #02: agent design principles |  |
| 03 | A procurement checklist for AI vendors, from the build side | Strategy | 1,338 | #03: what an agent harness is | Planned home-page field note |
| 04 | Chat is an input, not an interface | Product | 1,331 | #04: interaction patterns beyond chat |  |
| 05 | Draft, check, repeat: review loops that converge | Engineering | 1,397 | #05: automated critique-and-fix loops |  |
| 06 | When the people who run the process can change the software | Strategy | 1,362 | #06: coding agents living beside the code |  |
| 07 | Define done before you build | Engineering | 1,362 | #07: verifiable definitions of done |  |
| 08 | A workshop, not the vault | Engineering | 1,375 | #08: giving agents an environment of their own |  |
| 09 | Flexible where it's safe, fixed where it matters | Engineering | 1,344 | #09: composable tools over fixed workflows |  |
| 10 | What coding agents teach us about back-office automation | Engineering | 1,394 | #10: how coding agents work |  |
| 11 | Why document extraction pilots stall at 80% accuracy | Strategy | 1,355 | #11: the demo-to-production gap | Planned home-page field note |
| 12 | Instrumenting a workflow before you automate it | Operations | 1,341 | #12: fine-tuning a small classifier | Planned home-page field note |
| 13 | Generated interfaces need schemas | Engineering | 1,353 | #13: schema-driven generated UI |  |
| 14 | Many lanes, one production | Engineering | 1,328 | #14: per-developer environments |  |
| 15 | When reading is nearly free | Strategy | 1,292 | #15: planning for cheap intelligence |  |

### Key research findings the articles rely on

- Retrieval quality dominates financial QA: GPT-4-Turbo scored 19% with one shared vector store, about 50% with a store per filing and 85% with the right pages (FinanceBench, Nov 2023).
- Tables and long documents remain weak points: the best PDF table-structure score was about 79/100 (OmniDocBench, 2024); even top parsers failed about one in six olmOCR-Bench unit tests (Oct 2025); GPT-4's effective context on RULER was 64K of a claimed 128K.
- Credit agreements average about 84k tokens in the one public dataset, and even the best of 16 models struggled with multi-hop questions (KG-MuLQA, 2025).
- Calculations belong in code: programs instead of in-text arithmetic added about 12% accuracy (Program of Thoughts, 2022); one irrelevant clause cut maths accuracy by up to 65% (GSM-Symbolic, 2024).
- Consistency is its own metric: gpt-4o solved 61.2% of τ-bench retail tasks once but fewer than 25% across 8 tries (2024).
- Outputs are not reproducible on demand: 80 distinct completions from 1,000 runs at temperature 0 (2025). Records must be stored, not regenerated.
- Models change under stable names (GPT-4 84.0% → 51.1% on one task, Mar–Jun 2023) and through infrastructure faults (up to 16% of requests at the worst hour, 2025).
- Judges and explanations need calibration: GPT-4 judge verdicts held under answer-order swaps only 65% of the time (MT-Bench, 2023); AI explanations raised acceptance whether or not the AI was right (CHI 2021).
- Injection is contained by design: a least-privilege tool filter cut AgentDojo attack success from 47.7% to 7.5% (2024); CaMeL achieved provable security on 77% of tasks.
- Regulatory anchors moved: SR 26-2 / OCC 2026-13 replaced SR 11-7 on 17 April 2026 and put GenAI out of scope; FINRA's 2026 report names logs, model-version tracking and human review; the SEC's FY2026 priorities cover supervising AI in back-office work.

### Before publishing

1. **Run the name check** from the research pack (§4.3) on every fictional entity: Companies House, SEC EDGAR/IAPD and a trademark search.
2. **Confirm the method statements.** Check that each "we recommend" and "our approach" line matches how 3264 actually delivers.
3. **Verify the one uncited product claim:** in article 10, the exact-match behaviour of Anthropic's text editor tool. Check it against Anthropic's documentation.
4. **Re-check dates** in regulatory statements if months pass before publication, and route EU AI Act and DORA wording through legal review.
5. **Decide on the reference style.** Keep the numbered references per article, or move them into footnotes on the site.

---

## Part 2: The articles

## 01. An index is not understanding

*Structured maps of a credit agreement help an AI system find the right clause faster. They do not make its reading right. Build them as tools the system keeps using, not documents it reads once.*

Engineering · 6 min read · 1,436 words

A credit agreement is a hostile document for a machine to read. The one public dataset of credit agreements used for long-context testing averages about 84,000 tokens per agreement, and even the strongest of the sixteen models tested struggled with questions that meant hopping between sections or assembling sets of items [1]. Definitions sit in Article 1. The covenant that uses them sits in Article 7. The step-down grid lives in a schedule, and the amendment that changed the add-back cap arrived eighteen months later as a separate PDF.

The natural engineering response is to build a map. Parse the agreement into sections, extract every defined term, chain the amendments in order, index the schedules, and hand that structure to the model before it starts work. We think these indexes are worth building. But it pays to be precise about what they do, because an index solves a different problem from the one that usually causes the error.

### Finding and reading are different jobs

There is strong evidence that finding the right text matters enormously. In FinanceBench, published in November 2023, GPT-4-Turbo answered 19% of questions correctly when it retrieved from a single vector store shared across all filings, about 50% with a separate store per filing, and 85% when it was simply handed the right pages [2]. The model did not change between those runs. Only the retrieval did.

So an index that narrows the search to the right agreement, the right article and the right page is not a nice-to-have. It is the difference between a system that is usually wrong and one that is usually right.

Now look at where the remaining errors sit once retrieval is solved. In covenant testing, they sit in the definitions. Is an EBITDA add-back cap a percentage of EBITDA before or after the add-backs? Was the amendment that changed the cap effective for this test date? Is interest counted on an ACT/360 or an ACT/365 basis? The research we compiled across nine fund and lending processes found the same pattern every time: the hard part is the governing document's definitions, not the arithmetic [3, 4].

Take an illustrative case. The compliance certificate for Harrow Industrial Holdings (a fictional borrower we use in examples) reports total leverage of 4.25x against a 4.50x maximum. A system with a good index finds the leverage definition, the add-back basket and the relevant amendment in seconds. If it then applies the shared add-back cap correctly, limiting the add-backs to $6.32m, leverage recomputes to 4.61x. The reported 5.7% of headroom becomes a 2.5% breach. The index got the system to the right clause quickly. It did not tell the system how to apply it. That part is interpretation, and it is where the evaluation effort has to go.

### Why a map read once fades

The usual way to give a model a map is to put it at the top of the context: here is the structure of the agreement, now do the task. The model reads it, starts working and, a few thousand tokens later, is navigating by keyword search again.

There are good reasons to expect this. Language models use long contexts unevenly. In the 2023 "Lost in the Middle" study, GPT-3.5-Turbo's accuracy fell from 75.8% to 53.8% when the relevant document moved from first place to the middle of twenty, below its score with no documents at all [5]. On RULER, GPT-4's effective context was 64K tokens of a claimed 128K [6]. On NoLiMa, GPT-4o's accuracy at 32K tokens fell from 99.3% to 69.7% when the question and the evidence shared few words [7]. Newer models are flatter than these, but none is flat.

A map pasted at the top of a long run is exactly the kind of content that drifts out of effective reach. By the time the model needs to know which amendment governs the June test date, the map is 40,000 tokens behind it.

The fix is structural. Do not ask the model to remember the map. Make the map something it asks. This is the just-in-time retrieval Anthropic recommends for agent context in general [8], applied to one document type. Instead of a 3,000-token outline, expose a handful of tools:

- `resolve_definition(term, as_of)` returns the operative definition, its locator, and the amendment that last changed it.
- `get_section(ref)` returns one section with its page and version.
- `amendment_history(ref)` returns every change to a clause, with effective dates.
- `find_basket(name)` returns caps, carve-outs and the definitions each depends on.

Each call returns a small, cited piece of text at the moment it is needed. The map becomes infrastructure the system keeps using, not a document it reads once and forgets.

### What goes into a credit agreement index

The contents follow from the failure modes. For each element, record the locator (document, version, page, clause) so that every downstream value can cite it.

| Element | Why it matters | Example |
|---|---|---|
| Defined-terms graph | Definitions reference other definitions, sometimes several levels deep | "Consolidated EBITDA" → "Permitted Add-backs" → "Pro Forma Cost Savings" |
| Amendment ledger | Later documents override earlier text from an effective date | A cap raised from 15% to 20% by a second amendment, for test dates after 30 June |
| Covenant register | Each maintenance test, its ratio and its level by date | Total leverage stepping down from 5.00x to 4.50x |
| Baskets and caps | Where the interpretive disputes live | One cap shared across two add-back categories |
| Conventions | Values that look like data errors when ignored | Day count, rounding, PIK elections |
| Cross-reference map | Clauses that point elsewhere | "subject to Section 7.11(c)" |

### Measure the index separately from the answer

Because finding and reading are different jobs, they need different metrics. If you measure only end-to-end accuracy, an index can look useless when it is working, or look helpful when a better prompt is doing the work.

The approach we recommend tracks four things on a golden set of real, previously reviewed cases:

1. **Locator precision.** When the system cites a clause, is it the governing one, in the version in force on the test date?
2. **Definition resolution accuracy.** For each defined term the calculation depends on, did the system resolve it to the right text?
3. **Field-level exact match.** Score each extracted figure on its own. An average hides the one field that matters.
4. **Consistency across runs.** Covenant testing happens every quarter, so it needs the same answer every time. τ-bench showed how large this gap can be: gpt-4o solved 61.2% of retail tasks in one try, but fewer than a quarter consistently across eight tries [9]. Report pass^k, the share of cases that pass on every one of k runs, alongside accuracy.

It is also worth logging when the index tools are called during a run. An index that is consulted only in the first minute is not doing the job it was built for, and the fix is usually in the tool descriptions or the workflow, not the index itself.

### Building the index without trusting it blindly

Much of an index can be built deterministically. Section numbering, defined-term patterns ("'Consolidated EBITDA' means…") and cross-references follow conventions that code can parse reliably. Model-assisted extraction fills the gaps, and every model-extracted entry is checked by code. Does the cited text exist? Does it contain the defined term? Does the amendment's effective date parse, and does it fall after the original agreement's date?

Tables need particular care. Covenant grids and pricing schedules are tables, and tables remain the weak point of document parsing. In late-2024 tests, the best table-structure score among PDF parsers was about 79 out of 100, with GPT-4o at 72 [10]. In October 2025, even the best parsers still failed about one in six unit tests on olmOCR-Bench [11]. A sensible rule is that every parsed schedule gets a human check the first time an agreement enters the system. After that, the check applies only to what an amendment changes.

Finally, version the index with the agreement. When an amendment arrives, it produces a new index version, and every run records which version it used. When a controller asks in eighteen months why the system tested leverage the way it did, the answer should be in the run record, not in anyone's memory.

### The takeaway

An index answers "where is it?" Interpretation answers "what does it mean here, on this date?" Both are necessary, and they fail in different ways.

Build the index as a set of tools the system calls when it needs them, not as a preamble it skims. Measure finding and reading separately, so you know which one to fix. And spend most of your evaluation effort on the definitions, because that is where a 4.25x becomes a 4.61x, and where the money is.

#### Sources

1. KG-MuLQA: A Framework for KG-based Multi-Level QA Extraction and Long-Context LLM Evaluation (Tatarinov et al.). arXiv, 2025-05-18. <https://arxiv.org/abs/2505.12495>
2. FinanceBench: A New Benchmark for Financial Question Answering (Islam, Kannappan, Kiela, Qian, Scherrer, Vidgen). arXiv (Patronus AI), 2023-11-20. <https://arxiv.org/abs/2311.11944>
3. First Amendment to Credit Agreement with conformed Credit Agreement (Firefly Aerospace Inc. / Wells Fargo Bank, N.A. as administrative agent), Exhibit 10.1. SEC EDGAR (Firefly Aerospace 8-K), 2025-11-07. <https://www.sec.gov/Archives/edgar/data/1860160/000119312525274198/d31146dex101.htm>
4. First Amendment to Financing Agreement with conformed Financing Agreement and Exhibit E Form of Compliance Certificate (Authentic Brands LLC et al. / Blue Torch Finance LLC), Exhibit 10.1. SEC EDGAR (BRC Inc. 10-Q), 2025-06-09. <https://www.sec.gov/Archives/edgar/data/1891101/000189110125000018/brcincq2fy2025-ex101xfirst.htm>
5. Lost in the Middle: How Language Models Use Long Contexts (Liu et al.). TACL 2024, 2023-07-06. <https://arxiv.org/abs/2307.03172>
6. RULER: What's the Real Context Size of Your Long-Context Language Models? (Hsieh et al.). COLM 2024, 2024-04-09. <https://arxiv.org/abs/2404.06654>
7. NoLiMa: Long-Context Evaluation Beyond Literal Matching (Modarressi et al.). ICML 2025, 2025-02-07. <https://arxiv.org/abs/2502.05167>
8. Effective context engineering for AI agents. Anthropic, 2025-09-29. <https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents>
9. tau-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains (Yao, Shinn, Razavi, Narasimhan). arXiv (Sierra), 2024-06-17. <https://arxiv.org/abs/2406.12045>
10. OmniDocBench: Benchmarking Diverse PDF Document Parsing with Comprehensive Annotations (Ouyang et al.). CVPR 2025, 2024-12-10. <https://arxiv.org/abs/2412.07626>
11. olmOCR 2: Unit Test Rewards for Document OCR (Poznanski, Soldaini, Lo). arXiv (Allen Institute for AI), 2025-10-22. <https://arxiv.org/abs/2510.19817>

---

## 02. Twelve rules for AI agents that touch money

*In lending and fund operations, a wrong answer becomes a wire, a missed breach or a sentence in an investor letter. These are the design rules we apply whenever a model sits anywhere near that path.*

Governance · 6 min read · 1,347 words

Most advice on designing AI agents is written for software where a mistake costs a retry. Fund and lending operations are different in three ways. Some actions cannot be undone: a released wire, a capital call notice in an investor's inbox, a filing. Some inputs are adversarial: borrower packages and emails come from outside the firm, and occasionally from someone pretending to be a counterparty. And the people who supervise the process are expected to reconstruct, months later, exactly what happened and why.

Those three facts shape everything below. The rules are grouped by where they apply: scope, tools, inputs, numbers, and control and evidence.

### Scope

**1. Decide what the model must never do before deciding what it may do.**
Start with the irreversible actions: releasing a payment, sending a notice to investors, posting a journal, changing standing settlement instructions, submitting a filing. Do not expose these to the model at all. They run from an approval screen under the approver's own identity, so the permission check happens in the downstream system, not in a prompt [1, 2]. The model can prepare everything up to that point, and usually that is where most of the effort was anyway.

**2. Use a workflow when you know the steps, and keep agent loops for investigation.**
Anthropic distinguishes workflows, where code fixes the path and the model fills in steps, from agents that direct their own process, and it recommends workflows when a task is well defined and needs to be predictable [3]. Most fund processes are exactly that: read the governing document, extract, compute, compare, route. Where the path really does vary — working out why an agent notice disagrees with the loan system, or finding the approved answer to an unusual DDQ question — a bounded agent loop earns its place. Give it read-only tools, a step cap and a time cap.

### Tools

**3. Sort every tool into read, propose or execute.**
Read tools fetch things: the compliance certificate, the ledger rows, the facility terms. Propose tools create drafts that a person must accept: a break explanation, a register change, a notice draft. Execute tools change the world and, under rule 1, the model never holds them. This single classification does more for safety than any amount of careful prompt wording, because it limits what a confused or manipulated model can actually do [2].

**4. Name tools for the business action, and give each capability one route.**
`get_compliance_certificate` and `propose_break_explanation` tell the model what they do. `process_document` does not. Anthropic's guidance on tool design stresses clear, distinct tools with descriptive names [4]. If a model can post an adjustment through a dedicated tool and also through a general-purpose database tool, it will eventually choose the wrong one. Remove the overlap rather than writing instructions about it.

**5. Refuse informatively.**
When a tool refuses — the user lacks the entitlement, the document sits outside the fund's data room, the as-of date predates the agreement — return a reason the model can act on. "Excuse elections for this LP are visible only to the fund controller role" lets the agent explain the gap and route the task to the right person. A silent empty result invites it to guess, and a guess in this domain looks exactly like an answer.

### Inputs

**6. Treat every document as data, never as instructions.**
Text inside a borrower package or an email can try to redirect a model, which is why prompt injection tops the OWASP list of risks for LLM applications [5]. Simon Willison's "lethal trifecta" names the dangerous combination: access to private data, exposure to untrusted content, and a way to send data out [6]. The defence is architectural. The component that reads an untrusted document gets no write tools and no network access, and it outputs a typed record and nothing else. In the AgentDojo benchmark, a least-privilege tool filter cut targeted attack success against GPT-4o agents from 47.7% to 7.5% (2024) [7]. Design, not wording, did that.

**7. Retrieve the clause, not the whole agreement.**
Putting an entire limited partnership agreement into context feels thorough, and it usually performs worse. Irrelevant material distracts models: in the GSM-Symbolic study, adding one inconsequential clause cut accuracy by up to 65% on grade-school maths problems (2024 models) [8]. Load the definition, the section and the amendment you need, at the moment you need them [9].

### Numbers

**8. Compute in code, on cited inputs.**
The model's job is to find and extract the inputs, each with a pointer to where it came from. The calculation itself — leverage, a pro-rata allocation, accrued PIK interest, a management-fee basis — runs in unit-tested code. Having models write programs instead of computing in text improved accuracy by about 12% on average across eight maths and finance datasets in the Program of Thoughts study (Codex, 2022) [10]. For regulated processes, the bigger benefit is that code can be tested once and then trusted every time it runs.

**9. Validate values, not just shapes.**
Structured outputs guarantee the schema. They make no promise about the values [11]. A field typed as a decimal can still contain last year's EBITDA. Check ranges and units. Check cross-field arithmetic: do the components sum to the stated total? Check that the extracted figure literally appears in the span the model cited. A citation feature guarantees a valid pointer, not that the source supports the claim [12].

### Control and evidence

**10. Four eyes wherever money moves, and the system counts as one pair.**
Separation of duty means no single actor holds enough privilege to misuse a process alone [13]. If the system prepares a capital call, it is the maker. A person checks it, and where the policy requires, a different person releases it. Bank-detail changes are the sharpest case. Business email compromise losses reported to the FBI were $2.77bn in 2024 [14]. A document or email asking for new wire instructions should create a blocked case with a call-back task. The system should never update settlement instructions from text it has read.

**11. Keep a record you can replay without re-running the model.**
Model output is not reproducible on demand. In one 2025 test at temperature 0, a thousand runs of a single prompt produced 80 different completions [15], and hosted models change and retire on the provider's schedule. Books-and-records rules for advisers, and the FCA's record-keeping rules in SYSC 9, expect firms to reconstruct what happened [16, 17]. FINRA's 2026 oversight report recommends keeping prompt and output logs and tracking which model version was used [18]. So store every input, prompt version, model identifier, raw output, validator result and reviewer decision. The stored record is the evidence. A re-run is a new event.

**12. Measure consistency, not the best case.**
A process that runs every day has to be right every day. Anthropic's evaluation guidance makes the arithmetic plain: at 75% success per trial, three trials all pass only about 42% of the time [19]. Report pass^k on your golden set — the share of cases that pass on every one of k runs — alongside plain accuracy, and set release thresholds on it. A system that is brilliant on Monday and wrong on Tuesday is not ready for a daily reconciliation.

### Why these rules, and not better prompts

None of these rules is exotic. Most are controls that finance already applies to people: segregation of duties, evidence for every figure, least privilege, reconciliation to a book of record. What is new is the actor. A language model is fast, tireless and usually right, and it can be confidently wrong in a way that reads exactly like being right.

The temptation is to handle that with instructions: "never change bank details", "always cite your source", "double-check the arithmetic". Instructions help, but they are the weakest control available, because they depend on the model following them every time, including when a document is trying to talk it out of doing so. Every rule above moves a control out of the prompt and into something that can be tested: a tool tier, a validator, a calculation engine, an approval screen, a stored record.

The prompt should say what the model is for. The architecture should make sure it cannot do anything else.

#### Sources

1. A practical guide to building agents (PDF). OpenAI, 2025 (PDF undated; circulated April 2025). <https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf>
2. LLM06:2025 Excessive Agency. OWASP GenAI Security Project, 2024-11. <https://genai.owasp.org/llmrisk/llm062025-excessive-agency/>
3. Building effective agents. Anthropic, 2024-12-19. <https://www.anthropic.com/engineering/building-effective-agents>
4. Writing effective tools for AI agents - using AI agents. Anthropic, 2025-09-11. <https://www.anthropic.com/engineering/writing-tools-for-agents>
5. LLM01:2025 Prompt Injection. OWASP GenAI Security Project, 2024-11. <https://genai.owasp.org/llmrisk/llm01-prompt-injection/>
6. The lethal trifecta for AI agents. Simon Willison, 2025-06-16. <https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/>
7. AgentDojo: A Dynamic Environment to Evaluate Prompt Injection Attacks and Defenses for LLM Agents (Debenedetti et al.). NeurIPS 2024 Datasets and Benchmarks Track (per OpenReview), 2024-06-19. <https://arxiv.org/abs/2406.13352>
8. GSM-Symbolic: Understanding the Limitations of Mathematical Reasoning in Large Language Models (Mirzadeh et al.). ICLR 2025, 2024-10-07. <https://arxiv.org/abs/2410.05229>
9. Effective context engineering for AI agents. Anthropic, 2025-09-29. <https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents>
10. Program of Thoughts Prompting: Disentangling Computation from Reasoning for Numerical Reasoning Tasks (Chen, Ma, Wang, Cohen). TMLR 2023, 2022-11-22. <https://arxiv.org/abs/2211.12588>
11. Structured outputs (Claude API docs). Anthropic, living document. <https://platform.claude.com/docs/en/build-with-claude/structured-outputs>
12. Citations (Claude API docs). Anthropic, living document. <https://platform.claude.com/docs/en/build-with-claude/citations>
13. Glossary: separation of duty (SP 800-192). NIST CSRC, living glossary. <https://csrc.nist.gov/glossary/term/separation_of_duty>
14. 2024 IC3 Annual Report. FBI Internet Crime Complaint Center, 2025-04. <https://www.ic3.gov/AnnualReport/Reports/2024_IC3Report.pdf>
15. Defeating Nondeterminism in LLM Inference (He). Thinking Machines Lab, 2025-09-10. <https://thinkingmachines.ai/blog/defeating-nondeterminism-in-llm-inference/>
16. 17 CFR 275.204-2 Books and records to be maintained by investment advisers. Cornell LII (text of SEC rule), current text. <https://www.law.cornell.edu/cfr/text/17/275.204-2>
17. SYSC 9.1 General rules on record-keeping. FCA Handbook, current text. <https://www.handbook.fca.org.uk/handbook/SYSC/9/1.html>
18. 2026 FINRA Annual Regulatory Oversight Report (PDF), GenAI section. FINRA, 2025-12. <https://www.finra.org/sites/default/files/2025-12/2026-annual-regulatory-oversight-report.pdf>
19. Demystifying evals for AI agents. Anthropic, 2026-01-09. <https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents>

---

## 03. A procurement checklist for AI vendors, from the build side

*The model is the one component every vendor can buy. The harness around it decides whether a system survives an audit, a model retirement and a bad quarter. These are the questions we would ask if we were sitting on your side of the table.*

Strategy · 6 min read · 1,338 words

AI vendor demos in financial services have started to look alike, and there is a simple reason: most of them are built on the same handful of models. The part that differs, and the part you will live with for years, is everything around the model.

The industry now has a name for that part. Thoughtworks summarises it as "Agent = Model + Harness": the harness is everything except the model [1]. OpenAI described "harness engineering" in February 2026 as improving an agent's output by shaping its environment while the model stays fixed [2]. Anthropic separates the agent harness, which lets a model act, from the evaluation harness, which tests it [3]. In a regulated firm, the harness is the tools the model may call, the checks its output must pass, the people who approve it, and the record of what it did.

When you buy an AI system, that is what you are buying. The checklist below is organised around it. For each area there is a question to ask, what a good answer sounds like, and a warning sign.

### 1. Ownership

**Ask:** When the contract ends, what do we keep? Who owns the prompts, the evaluation sets, the runbooks and the source code, and could our own team run the system without you?

**A good answer:** All of it is yours from the first day, in your own repositories, and the documentation is written for your engineers rather than for the vendor's support desk.

**Warning sign:** Prompts described as the vendor's proprietary IP, or evaluation results shared only as a summary slide.

### 2. Model versions and retirement

**Ask:** Is the model pinned to a specific snapshot? What happens when the provider retires it?

Providers retire models on published schedules. Anthropic commits to at least 60 days' notice [4], and OpenAI to at least six months for generally available models [5]. Behaviour can also change without a retirement. Between March and June 2023, GPT-4's accuracy on one reasoning task fell from 84.0% to 51.1% under the same API name [6]. In 2025, infrastructure bugs rather than any model change affected up to 16% of one production model's requests at the worst hour [7].

**A good answer:** The snapshot identifier is recorded on every run. A migration means the full regression suite, a replay of recent production inputs, a per-field comparison against the incumbent, and a shadow period of one full business cycle before cut-over.

**Warning sign:** "We always use the latest model."

### 3. Evidence that it works on your documents

**Ask:** What is the golden set, where did it come from, and how is it scored?

**A good answer:** It is built from your own historical cases, including the ones that went wrong. Two experts label each case independently, and their agreement is measured before the set is trusted. Anthropic suggests starting with 20–50 tasks drawn from real failures [3], and Husain and Shankar advise reading real traces and understanding failures before writing the tests [8]. Scores are reported per field, not as one average, and consistency is measured across repeated runs. Where a model grades outputs, it has been checked against human labels, because judges have biases: in the MT-Bench study, GPT-4 agreed with human preferences 85% of the time but gave the same verdict when the two answers were swapped in only 65% of cases [9].

**Warning sign:** A single accuracy figure, or benchmark scores quoted without the model and the date.

### 4. The line between model and code

**Ask:** What does the model decide, and what does code decide?

**A good answer:** The model locates, extracts, classifies and drafts. Code computes, compares against thresholds, allocates, reconciles and writes to your systems of record. The hand-off between them is a typed record with a pointer to its source, validated before any calculation uses it.

**Warning sign:** "The model calculates the covenant ratios."

### 5. Reconstruction

**Ask:** A year from now, can you show why the system produced a particular number, without re-running anything?

This matters because output is not reproducible on demand: in one 2025 test at temperature 0, a thousand runs of the same prompt produced 80 different completions [10]. Records obligations assume the original can be reconstructed. The advisers' books-and-records rule [11] and the broker-dealer preservation rule [12] both assume the original record exists, and a regenerated answer is not the original.

**A good answer:** Every run stores its inputs, prompt version, model identifier, parameters, raw output, validator results and reviewer actions, for a retention period that matches your obligations.

**Warning sign:** "We can always regenerate it."

### 6. Autonomy and security

**Ask:** What can the system do without a person? What happens if a document contains instructions?

**A good answer:** Tools are tiered into read, propose and execute. Execute actions, such as releasing money or sending anything outside the firm, run under a named approver's identity and never from the model. The component that reads untrusted documents has no write tools. The evaluation suite includes red-team cases with injected instructions, and the expected behaviour on each is documented.

**Warning sign:** "Our model is trained to ignore malicious instructions." Training helps. It is not a control.

### 7. Uncertain items

**Ask:** What happens to the cases the system is not sure about?

**A good answer:** Each item carries a validator result, a source-support check and a confidence band. Anything that fails goes to a named reviewer, whatever its confidence. Auto-accepted items are sampled on a stated plan. For example, finding zero errors in 299 sampled fields supports, at 95% confidence, an error rate below 1% for that population.

**Warning sign:** "It's never unsure."

### 8. Running cost

**Ask:** What does a run cost, and what stops a runaway?

**A good answer:** Cost per run and latency are tracked per step, ideally following the OpenTelemetry conventions for generative AI [13]. Overnight work uses batch pricing, and long, stable documents are cached. On Anthropic's API, batch processing is 50% off and cache reads cost about 10% of the base input price [14]. Every run has a token ceiling and every loop has a step cap.

**Warning sign:** Per-seat pricing with no view of inference cost underneath it.

### 9. Regulatory claims

**Ask:** What exactly are you claiming about compliance?

Listen carefully to the wording.
- "SR 11-7 compliant" is out of date. SR 11-7 and OCC 2011-12 were superseded on 17 April 2026 by SR 26-2 and OCC Bulletin 2026-13. The new guidance places generative and agentic AI outside its scope and is non-enforceable [15, 16].
- "Hallucination-free" should end the meeting. Legal research tools marketed along those lines hallucinated 17–33% of the time in a preregistered 2024 study [17].
- "EU AI Act compliant" deserves a follow-up question. After the Digital Omnibus, the Annex III high-risk obligations apply from 2 December 2027 [18], and whether a given system is in scope is a legal question, not a product feature.

**A good answer:** Specific statements of what the system does to support your obligations. That means prompt and output logs, model version tracking and human review, which FINRA's 2026 oversight report recommends [19]. For EU funds, it means information you can put into your DORA register of ICT third-party providers [20].

### 10. How the vendor is paid

**Ask:** What are we paying for?

**A good answer:** A defined capability, priced before build and accepted against a baseline measured before work started: cycle time, error rate, cost per file.

**Warning sign:** Open-ended time and materials, with success defined after the fact.

### Red flags at a glance

- No access to the evaluation set, or no evaluation set.
- Accuracy quoted as one number, or without model and date.
- The model does arithmetic that ends up in a report.
- No stored run records; "we can regenerate it".
- The model can send, pay or post on its own.
- Compliance claims tied to rescinded guidance, or to certifications nobody issues.

### What persists

Over the life of a system, the model underneath it will change several times. The harness is what persists: the checks, the approvals, the records and the tests that tell you whether the new model is as good as the old one. That is where your due diligence should go.

#### Sources

1. Harness engineering for coding agent users. martinfowler.com (Birgitta Böckeler, Thoughtworks), 2026-04-02. <https://martinfowler.com/articles/harness-engineering.html>
2. Harness engineering: leveraging Codex in an agent-first world. OpenAI, 2026-02-11. <https://openai.com/index/harness-engineering/>
3. Demystifying evals for AI agents. Anthropic, 2026-01-09. <https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents>
4. Model deprecations (Claude API docs). Anthropic, living document. <https://platform.claude.com/docs/en/about-claude/model-deprecations>
5. Deprecations (OpenAI API docs). OpenAI, living document. <https://developers.openai.com/api/docs/deprecations>
6. How Is ChatGPT's Behavior Changing Over Time? (Chen, Zaharia, Zou). Harvard Data Science Review 2024 (arXiv 2023), 2023-07-18. <https://arxiv.org/abs/2307.09009>
7. A postmortem of three recent issues. Anthropic, 2025-09-17. <https://www.anthropic.com/engineering/a-postmortem-of-three-recent-issues>
8. AI Evals: Everything You Need to Know (Evals FAQ). Hamel Husain and Shreya Shankar, page dated 2026-09-18 (modified 2026-09-21). <https://hamel.dev/blog/posts/evals-faq/>
9. Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena (Zheng et al.). NeurIPS 2023 Datasets and Benchmarks Track, 2023-06-09. <https://arxiv.org/abs/2306.05685>
10. Defeating Nondeterminism in LLM Inference (He). Thinking Machines Lab, 2025-09-10. <https://thinkingmachines.ai/blog/defeating-nondeterminism-in-llm-inference/>
11. 17 CFR 275.204-2 Books and records to be maintained by investment advisers. Cornell LII (text of SEC rule), current text. <https://www.law.cornell.edu/cfr/text/17/275.204-2>
12. 17 CFR 240.17a-4 Records to be preserved by certain exchange members, brokers and dealers. Cornell LII (text of SEC rule), current text. <https://www.law.cornell.edu/cfr/text/17/240.17a-4>
13. Semantic conventions for generative client AI spans (semantic-conventions-genai repo). OpenTelemetry, living document (status: Development). <https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/gen-ai/gen-ai-spans.md>
14. Models overview (Claude API docs). Anthropic, living document. <https://platform.claude.com/docs/en/about-claude/models/overview>
15. SR 26-2: Revised Guidance on Model Risk Management (letter and attachment PDF SR2602a1.pdf). Board of Governors of the Federal Reserve System, 2026-04-17. <https://www.federalreserve.gov/supervisionreg/srletters/SR2602.htm>
16. OCC Bulletin 2026-13: Model Risk Management: Revised Guidance. Office of the Comptroller of the Currency, 2026-04-17. <https://www.occ.gov/news-issuances/bulletins/2026/bulletin-2026-13.html>
17. Hallucination-Free? Assessing the Reliability of Leading AI Legal Research Tools (Magesh, Surani, Dahl, Suzgun, Manning, Ho). Journal of Empirical Legal Studies 2025 (arXiv 2024), 2024-05-30. <https://arxiv.org/abs/2405.20362>
18. Regulation (EU) 2026/1744 (Digital Omnibus on AI) - EUR-Lex OJ text (Art 1(27) application dates; Art 1(38) Art 50(2) transition). Publications Office of the EU / EUR-Lex, adopted 2026-07-08; OJ 2026-07-24. <https://eur-lex.europa.eu/eli/reg/2026/1744/oj/eng>
19. 2026 FINRA Annual Regulatory Oversight Report (PDF), GenAI section. FINRA, 2025-12. <https://www.finra.org/sites/default/files/2025-12/2026-annual-regulatory-oversight-report.pdf>
20. Digital Operational Resilience Act (DORA). ESMA, living page. <https://www.esma.europa.eu/esmas-activities/digital-finance-and-innovation/digital-operational-resilience-act-dora>

---

## 04. Chat is an input, not an interface

*Language is the fastest way to say what you want. It is a poor way to show a controller what a system did. Operations software needs both halves, and they call for different designs.*

Product · 6 min read · 1,331 words

The chat box became the default interface for AI products for good reasons. Everyone knows how to use it. You can arrive with a half-formed question and still get somewhere. And it has a built-in feedback loop: ask, read, refine, ask again. For exploratory work, it is hard to beat.

Operations work asks more of an interface than taking instructions. A controller needs to see the current state of things, compare today with yesterday, approve what should happen next, and leave a record that someone else can check later. A chat transcript does none of these well. The state is buried in scrollback. The system's interpretation of the request is invisible. Approvals are just more messages. And there is no clean way to put Tuesday's answer next to Monday's and see what changed.

The fix is not to abandon language. It is to separate the input from the state. Let people ask in words, then show the result as structured, editable state with its evidence attached. Here are four patterns that do that in fund and lending operations, and a note on where chat still wins.

### Pattern 1: Ask in words, see the query

An analyst types: "senior loans where leverage headroom is under 10% and the next certificate is due this month." The system translates the request into a structured filter and shows it as editable chips above a table: asset class is senior secured; headroom is below 10%; next compliance certificate due within the calendar month. The analyst can see exactly how the request was understood and fix it with a click if it was not.

Two things follow. The saved query becomes a definition, so tomorrow's run uses the same filter instead of a fresh interpretation of the same sentence. And because the result is a table, it can be sorted, exported, reconciled and compared, all things a paragraph of chat cannot do.

Ambiguity deserves the same treatment. "Large exposures" might mean commitment size or drawn balance, and "this month" might mean the calendar month or the reporting month. Rather than choosing silently, the system should ask one short clarifying question, or show both readings side by side and let the analyst pick. Each answer then becomes part of the firm's vocabulary, so that the next person who asks about large exposures gets the firm's definition without being asked again.

It is tempting to let the model write the database query directly. The evidence says to be careful. On the BIRD text-to-SQL benchmark over large, real databases, ChatGPT reached 40.08% execution accuracy against 92.96% for humans in 2023; the best 2026 leaderboard entry is 82.39% [1, 2]. The sturdier design is a constrained semantic layer: a vocabulary of defined business fields such as "headroom", "next test date" and "facility type", each mapped to tested SQL. The model chooses fields, operators and values. Code builds the query. A small, fast model is usually enough for this translation, which matters when the translation runs while someone is typing.

### Pattern 2: Exceptions that arrive with their evidence

Most of an operations team's day is exceptions. So rather than waiting to be asked, the system runs its checks on a schedule and delivers a queue. Each item states what failed, shows the evidence, proposes an explanation, and offers a small set of actions: accept, reassign, or reject with a reason.

A fictional example from loan operations: the agent notice for the Calder Ridge Software term loan shows $598,253.91 of interest for the period, but only half of it arrived in cash. The system classes the break as a PIK toggle, meaning half the interest was paid in kind and added to principal. It cites the election clause in the credit agreement and flags the knock-on effect on the fund's borrowing base. The analyst reviews the evidence and accepts the explanation. The acceptance is recorded under the analyst's name, and the booking happens in the loan system under their identity, not the model's.

Two design details matter more than they first appear.

First, show the source, not just the explanation. Explanations are persuasive, sometimes too persuasive. In a CHI 2021 study, AI explanations made people more likely to accept the AI's recommendation whether or not it was correct [3]. In a 2023 field experiment, consultants using GPT-4 on a task outside its capability were about 19 percentage points less likely to reach the right answer than those working without it [4]. A reviewer who sees the notice field, the ledger row and the clause side by side is checking evidence. A reviewer who sees only a fluent paragraph is checking prose.

Second, capture every decision as data. Each accept, reassign or reject, with its reason, becomes a labelled example for the evaluation set. The queue is a work surface and, at the same time, the best source of test cases the system will ever have.

### Pattern 3: Edits scoped to a selection, reviewed as a diff

Drafting investor letters in a chat window follows a familiar and slightly risky routine. Paste a paragraph in, describe a change, get a rewritten block back, paste it over the original, then reread everything because you cannot tell what else moved.

The better pattern keeps the model inside the document. The user selects a sentence, describes the change, and reviews the proposal as a tracked change in place. The model sees the selection, some surrounding context and the instruction, and returns only the replacement. Accept and reject are one click each. Because the edit is scoped, rejecting it costs nothing and the rest of the letter is untouched.

In financial drafting, one rule turns this from convenient into safe: every number in the text must bind to a calculation. Consider a sentence for a fictional fund: "Net IRR since inception was 11.8% (10.9% excluding the effect of the subscription facility)." Each figure resolves to a calculation ID over the approved NAV and cash-flow data. If the model introduces a number that does not resolve, the tracked change is flagged and the letter cannot be released until a person fixes it.

### Pattern 4: Approval surfaces where the consequential click lives

Some actions should happen only after a person has looked at exactly what will happen: releasing a capital call, posting an adjustment, sending a report outside the firm. The interface for these is not a conversation. It is an approval surface. It summarises the action (amounts per investor, destinations, dates), shows the evidence for each figure, and highlights differences from the last comparable event. Then it offers the execute button, which runs under the approver's identity and records their decision.

The model prepares everything on this screen. It never holds the button. Chat can sit alongside the screen for questions about the evidence ("why is this investor's share lower than last time?"), but the decision itself is a structured act with a structured record.

### Where chat still wins

Chat remains the right interface for work that has no fixed shape yet:

- exploring an unfamiliar data room during diligence;
- asking questions of an approved answer library when a DDQ arrives;
- drafting something from nothing;
- asking the system why it produced a particular result.

Even here, two habits help. Keep the transcript as part of the record. And when a conversation ends in an action, route the action through one of the patterns above rather than executing it from the chat.

### Five principles

1. **Separate what the user says from what the system does,** and always show the system's interpretation before it matters.
2. **Show state in structures people already trust:** tables, ledgers, tracked changes, approval summaries.
3. **Attach evidence to every figure,** and make the source one click away.
4. **Make disagreement cheap.** A one-click rejection with a reason is worth more than a thumbs-down icon.
5. **Treat decisions as data.** Every review action is a future test case.

The chat box won because it is easy to start with. Operations interfaces have a different job: they have to be easy to check.

#### Sources

1. Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs (BIRD) (Li et al.). NeurIPS 2023, 2023-05-04. <https://arxiv.org/abs/2305.03111>
2. BIRD-SQL leaderboard (execution accuracy; entries to 2026-09-07). BIRD benchmark team (HKU et al.), 2026-09-07. <https://bird-bench.github.io/>
3. Does the Whole Exceed its Parts? The Effect of AI Explanations on Complementary Team Performance (Bansal et al.). CHI 2021, 2020-06-26. <https://arxiv.org/abs/2006.14779>
4. Navigating the Jagged Technological Frontier: Field Experimental Evidence of the Effects of AI on Knowledge Worker Productivity and Quality (Dell'Acqua et al.). HBS Working Paper 24-013 (2023); Organization Science (2026; journal page HTTP 403 at re-check, not read), 2023-09. <https://mitsloan.mit.edu/sites/default/files/2023-10/SSRN-id4573321.pdf>

---

## 05. Draft, check, repeat: review loops that converge

*Pairing a model that drafts with a model that critiques can lift the quality of AI output. Without a defined bar, checks that run in code and a rule for stopping, the loop mostly burns tokens.*

Engineering · 6 min read · 1,397 words

A model's first draft is usually decent and rarely the best it could be. People close that gap by hand. They read the draft, find the worst problem, fix it, and read it again. Automating that routine is appealing, and it has a name: the evaluator–optimizer pattern, in which one model generates and another evaluates and returns feedback, in a loop. It is one of the workflow patterns in Anthropic's guide to building agents [1].

For operations teams, the obvious targets are drafting-heavy tasks: quarterly investor letters, portfolio commentary, DDQ answers, sections of a credit memo. The loop also fails in predictable ways. It optimises for the critic's taste rather than the reader's needs. It trades one problem for another. It never quite stops. And every pass costs money. Here is how to design one that converges on something you would actually send.

### Write the bar as yes/no checks

Start with what "good" means, and write it as a list of checks that are either met or not. Husain and Shankar recommend binary pass/fail criteria over rating scales for exactly this reason [2]. A critic that says "seven out of ten, could be more engaging" gives the drafter nothing to act on. A critic that says "the second paragraph states a return figure that does not resolve to an approved calculation" does.

For a quarterly letter, the bar might read:

- Every figure resolves to an approved calculation over the reporting snapshot.
- Every statement about what drove performance is supported by the attribution data.
- Every disclosure your policy requires is present, in approved wording.
- No forward-looking statement appears outside approved language.
- Length and tone sit within the house style guide.

### Put every checkable item in code

Look at that list again. Several items do not need a model to check them. Whether each number resolves to a calculation, whether required sections are present, whether banned phrases appear, whether the letter is within its length limit: code can check all of these deterministically, cheaply, and the same way every time.

So run those in code, and leave the critic model only the items code cannot judge: whether a claim about performance is supported by the attribution, whether an explanation is clear to a non-specialist reader. This has a second benefit. The smaller the critic's job, the easier it is to validate.

### Calibrate the critic before you trust it

Model judges are useful and biased. In the MT-Bench study (2023), GPT-4 agreed with human preferences 85% of the time, slightly above the 81% agreement between humans, but it gave the same verdict when the two answers were presented in the opposite order in only 65% of cases [3]. Criteria also drift. Researchers found that people refine their own grading criteria as they see more outputs, which means criteria written on day one are rarely the criteria you want on day thirty [4].

The practical response: have a named expert label a sample of drafts against the bar. Measure the critic's true-positive and true-negative rates against those labels before it gates anything [2]. Revisit the criteria each release, and re-measure the critic whenever they change.

### One change per pass, and keep it only if it helps

A drafter asked to "address the feedback" will often rewrite the whole thing, fixing one problem and quietly creating two others. Constrain it instead. Each pass fixes the highest-priority failed check and nothing else. After the pass, every check runs again. The change is kept only if the targeted check now passes and nothing that passed before has started failing. Otherwise the change is reverted and the drafter tries a different fix.

This is the same discipline good engineers use on performance work: one hypothesis per change, measured against a fixed benchmark, reverted if it does not help. It prevents the classic loop failure of improving the tone by dropping a disclosure.

### Stop on purpose

Every loop needs explicit stopping conditions, and the record should say which one fired:

1. **The bar is met.** All checks pass.
2. **The budget is spent.** A cap on passes, tokens or wall-clock time.
3. **Progress has stalled.** No check has moved from fail to pass in the last two passes.

Loops that stop on budget or on a stall go to a person with the failing checks listed. They are not silently shipped.

Budgets matter because structure costs money. Anthropic reported that a multi-agent harness it built for long-running application development cost about $200 over six hours, against $9 for a single-agent run [5]. That can be worth paying, but only if the quality gain is measured.

### A worked example

Take the performance paragraph of a quarterly letter for Larkspur Credit Opportunities Fund II, a fictional fund we use in examples.

- **Pass 1.** The drafter writes that net IRR since inception was 11.8%. The code checks pass on the number itself, but fail on a policy rule: this fund reports IRR both with and without the effect of its subscription facility, and the second figure is missing. The failure goes back to the drafter as a specific instruction.
- **Pass 2.** The drafter adds "(10.9% excluding the subscription facility)", bound to its calculation. All code checks pass. The critic flags one sentence: "returns benefited from lower default rates across the portfolio." Nothing in the attribution data supports it.
- **Pass 3.** The drafter replaces the claim with one the attribution does support. Every check passes, and the loop stops because the bar is met.

The record holds each draft, each check result and the reason the loop stopped. Then the letter goes to investor relations and compliance for approval, as it always would. The loop does not replace that approval. Its job is to hand the approvers a draft that already passes every mechanical and evidential check, so their time goes on judgement rather than proofreading.

### Measure the loop, not only the output

Useful numbers to track, by document type:

- the share of drafts that reach the bar;
- the average number of passes to get there, and the share that hit the budget cap;
- consistency: run the loop several times on the same input and check that every run converges to a passing draft;
- reviewer edits after the loop, which is the gap the loop has not closed;
- cost per draft that reaches the bar.

The fourth number is the most honest. If reviewers still rewrite a third of every letter, the bar is missing something, and the fix belongs in the checks rather than the prompts.

### Three ways loops go wrong

Even well-specified loops have characteristic failures, and it helps to watch for them by name.

- **Shared blind spots.** When the drafter and the critic are the same model with similar instructions, they tend to miss the same things. Give the critic a different role and different inputs. It should see the attribution data and the approved figures, not just the draft, so that it checks claims against evidence rather than against plausibility.
- **Oscillation.** Fixing one check breaks another, and the loop swings between two failing drafts. The keep-or-revert rule above stops this, and the stall condition catches what it misses.
- **Gaming the checks.** A drafter under pressure learns to satisfy a check literally rather than in spirit, for instance by burying a required disclosure where no reader will find it. Reviewer edits after the loop are the honest measure here, because people notice what checks do not.

### Where not to loop

Loops are for drafts and proposals. They are the wrong tool for anything that moves money or leaves the firm without a person approving it, and for calculations. If a number is wrong, a second model arguing with the first will not fix it reliably. Write the calculation in code, test it, and let the loop work on the words around it.

The same discipline travels well beyond letters: a capital account statement template checked against a layout checklist, a portfolio monitoring report made faster against a fixed benchmark while tests hold its figures steady, a DDQ answer set tightened against the approved library. The common thread is the same each time. Define the bar before starting. Measure the same way on every pass. Change one thing at a time. Keep only what improves. Stop deliberately.

A review loop is a small optimisation process, and like any optimisation it goes wherever the objective points. Most of the work is writing the objective carefully.

#### Sources

1. Building effective agents. Anthropic, 2024-12-19. <https://www.anthropic.com/engineering/building-effective-agents>
2. AI Evals: Everything You Need to Know (Evals FAQ). Hamel Husain and Shreya Shankar, page dated 2026-09-18 (modified 2026-09-21). <https://hamel.dev/blog/posts/evals-faq/>
3. Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena (Zheng et al.). NeurIPS 2023 Datasets and Benchmarks Track, 2023-06-09. <https://arxiv.org/abs/2306.05685>
4. Who Validates the Validators? Aligning LLM-Assisted Evaluation of LLM Outputs with Human Preferences (arXiv 2404.12272). Shankar, Zamfirescu-Pereira, Hartmann, Parameswaran, Arawjo, 2024-04-18. <https://arxiv.org/abs/2404.12272>
5. Harness design for long-running application development. Anthropic, 2026-03-24. <https://www.anthropic.com/engineering/harness-design-long-running-apps>

---

## 06. When the people who run the process can change the software

*Operators can now describe a tool and have a coding agent build it in an afternoon. The speed is real. In a regulated firm it needs a workshop, a gate and a record, or the afternoon's work becomes next year's audit finding.*

Strategy · 6 min read · 1,362 words

Something has shifted in the last two years. The people who run a process can now change the software that supports it. A fund controller describes a helper that matches administrator cash statements to expected capital call receipts. A coding agent writes it. It works, often on the first afternoon.

Some teams are going a step further and placing the coding agent next to the running system itself. A request typed into a chat window becomes a deployed change within minutes: no ticket, no queue, no release train. The person who noticed the problem asks for the fix, watches it ship and uses it the same hour.

We think this is one of the most useful things to happen to back-office software in a long time. We also think a regulated firm that adopts it without structure will regret it. Both views are worth taking seriously.

### Why the collapsed loop is so attractive

Traditional change management puts distance between the person who feels a problem and the person who fixes it. A reconciliation analyst notices that one administrator formats dates differently. That becomes a ticket, the ticket joins a backlog, and the fix arrives three sprints later, by which time the analyst has built a workaround in a spreadsheet.

When the fix can be requested in plain language and built in minutes, three good things happen. Tools evolve at the speed of the process rather than the speed of the IT calendar. The people with the most context specify the change directly, so less is lost in translation. And small annoyances actually get fixed, instead of accumulating into the manual workarounds that make operations fragile.

There is a quieter benefit too. If users see only the result and not the code, they can shape software without learning to write it. That widens who gets to improve a process.

### Why regulated firms should hesitate

Finance has seen this pattern before. Spreadsheets gave operators the power to build their own tools decades ago, and the industry has spent years managing the consequences under the heading of end-user computing risk. AI-built tools are end-user computing that writes itself, and they inherit every one of those risks, faster:

1. **Untested logic reaches the books.** A helper that computes accrued interest, built quickly and used in a NAV tie-out, spreads its error to every figure that depends on it.
2. **Access sprawls.** An agent that can change a production system needs production credentials. Put it next to production and it has them.
3. **The record goes missing.** Who asked for the change, what changed, who checked it? Supervisors expect answers. The SEC's examination priorities for fiscal 2026 include how firms supervise their use of AI, including in back-office operations [1]. FINRA's 2026 report recommends prompt and output logs, model version tracking and human review [2].
4. **Documents become an attack surface.** If the tools being changed read external documents, and the agent changing them can read those tools' inputs, text in a borrower package could end up steering a code change. Prompt injection is the top-ranked risk for LLM applications [3].
5. **Nobody owns the result.** A tool nobody fully understands, built by someone who has since changed roles, is a key-person risk with no key person.

### Three lanes: workshop, gate, production

The structure we recommend keeps the speed and removes most of the risk. It has three lanes.

**The workshop** is a complete working copy of the environment, with realistic synthetic data: a fictional fund universe with investors, commitments, loans and agreements that behave like the real thing. Operators can request changes freely here, and the coding agent can build, run and test with broad permissions. Nothing in the workshop can reach production data, production credentials or anyone outside the firm.

**The gate** is how a change moves from the workshop to production. It runs automated tests, the evaluation suite and security checks, and it collects the human reviews that the change's risk tier requires. For low-risk changes the gate is automatic and takes minutes. For high-risk changes it waits for people, as it should.

**Production** is pinned and monitored. Changes arrive only through the gate. Actions with consequences, such as releasing money or sending anything outside the firm, still run under a named approver's identity.

### Who can change what

The gate is only fast if it is proportionate. A sensible starting point:

| Change | Risk | Route to production |
|---|---|---|
| Report layout, column order, labels | Low | Automated checks only |
| Saved filters, views, alert thresholds that are not controls | Low to medium | Automated checks plus the process owner's sign-off |
| Wording in letter or notice templates | Medium | Compliance approval |
| Calculations: fees, allocations, ratios, accruals | High | Engineering review, unit tests against known cases, controller sign-off |
| Data connections and permissions | High | Engineering and security review |
| Anything that moves money or leaves the firm | Highest | Full change control and four-eyes approval |

Most requests from operators sit in the top two rows. For those, the collapsed loop survives almost intact: ask, try it in the workshop, and ship through an automated gate in minutes. The slower routes apply to the small number of changes that could move a number in a report or a payment, which is exactly where a second pair of eyes earns its cost.

### One change, end to end

Here is how a typical request moves through the three lanes. A fund controller notices that one administrator has started sending cash statements with dates in a different format, and the receipt-matching helper now misses those lines. She types a request describing the problem and attaches an example file.

In the workshop, the coding agent reproduces the failure against synthetic statements in the new format. It changes the parser and adds test cases for both formats. It then runs the full matching suite, including the awkward cases already in the synthetic universe: a short payment, a wire with the wrong reference, an investor paying two calls in one transfer.

Everything passes. But the change touches matching logic, which sits in the "calculations" row of the table above, so the gate does not deploy it automatically. An engineer reviews the diff and the test evidence, the controller confirms the behaviour against her example, and the change deploys that afternoon. Total elapsed time: hours, not sprints. Total risk added: a reviewed, tested change with its reasons on record.

### The record is the documentation

Every change that crosses the gate leaves a record:

- who asked, and in what words;
- the diff the agent produced;
- test and evaluation results, before and after;
- who reviewed it and who approved it;
- when it was deployed, and which version it replaced.

That record does two jobs. It answers the supervisory questions above. And it is the documentation that end-user tools never had. A year later, anyone can see why a tool behaves the way it does, because the reason is attached to the change that made it so.

### What it takes to build

The workshop only works if it is close enough to production that passing there means something. That takes engineering: the same schemas, the same integrations stubbed or sandboxed, synthetic data rich enough to include the awkward cases (an excused investor, a PIK election, an amended covenant definition), and an evaluation suite that runs in both places. It also takes feature flags and one-step rollback, so a change that slips through can be withdrawn as quickly as it arrived.

The workshop's agent never holds production credentials. The deploy step runs from the gate under a service identity that can only deploy what passed.

### Code is getting cheap. Protect what isn't.

When code can be regenerated in minutes, it stops being the durable asset. What lasts is the specification of what the tool must do, the tests and evaluation cases that prove it, and the record of each change. A firm that keeps those can rebuild any tool, switch coding agents, or change models without losing its footing. A firm that keeps only the code has kept the part that was easiest to replace.

Let the people who run the process shape their own tools. Make the path to production short, automatic where the risk is low, and impossible to skip.

#### Sources

1. Examination Priorities Fiscal Year 2026 (PDF). SEC Division of Examinations, 2025-11. <https://www.sec.gov/files/2026-exam-priorities.pdf>
2. 2026 FINRA Annual Regulatory Oversight Report (PDF), GenAI section. FINRA, 2025-12. <https://www.finra.org/sites/default/files/2025-12/2026-annual-regulatory-oversight-report.pdf>
3. LLM01:2025 Prompt Injection. OWASP GenAI Security Project, 2024-11. <https://genai.owasp.org/llmrisk/llm01-prompt-injection/>

---

## 07. Define done before you build

*Prompts drift and model runs vary. An ordered list of events, each with a proof that can be checked against the real system, gives an AI workflow a finish line that holds across rewrites, model changes and restarts.*

Engineering · 6 min read · 1,362 words

When AI builds a workflow, or runs one, "done" becomes slippery.

In a build driven by conversation, the specification lives in the messages. The first prompt carries the most context. Each later instruction, such as "fix the redirect" or "the totals are off by a cent", solves one problem and occasionally creates another. As the conversation grows, early decisions are summarised away. Nobody can say afterwards exactly what the system was asked to do.

Runs also vary. In one 2025 test, a thousand runs of the same prompt at temperature 0 produced 80 different completions [1]. And traditional requirements leave the hard details to human judgement. "Each investor receives a notice" says nothing about which allocation base applies, how rounding is handled, or what happens when an investor is excused. A human analyst fills those gaps from experience. A model fills them from probability.

The remedy is old-fashioned and effective. Before anything is built, write down the ordered list of events the system must produce, and attach to each event a proof that can be checked from outside the application. We call this an acceptance specification. The system, and whoever is building it, iterates until every proof passes. Nothing ships before then.

### The unit of proof

Across the fund and lending processes in our playbooks, one format carries the evidence. We call it the evidence line:

`source document · version · locator → value → test or tie-out → status → approver · timestamp`

Every event in an acceptance specification produces one or more evidence lines. The proofs come in a few recurring types:

- **Recompute:** the value is recalculated from cited inputs by tested code.
- **Tie-out:** the value matches a book of record within a stated tolerance.
- **Receipt:** a receiving system confirms delivery.
- **Match:** an external record, such as a bank statement line, is matched to the expected item.
- **Attestation:** a named person approved it, at a recorded time.

### A worked specification: one capital call

Take Call 07 for Aldercove Growth Fund III, a fictional fund we use in examples. Six investors, one of them excused from this investment under its side letter, and a total call of $18,984,375.00. The acceptance specification lists eleven events in order:

1. **Governing terms loaded.** The LPA and every side letter, each with its version. *Proof:* document hashes and register entries.
2. **Purpose classified.** Investment, fees or expenses, because each can use a different allocation base. *Proof:* purpose code and the clause that sets the base.
3. **Allocation computed.** Each investor's share on the correct base. *Proof:* the engine trace, with investor amounts summing to the call total to the cent under the stated rounding rule.
4. **Excuse applied.** The excused investor pays only its share of fees for this call. *Proof:* the side-letter clause and the investor's excuse election.
5. **Maker review.** *Proof:* reviewer identity and timestamp.
6. **Checker approval.** *Proof:* approver identity, which must differ from the maker's.
7. **Notices rendered.** Every figure in each notice is bound to the engine output. *Proof:* a number-binding check at 100%.
8. **Notices delivered.** *Proof:* a portal delivery receipt for each investor.
9. **Wires matched.** *Proof:* bank statement lines matched to each investor's amount.
10. **Exceptions opened.** Any short, late or unmatched payment becomes a case with an owner. *Proof:* case identifiers.
11. **Record sealed.** *Proof:* a stored hash of the complete run record.

Compare that with a typical test plan for the same process, which might check that "notices were sent". The specification checks that the right amount reached the right investor, that the right person approved it, and that the money that came back matches what was asked for.

### Who writes the specification

Specifications are best written jointly. The process owner knows what must happen, and the engineer knows what can be proven. One format that works well is to walk through the last three real instances of the process together, list every event that actually happened, and ask of each one: how would we know this happened correctly?

Where nobody can answer, you have found the first gap to fix. Often the gap is in the process, not the software. A step that nobody can prove today is a step that nobody is really controlling.

### Specifications accumulate edge cases

A specification is a versioned document that lives alongside the code, and it improves every time something goes wrong. Under the ILPA model LPA, an investor can claim an excuse up to five business days *after* the notice goes out [2]. The first time that happens in a live fund, the specification gains new events: the late election is recorded, the call is recomputed, revised notices go to the other investors within the caps the LPA allows, and the differences are reconciled.

From then on, every future build must handle a late excuse, and so must every model migration and every rewrite by a coding agent, or the specification fails. The same goes for the investor whose wire arrives with the wrong reference, and for the rounding cent that has to land somewhere.

This is the property that matters most. Code can now be rewritten cheaply and often. The specification survives the rewrite, and it carries every lesson the process has ever taught forward into the next version. A restart that would once have lost months of accumulated knowledge now loses only the code.

### Deterministic proofs first, judged proofs sparingly

Most proofs in a finance workflow are deterministic: sums, matches, receipts, identities, hashes. Prefer them wherever they exist, because they give the same answer every time.

Some qualities can only be judged. Does the rendered notice follow the approved template? Is the explanation of an exception clear to an investor? For these, use a model grader or a visual comparison, but validate it first against human labels, because graders have known biases [3]. Then pin the judged result when the input has not changed, so that grader noise cannot flip yesterday's pass into today's fail.

### What a specification catches that a demo will not

Here is an illustrative failure. A rebuilt workflow passes events 1 to 8. In a demo it looks finished: notices are generated, approved and delivered. But event 9 fails, because the matcher reads a reference field that the new investor portal no longer fills in, so no incoming wire can be matched to its call.

Without the specification, that failure surfaces weeks later, when the controller asks why every investor looks unpaid. With it, the build stops at event 9 and names the missing proof.

### From specification to acceptance

A specification defines done for a single case. Accepting a system for live use takes three more steps:

- **A shadow run.** The new workflow runs alongside the incumbent process for a full cycle, and the two sets of evidence lines are compared case by case.
- **Acceptance sampling for volume.** Where items are too numerous to check individually, sample them against a stated plan. Zero errors in a random sample of 299 items supports an error rate below 1% at 95% confidence. A sample of 149 supports below 2%, and 59 supports below 5%. These figures come from the standard binomial calculation.
- **Sign-off.** The business owner signs against thresholds agreed before the shadow run began, not after its results are in.

### Limits worth stating

Specifications do not solve everything, and it is better to say so.

- **Some proofs need scarce resources.** Real bank rails, real investor portals and real counterparties cannot always be exercised in testing. Sandboxes and test accounts help, but parity with production is never perfect.
- **The world moves.** An administrator changes its file format, a portal changes a field. A specification that passed in testing can fail in production, which is why the same checks keep running after go-live.
- **Writing good specifications is real work.** Ambiguous specifications produce ambiguous systems. One useful test is whether a new analyst could implement each event from its text alone.

The effort in AI delivery is moving upstream. Less of it goes into writing code and checking it by hand, and more goes into deciding, precisely, what done means at every step. The acceptance specification is where that decision lives, and it is likely to outlast every version of the code built against it.

#### Sources

1. Defeating Nondeterminism in LLM Inference (He). Thinking Machines Lab, 2025-09-10. <https://thinkingmachines.ai/blog/defeating-nondeterminism-in-llm-inference/>
2. ILPA Model Limited Partnership Agreement (Whole-of-Fund Waterfall), last updated October 2019. Institutional Limited Partners Association (ILPA), 2019-10. <https://ilpa.org/wp-content/uploads/2019/10/ILPA-Model-Limited-Partnership-Agreement-October-2019.pdf>
3. Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena (Zheng et al.). NeurIPS 2023 Datasets and Benchmarks Track, 2023-06-09. <https://arxiv.org/abs/2306.05685>

---

## 08. A workshop, not the vault

*AI systems stall when they cannot provision, test or verify their own work. Handing them production access is the wrong fix. Give them a complete environment of their own, and let only reviewed changes cross into yours.*

Engineering · 6 min read · 1,375 words

Anyone who has used a capable coding agent inside a financial firm will recognise the moment it stops.

"I've written the migration, but I don't have permission to run it against the database."

"I need credentials for the payments sandbox before I can test the wire file."

"I can't check the investor portal sign-up without an inbox that receives the verification email."

The agent wrote the code. It cannot provision what the code needs, deploy it, or prove that it works. So the work lands back on an engineer's desk, and much of the promised speed evaporates in a queue of small favours.

### Three kinds of block

The interruptions fall into three groups.

**Access.** Agent frameworks gate actions behind approval prompts, and firms keep credentials tightly scoped, for good reason. The result is a person clicking "allow" all afternoon, or an agent that simply cannot reach the service its code depends on.

**Infrastructure.** An agent can usually connect to services that already exist, but it cannot create new ones: a database branch for a schema change, a queue, a public endpoint for a webhook to call back to.

**Identity and counterparties.** Much of the software in fund operations deals with verified parties. Investor portals send verification codes. Payment providers check addresses. Administrators send files to known recipients. Testing these flows needs a working inbox, a phone that receives codes, and an account that clears a payment. An agent has none of them.

Each block ends one of two ways. Either the agent stops and asks for help, or it works around the gap and reports success on something it never verified. The second outcome is worse, because it looks like the first one succeeding.

### The wrong fix

The instinctive response is to widen the agent's access inside the real environment: give it the database role, the deploy token, the payments credentials. That trades one problem for a bigger one. The more an agent can touch in production, the more closely someone has to watch it, which defeats the point of having it. In a regulated firm it also collides with principles that exist for good reason: least privilege, separation of duties, and an audit trail that shows who could do what.

### The right fix: a complete workshop

The better answer is to give agents a complete environment of their own, built so that nothing they do there can reach production. We think of it as a workshop. It has five parts.

**1. Separate accounts for everything.** The workshop has its own cloud accounts, its own source-control organisation, its own CI, hosting and billing. There is no shared identity with production: no trust relationships, no shared credentials, no network path between the two.

**2. A synthetic universe.** Fictional funds, investors, borrowers and agreements that behave like real ones, including the awkward cases: an investor excused under a side letter, a borrower that elects PIK interest, a covenant definition changed by amendment. Keep every fictional entity in one registry, so the same fund behaves the same way in every test. Use identifiers that cannot collide with real ones, such as invalid check digits or reserved prefixes, and label any market rate used in samples as illustrative rather than as a fixing [1].

**3. Real tools in sandbox mode.** Payment providers' test modes. Bank statement files generated in standard formats from the synthetic ledger. A test instance of the investor portal. Mailboxes and phone numbers that can receive verification codes, drawn from a pool of pre-provisioned test identities that are leased to a run and returned afterwards.

**4. Full permissions inside.** Within the workshop, the agent can provision, deploy to staging and run end-to-end tests without asking. Any payment card carries a hard spending cap, and resources have quotas. The worst an agent can do here is waste a capped amount of money and a sandbox account.

**5. Complete logging.** Every action the agent takes in the workshop is recorded. That record is useful when something goes wrong, and it is the raw material for improving the agent's instructions and tools.

### Synthetic data has to earn its keep

A workshop is only as useful as its data. If the synthetic universe contains only clean cases, the agent will pass every test and still fail in production. Three habits keep synthetic data honest.

First, generate it from the registry of fictional entities, so that relationships hold: the same investor has the same commitment in the capital call test, the side-letter test and the reporting test.

Second, seed it from error analysis. Every class of failure found in real operations, such as a late excuse election, a partial PIK election or an administrator's new file format, gets a synthetic case that reproduces it. The synthetic universe should grow each time production teaches you something.

Third, check it periodically against reality. Compare the distribution of synthetic cases with the distribution of real ones by type, size and awkwardness, and top up the categories that are under-represented.

### The boundary is the security model

In this design, safety does not come from restricting what the agent can do in the workshop. It comes from making sure nothing it does there reaches production except through review.

- Code crosses into the production organisation only as a proposed change, which people choose to merge or not.
- Production credentials never exist in the workshop, not even in a variable nobody uses.
- In production, actions with consequences still run under a named approver's identity, as they would without any AI involved.
- Secrets in both environments are held in a vault, short-lived, rotated, and never written into prompts or logs [2].

### Inside the workshop, security still matters

A sealed workshop is not automatically a safe one. Agents in the workshop read documents, and some of those documents will be realistic copies of external material. Prompt injection, where text inside a document is crafted to redirect a model, is the top-ranked risk for LLM applications [3]. Simon Willison's "lethal trifecta" describes when it becomes dangerous: an agent with access to private data, exposure to untrusted content, and a channel to send data out [4]. The workshop has private data of its own, including its credentials.

The defences are architectural, and they are measurably effective:

- Readers of untrusted documents run without write tools or network egress.
- Tools are filtered to the minimum each task needs. In AgentDojo (2024), a least-privilege tool filter cut targeted attack success against GPT-4o agents from 47.7% to 7.5% [5].
- Where the stakes justify it, use capability-based designs. One such design, CaMeL, solved 77% of AgentDojo tasks with provable security against prompt injection, against 84% with no defence at all [6].

### Where the providers sit

For EU alternative investment fund managers and UCITS management companies, DORA has applied since 17 January 2025, and it brings ICT third-party providers into a register of information [7]. A workshop that holds only synthetic data keeps most of its tooling out of that conversation. That is another reason to keep real client data out of it entirely.

### What changes for the team

With a workshop in place, an agent can finish its loops. It builds a change, provisions what the change needs, deploys it to staging, runs the end-to-end test, fixes what fails, and opens a pull request with the evidence attached. The engineers' job shifts from provisioning and favours to reviewing evidence and deciding what to merge.

That shift is where most of the speed comes from. It is not that the agent types faster. It is that the agent no longer waits.

### Unblocked is not the same as correct

A warning to finish on. An agent that can deploy and test its own work can still build the wrong thing, and report success with complete confidence. Agents tend to verify exactly what they were asked to verify and nothing more. In a 2025 study of multi-agent systems, nearly a quarter of failures were verification failures [8]. If the definition of correct is vague, a self-verifying agent will happily satisfy the vague version.

That is a specification problem, not an access problem, and it needs its own answer. We describe ours in "Define done before you build".

Give agents a workshop with real tools and fake money. Keep the vault locked. Let only reviewed work through the door.

#### Sources

1. SOFR In Arrears Conventions for Syndicated Business Loans. Alternative Reference Rates Committee (Federal Reserve Bank of New York), 2020. <https://www.newyorkfed.org/medialibrary/Microsites/arrc/files/2020/ARRC_SOFR_Synd_Loan_Conventions.pdf>
2. Secrets Management Cheat Sheet. OWASP Cheat Sheet Series, living document. <https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html>
3. LLM01:2025 Prompt Injection. OWASP GenAI Security Project, 2024-11. <https://genai.owasp.org/llmrisk/llm01-prompt-injection/>
4. The lethal trifecta for AI agents. Simon Willison, 2025-06-16. <https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/>
5. AgentDojo: A Dynamic Environment to Evaluate Prompt Injection Attacks and Defenses for LLM Agents (Debenedetti et al.). NeurIPS 2024 Datasets and Benchmarks Track (per OpenReview), 2024-06-19. <https://arxiv.org/abs/2406.13352>
6. Defeating Prompt Injections by Design (CaMeL) (Debenedetti et al.). arXiv (Google DeepMind / ETH Zurich), 2025-03-24. <https://arxiv.org/abs/2503.18813>
7. Digital Operational Resilience Act (DORA). ESMA, living page. <https://www.esma.europa.eu/esmas-activities/digital-finance-and-innovation/digital-operational-resilience-act-dora>
8. Why Do Multi-Agent LLM Systems Fail? (MAST) (Cemri et al.). NeurIPS 2025 Datasets and Benchmarks Track (spotlight), 2025-03-17. <https://arxiv.org/abs/2503.13657>

---

## 09. Flexible where it's safe, fixed where it matters

*Composable tools let an AI system choose its own path through an investigation. A money path should have no path to choose. Designing the tool layer for credit and fund workflows starts with knowing which is which.*

Engineering · 6 min read · 1,344 words

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

---

## 10. What coding agents teach us about back-office automation

*Coding agents became genuinely useful before most enterprise agents did. The reasons are structural: a tight loop, tools that fail loudly, and an environment full of checks. Operations teams can borrow all three.*

Engineering · 6 min read · 1,394 words

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

---

## 11. Why document extraction pilots stall at 80% accuracy

*The demo reads the clean page. Production reads the scanned schedule, the amended definition and the table that breaks across two pages. The last fifth of the accuracy is where the work, and the risk, sits.*

Strategy · 6 min read · 1,355 words

The arc is familiar. A pilot extracts data from borrower reporting packages, or from administrator NAV packs, or from side letters. On the vendor's sample documents it is impressive. On the firm's own documents it climbs quickly to somewhere around 80% and then stops improving. Three months later the project sits in a folder called "phase 2".

The problem is not that 80% is bad. It is that the pilot was designed to prove the first 80%, and the remaining 20% needs different work, work the pilot never budgeted for. Here are seven reasons pilots stall, and what gets them over the line.

### 1. An average hides the field that matters

"80% accuracy" almost always means an average across every field in every document. Operations teams do not consume averages. A covenant test needs EBITDA, the add-backs and net debt, each exactly right. If borrower name, period end and currency are extracted correctly 99% of the time and the add-back total only 60% of the time, the average looks respectable and the covenant test is unusable.

Score each field separately, and set a threshold for each field based on what an error in it would cost. The field that feeds a breach determination deserves a different bar from the field that feeds a filing label.

### 2. Tables and scans

Financial documents are mostly tables, and tables remain the hard part of document parsing.

- In late-2024 tests, the best table-structure score among PDF parsers was about 79 out of 100, with GPT-4o at 72 [1].
- On financial-report pages in the same study, GPT-4o's text edit distance was about ten times that of the best dedicated parser: 0.348 against 0.033, where lower is better [1].
- In October 2025, even the best parsers still failed about one in six unit tests on olmOCR-Bench [2].

Spreadsheets are no easier. On synthetic private-equity portfolio spreadsheets, the best model tested in early 2026 answered 82.4% of questions correctly, but on the largest file, ten model configurations averaged 48.6% [3]. A pilot run on clean, digitally generated PDFs never meets the scanned schedule, the rotated page or the portfolio workbook with forty tabs.

### 3. Retrieval, not reasoning

When an answer is wrong, the model is often reasoning correctly about the wrong text. FinanceBench (November 2023) showed how much this matters. GPT-4-Turbo answered 19% of questions correctly when retrieving from one vector store shared across all filings, about 50% with a separate store per filing, and 85% when handed the right pages [4].

Pilots tend to index everything together, because it is quicker to set up. Production needs an index per agreement or reporting package, and evidence captured at page level, so that every figure can be traced to where it came from.

### 4. Definitions and amendments

The number on the page is not always the number the agreement means. An EBITDA figure on a compliance certificate may need an add-back cap applied before it can be tested. The cap may have changed in a later amendment. Interest may follow a day-count convention that makes a correct figure look like an error.

Credit agreements are long and densely cross-referenced. In the one public dataset of them, agreements average about 84,000 tokens, and even the best of sixteen models struggled with questions that required connecting several sections [5]. Extraction without a layer that resolves definitions and amendments produces figures that are correct according to the page and wrong according to the contract.

### 5. Consistency

A pilot is usually scored once. Production runs every day or every quarter, and has to give the same answer every time. The gap between the two can be large. In τ-bench, gpt-4o solved 61.2% of retail tasks in a single try but fewer than a quarter consistently across eight tries [6]. A system that is right on Monday and different on Tuesday fails a daily process even if its average accuracy never moves.

### 6. No path for the remaining 20%

This is the most common reason of all. The pilot measured the automated part, and nobody designed what happens to everything else.

Production needs a path for every item the system is not sure about:

- **validators** for types, ranges and cross-field arithmetic, plus a check that each extracted figure literally appears in the text it cites;
- **support checks** that confirm the cited source actually supports the value;
- **confidence bands** that decide what can be accepted automatically;
- **routing** of everything else to a named reviewer;
- **a review screen** that shows the source beside the value, so a check takes seconds;
- **sampling** of the automatically accepted items on a stated plan.

With that path in place, a system that accepts 80% automatically and routes 20% to quick, well-evidenced review processes 100% of the documents, and every figure carries evidence. Without it, 80% is a demo.

### 7. Nobody owns it after launch

Even a pilot that reaches production decays if nobody runs it. Models change underneath you. Between March and June 2023, GPT-4's accuracy on one reasoning task fell from 84.0% to 51.1% under the same API name [7]. In 2025, infrastructure bugs affected up to 16% of one production model's requests at the worst hour, with no change to the model at all [8]. Providers retire models on published schedules, with at least 60 days' notice at Anthropic [9].

Documents change too. An administrator adopts a new template, or a borrower's finance team switches accounting software. Without someone who owns the evaluation suite and watches accuracy week by week, the system slides back below 80% without anyone noticing.

### The last 20% is where the value is

There is a further reason to push through, and it is easy to miss. The first 80% of documents are usually the routine ones: clean certificates, standard notices, packs in the usual format. The remaining 20% is where the exceptions live. That is the borrower whose EBITDA needed an add-back cap, the notice with a PIK election, the NAV pack with a fee line that did not step down.

Those are the items that carry the risk, and they are the ones that consume experts' time today. A system that automates only the easy documents saves effort where it was least needed, and leaves the hard cases exactly as they were. The value of the programme depends on handling the hard 20% well. That need not mean automatically, but it does mean quickly, with the evidence assembled and the right reviewer looking at it.

That changes what a pilot should report. Beyond accuracy, ask:

- What share of the high-consequence items did the system handle correctly, or route to the right person?
- How long does a reviewer take to clear a routed item, with the evidence in front of them?
- How many automatically accepted items would a reviewer have changed?
- Which failure classes remain, and how large is each?

### What gets pilots over the line

None of this is exotic. It is engineering work that pilots skip:

1. **Scope by field and consequence.** Decide which fields matter, and what accuracy each one needs.
2. **Build a golden set from your own documents,** including the ugly ones. Have two people label it independently and measure their agreement.
3. **Do error analysis before writing more prompts.** Read around a hundred real traces, sort the failures into classes, and fix the biggest class first [10].
4. **Put calculations in code.** Extraction's job is to deliver typed, cited inputs to tested calculators.
5. **Design the review path as a product,** with routing, a review screen and a sampling plan.
6. **Measure consistency, not only accuracy.** Run each golden case several times.
7. **Shadow the current process** for a full cycle, comparing results case by case.
8. **Assign ownership** of the running system: the evaluation suite, model migrations and drift monitoring.

### A better way to read 80%

Eighty per cent is not failure. It is the point at which the easy documents are done and the system has shown you where the hard ones are. The mistake is treating it as the end of a pilot instead of the start of the engineering.

The firms that get to production are usually the ones that budgeted for the last 20% from the beginning.

#### Sources

1. OmniDocBench: Benchmarking Diverse PDF Document Parsing with Comprehensive Annotations (Ouyang et al.). CVPR 2025, 2024-12-10. <https://arxiv.org/abs/2412.07626>
2. olmOCR 2: Unit Test Rewards for Document OCR (Poznanski, Soldaini, Lo). arXiv (Allen Institute for AI), 2025-10-22. <https://arxiv.org/abs/2510.19817>
3. FinSheet-Bench: From Simple Lookups to Complex Reasoning, Where LLMs Break on Financial Spreadsheets (Ravnik et al.). arXiv, 2026-03-07. <https://arxiv.org/abs/2603.07316>
4. FinanceBench: A New Benchmark for Financial Question Answering (Islam, Kannappan, Kiela, Qian, Scherrer, Vidgen). arXiv (Patronus AI), 2023-11-20. <https://arxiv.org/abs/2311.11944>
5. KG-MuLQA: A Framework for KG-based Multi-Level QA Extraction and Long-Context LLM Evaluation (Tatarinov et al.). arXiv, 2025-05-18. <https://arxiv.org/abs/2505.12495>
6. tau-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains (Yao, Shinn, Razavi, Narasimhan). arXiv (Sierra), 2024-06-17. <https://arxiv.org/abs/2406.12045>
7. How Is ChatGPT's Behavior Changing Over Time? (Chen, Zaharia, Zou). Harvard Data Science Review 2024 (arXiv 2023), 2023-07-18. <https://arxiv.org/abs/2307.09009>
8. A postmortem of three recent issues. Anthropic, 2025-09-17. <https://www.anthropic.com/engineering/a-postmortem-of-three-recent-issues>
9. Model deprecations (Claude API docs). Anthropic, living document. <https://platform.claude.com/docs/en/about-claude/model-deprecations>
10. AI Evals: Everything You Need to Know (Evals FAQ). Hamel Husain and Shreya Shankar, page dated 2026-09-18 (modified 2026-09-21). <https://hamel.dev/blog/posts/evals-faq/>

---

## 12. Instrumenting a workflow before you automate it

*The best dataset for automating a back-office decision is the record of people making it. Most firms throw that record away. Capture it first, and the automation that follows will be cheaper, better tested and easier to justify.*

Operations · 6 min read · 1,341 words

Every automation business case contains a baseline, stated or not: this process takes the team so many hours a week and gets so much wrong. Usually that baseline is a guess. The automation is then measured against the guess, and the result is another guess.

Before automating anything, measure it. And while you are measuring, capture the decisions people make, because those decisions are the raw material for almost everything that follows: the tests, the training data if you need it, and the proof that the new system is better than the old one.

### Small decisions add up

A task that takes under a minute looks too small to matter. At volume, it is not.

Take an illustrative middle-office team that triages inbound messages from agent banks and fund administrators: payment notices, rate-setting notices, consent requests, statements, the occasional request to change bank details. Say 150 messages a day at 45 seconds each. That is nearly two hours a day, or roughly 470 hours a year, before counting the cost of switching in and out of other work every few minutes. None of it shows up in any management report, because nobody measures it.

The same pattern hides in covenant certificate intake, capital call receipt matching, DDQ routing and NAV pack queries. Each is a small decision repeated thousands of times.

### What to instrument

For each item that passes through a process, capture five things.

1. **Arrival.** When it arrived, from whom, in what format, and for which fund or facility. Timing matters because volume is rarely even. Compliance certificates, for example, typically arrive 45 to 60 days after quarter end [1], so a covenant team's workload peaks on a predictable calendar.
2. **Handling time.** From first opening to decision, including time spent waiting for someone else.
3. **The decision and its reason.** What the person decided, and why, recorded as a reason code and not only as free text.
4. **Exceptions and rework.** What bounced back, what was corrected later, and by whom.
5. **Handoffs.** Every time work changes hands, and how long it sat in between.

### An example: reason codes for inbound messages

Reason codes work best when they are few, do not overlap, and are tied to what happens next. For the message triage described above, a starting set might be:

| Code | Meaning | What happens next |
|---|---|---|
| PAY-INT | Interest payment notice | Match to expected interest in the loan system |
| PAY-PRIN | Principal repayment or prepayment notice | Update the expected balance and check prepayment terms |
| RATE-SET | Rate-setting notice | Check the base rate and fixing date against the facility terms |
| CONSENT | Consent, waiver or amendment request | Route to the deal team with the relevant clauses |
| STMT | Statement or report | File against the facility, and extract figures where required |
| BANK-CHG | Request to change payment details | Block, open a case and verify by call-back to a known contact |
| OTHER | None of the above | Route to a senior analyst, and review the code set monthly |

BANK-CHG deserves its own code even if it is rare. Business email compromise losses reported to the FBI reached $2.77bn in 2024 [2], and a request to change payment details should never be acted on from the message alone. A dedicated code makes these requests measurable, and it makes it easy to show that every one of them was verified through a separate channel.

### Decisions are labels

The most valuable output of instrumentation is a dataset of decisions. Each time an analyst classifies a message, accepts or rejects an explanation for a reconciliation break, or queries a figure on a certificate, they produce a labelled example: an input, the correct output, and a reason.

Most firms discard that example the moment it is made. The decision lives in an email reply, a spreadsheet cell or someone's memory. Capture it in a structured form instead, and three things become possible:

- **a golden set** for testing any automation against real cases;
- **training data**, if fine-tuning a model turns out to make sense;
- **a baseline error rate**, measured by how often decisions are later reversed or corrected.

### When a small model beats a big one

For a narrow, stable task with plenty of labelled history, such as triaging messages, classifying documents or assigning break classes, a small model fine-tuned on your own decisions can match or beat a general-purpose frontier model at a fraction of the cost and latency. The frontier model is a generalist. Your task follows your conventions, and your labels encode them.

Whether that holds for your task is an empirical question, so test it properly:

1. Export the labelled decisions, remove duplicates, and hold back a test set of 10–20% that no model sees during training.
2. Score a frontier model on the held-out set with a well-written prompt. That score is the bar to beat.
3. Fine-tune a smaller model on the rest, and score it on the same held-out set, class by class rather than as one average.
4. In production, show every prediction to a reviewer, feed corrections back as new labels, and retrain on a schedule.

There are costs to weigh. A fine-tuned model ties you to a provider's fine-tuning lifecycle. Small models can degrade quickly on inputs unlike their training data. And no model will be better than the labels it learned from. Sometimes the cheaper path is simply running the frontier model more efficiently. On Anthropic's API, for instance, batch processing for overnight work is 50% off, and cached reads of long, stable instructions cost about a tenth of the normal input price [3].

### Label quality bounds everything

A labelled dataset is only as good as the agreement behind it. Have two reviewers label the same sample independently and measure their agreement with Cohen's kappa, which corrects for agreement by chance. Values below 0.60 are commonly treated as inadequate [4]. We recommend reaching 0.80 before a label set is used to accept a system.

Where the reviewers disagree, send the case to a named decision-maker, and write their decision down as a rule [5]. Those written rules often turn out to be the most useful thing the exercise produces, because they capture tacit knowledge that lived only in experienced people's heads.

### A two-week instrumentation sprint

Instrumentation does not need to be a project of its own. Two weeks is usually enough to establish a baseline.

**Week one: map and capture.**
- Map the process: arrivals, steps, systems, handoffs.
- Add lightweight capture to the tools people already use: reason codes, timestamps, a shared log.
- Pull whatever history exists in email, tickets and spreadsheets.

**Week two: label and measure.**
- Sample around 200 historical items and have two reviewers label them independently.
- Compute the baseline: volume, cycle time, handling time, error and rework rate, and cost per item.
- Identify the decisions with the most volume and the clearest labels.

The output is a baseline sheet and a ranked list of automation candidates, each with its cost, its risk and its expected return.

### What a baseline makes possible

With a measured baseline, the rest of the programme becomes honest.

- **Business cases** compare the new system with the week before it arrived, not with a vendor's claim.
- **Acceptance thresholds** are agreed before the build, not after the results.
- **Monthly reporting** after launch uses the same metrics, measured the same way.
- **The golden set keeps growing,** because every reviewer decision in production is another labelled case.

### Common mistakes

- **Measuring only the happy path.** The exceptions are usually where the time goes.
- **Free-text reasons only.** They are impossible to analyse at volume. Use codes, with a free-text field alongside.
- **Measuring handling time but not waiting time.** Queues often matter more than effort.
- **Borrowing someone else's savings figures as your baseline.** For most back-office processes, the only published time-savings figures are vendor claims.
- **Letting people label their own work without a second reviewer.** Agreement has to be measured, not assumed.

### Define better before building it

Automation projects fail quietly when nobody can say what "better" means. Two weeks of instrumentation buys that definition, and it buys a dataset that makes the automation possible in the first place.

#### Sources

1. Financial Covenants in Private Credit Transactions. Sidley Austin LLP, 2026-03-24. <https://www.sidley.com/en/insights/newsupdates/2026/03/financial-covenants-in-private-credit-transactions>
2. 2024 IC3 Annual Report. FBI Internet Crime Complaint Center, 2025-04. <https://www.ic3.gov/AnnualReport/Reports/2024_IC3Report.pdf>
3. Models overview (Claude API docs). Anthropic, living document. <https://platform.claude.com/docs/en/about-claude/models/overview>
4. Interrater reliability: the kappa statistic (Biochemia Medica 22(3):276-282). McHugh, 2012. <https://pmc.ncbi.nlm.nih.gov/articles/PMC3900052/>
5. AI Evals: Everything You Need to Know (Evals FAQ). Hamel Husain and Shreya Shankar, page dated 2026-09-18 (modified 2026-09-21). <https://hamel.dev/blog/posts/evals-faq/>

---

## 13. Generated interfaces need schemas

*Models can now compose screens, reports and dashboards on request. In a regulated firm, the safe version is a model that fills a typed layout from an approved set of components, bound to reconciled data it never types itself.*

Engineering · 6 min read · 1,353 words

Ask for a view, get a view. Generative interfaces, where a model assembles a dashboard, a report section or a form in response to a request, are one of the more striking capabilities of the last two years.

For fund operations the appeal is obvious. An investor relations analyst types: "One-page Q2 summary of Fund II for the advisory committee, with the NAV bridge, net IRR with and without the subscription line, and the five largest positions." The page appears in seconds.

The risks are just as obvious. Numbers typed by a model. Formats that change from one request to the next. A disclosure quietly missing. A layout that breaks the brand, or fails accessibility checks. And no record of what was actually shown to whom.

None of these risks is a reason to avoid the capability. All of them are reasons to generate interfaces from schemas rather than from scratch.

### 1. A registry of approved components

Start with a small library of approved components, each with a typed schema. A plausible starting set for fund reporting:

| Component | What it holds |
|---|---|
| KPI tile | Label, calculation ID, format, optional comparison calculation |
| Table | Columns, each bound to a calculation or data field; a row source query |
| Trend chart | Series bound to time-series queries; axis formats |
| Evidence line | Source document, version, locator, value, test, status, approver |
| Commentary block | Text with bound figure slots, and a claim-check status per sentence |
| Disclosure block | A disclosure ID from the approved library, never free text |

The model can only choose from this registry. Anything outside it does not render. That one constraint removes most of the ways a generated page can go wrong.

### 2. The model outputs a layout, not a page

The model's output is a layout tree: sections, components and their properties, expressed as structured data. The renderer validates the tree against the schemas before drawing anything. An invalid layout is rejected with a specific error, and the model tries again or the request goes to a person.

Structured-output features in current model APIs guarantee that output conforms to a schema. They make no promise about the values inside it [1]. That gap is exactly why the next rule matters most.

### 3. Numbers are bound, never typed

The single most important rule of generated financial interfaces is that the model never writes a number. Every figure on the page is a reference to a calculation over a reconciled, approved data snapshot. The renderer resolves the reference and formats the result. If the model tries to place a literal number in a text slot, the validator flags it and the page cannot be released.

Take a fictional example. An advisory committee summary for Larkspur Credit Opportunities Fund II shows three tiles: NAV of $831.8m, TVPI of 1.21x and DPI of 0.34x. Each tile is bound to a calculation ID over the approved Q2 snapshot. Beneath them, a commentary block explains the quarter. Its figures are bound slots too, and each sentence carries a claim-check status showing whether the attribution data supports it. The model chose the arrangement and wrote the words. It did not produce a single number.

### 4. Mind the order of fields

A detail for engineers. When a model produces structured output, the order of fields affects the quality of its reasoning. In one 2024 study, GPT-3.5-Turbo in JSON mode placed the "answer" key before the "reason" key in 100% of responses on a reasoning task. Its reasoning was therefore written after it had already committed to an answer [2].

For layouts, put a short statement of intent before the component choices, so that the model states what the page is for before deciding what goes on it. Or plan the page in a separate step and generate the layout from the plan.

### 5. Change the node, not the page

When a user asks for a change, such as "swap the chart for a table" or "add IRR excluding the subscription line", regenerate only the part of the layout affected. Keep a versioned history of the layout, with a diff for each change, so a reviewer can see exactly what moved. Partial regeneration is faster and cheaper, and it avoids the unsettling experience of a whole page reshuffling because one tile changed.

### 6. Required components are not optional

Some elements must appear on every page of a given type: the as-of date, the data snapshot identifier, the basis of each performance figure (gross or net, with or without the subscription facility), and whatever disclosures your policies require. Encode these as layout rules. A page of type "advisory committee summary" must include a specified set of components. The validator enforces the rule, so the model cannot leave anything out, however the request is phrased.

### 7. Releasing a view is a separate act

Every generated page should also say which data it shows. Bind each page to a named, immutable data snapshot, and print the snapshot's identifier and as-of date on the page. If the underlying books are restated after the page was generated, the page does not quietly change. It is regenerated against the new snapshot, and the difference between the two versions can be shown to anyone who asks.

A generated view used internally can be ephemeral. Anything that leaves the firm is a document. It is frozen, versioned, approved by named people under your review policy, and stored with the hash of the data snapshot it was built from. The generative step makes drafting fast. It does not change what release requires.

### 8. Brand and accessibility come from the components

Because every page is composed from approved components, colour, typography, contrast, chart conventions and accessibility behaviour come from the components rather than from the model. Every generated page inherits them. Improving a component improves every page that uses it, which is how design systems are meant to work anyway.

### A worked request

Here is what the machinery looks like for the advisory committee request at the top of this piece. The model's first output is a layout like this one, shortened for reading:

```json
{
  "intent": "Advisory committee summary, Q2 2026, Fund II",
  "page_type": "advisory_committee_summary",
  "sections": [
    {"component": "kpi_row", "tiles": [
      {"label": "NAV", "calc": "fund2.nav.q2_2026"},
      {"label": "TVPI", "calc": "fund2.tvpi.q2_2026"},
      {"label": "DPI", "calc": "fund2.dpi.q2_2026"}]},
    {"component": "commentary",
     "text": "Net IRR since inception was {irr_net} ({irr_ex_facility} excluding the subscription facility).",
     "slots": {"irr_net": "fund2.irr_net.q2_2026",
               "irr_ex_facility": "fund2.irr_net_ex_sub.q2_2026"}},
    {"component": "table", "source": "fund2.top_positions.q2_2026", "limit": 5}
  ]
}
```

The validator returns two errors. This page type requires a disclosure block describing the basis of the performance figures, and it is missing. There is also no as-of component. The model adds both and resubmits, and the layout passes.

Every figure on the rendered page now comes from a calculation reference. The only numbers the model wrote itself are the five-row limit and the dates inside the identifiers. A reviewer approving the page is therefore checking the story and the arrangement, because the figures were never the model's to get wrong.

### Where fine-tuning fits

Teaching a smaller model to produce your layout schema reliably is a reasonable fine-tuning target. The output space is narrow, the schema is fixed, and training examples can be generated from the component library itself and validated mechanically, every one of them. It is not a requirement. A capable general model with schema-constrained output may do the job well enough. Decide on evidence: compare candidates on the measures below, using the same set of real requests.

### What to measure

- **First-attempt validity:** the share of layouts that pass schema validation first time.
- **Binding rate:** the share of figures bound to calculations. The target is 100%.
- **Required-component compliance:** also 100%, enforced by the validator and monitored anyway.
- **Reviewer edit rate:** how much people change generated pages before approving them.
- **Time to an approved view:** from request to sign-off.

The first two tell you whether the machinery works. The last two tell you whether it is worth having.

### The principle

Generated interfaces are safe when the model's freedom lies in the arrangement, not in the facts. Let it choose the shape of the page, the order of the story and the words that connect the figures. Never let it choose the figures.

#### Sources

1. Structured outputs (Claude API docs). Anthropic, living document. <https://platform.claude.com/docs/en/build-with-claude/structured-outputs>
2. Let Me Speak Freely? A Study on the Impact of Format Restrictions on Performance of Large Language Models (Tam et al.). EMNLP 2024 Industry Track, 2024-08-05. <https://arxiv.org/abs/2408.02442>

---

## 14. Many lanes, one production

*AI features change prompts, data, tools and model versions at the same time. Shared staging turns every change into a queue. Give each engineer a complete lane of their own, and make the gate into production the only thing they share.*

Engineering · 6 min read · 1,328 words

The classic environment ladder of development, staging and production assumes two things: that most changes are code, and that most changes are independent of each other. AI delivery breaks both assumptions.

A single AI feature can touch a prompt, an extraction schema, a database table, a tool definition, an evaluation set and a model version, all at once. When two engineers work on different features in one shared staging environment, they collide constantly. One engineer's schema migration breaks the other's tests. Prompt versions overwrite each other. Long evaluation runs compete for the same fixtures and their results get mixed up. And somebody is always asking who is using staging this afternoon.

### Where shared staging hurts AI work in particular

Some of the friction is specific to the kind of systems we build for fund and lending operations.

- **Callbacks need stable addresses.** Payment provider sandboxes, investor portal callbacks, inbound email processing and sign-in redirects all send data to a fixed URL. Per-commit preview deployments get a new URL on every push. Shared staging has exactly one URL for everyone.
- **Schema changes collide.** Adding columns to hold the source locator for every extracted figure is a sensible change that breaks every other feature's fixtures in a shared database.
- **Prompt and model versions collide.** Two people testing different prompt versions against the same deployment cannot tell whose change produced which result.
- **Evaluation runs compete.** A full golden-set run can take a while. Two in parallel against shared state produce results nobody can trust.

### A complete lane for each engineer

The alternative is to give each engineer a complete, isolated lane. Each lane has:

- a local environment, plus a cloud staging deployment at a stable personal URL, so that callbacks always know where to go;
- its own database branch, seeded from the synthetic fund universe, with migrations applied independently of everyone else's;
- its own secrets, issued from a vault and valid only against sandbox providers;
- its own namespace in the prompt registry, so prompt versions never collide;
- its own sandbox registrations with the payment provider, the investor portal and the email service.

Modern infrastructure makes most of this cheap to set up: database branching, per-branch deployments, secrets managers that sync configuration into each environment, and tunnelling services with reserved domains for local work. The main cost is the automation that creates and tears down lanes, and that is worth writing once.

### Creating a lane, step by step

Lanes should be created by a script, not a ticket. A typical sequence:

1. Create a database branch from the template schema, and seed it with the current version of the synthetic universe.
2. Issue sandbox-only secrets from the vault, with an expiry.
3. Deploy the engineer's branch to a staging environment at their personal URL.
4. Register that URL in each sandbox provider's webhook settings.
5. Create the engineer's namespace in the prompt registry, copied from the current release.
6. Run the smoke tests and the security cases.
7. Tear the lane down automatically when the branch merges, or after a set period without activity.

If creating a lane takes more than a few minutes, engineers will start sharing them, and the collisions come back.

### Common objections

**"Lanes will drift from production."** They will, which is why lanes are rebuilt often from the current release template, and why the gate, not the lane, is the final test.

**"It costs too much."** Most lanes sit idle most of the time. Scale them to zero when idle, and tear them down on merge.

**"Our database cannot branch."** Seeding a fresh schema from the synthetic universe on demand gives most of the same isolation. It is slower, but still far better than sharing.

### What stays shared

Isolation is only useful if the right things stay common to everyone:

- **the golden set and evaluation harness**, versioned, so every lane tests against the same cases;
- **the synthetic universe registry**, one source of fictional funds, investors and borrowers, so that a given fund behaves the same way in every lane;
- **the release gate**;
- **production.**

### The gate is the only shared path

Every change reaches production through the same gate, whichever lane it came from. The gate checks:

1. **Regression evaluations.** The golden set passes at the agreed thresholds. Anthropic's guidance distinguishes regression suites, which should pass at close to 100%, from capability evaluations, which measure progress on new behaviour [1].
2. **Capability evaluations.** The new behaviour is measured and recorded.
3. **Security tests.** Red-team cases with instructions hidden in documents confirm that injected text is treated as data, flagged and routed to review [2].
4. **Unit and contract tests** for every tool and calculator.
5. **Review.** An engineer reviews the change and its evidence. The process owner signs off any change that affects outputs.
6. **Record.** Prompt versions, model identifiers, schema versions and evaluation results are stored with the release.

With a fortnightly release rhythm, lanes let many changes arrive at the gate ready at the same time, and one broken feature no longer holds up the rest of the release.

### Review by using, not only by reading

Because each lane has a stable URL and working sandbox integrations, reviewers can use a change as well as read it. They can open the lane's investor portal, trigger a test capital call for a fictional fund, watch the payment callback arrive and inspect the evidence line it produces. Reading a diff catches problems in the code. Using the lane catches problems in the product.

Give reviewers a short script for each change: the fictional fund to use, the steps to take, and the evidence they should expect to see at the end. A reviewer who follows the script and gets a different result has found something worth knowing, whatever the diff looked like.

This matters more as coding agents write more of the code. A diff of several hundred generated lines is hard to review line by line. A working flow with its evidence attached is not.

### Model migrations start in a lane

A new model snapshot is tested in a lane first. That means running the full golden set, replaying recent inputs from the synthetic universe or an anonymised evaluation store, and comparing the new snapshot's output field by field with the current one's.

If it passes, the candidate moves to a shadow run in production for a full business cycle, then to a canary: one fund or one desk running on the new snapshot against an unchanged control [3]. Only then does it replace the old version everywhere. Providers give notice before retiring a model, at least 60 days at Anthropic [4] and at least six months for generally available models at OpenAI [5]. Plan migrations well inside those windows, because a migration that has to be rushed is a migration that skips steps.

### Data and secrets discipline

Two rules keep lanes safe.

**No production data in lanes.** Lanes run on the synthetic universe, which should be rich enough to include the awkward cases: excused investors, PIK elections, amended definitions, late wires. Use identifiers that cannot match real entities. If anonymised production samples are needed for evaluation, keep them in a controlled evaluation store, not in any lane.

**Secrets live in a vault.** They are short-lived, rotated, and never written into prompts or logs [6]. Each lane's credentials work only against sandboxes, so a leaked lane secret opens nothing that matters.

### What it costs and what it buys

Lanes cost some infrastructure, most of it idle most of the time. They cost the automation to create and destroy them, and ongoing care of the synthetic data.

In return, engineers work in parallel without coordinating, reviews are faster and more realistic, model migrations are rehearsed before they matter, and releases stop being held hostage by the one feature that is not ready. Above all, production only ever receives changes that came through the gate.

The number of places where work happens should grow with the team. The number of paths into production should stay at one.

#### Sources

1. Demystifying evals for AI agents. Anthropic, 2026-01-09. <https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents>
2. LLM01:2025 Prompt Injection. OWASP GenAI Security Project, 2024-11. <https://genai.owasp.org/llmrisk/llm01-prompt-injection/>
3. Canarying Releases (Site Reliability Workbook). Google, 2018. <https://sre.google/workbook/canarying-releases/>
4. Model deprecations (Claude API docs). Anthropic, living document. <https://platform.claude.com/docs/en/about-claude/model-deprecations>
5. Deprecations (OpenAI API docs). OpenAI, living document. <https://developers.openai.com/api/docs/deprecations>
6. Secrets Management Cheat Sheet. OWASP Cheat Sheet Series, living document. <https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html>

---

## 15. When reading is nearly free

*The cost of having a model read a document keeps falling. In fund operations, the constraint is moving from how much can be read to how much can be verified and signed. Plan for that shift now.*

Strategy · 6 min read · 1,292 words

For most of the history of fund operations, reading was the bottleneck. Somebody had to read the compliance certificate, the side letter, the agent notice and the NAV pack. Reading was expensive, so firms sampled. They tested some covenants deeply and others lightly. They checked some lines closely. They re-read side letters when they remembered to.

The economics of reading are changing. Model capability keeps rising, and the cost of having a model read a page keeps falling, through competition between providers, smaller models that are good enough for narrow tasks, and pricing features that reward exactly the patterns operations work produces. On Anthropic's API, for example, batch processing for work that can wait overnight is 50% off, and cached reads of long, stable documents cost about a tenth of the normal input price [1]. A credit agreement that is read against every certificate for five years is precisely the kind of document caching was made for.

So the question for leaders is not whether reading gets cheaper. It is what should change when it does.

### What becomes possible: read everything, every time

Sampling was always a response to cost. When cost falls, coverage can rise:

- **Every compliance certificate recomputed** from the credit agreement's own definitions, not only for the borrowers on the watch list.
- **Every agent notice matched** to the loan system every day, with every break classified.
- **Every side letter checked against every event** it could apply to: each capital call, each distribution, each report that goes out.
- **Every figure in every investor letter traced** to its calculation before release.
- **Every DDQ answer re-validated** against the latest approved answer library, rather than copied from last year's response.

Each of these is a real control improvement. None of them was affordable when every page needed a person.

### What does not get cheaper

Four things stay expensive, and they become the new constraints.

**Verification.** Every output still has to be confirmed. Where the check is deterministic, such as a tie-out, a recomputation or a match to a bank statement, it can be automated and made cheap as well. Where it needs judgement, it cannot.

**Judgement itself.** Interpreting an ambiguous clause, deciding whether to grant a waiver, choosing when to call a borrower. These stay with people, and they should.

**Accountability.** Somebody still signs. Anything that moves money or leaves the firm still needs a named approver, and supervisors are paying attention. The SEC's examination priorities for fiscal 2026 include how firms supervise their use of AI, including in back-office operations [2].

**Reviewer attention.** This is the one that catches firms out. Reading more produces more exceptions. If coverage rises tenfold and review capacity does not, one of two things happens: the queue grows until it is ignored, or reviewers start approving without looking. Over-reliance on AI output is a documented risk. In a 2023 field experiment, consultants using GPT-4 on a task outside its capability were about 19 percentage points less likely to reach the right answer than those working without it [3].

### An illustration: covenant coverage

Consider an illustrative direct lender with 120 borrowers that report quarterly. Today its analysts check every certificate at a basic level, but recompute from the agreement's own definitions for perhaps 30 names on the watch list. With cheap reading, all 120 can be recomputed from their definitions every quarter.

Suppose full recomputation raises an average of 1.5 items per certificate that need a person to look at them. That might be an add-back that exceeds its cap, a figure that does not tie to the financial statements, or a definition changed by amendment. That is 180 items a quarter. At 12 minutes each, with the evidence already assembled, it comes to 36 hours of analyst review, concentrated in the weeks after the certificates arrive.

That is manageable if it is planned for. It becomes a problem only when nobody planned for it, because it lands on top of the existing work in the busiest weeks of the quarter. The figures here are illustrative, not measured, but the shape is general: more coverage means more exceptions, and the plan has to include the people who will clear them.

### Design for review capacity, not reading capacity

When reading is cheap, the design problem moves to the review queue.

- **Route by evidence.** Accept automatically only the items that pass their validators and a source-support check, within confidence thresholds set on your own golden set. Everything else goes to a named reviewer.
- **Measure the queue.** Track arrivals against review capacity, how often the system declines to decide, and how often reviewers override it.
- **Sample what is accepted automatically,** on a stated plan. Zero errors in a random sample of 299 accepted items supports an error rate below 1% at 95% confidence.
- **Prioritise by consequence.** A possible covenant breach comes before a formatting query.
- **Treat false alarms as a cost.** Every unnecessary exception consumes the scarcest resource in the process. Improving the precision of alerts is as valuable as improving their recall.

### Be honest about cadence

Cheap reading invites talk of "real-time" operations. The data does not always cooperate. Compliance certificates typically arrive 45 to 60 days after quarter end [4], so no system can test a quarter's covenants before the certificate exists. The honest promise is testing within days of the package arriving, well before any cure window closes. That is still a large improvement on waiting for an analyst to get to it.

Where data arrives daily, as agent notices and cash movements do, monitoring can be daily. Where it arrives quarterly, the gain is depth and speed once it lands, not continuous monitoring.

### Deciding where the model runs

As reading gets cheaper, some firms will consider running open-weight models on their own infrastructure. The trade-offs are real on both sides.

- **Control.** Data stays in-house, and model versions change only when you decide.
- **Stability.** Hosted models retire on the provider's schedule, with at least 60 days' notice at Anthropic, for example [5]. They can also change behaviour under the same name: between March and June 2023, GPT-4's accuracy on one reasoning task fell from 84.0% to 51.1% [6]. Self-hosting fixes the version, though your own infrastructure can still introduce differences.
- **Cost and capability.** Hardware, operations and engineering time are not free, and the gap to frontier models can matter on the hardest documents.
- **Regulation.** For EU managers, hosted model providers belong in the DORA register of ICT third-party providers [7].

Whichever you choose, keep the harness portable: pinned versions, the evaluation suite and the run records should all survive a change of model or host.

### The unit economics change

When reading costs little, the economics of an operations process stop being measured in people-hours per document. The useful measures become:

- **coverage:** the share of documents or items processed at all;
- **automatic acceptance rate,** reported together with its sampled error rate;
- **exceptions per hundred items,** and review minutes per exception;
- **time from data arrival to a verified result;**
- **cost per verified item,** with inference and review both included.

### A planning checklist

1. List the processes where you sample today because reading is expensive, and estimate what full coverage would be worth.
2. For each one, identify the deterministic checks that would verify the output, and build those first.
3. Size review capacity for the exception volume that full coverage will create.
4. Set cadences that match when the data actually arrives.
5. Decide where models run, and how versions are pinned and migrated.
6. Agree the metrics above with the business before anything is built.

The firms that gain most from cheap reading will not be the ones that read the most. They will be the ones that can verify what was read, and act on it with evidence, at the speed the documents now allow.

#### Sources

1. Models overview (Claude API docs). Anthropic, living document. <https://platform.claude.com/docs/en/about-claude/models/overview>
2. Examination Priorities Fiscal Year 2026 (PDF). SEC Division of Examinations, 2025-11. <https://www.sec.gov/files/2026-exam-priorities.pdf>
3. Navigating the Jagged Technological Frontier: Field Experimental Evidence of the Effects of AI on Knowledge Worker Productivity and Quality (Dell'Acqua et al.). HBS Working Paper 24-013 (2023); Organization Science (2026; journal page HTTP 403 at re-check, not read), 2023-09. <https://mitsloan.mit.edu/sites/default/files/2023-10/SSRN-id4573321.pdf>
4. Financial Covenants in Private Credit Transactions. Sidley Austin LLP, 2026-03-24. <https://www.sidley.com/en/insights/newsupdates/2026/03/financial-covenants-in-private-credit-transactions>
5. Model deprecations (Claude API docs). Anthropic, living document. <https://platform.claude.com/docs/en/about-claude/model-deprecations>
6. How Is ChatGPT's Behavior Changing Over Time? (Chen, Zaharia, Zou). Harvard Data Science Review 2024 (arXiv 2023), 2023-07-18. <https://arxiv.org/abs/2307.09009>
7. Digital Operational Resilience Act (DORA). ESMA, living page. <https://www.esma.europa.eu/esmas-activities/digital-finance-and-innovation/digital-operational-resilience-act-dora>

---

## Part 3: All sources cited

Source IDs match the Playbook Research pack's `sources.csv`.

| ID | Source | Cited in |
|---|---|---|
| AS005 | Financial Covenants in Private Credit Transactions (Sidley Austin LLP, 2026-03-24) <https://www.sidley.com/en/insights/newsupdates/2026/03/financial-covenants-in-private-credit-transactions> | 12, 15 |
| AS011 | First Amendment to Credit Agreement with conformed Credit Agreement (Firefly Aerospace Inc. / Wells Fargo Bank, N.A. as administrative agent), Exhibit 10.1 (SEC EDGAR (Firefly Aerospace 8-K), 2025-11-07) <https://www.sec.gov/Archives/edgar/data/1860160/000119312525274198/d31146dex101.htm> | 01 |
| AS012 | First Amendment to Financing Agreement with conformed Financing Agreement and Exhibit E Form of Compliance Certificate (Authentic Brands LLC et al. / Blue Torch Finance LLC), Exhibit 10.1 (SEC EDGAR (BRC Inc. 10-Q), 2025-06-09) <https://www.sec.gov/Archives/edgar/data/1891101/000189110125000018/brcincq2fy2025-ex101xfirst.htm> | 01 |
| AS040 | SOFR In Arrears Conventions for Syndicated Business Loans (Alternative Reference Rates Committee (Federal Reserve Bank of New York), 2020) <https://www.newyorkfed.org/medialibrary/Microsites/arrc/files/2020/ARRC_SOFR_Synd_Loan_Conventions.pdf> | 08 |
| BS005 | ILPA Model Limited Partnership Agreement (Whole-of-Fund Waterfall), last updated October 2019 (Institutional Limited Partners Association (ILPA), 2019-10) <https://ilpa.org/wp-content/uploads/2019/10/ILPA-Model-Limited-Partnership-Agreement-October-2019.pdf> | 07 |
| FS001 | FinanceBench: A New Benchmark for Financial Question Answering (Islam, Kannappan, Kiela, Qian, Scherrer, Vidgen) (arXiv (Patronus AI), 2023-11-20) <https://arxiv.org/abs/2311.11944> | 01, 11 |
| FS011 | FinSheet-Bench: From Simple Lookups to Complex Reasoning, Where LLMs Break on Financial Spreadsheets (Ravnik et al.) (arXiv, 2026-03-07) <https://arxiv.org/abs/2603.07316> | 11 |
| FS012 | KG-MuLQA: A Framework for KG-based Multi-Level QA Extraction and Long-Context LLM Evaluation (Tatarinov et al.) (arXiv, 2025-05-18) <https://arxiv.org/abs/2505.12495> | 01, 11 |
| FS020 | OmniDocBench: Benchmarking Diverse PDF Document Parsing with Comprehensive Annotations (Ouyang et al.) (CVPR 2025, 2024-12-10) <https://arxiv.org/abs/2412.07626> | 01, 11 |
| FS022 | olmOCR 2: Unit Test Rewards for Document OCR (Poznanski, Soldaini, Lo) (arXiv (Allen Institute for AI), 2025-10-22) <https://arxiv.org/abs/2510.19817> | 01, 11 |
| FS025 | Lost in the Middle: How Language Models Use Long Contexts (Liu et al.) (TACL 2024, 2023-07-06) <https://arxiv.org/abs/2307.03172> | 01 |
| FS026 | RULER: What's the Real Context Size of Your Long-Context Language Models? (Hsieh et al.) (COLM 2024, 2024-04-09) <https://arxiv.org/abs/2404.06654> | 01 |
| FS027 | NoLiMa: Long-Context Evaluation Beyond Literal Matching (Modarressi et al.) (ICML 2025, 2025-02-07) <https://arxiv.org/abs/2502.05167> | 01 |
| FS039 | Hallucination-Free? Assessing the Reliability of Leading AI Legal Research Tools (Magesh, Surani, Dahl, Suzgun, Manning, Ho) (Journal of Empirical Legal Studies 2025 (arXiv 2024), 2024-05-30) <https://arxiv.org/abs/2405.20362> | 03 |
| FS050 | Program of Thoughts Prompting: Disentangling Computation from Reasoning for Numerical Reasoning Tasks (Chen, Ma, Wang, Cohen) (TMLR 2023, 2022-11-22) <https://arxiv.org/abs/2211.12588> | 02 |
| FS055 | Can LLM Already Serve as A Database Interface? A BIg Bench for Large-Scale Database Grounded Text-to-SQLs (BIRD) (Li et al.) (NeurIPS 2023, 2023-05-04) <https://arxiv.org/abs/2305.03111> | 04 |
| FS056 | BIRD-SQL leaderboard (execution accuracy; entries to 2026-09-07) (BIRD benchmark team (HKU et al.), 2026-09-07) <https://bird-bench.github.io/> | 04 |
| FS059 | GSM-Symbolic: Understanding the Limitations of Mathematical Reasoning in Large Language Models (Mirzadeh et al.) (ICLR 2025, 2024-10-07) <https://arxiv.org/abs/2410.05229> | 02, 09 |
| FS060 | Let Me Speak Freely? A Study on the Impact of Format Restrictions on Performance of Large Language Models (Tam et al.) (EMNLP 2024 Industry Track, 2024-08-05) <https://arxiv.org/abs/2408.02442> | 13 |
| FS064 | Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena (Zheng et al.) (NeurIPS 2023 Datasets and Benchmarks Track, 2023-06-09) <https://arxiv.org/abs/2306.05685> | 03, 05, 07 |
| FS079 | tau-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains (Yao, Shinn, Razavi, Narasimhan) (arXiv (Sierra), 2024-06-17) <https://arxiv.org/abs/2406.12045> | 01, 09, 11 |
| FS083 | Task-completion time horizons, Time Horizon 1.1 data (benchmark_results_1_1.yaml; page last updated 2026-05-08) (METR, 2026-05-08) <https://metr.org/time-horizons/> | 10 |
| FS085 | Why Do Multi-Agent LLM Systems Fail? (MAST) (Cemri et al.) (NeurIPS 2025 Datasets and Benchmarks Track (spotlight), 2025-03-17) <https://arxiv.org/abs/2503.13657> | 08, 10 |
| FS091 | AgentDojo: A Dynamic Environment to Evaluate Prompt Injection Attacks and Defenses for LLM Agents (Debenedetti et al.) (NeurIPS 2024 Datasets and Benchmarks Track (per OpenReview), 2024-06-19) <https://arxiv.org/abs/2406.13352> | 02, 08 |
| FS093 | Defeating Prompt Injections by Design (CaMeL) (Debenedetti et al.) (arXiv (Google DeepMind / ETH Zurich), 2025-03-24) <https://arxiv.org/abs/2503.18813> | 08 |
| FS099 | Navigating the Jagged Technological Frontier: Field Experimental Evidence of the Effects of AI on Knowledge Worker Productivity and Quality (Dell'Acqua et al.) (HBS Working Paper 24-013 (2023); Organization Science (2026; journal page HTTP 403 at re-check, not read), 2023-09) <https://mitsloan.mit.edu/sites/default/files/2023-10/SSRN-id4573321.pdf> | 04, 15 |
| FS103 | Does the Whole Exceed its Parts? The Effect of AI Explanations on Complementary Team Performance (Bansal et al.) (CHI 2021, 2020-06-26) <https://arxiv.org/abs/2006.14779> | 04 |
| FS106 | How Is ChatGPT's Behavior Changing Over Time? (Chen, Zaharia, Zou) (Harvard Data Science Review 2024 (arXiv 2023), 2023-07-18) <https://arxiv.org/abs/2307.09009> | 03, 11, 15 |
| FS108 | A postmortem of three recent issues (Anthropic, 2025-09-17) <https://www.anthropic.com/engineering/a-postmortem-of-three-recent-issues> | 03, 11 |
| FS109 | Defeating Nondeterminism in LLM Inference (He) (Thinking Machines Lab, 2025-09-10) <https://thinkingmachines.ai/blog/defeating-nondeterminism-in-llm-inference/> | 02, 03, 07 |
| GS001 | Building effective agents (Anthropic, 2024-12-19) <https://www.anthropic.com/engineering/building-effective-agents> | 02, 05, 09 |
| GS002 | Effective context engineering for AI agents (Anthropic, 2025-09-29) <https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents> | 01, 02, 09 |
| GS003 | Effective harnesses for long-running agents (Anthropic, 2025-11-26) <https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents> | 10 |
| GS004 | Demystifying evals for AI agents (Anthropic, 2026-01-09) <https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents> | 02, 03, 14 |
| GS005 | Writing effective tools for AI agents - using AI agents (Anthropic, 2025-09-11) <https://www.anthropic.com/engineering/writing-tools-for-agents> | 02, 09 |
| GS006 | Harness design for long-running application development (Anthropic, 2026-03-24) <https://www.anthropic.com/engineering/harness-design-long-running-apps> | 05 |
| GS007 | A practical guide to building agents (PDF) (OpenAI, 2025 (PDF undated; circulated April 2025)) <https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf> | 02, 10 |
| GS008 | Harness engineering: leveraging Codex in an agent-first world (OpenAI, 2026-02-11) <https://openai.com/index/harness-engineering/> | 03 |
| GS012 | Harness engineering for coding agent users (martinfowler.com (Birgitta Böckeler, Thoughtworks), 2026-04-02) <https://martinfowler.com/articles/harness-engineering.html> | 03 |
| GS013 | AI Evals: Everything You Need to Know (Evals FAQ) (Hamel Husain and Shreya Shankar, page dated 2026-09-18 (modified 2026-09-21)) <https://hamel.dev/blog/posts/evals-faq/> | 03, 05, 11, 12 |
| GS015 | Who Validates the Validators? Aligning LLM-Assisted Evaluation of LLM Outputs with Human Preferences (arXiv 2404.12272) (Shankar, Zamfirescu-Pereira, Hartmann, Parameswaran, Arawjo, 2024-04-18) <https://arxiv.org/abs/2404.12272> | 05 |
| GS017 | Semantic conventions for generative client AI spans (semantic-conventions-genai repo) (OpenTelemetry, living document (status: Development)) <https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/gen-ai/gen-ai-spans.md> | 03 |
| GS019 | Structured outputs (Claude API docs) (Anthropic, living document) <https://platform.claude.com/docs/en/build-with-claude/structured-outputs> | 02, 13 |
| GS021 | Models overview (Claude API docs) (Anthropic, living document) <https://platform.claude.com/docs/en/about-claude/models/overview> | 03, 12, 15 |
| GS022 | Model deprecations (Claude API docs) (Anthropic, living document) <https://platform.claude.com/docs/en/about-claude/model-deprecations> | 03, 11, 14, 15 |
| GS023 | Deprecations (OpenAI API docs) (OpenAI, living document) <https://developers.openai.com/api/docs/deprecations> | 03, 14 |
| GS027 | SR 26-2: Revised Guidance on Model Risk Management (letter and attachment PDF SR2602a1.pdf) (Board of Governors of the Federal Reserve System, 2026-04-17) <https://www.federalreserve.gov/supervisionreg/srletters/SR2602.htm> | 03 |
| GS028 | OCC Bulletin 2026-13: Model Risk Management: Revised Guidance (Office of the Comptroller of the Currency, 2026-04-17) <https://www.occ.gov/news-issuances/bulletins/2026/bulletin-2026-13.html> | 03 |
| GS032 | 2026 FINRA Annual Regulatory Oversight Report (PDF), GenAI section (FINRA, 2025-12) <https://www.finra.org/sites/default/files/2025-12/2026-annual-regulatory-oversight-report.pdf> | 02, 03, 06, 10 |
| GS034 | Examination Priorities Fiscal Year 2026 (PDF) (SEC Division of Examinations, 2025-11) <https://www.sec.gov/files/2026-exam-priorities.pdf> | 06, 15 |
| GS048 | Regulation (EU) 2026/1744 (Digital Omnibus on AI) - EUR-Lex OJ text (Art 1(27) application dates; Art 1(38) Art 50(2) transition) (Publications Office of the EU / EUR-Lex, adopted 2026-07-08; OJ 2026-07-24) <https://eur-lex.europa.eu/eli/reg/2026/1744/oj/eng> | 03 |
| GS054 | Digital Operational Resilience Act (DORA) (ESMA, living page) <https://www.esma.europa.eu/esmas-activities/digital-finance-and-innovation/digital-operational-resilience-act-dora> | 03, 08, 15 |
| GS062 | 17 CFR 275.204-2 Books and records to be maintained by investment advisers (Cornell LII (text of SEC rule), current text) <https://www.law.cornell.edu/cfr/text/17/275.204-2> | 02, 03, 10 |
| GS063 | 17 CFR 240.17a-4 Records to be preserved by certain exchange members, brokers and dealers (Cornell LII (text of SEC rule), current text) <https://www.law.cornell.edu/cfr/text/17/240.17a-4> | 03 |
| GS064 | SYSC 9.1 General rules on record-keeping (FCA Handbook, current text) <https://www.handbook.fca.org.uk/handbook/SYSC/9/1.html> | 02 |
| GS066 | LLM01:2025 Prompt Injection (OWASP GenAI Security Project, 2024-11) <https://genai.owasp.org/llmrisk/llm01-prompt-injection/> | 02, 06, 08, 14 |
| GS067 | LLM06:2025 Excessive Agency (OWASP GenAI Security Project, 2024-11) <https://genai.owasp.org/llmrisk/llm062025-excessive-agency/> | 02 |
| GS071 | The lethal trifecta for AI agents (Simon Willison, 2025-06-16) <https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/> | 02, 08 |
| GS073 | Glossary: separation of duty (SP 800-192) (NIST CSRC, living glossary) <https://csrc.nist.gov/glossary/term/separation_of_duty> | 02 |
| GS074 | Secrets Management Cheat Sheet (OWASP Cheat Sheet Series, living document) <https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html> | 08, 14 |
| GS075 | 2024 IC3 Annual Report (FBI Internet Crime Complaint Center, 2025-04) <https://www.ic3.gov/AnnualReport/Reports/2024_IC3Report.pdf> | 02, 12 |
| GS080 | Interrater reliability: the kappa statistic (Biochemia Medica 22(3):276-282) (McHugh, 2012) <https://pmc.ncbi.nlm.nih.gov/articles/PMC3900052/> | 12 |
| GS085 | Canarying Releases (Site Reliability Workbook) (Google, 2018) <https://sre.google/workbook/canarying-releases/> | 14 |
| GS087 | Citations (Claude API docs) (Anthropic, living document) <https://platform.claude.com/docs/en/build-with-claude/citations> | 02 |
