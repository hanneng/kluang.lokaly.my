/** Shared query/filter contracts used by the repository layer and the UI. */

import type { DirectorySlug, PriceRange } from './content';

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  /** Convenience flag so the UI never has to do the arithmetic. */
  hasMore: boolean;
}

export type ListingSort = 'relevance' | 'featured' | 'rating' | 'newest' | 'alphabetical';

export interface ListingQuery {
  townSlug: string;
  /** Omit to search across every directory. */
  directory?: DirectorySlug | DirectorySlug[];
  categorySlug?: string;
  /** Free-text keyword, matched against title, summary, tags and facilities. */
  q?: string;
  area?: string;
  priceRange?: PriceRange[];
  minRating?: number;
  facilities?: string[];
  tags?: string[];
  featuredOnly?: boolean;
  hiddenGemOnly?: boolean;
  /** Restrict to listings that have coordinates — used by the map. */
  withCoordinatesOnly?: boolean;
  /** Exclude a listing (e.g. the one currently being viewed). */
  excludeId?: string;
  sort?: ListingSort;
  page?: number;
  pageSize?: number;
}

export interface ArticleQuery {
  townSlug: string;
  kind?: 'blog' | 'guide' | 'itinerary' | 'sponsored' | Array<'blog' | 'guide' | 'itinerary' | 'sponsored'>;
  tag?: string;
  q?: string;
  excludeId?: string;
  page?: number;
  pageSize?: number;
}

export interface EventQuery {
  townSlug: string;
  /** `upcoming` hides anything that has already finished. */
  window?: 'upcoming' | 'past' | 'all';
  from?: string;
  to?: string;
  tag?: string;
  q?: string;
  excludeId?: string;
  page?: number;
  pageSize?: number;
}

export interface NearbyQuery {
  townSlug: string;
  origin: { lat: number; lng: number };
  directory?: DirectorySlug | DirectorySlug[];
  /** Straight-line radius in kilometres. */
  radiusKm?: number;
  excludeId?: string;
  limit?: number;
}

/** A listing with its computed distance from a reference point. */
export interface WithDistance<T> {
  item: T;
  distanceKm: number;
}
