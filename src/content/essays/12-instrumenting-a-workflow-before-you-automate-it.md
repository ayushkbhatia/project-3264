---
num: "12"
slug: "instrumenting-a-workflow-before-you-automate-it"
title: "Instrumenting a workflow before you automate it"
dek: "The best dataset for automating a back-office decision is the record of people making it. Most firms throw that record away. Capture it first, and the automation that follows will be cheaper, better tested and easier to justify."
category: "Operations"
date: "2026-09-29"
image: "feat-nav-pack-review"
related: "loan-ops-ledger"
lead: false
startHere: true
draftWords: 1341
---

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
