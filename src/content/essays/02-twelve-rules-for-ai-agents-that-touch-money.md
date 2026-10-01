---
num: "02"
slug: "twelve-rules-for-ai-agents-that-touch-money"
title: "Twelve rules for AI agents that touch money"
dek: "In lending and fund operations, a wrong answer becomes a wire, a missed breach or a sentence in an investor letter. These are the design rules we apply whenever a model sits anywhere near that path."
category: "Governance"
date: "2026-09-29"
image: "client-reporting-flow"
related: "capital-call-flow"
lead: false
startHere: false
draftWords: 1347
---

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
