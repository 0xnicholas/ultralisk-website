/** @jsxImportSource preact */
import { useEffect, useState } from 'preact/hooks';

interface Props {
  /** Nav links injected as JSON-encoded string from the server */
  links?: string;
  ctaHref?: string;
  consoleHref?: string;
}

/**
 * MobileNav — hamburger menu revealed on small viewports.
 * Hidden ≥ 880px via CSS (Header handles desktop nav).
 */
export default function MobileNav({ links, ctaHref = '/contact', consoleHref = '' }: Props) {
  const [open, setOpen] = useState(false);
  const navItems: { href: string; label: string }[] = links ? JSON.parse(links) : [];

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <button
        class="mobile-trigger"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label="Toggle menu"
        type="button"
      >
        <span class={`hamburger ${open ? 'open' : ''}`} aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>

      <div id="mobile-nav" class={`mobile-panel ${open ? 'open' : ''}`} aria-hidden={!open}>
        <nav>
          <ul>
            {navItems.map((item) => (
              <li>
                <a href={item.href} onClick={() => setOpen(false)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div class="actions">
            {consoleHref && (
              <a href={consoleHref} class="btn btn-secondary" onClick={() => setOpen(false)}>
                Sign in
              </a>
            )}
            <a href={ctaHref} class="btn btn-primary" onClick={() => setOpen(false)}>
              Request access
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}