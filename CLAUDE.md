# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Lokaly is a reusable multi-town tourism & community portal. This repo currently serves two towns (`kluang.lokaly.my`, `batupahat.xyz`) from one codebase and one deployment — a new town is a config file, not a fork. Next.js 15 (App Router) + TypeScript + Tailwind CSS v4, with a bundled in-memory seed adapter so the site runs with zero credentials, and a Supabase/Postgres adapter behind the same interface for production content.

## Commands

```bash
npm run dev         # local dev server
npm run build        # production build
npm run start         # run a production build
npm run typecheck     # tsc --noEmit
npm run lint          # next lint
node scripts/generate-placeholders.mjs   # regenerate placeholder SVG imagery
```

There is no test runner configured in this repo — verify changes with `typecheck` and `lint`, and by exercising the route in `npm run dev`.

`package.json` also declares `seed:sql` and `town:new` scripts pointing at `scripts/generate-seed-sql.ts` and `scripts/new-town.ts` — neither file exists yet, so don't rely on them.

## Multi-tenancy — the core architectural fact

Everything else in this codebase follows from one decision: **one deployment serves every town, and the request hostname decides which town is active.**

1. `src/middleware.ts` resolves the town from the request `Host` header (exact domain → alias → first sub-domain label → `NEXT_PUBLIC_DEFAULT_TOWN`) and forwards it as the `x-town-slug` header. In non-production, `?town=<slug>` on any hostname previews a different town.
2. `src/lib/town/context.ts#getTown()` is the *only* sanctioned way for a server component to learn the active town — it reads that header via `next/headers`, wrapped in React `cache()`. It is deliberately not wrapped in try/catch: `headers()` throwing during static generation is what forces the route to render dynamically instead of being statically prerendered. Do not add a fallback that swallows that throw — that would bake one town's HTML into every domain, the worst failure mode for this architecture.
3. `src/config/towns/*.ts` is one file per town (name, domain/aliases, coordinates, theme, SEO defaults, monetisation prices, feature flags), registered in `src/config/towns/index.ts`. Adding a town: copy an existing town file, edit it, register it in the index, optionally add seed content under `src/data/seed/<slug>/`, point DNS at the deployment.
4. Because pages depend on hostname, town-aware routes **cannot use `generateStaticParams`/full prerendering** — check `src/app/[directory]/page.tsx` for the reasoning if you're tempted to add it. Instead, data is cached per-town in `src/lib/data/cached.ts` (`unstable_cache`, tagged `town:<slug>` / `town:<slug>:<family>`), while HTML rendering stays dynamic. Route-level `export const revalidate = <seconds>` values must stay in sync with the reference table in `src/config/site.ts` (`REVALIDATE`) — Next requires a literal there, so grep for the old number when changing it.

## Directory types (Hotels, Homestays, Food, Cafes, Attractions, Shopping, Businesses)

All seven directories are data, not code: `src/config/directories.ts` (`DIRECTORY_TYPES`) describes each one's labels, SEO copy templates (`{{town}}`/`{{state}}` tokens, rendered via `src/lib/template.ts#t()`), filter facets, schema.org type, default categories, and "nearby" rail order. A single route template (`src/app/[directory]/`, `src/app/[directory]/[slug]/`, `src/app/[directory]/category/[category]/`) serves all seven — new directory behavior belongs in the registry, not a new route.

## Data layer

Never import a data adapter directly — always go through `getRepository()` in `src/lib/data/index.ts`.

- `src/lib/data/repository.ts` — the `ContentRepository` interface every page codes against.
- `src/lib/data/adapters/seed.ts` — reads `src/data/seed/**` (in-memory, one folder per town). This is the default (`DATA_SOURCE` unset or `seed`) and needs no credentials.
- `src/lib/data/adapters/supabase.ts` — Postgres via Supabase, selected with `DATA_SOURCE=supabase`. Only this adapter is wrapped in `withCache()`; caching the seed adapter would make local content edits appear not to take effect.
- Seed listings are illustrative: real place names, placeholder hours/prices/phone numbers, and every seed record renders an "unverified" notice (`src/components/listing/unverified-notice.tsx`) until a human verifies it. Serving seed content in a production build requires `ALLOW_SEED_IN_PRODUCTION=1` and logs a warning — treat that as demo-only, never a real launch.

## Environment / deployment notes

- `.env.example` documents every variable; with none set at all, the site runs fully on seed content.
- README.md describes deployment to Vercel/Cloudflare Pages with Cloudflare R2 for images; the actual current hosting target for this repo is an AWS Lightsail Ubuntu server with Lightsail-managed Postgres and an S3 bucket for images (see `Readme-Kluang.txt` for connection details — treat that file as containing live credentials, not something to print, log, or commit changes near).
- Image remote hosts are configured via `NEXT_PUBLIC_R2_PUBLIC_HOST` in `next.config.ts` so a new town needs a bucket folder, not a config change.
- `src/middleware.ts`'s matcher already excludes static assets/image optimization — don't add per-route town resolution elsewhere.

## Conventions worth knowing before editing

- Path alias `@/*` → `./src/*`.
- `strict` TypeScript with `noUncheckedIndexedAccess` — array/record indexing returns `T | undefined`; don't add non-null assertions to work around it, narrow instead.
- Town/directory config objects are kept JSON-serialisable (plain data, `{{token}}` strings instead of functions) since the stated intent is to move them into Postgres later without a rewrite — don't reintroduce functions or non-serialisable values into `TownConfig` or `DirectoryTypeConfig`.
- Monetisation (Featured/Premium listings, Sponsored articles) is priced per town in `TownConfig.monetisation` and rendered via `AD_PACKAGES` in `src/config/site.ts`; paid placements must carry a `TierBadge` and sponsored articles must render their disclosure banner (`src/components/content/article-detail.tsx`) — don't add a paid placement type without both.
