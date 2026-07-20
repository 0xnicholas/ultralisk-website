/** @jsxImportSource preact */
import { useState } from 'preact/hooks';

interface Props {
  /** Destination email (mailto: target) */
  to: string;
  /** Optional formspree endpoint (if set, POSTs JSON there instead of mailto) */
  endpoint?: string;
}

interface FormState {
  name: string;
  email: string;
  company: string;
  role: string;
  useCase: string;
  volume: string;
  consent: boolean;
}

const initial: FormState = {
  name: '',
  email: '',
  company: '',
  role: '',
  useCase: '',
  volume: '',
  consent: false,
};

/**
 * ContactForm — Phase 1 invitation request.
 *
 * With an `endpoint` prop, POSTs JSON to that endpoint (e.g. formspree).
 * Without one, opens the user's mail client with the form contents prefilled.
 */
export default function ContactForm({ to, endpoint }: Props) {
  const [state, setState] = useState<FormState>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setState((s) => ({ ...s, [key]: value }));
  }

  function buildBody(): string {
    return [
      `Name: ${state.name}`,
      `Email: ${state.email}`,
      `Company: ${state.company || '-'}`,
      `Role: ${state.role || '-'}`,
      `Estimated monthly volume: ${state.volume || '-'}`,
      '',
      'Use case:',
      state.useCase || '(not provided)',
    ].join('\n');
  }

  async function onSubmit(e: Event) {
    e.preventDefault();
    setError(null);

    if (!state.name.trim()) return setError('Please enter your name.');
    if (!state.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) {
      return setError('Please enter a valid email address.');
    }
    if (!state.consent) return setError('Please confirm you agree to be contacted.');

    if (endpoint) {
      setSubmitting(true);
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(state),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setSubmitted(true);
      } catch (err) {
        setError('Something went wrong submitting the form. Please email us directly.');
      } finally {
        setSubmitting(false);
      }
    } else {
      // Fallback: open mail client
      const subject = `Ultralisk access request — ${state.company || state.name}`;
      const href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(buildBody())}`;
      window.location.href = href;
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <div class="success">
        <h3>Thanks — we'll be in touch.</h3>
        <p class="muted">
          We typically respond within one business day during Phase 1 onboarding.
          In the meantime, the <a href="/docs">quickstart</a> walks through the
          API.
        </p>
      </div>
    );
  }

  return (
    <form class="contact-form" onSubmit={onSubmit} noValidate>
      <div class="row">
        <label class="field">
          <span class="label">Name <em>*</em></span>
          <input
            type="text"
            value={state.name}
            onInput={(e) => update('name', (e.target as HTMLInputElement).value)}
            required
            autocomplete="name"
            placeholder="Ada Lovelace"
          />
        </label>
        <label class="field">
          <span class="label">Email <em>*</em></span>
          <input
            type="email"
            value={state.email}
            onInput={(e) => update('email', (e.target as HTMLInputElement).value)}
            required
            autocomplete="email"
            placeholder="ada@analytical.engine"
          />
        </label>
      </div>

      <div class="row">
        <label class="field">
          <span class="label">Company</span>
          <input
            type="text"
            value={state.company}
            onInput={(e) => update('company', (e.target as HTMLInputElement).value)}
            autocomplete="organization"
            placeholder="Acme, Inc."
          />
        </label>
        <label class="field">
          <span class="label">Role</span>
          <input
            type="text"
            value={state.role}
            onInput={(e) => update('role', (e.target as HTMLInputElement).value)}
            autocomplete="organization-title"
            placeholder="ML engineer"
          />
        </label>
      </div>

      <label class="field">
        <span class="label">Estimated monthly token volume</span>
        <select
          value={state.volume}
          onChange={(e) => update('volume', (e.target as HTMLSelectElement).value)}
        >
          <option value="">Select…</option>
          <option value="< 10M tokens / month">&lt; 10M tokens / month</option>
          <option value="10M – 100M tokens / month">10M – 100M tokens / month</option>
          <option value="100M – 1B tokens / month">100M – 1B tokens / month</option>
          <option value="> 1B tokens / month">&gt; 1B tokens / month</option>
        </select>
      </label>

      <label class="field">
        <span class="label">What are you building?</span>
        <textarea
          rows={4}
          value={state.useCase}
          onInput={(e) => update('useCase', (e.target as HTMLTextAreaElement).value)}
          placeholder="A quick paragraph about your workload, latency needs, and any context that helps us match you with the right model."
        />
      </label>

      <label class="consent">
        <input
          type="checkbox"
          checked={state.consent}
          onChange={(e) => update('consent', (e.target as HTMLInputElement).checked)}
        />
        <span>
          I agree to be contacted by Ultralisk about access and onboarding.
        </span>
      </label>

      {error && (
        <div class="error" role="alert">
          {error}
        </div>
      )}

      <div class="actions">
        <button type="submit" class="btn btn-lg btn-gradient" disabled={submitting}>
          {submitting ? 'Sending…' : 'Request access'}
        </button>
        <p class="muted note">
          Or email <a href={`mailto:${to}`}>{to}</a> directly.
        </p>
      </div>

      <style>{`
        .contact-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
        }
        .row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-4);
        }
        @media (max-width: 600px) {
          .row { grid-template-columns: 1fr; }
        }
        .field {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }
        .label {
          font-size: var(--text-sm);
          font-weight: 500;
          color: var(--color-fg);
        }
        .label em {
          color: var(--color-accent);
          font-style: normal;
        }
        input[type='text'],
        input[type='email'],
        select,
        textarea {
          padding: 0.625rem 0.875rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border);
          background: var(--color-bg-elevated);
          color: var(--color-fg);
          font-size: var(--text-sm);
          font-family: inherit;
          transition: border-color var(--duration-fast) var(--ease-out),
            box-shadow var(--duration-fast) var(--ease-out);
        }
        input:focus,
        select:focus,
        textarea:focus {
          outline: none;
          border-color: var(--color-accent);
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.2);
        }
        textarea {
          resize: vertical;
          min-height: 100px;
          font-family: inherit;
        }
        .consent {
          display: flex;
          gap: var(--space-3);
          align-items: flex-start;
          font-size: var(--text-sm);
          color: var(--color-fg-muted);
          cursor: pointer;
        }
        .consent input[type='checkbox'] {
          margin-top: 4px;
          accent-color: var(--color-accent);
          width: 16px;
          height: 16px;
          flex-shrink: 0;
        }
        .error {
          padding: var(--space-3) var(--space-4);
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: var(--radius-md);
          color: #ef4444;
          font-size: var(--text-sm);
        }
        .actions {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          flex-wrap: wrap;
          margin-top: var(--space-2);
        }
        .note {
          font-size: var(--text-sm);
        }
        .note a {
          color: var(--color-accent);
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .success {
          padding: var(--space-8);
          background: var(--color-bg-elevated);
          border: 1px solid var(--color-border-strong);
          border-radius: var(--radius-xl);
          text-align: center;
        }
        .success h3 {
          font-size: var(--text-xl);
          font-weight: 600;
          letter-spacing: var(--tracking-tight);
        }
        .success p {
          margin-top: var(--space-3);
        }
        .success a {
          color: var(--color-accent);
          text-decoration: underline;
          text-underline-offset: 2px;
        }
      `}</style>
    </form>
  );
}