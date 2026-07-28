/**
 * In-memory repository adapter backed by the files in `src/data/seed`.
 *
 * This is the default data source. It means `npm run dev` produces a complete,
 * browsable site with no database, no credentials and no network — which keeps
 * design work, Lighthouse runs and CI fast. Production swaps in the Supabase
 * adapter via `DATA_SOURCE=supabase`.
 */

import { DIRECTORY_TYPES, DIRECTORY_ORDER } from '@/config/directories';
import { getTownBySlug } from '@/config/towns';
import { getSeedTown } from '@/data/seed';
import { haversineKm } from '@/lib/geo';
import { articleHref, eventHref, listingHref, routes } from '@/lib/routes';
import { t } from '@/lib/template';
import type {
  Article,
  Category,
  DirectorySlug,
  Listing,
  TownEvent,
} from '@/types/content';
import type {
  ArticleQuery,
  EventQuery,
  ListingQuery,
  NearbyQuery,
  Paginated,
  WithDistance,
} from '@/types/query';
import type {
  ContentRepository,
  DirectoryFacets,
  SearchHit,
  SitemapEntry,
} from '../repository';
import {
  listingComparator,
  paginate,
  scoreArticle,
  scoreEvent,
  scoreListing,
  tally,
} from '../shared';

const isPublished = (status: string): boolean => status === 'published';

const asArray = <T>(value: T | T[] | undefined): T[] | undefined =>
  value === undefined ? undefined : Array.isArray(value) ? value : [value];

function filterListings(all: Listing[], query: ListingQuery): Listing[] {
  const directories = asArray(query.directory);
  const facilities = query.facilities?.map((f) => f.toLowerCase());

  return all.filter((listing) => {
    if (!isPublished(listing.status)) return false;
    if (directories && !directories.includes(listing.directory)) return false;
    if (query.categorySlug && !listing.categorySlugs.includes(query.categorySlug)) return false;
    if (query.area && listing.area !== query.area) return false;
    if (query.excludeId && listing.id === query.excludeId) return false;
    if (query.featuredOnly && listing.tier === 'free') return false;
    if (query.hiddenGemOnly && !listing.hiddenGem) return false;
    if (query.withCoordinatesOnly && !listing.coordinates) return false;

    if (query.priceRange?.length) {
      if (!listing.priceRange || !query.priceRange.includes(listing.priceRange)) return false;
    }
    if (query.minRating !== undefined) {
      if (!listing.rating || listing.rating.value < query.minRating) return false;
    }
    if (facilities?.length) {
      const owned = listing.facilities.map((f) => f.toLowerCase());
      // AND semantics: every selected facility must be present.
      if (!facilities.every((f) => owned.includes(f))) return false;
    }
    if (query.tags?.length) {
      if (!query.tags.some((tag) => listing.tags.includes(tag))) return false;
    }
    return true;
  });
}

