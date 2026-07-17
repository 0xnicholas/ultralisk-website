---
title: 'Batch throughput — 50% off, 3x faster turnaround'
date: 2026-07-20
summary: >-
  Batch endpoint average turnaround dropped from 9h to 3h. New status
  endpoint lets you poll job state without a full GET.
tags: [improved]
phase: 1
---

The Batch endpoint got two upgrades this week.

## 1. Faster turnaround

Average job turnaround dropped from ~9 hours to ~3 hours. We rebalanced
the scheduler to admit Batch requests alongside Serverless traffic with
preemption, so a Batch job no longer waits for a quiet fleet window.

SLA is still 24h. Most jobs now complete in under 4h.

## 2. New status endpoint

`GET /v1/batch/{job_id}` previously returned the full job object including
all input/output payloads. For jobs with millions of tokens that meant
megabytes of JSON on every poll.

The new `?summary=true` query parameter returns just the metadata:

```json
{
  "id": "batch_abc123",
  "status": "running",
  "completed": 42180,
  "total": 50000,
  "created_at": "2026-07-20T08:14:00Z",
  "completed_at": null,
  "output_file_id": null
}
```

Default behavior is unchanged. Existing integrations keep working.

## Pricing reminder

Batch is 50% off the listed token prices — see [Pricing](/pricing#pricing-table).