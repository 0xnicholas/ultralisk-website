// Site-wide constants and configuration
export const SITE = {
  name: 'Ultralisk',
  tagline: 'Open-source LLMs. OpenAI-compatible. Pay per token.',
  description:
    'Ultralisk is an AI inference cloud for open-source large language models. OpenAI-compatible API, transparent pricing, GPU-aware operations.',
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
  { href: '/docs', label: 'Quickstart' },
  { href: '/contact', label: 'Request access' },
] as const;

export type NavItem = (typeof NAV)[number];