export function createSeedRepository(): ContentRepository {
  return {
    async getListings(query: ListingQuery): Promise<Paginated<Listing>> {
      const { listings } = getSeedTown(query.townSlug);
      let results = filterListings(listings, query);

      let scores: Map<string, number> | undefined;
      if (query.q?.trim()) {
        scores = new Map();
        results = results.filter((listing) => {
          const score = scoreListing(listing, query.q!);
          if (score <= 0) return false;
          scores!.set(listing.id, score);
          return true;
        });
      }

      const sort = query.sort ?? (query.q ? 'relevance' : 'featured');
      results.sort(listingComparator(sort, scores));

      return paginate(results, query.page, query.pageSize);
    },

    async getListingBySlug(townSlug, directory, slug) {
      const { listings } = getSeedTown(townSlug);
      return (
        listings.find(
          (listing) =>
            listing.directory === directory &&
            listing.slug === slug &&
            isPublished(listing.status),
        ) ?? null
      );
    },

    async getListingsByIds(townSlug, ids) {
      if (ids.length === 0) return [];
      const { listings } = getSeedTown(townSlug);
      const wanted = new Set(ids);
      // Preserve the caller's ordering — editors curate these lists by hand.
      const found = listings.filter((l) => wanted.has(l.id) && isPublished(l.status));
      return ids
        .map((id) => found.find((l) => l.id === id))
        .filter((l): l is Listing => Boolean(l));
    },

    async getNearbyListings(query: NearbyQuery): Promise<Array<WithDistance<Listing>>> {
      const { listings } = getSeedTown(query.townSlug);
      const directories = asArray(query.directory);
      const radius = query.radiusKm ?? 25;

      return listings
        .filter(
          (listing) =>
            isPublished(listing.status) &&
            Boolean(listing.coordinates) &&
            listing.id !== query.excludeId &&
            (!directories || directories.includes(listing.directory)),
        )
        .map((listing) => ({
          item: listing,
          distanceKm: haversineKm(query.origin, listing.coordinates!),
        }))
        .filter((entry) => entry.distanceKm <= radius)
        .sort((a, b) => a.distanceKm - b.distanceKm)
        .slice(0, query.limit ?? 6);
    },

    async getCategories(townSlug, directory): Promise<Category[]> {
      const town = getTownBySlug(townSlug);
      const targets: DirectorySlug[] = directory ? [directory] : DIRECTORY_ORDER;

      return targets.flatMap((dir) =>
        DIRECTORY_TYPES[dir].categories.map((category, index) => ({
          id: `${townSlug}:${dir}:${category.slug}`,
          townSlug,
          directory: dir,
          slug: category.slug,
          name: category.name,
          description: town ? t(category.description, town) : category.description,
          sortOrder: index,
        })),
      );
    },

    async getFacets(townSlug, directory): Promise<DirectoryFacets> {
      const { listings } = getSeedTown(townSlug);
      const scoped = listings.filter(
        (listing) =>
          isPublished(listing.status) && (!directory || listing.directory === directory),
      );

      const categoryLabels = new Map<string, string>();
      for (const dir of directory ? [directory] : DIRECTORY_ORDER) {
        for (const category of DIRECTORY_TYPES[dir].categories) {
          categoryLabels.set(category.slug, category.name);
        }
      }

      const priceCounts = new Map<number, number>();
      for (const listing of scoped) {
        if (listing.priceRange) {
          priceCounts.set(listing.priceRange, (priceCounts.get(listing.priceRange) ?? 0) + 1);
        }
      }

      return {
        areas: tally(scoped.map((l) => l.area ?? '')),
        categories: tally(scoped.flatMap((l) => l.categorySlugs)).map((entry) => ({
          value: entry.value,
          label: categoryLabels.get(entry.value) ?? entry.value,
          count: entry.count,
        })),
        facilities: tally(scoped.flatMap((l) => l.facilities)),
        tags: tally(scoped.flatMap((l) => l.tags)),
        priceRanges: Array.from(priceCounts, ([value, count]) => ({ value, count })).sort(
          (a, b) => a.value - b.value,
        ),
      };
    },

    async getArticles(query: ArticleQuery): Promise<Paginated<Article>> {
      const { articles } = getSeedTown(query.townSlug);
      const kinds = asArray(query.kind);

      let results = articles.filter((article) => {
        if (!isPublished(article.status)) return false;
        if (kinds && !kinds.includes(article.kind)) return false;
        if (query.tag && !article.tags.includes(query.tag)) return false;
        if (query.excludeId && article.id === query.excludeId) return false;
        return true;
      });

      if (query.q?.trim()) {
        const scored = results
          .map((article) => ({ article, score: scoreArticle(article, query.q!) }))
          .filter((entry) => entry.score > 0)
          .sort((a, b) => b.score - a.score);
        results = scored.map((entry) => entry.article);
      } else {
        results.sort(
          (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
        );
      }

      return paginate(results, query.page, query.pageSize);
    },

    async getArticleBySlug(townSlug, slug) {
      const { articles } = getSeedTown(townSlug);
      return articles.find((a) => a.slug === slug && isPublished(a.status)) ?? null;
    },

    async getEvents(query: EventQuery): Promise<Paginated<TownEvent>> {
      const { events } = getSeedTown(query.townSlug);
      const now = Date.now();
      const window = query.window ?? 'upcoming';

      let results = events.filter((event) => {
        if (!isPublished(event.status)) return false;
        if (query.tag && !event.tags.includes(query.tag)) return false;
        if (query.excludeId && event.id === query.excludeId) return false;

        // An event is "upcoming" until its end time (or its start, if open-ended).
        const finishes = new Date(event.endsAt ?? event.startsAt).getTime();
        if (window === 'upcoming' && finishes < now) return false;
        if (window === 'past' && finishes >= now) return false;

        if (query.from && new Date(event.startsAt).getTime() < new Date(query.from).getTime()) {
          return false;
        }
        if (query.to && new Date(event.startsAt).getTime() > new Date(query.to).getTime()) {
          return false;
        }
        return true;
      });

      if (query.q?.trim()) {
        results = results
          .map((event) => ({ event, score: scoreEvent(event, query.q!) }))
          .filter((entry) => entry.score > 0)
          .sort((a, b) => b.score - a.score)
          .map((entry) => entry.event);
      } else {
        const direction = window === 'past' ? -1 : 1;
        results.sort(
          (a, b) =>
            direction *
            (new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()),
        );
      }

      return paginate(results, query.page, query.pageSize);
    },

    async getEventBySlug(townSlug, slug) {
      const { events } = getSeedTown(townSlug);
      return events.find((e) => e.slug === slug && isPublished(e.status)) ?? null;
    },

    async search(townSlug, term, limit = 20): Promise<SearchHit[]> {
      const { listings, articles, events } = getSeedTown(townSlug);
      const hits: SearchHit[] = [];

      for (const listing of listings) {
        if (!isPublished(listing.status)) continue;
        const score = scoreListing(listing, term);
        if (score <= 0) continue;
        hits.push({
          kind: 'listing',
          id: listing.id,
          title: listing.title,
          summary: listing.summary,
          href: listingHref(listing),
          image: listing.featuredImage.src,
          badge: DIRECTORY_TYPES[listing.directory].singular,
          score,
        });
      }

      for (const article of articles) {
        if (!isPublished(article.status)) continue;
        const score = scoreArticle(article, term);
        if (score <= 0) continue;
        hits.push({
          kind: 'article',
          id: article.id,
          title: article.title,
          summary: article.summary,
          href: articleHref(article),
          image: article.featuredImage.src,
          badge: article.kind === 'blog' ? 'Article' : 'Guide',
          score,
        });
      }

      for (const event of events) {
        if (!isPublished(event.status)) continue;
        const score = scoreEvent(event, term);
        if (score <= 0) continue;
        hits.push({
          kind: 'event',
          id: event.id,
          title: event.title,
          summary: event.summary,
          href: eventHref(event),
          image: event.featuredImage.src,
          badge: 'Event',
          score,
        });
      }

      return hits.sort((a, b) => b.score - a.score).slice(0, limit);
    },

    async getSitemapEntries(townSlug): Promise<SitemapEntry[]> {
      const { listings, articles, events } = getSeedTown(townSlug);
      const entries: SitemapEntry[] = [];

      for (const listing of listings) {
        if (!isPublished(listing.status) || listing.seo.noindex) continue;
        entries.push({
          path: listingHref(listing),
          updatedAt: listing.updatedAt,
          priority: listing.tier === 'free' ? 0.6 : 0.8,
        });
      }
      for (const article of articles) {
        if (!isPublished(article.status) || article.seo.noindex) continue;
        entries.push({ path: articleHref(article), updatedAt: article.updatedAt, priority: 0.7 });
      }
      for (const event of events) {
        if (!isPublished(event.status) || event.seo.noindex) continue;
        entries.push({ path: eventHref(event), updatedAt: event.updatedAt, priority: 0.6 });
      }

      // Category landing pages exist for every directory/category pair.
      for (const dir of DIRECTORY_ORDER) {
        for (const category of DIRECTORY_TYPES[dir].categories) {
          entries.push({
            path: routes.directoryCategory(dir, category.slug),
            updatedAt: new Date().toISOString(),
            priority: 0.5,
          });
        }
      }

      return entries;
    },
  };
}
