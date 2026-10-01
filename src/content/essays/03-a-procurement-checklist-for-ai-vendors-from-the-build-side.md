---
num: "03"
slug: "a-procurement-checklist-for-ai-vendors-from-the-build-side"
title: "A procurement checklist for AI vendors, from the build side"
dek: "The model is the one component every vendor can buy. The harness around it decides whether a system survives an audit, a model retirement and a bad quarter. These are the questions we would ask if we were sitting on your side of the table."
category: "Strategy"
date: "2026-09-29"
image: "feat-mandate-guardrails"
related: "covenant-watch"
lead: false
startHere: true
draftWords: 1338
---

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
