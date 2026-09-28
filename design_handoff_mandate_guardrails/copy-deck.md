# Copy deck: Mandate Guardrails

Every visible string on the page, in order, extracted from `Mandate Guardrails.dc.html`. Rows in tables are joined with " · ". Wide-layout variants only; narrow variants reuse the same strings. Where this file and the HTML disagree, the HTML wins.
Mandate Guardrails — 3264.ai
3264.ai  →  3264 Home.dc.html
AI Engineering  →  AI Engineering.dc.html
AI Transformation  →  AI Transformation.dc.html
Industries  →  3264 Home.dc.html#industries
Work  →  3264 Home.dc.html#work
Playbooks  →  Playbooks.dc.html
Company  →  Company.dc.html
Book an audit  →  AI Engineering.dc.html#engagement
Button: On this page ·  · +
← All playbooks  →  Playbooks.dc.html
On this page
 ·   →  
  →  
Start with one mandate
Book a mapping session  →  mailto:hello@3264.ai?subject=Mandate%20Guardrails

## Hero

← All playbooks  →  Playbooks.dc.html
Playbook ·
Asset Management  →  Playbooks.dc.html#asset-management
H1: Mandate Guardrails
Investment guidelines turned into approved, versioned rules, tested before and after each trade, with every breach and override on record.
Reviewed 28 September 2026
N min read
Button: Copy link
We read the IMA, its guideline schedule, the prospectus and the regulatory limits, and draft each restriction as a rule. Your compliance officer approves every rule version, and each one keeps a link to the clause it came from. At run time only the rule engine tests orders and positions: before each trade and again in the daily batch. Breaches are classed active or passive, given a remediation clock, and logged with any override reason and approver. The annual review then draws on that record.
Book a mapping session  →  mailto:hello@3264.ai?subject=Mandate%20Guardrails
See how it is built  →  #built

**Figure**
Clause-to-rule lineage · batch test · IMA-QGCM-2025 · amendment 1 (2026-03-02)run R-2026-09-27-0412 · snapshot SNAP-ABOR-20260926
Quillmere Global Credit Mandate (fictional)
Client: Ashby Borough Pension Fund (fictional) · account ACCT-ASHBY-01
Source · investment guidelines schedule
Schedule 2 · Investment restrictions · p.14
4.2 Concentration. The Manager shall ensure that:
(b) no more than 10% of market value is invested in any one industry sub-group; and
(c) no more than 5% of market value is invested in any one issuer group, and each security is investment grade at purchase.
Interpretation note IN-4.2(c)-02 · approved
“Investment grade” means Baa3 / BBB− or better on the middle of Moody’s, S&P and Fitch; the lower of two if only two rate it. Tested at purchase only.
Rule MG-0412 v3 · approved, read-only
Numerator · market value, all issuers in parent group
Denominator · total portfolio market value incl. cash
Limit · ≤ 5.00% · tested pre-trade and daily batch
Warning · 4.50% · pre-trade and in-trade only
Rating · ≥ BBB− at purchase · middle of 3, lower of 2
Approved · head of investment compliance · 2026-09-14 10:22
Brackwell Utilities group (fictional) · 26 Sep 2026
Holding · Market value £m · % of portfolio
Brackwell Utilities plc 4.25% 2031 · 11.25 · 2.25
Brackwell Utilities Networks Finance 3.875% 2029 · 7.25 · 1.45
Brackwell Utilities Holdings 4.50% 2030 · 2.60 · 0.52
Brackwell Utilities Holdings 5.00% 2034 (bought 22 Sep) · 2.00 · 0.40
Issuer group total · 23.10 · 4.62
Portfolio incl. cash (denominator) · 500.00 · 100.00
Rating at purchase · 5.00% 2034: Baa3 · BB+ · BBB− → middle BBB− · investment grade
4.62% · vs 5.00% limit · headroom 0.38 pp (£1.90m) · PASS
Rule MG-0412 · version history
v1 · 2025-11-03
onboarding: single issuer ≤ 5%
v2 · 2026-03-02
amendment 1: issuer group
v3 · 2026-09-14
rating rule defined
“Investment grade” read as the middle of three ratings, as compliance approved on 14 September.
IMA-QGCM-2025 amdt 1 · Sch.2 §4.2(c) p.14 → Brackwell Utilities group 23.10 / 500.00 = 4.62% → MG-0412 v3 ≤ 5.00% · R-2026-09-27-0412 → PASS · headroom 0.38 pp → approved: head of investment compliance · 2026-09-14 10:22
Split ratings: middle of three says investment grade; the lowest says high yield. Compliance chose the rule, and it is written into v3.
Caption: One clause, the rule version it became, and today's result. Every rule keeps its clause, its version history and its approver.

