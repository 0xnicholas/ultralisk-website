/**
 * Status page data — service catalog, uptime history, and incidents.
 *
 * Phase 1 implementation: synthetic but deterministic data, structured so
 * it can be swapped for a real status backend (e.g. statuspage.io API,
 * Better Stack, Instatus, or in-house) without touching the page.
 *
 * To go live: replace SYNTHETIC_* exports with a fetch from your backend,
 * preferably a Vercel/Cloudflare edge function that caches for 30s.
 */

export type ServiceStatus = 'operational' | 'degraded' | 'outage' | 'maintenance';

export interface Service {
  id: string;
  name: string;
  description: string;
  /** Component layer for grouping in UI */
  layer: 'inference' | 'platform' | 'infrastructure';
  /** Current status — defaulted to operational when all 90 days are green */
  status: ServiceStatus;
}

export const SERVICES: Service[] = [
  {
    id: 'api-chat',
    name: 'Chat Completions API',
    description: 'POST /v1/chat/completions — Llama 3.3 70B and 3.1 8B on Serverless.',
    layer: 'inference',
    status: 'operational',
  },
  {
    id: 'api-embeddings',
    name: 'Embeddings API',
    description: 'POST /v1/embeddings — text-embedding inference, OpenAI-compatible.',
    layer: 'inference',
    status: 'operational',
  },
  {
    id: 'batch',
    name: 'Batch Jobs',
    description: 'Async job submission and polling. 24h SLA, 50% off list price.',
    layer: 'inference',
    status: 'operational',
  },
  {
    id: 'console',
    name: 'Console',
    description: 'console.ultralisk.io — Dashboard, Models, Playground, API Keys, Billing.',
    layer: 'platform',
    status: 'operational',
  },
  {
    id: 'gateway',
    name: 'Gateway',
    description: 'Rust API gateway — auth, rate limit, routing, SSE streaming.',
    layer: 'infrastructure',
    status: 'operational',
  },
  {
    id: 'engine',
    name: 'Inference Engine',
    description: 'vLLM (Phase 1) — Zealot Rust engine is in A/B behind a feature flag.',
    layer: 'infrastructure',
    status: 'operational',
  },
];

export interface IncidentUpdate {
  /** ISO timestamp */
  at: string;
  status: IncidentStatus;
  body: string;
}

export type IncidentStatus = 'investigating' | 'identified' | 'monitoring' | 'resolved';
export type IncidentSeverity = 'minor' | 'major' | 'critical';

export interface Incident {
  id: string;
  title: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  /** ISO timestamp */
  createdAt: string;
  /** ISO timestamp when resolved (undefined for active incidents) */
  resolvedAt?: string;
  /** Service ids affected */
  affectedServices: string[];
  updates: IncidentUpdate[];
}

const ISO = (d: string) => new Date(d).toISOString();

export const ACTIVE_INCIDENTS: Incident[] = [
  // Intentionally empty — all operational for the Phase 1 launch period.
  // When you go live, drop resolved/active incidents here.
];

