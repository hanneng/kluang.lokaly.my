import 'server-only';
import { headers } from 'next/headers';
import { cache } from 'react';
import {
  DEFAULT_TOWN_SLUG,
  getTownBySlug,
  requireTownBySlug,
  townOrigin,
} from '@/config/towns';
import type { TownConfig, FeatureFlag } from '@/types/town';

/**
 * Active town for the current request.
 *
 * Reads the slug that middleware resolved from the hostname. Wrapped in
 * `cache()` so repeated calls within one render share a single lookup.
 */
export const getTown = cache(async (): Promise<TownConfig> => {
  /*
   * Deliberately NOT wrapped in try/catch.
   *
   * `headers()` throws during static generation, and that throw is load-bearing:
   * it is what opts every town-aware route into dynamic rendering. Swallowing it
   * and falling back to the default town would prerender one town's HTML and
   * then serve it on every other town's domain — the worst possible failure mode
   * for a multi-tenant site, and a silent one.
   *
   * If a build fails here, the fix is to stop making that route static, not to
   * catch the error.
   */
  const headerList = await headers();
  const slug = headerList.get('x-town-slug');

  if (slug) {
    const town = getTownBySlug(slug);
    if (town) return town;
  }

  // No header: a direct request that bypassed middleware (health check, some
  // metadata routes). The default town is the correct answer here.
  return requireTownBySlug(DEFAULT_TOWN_SLUG);
});

/** Absolute origin of the active town, e.g. `https://kluang.lokaly.my`. */
export async function getTownOrigin(): Promise<string> {
  return townOrigin(await getTown());
}

/** Absolute URL for a path on the active town's domain. */
export async function absoluteUrl(path: string): Promise<string> {
  const origin = await getTownOrigin();
  return `${origin}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Feature-flag check for the active town. */
export async function hasFeature(flag: FeatureFlag): Promise<boolean> {
  const town = await getTown();
  return town.features[flag] === true;
}
