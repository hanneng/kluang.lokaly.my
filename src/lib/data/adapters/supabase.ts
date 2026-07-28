/**
 * Supabase (Postgres) repository adapter.
 *
 * Row shape is snake_case; the domain model is camelCase. All mapping happens
 * in this file so nothing downstream ever sees a database column name.
 *
 * Two things are pushed down into Postgres rather than done in JS:
 *   - full-text search, via the generated `search_vector` column;
 *   - radius search, via the `listings_nearby` RPC.
 * @see supabase/migrations/0001_init.sql
 */

import { DIRECTORY_TYPES } from '@/config/directories';
import { articleHref, eventHref, listingHref } from '@/lib/routes';
import { getSupabaseServer } from '@/lib/supabase/server';
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
import { TIER_WEIGHT, tally } from '../shared';

/* -------------------------------------------------------------------------- */
/* Row mappers                                                                 */
/* -------------------------------------------------------------------------- */

type Row = Record<string, any>;

const emptyMedia = { src: '', alt: '' };

function toListing(row: Row): Listing {
  return {
    id: row.id,
    townSlug: row.town_slug,
    directory: row.directory,
    categorySlugs: row.category_slugs ?? [],
    slug: row.slug,
    title: row.title,
    summary: row.summary ?? '',
    body: row.body ?? '',
    featuredImage: row.featured_image ?? emptyMedia,
    gallery: row.gallery ?? [],
    address: row.address ?? '',
    area: row.area ?? undefined,
    postcode: row.postcode ?? undefined,
    coordinates:
      row.lat !== null && row.lat !== undefined && row.lng !== null && row.lng !== undefined
        ? { lat: Number(row.lat), lng: Number(row.lng) }
        : undefined,
    openingHours: row.opening_hours ?? undefined,
    contact: row.contact ?? {},
    priceRange: row.price_range ?? undefined,
    priceNote: row.price_note ?? undefined,
    rating:
      row.rating_value !== null && row.rating_value !== undefined
        ? {
            value: Number(row.rating_value),
            count: row.rating_count ?? 0,
            source: row.rating_source ?? 'editorial',
          }
        : undefined,
    facilities: row.facilities ?? [],
    tags: row.tags ?? [],
    faqs: row.faqs ?? [],
    tier: row.tier,
    hiddenGem: row.hidden_gem ?? false,
    weight: row.weight ?? 0,
    status: row.status,
    verified: row.verified ?? false,
    seo: row.seo ?? {},
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
  };
}

function toArticle(row: Row): Article {
  return {
    id: row.id,
    townSlug: row.town_slug,
    kind: row.kind,
    slug: row.slug,
    title: row.title,
    summary: row.summary ?? '',
    body: row.body ?? '',
    featuredImage: row.featured_image ?? emptyMedia,
    gallery: row.gallery ?? [],
    author: row.author ?? { name: 'Editorial team' },
    sponsor: row.sponsor ?? undefined,
    tags: row.tags ?? [],
    faqs: row.faqs ?? [],
    relatedListingIds: row.related_listing_ids ?? [],
    readingMinutes: row.reading_minutes ?? 3,
    status: row.status,
    seo: row.seo ?? {},
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
  };
}

function toEvent(row: Row): TownEvent {
  return {
    id: row.id,
    townSlug: row.town_slug,
    slug: row.slug,
    title: row.title,
    summary: row.summary ?? '',
    body: row.body ?? '',
    featuredImage: row.featured_image ?? emptyMedia,
    gallery: row.gallery ?? [],
    startsAt: row.starts_at,
    endsAt: row.ends_at ?? undefined,
    allDay: row.all_day ?? false,
    recurrence: row.recurrence ?? undefined,
    venueName: row.venue_name ?? '',
    address: row.address ?? '',
    coordinates:
      row.lat !== null && row.lat !== undefined ? { lat: Number(row.lat), lng: Number(row.lng) } : undefined,
    venueListingId: row.venue_listing_id ?? undefined,
    organiser: row.organiser ?? undefined,
    contact: row.contact ?? {},
    ticketUrl: row.ticket_url ?? undefined,
    priceNote: row.price_note ?? undefined,
    tags: row.tags ?? [],
    tier: row.tier ?? 'free',
    status: row.status,
    seo: row.seo ?? {},
    updatedAt: row.updated_at,
  };
}

