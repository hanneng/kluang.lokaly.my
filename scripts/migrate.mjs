/**
 * Minimal migration runner — no framework, just numbered .sql files applied
 * once each, tracked in a `_migrations` table.
 *
 * Run: node scripts/migrate.mjs
 * Requires DB_HOST / DB_PORT / DB_USER / DB_PASSWORD / DB_NAME / DB_SSLMODE
 * in the environment (same vars the app's pg pool uses).
 */

import { readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const here = dirname(fileURLToPath(import.meta.url));
const migrationsDir = resolve(here, '../db/migrations');

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

const sslMode = process.env.DB_SSLMODE ?? 'require';

const client = new pg.Client({
  host: requireEnv('DB_HOST'),
  port: Number(process.env.DB_PORT ?? 5432),
  user: requireEnv('DB_USER'),
  password: requireEnv('DB_PASSWORD'),
  database: process.env.DB_NAME ?? 'postgres',
  ssl: sslMode === 'disable' ? false : { rejectUnauthorized: false },
});

async function main() {
  await client.connect();
  console.log(`Connected to ${process.env.DB_HOST}/${process.env.DB_NAME ?? 'postgres'}`);

  await client.query(`
    create table if not exists _migrations (
      name text primary key,
      applied_at timestamptz not null default now()
    )
  `);

  const applied = new Set(
    (await client.query('select name from _migrations')).rows.map((r) => r.name),
  );

  const files = readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  let ran = 0;
  for (const file of files) {
    if (applied.has(file)) {
      console.log(`skip  ${file} (already applied)`);
      continue;
    }
    const sql = readFileSync(resolve(migrationsDir, file), 'utf8');
    console.log(`apply ${file}`);
    await client.query('begin');
    try {
      await client.query(sql);
      await client.query('insert into _migrations (name) values ($1)', [file]);
      await client.query('commit');
      ran += 1;
    } catch (err) {
      await client.query('rollback');
      throw new Error(`Migration ${file} failed: ${err.message}`);
    }
  }

  console.log(ran > 0 ? `Applied ${ran} migration(s).` : 'Nothing to apply — up to date.');
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => client.end());
