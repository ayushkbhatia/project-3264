---
num: "05"
slug: "draft-check-repeat-review-loops-that-converge"
title: "Draft, check, repeat: review loops that converge"
dek: "Pairing a model that drafts with a model that critiques can lift the quality of AI output. Without a defined bar, checks that run in code and a rule for stopping, the loop mostly burns tokens."
category: "Engineering"
date: "2026-09-29"
image: "investor-reporting"
related: "client-reporting-flow"
lead: false
startHere: false
draftWords: 1397
---

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
