-- Lokaly platform — initial schema for the native Postgres adapter.
--
-- Multi-tenancy is column-based (`town_slug`), not schema- or database-based:
-- every table is shared across all towns and filtered by `town_slug`, mirroring
-- how the seed adapter and TownConfig registry already work. There is no
-- `towns` table — town metadata stays in `src/config/towns/*.ts`, matching the
-- rest of the codebase's "config, not database rows" approach for anything
-- that doesn't change per-deploy.
--
-- No extensions required (no earthdistance/cube, no postgis): the "nearby"
-- query uses a plain haversine formula in SQL, and full-text search uses core
-- Postgres `tsvector`/`websearch_to_tsquery`. This keeps the schema portable
-- to any managed Postgres, including ones that restrict CREATE EXTENSION.
--
-- `search_vector` is a plain column maintained by a BEFORE INSERT/UPDATE
-- trigger, not `GENERATED ALWAYS AS ... STORED`: Postgres classifies
-- `to_tsvector('english', ...)` as STABLE, not IMMUTABLE (the text search
-- configuration is technically alterable), and generated columns require a
-- strictly immutable expression. Triggers are the standard workaround.

create extension if not exists pgcrypto; -- gen_random_uuid()

create table if not exists categories (
  id           uuid primary key default gen_random_uuid(),
  town_slug    text not null,
  directory    text not null,
  slug         text not null,
  name         text not null,
  description  text,
  icon         text,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  unique (town_slug, directory, slug)
);

create table if not exists listings (
  id                 uuid primary key default gen_random_uuid(),
  town_slug          text not null,
  directory          text not null,
  category_slugs     text[] not null default '{}',
  slug               text not null,
  title              text not null,
  summary            text not null default '',
  body               text not null default '',
  featured_image     jsonb not null default '{}'::jsonb,
  gallery            jsonb not null default '[]'::jsonb,
  address            text not null default '',
  area               text,
  postcode           text,
  lat                double precision,
  lng                double precision,
  opening_hours      jsonb,
  contact            jsonb not null default '{}'::jsonb,
  price_range        smallint check (price_range between 1 and 4),
  price_note         text,
  rating_value       numeric(2,1),
  rating_count       integer,
  rating_source      text check (rating_source in ('editorial', 'google', 'community')),
  facilities         text[] not null default '{}',
  tags               text[] not null default '{}',
  faqs               jsonb not null default '[]'::jsonb,
  tier               text not null default 'free' check (tier in ('free', 'featured', 'premium', 'sponsored')),
  hidden_gem         boolean not null default false,
  weight             integer not null default 0,
  status             text not null default 'draft' check (status in ('draft', 'scheduled', 'published', 'archived')),
  verified           boolean not null default false,
  seo                jsonb not null default '{}'::jsonb,
  published_at       timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  search_vector      tsvector,
  unique (town_slug, directory, slug)
);

create index if not exists listings_town_directory_idx on listings (town_slug, directory) where status = 'published';
create index if not exists listings_search_idx on listings using gin (search_vector);
create index if not exists listings_tags_idx on listings using gin (tags);
create index if not exists listings_facilities_idx on listings using gin (facilities);
create index if not exists listings_category_slugs_idx on listings using gin (category_slugs);
create index if not exists listings_geo_idx on listings (lat, lng) where lat is not null;

