/**
 * Native Postgres repository adapter — for a plain managed instance (e.g. AWS
 * Lightsail) with no PostgREST/RPC layer in front of it, unlike Supabase.
 *
 * Everything the Supabase adapter delegated to Postgres functions (search
 * ranking, radius search) is written here as plain SQL instead: full-text
 * search via core `tsvector`/`websearch_to_tsquery`, and "nearby" via a
 * haversine expression — both work on any Postgres with no extensions.
 *
 * JSONB columns (`featured_image`, `gallery`, `contact`, `faqs`, `seo`,
 * `author`, `sponsor`, `opening_hours`) are written at import time with the
 * same camelCase shape as the TypeScript types, so they pass through the row
 * mappers unchanged — only the flat/array columns need snake_case mapping.
 */

import { DIRECTORY_TYPES } from '@/config/directories';
import { getPool } from '@/lib/db/pool';
import { articleHref, eventHref, listingHref } from '@/lib/routes';
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
import { TIER_WEIGHT } from '../shared';

type Row = Record<string, any>;

/** Incrementally builds a parameterized `WHERE ... AND ...` clause. */
class Where {
  private clauses: string[] = [];
  private values: unknown[] = [];

  add(clause: string, ...values: unknown[]): this {
    // Substitute `?` placeholders left-to-right with real $N positions, so
    // call sites can write natural-looking SQL without tracking indices.
    let sql = clause;
    for (const value of values) {
      this.values.push(value);
      sql = sql.replace('?', `$${this.values.length}`);
    }
    this.clauses.push(sql);
    return this;
  }

  addIf(condition: unknown, clause: string, ...values: unknown[]): this {
    if (condition) this.add(clause, ...values);
    return this;
  }

  sql(): string {
    return this.clauses.length ? `where ${this.clauses.join(' and ')}` : '';
  }

  params(): unknown[] {
    return this.values;
  }

  /** Next placeholder position — for appending raw `limit $N` etc. after WHERE. */
  nextIndex(): number {
    return this.values.length + 1;
  }

  push(value: unknown): number {
    this.values.push(value);
    return this.values.length;
  }
}

/* -------------------------------------------------------------------------- */
/* Row mappers                                                                 */
/* -------------------------------------------------------------------------- */

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
    publishedAt: row.published_at instanceof Date ? row.published_at.toISOString() : row.published_at,
    updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : row.updated_at,
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
    publishedAt: row.published_at instanceof Date ? row.published_at.toISOString() : row.published_at,
    updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : row.updated_at,
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
    startsAt: row.starts_at instanceof Date ? row.starts_at.toISOString() : row.starts_at,
    endsAt: row.ends_at ? (row.ends_at instanceof Date ? row.ends_at.toISOString() : row.ends_at) : undefined,
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
    updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : row.updated_at,
  };
}

/* -------------------------------------------------------------------------- */
/* Sort                                                                        */
/* -------------------------------------------------------------------------- */

function listingOrderBy(sort: ListingQuery['sort'], hasQuery: boolean): string {
  switch (sort ?? (hasQuery ? 'relevance' : 'featured')) {
    case 'relevance':
      return 'rank desc nulls last, tier_rank desc';
    case 'rating':
      return 'rating_value desc nulls last, rating_count desc nulls last, tier_rank desc';
    case 'newest':
      return 'published_at desc';
    case 'alphabetical':
      return 'title asc';
    case 'featured':
    default:
      return 'tier_rank desc, weight desc, title asc';
  }
}

/** SQL `case` expression giving each tier a numeric weight, for ORDER BY. */
const TIER_RANK_CASE = `case tier
  when 'sponsored' then ${TIER_WEIGHT.sponsored}
  when 'premium' then ${TIER_WEIGHT.premium}
  when 'featured' then ${TIER_WEIGHT.featured}
  else ${TIER_WEIGHT.free}
end`;

/* -------------------------------------------------------------------------- */
/* Adapter                                                                     */
/* -------------------------------------------------------------------------- */

