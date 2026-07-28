import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Server-side Supabase clients.
 *
 * Two flavours:
 *   - `getSupabaseServer()` uses the anon key and is subject to RLS. Everything
 *     the public site reads goes through this.
 *   - `getSupabaseAdmin()` uses the service-role key and bypasses RLS. Only the
 *     admin dashboard and server actions may touch it, never a client bundle.
 */

let anonClient: SupabaseClient | null = null;
let adminClient: SupabaseClient | null = null;

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `${name} is not set. Either configure Supabase or run with DATA_SOURCE=seed.`,
    );
  }
  return value;
}

export function getSupabaseServer(): SupabaseClient {
  if (!anonClient) {
    anonClient = createClient(
      requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
      requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
      { auth: { persistSession: false } },
    );
  }
  return anonClient;
}

export function getSupabaseAdmin(): SupabaseClient {
  if (!adminClient) {
    adminClient = createClient(
      requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
      requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
  }
  return adminClient;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
