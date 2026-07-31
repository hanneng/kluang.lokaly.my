/**
 * Imports the bundled seed content (src/data/seed/**) into a native Postgres
 * database, so switching `DATA_SOURCE` from `seed` to `postgres` doesn't
 * regress a live site to an empty one.
 *
 * This is deliberately a one-time bootstrap, not an ongoing sync: it upserts
 * by the same natural key the schema uses (town_slug, directory/kind, slug),
 * so re-running it after editing seed data is safe and idempotent, but it is
 * not how real content should be maintained long-term — that's what the
 * (future) admin dashboard is for.
 *
 * Run: npx tsx scripts/import-seed.mjs
 * Requires the same DB_* env vars as scripts/migrate.mjs.
 */

import pg from 'pg';

// Run via `npx tsx scripts/import-seed.mjs` — tsx provides the TypeScript
// loader, so these .ts imports resolve with no separate compiled copy needed.
const { SEED } = await import('../src/data/seed/index.ts');
const { DIRECTORY_TYPES, DIRECTORY_ORDER } = await import('../src/config/directories.ts');

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

async function importCategories(townSlug) {
  // Seed content has no separate categories array — derive them from the
  // directory registry, the same source the seed adapter reads at request time.
  let count = 0;
  for (const directory of DIRECTORY_ORDER) {
    for (const [index, category] of DIRECTORY_TYPES[directory].categories.entries()) {
      await client.query(
        `insert into categories (town_slug, directory, slug, name, description, sort_order)
         values ($1, $2, $3, $4, $5, $6)
         on conflict (town_slug, directory, slug) do update set
           name = excluded.name, description = excluded.description, sort_order = excluded.sort_order`,
        [townSlug, directory, category.slug, category.name, category.description, index],
      );
      count += 1;
    }
  }
  return count;
}

async function importListings(townSlug, listings) {
  for (const l of listings) {
    await client.query(
      `insert into listings (
         town_slug, directory, category_slugs, slug, title, summary, body,
         featured_image, gallery, address, area, postcode, lat, lng, opening_hours,
         contact, price_range, price_note, rating_value, rating_count, rating_source,
         facilities, tags, faqs, tier, hidden_gem, weight, status, verified, seo,
         published_at, updated_at
       ) values (
         $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,
         $22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32
       )
       on conflict (town_slug, directory, slug) do update set
         category_slugs = excluded.category_slugs, title = excluded.title,
         summary = excluded.summary, body = excluded.body,
         featured_image = excluded.featured_image, gallery = excluded.gallery,
         address = excluded.address, area = excluded.area, postcode = excluded.postcode,
         lat = excluded.lat, lng = excluded.lng, opening_hours = excluded.opening_hours,
         contact = excluded.contact, price_range = excluded.price_range,
         price_note = excluded.price_note, rating_value = excluded.rating_value,
         rating_count = excluded.rating_count, rating_source = excluded.rating_source,
         facilities = excluded.facilities, tags = excluded.tags, faqs = excluded.faqs,
         tier = excluded.tier, hidden_gem = excluded.hidden_gem, weight = excluded.weight,
         status = excluded.status, verified = excluded.verified, seo = excluded.seo,
         updated_at = excluded.updated_at`,
      [
        townSlug,
        l.directory,
        l.categorySlugs,
        l.slug,
        l.title,
        l.summary,
        l.body,
        JSON.stringify(l.featuredImage),
        JSON.stringify(l.gallery),
        l.address,
        l.area ?? null,
        l.postcode ?? null,
        l.coordinates?.lat ?? null,
        l.coordinates?.lng ?? null,
        l.openingHours ? JSON.stringify(l.openingHours) : null,
        JSON.stringify(l.contact),
        l.priceRange ?? null,
        l.priceNote ?? null,
        l.rating?.value ?? null,
        l.rating?.count ?? null,
        l.rating?.source ?? null,
        l.facilities,
        l.tags,
        JSON.stringify(l.faqs),
        l.tier,
        l.hiddenGem,
        l.weight,
        l.status,
        l.verified,
        JSON.stringify(l.seo),
        l.publishedAt,
        l.updatedAt,
      ],
    );
  }
  return listings.length;
}

