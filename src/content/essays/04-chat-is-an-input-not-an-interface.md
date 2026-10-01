---
num: "04"
slug: "chat-is-an-input-not-an-interface"
title: "Chat is an input, not an interface"
dek: "Language is the fastest way to say what you want. It is a poor way to show a controller what a system did. Operations software needs both halves, and they call for different designs."
category: "Product"
date: "2026-09-29"
image: "covenant-watch"
related: "loan-ops-ledger"
lead: false
startHere: false
draftWords: 1331
---

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
