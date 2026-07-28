import { unstable_cache } from 'next/cache';
import type { ContentRepository } from './repository';

/**
 * Caching decorator for the repository.
 *
 * ── Why the site renders dynamically ──────────────────────────────────────
 * Every page depends on the request hostname to know which town it is serving,
 * which makes it a dynamic route. Full-route ISR is therefore unavailable: we
 * cannot prerender HTML that is correct for 100 different domains.
 *
 * So instead of caching the HTML, we cache the *data*. Rendering stays dynamic
 * (and always correct per host), while the expensive part — the database
 * round-trip — is shared across requests and across towns. Combined with a CDN
 * in front, this is both cheaper and more correct than prerendering, and it
 * keeps deploy times flat as towns are added rather than multiplying them.
 * ──────────────────────────────────────────────────────────────────────────
 *
 * Cache entries are tagged per town so a single town's content can be purged
 * from the CMS without flushing the whole network:
 *
 *   revalidateTag(`town:${slug}`)            — everything for one town
 *   revalidateTag(`town:${slug}:listings`)   — just its listings
 */

type Method = keyof ContentRepository;

/** Per-method revalidation windows, in seconds. */
const TTL: Record<Method, number> = {
  getListings: 60 * 60 * 6,
  getListingBySlug: 60 * 60 * 12,
  getListingsByIds: 60 * 60 * 12,
  getNearbyListings: 60 * 60 * 12,
  getCategories: 60 * 60 * 24,
  getFacets: 60 * 60 * 6,
  getArticles: 60 * 60 * 6,
  getArticleBySlug: 60 * 60 * 12,
  getEvents: 60 * 30,
  getEventBySlug: 60 * 30,
  search: 60 * 15,
  getSitemapEntries: 60 * 60 * 6,
};

/** Content family a method belongs to, used to build its cache tags. */
const FAMILY: Record<Method, string> = {
  getListings: 'listings',
  getListingBySlug: 'listings',
  getListingsByIds: 'listings',
  getNearbyListings: 'listings',
  getCategories: 'categories',
  getFacets: 'listings',
  getArticles: 'articles',
  getArticleBySlug: 'articles',
  getEvents: 'events',
  getEventBySlug: 'events',
  search: 'search',
  getSitemapEntries: 'sitemap',
};

/**
 * The town slug is the first argument of every repository method — either
 * directly (`getListingBySlug(townSlug, …)`) or on a query object
 * (`getListings({ townSlug, … })`). This finds it either way.
 */
function townSlugOf(args: unknown[]): string {
  const first = args[0];
  if (typeof first === 'string') return first;
  if (first && typeof first === 'object' && 'townSlug' in first) {
    return String((first as { townSlug: unknown }).townSlug);
  }
  return 'unknown';
}

export function withCache(repo: ContentRepository): ContentRepository {
  const wrapped = {} as Record<string, unknown>;

  for (const key of Object.keys(repo) as Method[]) {
    const original = repo[key] as (...args: unknown[]) => Promise<unknown>;

    wrapped[key] = async (...args: unknown[]) => {
      const town = townSlugOf(args);
      const family = FAMILY[key];

      const run = unstable_cache(
        () => original.apply(repo, args),
        // Key parts must fully determine the result: method + serialised args.
        [key, JSON.stringify(args)],
        {
          revalidate: TTL[key],
          tags: [`town:${town}`, `town:${town}:${family}`, family],
        },
      );

      return run();
    };
  }

  return wrapped as unknown as ContentRepository;
}
