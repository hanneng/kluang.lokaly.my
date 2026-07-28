# Lokaly Platform — Kluang Guide

A reusable multi-town tourism & community portal, built for the [Lokaly.my](https://lokaly.my) network. This repo runs `kluang.lokaly.my` today and is designed so that `muar.lokaly.my`, `ipoh.lokaly.my`, `melaka.lokaly.my`, etc. share the exact same codebase — a new town is a config file, not a fork.

## Stack

- **Next.js 15** (App Router) + **TypeScript** + **Tailwind CSS v4**
- **Supabase / Postgres** for content (with a bundled in-memory seed adapter for zero-config local dev)
- **Cloudflare R2** for image storage
- **Auth.js** for the admin dashboard (roadmap)
- **MapLibre GL** for the interactive map, tiled via any vector style provider
- Deployable to **Vercel** or **Cloudflare Pages**

## How multi-tenancy works

1. `middleware.ts` resolves the active town from the request hostname (exact domain, alias, or first sub-domain label) and forwards it as `x-town-slug`.
2. `src/lib/town/context.ts#getTown()` reads that header in server components — this is the *only* way pages should get town data.
3. `src/config/towns/*.ts` holds one file per town: name, coordinates, theme colours, SEO defaults, monetisation prices, feature flags. `src/config/towns/index.ts` is the registry.
4. Because the active town depends on the request host, town-aware routes render dynamically rather than being statically prerendered — prerendering would bake one town's HTML into every domain. Data is cached instead, per town, at `src/lib/data/cached.ts`.

**Adding a new town:**

```bash
# 1. Copy an existing config
cp src/config/towns/kluang.ts src/config/towns/muar.ts
# 2. Edit slug, domain, coordinates, theme, editorial copy
# 3. Register it in src/config/towns/index.ts
# 4. Add seed content (optional) under src/data/seed/muar/
# 5. Point DNS at the deployment — done
```

## Directory types

Hotels, Homestays, Restaurants, Cafes, Attractions, Shopping and Local Businesses are all data-driven from `src/config/directories.ts` — one registry entry describes labels, SEO copy, facets, schema.org type and "nearby" rail order for each. A single route template (`src/app/[directory]/`) serves all seven.

## Getting started

```bash
npm install
npm run dev
```

The site runs immediately on bundled seed content (`src/data/seed`) — no database required. Seed listings are **illustrative**: place names are real, but hours, prices and phone numbers are placeholders, and every record renders an "unverified" notice until a human checks it.

Copy `.env.example` to `.env.local` to configure Supabase, R2, analytics, etc.

### Switching to Supabase

```bash
DATA_SOURCE=supabase
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

Run the migrations in `supabase/migrations/` against your project (see that folder's README once added).

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Local dev server |
| `npm run build` | Production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | Next lint |
| `node scripts/generate-placeholders.mjs` | Regenerate placeholder SVG imagery |

## Project structure

```
src/
  app/                 Routes (App Router)
  components/          UI, content, layout, marketing, listing, map components
  config/              Town registry, directory registry, site-wide config
  data/seed/            Bundled illustrative content per town
  lib/
    data/              Repository interface + seed/Supabase adapters + caching
    seo/               Metadata + JSON-LD builders
    town/              Active-town resolution (reads middleware header)
  types/               Domain types (Town, Listing, Article, Event, Query)
```

## Monetisation

Featured / Premium listings and Sponsored articles are configured per town in `TownConfig.monetisation` and rendered via `AD_PACKAGES` in `src/config/site.ts`. Every paid placement carries a visible badge (`TierBadge`) and sponsored articles open with a disclosure banner — see `src/components/content/article-detail.tsx`.

## License

Proprietary — Lokaly Media.
