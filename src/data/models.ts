/**
 * Model catalog — single source of truth for the Models page and any
 * preview / reference surfaces elsewhere on the site.
 *
 * Phase 1 catalog (see Ultralisk roadmap §3).
 * Pricing is per 1M tokens, USD.
 */
export type Modality = 'chat' | 'embeddings' | 'code' | 'vision';
export type Quantization = 'FP16' | 'BF16' | 'AWQ-INT4' | 'FP8';

export interface CodeSample {
  /** Tab label */
  label: 'cURL' | 'Python' | 'Node' | 'Streaming';
  language: 'bash' | 'python' | 'javascript';
  code: string;
}

export interface ModelParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  required?: boolean;
  default?: string;
  description: string;
}

export interface ModelLimits {
  /** Max output tokens per request */
  maxOutput: number;
  /** Requests per minute (per API key) */
  requestsPerMinute: number;
  /** Tokens per minute (per API key) */
  tokensPerMinute: number;
}

export interface Model {
  /** Stable id used in the API (`model` parameter) and the URL */
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
  /** Backend serving this model */
  backend: 'vLLM' | 'Zealot';
  /** Short blurb for the catalog row */
  description: string;
  /** ISO release date of the upstream model (not our release) */
  released: string;
  /** Phase at which this model enters the catalog */
  phase: 1 | 2 | 3 | 4;
  /** Whether the model is currently listed for signup */
  available: boolean;
  /** Supported request parameters */
  parameters: ModelParameter[];
  /** Default sampling params */
  defaults: {
    temperature: number;
    top_p: number;
    max_tokens?: number;
  };
  /** Per-key rate limits */
  limits: ModelLimits;
  /** Featured code samples for the model page */
  samples: CodeSample[];
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
    backend: 'vLLM',
    description:
      "Meta's 70B instruction-tuned model. Strong general reasoning, code, and multilingual performance at a fraction of frontier pricing. 128K context.",
    released: '2024-12-06',
    phase: 1,
    available: true,
    parameters: [
      { name: 'model', type: 'string', required: true, description: 'Always meta-llama-3.3-70b-instruct' },
      { name: 'messages', type: 'array', required: true, description: 'List of {role, content} messages' },
      { name: 'temperature', type: 'number', default: '0.7', description: 'Sampling temperature, 0–2' },
      { name: 'top_p', type: 'number', default: '0.9', description: 'Nucleus sampling threshold' },
      { name: 'max_tokens', type: 'number', default: '4096', description: 'Max tokens to generate' },
      { name: 'stream', type: 'boolean', default: 'false', description: 'Stream tokens via SSE' },
      { name: 'stop', type: 'array', description: 'Stop sequences (up to 4)' },
      { name: 'presence_penalty', type: 'number', default: '0', description: '-2 to 2' },
      { name: 'frequency_penalty', type: 'number', default: '0', description: '-2 to 2' },
    ],
    defaults: { temperature: 0.7, top_p: 0.9, max_tokens: 4096 },
    limits: { maxOutput: 16_384, requestsPerMinute: 600, tokensPerMinute: 1_000_000 },
    samples: [
      {
        label: 'cURL',
        language: 'bash',
        code: `curl https://api.ultralisk.io/v1/chat/completions \\
  -H "Authorization: Bearer $ULTRALISK_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "meta-llama-3.3-70b-instruct",
    "messages": [
      { "role": "system", "content": "You are a senior backend engineer." },
      { "role": "user", "content": "Explain the difference between BFF and API gateway in two sentences." }
    ],
    "temperature": 0.3,
    "max_tokens": 512
  }'`,
      },
      {
        label: 'Python',
        language: 'python',
        code: `from openai import OpenAI

client = OpenAI(
    base_url="https://api.ultralisk.io/v1",
    api_key="ULTRALISK_API_KEY",
)

resp = client.chat.completions.create(
    model="meta-llama-3.3-70b-instruct",
    messages=[
        {"role": "system", "content": "You are a senior backend engineer."},
        {"role": "user", "content": "Explain the difference between BFF and API gateway in two sentences."},
    ],
    temperature=0.3,
    max_tokens=512,
)
print(resp.choices[0].message.content)`,
      },
      {
        label: 'Streaming',
        language: 'python',
        code: `from openai import OpenAI

client = OpenAI(
    base_url="https://api.ultralisk.io/v1",
    api_key="ULTRALISK_API_KEY",
)

stream = client.chat.completions.create(
    model="meta-llama-3.3-70b-instruct",
    messages=[{"role": "user", "content": "Walk me through how KV cache works in vLLM."}],
    temperature=0.5,
    max_tokens=1024,
    stream=True,
)
for chunk in stream:
    delta = chunk.choices[0].delta.content
    if delta:
        print(delta, end="", flush=True)`,
      },
    ],
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
    backend: 'vLLM',
    description:
      "Meta's 8B instruction-tuned model. Low latency and aggressive pricing make it ideal for high-volume production workloads. 128K context.",
    released: '2024-07-23',
    phase: 1,
    available: true,
    parameters: [
      { name: 'model', type: 'string', required: true, description: 'Always meta-llama-3.1-8b-instruct' },
      { name: 'messages', type: 'array', required: true, description: 'List of {role, content} messages' },
      { name: 'temperature', type: 'number', default: '0.7', description: 'Sampling temperature, 0–2' },
      { name: 'top_p', type: 'number', default: '0.9', description: 'Nucleus sampling threshold' },
      { name: 'max_tokens', type: 'number', default: '4096', description: 'Max tokens to generate' },
      { name: 'stream', type: 'boolean', default: 'false', description: 'Stream tokens via SSE' },
      { name: 'stop', type: 'array', description: 'Stop sequences (up to 4)' },
    ],
    defaults: { temperature: 0.7, top_p: 0.9, max_tokens: 4096 },
    limits: { maxOutput: 16_384, requestsPerMinute: 1200, tokensPerMinute: 4_000_000 },
    samples: [
      {
        label: 'cURL',
        language: 'bash',
        code: `curl https://api.ultralisk.io/v1/chat/completions \\
  -H "Authorization: Bearer $ULTRALISK_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "meta-llama-3.1-8b-instruct",
    "messages": [
      { "role": "user", "content": "Classify this support ticket: \\"My invoice shows usage from June but I cancelled in May.\\" Choose one: billing, account, technical, other." }
    ]
  }'`,
      },
      {
        label: 'Python',
        language: 'python',
        code: `from openai import OpenAI

client = OpenAI(
    base_url="https://api.ultralisk.io/v1",
    api_key="ULTRALISK_API_KEY",
)

resp = client.chat.completions.create(
    model="meta-llama-3.1-8b-instruct",
    messages=[
        {
            "role": "user",
            "content": 'Classify this support ticket: "My invoice shows usage from June but I cancelled in May." Choose one: billing, account, technical, other.',
        },
    ],
)
print(resp.choices[0].message.content)`,
      },
      {
        label: 'Streaming',
        language: 'python',
        code: `from openai import OpenAI

client = OpenAI(
    base_url="https://api.ultralisk.io/v1",
    api_key="ULTRALISK_API_KEY",
)

stream = client.chat.completions.create(
    model="meta-llama-3.1-8b-instruct",
    messages=[{"role": "user", "content": "Summarize the plot of 'The Great Gatsby' in two sentences."}],
    stream=True,
)
for chunk in stream:
    delta = chunk.choices[0].delta.content
    if delta:
        print(delta, end="", flush=True)`,
      },
    ],
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

/** Pretty-print large numbers: 1000000 -> "1M" */
export function formatLarge(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

/** Lookup helper used by [id].astro */
export function getModel(id: string | undefined): Model | undefined {
  if (!id) return undefined;
  return MODELS.find((m) => m.id === id);
}