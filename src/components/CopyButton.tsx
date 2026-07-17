/** @jsxImportSource preact */
import { useEffect, useRef, useState } from 'preact/hooks';

interface Props {
  /** Code payload to copy (server-injected as JSON-encoded string) */
  payload: string;
  /** Accessible label */
  label?: string;
}

/**
 * CopyButton — copies `payload` to clipboard with a 1.5s "Copied" feedback.
 * Uses navigator.clipboard when available, falls back to a hidden textarea.
 */
export default function CopyButton({ payload, label = 'Copy code' }: Props) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  async function copy() {
    const text = JSON.parse(payload) as string;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for non-secure contexts (e.g. plain http://127.0.0.1).
        // execCommand is deprecated but still the most reliable fallback
        // for non-HTTPS local dev where navigator.clipboard is unavailable.
        const legacyDoc = document as Document & {
          execCommand?: (cmd: string) => boolean;
        };
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        legacyDoc.execCommand?.('copy');
        document.body.removeChild(ta);
      }
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1500);
    } catch {
      // Silently fail; user can retry
    }
  }

  return (
    <button
      type="button"
      class={`copy-btn ${copied ? 'copied' : ''}`}
      onClick={copy}
      aria-label={label}
      title={copied ? 'Copied!' : label}
    >
      {copied ? (
        <>
          <svg
            viewBox="0 0 16 16"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M3 8l3 3 7-7" />
          </svg>
          <span>Copied</span>
        </>
      ) : (
        <>
          <svg
            viewBox="0 0 16 16"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <rect x="5" y="5" width="9" height="9" rx="1.5" />
            <path d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2h-6A1.5 1.5 0 0 0 2 3.5v6A1.5 1.5 0 0 0 3.5 11H5" />
          </svg>
          <span>Copy</span>
        </>
      )}
    </button>
  );
}