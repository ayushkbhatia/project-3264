---
num: "06"
slug: "when-the-people-who-run-the-process-can-change-the-software"
title: "When the people who run the process can change the software"
dek: "Operators can now describe a tool and have a coding agent build it in an afternoon. The speed is real. In a regulated firm it needs a workshop, a gate and a record, or the afternoon's work becomes next year's audit finding."
category: "Strategy"
date: "2026-09-29"
image: "loan-ops-ledger"
related: "nav-pack-review"
lead: false
startHere: false
draftWords: 1362
---

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
