/**
 * Platform (Operations console) features — mirrors console-ui pages
 * in ../Ultralisk/console/console-ui/src/pages/.
 *
 * Single source of truth for /platform page and Home Platform section.
 */

export type ConsolePhase = 1 | 2 | 3;

export interface Persona {
  id: 'alex' | 'bella' | 'charlie' | 'diana';
  name: string;
  role: string;
  /** Icon emoji or text — used as small badge */
  badge: string;
  /** What this persona does day-to-day */
  story: string;
  /** Key features this persona uses */
  features: string[];
}

export const PERSONAS: Persona[] = [
  {
    id: 'alex',
    name: 'Alex',
    role: 'AI developer',
    badge: 'Phase 1',
    story:
      'Ships an LLM feature to production on a Friday. Needs the first API call in under five minutes and a place to see what they spent.',
    features: ['Models', 'Playground', 'API Keys', 'Billing'],
  },
  {
    id: 'bella',
    name: 'Bella',
    role: 'ML engineer',
    badge: 'Phase 1-2',
    story:
      'Runs A/B between two model versions, watches GPU utilization, attributes spend by experiment, gets a Slack alert when p99 spikes.',
    features: ['Endpoints', 'Batch Jobs', 'GPU Utilization', 'Cost Analytics'],
  },
  {
    id: 'charlie',
    name: 'Charlie',
    role: 'Platform / SRE',
    badge: 'Phase 2',
    story:
      'Owns the cluster. Wants to see every node, every deployment, every incident — and a single pane for capacity planning.',
    features: ['Clusters', 'Nodes', 'Deployments', 'Incidents', 'Integrations'],
  },
  {
    id: 'diana',
    name: 'Diana',
    role: 'Enterprise admin',
    badge: 'Phase 3',
    story:
      'Manages SSO, RBAC, audit log, and the contract. Needs the same Console running on her data center — no Ultralisk-hosted telemetry.',
    features: ['SSO / SAML', 'RBAC', 'Audit log', 'Private deployment'],
  },
];

export interface Capability {
  id: string;
  name: string;
  tagline: string;
  body: string;
  phase: ConsolePhase;
  /** Persona ids this capability primarily serves */
  personas: Persona['id'][];
  /** Tab label for the console mockup, if any */
  consoleRoute?: string;
}

export const CAPABILITIES: Capability[] = [
  {
    id: 'gpu-utilization',
    name: 'GPU Utilization',
    tagline: 'Real utilization per cluster, model, and tenant.',
    body:
      'Out-of-the-box dashboards show what your fleet is actually doing — not the headline number your scheduler reports. Per-model and per-tenant breakdowns, time series over the last 24h / 7d / 30d.',
    phase: 2,
    personas: ['bella', 'charlie'],
    consoleRoute: '/gpu-utilization',
  },
  {
    id: 'clusters',
    name: 'Clusters & Nodes',
    tagline: 'Every cluster, every node, every GPU, in one view.',
    body:
      'Capacity planning starts with knowing what you have. Cluster status, GPU type breakdown, per-node health, degraded alerts surfaced where you actually look.',
    phase: 2,
    personas: ['charlie'],
    consoleRoute: '/clusters',
  },
  {
    id: 'deployments',
    name: 'Deployments',
    tagline: 'Models running on your fleet, with status.',
    body:
      'Each deployment shows where it runs, what it costs, and whether it is healthy. Drill in for the per-replica view, then act — scale, restart, drain.',
    phase: 2,
    personas: ['charlie', 'bella'],
    consoleRoute: '/deployments',
  },
  {
    id: 'cost-analytics',
    name: 'Cost Analytics',
    tagline: 'Spend by model, endpoint, API key, team, or project.',
    body:
      'The same transparency we use to run our own fleet, exposed to your finance lead. Slice by any dimension. Export to CSV for the accounting system.',
    phase: 1,
    personas: ['alex', 'bella', 'diana'],
    consoleRoute: '/cost-analytics',
  },
  {
    id: 'incidents',
    name: 'Incidents',
    tagline: 'p99 spikes, OOM events, evictions — surfaced, not buried.',
    body:
      'Every anomaly that crosses a threshold becomes an incident with a timeline, the affected deployment, and the postmortem notes. Slack-integrated.',
    phase: 2,
    personas: ['charlie', 'bella'],
    consoleRoute: '/incidents',
  },
  {
    id: 'multi-tenancy',
    name: 'Multi-Tenancy',
    tagline: 'Organization → Project → Resource, with RBAC at every boundary.',
    body:
      'Three-level isolation with Owner / Admin / Developer / Read-only / Billing roles. API keys scoped to a project. Per-project budgets and alerts.',
    phase: 2,
    personas: ['diana', 'bella'],
  },
  {
    id: 'private-deploy',
    name: 'Private Deployment',
    tagline: 'Same Console. On your data center. No Ultralisk telemetry leaves.',
    body:
      'Phase 3 ships a single Helm chart that runs the Console, the gateway, and Zealot in your Kubernetes cluster. SSO/SAML, audit log, and license baked in.',
    phase: 3,
    personas: ['diana'],
  },
  {
    id: 'integrations',
    name: 'Integrations',
    tagline: 'Slack, PagerDuty, webhooks, SSO providers — wired in.',
    body:
      'The Console speaks the same SaaS you already use. Incidents to Slack, alerts to PagerDuty, billing events to your warehouse via webhook.',
    phase: 2,
    personas: ['charlie', 'diana'],
  },
];