async function importArticles(townSlug, articles) {
  for (const a of articles) {
    await client.query(
      `insert into articles (
         town_slug, kind, slug, title, summary, body, featured_image, gallery,
         author, sponsor, tags, faqs, related_listing_ids, reading_minutes,
         status, seo, published_at, updated_at
       ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
       on conflict (town_slug, slug) do update set
         kind = excluded.kind, title = excluded.title, summary = excluded.summary,
         body = excluded.body, featured_image = excluded.featured_image,
         gallery = excluded.gallery, author = excluded.author, sponsor = excluded.sponsor,
         tags = excluded.tags, faqs = excluded.faqs,
         related_listing_ids = excluded.related_listing_ids,
         reading_minutes = excluded.reading_minutes, status = excluded.status,
         seo = excluded.seo, updated_at = excluded.updated_at`,
      [
        townSlug,
        a.kind,
        a.slug,
        a.title,
        a.summary,
        a.body,
        JSON.stringify(a.featuredImage),
        JSON.stringify(a.gallery),
        JSON.stringify(a.author),
        a.sponsor ? JSON.stringify(a.sponsor) : null,
        a.tags,
        JSON.stringify(a.faqs),
        // related_listing_ids references listings.id (uuid), but seed data
        // uses string slugs like "kluang-attractions-...". Listings get
        // fresh server-generated UUIDs on insert, so this can't be resolved
        // at import time — left empty for now. Wire up properly once content
        // is edited through a real admin UI operating on stable UUIDs.
        [],
        a.readingMinutes,
        a.status,
        JSON.stringify(a.seo),
        a.publishedAt,
        a.updatedAt,
      ],
    );
  }
  return articles.length;
}

async function importEvents(townSlug, events) {
  for (const e of events) {
    await client.query(
      `insert into events (
         town_slug, slug, title, summary, body, featured_image, gallery,
         starts_at, ends_at, all_day, recurrence, venue_name, address, lat, lng,
         organiser, contact, ticket_url, price_note, tags, tier, status, seo, updated_at
       ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24)
       on conflict (town_slug, slug) do update set
         title = excluded.title, summary = excluded.summary, body = excluded.body,
         featured_image = excluded.featured_image, gallery = excluded.gallery,
         starts_at = excluded.starts_at, ends_at = excluded.ends_at,
         all_day = excluded.all_day, recurrence = excluded.recurrence,
         venue_name = excluded.venue_name, address = excluded.address,
         lat = excluded.lat, lng = excluded.lng, organiser = excluded.organiser,
         contact = excluded.contact, ticket_url = excluded.ticket_url,
         price_note = excluded.price_note, tags = excluded.tags, tier = excluded.tier,
         status = excluded.status, seo = excluded.seo, updated_at = excluded.updated_at`,
      [
        townSlug,
        e.slug,
        e.title,
        e.summary,
        e.body,
        JSON.stringify(e.featuredImage),
        JSON.stringify(e.gallery),
        e.startsAt,
        e.endsAt ?? null,
        e.allDay,
        e.recurrence ?? null,
        e.venueName,
        e.address,
        e.coordinates?.lat ?? null,
        e.coordinates?.lng ?? null,
        e.organiser ?? null,
        JSON.stringify(e.contact),
        e.ticketUrl ?? null,
        e.priceNote ?? null,
        e.tags,
        e.tier,
        e.status,
        JSON.stringify(e.seo),
        e.updatedAt,
      ],
    );
  }
  return events.length;
}

async function main() {
  await client.connect();
  console.log(`Connected to ${process.env.DB_HOST}/${process.env.DB_NAME ?? 'postgres'}`);

  for (const [townSlug, content] of Object.entries(SEED)) {
    if (content.listings.length === 0 && content.articles.length === 0 && content.events.length === 0) {
      console.log(`skip  ${townSlug} (no seed content)`);
      continue;
    }

    console.log(`== ${townSlug} ==`);
    console.log(`  categories: ${await importCategories(townSlug)}`);
    console.log(`  listings:   ${await importListings(townSlug, content.listings)}`);
    console.log(`  articles:   ${await importArticles(townSlug, content.articles)}`);
    console.log(`  events:     ${await importEvents(townSlug, content.events)}`);
  }

  console.log('Done.');
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => client.end());
