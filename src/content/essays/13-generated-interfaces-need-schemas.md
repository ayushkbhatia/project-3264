---
num: "13"
slug: "generated-interfaces-need-schemas"
title: "Generated interfaces need schemas"
dek: "Models can now compose screens, reports and dashboards on request. In a regulated firm, the safe version is a model that fills a typed layout from an approved set of components, bound to reconciled data it never types itself."
category: "Engineering"
date: "2026-09-29"
image: "feat-covenant-watch"
related: "investor-reporting"
lead: false
startHere: false
draftWords: 1353
---

Ask for a view, get a view. Generative interfaces, where a model assembles a dashboard, a report section or a form in response to a request, are one of the more striking capabilities of the last two years.

For fund operations the appeal is obvious. An investor relations analyst types: "One-page Q2 summary of Fund II for the advisory committee, with the NAV bridge, net IRR with and without the subscription line, and the five largest positions." The page appears in seconds.

The risks are just as obvious. Numbers typed by a model. Formats that change from one request to the next. A disclosure quietly missing. A layout that breaks the brand, or fails accessibility checks. And no record of what was actually shown to whom.

None of these risks is a reason to avoid the capability. All of them are reasons to generate interfaces from schemas rather than from scratch.

### 1. A registry of approved components

Start with a small library of approved components, each with a typed schema. A plausible starting set for fund reporting:

| Component | What it holds |
|---|---|
| KPI tile | Label, calculation ID, format, optional comparison calculation |
| Table | Columns, each bound to a calculation or data field; a row source query |
| Trend chart | Series bound to time-series queries; axis formats |
| Evidence line | Source document, version, locator, value, test, status, approver |
| Commentary block | Text with bound figure slots, and a claim-check status per sentence |
| Disclosure block | A disclosure ID from the approved library, never free text |

The model can only choose from this registry. Anything outside it does not render. That one constraint removes most of the ways a generated page can go wrong.

### 2. The model outputs a layout, not a page

The model's output is a layout tree: sections, components and their properties, expressed as structured data. The renderer validates the tree against the schemas before drawing anything. An invalid layout is rejected with a specific error, and the model tries again or the request goes to a person.

Structured-output features in current model APIs guarantee that output conforms to a schema. They make no promise about the values inside it [1]. That gap is exactly why the next rule matters most.

### 3. Numbers are bound, never typed

The single most important rule of generated financial interfaces is that the model never writes a number. Every figure on the page is a reference to a calculation over a reconciled, approved data snapshot. The renderer resolves the reference and formats the result. If the model tries to place a literal number in a text slot, the validator flags it and the page cannot be released.

Take a fictional example. An advisory committee summary for Larkspur Credit Opportunities Fund II shows three tiles: NAV of $831.8m, TVPI of 1.21x and DPI of 0.34x. Each tile is bound to a calculation ID over the approved Q2 snapshot. Beneath them, a commentary block explains the quarter. Its figures are bound slots too, and each sentence carries a claim-check status showing whether the attribution data supports it. The model chose the arrangement and wrote the words. It did not produce a single number.

### 4. Mind the order of fields

A detail for engineers. When a model produces structured output, the order of fields affects the quality of its reasoning. In one 2024 study, GPT-3.5-Turbo in JSON mode placed the "answer" key before the "reason" key in 100% of responses on a reasoning task. Its reasoning was therefore written after it had already committed to an answer [2].

For layouts, put a short statement of intent before the component choices, so that the model states what the page is for before deciding what goes on it. Or plan the page in a separate step and generate the layout from the plan.

### 5. Change the node, not the page

When a user asks for a change, such as "swap the chart for a table" or "add IRR excluding the subscription line", regenerate only the part of the layout affected. Keep a versioned history of the layout, with a diff for each change, so a reviewer can see exactly what moved. Partial regeneration is faster and cheaper, and it avoids the unsettling experience of a whole page reshuffling because one tile changed.