export const PAST_INCIDENTS: Incident[] = [
  {
    id: '2026-09-30-cold-start',
    title: 'Elevated p99 on cold Serverless requests',
    severity: 'minor',
    status: 'resolved',
    createdAt: ISO('2026-09-30T08:14:00Z'),
    resolvedAt: ISO('2026-09-30T11:42:00Z'),
    affectedServices: ['api-chat', 'engine'],
    updates: [
      {
        at: ISO('2026-09-30T08:14:00Z'),
        status: 'investigating',
        body:
          'We are investigating reports of elevated p99 latency on cold Serverless chat completion requests. Warm requests are unaffected.',
      },
      {
        at: ISO('2026-09-30T09:30:00Z'),
        status: 'identified',
        body:
          'Identified the cause: a memory pressure event on a single H100 node after a model reload. The replica has been drained and replaced.',
      },
      {
        at: ISO('2026-09-30T11:42:00Z'),
        status: 'resolved',
        body:
          'Latency returned to baseline (p99 < 400ms) after the replacement replica warmed up. We are adding a probe that drains over-pressured replicas before they degrade.',
      },
    ],
  },
  {
    id: '2026-09-12-batch-queue',
    title: 'Batch queue depth elevated',
    severity: 'minor',
    status: 'resolved',
    createdAt: ISO('2026-09-12T15:22:00Z'),
    resolvedAt: ISO('2026-09-12T19:05:00Z'),
    affectedServices: ['batch'],
    updates: [
      {
        at: ISO('2026-09-12T15:22:00Z'),
        status: 'investigating',
        body:
          'Batch job turnaround exceeded our 24h SLA on a subset of jobs submitted in the last 6 hours. We are investigating queue depth.',
      },
      {
        at: ISO('2026-09-12T16:40:00Z'),
        status: 'identified',
        body:
          'A spike in Serverless traffic reduced the capacity available for Batch admission. The scheduler was favoring p50 latency over Batch SLA.',
      },
      {
        at: ISO('2026-09-12T19:05:00Z'),
        status: 'resolved',
        body:
          'Adjusted scheduler weights to give Batch higher priority when its queue age exceeds 4h. Backlog cleared by 19:00 UTC. Updated SLA: average Batch turnaround is now ~3h.',
      },
    ],
  },
  {
    id: '2026-08-18-gateway-5xx',
    title: 'Elevated 5xx on chat completions',
    severity: 'major',
    status: 'resolved',
    createdAt: ISO('2026-08-18T03:11:00Z'),
    resolvedAt: ISO('2026-08-18T03:48:00Z'),
    affectedServices: ['api-chat', 'gateway'],
    updates: [
      {
        at: ISO('2026-08-18T03:11:00Z'),
        status: 'investigating',
        body:
          'We are investigating a spike in 5xx responses on POST /v1/chat/completions.',
      },
      {
        at: ISO('2026-08-18T03:24:00Z'),
        status: 'identified',
        body:
          'A misconfigured health check in the gateway was prematurely routing requests away from a healthy replica. Rolled back.',
      },
      {
        at: ISO('2026-08-18T03:48:00Z'),
        status: 'resolved',
        body:
          '5xx rate returned to baseline (<0.1%). Adding regression tests to the gateway deployment pipeline.',
      },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*  Synthetic 90-day uptime history                                            */
/* -------------------------------------------------------------------------- */

/**
 * Deterministic seeded RNG. Stable across builds.
 * Returns a function that produces 0..1 floats.
 */
function makeRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

/** Days of synthetic uptime per service. Mostly green. */
export interface UptimeDay {
  date: string; // YYYY-MM-DD
  status: ServiceStatus;
}

function generateUptime(serviceId: string, days: number): UptimeDay[] {
  // Seed from service id hash so each service has a consistent pattern
  let hash = 0;
  for (let i = 0; i < serviceId.length; i++) {
    hash = (hash * 31 + serviceId.charCodeAt(i)) >>> 0;
  }
  const rng = makeRng(hash);

  const out: UptimeDay[] = [];
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setUTCDate(today.getUTCDate() - i);
    const date = d.toISOString().slice(0, 10);

    // 96% operational. 3% degraded. 0.5% outage. 0.5% maintenance.
    const r = rng();
    let status: ServiceStatus = 'operational';
    if (r < 0.005) status = 'outage';
    else if (r < 0.035) status = 'degraded';
    else if (r < 0.04) status = 'maintenance';

    out.push({ date, status });
  }
  return out;
}

export const UPTIME_HISTORY: Record<string, UptimeDay[]> = Object.fromEntries(
  SERVICES.map((s) => [s.id, generateUptime(s.id, 90)])
);

/** Compute uptime percentage over the window */
export function uptimePercent(days: UptimeDay[]): number {
  if (days.length === 0) return 100;
  const ok = days.filter((d) => d.status === 'operational').length;
  return Math.round((ok / days.length) * 1000) / 10;
}

/* -------------------------------------------------------------------------- */
/*  Overall status derivation                                                  */
/* -------------------------------------------------------------------------- */

export interface OverallStatus {
  status: ServiceStatus;
  label: string;
  description: string;
}

export function overallStatus(services: Service[]): OverallStatus {
  const has = (s: ServiceStatus) => services.some((x) => x.status === s);
  if (has('outage'))
    return {
      status: 'outage',
      label: 'Major system outage',
      description: 'One or more services are experiencing an outage. We are working on it.',
    };
  if (has('degraded'))
    return {
      status: 'degraded',
      label: 'Partial system outage',
      description: 'Some services are degraded. Functionality is impacted but not broken.',
    };
  if (has('maintenance'))
    return {
      status: 'maintenance',
      label: 'Scheduled maintenance',
      description: 'Planned maintenance is in progress. Some services may be temporarily unavailable.',
    };
  return {
    status: 'operational',
    label: 'All systems operational',
    description: 'Every service is running normally.',
  };
}

export const STATUS_META: Record<ServiceStatus, { label: string; color: string }> = {
  operational: { label: 'Operational', color: '#22c55e' },
  degraded: { label: 'Degraded', color: '#f59e0b' },
  outage: { label: 'Outage', color: '#ef4444' },
  maintenance: { label: 'Maintenance', color: '#22d3ee' },
};