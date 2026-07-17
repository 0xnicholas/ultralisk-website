---
title: 'Cost Analytics — CSV export and project-level budgets'
date: 2026-08-05
summary: >-
  Export any cost view to CSV. Set per-project monthly budgets with email
  alerts at 80% and 100%.
tags: [added]
phase: 1
---

Two additions to the [Cost Analytics](/platform#cost-analytics) view,
based on requests from design partners.

## CSV export

Every cost view now has an **Export** button in the top right. The
export matches what's on screen — current view, current filters,
current grouping. CSV is generated server-side, no timeout on large
exports.

The columns are stable across exports:

```
project, model, endpoint, tokens_in, tokens_out, spend_usd,
window_start, window_end
```

## Per-project budgets

Project owners can set a monthly USD budget. When the project crosses
80% of the budget, the project's Owner and Admin get an email. At 100%,
we send a final alert and (if you've enabled it) pause new requests for
the project.

To set a budget:

1. Open the project in the Console.
2. Settings → Billing.
3. Enter a monthly USD limit and choose whether to pause at 100%.

Budgets are enforced per-project, not per-Organization, so a noisy
project can't starve the rest.