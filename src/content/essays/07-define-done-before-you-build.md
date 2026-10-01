---
num: "07"
slug: "define-done-before-you-build"
title: "Define done before you build"
dek: "Prompts drift and model runs vary. An ordered list of events, each with a proof that can be checked against the real system, gives an AI workflow a finish line that holds across rewrites, model changes and restarts."
category: "Engineering"
date: "2026-09-29"
image: "mandate-guardrails"
related: "capital-call-flow"
lead: false
startHere: false
draftWords: 1362
---

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
