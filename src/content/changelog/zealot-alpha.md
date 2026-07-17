---
title: 'Zealot engine launches behind a feature flag'
date: 2026-09-14
summary: >-
  Block Manager, Constrained Decode, and Scheduler ship in Rust. A/B
  against vLLM on Llama 3.1 8B shows 1.4x throughput at the same p99.
tags: [added]
phase: 2
---

[Zealot](/zealot) — our Rust + CUDA inference engine — runs in production
behind a feature flag for the first time. It's a Phase 2 milestone and
the first step toward replacing vLLM as the default backend.

## What's running

The first cut of Zealot handles three hot-path components:

- **Block Manager** — Paged KV cache with generation-gated `BlockHandle`.
  Stale handles return `Err(StaleHandle)` instead of corrupting memory.
- **Constrained Decode** — JSON schema compiled to a DFA. Validation on
  the CPU side at O(1) per token, no GIL.
- **Scheduler** — Priority queue + per-request block budgets + OOM
  preemption (recompute, not swap).

CUDA kernels are still the upstream PyTorch path for Phase 2. Custom
attention kernels land in Zealot alpha in Q4.

## Numbers from this week's A/B

Both backends running the same Llama 3.1 8B traffic mix:

| Metric | vLLM | Zealot (alpha) |
|---|---|---|
| Throughput | baseline | **1.42x** |
| p50 TTFT | 110ms | 102ms |
| p99 TTFT | 380ms | 360ms |
| Cold-start | 8.4s | 6.1s |

GC pauses disappearing from p99 is the headline — we saw zero GC
spikes > 50ms in 24 hours of Zealot traffic. That's the kind of
tail-latency win we couldn't get from Python.

## How to opt in

Set the `X-Ultralisk-Engine: zealot-alpha` header on your requests.
We'll keep both backends warm until Zealot hits 80% of Together TIE
on the Llama 3.1 workload. At that point Zealot becomes the default
and the flag goes away.

See the full breakdown on the [Engine page](/zealot).