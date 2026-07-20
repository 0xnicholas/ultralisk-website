// Site-wide constants and configuration
export const SITE = {
  name: 'Ultralisk',
  tagline: 'Run open models. On our engine.',
  description:
    'Ultralisk is an AI inference cloud for open-source LLMs. OpenAI-compatible API, per-token pricing, powered by a self-built Rust inference engine.',
  url: 'https://ultralisk.io',
  email: 'hello@ultralisk.io',
  consoleUrl: 'https://console.ultralisk.io',
  twitter: 'https://twitter.com/ultralisk',
  github: 'https://github.com/0xnicholas/Ultralisk',
  ogImage: '/og-default.png',
  locale: 'en-US',
} as const;

export const NAV = [
  { href: '/models', label: 'Models' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/platform', label: 'Platform' },
  { href: '/docs', label: 'Docs' },
] as const;

export type NavItem = (typeof NAV)[number];