## 01 The work today

01 / The work today
H2: Guidelines live in a PDF; limits live in the OMS
Every restriction in an IMA or prospectus has to become a rule your order management system can test. Someone reads the clause, someone codes it, someone approves it, and the rule then runs on every order and every night until the mandate changes.
1 · Guideline analyst
Reads the executed IMA, its investment guidelines schedule, amendments and side letters, and writes an interpretation note for each clause.
2 · Rule-coding analyst
Codes each restriction as an OMS compliance rule from templates; a second person approves it before it goes live.
3 · Compliance analyst
Tests new or changed rules against current holdings, what-if trades and historical "as of" snapshots.
4 · Portfolio manager
Creates the order; the OMS tests it before release. A warning can be overridden with a reason; compliance approves or rejects the override.
5 · Investment compliance
Runs the daily batch on full positions, classes each breach active or passive, and sets its remediation deadline.
6 · Chief compliance officer
Notifies the client, fund board or depositary as the IMA and the rules require, and signs the annual review.
Inputs
Investment management agreement (IMA) and its investment guidelines schedule
Amendments, addenda and side letters
Prospectus or SAI fundamental policies, including any 80% names policy; UCITS fund rules
Regulatory limits (Investment Company Act, Rules 18f-4 and 22e-4, UCITS Art 52, FCA COLL 5)
Security master: ratings from Moody's, S&P and Fitch; GICS sector; issuer-to-parent-group map
Orders (FIX New Order-Single) and allocations (FIX Allocation Instruction)
Positions: investment book of record (IBOR) and accounting book of record (ABOR)
Outputs
Interpretation notes per clause
Versioned rule set per account or account group
Pre-trade results and override tickets
Breach and exception log, with remediation deadlines
Client, board and depositary notifications
Annual review file and the CCO's report to the board

## 02 Where it breaks

02 / Where it breaks
H2: Where mandate compliance goes wrong
1
H3: Limits breached, and missed
The FCA fined Invesco Perpetual £18.6m in 2014 for 33 breaches of investment limits across 15 funds between 2008 and 2012. About £5m of losses was paid back to the funds.
2
H3: One clause, two codings
"Investment grade" passes under the middle of three ratings and fails under the lowest; a 5% limit can pass against total assets and fail against net assets. A wrong reading misses breaches or raises alerts people learn to override.
3
H3: Passive breaches left to age
Market moves create breaches without a trade, and they cannot be stopped before one. UCITS rules make remedying them a priority for sales; the Names Rule allows 90 consecutive days.
4
H3: A review without its evidence
In September 2026 SEC exam staff reported that some advisers did not keep the documentation of their annual compliance-review testing.
Related playbook · Private CreditCovenant WatchThe same problem in private credit: a ratio passes or fails on the agreement's own definitions. Covenant Watch recomputes each certificate from them. · Read the playbook →  →  Covenant Watch.dc.html

## 03 How it runs

03 / How it runs
H2: The model drafts rules. Code tests every order.
The model works where there is reading to do: clauses, amendments, breach narratives. Every limit test runs in the rule engine. Every rule version, override and client notice has a named person behind it.

