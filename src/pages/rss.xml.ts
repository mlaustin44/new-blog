import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { site } from '../site';
import { entryHref, getAllEntries } from '../lib/entries';

export async function GET(context: APIContext) {
  const entries = (await getAllEntries()).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );
  return rss({
    title: site.name,
    description: site.description,
    site: context.site!,
    items: entries.map((entry) => ({
      title: entry.data.title,
      description: entry.data.summary,
      pubDate: entry.data.date,
      categories: entry.data.tags,
      link: entryHref(entry),
    })),
  });
}
