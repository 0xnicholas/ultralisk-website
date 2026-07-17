#!/usr/bin/env node
/**
 * Build-time script: convert og-default.svg -> og-default.png (1200x630).
 * Runs via the `prebuild` npm script so the PNG is always fresh.
 */
import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = resolve(__dirname, '../public');
const SVG_PATH = resolve(PUBLIC_DIR, 'og-default.svg');
const PNG_PATH = resolve(PUBLIC_DIR, 'og-default.png');

async function main() {
  if (!existsSync(SVG_PATH)) {
    console.error(`✗ Missing source SVG at ${SVG_PATH}`);
    process.exit(1);
  }

  const svg = await readFile(SVG_PATH);
  const png = await sharp(svg, { density: 300 })
    .resize(1200, 630, {
      fit: 'contain',
      background: { r: 10, g: 10, b: 10, alpha: 1 },
    })
    .png({ compressionLevel: 9, quality: 95 })
    .toBuffer();

  await writeFile(PNG_PATH, png);

  const { size } = await import('node:fs').then((m) => m.statSync(PNG_PATH));
  console.log(`✓ Generated ${PNG_PATH} (${(size / 1024).toFixed(1)} KB)`);
}

main().catch((err) => {
  console.error('✗ OG image generation failed:', err);
  process.exit(1);
});