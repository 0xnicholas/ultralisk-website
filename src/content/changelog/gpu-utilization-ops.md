---
title: 'Operations — GPU Utilization and Clusters in Console'
date: 2026-10-02
summary: >-
  The Operations module ships. Clusters, Nodes, GPU Utilization,
  Deployments, and Incidents are now in Console for every workspace.
tags: [added]
phase: 2
---

The [Platform](/platform) side of Ultralisk lands today. Five new pages
in Console, all backed by Prometheus + Loki on the data plane side.

## What shipped

- **Clusters** — every cluster you've registered, with status, GPU type
  breakdown, and aggregate utilization.
- **Nodes** — drill in from a cluster to see per-node health, recent
  evictions, and current workloads.
- **GPU Utilization** — the headline view. Real utilization (not what
  the scheduler *reports*) broken down by model, by tenant, and by
  endpoint. Time series over 24h / 7d / 30d.
- **Deployments** — every model running on your fleet, with status and
  spend. Drill in for per-replica detail.
- **Incidents** — p99 spikes, OOM events, evictions. Timeline view with
  postmortem notes. Slack-integrated.

## What this means for billing

GPU Utilization feeds straight into [Cost Analytics](/platform#cost-analytics).
If you can see a deployment burning 80% idle capacity, you can either
down-size it or move that traffic to Batch. We've seen design partners
cut their bill by 20-40% just by looking at this page.

## Coming in Q4

- **Cost Analytics (enhanced)** — per-experiment attribution, budget
  alerts with Slack integration.
- **Multi-tenancy** — Organization → Project → Resource with RBAC at
  every boundary.
- **Integrations** — PagerDuty, Datadog, generic webhooks.