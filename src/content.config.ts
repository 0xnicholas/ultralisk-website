import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Changelog collection — one markdown entry per release milestone.
 * Drives /changelog, /changelog/[slug], and the RSS feed.
 *
 * Entries live at src/content/changelog/*.md with frontmatter:
 *
 *   ---
 *   title: Zealot engine launches
 *   date: 2026-05-12
 *   summary: Block Manager, Constrained Decode, and Scheduler ship behind a feature flag.
 *   tags: [added, improved]
 *   phase: 2
 *   ---
 *
 * Slug is derived from the filename (e.g. zealot-engine-launches.md -> /changelog/zealot-engine-launches).
 */
const changelog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/changelog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    tags: z
      .array(z.enum(['added', 'improved', 'fixed', 'deprecated', 'security']))
      .default([]),
    /** Roadmap phase this entry is part of (1-4) */
    phase: z.number().int().min(1).max(4).optional(),
  }),
});

export const collections = { changelog };