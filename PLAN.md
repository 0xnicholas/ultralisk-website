# Ultralisk Website — Build Plan

**Status**: In Progress
**Stack**: Astro 7.1 (static), TypeScript strict, vanilla CSS + CSS variables, Preact islands, Shiki, pnpm
**Scope**: English-only, MVP (5 pages), static deploy

## Information Architecture

| Route | Page | Purpose |
|---|---|---|
| `/` | Home | Hero, value props, model preview, API code sample, CTAs |
| `/models` | Models | Model catalog (Phase 1: Llama 3.1 8B, Llama 3.3 70B) |
| `/pricing` | Pricing | Token-based pricing, endpoint types, FAQ |
| `/docs` | Quickstart | API key, cURL / Python / streaming examples |
| `/contact` | Trial Request | Invitation-only request form |
| `/404` | Not Found | Brand-consistent fallback |

## Design System

Tokens (mirrors Ultralisk brand):

| Token | Value | Use |
|---|---|---|
| `--color-violet-500` | `#7C3AED` | Brand gradient start |
| `--color-cyan-400` | `#22D3EE` | Brand gradient end |
| `--color-ink-900` | `#0A0A0A` | Dark background |
| `--color-ink-50` | `#FAFAFA` | Light background |
| `--font-sans` | Inter Variable | Body |
| `--font-mono` | JetBrains Mono | Code |

Dark default, `[data-theme="light"]` opt-in. Logos sourced from `../Ultralisk/console/brand/`.

## Tech Decisions

- **Astro 7.1** — Rust compiler, Vite 8, Rolldown bundler
- **No Tailwind / UI library** — keep tech stack disjoint from console (React + Mantine)
- **Preact only for islands** — smaller than React; only used where JS interactivity needed (nav toggle, contact form, model filter)
- **Shiki** (built-in) for code highlighting
- **Content Collections** — `deferRender` enabled for future blog collections
- **view transitions** — enabled for smooth page nav

## Project Layout

```
ultralisk-website/
├── public/
│   ├── brand/             # logo.svg, logo-on-{dark,light}.svg, logo-mono.svg
│   └── favicon.svg
├── src/
│   ├── components/        # Header, Footer, Hero, FeatureGrid, CodeBlock,
│   │                      # ModelCard, PricingTable, CTA, Logo, ThemeToggle
│   ├── data/              # models.ts, pricing.ts, site.ts (single source of truth)
│   ├── layouts/           # BaseLayout.astro, PageLayout.astro
│   ├── pages/             # index, models, pricing, docs, contact, 404
│   ├── styles/            # tokens.css, global.css
│   └── consts.ts          # nav, site metadata
├── astro.config.mjs
├── package.json
├── tsconfig.json
└── PLAN.md
```

## Build Steps

| # | Step | Verify |
|---|---|---|
| 1 | Scaffold Astro 7 project, copy logos to `public/brand/` | `pnpm dev` starts clean |
| 2 | Design tokens + global styles + BaseLayout (SEO, OG, view transitions) | Theme toggle works on blank page |
| 3 | Header + Footer + Logo component | Responsive nav, mobile menu |
| 4 | Home page (Hero / Features / Code / CTA) | Lighthouse ≥ 95 desktop + mobile |
| 5 | Models page driven by `src/data/models.ts` | Filter by capability works |
| 6 | Pricing page (table + FAQ) | Single data source; extensible for Phase 2 endpoints |
| 7 | Quickstart docs (cURL + Python + Streaming) | Shiki highlight + copy button |
| 8 | Contact form (mailto: or formspree) | Submission succeeds |
| 9 | 404 + robots.txt + sitemap | Every page has canonical, OG, Twitter card |
| 10 | Build + deploy docs (CF Pages / Vercel / GH Pages) | `pnpm build` passes; README has 3 deploy recipes |

## Non-Goals

- No backend / no auth (link to console.ultralisk.io)
- No payments / no subscriptions (invitation-only)
- No blog / changelog (defer to post-MVP via Content Collections)
- No Tailwind / no UI library (avoid dual stack with console)
- No i18n (English only)