/* -------------------------------------------------------------------------- */
/* Query helpers                                                               */
/* -------------------------------------------------------------------------- */

const range = (page = 1, pageSize = 24): [number, number] => {
  const from = (Math.max(1, page) - 1) * pageSize;
  return [from, from + pageSize - 1];
};

/** Turn a user phrase into a safe `websearch_to_tsquery` input. */
function toSearchTerm(input: string): string {
  return input.replace(/[():&|!*<>]/g, ' ').trim();
}

function applyListingSort(builder: any, sort: ListingQuery['sort'], hasQuery: boolean) {
  switch (sort ?? (hasQuery ? 'relevance' : 'featured')) {
    case 'rating':
      return builder
        .order('rating_value', { ascending: false, nullsFirst: false })
        .order('tier_rank', { ascending: false });
    case 'newest':
      return builder.order('published_at', { ascending: false });
    case 'alphabetical':
      return builder.order('title', { ascending: true });
    case 'relevance':
      // `rank` is computed by the search view; ties fall back to tier.
      return builder
        .order('rank', { ascending: false, nullsFirst: false })
        .order('tier_rank', { ascending: false });
    case 'featured':
    default:
      return builder
        .order('tier_rank', { ascending: false })
        .order('weight', { ascending: false })
        .order('title', { ascending: true });
  }
}

/* -------------------------------------------------------------------------- */
/* Adapter                                                                     */
/* -------------------------------------------------------------------------- */

