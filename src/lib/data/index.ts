/**
 * Repository selection.
 *
 * `DATA_SOURCE=supabase` switches the whole site onto Postgres. Anything else
 * (including unset) uses the bundled seed content, so a fresh clone runs.
 *
 * Import `getRepository()` — never an adapter directly.
 */

import { createSeedRepository } from './adapters/seed';
import { createSupabaseRepository } from './adapters/supabase';
import { withCache } from './cached';
import { isSupabaseConfigured } from '@/lib/supabase/server';
import type { ContentRepository } from './repository';

let instance: ContentRepository | null = null;

export function getRepository(): ContentRepository {
  if (instance) return instance;

  const source = process.env.DATA_SOURCE ?? 'seed';

  if (source === 'supabase') {
    if (!isSupabaseConfigured()) {
      throw new Error(
        'DATA_SOURCE=supabase but NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are missing.',
      );
    }
    // Only the database-backed adapter is worth caching; the seed adapter is
    // already an in-memory array scan, and caching it would just make local
    // content edits appear not to take effect.
    instance = withCache(createSupabaseRepository());
  } else {
    if (process.env.NODE_ENV === 'production' && process.env.ALLOW_SEED_IN_PRODUCTION !== '1') {
      // Loud, but not fatal — a demo deployment is a legitimate use. Seed
      // listings are illustrative: place names are real, but hours, prices and
      // phone numbers are placeholders, and every record renders an
      // "unverified" notice. Do not run a public launch on them.
      console.warn(
        '\n[lokaly] WARNING: serving SEED content in production.\n' +
          '         Seed listings are illustrative and unverified.\n' +
          '         Set DATA_SOURCE=supabase before a real launch.\n',
      );
    }
    instance = createSeedRepository();
  }

  return instance;
}

/** Test seam — lets a spec inject a stub repository. */
export function __setRepository(repo: ContentRepository | null): void {
  instance = repo;
}

export type { ContentRepository, DirectoryFacets, SearchHit, SitemapEntry } from './repository';