### 6. Required components are not optional

Some elements must appear on every page of a given type: the as-of date, the data snapshot identifier, the basis of each performance figure (gross or net, with or without the subscription facility), and whatever disclosures your policies require. Encode these as layout rules. A page of type "advisory committee summary" must include a specified set of components. The validator enforces the rule, so the model cannot leave anything out, however the request is phrased.

### 7. Releasing a view is a separate act

Every generated page should also say which data it shows. Bind each page to a named, immutable data snapshot, and print the snapshot's identifier and as-of date on the page. If the underlying books are restated after the page was generated, the page does not quietly change. It is regenerated against the new snapshot, and the difference between the two versions can be shown to anyone who asks.

A generated view used internally can be ephemeral. Anything that leaves the firm is a document. It is frozen, versioned, approved by named people under your review policy, and stored with the hash of the data snapshot it was built from. The generative step makes drafting fast. It does not change what release requires.

### 8. Brand and accessibility come from the components

Because every page is composed from approved components, colour, typography, contrast, chart conventions and accessibility behaviour come from the components rather than from the model. Every generated page inherits them. Improving a component improves every page that uses it, which is how design systems are meant to work anyway.

### A worked request

Here is what the machinery looks like for the advisory committee request at the top of this piece. The model's first output is a layout like this one, shortened for reading:

```json
{
  "intent": "Advisory committee summary, Q2 2026, Fund II",
  "page_type": "advisory_committee_summary",
  "sections": [
    {"component": "kpi_row", "tiles": [
      {"label": "NAV", "calc": "fund2.nav.q2_2026"},
      {"label": "TVPI", "calc": "fund2.tvpi.q2_2026"},
      {"label": "DPI", "calc": "fund2.dpi.q2_2026"}]},
    {"component": "commentary",
     "text": "Net IRR since inception was {irr_net} ({irr_ex_facility} excluding the subscription facility).",
     "slots": {"irr_net": "fund2.irr_net.q2_2026",
               "irr_ex_facility": "fund2.irr_net_ex_sub.q2_2026"}},
    {"component": "table", "source": "fund2.top_positions.q2_2026", "limit": 5}
  ]
}
```

The validator returns two errors. This page type requires a disclosure block describing the basis of the performance figures, and it is missing. There is also no as-of component. The model adds both and resubmits, and the layout passes.

Every figure on the rendered page now comes from a calculation reference. The only numbers the model wrote itself are the five-row limit and the dates inside the identifiers. A reviewer approving the page is therefore checking the story and the arrangement, because the figures were never the model's to get wrong.

### Where fine-tuning fits

Teaching a smaller model to produce your layout schema reliably is a reasonable fine-tuning target. The output space is narrow, the schema is fixed, and training examples can be generated from the component library itself and validated mechanically, every one of them. It is not a requirement. A capable general model with schema-constrained output may do the job well enough. Decide on evidence: compare candidates on the measures below, using the same set of real requests.

### What to measure

- **First-attempt validity:** the share of layouts that pass schema validation first time.
- **Binding rate:** the share of figures bound to calculations. The target is 100%.
- **Required-component compliance:** also 100%, enforced by the validator and monitored anyway.
- **Reviewer edit rate:** how much people change generated pages before approving them.
- **Time to an approved view:** from request to sign-off.

The first two tell you whether the machinery works. The last two tell you whether it is worth having.

### The principle

Generated interfaces are safe when the model's freedom lies in the arrangement, not in the facts. Let it choose the shape of the page, the order of the story and the words that connect the figures. Never let it choose the figures.

#### Sources

1. Structured outputs (Claude API docs). Anthropic, living document. <https://platform.claude.com/docs/en/build-with-claude/structured-outputs>
2. Let Me Speak Freely? A Study on the Impact of Format Restrictions on Performance of Large Language Models (Tam et al.). EMNLP 2024 Industry Track, 2024-08-05. <https://arxiv.org/abs/2408.02442>
