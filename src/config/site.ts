/**
 * Network-level configuration — everything that is true for *every* town.
 *
 * Anything town-specific belongs in `src/config/towns/*`, not here.
 */

import type { NavGroupId } from './directories';

export const NETWORK = {
  name: 'Lokaly',
  legalName: 'Lokaly Media',
  tagline: 'Local guides for Malaysian towns.',
  rootDomain: 'lokaly.my',
  /** Shown in the footer and Organization JSON-LD. */
  url: 'https://lokaly.my',
} as const;

/** Navigation groups. Directory types attach themselves via `navGroup`. */
export const NAV_GROUPS: Record<NavGroupId, { id: NavGroupId; label: string; order: number }> = {
  discover: { id: 'discover', label: 'Discover', order: 1 },
  eat: { id: 'eat', label: 'Eat & Drink', order: 2 },
  stay: { id: 'stay', label: 'Stay', order: 3 },
  do: { id: 'do', label: 'See & Do', order: 4 },
  read: { id: 'read', label: 'Guides', order: 5 },
  business: { id: 'business', label: 'Directory', order: 6 },
};

/** Editorial routes that are not directory-driven. */
export const STATIC_ROUTES = {
  home: '/',
  discover: '/discover',
  thingsToDo: '/things-to-do',
  events: '/events',
  guides: '/guides',
  weekendItinerary: '/guides/weekend-itinerary',
  hiddenGems: '/hidden-gems',
  blog: '/blog',
  map: '/map',
  search: '/search',
  advertise: '/advertise',
  about: '/about',
  contact: '/contact',
  privacy: '/privacy',
  terms: '/terms',
} as const;

export const PAGE_SIZE = {
  directory: 24,
  articles: 12,
  events: 12,
  search: 20,
} as const;

/**
 * ISR windows, in seconds, tuned per content volatility.
 *
 * Reference table only. Next statically analyses `export const revalidate` and
 * rejects anything that is not a numeric literal, so each route repeats the
 * value inline with a comment pointing back here. When you change a number
 * here, grep for the old literal under `src/app`.
 */
export const REVALIDATE = {
  /** Homepage mixes events and latest articles — refresh hourly. */
  home: 60 * 60,
  directoryIndex: 60 * 60 * 6,
  listingDetail: 60 * 60 * 12,
  article: 60 * 60 * 12,
  /** Events go stale fast around their start date. */
  events: 60 * 30,
  static: 60 * 60 * 24,
} as const;

/**
 * Advertising packages. Prices come from the town config so a Klang Valley
 * town can charge differently from a small district — the copy is shared.
 */
export const AD_PACKAGES = [
  {
    id: 'featured',
    name: 'Featured Listing',
    tagline: 'Get seen first in your category.',
    highlights: [
      'Pinned above free listings in your category',
      '"Featured" badge on every card',
      'Photo gallery (up to 8 images)',
      'Click-to-WhatsApp and call buttons',
      'Monthly performance summary',
    ],
    billing: 'per month',
    popular: false,
  },
  {
    id: 'premium',
    name: 'Premium Listing',
    tagline: 'Own your category, and the map.',
    highlights: [
      'Everything in Featured',
      'Top placement on the homepage rail for your category',
      'Highlighted map pin',
      'Unlimited gallery images and a 600-word write-up',
      'Do-follow link to your website',
      'Featured in one relevant travel guide',
      'Quarterly content refresh by our editor',
    ],
    billing: 'per month',
    popular: true,
  },
  {
    id: 'sponsoredArticle',
    name: 'Sponsored Article',
    tagline: 'A proper story, written by us.',
    highlights: [
      'Original 800–1,200 word article by our editorial team',
      'Professional photo shoot on request',
      'Permanent URL — keeps earning traffic for years',
      'Shared to our social channels and newsletter',
      'Internal links from related guides',
      'Clearly disclosed as sponsored, as required',
    ],
    billing: 'one-off',
    popular: false,
  },
] as const;

export type AdPackageId = (typeof AD_PACKAGES)[number]['id'];
