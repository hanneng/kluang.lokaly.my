/**
 * Content repository contract.
 *
 * Every page reads data through this interface, never through Supabase or a
 * seed file directly. That gives us three things:
 *
 *   1. the site runs with zero credentials during development (seed adapter);
 *   2. swapping Postgres for anything else is one file, not a hundred;
 *   3. filtering/sorting semantics are defined once and tested once.
 */

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

/** Filter options available for a directory, derived from live content. */
export interface DirectoryFacets {
  areas: Array<{ value: string; count: number }>;
  categories: Array<{ value: string; label: string; count: number }>;
  facilities: Array<{ value: string; count: number }>;
  tags: Array<{ value: string; count: number }>;
  priceRanges: Array<{ value: number; count: number }>;
}

/** A single result in the cross-content search. */
export interface SearchHit {
  kind: 'listing' | 'article' | 'event';
  id: string;
  title: string;
  summary: string;
  href: string;
  image?: string;
  /** Directory or article kind, shown as a chip on the result. */
  badge: string;
  score: number;
}

/** Entry used to build the sitemap without loading full records. */
export interface SitemapEntry {
  path: string;
  updatedAt: string;
  /** Relative priority hint, 0–1. */
  priority: number;
}

export interface ContentRepository {
  // Listings ---------------------------------------------------------------
  getListings(query: ListingQuery): Promise<Paginated<Listing>>;
  getListingBySlug(
    townSlug: string,
    directory: DirectorySlug,
    slug: string,
  ): Promise<Listing | null>;
  getListingsByIds(townSlug: string, ids: string[]): Promise<Listing[]>;
  getNearbyListings(query: NearbyQuery): Promise<Array<WithDistance<Listing>>>;

  // Taxonomy ---------------------------------------------------------------
  getCategories(townSlug: string, directory?: DirectorySlug): Promise<Category[]>;
  getFacets(townSlug: string, directory?: DirectorySlug): Promise<DirectoryFacets>;

  // Editorial --------------------------------------------------------------
  getArticles(query: ArticleQuery): Promise<Paginated<Article>>;
  getArticleBySlug(townSlug: string, slug: string): Promise<Article | null>;

  // Events -----------------------------------------------------------------
  getEvents(query: EventQuery): Promise<Paginated<TownEvent>>;
  getEventBySlug(townSlug: string, slug: string): Promise<TownEvent | null>;

  // Cross-cutting ----------------------------------------------------------
  search(townSlug: string, term: string, limit?: number): Promise<SearchHit[]>;
  getSitemapEntries(townSlug: string): Promise<SitemapEntry[]>;
}
