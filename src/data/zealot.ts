/**
 * Zealot — Ultralisk's self-developed inference engine.
 * Single source of truth for /zealot page and Home page Zealot section.
 *
 * Source: ../Ultralisk/zealot/README.md + ../Ultralisk/docs/architecture.md §4
 */

export interface ZealotModule {
  /** Short id, used as anchor */
  id: string;
  name: string;
  /** Phase at which this module lands */
  phase: 2 | 3 | 4;
  /** One-line positioning */
  tagline: string;
  /** What it does */
  description: string;
  /** Why we built it (vs the alternative) */
  advantage: string;
  /** The "competitor" we're replacing or surpassing */
  alternative: string;
  /** Real Rust/Python API snippet (Phase 2 implementation) */
  code: string;
  language: 'rust' | 'python';
}

export const MODULES: ZealotModule[] = [
  {
    id: 'block-manager',
    name: 'Block Manager',
    phase: 2,
    tagline: 'PagedAttention in Rust, with memory safety you can rely on.',
    description:
      'Paged KV cache management in Rust. Reference-counts blocks with generation-gated handles so an attempt to free a stale handle returns Err(StaleHandle) instead of corrupting memory.',
    advantage:
      'vLLM\'s Python implementation uses manual reference counting and has documented use-after-free risk across concurrent requests. We compile the invariant into the type system.',
    alternative: 'vLLM PagedAttention',
    code: `let bm = BlockManager::new(num_blocks: 1024, block_size: 16);
let block = bm.allocate()?;        // BlockHandle, not raw int
bm.reference(&block);              // refcount++
process_request(&block).await?;
bm.free(&block);                   // returns Err(StaleHandle) if reused`,
    language: 'rust',
  },
  {
    id: 'constrained-decode',
    name: 'Constrained Decode Engine',
    phase: 2,
    tagline: 'DFA-based JSON schema enforcement. No GIL, no Python overhead.',
    description:
      'Compiles JSON schema to a deterministic finite automaton in Rust. Each token sampled by CUDA is validated on the CPU side at O(1) per token, with no interpreter overhead.',
    advantage:
      'vLLM uses the Python `outlines` library, which is accurate but pays GIL and interpreter cost per token. Zealot\'s compiled DFA is roughly an order of magnitude faster on schema-heavy traffic.',
    alternative: 'vLLM outlines / SGLang xgrammar',
    code: `let grammar = JsonSchemaCompiler::new()
    .compile(r#"{"type":"object","required":["answer"]}"#)?;

let mut state = grammar.init_state();
for token in sampler.next_tokens() {
    if !grammar.advance(&mut state, token)? {
        break;  // violates schema — reject
    }
    emit(token);
}`,
    language: 'rust',
  },
  {
    id: 'scheduler',
    name: 'Scheduler',
    phase: 2,
    tagline: 'Priority queue + block budgets + OOM preemption, all in Rust.',
    description:
      'Replaces vLLM\'s Python scheduler. Maintains priority wait queues, enforces per-request block budgets via BlockManager::try_allocate, and preempts lowest-priority sequences on OOM (recompute, not swap).',
    advantage:
      'Python GC pause in the scheduler shows up as tail-latency spikes under load. Rust\'s deterministic allocation eliminates the source — and gives us the headroom to implement OOM-aware preemption without ad-hoc logic.',
    alternative: 'vLLM async Python scheduler',
    code: `// Engine step loop
loop {
    let seqs = scheduler.admit(&mut block_budget)?;
    let batch = scheduler.form_batch(&mut priority_queue, seqs);
    let outputs = runner.forward(&batch).await?;

    for (seq, out) in batch.into_iter().zip(outputs) {
        if out.finished {
            scheduler.complete(seq);
        } else if block_budget.exhausted() {
            scheduler.preempt_lowest(seq);  // recompute path
        } else {
            scheduler.continue_seq(seq);
        }
    }
}`,
    language: 'rust',
  },
];

export interface RoadmapMilestone {
  id: string;
  phase: 2 | 3 | 4;
  /** Month from now (rough) */
  month: string;
  title: string;
  body: string;
  /** Whether the milestone is shipped, in progress, or planned */
  status: 'shipped' | 'in-progress' | 'planned';
}

export const MILESTONES: RoadmapMilestone[] = [
  {
    id: 'm2-1',
    phase: 2,
    month: 'M4',
    title: 'Zealot engine launches',
    body:
      'Block Manager, Constrained Decode, and Scheduler land behind a feature flag. Backend runs alongside vLLM for A/B comparison on Llama 3.1 8B.',
    status: 'in-progress',
  },
  {
    id: 'm3-1',
    phase: 3,
    month: 'M9',
    title: 'Zealot alpha',
    body:
      'Internal benchmark reaches 2× vLLM vanilla throughput on Llama 3.3 70B at the same p99 latency. First CUDA attention kernel merged.',
    status: 'planned',
  },
  {
    id: 'm3-2',
    phase: 3,
    month: 'M11',
    title: 'Zealot 1.0 stable',
    body:
      'Default backend for all Serverless and Reserved endpoints. RadixAttention (SGLang-style prefix-tree KV cache) integrated.',
    status: 'planned',
  },
  {
    id: 'm3-3',
    phase: 3,
    month: 'M12',
    title: '80%+ of Together TIE',
    body:
      'Public benchmarks show Zealot at ≥80% of Together Inference Engine on the published Llama 3.1 workload. Continuous batching + global fairness scheduler stabilize tail latency.',
    status: 'planned',
  },
  {
    id: 'm4-1',
    phase: 4,
    month: 'M15+',
    title: 'B200 / GB200 support',
    body:
      'Port attention kernels to next-gen hardware. FP4 / FP6 mixed-precision experiments for further price reduction.',
    status: 'planned',
  },
];

export interface PositionPillar {
  title: string;
  body: string;
}

export const POSITION_PILLARS: PositionPillar[] = [
  {
    title: 'Built to be inspected.',
    body:
      'Every token — from request admission to CUDA kernel launch — runs through code we wrote and can show you. No upstream fork drift, no surprise upstream changes.',
  },
  {
    title: 'Hot path in Rust.',
    body:
      'gRPC server, scheduler, block manager, constrained decode — all Rust. Predictable latency under load. No GIL pauses surfacing as p99 spikes.',
  },
  {
    title: 'CUDA where it matters.',
    body:
      'Custom attention and quantization kernels, not a generic matmul library. Phase 3 ships a hand-tuned kernel for Llama-family attention.',
  },
];