**Figure**
Pre-trade compliance · check sequence · order QGC-26-0917-031 · 2026-09-17book IBOR · portfolio £500.00m incl. cash
Quillmere Global Credit Mandate (fictional)
Client: Ashby Borough Pension Fund (fictional) · account ACCT-ASHBY-01
side BUY · nominal 2,500,000 · security Brackwell Utilities plc 4.25% 2031 · price 98.00 · value £2.45m
#RuleTest (IMA clause)ProjectedLimitResult
1 · MG-0401 v2 · MG-0401 v2Permitted instruments (§3.1) · senior fixed · permitted · PASS09:14:02.204 · projected senior fixed · limit permitted · PASS
2 · MG-0412 v3 · MG-0412 v3Investment grade at purchase (§4.2(c)) · A3 · BBB+ · A− → A− · ≥ BBB− · PASS09:14:02.231 · projected A3 · BBB+ · A− → A− · limit ≥ BBB− · PASS
3 · MG-0412 v3 · MG-0412 v3Issuer group, % of market value (§4.2(c)) · 4.71%from 4.22% · warn 4.50% · max 5.00% · WARN09:14:02.259 · projected 4.71% · limit warn 4.50% · max 5.00% · WARN
4 · MG-0415 v1 · MG-0415 v1Utilities sector ≤ 20% (§4.3(a)) · 14.95%from 14.46% · 20.00% · PASS09:14:02.288 · projected 14.95% · limit 20.00% · PASS
5 · MG-0430 v1 · MG-0430 v1Duration within ±1.50 yrs of benchmark (§4.6) · 6.44from 6.42 · 4.60–7.60 · PASS09:14:02.317 · projected 6.44 · limit 4.60–7.60 · PASS
6 · RL-FIRM · RL-FIRMFirm restricted list (issuer listed 2026-09-16) · listed · not listed · BLOCK09:14:02.346 · projected listed · limit not listed · BLOCK
HELD · 6 checks · 4 pass · 1 warning · 1 block → not released · no FIX 35=D sent · 09:14:03.006
The order stops in the OMS. Nothing reaches the broker until the block is cleared.
QGC-26-0917-031 · ACCT-ASHBY-01 · pre-trade · IBOR 2026-09-17 09:14:02 → 6 checks → MG-0412 v3 WARN 4.71% (warn 4.50%) · RL-FIRM BLOCK → order held, no 35=D → routed to portfolio manager and compliance · 09:14:03
Projected values: market value including cash; price 98.00 held for illustration. A warning can be overridden with a reason; a block cannot.
Caption: Every order is tested per account against every applicable rule before release. The rule engine decides; no model is in this path.
StepThe model reads or draftsCode computes or decidesA person signs
Mandate intake
The model reads or draftsFinds each restriction in the IMA, schedule, amendments and prospectus, with page and paragraph; flags ambiguous terms
Code computes or decidesChecks every clause is accounted for: mapped to a rule, or marked manual with a reason
A person signsGuideline analyst confirms coverage
Rule drafting
The model reads or draftsDrafts a rule spec per clause and lists the interpretation choices: rating rule, denominator, timing
Code computes or decidesValidates the spec against the schema, compiles it and runs boundary tests
A person signsCompliance officer approves each version (four-eyes)
Pre-trade and in-trade
The model reads or draftsNothing
Code computes or decidesTests each order, per account after allocation, against every applicable rule: pass, warn or block
A person signsPortfolio manager or compliance decides any warning override, with a reason
Daily batch
The model reads or draftsNothing
Code computes or decidesTests full positions; classes each breach active or passive from trade history; starts the remediation clock
A person signsCompliance confirms the disposition
Breach record and notices
The model reads or draftsDrafts the cause narrative and the notice text from the breach record
Code computes or decidesFills every figure from the record; tracks deadline and who has been told
A person signsCCO or client service signs and sends
IMA amendment
The model reads or draftsCompares the amended clause with the live rule and drafts the change
Code computes or decidesRe-runs boundary tests and an "as of" replay; keeps the old version read-only
A person signsCompliance approves the new version
Annual review
The model reads or draftsDrafts the narrative summary
Code computes or decidesAssembles testing records from the logs
A person signsCCO signs
Never automated
The model never decides whether an order passes. Its part ends when compliance approves a rule; after that only the rule engine tests orders and positions. No rule goes live, no warning is overridden and no notice leaves without a named approver. Passive breaches cannot be prevented before a trade: they are caught in the batch and given a clock.

