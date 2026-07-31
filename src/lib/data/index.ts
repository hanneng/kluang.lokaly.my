/**
 * Repository selection.
 *
 * `DATA_SOURCE=supabase` targets a Supabase project (PostgREST + RPC).
 * `DATA_SOURCE=postgres` targets a plain managed Postgres instance (e.g. AWS
 * Lightsail) with no REST layer in front — raw SQL via `pg` instead.
 * Anything else (including unset) uses the bundled seed content, so a fresh
 * clone runs with zero configuration.
 *
 * Import `getRepository()` — never an adapter directly.
 */

import { createSeedRepository } from './adapters/seed';
import { createSupabaseRepository } from './adapters/supabase';
import { createPostgresRepository } from './adapters/postgres';
import { withCache } from './cached';
import { isSupabaseConfigured } from '@/lib/supabase/server';
import { isPostgresConfigured } from '@/lib/db/pool';
import type { ContentRepository } from './repository';

let instance: ContentRepository | null = null;

export function getRepository(): ContentRepository {
  if (instance) return instance;

  const source = process.env.DATA_SOURCE ?? 'seed';

  if (source === 'postgres') {
    if (!isPostgresConfigured()) {
      throw new Error('DATA_SOURCE=postgres but DB_HOST / DB_USER / DB_PASSWORD are missing.');
    }
    instance = withCache(createPostgresRepository());
  } else if (source === 'supabase') {
    if (!isSupabaseConfigured()) {
      throw new Error(
        'DATA_SOURCE=supabase but NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are missing.',
      );
    }
    // Only database-backed adapters are worth caching; the seed adapter is
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
