/**
 * Model catalog — single source of truth for the Models page and any
 * preview / reference surfaces elsewhere on the site.
 *
 * Phase 1 catalog (see Ultralisk roadmap §3).
 * Pricing is per 1M tokens, USD.
 */
export type Modality = 'chat' | 'embeddings' | 'code' | 'vision';
export type Quantization = 'FP16' | 'BF16' | 'AWQ-INT4' | 'FP8';

export interface Model {
  /** Stable id used in the API (`model` parameter) */
  id: string;
  /** Display name */
  name: string;
  /** Short tagline shown in cards */
  tagline: string;
  /** Vendor */
  vendor: 'Meta' | 'Mistral' | 'Qwen' | 'DeepSeek' | 'Google';
  /** Family (Llama 3.x, Mistral, ...) */
  family: string;
  /** Parameter count, in billions */
  params: number;
  /** Context window, in tokens */
  context: number;
  /** Modality tags */
  modalities: Modality[];
  /** Quantization used at serving time */
  quantization: Quantization;
  /** USD per 1M input tokens */
  inputPrice: number;
  /** USD per 1M output tokens */
  outputPrice: number;
  /** Available endpoints */
  endpoints: ('serverless' | 'batch' | 'reserved' | 'dedicated')[];
  /** Short blurb for the detail row */
  description: string;
  /** ISO release date of the upstream model (not our release) */
  released: string;
  /** Phase at which this model enters the catalog */
  phase: 1 | 2 | 3 | 4;
  /** Whether the model is currently listed for signup */
  available: boolean;
}

export const MODELS: Model[] = [
  {
    id: 'meta-llama-3.3-70b-instruct',
    name: 'Llama 3.3 70B Instruct',
    tagline: 'Open flagship reasoning at fraction of frontier cost.',
    vendor: 'Meta',
    family: 'Llama 3.x',
    params: 70,
    context: 131_072,
    modalities: ['chat', 'code'],
    quantization: 'AWQ-INT4',
    inputPrice: 0.59,
    outputPrice: 0.79,
    endpoints: ['serverless', 'batch'],
    description:
      'Meta\'s 70B instruction-tuned model. Strong general reasoning, code, and multilingual performance at a fraction of frontier pricing. 128K context.',
    released: '2024-12-06',
    phase: 1,
    available: true,
  },
  {
    id: 'meta-llama-3.1-8b-instruct',
    name: 'Llama 3.1 8B Instruct',
    tagline: 'Fast, cheap, capable. The default for production traffic.',
    vendor: 'Meta',
    family: 'Llama 3.x',
    params: 8,
    context: 131_072,
    modalities: ['chat', 'code'],
    quantization: 'AWQ-INT4',
    inputPrice: 0.05,
    outputPrice: 0.08,
    endpoints: ['serverless', 'batch'],
    description:
      'Meta\'s 8B instruction-tuned model. Low latency and aggressive pricing make it ideal for high-volume production workloads. 128K context.',
    released: '2024-07-23',
    phase: 1,
    available: true,
  },
];

export const AVAILABLE_MODELS = MODELS.filter((m) => m.available);

/** Pretty-print price: 0.59 -> "$0.59" */
export function formatPrice(usd: number): string {
  if (usd < 0.01) return `$${usd.toFixed(3)}`;
  return `$${usd.toFixed(2)}`;
}

/** Pretty-print context: 131072 -> "128K" */
export function formatContext(tokens: number): string {
  if (tokens >= 1_000_000) return `${(tokens / 1_000_000).toFixed(0)}M`;
  if (tokens >= 1_000) return `${Math.round(tokens / 1_000)}K`;
  return String(tokens);
}