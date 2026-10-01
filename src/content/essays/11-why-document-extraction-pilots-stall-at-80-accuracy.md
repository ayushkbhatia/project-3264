---
num: "11"
slug: "why-document-extraction-pilots-stall-at-80-accuracy"
title: "Why document extraction pilots stall at 80% accuracy"
dek: "The demo reads the clean page. Production reads the scanned schedule, the amended definition and the table that breaks across two pages. The last fifth of the accuracy is where the work, and the risk, sits."
category: "Strategy"
date: "2026-09-29"
image: "feat-capital-call-flow"
related: "covenant-watch"
lead: true
startHere: false
draftWords: 1355
---

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
