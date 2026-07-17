---
title: 'Long-context benchmarks — 128K on both Phase 1 models'
date: 2026-07-02
summary: >-
  Both Llama 3.3 70B and Llama 3.1 8B now run at full 128K context in
  production with measured retrieval accuracy on needle-in-haystack.
tags: [added, improved]
phase: 1
---

Both Phase 1 models now serve the full 128K context length in production.
Previously we capped at 32K to leave headroom for batch traffic — we
re-tuned the scheduler and pushed that out.

## Numbers

- **Llama 3.3 70B**: 128K context, p50 TTFT 480ms, p99 TTFT 1.8s on
  a cold Serverless request.
- **Llama 3.1 8B**: 128K context, p50 TTFT 110ms, p99 TTFT 380ms.

Retrieval accuracy on the needle-in-haystack benchmark at 128K is within
0.5% of the upstream Meta reference numbers — we run the same eval harness
Together uses.

## What changed

- Scheduler now admits up to 8 concurrent long-context requests per replica
  instead of 2.
- Block Manager preallocates a larger KV pool for any request that
  declares `> 32K` in the system prompt metadata.
- Added a `context_utilization` field to the response usage block so you
  can see how much of your context was actually used.

No SDK changes required.