## 04 The evidence

04 / The evidence
H2: Every result traces back to a clause and an approver
Each test result carries the clause it came from, the rule version that ran, the inputs it read and the person who approved that version. When the IMA changes, the old rule stays on record beside the new one, so any past result can be explained against the rule that produced it.

**Figure**
Example evidence line · Quillmere Global Credit Mandate · fictional
IMA-QGCM-2025 amdt 1 · Sch.2 §4.2(c) p.14 → Brackwell Utilities group 4.62% → MG-0412 v3 ≤ 5.00% · batch R-2026-09-27-0412 → PASS · headroom 0.38 pp → approved: head of investment compliance · 2026-09-14 10:22
Source · IMA-QGCM-2025 amdt 1
Clause · Sch.2 §4.2(c) p.14
Value · Brackwell Utilities group 4.62%
Rule · MG-0412 v3 ≤ 5.00%
Run · batch R-2026-09-27-0412
Result · PASS · headroom 0.38 pp
Approver · head of investment compliance
Timestamp · 2026-09-14 10:22
Caption: The batch result from the hero card, split into its parts. Fictional data.
H3: Kept for every run
01 · IMA version (hash), clause text and the approved interpretation note
02 · Rule version, who drafted it, who approved it, and when
03 · Boundary-test results for that rule version
04 · Each evaluation: order ID or snapshot ID, the inputs read, the result
05 · Overrides: reason, approver, time
06 · Breaches: when identified, active or passive, deadline, closure
07 · Notifications: who was told, when, and what they were sent
08 · For anything the model drafted: model version, prompt version and raw output
Retention: records rules such as SEC Rule 204-2 and FCA SYSC 9.1 generally set five years; the period and storage are agreed with each client.
Bring one IMA
We will walk through how its clauses become versioned rules, where the interpretation calls sit, and who signs each one.
Book a mapping session  →  mailto:hello@3264.ai?subject=Mandate%20Guardrails

## 05 How it is built

05 / How it is built
H2: Rule engine at run time; model at encoding time
This is a workflow, not an agent. The model reads IMAs and drafts rule specs, which compliance approves. The approved rules run as deterministic code. The model is never in the path between an order and its pass, warn or block.

