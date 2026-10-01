---
num: "15"
slug: "when-reading-is-nearly-free"
title: "When reading is nearly free"
dek: "The cost of having a model read a document keeps falling. In fund operations, the constraint is moving from how much can be read to how much can be verified and signed. Plan for that shift now."
category: "Strategy"
date: "2026-09-29"
image: "feat-side-letter-register"
related: "covenant-watch"
lead: false
startHere: false
draftWords: 1292
---

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
