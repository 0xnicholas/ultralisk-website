/**
 * Pricing data — single source of truth for /pricing page.
 * Prices are USD per 1M tokens. Reflects Phase 1 catalog (Ultralisk roadmap §3).
 */
export type EndpointKind = 'serverless' | 'batch' | 'reserved' | 'dedicated';

export interface PricingTier {
  kind: EndpointKind;
  name: string;
  description: string;
  /** Availability phase (1-4) */
  phase: 1 | 2 | 3 | 4;
  /** Per-token discount vs serverless, e.g. 0.5 = 50% off */
  priceMultiplier?: number;
}

export const TIERS: PricingTier[] = [
  {
    kind: 'serverless',
    name: 'Serverless',
    description: 'Pay-per-token, no commitments. Auto-scales with demand.',
    phase: 1,
  },
  {
    kind: 'batch',
    name: 'Batch',
    description: '50% discount for non-time-sensitive workloads. Async results within 24h.',
    phase: 1,
    priceMultiplier: 0.5,
  },
  {
    kind: 'reserved',
    name: 'Reserved',
    description: 'Reserved throughput for production traffic. Predictable cost, capacity guarantee.',
    phase: 2,
  },
  {
    kind: 'dedicated',
    name: 'Dedicated',
    description: 'Private deployment on dedicated GPU capacity. Single-tenant, full isolation.',
    phase: 3,
  },
];

export interface FAQ {
  question: string;
  answer: string;
}

export const FAQS: FAQ[] = [
  {
    question: 'How does per-token pricing work?',
    answer:
      'You are billed for every input and output token at the rates shown above. We meter at the gateway and never round up. Streaming tokens are billed as they arrive.',
  },
  {
    question: 'Are there any hidden fees?',
    answer:
      'No. No seat fees, no per-request fees, no ingress or egress charges. The only line item on your bill is tokens consumed.',
  },
  {
    question: 'How does Batch pricing work?',
    answer:
      'Batch is 50% off the listed token price for async workloads with up to 24-hour SLA. Use the same /v1/chat/completions endpoint with `batch: true` in the request body, or submit jobs via the Console.',
  },
  {
    question: 'Do you offer volume discounts?',
    answer:
      'Yes. Customers spending over $5k/month on serverless traffic automatically qualify for tiered discounts. Contact us for committed-use agreements.',
  },
  {
    question: 'Can I set a budget cap?',
    answer:
      'Yes. In the Console under Billing, set a monthly spend limit. We will email you at 80% and 100% utilization, and pause requests at 110% unless you opt out.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'Wire transfer and major credit cards during Phase 1. Invoice terms available for committed-volume customers.',
  },
];