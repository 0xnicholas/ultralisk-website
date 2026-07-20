/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';
import type { Model, Modality } from '~/data/models';
import { formatPrice, formatContext } from '~/data/models';

interface Props {
  /** JSON-encoded Model[] */
  modelsJson: string;
  /** Available modality filters (JSON array of {key,label}) */
  filtersJson: string;
}

interface FilterOption {
  key: Modality | 'all';
  label: string;
}

/**
 * ModelFilter — client-side filter for the catalog grid.
 * Renders cards in-place so we don't ship two copies of the markup.
 */
export default function ModelFilter({ modelsJson, filtersJson }: Props) {
  const models: Model[] = JSON.parse(modelsJson);
  const filters: FilterOption[] = JSON.parse(filtersJson);
  const [active, setActive] = useState<FilterOption['key']>('all');

  const visible = useMemo(() => {
    if (active === 'all') return models;
    return models.filter((m) => m.modalities.includes(active));
  }, [active, models]);

  return (
    <div class="model-filter">
      <div class="filter-row" role="tablist" aria-label="Filter by capability">
        {filters.map((f) => (
          <button
            key={f.key}
            type="button"
            class={`chip ${active === f.key ? 'active' : ''}`}
            role="tab"
            aria-selected={active === f.key}
            onClick={() => setActive(f.key)}
          >
            {f.label}
          </button>
        ))}
        <span class="count muted">
          {visible.length} of {models.length}
        </span>
      </div>

      {visible.length === 0 ? (
        <div class="empty muted">No models match this filter.</div>
      ) : (
        <div class="grid">
          {visible.map((m) => (
            <article key={m.id} class="model-row card">
              <header>
                <span class="vendor">{m.vendor}</span>
                <h3>{m.name}</h3>
                <p class="tagline muted">{m.tagline}</p>
              </header>

              <p class="description muted">{m.description}</p>

              <dl class="meta">
                <div>
                  <dt>Context</dt>
                  <dd>{formatContext(m.context)} tokens</dd>
                </div>
                <div>
                  <dt>Params</dt>
                  <dd>{m.params}B · {m.quantization}</dd>
                </div>
                <div>
                  <dt>Modalities</dt>
                  <dd>{m.modalities.join(' · ')}</dd>
                </div>
                <div>
                  <dt>Endpoints</dt>
                  <dd>
                    {m.endpoints.map((e) => (
                      <span key={e} class={`endpoint endpoint-${e}`}>
                        {e}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>

              <footer class="row-footer">
                <div class="prices">
                  <div class="price">
                    <span class="price-label">Input</span>
                    <span class="price-value">{formatPrice(m.inputPrice)}</span>
                    <span class="price-unit">/ 1M tok</span>
                  </div>
                  <div class="price">
                    <span class="price-label">Output</span>
                    <span class="price-value">{formatPrice(m.outputPrice)}</span>
                    <span class="price-unit">/ 1M tok</span>
                  </div>
                </div>
                <a
                  href={`/docs/models/${m.id}`}
                  class="btn btn-secondary"
                  aria-label={`View ${m.name} API reference`}
                >
                  API reference
                </a>
              </footer>
            </article>
          ))}
        </div>
      )}

      <style>{`
        .model-filter { display: contents; }
        .filter-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          align-items: center;
          margin-bottom: var(--space-6);
        }
        .count {
          margin-left: auto;
          font-size: var(--text-sm);
          font-variant-numeric: tabular-nums;
        }
        .chip {
          padding: 0.5rem 1rem;
          border-radius: var(--radius-full);
          font-size: var(--text-sm);
          font-weight: 500;
          color: var(--color-fg-muted);
          background: var(--color-bg-elevated);
          border: 1px solid var(--color-border);
          transition: all var(--duration-fast) var(--ease-out);
        }
        .chip:hover {
          color: var(--color-fg);
          border-color: var(--color-border-strong);
        }
        .chip.active {
          color: white;
          background: var(--color-accent);
          border-color: transparent;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
          gap: var(--space-5);
        }
        @media (max-width: 480px) {
          .grid { grid-template-columns: 1fr; }
        }
        .model-row {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }
        .vendor {
          display: inline-block;
          font-size: var(--text-xs);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: var(--tracking-wide);
          color: var(--color-accent);
          margin-bottom: var(--space-1);
        }
        .model-row h3 {
          font-size: var(--text-xl);
          font-weight: 600;
          letter-spacing: var(--tracking-tight);
        }
        .tagline { margin-top: var(--space-1); font-size: var(--text-sm); }
        .description {
          font-size: var(--text-sm);
          line-height: var(--leading-relaxed);
        }
        .meta {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-3);
          padding-block: var(--space-4);
          border-top: 1px solid var(--color-border);
          border-bottom: 1px solid var(--color-border);
        }
        .meta dt {
          font-size: var(--text-xs);
          color: var(--color-fg-subtle);
          text-transform: uppercase;
          letter-spacing: var(--tracking-wide);
          margin-bottom: 2px;
        }
        .meta dd {
          font-size: var(--text-sm);
          font-weight: 500;
          color: var(--color-fg);
          text-transform: capitalize;
        }
        .endpoint {
          display: inline-block;
          padding: 0.1em 0.5em;
          margin-right: 0.25rem;
          border-radius: var(--radius-sm);
          font-size: var(--text-xs);
          background: var(--color-bg-subtle);
          color: var(--color-fg-muted);
          font-family: var(--font-mono);
        }
        .endpoint-serverless {
          color: var(--color-accent);
        }
        [data-theme='light'] .endpoint-serverless { color: var(--color-accent-2); }
        .row-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: var(--space-3);
          margin-top: auto;
        }
        .prices {
          display: flex;
          gap: var(--space-5);
        }
        .price {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .price-label {
          font-size: var(--text-xs);
          color: var(--color-fg-subtle);
          text-transform: uppercase;
          letter-spacing: var(--tracking-wide);
        }
        .price-value {
          font-size: var(--text-lg);
          font-weight: 600;
          color: var(--color-fg);
          font-variant-numeric: tabular-nums;
        }
        .price-unit {
          font-size: var(--text-xs);
          color: var(--color-fg-subtle);
        }
        .empty {
          padding: var(--space-12);
          text-align: center;
          border: 1px dashed var(--color-border);
          border-radius: var(--radius-xl);
        }
      `}</style>
    </div>
  );
}