create or replace function listings_search_vector_update() returns trigger as $$
begin
  new.search_vector :=
    setweight(to_tsvector('english', coalesce(new.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(new.summary, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(array_to_string(new.tags, ' '), '')), 'B') ||
    setweight(to_tsvector('english', coalesce(new.body, '')), 'D');
  return new;
end;
$$ language plpgsql;
-- (No volatility marker: this is a trigger function with a side effect on
-- NEW, not a pure expression — VOLATILE, the default, is the correct and only
-- sensible category here.)

drop trigger if exists listings_search_vector_trigger on listings;
create trigger listings_search_vector_trigger
  before insert or update on listings
  for each row execute function listings_search_vector_update();

create table if not exists articles (
  id                    uuid primary key default gen_random_uuid(),
  town_slug             text not null,
  kind                  text not null check (kind in ('blog', 'guide', 'itinerary', 'sponsored')),
  slug                  text not null,
  title                 text not null,
  summary               text not null default '',
  body                  text not null default '',
  featured_image        jsonb not null default '{}'::jsonb,
  gallery               jsonb not null default '[]'::jsonb,
  author                jsonb not null default '{"name":"Editorial team"}'::jsonb,
  sponsor               jsonb,
  tags                  text[] not null default '{}',
  faqs                  jsonb not null default '[]'::jsonb,
  related_listing_ids   uuid[] not null default '{}',
  reading_minutes       integer not null default 3,
  status                text not null default 'draft' check (status in ('draft', 'scheduled', 'published', 'archived')),
  seo                   jsonb not null default '{}'::jsonb,
  published_at          timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  search_vector         tsvector,
  unique (town_slug, slug)
);

create index if not exists articles_town_kind_idx on articles (town_slug, kind) where status = 'published';
create index if not exists articles_search_idx on articles using gin (search_vector);

create or replace function articles_search_vector_update() returns trigger as $$
begin
  new.search_vector :=
    setweight(to_tsvector('english', coalesce(new.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(new.summary, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(array_to_string(new.tags, ' '), '')), 'B') ||
    setweight(to_tsvector('english', coalesce(new.body, '')), 'D');
  return new;
end;
$$ language plpgsql;

drop trigger if exists articles_search_vector_trigger on articles;
create trigger articles_search_vector_trigger
  before insert or update on articles
  for each row execute function articles_search_vector_update();

create table if not exists events (
  id                 uuid primary key default gen_random_uuid(),
  town_slug          text not null,
  slug               text not null,
  title              text not null,
  summary            text not null default '',
  body               text not null default '',
  featured_image     jsonb not null default '{}'::jsonb,
  gallery            jsonb not null default '[]'::jsonb,
  starts_at          timestamptz not null,
  ends_at            timestamptz,
  all_day            boolean not null default false,
  recurrence         text,
  venue_name         text not null default '',
  address            text not null default '',
  lat                double precision,
  lng                double precision,
  venue_listing_id   uuid references listings (id) on delete set null,
  organiser          text,
  contact            jsonb not null default '{}'::jsonb,
  ticket_url         text,
  price_note         text,
  tags               text[] not null default '{}',
  tier               text not null default 'free' check (tier in ('free', 'featured', 'premium', 'sponsored')),
  status             text not null default 'draft' check (status in ('draft', 'scheduled', 'published', 'archived')),
  seo                jsonb not null default '{}'::jsonb,
  updated_at         timestamptz not null default now(),
  -- Coalesced end used to answer "is this event still upcoming?" without a
  -- CASE expression in every query.
  -- `coalesce()` over plain column references IS immutable (unlike
  -- to_tsvector with a language argument), so this one can stay a real
  -- generated column.
  effective_end      timestamptz generated always as (coalesce(ends_at, starts_at)) stored,
  search_vector      tsvector,
  unique (town_slug, slug)
);

create index if not exists events_town_window_idx on events (town_slug, effective_end) where status = 'published';
create index if not exists events_search_idx on events using gin (search_vector);

create or replace function events_search_vector_update() returns trigger as $$
begin
  new.search_vector :=
    setweight(to_tsvector('english', coalesce(new.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(new.summary, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(new.venue_name, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(array_to_string(new.tags, ' '), '')), 'B') ||
    setweight(to_tsvector('english', coalesce(new.body, '')), 'D');
  return new;
end;
$$ language plpgsql;

drop trigger if exists events_search_vector_trigger on events;
create trigger events_search_vector_trigger
  before insert or update on events
  for each row execute function events_search_vector_update();

-- Enquiries from the Advertise/Contact forms (see src/app/actions/leads.ts).
create table if not exists leads (
  id             uuid primary key default gen_random_uuid(),
  town_slug      text not null,
  kind           text not null check (kind in ('advertise', 'contact')),
  name           text not null,
  email          text not null,
  phone          text,
  business_name  text,
  package_id     text,
  message        text not null,
  created_at     timestamptz not null default now()
);

create index if not exists leads_town_created_idx on leads (town_slug, created_at desc);

-- Newsletter signups (see src/app/actions/newsletter.ts).
create table if not exists newsletter_subscribers (
  id           uuid primary key default gen_random_uuid(),
  town_slug    text not null,
  email        text not null,
  source       text,
  created_at   timestamptz not null default now(),
  unique (town_slug, email)
);