**Figure**
How it is built · clause → rule → test
The model drafts rules. It never tests an order.
Mandate Guardrails harness · rule MG-0412 v3 · Quillmere Global Credit Mandate (fictional)
Encoding time · each new IMA, amendment or interpretation
IMA clause
§4.2(c) p.14, with amendments and notes
↓
Model drafts · MODEL
rule spec in the schema; lists interpretation choices (rating, denominator, timing)
↓
Code checks · CODE
schema validation, compile, boundary tests on synthetic portfolios (below)
↓
Compliance approves · PERSON
four-eyes; version, approver and timestamp recorded
↓
Rule library
MG-0412 v3, read-only once approved; v1, v2 kept
approved versions → loaded into the rule engine
Run time · every order, every execution, every night
Orders, positions
FIX 35=D / 35=J; IBOR pre-trade, ABOR in the batch
↓
Rule engine · CODE ONLY
every applicable rule, per account after allocation: pre-trade, in-trade, post-execution, daily batch. pass · warn · block; breaches classed active or passive
no model between the order and pass / warn / block
↓
People decide · PERSON
override a warning (reason); breach disposition; client and board notices
↓
Model drafts · MODEL
breach narrative and review pack, from the record, after the decision
model
code
person
data or store
Rule spec · approved · MG-0412 v3
rule: MG-0412
version: 3 # v1 2025-11-03 · v2 2026-03-02
scope: ACCT-ASHBY-01
source: IMA-QGCM-2025 amdt 1 · Sch.2 §4.2(c) p.14
note: IN-4.2(c)-02
part_1: # issuer group concentration
numerator: mv where issuer_group = $g
aggregation: parent_group
denominator: total_mv_incl_cash
operator: "<="
limit: 0.0500
warn: 0.0450 stages: [pre_trade, in_trade]
stages: [pre_trade, in_trade, post_exec, batch]
part_2: # credit quality
test: rating >= BBB-
rating_rule: middle_of_3_else_lower_of_2
timing: at_purchase
unrated: route_to_compliance
effective: 2026-09-15
drafted_by: rule_draft@v5 · model snapshot pinned
approved_by: head_of_investment_compliance
approved_at: 2026-09-14T10:22
Boundary tests · synthetic portfolios · run before approval
Test · Setup · Expected · Engine
SYN-0412-01 · Group at 4.99% · pass
pass
SYN-0412-02 · Group at 5.00% (“no more than”) · pass
pass
SYN-0412-03 · Group at 5.01% · breach
breach
SYN-0412-04 · 3 group issuers at 1.80% each = 5.40% · breach
breach
SYN-0412-05 · Buy rated Baa3 · BB+ · BBB− (middle BBB−) · pass
pass
SYN-0412-06 · Buy rated Baa3 · BB+ only (lower BB+) · breach
breach
SYN-0412-07 · Held bond downgraded to BB+ after purchase · no breach
no breach
7 / 7 as expected · · suite must pass 100% before approval
Rules change by version, each tested and approved. At run time, only code decides.
MG-0412 v3 · spec sha256 3be1…9a70 → 7 boundary tests → 7/7 as expected → approved → head of investment compliance · 2026-09-14 10:22
Expected outcomes are written before the engine runs. A version is approved only when every synthetic case matches.
Caption: The model drafts rule specs at encoding time. Approved rules run as deterministic code. People approve rules, overrides and notices.
H3: Harness

**Figure**
Harness anatomy
10 Observability — every span records model, prompt version, tokens, latency, cost
11 Eval suites — golden set, regression, capability and red-team cases, run on every change
13 Permissions — read · propose · execute
12 Cost and latency budgets per run
Instructions · 02
versioned prompts and rubrics, one per release
Tools · 03
few, namespaced, each rated read / propose / execute
Retrieval and context · 04
the clauses and ledger rows this step needs, just in time
State · 05
a run ledger per case, never the chat history
Model
01 · pinned snapshot
Validators · 06
schema, range, units, and does the cited span support it
Deterministic engines · 07
ratios, allocations, tie-outs, limit tests: unit-tested code
Orchestration · 08
workflow code; any loop has step, time and cost caps
Human review · 09
named approvers; four-eyes wherever money moves
Caption: The harness is everything around the model. In this playbook the model sits at encoding time only.
Pattern: deterministic rule engine, with the model only at encoding time. No agent loop runs at run time.
Why a workflow. Fixed code paths suit well-defined tasks that need predictability; mandate testing is one.
Why not a model at run time. Models apply policy inconsistently across runs: in τ-bench, gpt-4o (mid-2024) solved 61.2% of retail tasks once, but fewer than a quarter consistently across 8 tries.
Rules are governed as code. Versioned, tested, approved and read-only once live. Model-risk guidance treats deterministic methods as needing documented controls, and asks firms to consider more for material, complex ones.
Where the rules run: compiled to your OMS compliance module, or run in our engine beside it.

