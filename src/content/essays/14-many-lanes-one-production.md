---
num: "14"
slug: "many-lanes-one-production"
title: "Many lanes, one production"
dek: "AI features change prompts, data, tools and model versions at the same time. Shared staging turns every change into a queue. Give each engineer a complete lane of their own, and make the gate into production the only thing they share."
category: "Engineering"
date: "2026-09-29"
image: "feat-research-intake"
related: "loan-ops-ledger"
lead: false
startHere: false
draftWords: 1328
---

The classic environment ladder of development, staging and production assumes two things: that most changes are code, and that most changes are independent of each other. AI delivery breaks both assumptions.

A single AI feature can touch a prompt, an extraction schema, a database table, a tool definition, an evaluation set and a model version, all at once. When two engineers work on different features in one shared staging environment, they collide constantly. One engineer's schema migration breaks the other's tests. Prompt versions overwrite each other. Long evaluation runs compete for the same fixtures and their results get mixed up. And somebody is always asking who is using staging this afternoon.

### Where shared staging hurts AI work in particular

Some of the friction is specific to the kind of systems we build for fund and lending operations.

- **Callbacks need stable addresses.** Payment provider sandboxes, investor portal callbacks, inbound email processing and sign-in redirects all send data to a fixed URL. Per-commit preview deployments get a new URL on every push. Shared staging has exactly one URL for everyone.
- **Schema changes collide.** Adding columns to hold the source locator for every extracted figure is a sensible change that breaks every other feature's fixtures in a shared database.
- **Prompt and model versions collide.** Two people testing different prompt versions against the same deployment cannot tell whose change produced which result.
- **Evaluation runs compete.** A full golden-set run can take a while. Two in parallel against shared state produce results nobody can trust.

### A complete lane for each engineer

The alternative is to give each engineer a complete, isolated lane. Each lane has:

- a local environment, plus a cloud staging deployment at a stable personal URL, so that callbacks always know where to go;
- its own database branch, seeded from the synthetic fund universe, with migrations applied independently of everyone else's;
- its own secrets, issued from a vault and valid only against sandbox providers;
- its own namespace in the prompt registry, so prompt versions never collide;
- its own sandbox registrations with the payment provider, the investor portal and the email service.

Modern infrastructure makes most of this cheap to set up: database branching, per-branch deployments, secrets managers that sync configuration into each environment, and tunnelling services with reserved domains for local work. The main cost is the automation that creates and tears down lanes, and that is worth writing once.

### Creating a lane, step by step

Lanes should be created by a script, not a ticket. A typical sequence:

1. Create a database branch from the template schema, and seed it with the current version of the synthetic universe.
2. Issue sandbox-only secrets from the vault, with an expiry.
3. Deploy the engineer's branch to a staging environment at their personal URL.
4. Register that URL in each sandbox provider's webhook settings.
5. Create the engineer's namespace in the prompt registry, copied from the current release.
6. Run the smoke tests and the security cases.
7. Tear the lane down automatically when the branch merges, or after a set period without activity.

If creating a lane takes more than a few minutes, engineers will start sharing them, and the collisions come back.

### Common objections

**"Lanes will drift from production."** They will, which is why lanes are rebuilt often from the current release template, and why the gate, not the lane, is the final test.

**"It costs too much."** Most lanes sit idle most of the time. Scale them to zero when idle, and tear them down on merge.

**"Our database cannot branch."** Seeding a fresh schema from the synthetic universe on demand gives most of the same isolation. It is slower, but still far better than sharing.

### What stays shared

Isolation is only useful if the right things stay common to everyone:

- **the golden set and evaluation harness**, versioned, so every lane tests against the same cases;
- **the synthetic universe registry**, one source of fictional funds, investors and borrowers, so that a given fund behaves the same way in every lane;
- **the release gate**;
- **production.**

### The gate is the only shared path

Every change reaches production through the same gate, whichever lane it came from. The gate checks:

1. **Regression evaluations.** The golden set passes at the agreed thresholds. Anthropic's guidance distinguishes regression suites, which should pass at close to 100%, from capability evaluations, which measure progress on new behaviour [1].
2. **Capability evaluations.** The new behaviour is measured and recorded.
3. **Security tests.** Red-team cases with instructions hidden in documents confirm that injected text is treated as data, flagged and routed to review [2].
4. **Unit and contract tests** for every tool and calculator.
5. **Review.** An engineer reviews the change and its evidence. The process owner signs off any change that affects outputs.
6. **Record.** Prompt versions, model identifiers, schema versions and evaluation results are stored with the release.

With a fortnightly release rhythm, lanes let many changes arrive at the gate ready at the same time, and one broken feature no longer holds up the rest of the release.

### Review by using, not only by reading

Because each lane has a stable URL and working sandbox integrations, reviewers can use a change as well as read it. They can open the lane's investor portal, trigger a test capital call for a fictional fund, watch the payment callback arrive and inspect the evidence line it produces. Reading a diff catches problems in the code. Using the lane catches problems in the product.

Give reviewers a short script for each change: the fictional fund to use, the steps to take, and the evidence they should expect to see at the end. A reviewer who follows the script and gets a different result has found something worth knowing, whatever the diff looked like.

This matters more as coding agents write more of the code. A diff of several hundred generated lines is hard to review line by line. A working flow with its evidence attached is not.

### Model migrations start in a lane

A new model snapshot is tested in a lane first. That means running the full golden set, replaying recent inputs from the synthetic universe or an anonymised evaluation store, and comparing the new snapshot's output field by field with the current one's.

If it passes, the candidate moves to a shadow run in production for a full business cycle, then to a canary: one fund or one desk running on the new snapshot against an unchanged control [3]. Only then does it replace the old version everywhere. Providers give notice before retiring a model, at least 60 days at Anthropic [4] and at least six months for generally available models at OpenAI [5]. Plan migrations well inside those windows, because a migration that has to be rushed is a migration that skips steps.

### Data and secrets discipline

Two rules keep lanes safe.

**No production data in lanes.** Lanes run on the synthetic universe, which should be rich enough to include the awkward cases: excused investors, PIK elections, amended definitions, late wires. Use identifiers that cannot match real entities. If anonymised production samples are needed for evaluation, keep them in a controlled evaluation store, not in any lane.

**Secrets live in a vault.** They are short-lived, rotated, and never written into prompts or logs [6]. Each lane's credentials work only against sandboxes, so a leaked lane secret opens nothing that matters.

### What it costs and what it buys

Lanes cost some infrastructure, most of it idle most of the time. They cost the automation to create and destroy them, and ongoing care of the synthetic data.

In return, engineers work in parallel without coordinating, reviews are faster and more realistic, model migrations are rehearsed before they matter, and releases stop being held hostage by the one feature that is not ready. Above all, production only ever receives changes that came through the gate.

The number of places where work happens should grow with the team. The number of paths into production should stay at one.

#### Sources

1. Demystifying evals for AI agents. Anthropic, 2026-01-09. <https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents>
2. LLM01:2025 Prompt Injection. OWASP GenAI Security Project, 2024-11. <https://genai.owasp.org/llmrisk/llm01-prompt-injection/>
3. Canarying Releases (Site Reliability Workbook). Google, 2018. <https://sre.google/workbook/canarying-releases/>
4. Model deprecations (Claude API docs). Anthropic, living document. <https://platform.claude.com/docs/en/about-claude/model-deprecations>
5. Deprecations (OpenAI API docs). OpenAI, living document. <https://developers.openai.com/api/docs/deprecations>
6. Secrets Management Cheat Sheet. OWASP Cheat Sheet Series, living document. <https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html>
