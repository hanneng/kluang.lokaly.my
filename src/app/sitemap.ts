import type { MetadataRoute } from 'next';
import { allDirectories } from '@/config/directories';
import { STATIC_ROUTES } from '@/config/site';
import { getRepository } from '@/lib/data';
import { routes } from '@/lib/routes';
import { getTown, getTownOrigin } from '@/lib/town/context';

/**
 * Per-town sitemap.
 *
 * Because the town is resolved from the request hostname, the same route serves
 * a correct sitemap for every domain in the network — kluang.lokaly.my/sitemap.xml
 * lists Kluang URLs, muar.lokaly.my/sitemap.xml lists Muar's, with no per-town code.
 *
 * Excluded deliberately: /search (no index value) and any filtered directory
 * view (near-duplicate combinatorial URLs).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const town = await getTown();
  const origin = await getTownOrigin();
  const repo = getRepository();

  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  const add = (
    path: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] = 'weekly',
    lastModified: Date = now,
  ) => {
    entries.push({ url: `${origin}${path}`, lastModified, changeFrequency, priority });
  };

  // Core pages
  add('/', 1, 'daily');
  add(STATIC_ROUTES.discover, 0.8, 'monthly');
  add(STATIC_ROUTES.thingsToDo, 0.9, 'weekly');
  add(STATIC_ROUTES.hiddenGems, 0.8, 'weekly');
  if (town.features.map) add(STATIC_ROUTES.map, 0.6, 'weekly');
  if (town.features.events) add(STATIC_ROUTES.events, 0.8, 'daily');
  if (town.features.guides) add(STATIC_ROUTES.guides, 0.8, 'weekly');
  if (town.features.blog) add(STATIC_ROUTES.blog, 0.7, 'weekly');
  if (town.features.advertise) add(STATIC_ROUTES.advertise, 0.6, 'monthly');
  add(STATIC_ROUTES.about, 0.5, 'monthly');
  add(STATIC_ROUTES.contact, 0.5, 'monthly');
  add(STATIC_ROUTES.privacy, 0.2, 'yearly');
  add(STATIC_ROUTES.terms, 0.2, 'yearly');

  // Directory indexes
  for (const directory of allDirectories()) {
    if (directory.featureFlag && !town.features[directory.featureFlag]) continue;
    add(directory.path, 0.9, 'daily');
    for (const category of directory.categories) {
      add(routes.directoryCategory(directory.slug, category.slug), 0.7, 'weekly');
    }
  }

  // Content
  const content = await repo.getSitemapEntries(town.slug);
  for (const entry of content) {
    // Category pages are already added above from the registry.
    if (entry.path.includes('/category/')) continue;
    add(entry.path, entry.priority, 'weekly', new Date(entry.updatedAt));
  }

  return entries;
}