**Figure**
Consistency across repeated runs
Per-run success rate 0.95, runs independent
pass^k — all k runs correct
pass@k — at least one
1.0 0.9 0.8 0.7 0.6
pass@k ≈ 1.00 pass^k 0.60 1 2 3 4 5 6 7 8 9 10 runs (k)
Caption: Illustrative maths, not measured performance. At a 95% per-run success rate, all of ten runs agree only 60% of the time, which is why no model sits between an order and its result.
H3: Data and integrations
Guideline sources: IMA and guideline schedule (PDF or Word, sometimes scanned), amendments and side letters; prospectus and SAI policies; UCITS fund rules.
Rule schema: scope, numerator filter, aggregation key, denominator, operator, limit and warning level, test stages, effective dates and source clause, per rule version.
Security master: ratings from Moody's, S&P and Fitch with an explicit selection rule; GICS sector (four tiers); an issuer-to-parent-group map for group limits.
Positions: IBOR for pre-trade (intraday, including pending orders); ABOR for the batch; custodian files for reconciliation. Every test names the book it read.
Orders: FIX 4.4 New Order-Single (35=D) with ClOrdID (11), Account (1) and pre-trade allocations (78/79/80); Allocation Instruction (35=J), whose quantities must sum to the order. Block orders are tested per account after allocation.
Derivatives: notional exposure, 10-year bond equivalents for rate derivatives and delta-adjusted options, where the Names Rule requires them.
Cadence: per order, per execution and in a daily batch, with month-, quarter- and year-end snapshots; Rule 18f-4 VaR each business day, 22e-4 liquidity at least monthly, the Names Rule basket at least quarterly.
H3: What is hard for machines, and what we do about it
Hard
"Investment grade" with split ratings. Baa3 / BB+ / BBB− is investment grade on the middle rating and high yield on the lowest.
We
The model flags the term; compliance chooses the rule (Bloomberg's index methodology, for example, uses the middle of three, lower of two), and the choice is written into the rule version.
Hard
Which denominator, and when. The Names Rule uses net assets plus borrowings for investment purposes, tested at the time of investment; s.5(b)(1) uses total assets.
We
Every rule names its denominator, book and timing. Boundary tests run under each variant (below).

**Figure**
Why it is hard · which denominator?
One holding, one “5%” limit, four readings
A fictional portfolio · holding in one issuer: £4.9m · limit: no more than 5.00%
Denominator · Denominator £m · Holding % · Result
Total assets£98.0m · 98.0 · 5.00 · pass
Net assets£95.1m · 95.1 · 5.15 · fail
Net assets + £2.3m borrowings for investment purposes£97.4m · 97.4 · 5.03 · fail
Invested assets, excluding cash£91.3m · 91.3 · 5.37 · fail
The same words pass under one denominator and fail under three. The rule has to name which.
Caption: Rules differ: the Names Rule uses net assets plus borrowings for investment purposes; s.5(b)(1) uses total assets.
Hard
Issuers that belong to one group, and funds that hold other funds.
We
A maintained parent hierarchy, with group companies counted as one body where UCITS requires it; a look-through flag on each rule.
Hard
Models drift. GPT-4's accuracy on one task fell from 84.0% to 51.1% between its March and June 2023 versions under the same name.
We
Pinned model versions; after any model change, the rule drafts are re-tested before the model drafts again.
Hard
Passive breaches arrive without a trade.
We
The engine classes each breach from trade history ("no trade in scope since the last pass"), and compliance confirms it.
H3: How we know it works
Clause coverage: every clause in the golden IMAs maps to at least one rule or is marked manual with a reason. Target: 100% accounted for.
Rule correctness: each rule runs on synthetic boundary portfolios (1bp under, at, and 1bp over the limit) under each denominator and timing mode. The suite must pass 100% before a version is approved.
Seeded-breach replay: historical orders and batches replayed with planted breaches: split ratings, group issuers, look-through, derivatives notional, passive moves. Target: no misses.
Golden set: 20–40 fictional clauses covering each hard case, plus several of your own mandates with known historical breaches.
Shadow run: results compared case by case with your incumbent compliance system, which stays authoritative; every disagreement is logged with its root cause.
In production: override rate per rule. A rule that is overridden often is usually specified wrongly.
These targets are our proposals, not industry benchmarks; none has been published for this work.

**Figure**
How an engagement runs
Assess · 2 weeks
Build · 6–12 weeks · release every fortnight
Run · ongoing
diagnostic
shadow run
R1
R2
R3
R4
R5
R6
in production
acceptance
1 Discovery, baseline
cycle time and error rate from the firm's own logs
2 Golden set
real cases, two labellers, agreement measured
3 Prototype
a thin slice sets the ceiling
4 Error analysis
read traces, count failures
5 Eval-gated releases
regression suite must pass
6 Shadow run
incumbent stays in charge; disagreements logged
7 Acceptance
owner signs thresholds and a stated sampling plan
8 Staged rollout
one fund or desk first
9–10 Monitoring, drift
overrides, cost, re-runs
11 Model migration
regress, shadow, canary
Caption: A two-week assessment, a build released every fortnight with a shadow run, then production.
H3: Controls and security
Four-eyes on every rule version. An approved version cannot be edited; a change creates a new version with its own approver.
Append-only records. Corrections stay visible and records are not otherwise altered, the pattern FCA SYSC 9.1 describes.
Least privilege. The model can read guideline documents and propose rule specs. It has no tool to change a live rule, release an order or send a notice; those run from the approval screen under the approver's identity.
Documents are data. Text inside an IMA, amendment or email fills typed fields; it cannot choose an action.
Where the model runs and what it sees: agreed with each client and named in writing. At encoding time it reads guideline documents only; it has no access to live order flow.
How we buildThe harness, evaluation suites and controls behind every playbook · AI Engineering →  →  AI Engineering.dc.html

## 06 Rules

06 / Rules
H2: The rules, as of 28 September 2026
2025-05-21 · ESMA fund-names guidelines apply to existing fundsAn 80% threshold for ESG terms; temporary deviations are passive breaches to correct.
2025-11-17 · SEC FY2026 exam prioritiesFund portfolios checked for consistency with stated strategy, filings, marketing and the amended Names Rule.
2026-06-11 · Names Rule compliance, fund groups of $1bn or moreEach fund complies from its first annual prospectus update on or after this date.
2026-09-14 · SEC risk alert on annual compliance reviewsStaff found testing documentation not kept. The review needs its evidence on file.
2026-12-11 · Names Rule compliance, fund groups under $1bnQuarterly review of the 80% basket; 90 consecutive days to return to compliance.

## Terms

H2: Terms
Term: Investment management agreement (IMA)
  The contract appointing a manager for a segregated account; the investment guidelines are usually a schedule to it. UK/EU "IMA"; US also "investment advisory agreement".
Term: Investment guidelines / restrictions
  The client's limits on what, and how much, the manager may buy. US "guidelines"; UK/EU often "restrictions".
Term: Pre-trade and in-trade compliance
  Tests of a proposed order before release, and of a trader's order before it is committed.
Term: Portfolio (batch) compliance
  A scheduled test of the whole book, usually daily.
Term: Rule coding
  Turning a restriction into a compliance rule the OMS can run.
Term: Four-eyes approval
  A second person approves a rule or change before it is used.
Term: Hard and soft limit
  A hard limit blocks the order; a soft limit warns and can be overridden with a documented reason.
Term: Active and passive breach
  Caused by the manager's own trade, or by a market move or event outside its control. UK/EU usage; US statute speaks of a "discrepancy".
Term: Issuer group aggregation
  Counting companies in the same group as one issuer. Explicit in UCITS.
Term: Look-through
  Testing limits against the holdings of funds the portfolio owns.
Term: Middle rating
  The middle of the Moody's, S&P and Fitch ratings, or the lower of two if only two exist.
Term: 80% basket and "Assets"
  The Names Rule requires at least 80% of Assets, meaning net assets plus borrowings for investment purposes, to match the fund's name. US; ESMA applies an 80% threshold to ESG names in the EU.

## Recently updated

H2: Recently updated
2026-09-28 · Rules strip updated for the Names Rule compliance dates and the SEC's 14 September 2026 risk alert on annual compliance reviews.
2026-09-28 · Evidence list now names the testing records an annual review draws on.

## Questions

H2: Questions
Button: Does the model decide whether a trade is allowed? · −
No. The model drafts rule specs from your IMA, and your compliance officer approves each version. From then on, orders and positions are tested by the rule engine alone. The model also drafts breach narratives and notices, but only from the recorded result, after the decision, and a person signs anything that leaves.
Button: Can it stop every breach? · +
No. A pre-trade check can block or warn on an order that would breach a rule. It cannot stop a passive breach, which comes from a price move or an event with no trade behind it. Those are caught in the daily batch, classed from the trade history, and given a remediation deadline and an owner.
Button: What happens when the IMA is amended? · +
The amended clause is compared with the live rule, and a new rule version is drafted, tested and approved. The previous version stays on record, read-only. An "as of" replay can show what the new version would have said about past positions, and every past result stays tied to the version that produced it.
Button: Do we have to replace our order management system? · +
No. Most asset managers already run pre-trade rules in an OMS compliance module. We work on how rules get there: drafting from the clause, testing and approval, lineage and evidence. The approved rules either compile to your OMS or run beside it in shadow until you choose.
Button: Where does the model run, and what data does it see? · +
At encoding time the model reads your guideline documents; it needs no access to live order flow. Where it is hosted, which provider and region, and what is retained are agreed with each client and named in writing. Every model call is logged with its model and prompt version.
Button: What does this give the annual compliance review? · +
A record, not a rebuilt spreadsheet: rule versions with approvers, test results, overrides with reasons, and breaches with their deadlines and closures. Rule 38a-1 requires a fund CCO's annual written report to the board, and Rule 204-2 requires advisers to keep annual-review records. SEC staff found in 2026 that some advisers kept no testing documentation.

## More playbooks

H2: More playbooks
All nine playbooks →  →  Playbooks.dc.html#library
Asset Management · Client Reporting Flow · Client reports built from reconciled books, each figure tied out and each commentary claim checked against attribution before release.  →  Client Reporting Flow.dc.html
Fund Management · Investor Reporting · Letters, capital account statements and DDQ answers drafted from your books, with every figure traced to source before release.  →  Investor Reporting.dc.html
Private Credit · Covenant Watch · Borrower certificates recomputed from the credit agreement's own definitions, with headroom, add-back caps and cure rights tracked every test date.  →  Covenant Watch.dc.html

## Closing

H2: Start with one mandate
Bring one IMA. We will walk through how its clauses become versioned rules, where the interpretation calls sit, and who signs each one.
Book a mapping session  →  mailto:hello@3264.ai?subject=Mandate%20Guardrails

## Footer

Services
AI Engineering  →  AI Engineering.dc.html
AI Transformation  →  AI Transformation.dc.html
Deployment & Run  →  3264 Home.dc.html#capabilities
Evaluation suites  →  3264 Home.dc.html#capabilities
Industries
Private Credit  →  Private Credit.dc.html
Private Equity  →  Private Equity.dc.html
Fund Management  →  3264 Home.dc.html#industries
Asset Management  →  3264 Home.dc.html#industries
Company
Who we are  →  Company.dc.html#who
How we work  →  Company.dc.html#how
Case studies  →  3264 Home.dc.html#work
Resources
Playbooks  →  Playbooks.dc.html
Field notes  →  3264 Home.dc.html#playbooks
Security  →  Company.dc.html#how
Connect
Book a call  →  AI Engineering.dc.html#engagement
hello@3264.ai  →  mailto:hello@3264.ai
LinkedIn  →  AI Engineering.dc.html#engagement
3264.ai · © 2026 Bearing Deployment Company Inc. All rights reserved.
All systems operational