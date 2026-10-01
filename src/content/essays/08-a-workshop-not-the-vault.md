---
num: "08"
slug: "a-workshop-not-the-vault"
title: "A workshop, not the vault"
dek: "AI systems stall when they cannot provision, test or verify their own work. Handing them production access is the wrong fix. Give them a complete environment of their own, and let only reviewed changes cross into yours."
category: "Engineering"
date: "2026-09-29"
image: "nav-pack-review"
related: "loan-ops-ledger"
lead: false
startHere: false
draftWords: 1375
---

Anyone who has used a capable coding agent inside a financial firm will recognise the moment it stops.

"I've written the migration, but I don't have permission to run it against the database."

"I need credentials for the payments sandbox before I can test the wire file."

"I can't check the investor portal sign-up without an inbox that receives the verification email."

The agent wrote the code. It cannot provision what the code needs, deploy it, or prove that it works. So the work lands back on an engineer's desk, and much of the promised speed evaporates in a queue of small favours.

### Three kinds of block

The interruptions fall into three groups.

**Access.** Agent frameworks gate actions behind approval prompts, and firms keep credentials tightly scoped, for good reason. The result is a person clicking "allow" all afternoon, or an agent that simply cannot reach the service its code depends on.

**Infrastructure.** An agent can usually connect to services that already exist, but it cannot create new ones: a database branch for a schema change, a queue, a public endpoint for a webhook to call back to.

**Identity and counterparties.** Much of the software in fund operations deals with verified parties. Investor portals send verification codes. Payment providers check addresses. Administrators send files to known recipients. Testing these flows needs a working inbox, a phone that receives codes, and an account that clears a payment. An agent has none of them.

Each block ends one of two ways. Either the agent stops and asks for help, or it works around the gap and reports success on something it never verified. The second outcome is worse, because it looks like the first one succeeding.

### The wrong fix

The instinctive response is to widen the agent's access inside the real environment: give it the database role, the deploy token, the payments credentials. That trades one problem for a bigger one. The more an agent can touch in production, the more closely someone has to watch it, which defeats the point of having it. In a regulated firm it also collides with principles that exist for good reason: least privilege, separation of duties, and an audit trail that shows who could do what.

### The right fix: a complete workshop

The better answer is to give agents a complete environment of their own, built so that nothing they do there can reach production. We think of it as a workshop. It has five parts.

**1. Separate accounts for everything.** The workshop has its own cloud accounts, its own source-control organisation, its own CI, hosting and billing. There is no shared identity with production: no trust relationships, no shared credentials, no network path between the two.

**2. A synthetic universe.** Fictional funds, investors, borrowers and agreements that behave like real ones, including the awkward cases: an investor excused under a side letter, a borrower that elects PIK interest, a covenant definition changed by amendment. Keep every fictional entity in one registry, so the same fund behaves the same way in every test. Use identifiers that cannot collide with real ones, such as invalid check digits or reserved prefixes, and label any market rate used in samples as illustrative rather than as a fixing [1].

**3. Real tools in sandbox mode.** Payment providers' test modes. Bank statement files generated in standard formats from the synthetic ledger. A test instance of the investor portal. Mailboxes and phone numbers that can receive verification codes, drawn from a pool of pre-provisioned test identities that are leased to a run and returned afterwards.

**4. Full permissions inside.** Within the workshop, the agent can provision, deploy to staging and run end-to-end tests without asking. Any payment card carries a hard spending cap, and resources have quotas. The worst an agent can do here is waste a capped amount of money and a sandbox account.

**5. Complete logging.** Every action the agent takes in the workshop is recorded. That record is useful when something goes wrong, and it is the raw material for improving the agent's instructions and tools.

### Synthetic data has to earn its keep

A workshop is only as useful as its data. If the synthetic universe contains only clean cases, the agent will pass every test and still fail in production. Three habits keep synthetic data honest.

First, generate it from the registry of fictional entities, so that relationships hold: the same investor has the same commitment in the capital call test, the side-letter test and the reporting test.

Second, seed it from error analysis. Every class of failure found in real operations, such as a late excuse election, a partial PIK election or an administrator's new file format, gets a synthetic case that reproduces it. The synthetic universe should grow each time production teaches you something.

Third, check it periodically against reality. Compare the distribution of synthetic cases with the distribution of real ones by type, size and awkwardness, and top up the categories that are under-represented.

