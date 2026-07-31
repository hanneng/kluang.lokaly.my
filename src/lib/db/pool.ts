import 'server-only';
import { Pool } from 'pg';

/**
 * Connection pool for a raw (non-Supabase) Postgres instance — e.g. an AWS
 * Lightsail managed database.
 *
 * Deliberately a small pool: this app runs as one persistent Node process
 * (not per-request serverless functions), so a handful of connections is
 * enough and keeps us well under a small managed instance's connection
 * ceiling. Config is discrete fields (`DB_HOST`/`DB_USER`/...) rather than a
 * single connection URI so the password never needs percent-encoding —
 * several of the characters in a generated Lightsail password (`#`, `%`,
 * `:`, `,`) are URI-reserved.
 */

let pool: Pool | null = null;

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not set. Required when DATA_SOURCE=postgres.`);
  }
  return value;
}

export function isPostgresConfigured(): boolean {
  return Boolean(process.env.DB_HOST && process.env.DB_USER && process.env.DB_PASSWORD);
}

export function getPool(): Pool {
  if (pool) return pool;

  const sslMode = process.env.DB_SSLMODE ?? 'require';

  pool = new Pool({
    host: requireEnv('DB_HOST'),
    port: Number(process.env.DB_PORT ?? 5432),
    user: requireEnv('DB_USER'),
    password: requireEnv('DB_PASSWORD'),
    database: process.env.DB_NAME ?? 'postgres',
    // Lightsail managed Postgres requires TLS. We don't pin the RDS CA bundle
    // yet, so the channel is encrypted but the server cert isn't verified —
    // acceptable for now since the endpoint is a fixed AWS hostname, not
    // attacker-controllable DNS; tightening this later means downloading the
    // AWS RDS CA bundle and setting `ca` instead of `rejectUnauthorized`.
    ssl: sslMode === 'disable' ? false : { rejectUnauthorized: false },
    max: 8,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  });

  pool.on('error', (err) => {
    // Fired for idle clients that die in the background (e.g. a network
    // blip) — must be handled or it crashes the whole Node process.
    console.error('[pg pool] unexpected error on idle client', err);
  });

  return pool;
}

export async function withClient<T>(fn: (client: import('pg').PoolClient) => Promise<T>): Promise<T> {
  const client = await getPool().connect();
  try {
    return await fn(client);
  } finally {
    client.release();
  }
}
