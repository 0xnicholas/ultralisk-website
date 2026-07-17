# Ultralisk Website

The official marketing site for [Ultralisk](https://github.com/0xnicholas/Ultralisk) — an AI inference cloud for open-source LLMs with OpenAI-compatible APIs and transparent per-token pricing.

Built with **Astro 7.1** (static output) and a sprinkle of **Preact** for the few interactive bits.

## Stack

- **Astro 7.1** — Rust compiler, Vite 8 / Rolldown bundler
- **TypeScript** — strict mode
- **Vanilla CSS** + CSS variables for the design system (no Tailwind / UI library)
- **Preact** — only where JS interactivity is required (theme toggle, mobile nav, contact form, model filter)
- **Shiki** (built into Astro) for code highlighting
- **pnpm** for package management

## Pages

| Route | Purpose |
|---|---|
| `/` | Home — hero, value props, model preview, code sample, CTA |
| `/models` | Model catalog with capability filter |
| `/pricing` | Endpoint tiers, model price table, FAQ |
| `/docs` | Quickstart with cURL / Python / Node / streaming examples |
| `/contact` | Phase 1 invitation request form |
| `/privacy`, `/terms` | Legal placeholders |
| `/404` | Custom not-found |

## Local development

```bash
pnpm install
pnpm dev           # http://localhost:4321
```

## Build & preview

```bash
pnpm build         # outputs to ./dist
pnpm preview       # serves ./dist on http://localhost:4321
pnpm check         # type-check (astro check)
```

The build is fully static — `dist/` contains HTML, JS islands, CSS, sitemap, and robots.txt, ready for any static host.

## Deployment

The output is a plain static site. Drop `dist/` on any static host. Below are the three most common paths.

### Cloudflare Pages

```bash
# via Wrangler
pnpm build
wrangler pages deploy dist --project-name=ultralisk
```

Or connect the GitHub repo to Cloudflare Pages with:
- Build command: `pnpm build`
- Build output: `dist`
- Node version: `22`

### Vercel

```bash
# via Vercel CLI
pnpm build
vercel deploy --prebuilt
```

Or import the GitHub repo. Vercel auto-detects Astro and uses `pnpm build` / `dist`.

### GitHub Pages

```bash
# add to astro.config.mjs:
#   site: 'https://<org>.github.io'
#   base: '/ultralisk-website'
pnpm build
# Push dist/ to gh-pages branch (e.g. with the gh-pages action)
```

For a custom domain on GitHub Pages, point a CNAME from `ultralisk.io` to `<org>.github.io` and add a `public/CNAME` file containing `ultralisk.io` before building.

### Other hosts

Any host that serves static files works: Netlify, AWS S3 + CloudFront, Render, Fly static, etc. No server runtime required.

## Project structure

```
ultralisk-website/
├── public/
│   ├── brand/         # logo SVGs (sourced from ../Ultralisk/console/brand)
│   ├── favicon.svg
│   └── robots.txt
├── src/
│   ├── components/    # Header, Footer, Hero, FeatureGrid, CodeBlock,
│   │                  # ModelCard, ModelFilter (island), ContactForm (island),
│   │                  # PricingTable, FAQ, CTA, Logo, ThemeToggle (island),
│   │                  # MobileNav (island)
│   ├── data/          # models.ts, pricing.ts (single source of truth)
│   ├── layouts/       # BaseLayout.astro, PageLayout.astro
│   ├── pages/         # index, models, pricing, docs, contact, privacy,
│   │                  # terms, 404
│   ├── styles/        # tokens.css, global.css, components.css
│   └── consts.ts      # site metadata, nav
├── astro.config.mjs
├── package.json
├── tsconfig.json
└── PLAN.md
```

## Design tokens

All colors, fonts, and spacing come from `src/styles/tokens.css`. The tokens mirror the Ultralisk brand:

| Token | Value |
|---|---|
| `--color-violet-500` | `#7c3aed` |
| `--color-cyan-400` | `#22d3ee` |
| `--color-ink-900` | `#0a0a0a` (dark bg) |
| `--color-ink-50` | `#fafafa` (light bg) |
| `--gradient-brand` | `linear-gradient(135deg, #7c3aed, #22d3ee)` |

Dark theme is default (matching the Console). Light theme via `[data-theme="light"]` or `prefers-color-scheme: light`.

## Phase 1 contact form

The contact form falls back to `mailto:` so it works without any backend. To upgrade to a real form handler:

```astro
<ContactForm client:load to="hello@ultralisk.io" endpoint="https://formspree.io/f/XXXXXX" />
```

The form will POST JSON to that endpoint instead. Recommended: [Formspree](https://formspree.io), [Plunk](https://useplunk.com), or any custom serverless function.

## Updating the catalog

Edit `src/data/models.ts` (single source of truth). Both the Home preview strip and the Models page pick up changes automatically.

## License

Internal — Ultralisk project.