### The boundary is the security model

In this design, safety does not come from restricting what the agent can do in the workshop. It comes from making sure nothing it does there reaches production except through review.

- Code crosses into the production organisation only as a proposed change, which people choose to merge or not.
- Production credentials never exist in the workshop, not even in a variable nobody uses.
- In production, actions with consequences still run under a named approver's identity, as they would without any AI involved.
- Secrets in both environments are held in a vault, short-lived, rotated, and never written into prompts or logs [2].

### Inside the workshop, security still matters

A sealed workshop is not automatically a safe one. Agents in the workshop read documents, and some of those documents will be realistic copies of external material. Prompt injection, where text inside a document is crafted to redirect a model, is the top-ranked risk for LLM applications [3]. Simon Willison's "lethal trifecta" describes when it becomes dangerous: an agent with access to private data, exposure to untrusted content, and a channel to send data out [4]. The workshop has private data of its own, including its credentials.

The defences are architectural, and they are measurably effective:

- Readers of untrusted documents run without write tools or network egress.
- Tools are filtered to the minimum each task needs. In AgentDojo (2024), a least-privilege tool filter cut targeted attack success against GPT-4o agents from 47.7% to 7.5% [5].
- Where the stakes justify it, use capability-based designs. One such design, CaMeL, solved 77% of AgentDojo tasks with provable security against prompt injection, against 84% with no defence at all [6].

### Where the providers sit

For EU alternative investment fund managers and UCITS management companies, DORA has applied since 17 January 2025, and it brings ICT third-party providers into a register of information [7]. A workshop that holds only synthetic data keeps most of its tooling out of that conversation. That is another reason to keep real client data out of it entirely.

### What changes for the team

With a workshop in place, an agent can finish its loops. It builds a change, provisions what the change needs, deploys it to staging, runs the end-to-end test, fixes what fails, and opens a pull request with the evidence attached. The engineers' job shifts from provisioning and favours to reviewing evidence and deciding what to merge.

That shift is where most of the speed comes from. It is not that the agent types faster. It is that the agent no longer waits.

### Unblocked is not the same as correct

A warning to finish on. An agent that can deploy and test its own work can still build the wrong thing, and report success with complete confidence. Agents tend to verify exactly what they were asked to verify and nothing more. In a 2025 study of multi-agent systems, nearly a quarter of failures were verification failures [8]. If the definition of correct is vague, a self-verifying agent will happily satisfy the vague version.

That is a specification problem, not an access problem, and it needs its own answer. We describe ours in "Define done before you build".

Give agents a workshop with real tools and fake money. Keep the vault locked. Let only reviewed work through the door.

#### Sources

1. SOFR In Arrears Conventions for Syndicated Business Loans. Alternative Reference Rates Committee (Federal Reserve Bank of New York), 2020. <https://www.newyorkfed.org/medialibrary/Microsites/arrc/files/2020/ARRC_SOFR_Synd_Loan_Conventions.pdf>
2. Secrets Management Cheat Sheet. OWASP Cheat Sheet Series, living document. <https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html>
3. LLM01:2025 Prompt Injection. OWASP GenAI Security Project, 2024-11. <https://genai.owasp.org/llmrisk/llm01-prompt-injection/>
4. The lethal trifecta for AI agents. Simon Willison, 2025-06-16. <https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/>
5. AgentDojo: A Dynamic Environment to Evaluate Prompt Injection Attacks and Defenses for LLM Agents (Debenedetti et al.). NeurIPS 2024 Datasets and Benchmarks Track (per OpenReview), 2024-06-19. <https://arxiv.org/abs/2406.13352>
6. Defeating Prompt Injections by Design (CaMeL) (Debenedetti et al.). arXiv (Google DeepMind / ETH Zurich), 2025-03-24. <https://arxiv.org/abs/2503.18813>
7. Digital Operational Resilience Act (DORA). ESMA, living page. <https://www.esma.europa.eu/esmas-activities/digital-finance-and-innovation/digital-operational-resilience-act-dora>
8. Why Do Multi-Agent LLM Systems Fail? (MAST) (Cemri et al.). NeurIPS 2025 Datasets and Benchmarks Track (spotlight), 2025-03-17. <https://arxiv.org/abs/2503.13657>
