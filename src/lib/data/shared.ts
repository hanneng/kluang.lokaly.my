/**
 * Query semantics shared by every repository adapter.
 *
 * The seed adapter runs these in memory; the Supabase adapter reuses the
 * scoring and sorting rules so both backends rank results identically. Keeping
 * them here is what stops "why is this ordered differently in production?".
 */

import type { Article, Listing, ListingTier, TownEvent } from '@/types/content';
import type { ListingSort, Paginated } from '@/types/query';

/** Commercial tiers sort above free listings, always. */
export const TIER_WEIGHT: Record<ListingTier, number> = {
  sponsored: 40,
  premium: 30,
  featured: 20,
  free: 0,
};

export function isPromoted(tier: ListingTier): boolean {
  return tier !== 'free';
}

export function paginate<T>(items: T[], page = 1, pageSize = 24): Paginated<T> {
  const safePage = Math.max(1, Math.floor(page));
  const safeSize = Math.max(1, Math.floor(pageSize));
  const start = (safePage - 1) * safeSize;
  const slice = items.slice(start, start + safeSize);
  return {
    items: slice,
    total: items.length,
    page: safePage,
    pageSize: safeSize,
    hasMore: start + slice.length < items.length,
  };
}

const normalise = (value: string): string => value.toLowerCase().normalize('NFKD');

/**
 * Keyword relevance score.
 *
 * Weighted so an exact title match always beats a body mention, and so a
 * paid tier can nudge but never fully override relevance — a Premium cafe
 * should not outrank an exact-name search for a free listing.
 */
export function scoreListing(listing: Listing, term: string): number {
  const q = normalise(term.trim());
  if (!q) return 0;
  const terms = q.split(/\s+/).filter(Boolean);
  if (terms.length === 0) return 0;

  const title = normalise(listing.title);
  const summary = normalise(listing.summary);
  const haystackExtras = normalise(
    [listing.area ?? '', listing.address, ...listing.tags, ...listing.facilities, ...listing.categorySlugs].join(' '),
  );
  const body = normalise(listing.body);

  let score = 0;
  if (title === q) score += 120;
  if (title.startsWith(q)) score += 40;

  for (const word of terms) {
    if (title.includes(word)) score += 30;
    if (summary.includes(word)) score += 12;
    if (haystackExtras.includes(word)) score += 8;
    if (body.includes(word)) score += 3;
  }

  // Every term must appear somewhere, otherwise it is not a match.
  const combined = `${title} ${summary} ${haystackExtras} ${body}`;
  if (!terms.every((word) => combined.includes(word))) return 0;

  return score + TIER_WEIGHT[listing.tier] / 4;
}

export function scoreArticle(article: Article, term: string): number {
  const q = normalise(term.trim());
  if (!q) return 0;
  const terms = q.split(/\s+/).filter(Boolean);
  const title = normalise(article.title);
  const summary = normalise(article.summary);
  const body = normalise(article.body);
  const tags = normalise(article.tags.join(' '));
  const combined = `${title} ${summary} ${tags} ${body}`;
  if (!terms.every((word) => combined.includes(word))) return 0;

  let score = 0;
  if (title === q) score += 110;
  for (const word of terms) {
    if (title.includes(word)) score += 28;
    if (summary.includes(word)) score += 12;
    if (tags.includes(word)) score += 8;
    if (body.includes(word)) score += 3;
  }
  return score;
}

export function scoreEvent(event: TownEvent, term: string): number {
  const q = normalise(term.trim());
  if (!q) return 0;
  const terms = q.split(/\s+/).filter(Boolean);
  const combined = normalise(
    [event.title, event.summary, event.venueName, event.body, ...event.tags].join(' '),
  );
  if (!terms.every((word) => combined.includes(word))) return 0;

  let score = 0;
  const title = normalise(event.title);
  for (const word of terms) {
    if (title.includes(word)) score += 28;
    if (combined.includes(word)) score += 6;
  }
  // Imminent events are more useful than ones six months out.
  const daysAway = (new Date(event.startsAt).getTime() - Date.now()) / 86_400_000;
  if (daysAway >= 0 && daysAway < 30) score += 15 - daysAway / 2;
  return score;
}

/**
 * Comparator factory for listing sort modes.
 *
 * `relevance` expects a pre-computed score map; every other mode falls back to
 * tier weight so paid placements stay above free listings within equal ranks.
 */
export function listingComparator(
  sort: ListingSort,
  scores?: Map<string, number>,
): (a: Listing, b: Listing) => number {
  const tierThen = (a: Listing, b: Listing): number =>
    TIER_WEIGHT[b.tier] - TIER_WEIGHT[a.tier] ||
    b.weight - a.weight ||
    a.title.localeCompare(b.title);

  switch (sort) {
    case 'relevance':
      return (a, b) =>
        (scores?.get(b.id) ?? 0) - (scores?.get(a.id) ?? 0) || tierThen(a, b);
    case 'rating':
      return (a, b) =>
        (b.rating?.value ?? 0) - (a.rating?.value ?? 0) ||
        (b.rating?.count ?? 0) - (a.rating?.count ?? 0) ||
        tierThen(a, b);
    case 'newest':
      return (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime() || tierThen(a, b);
    case 'alphabetical':
      return (a, b) => a.title.localeCompare(b.title);
    case 'featured':
    default:
      return tierThen;
  }
}

/** Count occurrences into a sorted `{value, count}` list for facet UIs. */
export function tally(values: string[]): Array<{ value: string; count: number }> {
  const counts = new Map<string, number>();
  for (const value of values) {
    if (!value) continue;
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return Array.from(counts, ([value, count]) => ({ value, count })).sort(
    (a, b) => b.count - a.count || a.value.localeCompare(b.value),
  );
}
