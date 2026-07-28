/**
 * Town registry and hostname resolution.
 *
 * One deployment serves the whole network. The hostname decides which town
 * config is active; middleware resolves it once per request and forwards the
 * slug on a header that server components read via `getTown()`.
 *
 * Adding a town = adding a file here + a row in the registry. Nothing else.
 */

import type { TownConfig } from '@/types/town';
import { kluang } from './kluang';
import { batuPahat } from './batu-pahat';

export const TOWNS: Record<string, TownConfig> = {
  [kluang.slug]: kluang,
  [batuPahat.slug]: batuPahat,
};

/**
 * Used for local development, CLI scripts and any request whose hostname does
 * not match a configured town.
 */
export const DEFAULT_TOWN_SLUG = process.env.NEXT_PUBLIC_DEFAULT_TOWN ?? kluang.slug;

/** Towns that should be crawled, listed in the network switcher and sitemapped. */
export function liveTowns(): TownConfig[] {
  return Object.values(TOWNS).filter((town) => town.status !== 'planned');
}

export function allTowns(): TownConfig[] {
  return Object.values(TOWNS);
}

export function getTownBySlug(slug: string): TownConfig | undefined {
  return TOWNS[slug];
}

/** Throws rather than returning undefined — used where a town must exist. */
export function requireTownBySlug(slug: string): TownConfig {
  const town = TOWNS[slug];
  if (!town) {
    throw new Error(
      `Unknown town "${slug}". Register it in src/config/towns/index.ts before using it.`,
    );
  }
  return town;
}

/**
 * Resolve a town from a request hostname.
 *
 * Matching order:
 *   1. exact domain match          (kluang.lokaly.my)
 *   2. explicit alias match        (batupahat.xyz, *.localhost:3000)
 *   3. first sub-domain label      (kluang.lokaly.my → "kluang")
 *   4. `NEXT_PUBLIC_DEFAULT_TOWN`
 *
 * Step 3 means a brand-new town works the moment DNS points at the deployment,
 * as long as the sub-domain matches its slug.
 */
export function resolveTownByHost(host: string | null | undefined): TownConfig {
  const fallback = requireTownBySlug(DEFAULT_TOWN_SLUG);
  if (!host) return fallback;

  const normalised = host.toLowerCase().trim();
  const withoutPort = normalised.split(':')[0] ?? normalised;

  for (const town of Object.values(TOWNS)) {
    if (town.domain.toLowerCase() === normalised || town.domain.toLowerCase() === withoutPort) {
      return town;
    }
    const aliasHit = town.aliases?.some((alias) => {
      const a = alias.toLowerCase();
      return a === normalised || a === withoutPort;
    });
    if (aliasHit) return town;
  }

  const label = withoutPort.split('.')[0];
  if (label) {
    const bySubdomain = getTownBySlug(label);
    if (bySubdomain) return bySubdomain;
  }

  return fallback;
}

/** Absolute origin for a town, used for canonicals, sitemaps and OG tags. */
export function townOrigin(town: TownConfig): string {
  const override = process.env.NEXT_PUBLIC_SITE_ORIGIN;
  if (override) return override.replace(/\/$/, '');
  return `https://${town.domain}`;
}
