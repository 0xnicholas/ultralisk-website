import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from '~/consts';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const entries = (await getCollection('changelog')).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime()
  );

  return rss({
    title: `${SITE.name} changelog`,
    description: 'Release notes for Ultralisk: models, engine, console, and roadmap progress.',
    site: context.site ?? SITE.url,
    items: entries.map((e) => ({
      title: e.data.title,
      description: e.data.summary,
      pubDate: e.data.date,
      link: `/changelog/${e.id}`,
      categories: e.data.tags,
    })),
    customData: `<language>en-us</language>`,
    stylesheet: false,
  });
}