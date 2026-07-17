#!/usr/bin/env node
/**
 * Visual verification: capture screenshots of every key page
 * at desktop and mobile viewports, plus a light-theme variant.
 *
 * Usage:
 *   pnpm build
 *   pnpm preview &           # serves dist/ on http://127.0.0.1:4322
 *   node scripts/screenshot.mjs
 *
 * Outputs to ./screenshots/<viewport>/<page>.png
 */
import { chromium, devices } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const OUT = resolve(ROOT, 'screenshots');
const BASE = process.env.SCREENSHOT_BASE ?? 'http://127.0.0.1:4322';

const VIEWPORTS = {
  desktop: { width: 1280, height: 800 },
  mobile: { width: 390, height: 844, isMobile: true, deviceScaleFactor: 2 },
};

const PAGES = [
  { slug: 'home', path: '/' },
  { slug: 'models', path: '/models' },
  { slug: 'pricing', path: '/pricing' },
  { slug: 'docs', path: '/docs' },
  { slug: 'platform', path: '/platform' },
  { slug: 'zealot', path: '/zealot' },
  { slug: 'changelog', path: '/changelog' },
  { slug: 'changelog-entry', path: '/changelog/zealot-alpha' },
  { slug: 'contact', path: '/contact' },
  { slug: 'model-70b', path: '/docs/models/meta-llama-3.3-70b-instruct' },
  { slug: 'model-8b', path: '/docs/models/meta-llama-3.1-8b-instruct' },
  { slug: '404', path: '/this-route-does-not-exist' },
];

const errors = [];

async function main() {
  if (!existsSync(OUT)) await mkdir(OUT, { recursive: true });

  const browser = await chromium.launch();

  // Desktop + mobile captures
  for (const [vpName, vp] of Object.entries(VIEWPORTS)) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: vp.deviceScaleFactor ?? 1,
      isMobile: vp.isMobile ?? false,
      hasTouch: vp.isMobile ?? false,
      colorScheme: 'dark',
    });

    for (const page of PAGES) {
      const p = await ctx.newPage();
      const pageErrors = [];
      p.on('pageerror', (err) => pageErrors.push(`pageerror: ${err.message}`));
      p.on('console', (msg) => {
        if (msg.type() === 'error') pageErrors.push(`console.error: ${msg.text()}`);
      });
      p.on('response', (resp) => {
        if (resp.status() >= 400) {
          pageErrors.push(`HTTP ${resp.status()} ${resp.url()}`);
        }
      });

      const url = `${BASE}${page.path}`;
      try {
        await p.goto(url, { waitUntil: 'networkidle', timeout: 15_000 });
      } catch (err) {
        pageErrors.push(`navigation: ${err.message}`);
      }

      // Give view transitions / fonts a moment to settle
      await p.waitForTimeout(800);

      const outDir = resolve(OUT, vpName);
      if (!existsSync(outDir)) await mkdir(outDir, { recursive: true });

      // Full page screenshot
      await p.screenshot({
        path: resolve(outDir, `${page.slug}.png`),
        fullPage: true,
        animations: 'disabled',
      });

      // Above-the-fold screenshot for the home page
      if (vpName === 'desktop' && page.slug === 'home') {
        await p.screenshot({
          path: resolve(outDir, `${page.slug}-fold.png`),
          fullPage: false,
          animations: 'disabled',
        });
      }

      await p.close();

      if (pageErrors.length) {
        errors.push({ page: `${vpName}/${page.slug}`, url, errors: pageErrors });
      }
    }

    await ctx.close();
  }

  // Light theme variant (desktop, home only — for sanity check)
  {
    const ctx = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      colorScheme: 'light',
    });
    // Pre-set localStorage so the bootstrap script applies light theme
    await ctx.addInitScript(() => {
      try {
        localStorage.setItem('ultralisk-theme', 'light');
      } catch {}
    });
    const p = await ctx.newPage();
    await p.goto(`${BASE}/`, { waitUntil: 'networkidle' });
    await p.waitForTimeout(800);
    const outDir = resolve(OUT, 'desktop-light');
    if (!existsSync(outDir)) await mkdir(outDir, { recursive: true });
    await p.screenshot({ path: resolve(outDir, 'home.png'), fullPage: true });
    await p.screenshot({ path: resolve(outDir, 'home-fold.png'), fullPage: false });
    await p.close();
    await ctx.close();
  }

  await browser.close();

  // Report
  const summary = {
    base: BASE,
    pages: PAGES.length,
    viewports: Object.keys(VIEWPORTS).length + 1, // +1 for light variant
    errors,
  };

  await writeFile(resolve(OUT, 'summary.json'), JSON.stringify(summary, null, 2));

  console.log(`\n✓ Captured ${PAGES.length} pages x ${Object.keys(VIEWPORTS).length} viewports + light home`);
  console.log(`  Output: ${OUT}`);
  if (errors.length === 0) {
    console.log('  ✓ No console errors or HTTP failures');
  } else {
    console.log(`  ⚠ ${errors.length} page(s) had issues:`);
    for (const e of errors) {
      console.log(`    - ${e.page} (${e.url}):`);
      for (const err of e.errors) console.log(`        ${err}`);
    }
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error('Screenshot script failed:', err);
  process.exit(1);
});