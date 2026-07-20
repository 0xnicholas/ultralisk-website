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
const ASSETS = [
  { svg: 'og-default.svg', png: 'og-default.png' },
  { svg: 'og-zealot.svg', png: 'og-zealot.png' },
];

async function main() {
  for (const asset of ASSETS) {
    const svgPath = resolve(PUBLIC_DIR, asset.svg);
    const pngPath = resolve(PUBLIC_DIR, asset.png);
    if (!existsSync(svgPath)) {
      console.error(`✗ Missing source SVG at ${svgPath}`);
      process.exit(1);
    }
    const svg = await readFile(svgPath);
    const png = await sharp(svg, { density: 300 })
      .resize(1200, 630, {
        fit: 'contain',
        background: { r: 18, g: 17, b: 15, alpha: 1 },
      })
      .png({ compressionLevel: 9, quality: 95 })
      .toBuffer();
    await writeFile(pngPath, png);
    const { size } = await import('node:fs').then((m) => m.statSync(pngPath));
    console.log(`✓ Generated ${pngPath} (${(size / 1024).toFixed(1)} KB)`);
  }
}

main().catch((err) => {
  console.error('✗ OG image generation failed:', err);
  process.exit(1);
});