export function createPostgresRepository(): ContentRepository {
  const db = () => getPool();

  return {
    async getListings(query: ListingQuery): Promise<Paginated<Listing>> {
      const page = query.page ?? 1;
      const pageSize = query.pageSize ?? 24;
      const offset = (Math.max(1, page) - 1) * pageSize;

      const where = new Where().add('status = ?', 'published').add('town_slug = ?', query.townSlug);

      if (query.directory) {
        const directories = Array.isArray(query.directory) ? query.directory : [query.directory];
        where.add('directory = any(?)', directories);
      }
      where.addIf(query.categorySlug, 'category_slugs @> ?::text[]', query.categorySlug ? [query.categorySlug] : []);
      where.addIf(query.area, 'area = ?', query.area);
      where.addIf(query.excludeId, 'id <> ?', query.excludeId);
      where.addIf(query.featuredOnly, "tier <> 'free'");
      where.addIf(query.hiddenGemOnly, 'hidden_gem = true');
      where.addIf(query.withCoordinatesOnly, 'lat is not null');
      where.addIf(query.priceRange?.length, 'price_range = any(?)', query.priceRange);
      where.addIf(query.minRating !== undefined, 'rating_value >= ?', query.minRating);
      where.addIf(query.facilities?.length, 'facilities @> ?::text[]', query.facilities);
      where.addIf(query.tags?.length, 'tags && ?::text[]', query.tags);

      const term = query.q?.trim();
      let rankSelect = 'null::real as rank';
      if (term) {
        const idx = where.push(term);
        rankSelect = `ts_rank(search_vector, websearch_to_tsquery('english', $${idx})) as rank`;
        where.add(`search_vector @@ websearch_to_tsquery('english', ?)`, term);
      }

      const orderBy = listingOrderBy(query.sort, Boolean(term));
      const limitIdx = where.nextIndex();
      const offsetIdx = limitIdx + 1;

      const sql = `
        select *, ${TIER_RANK_CASE} as tier_rank, ${rankSelect}
        from listings
        ${where.sql()}
        order by ${orderBy}
        limit $${limitIdx} offset $${offsetIdx}
      `;
      const countSql = `select count(*)::int as total from listings ${where.sql()}`;

      const [{ rows }, countResult] = await Promise.all([
        db().query(sql, [...where.params(), pageSize, offset]),
        db().query(countSql, where.params()),
      ]);

      const total = countResult.rows[0]?.total ?? 0;
      return {
        items: rows.map(toListing),
        total,
        page,
        pageSize,
        hasMore: offset + rows.length < total,
      };
    },

    async getListingBySlug(townSlug, directory, slug) {
      const { rows } = await db().query(
        `select * from listings where town_slug = $1 and directory = $2 and slug = $3 and status = 'published' limit 1`,
        [townSlug, directory, slug],
      );
      return rows[0] ? toListing(rows[0]) : null;
    },

    async getListingsByIds(townSlug, ids) {
      if (ids.length === 0) return [];
      const { rows } = await db().query(
        `select * from listings where town_slug = $1 and id = any($2) and status = 'published'`,
        [townSlug, ids],
      );
      const found = rows.map(toListing);
      return ids.map((id) => found.find((l) => l.id === id)).filter((l): l is Listing => Boolean(l));
    },

    async getNearbyListings(query: NearbyQuery): Promise<Array<WithDistance<Listing>>> {
      const where = new Where()
        .add('status = ?', 'published')
        .add('town_slug = ?', query.townSlug)
        .add('lat is not null')
        .addIf(query.excludeId, 'id <> ?', query.excludeId);

      if (query.directory) {
        const directories = Array.isArray(query.directory) ? query.directory : [query.directory];
        where.add('directory = any(?)', directories);
      }

      // Haversine, in km. `radians()` and trig functions are core SQL, no
      // extension needed.
      const latIdx = where.push(query.origin.lat);
      const lngIdx = where.push(query.origin.lng);
      const distanceExpr = `
        6371 * acos(
          least(1, greatest(-1,
            cos(radians($${latIdx})) * cos(radians(lat)) * cos(radians(lng) - radians($${lngIdx}))
            + sin(radians($${latIdx})) * sin(radians(lat))
          ))
        )
      `;

      const radiusIdx = where.push(query.radiusKm ?? 25);
      const limitIdx = where.push(query.limit ?? 6);

      // Postgres doesn't allow a SELECT-list alias in WHERE (only in ORDER BY/
      // GROUP BY), so the radius filter has to go in an outer query against
      // the materialised `distance_km` column rather than repeating the
      // haversine expression a third time.
      const sql = `
        select * from (
          select *, (${distanceExpr}) as distance_km
          from listings
          ${where.sql()}
        ) nearby
        where distance_km <= $${radiusIdx}
        order by distance_km asc
        limit $${limitIdx}
      `;
      const { rows } = await db().query(sql, where.params());

      return rows.map((row: Row) => ({ item: toListing(row), distanceKm: Number(row.distance_km) }));
    },

    async getCategories(townSlug, directory): Promise<Category[]> {
      const where = new Where().add('town_slug = ?', townSlug);
      where.addIf(directory, 'directory = ?', directory);
      const { rows } = await db().query(
        `select * from categories ${where.sql()} order by sort_order asc`,
        where.params(),
      );
      return rows.map(
        (row: Row): Category => ({
          id: row.id,
          townSlug: row.town_slug,
          directory: row.directory as DirectorySlug,
          slug: row.slug,
          name: row.name,
          description: row.description ?? undefined,
          icon: row.icon ?? undefined,
          sortOrder: row.sort_order ?? 0,
        }),
      );
    },

    async getFacets(townSlug, directory): Promise<DirectoryFacets> {
      const where = new Where().add("status = 'published'").add('town_slug = ?', townSlug);
      where.addIf(directory, 'directory = ?', directory);
      const whereSql = where.sql();
      const params = where.params();

      const categoryLabels = new Map<string, string>();
      const directories: DirectorySlug[] = directory
        ? [directory]
        : (Object.keys(DIRECTORY_TYPES) as DirectorySlug[]);
      for (const dir of directories) {
        for (const category of DIRECTORY_TYPES[dir].categories) {
          categoryLabels.set(category.slug, category.name);
        }
      }

      const [areas, categories, facilities, tags, prices] = await Promise.all([
        db().query(
          `select area as value, count(*)::int as count from listings ${whereSql} and area is not null group by area order by count desc`,
          params,
        ),
        db().query(
          `select unnest(category_slugs) as value, count(*)::int as count from listings ${whereSql} group by 1 order by count desc`,
          params,
        ),
        db().query(
          `select unnest(facilities) as value, count(*)::int as count from listings ${whereSql} group by 1 order by count desc`,
          params,
        ),
        db().query(
          `select unnest(tags) as value, count(*)::int as count from listings ${whereSql} group by 1 order by count desc`,
          params,
        ),
        db().query(
          `select price_range as value, count(*)::int as count from listings ${whereSql} and price_range is not null group by price_range order by price_range asc`,
          params,
        ),
      ]);

      return {
        areas: areas.rows,
        categories: categories.rows.map((row: Row) => ({
          value: row.value,
          label: categoryLabels.get(row.value) ?? row.value,
          count: row.count,
        })),
        facilities: facilities.rows,
        tags: tags.rows,
        priceRanges: prices.rows,
      };
    },

    async getArticles(query: ArticleQuery): Promise<Paginated<Article>> {
      const page = query.page ?? 1;
      const pageSize = query.pageSize ?? 12;
      const offset = (Math.max(1, page) - 1) * pageSize;

      const where = new Where().add("status = 'published'").add('town_slug = ?', query.townSlug);
      if (query.kind) {
        const kinds = Array.isArray(query.kind) ? query.kind : [query.kind];
        where.add('kind = any(?)', kinds);
      }
      where.addIf(query.tag, 'tags @> ?::text[]', query.tag ? [query.tag] : []);
      where.addIf(query.excludeId, 'id <> ?', query.excludeId);

      const term = query.q?.trim();
      let orderBy = 'published_at desc';
      if (term) {
        const idx = where.push(term);
        where.add(`search_vector @@ websearch_to_tsquery('english', ?)`, term);
        orderBy = `ts_rank(search_vector, websearch_to_tsquery('english', $${idx})) desc`;
      }

      const limitIdx = where.nextIndex();
      const offsetIdx = limitIdx + 1;
      const sql = `select * from articles ${where.sql()} order by ${orderBy} limit $${limitIdx} offset $${offsetIdx}`;
      const countSql = `select count(*)::int as total from articles ${where.sql()}`;

      const [{ rows }, countResult] = await Promise.all([
        db().query(sql, [...where.params(), pageSize, offset]),
        db().query(countSql, where.params()),
      ]);
      const total = countResult.rows[0]?.total ?? 0;

      return {
        items: rows.map(toArticle),
        total,
        page,
        pageSize,
        hasMore: offset + rows.length < total,
      };
    },

    async getArticleBySlug(townSlug, slug) {
      const { rows } = await db().query(
        `select * from articles where town_slug = $1 and slug = $2 and status = 'published' limit 1`,
        [townSlug, slug],
      );
      return rows[0] ? toArticle(rows[0]) : null;
    },

    async getEvents(query: EventQuery): Promise<Paginated<TownEvent>> {
      const page = query.page ?? 1;
      const pageSize = query.pageSize ?? 12;
      const offset = (Math.max(1, page) - 1) * pageSize;
      const window = query.window ?? 'upcoming';

      const where = new Where().add("status = 'published'").add('town_slug = ?', query.townSlug);
      if (window === 'upcoming') where.add('effective_end >= now()');
      if (window === 'past') where.add('effective_end < now()');
      where.addIf(query.from, 'starts_at >= ?', query.from);
      where.addIf(query.to, 'starts_at <= ?', query.to);
      where.addIf(query.tag, 'tags @> ?::text[]', query.tag ? [query.tag] : []);
      where.addIf(query.excludeId, 'id <> ?', query.excludeId);

      const term = query.q?.trim();
      let orderBy = window === 'past' ? 'starts_at desc' : 'starts_at asc';
      if (term) {
        const idx = where.push(term);
        where.add(`search_vector @@ websearch_to_tsquery('english', ?)`, term);
        orderBy = `ts_rank(search_vector, websearch_to_tsquery('english', $${idx})) desc`;
      }

      const limitIdx = where.nextIndex();
      const offsetIdx = limitIdx + 1;
      const sql = `select * from events ${where.sql()} order by ${orderBy} limit $${limitIdx} offset $${offsetIdx}`;
      const countSql = `select count(*)::int as total from events ${where.sql()}`;

      const [{ rows }, countResult] = await Promise.all([
        db().query(sql, [...where.params(), pageSize, offset]),
        db().query(countSql, where.params()),
      ]);
      const total = countResult.rows[0]?.total ?? 0;

      return {
        items: rows.map(toEvent),
        total,
        page,
        pageSize,
        hasMore: offset + rows.length < total,
      };
    },

    async getEventBySlug(townSlug, slug) {
      const { rows } = await db().query(
        `select * from events where town_slug = $1 and slug = $2 and status = 'published' limit 1`,
        [townSlug, slug],
      );
      return rows[0] ? toEvent(rows[0]) : null;
    },

    async search(townSlug, term, limit = 20): Promise<SearchHit[]> {
      const clean = term.trim();
      if (!clean) return [];

      const { rows } = await db().query(
        `
        (
          select 'listing' as kind, id, title, summary, directory, null as article_kind, slug,
                 featured_image, tier,
                 ts_rank(search_vector, websearch_to_tsquery('english', $2)) as rank
          from listings
          where town_slug = $1 and status = 'published'
            and search_vector @@ websearch_to_tsquery('english', $2)
        )
        union all
        (
          select 'article' as kind, id, title, summary, null as directory, kind as article_kind, slug,
                 featured_image, null as tier,
                 ts_rank(search_vector, websearch_to_tsquery('english', $2)) as rank
          from articles
          where town_slug = $1 and status = 'published'
            and search_vector @@ websearch_to_tsquery('english', $2)
        )
        union all
        (
          select 'event' as kind, id, title, summary, null as directory, null as article_kind, slug,
                 featured_image, tier,
                 ts_rank(search_vector, websearch_to_tsquery('english', $2)) as rank
          from events
          where town_slug = $1 and status = 'published'
            and search_vector @@ websearch_to_tsquery('english', $2)
        )
        order by rank desc
        limit $3
        `,
        [townSlug, clean, limit],
      );

      return rows.map((row: Row): SearchHit => {
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
      const [listings, articles, events] = await Promise.all([
        db().query(
          `select directory, slug, updated_at, tier, seo from listings where town_slug = $1 and status = 'published'`,
          [townSlug],
        ),
        db().query(
          `select kind, slug, updated_at, seo from articles where town_slug = $1 and status = 'published'`,
          [townSlug],
        ),
        db().query(
          `select slug, updated_at, seo from events where town_slug = $1 and status = 'published'`,
          [townSlug],
        ),
      ]);

      const entries: SitemapEntry[] = [];
      for (const row of listings.rows) {
        if (row.seo?.noindex) continue;
        entries.push({
          path: listingHref({ directory: row.directory, slug: row.slug }),
          updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : row.updated_at,
          priority: row.tier === 'free' ? 0.6 : 0.8,
        });
      }
      for (const row of articles.rows) {
        if (row.seo?.noindex) continue;
        entries.push({
          path: articleHref({ kind: row.kind, slug: row.slug }),
          updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : row.updated_at,
          priority: 0.7,
        });
      }
      for (const row of events.rows) {
        if (row.seo?.noindex) continue;
        entries.push({
          path: eventHref({ slug: row.slug }),
          updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : row.updated_at,
          priority: 0.6,
        });
      }
      return entries;
    },
  };
}