export function createSupabaseRepository(): ContentRepository {
  const db = () => getSupabaseServer();

  return {
    async getListings(query: ListingQuery): Promise<Paginated<Listing>> {
      const page = query.page ?? 1;
      const pageSize = query.pageSize ?? 24;
      const [from, to] = range(page, pageSize);

      // `listings_public` is a view that adds `tier_rank` and exposes only
      // published rows, so RLS stays simple.
      let builder = db()
        .from('listings_public')
        .select('*', { count: 'exact' })
        .eq('town_slug', query.townSlug);

      if (query.directory) {
        builder = Array.isArray(query.directory)
          ? builder.in('directory', query.directory)
          : builder.eq('directory', query.directory);
      }
      if (query.categorySlug) builder = builder.contains('category_slugs', [query.categorySlug]);
      if (query.area) builder = builder.eq('area', query.area);
      if (query.excludeId) builder = builder.neq('id', query.excludeId);
      if (query.featuredOnly) builder = builder.neq('tier', 'free');
      if (query.hiddenGemOnly) builder = builder.eq('hidden_gem', true);
      if (query.withCoordinatesOnly) builder = builder.not('lat', 'is', null);
      if (query.priceRange?.length) builder = builder.in('price_range', query.priceRange);
      if (query.minRating !== undefined) builder = builder.gte('rating_value', query.minRating);
      if (query.facilities?.length) builder = builder.contains('facilities', query.facilities);
      if (query.tags?.length) builder = builder.overlaps('tags', query.tags);

      const term = query.q ? toSearchTerm(query.q) : '';
      if (term) builder = builder.textSearch('search_vector', term, { type: 'websearch' });

      builder = applyListingSort(builder, query.sort, Boolean(term)).range(from, to);

      const { data, error, count } = await builder;
      if (error) throw new Error(`getListings failed: ${error.message}`);

      const items = (data ?? []).map(toListing);
      return {
        items,
        total: count ?? items.length,
        page,
        pageSize,
        hasMore: from + items.length < (count ?? items.length),
      };
    },

    async getListingBySlug(townSlug, directory, slug) {
      const { data, error } = await db()
        .from('listings_public')
        .select('*')
        .eq('town_slug', townSlug)
        .eq('directory', directory)
        .eq('slug', slug)
        .maybeSingle();
      if (error) throw new Error(`getListingBySlug failed: ${error.message}`);
      return data ? toListing(data) : null;
    },

    async getListingsByIds(townSlug, ids) {
      if (ids.length === 0) return [];
      const { data, error } = await db()
        .from('listings_public')
        .select('*')
        .eq('town_slug', townSlug)
        .in('id', ids);
      if (error) throw new Error(`getListingsByIds failed: ${error.message}`);
      const found = (data ?? []).map(toListing);
      return ids
        .map((id) => found.find((l) => l.id === id))
        .filter((l): l is Listing => Boolean(l));
    },

    async getNearbyListings(query: NearbyQuery): Promise<Array<WithDistance<Listing>>> {
      const directories = query.directory
        ? Array.isArray(query.directory)
          ? query.directory
          : [query.directory]
        : null;

      const { data, error } = await db().rpc('listings_nearby', {
        p_town_slug: query.townSlug,
        p_lat: query.origin.lat,
        p_lng: query.origin.lng,
        p_radius_km: query.radiusKm ?? 25,
        p_directories: directories,
        p_exclude_id: query.excludeId ?? null,
        p_limit: query.limit ?? 6,
      });
      if (error) throw new Error(`getNearbyListings failed: ${error.message}`);

      return (data ?? []).map((row: Row) => ({
        item: toListing(row),
        distanceKm: Number(row.distance_km),
      }));
    },

    async getCategories(townSlug, directory): Promise<Category[]> {
      let builder = db()
        .from('categories')
        .select('*')
        .eq('town_slug', townSlug)
        .order('sort_order', { ascending: true });
      if (directory) builder = builder.eq('directory', directory);

      const { data, error } = await builder;
      if (error) throw new Error(`getCategories failed: ${error.message}`);

      return (data ?? []).map((row: Row) => ({
        id: row.id,
        townSlug: row.town_slug,
        directory: row.directory as DirectorySlug,
        slug: row.slug,
        name: row.name,
        description: row.description ?? undefined,
        icon: row.icon ?? undefined,
        sortOrder: row.sort_order ?? 0,
      }));
    },

    async getFacets(townSlug, directory): Promise<DirectoryFacets> {
      // Facet counts come from a narrow projection — never pull bodies for this.
      let builder = db()
        .from('listings_public')
        .select('area, facilities, tags, price_range, category_slugs')
        .eq('town_slug', townSlug);
      if (directory) builder = builder.eq('directory', directory);

      const { data, error } = await builder;
      if (error) throw new Error(`getFacets failed: ${error.message}`);
      const rows = data ?? [];

      const categoryLabels = new Map<string, string>();
      for (const dir of directory ? [directory] : (Object.keys(DIRECTORY_TYPES) as DirectorySlug[])) {
        for (const category of DIRECTORY_TYPES[dir].categories) {
          categoryLabels.set(category.slug, category.name);
        }
      }

      const priceCounts = new Map<number, number>();
      for (const row of rows) {
        if (row.price_range) {
          priceCounts.set(row.price_range, (priceCounts.get(row.price_range) ?? 0) + 1);
        }
      }

      return {
        areas: tally(rows.map((r: Row) => r.area ?? '')),
        categories: tally(rows.flatMap((r: Row) => r.category_slugs ?? [])).map((entry) => ({
          value: entry.value,
          label: categoryLabels.get(entry.value) ?? entry.value,
          count: entry.count,
        })),
        facilities: tally(rows.flatMap((r: Row) => r.facilities ?? [])),
        tags: tally(rows.flatMap((r: Row) => r.tags ?? [])),
        priceRanges: Array.from(priceCounts, ([value, count]) => ({ value, count })).sort(
          (a, b) => a.value - b.value,
        ),
      };
    },

    async getArticles(query: ArticleQuery): Promise<Paginated<Article>> {
      const page = query.page ?? 1;
      const pageSize = query.pageSize ?? 12;
      const [from, to] = range(page, pageSize);

      let builder = db()
        .from('articles_public')
        .select('*', { count: 'exact' })
        .eq('town_slug', query.townSlug);

      if (query.kind) {
        builder = Array.isArray(query.kind)
          ? builder.in('kind', query.kind)
          : builder.eq('kind', query.kind);
      }
      if (query.tag) builder = builder.contains('tags', [query.tag]);
      if (query.excludeId) builder = builder.neq('id', query.excludeId);

      const term = query.q ? toSearchTerm(query.q) : '';
      if (term) builder = builder.textSearch('search_vector', term, { type: 'websearch' });

      const { data, error, count } = await builder
        .order('published_at', { ascending: false })
        .range(from, to);
      if (error) throw new Error(`getArticles failed: ${error.message}`);

      const items = (data ?? []).map(toArticle);
      return {
        items,
        total: count ?? items.length,
        page,
        pageSize,
        hasMore: from + items.length < (count ?? items.length),
      };
    },

    async getArticleBySlug(townSlug, slug) {
      const { data, error } = await db()
        .from('articles_public')
        .select('*')
        .eq('town_slug', townSlug)
        .eq('slug', slug)
        .maybeSingle();
      if (error) throw new Error(`getArticleBySlug failed: ${error.message}`);
      return data ? toArticle(data) : null;
    },

    async getEvents(query: EventQuery): Promise<Paginated<TownEvent>> {
      const page = query.page ?? 1;
      const pageSize = query.pageSize ?? 12;
      const [from, to] = range(page, pageSize);
      const window = query.window ?? 'upcoming';
      const nowIso = new Date().toISOString();

      let builder = db()
        .from('events_public')
        .select('*', { count: 'exact' })
        .eq('town_slug', query.townSlug);

      // `effective_end` is generated as coalesce(ends_at, starts_at).
      if (window === 'upcoming') builder = builder.gte('effective_end', nowIso);
      if (window === 'past') builder = builder.lt('effective_end', nowIso);
      if (query.from) builder = builder.gte('starts_at', query.from);
      if (query.to) builder = builder.lte('starts_at', query.to);
      if (query.tag) builder = builder.contains('tags', [query.tag]);
      if (query.excludeId) builder = builder.neq('id', query.excludeId);

      const term = query.q ? toSearchTerm(query.q) : '';
      if (term) builder = builder.textSearch('search_vector', term, { type: 'websearch' });

      const { data, error, count } = await builder
        .order('starts_at', { ascending: window !== 'past' })
        .range(from, to);
      if (error) throw new Error(`getEvents failed: ${error.message}`);

      const items = (data ?? []).map(toEvent);
      return {
        items,
        total: count ?? items.length,
        page,
        pageSize,
        hasMore: from + items.length < (count ?? items.length),
      };
    },

    async getEventBySlug(townSlug, slug) {
      const { data, error } = await db()
        .from('events_public')
        .select('*')
        .eq('town_slug', townSlug)
        .eq('slug', slug)
        .maybeSingle();
      if (error) throw new Error(`getEventBySlug failed: ${error.message}`);
      return data ? toEvent(data) : null;
    },

    async search(townSlug, term, limit = 20): Promise<SearchHit[]> {
      const clean = toSearchTerm(term);
      if (!clean) return [];

      // One RPC across all three content tables keeps ranking consistent and
      // avoids three round-trips on every keystroke.
      const { data, error } = await db().rpc('search_all', {
        p_town_slug: townSlug,
        p_term: clean,
        p_limit: limit,
      });
      if (error) throw new Error(`search failed: ${error.message}`);

      return (data ?? []).map((row: Row): SearchHit => {
        const href =
          row.kind === 'listing'
            ? listingHref({ directory: row.directory, slug: row.slug })
            : row.kind === 'event'
              ? eventHref({ slug: row.slug })
              : articleHref({ kind: row.article_kind, slug: row.slug });

        const badge =
          row.kind === 'listing'
            ? DIRECTORY_TYPES[row.directory as DirectorySlug].singular
            : row.kind === 'event'
              ? 'Event'
              : row.article_kind === 'blog'
                ? 'Article'
                : 'Guide';

        return {
          kind: row.kind,
          id: row.id,
          title: row.title,
          summary: row.summary ?? '',
          href,
          image: row.featured_image?.src,
          badge,
          score: Number(row.rank ?? 0) + (row.tier ? TIER_WEIGHT[row.tier as keyof typeof TIER_WEIGHT] / 100 : 0),
        };
      });
    },

    async getSitemapEntries(townSlug): Promise<SitemapEntry[]> {
      const { data, error } = await db().rpc('sitemap_entries', { p_town_slug: townSlug });
      if (error) throw new Error(`getSitemapEntries failed: ${error.message}`);
      return (data ?? []).map((row: Row) => ({
        path: row.path,
        updatedAt: row.updated_at,
        priority: Number(row.priority ?? 0.6),
      }));
    },
  };
}
