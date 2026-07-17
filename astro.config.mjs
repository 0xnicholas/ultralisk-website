// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://ultralisk.io',
  output: 'static',
  trailingSlash: 'never',
  integrations: [preact({ compat: false }), sitemap()],
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  vite: {
    css: {
      transformer: 'lightningcss',
    },
  },
});