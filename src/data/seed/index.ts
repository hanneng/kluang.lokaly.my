/**
 * Seed content registry.
 *
 * Towns without seed content resolve to empty arrays rather than throwing, so
 * a newly registered town renders a valid (if sparse) site immediately.
 */

import type { Article, Listing, TownEvent } from '@/types/content';
import { kluangListings } from './kluang/listings';
import { kluangArticles } from './kluang/articles';
import { kluangEvents } from './kluang/events';

export interface SeedTown {
  listings: Listing[];
  articles: Article[];
  events: TownEvent[];
}

const EMPTY: SeedTown = { listings: [], articles: [], events: [] };

export const SEED: Record<string, SeedTown> = {
  kluang: {
    listings: kluangListings,
    articles: kluangArticles,
    events: kluangEvents,
  },
  // Batu Pahat content lives in WordPress until the migration runs.
  'batu-pahat': EMPTY,
};

export function getSeedTown(townSlug: string): SeedTown {
  return SEED[townSlug] ?? EMPTY;
}
