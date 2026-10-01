---
num: "01"
slug: "an-index-is-not-understanding"
title: "An index is not understanding"
dek: "Structured maps of a credit agreement help an AI system find the right clause faster. They do not make its reading right. Build them as tools the system keeps using, not documents it reads once."
category: "Engineering"
date: "2026-09-29"
image: "capital-call-flow"
related: "covenant-watch"
lead: false
startHere: false
draftWords: 1436
---

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
