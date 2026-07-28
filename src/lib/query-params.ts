/**
 * URL <-> query translation.
 *
 * Filters live entirely in the URL, which makes every filtered view
 * shareable, bookmarkable, back-button-correct and server-renderable. This
 * module is the single place the mapping is defined, used by both the server
 * pages and the client filter UI.
 */

import type { ListingQuery, ListingSort } from '@/types/query';
import type { DirectorySlug, PriceRange } from '@/types/content';

/** Next 15 passes searchParams as a promise of this shape. */
export type SearchParams = Record<string, string | string[] | undefined>;

const first = (value: string | string[] | undefined): string | undefined =>
  Array.isArray(value) ? value[0] : value;

/** Multi-value params are encoded as comma-separated lists, not repeats. */
const list = (value: string | string[] | undefined): string[] => {
  const raw = Array.isArray(value) ? value.join(',') : value;
  if (!raw) return [];
  return raw
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
};

const SORTS = new Set<ListingSort>(['relevance', 'featured', 'rating', 'newest', 'alphabetical']);

export interface ParsedFilters {
  q?: string;
  category?: string;
  area?: string;
  price: PriceRange[];
  minRating?: number;
  facilities: string[];
  featuredOnly: boolean;
  sort?: ListingSort;
  page: number;
}

export function parseFilters(params: SearchParams): ParsedFilters {
  const sortRaw = first(params.sort) as ListingSort | undefined;
  const ratingRaw = Number(first(params.rating));
  const pageRaw = Number(first(params.page));

  return {
    q: first(params.q)?.trim() || undefined,
    category: first(params.category) || undefined,
    area: first(params.area) || undefined,
    price: list(params.price)
      .map(Number)
      .filter((value): value is PriceRange => value >= 1 && value <= 4),
    minRating: Number.isFinite(ratingRaw) && ratingRaw > 0 ? ratingRaw : undefined,
    facilities: list(params.facilities),
    featuredOnly: first(params.featured) === '1',
    sort: sortRaw && SORTS.has(sortRaw) ? sortRaw : undefined,
    page: Number.isFinite(pageRaw) && pageRaw > 0 ? Math.floor(pageRaw) : 1,
  };
}

export function toListingQuery(
  townSlug: string,
  filters: ParsedFilters,
  overrides: Partial<ListingQuery> = {},
): ListingQuery {
  return {
    townSlug,
    q: filters.q,
    categorySlug: filters.category,
    area: filters.area,
    priceRange: filters.price.length > 0 ? filters.price : undefined,
    minRating: filters.minRating,
    facilities: filters.facilities.length > 0 ? filters.facilities : undefined,
    featuredOnly: filters.featuredOnly || undefined,
    sort: filters.sort,
    page: filters.page,
    ...overrides,
  };
}

/** True when anything is filtering the result set — drives the "Clear" button. */
export function hasActiveFilters(filters: ParsedFilters): boolean {
  return Boolean(
    filters.q ||
      filters.category ||
      filters.area ||
      filters.price.length ||
      filters.minRating ||
      filters.facilities.length ||
      filters.featuredOnly,
  );
}

/** Serialise filters back to a query string, omitting defaults. */
export function filtersToSearchParams(filters: Partial<ParsedFilters>): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.q) params.set('q', filters.q);
  if (filters.category) params.set('category', filters.category);
  if (filters.area) params.set('area', filters.area);
  if (filters.price?.length) params.set('price', filters.price.join(','));
  if (filters.minRating) params.set('rating', String(filters.minRating));
  if (filters.facilities?.length) params.set('facilities', filters.facilities.join(','));
  if (filters.featuredOnly) params.set('featured', '1');
  if (filters.sort) params.set('sort', filters.sort);
  if (filters.page && filters.page > 1) params.set('page', String(filters.page));
  return params;
}

/**
 * Pages beyond the first are `noindex`, and so is any filtered view.
 *
 * Rationale: filter permutations generate a combinatorial explosion of
 * near-duplicate pages. We index the clean directory and category landing
 * pages — which have unique copy — and let the rest be crawled but not indexed.
 */
export function shouldNoindex(filters: ParsedFilters): boolean {
  return hasActiveFilters(filters) || filters.page > 1;
}

export const DIRECTORY_PARAM = 'directory';

export function parseDirectoryParam(params: SearchParams): DirectorySlug | undefined {
  return first(params[DIRECTORY_PARAM]) as DirectorySlug | undefined;
}
