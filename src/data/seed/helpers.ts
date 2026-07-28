/**
 * Seed-data helpers.
 *
 * ── Important ─────────────────────────────────────────────────────────────
 * Seed records are ILLUSTRATIVE. Place names are real geography, but opening
 * hours, phone numbers, prices and ratings are placeholders. Every seeded
 * record therefore ships with `verified: false`, which renders an "unverified"
 * notice in the UI and excludes it from `aggregateRating` JSON-LD.
 *
 * A record only flips to `verified: true` after a human has confirmed it.
 * ──────────────────────────────────────────────────────────────────────────
 */

import { readingMinutes } from '@/lib/datetime';
import { slugify } from '@/lib/utils';
import type {
  Article,
  Listing,
  MediaAsset,
  TownEvent,
} from '@/types/content';

/** Placeholder artwork bundled in `public/images/placeholders`. */
export function img(name: string, alt: string): MediaAsset {
  return {
    src: `/images/placeholders/${name}.svg`,
    alt,
    width: 1600,
    height: 1000,
  };
}

/** Contact details that are obviously not real, so nobody dials them. */
export const PLACEHOLDER_CONTACT = {
  phone: '+60 7-000 0000',
  whatsapp: '60700000000',
} as const;

const now = '2026-07-20T00:00:00.000Z';

type ListingSeed = Omit<
  Listing,
  | 'id'
  | 'townSlug'
  | 'slug'
  | 'status'
  | 'verified'
  | 'publishedAt'
  | 'updatedAt'
  | 'gallery'
  | 'faqs'
  | 'tags'
  | 'facilities'
  | 'seo'
  | 'weight'
  | 'hiddenGem'
  | 'tier'
> &
  Partial<
    Pick<
      Listing,
      'slug' | 'gallery' | 'faqs' | 'tags' | 'facilities' | 'seo' | 'weight' | 'hiddenGem' | 'tier' | 'publishedAt'
    >
  >;

export function defineListing(townSlug: string, seed: ListingSeed): Listing {
  const slug = seed.slug ?? slugify(seed.title);
  return {
    id: `${townSlug}-${seed.directory}-${slug}`,
    townSlug,
    slug,
    gallery: [],
    faqs: [],
    tags: [],
    facilities: [],
    seo: {},
    weight: 0,
    hiddenGem: false,
    tier: 'free',
    status: 'published',
    verified: false,
    publishedAt: now,
    updatedAt: now,
    ...seed,
  };
}

type ArticleSeed = Omit<
  Article,
  | 'id'
  | 'townSlug'
  | 'slug'
  | 'status'
  | 'publishedAt'
  | 'updatedAt'
  | 'gallery'
  | 'faqs'
  | 'tags'
  | 'seo'
  | 'relatedListingIds'
  | 'readingMinutes'
  | 'author'
> &
  Partial<
    Pick<
      Article,
      'slug' | 'gallery' | 'faqs' | 'tags' | 'seo' | 'relatedListingIds' | 'author' | 'publishedAt'
    >
  >;

export const DEFAULT_AUTHOR = {
  name: 'Lokaly Editorial',
  role: 'Local editorial team',
} as const;

export function defineArticle(townSlug: string, seed: ArticleSeed): Article {
  const slug = seed.slug ?? slugify(seed.title);
  return {
    id: `${townSlug}-${seed.kind}-${slug}`,
    townSlug,
    slug,
    gallery: [],
    faqs: [],
    tags: [],
    seo: {},
    relatedListingIds: [],
    author: { ...DEFAULT_AUTHOR },
    readingMinutes: readingMinutes(seed.body),
    status: 'published',
    publishedAt: now,
    updatedAt: now,
    ...seed,
  };
}

type EventSeed = Omit<
  TownEvent,
  'id' | 'townSlug' | 'slug' | 'status' | 'updatedAt' | 'gallery' | 'tags' | 'seo' | 'tier' | 'contact' | 'allDay'
> &
  Partial<Pick<TownEvent, 'slug' | 'gallery' | 'tags' | 'seo' | 'tier' | 'contact' | 'allDay'>>;

export function defineEvent(townSlug: string, seed: EventSeed): TownEvent {
  const slug = seed.slug ?? slugify(seed.title);
  return {
    id: `${townSlug}-event-${slug}`,
    townSlug,
    slug,
    gallery: [],
    tags: [],
    seo: {},
    tier: 'free',
    contact: {},
    allDay: false,
    status: 'published',
    updatedAt: now,
    ...seed,
  };
}

/**
 * Build a date relative to "now", so seeded events never go stale in the demo.
 * Times are expressed in the town's local offset (+08:00 for Malaysia).
 */
export function inDays(days: number, time = '10:00'): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return new Date(`${yyyy}-${mm}-${dd}T${time}:00+08:00`).toISOString();
}

/** Weekday-to-weekday opening hours, the common case. */
export function hours(
  spec: Partial<Record<'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun', [string, string] | null>>,
) {
  const out: Record<string, Array<{ opens: string; closes: string }> | null> = {};
  for (const [day, value] of Object.entries(spec)) {
    out[day] = value === null ? null : [{ opens: value![0], closes: value![1] }];
  }
  return out;
}

/** Same hours every day. */
export function dailyHours(opens: string, closes: string) {
  return hours({
    mon: [opens, closes],
    tue: [opens, closes],
    wed: [opens, closes],
    thu: [opens, closes],
    fri: [opens, closes],
    sat: [opens, closes],
    sun: [opens, closes],
  });
}
