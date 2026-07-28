/**
 * Content domain types.
 *
 * These mirror the Postgres schema in `supabase/migrations/0001_init.sql`
 * one-to-one (snake_case columns are mapped to camelCase at the repository
 * boundary), so a change here should always be paired with a migration.
 */

import type { GeoPoint } from './town';

/** Every directory listing belongs to exactly one directory type. */
export type DirectorySlug =
  | 'attractions'
  | 'food'
  | 'cafes'
  | 'hotels'
  | 'homestays'
  | 'shopping'
  | 'businesses';

/** Commercial tier. Drives sort order, badges and layout emphasis. */
export type ListingTier = 'free' | 'featured' | 'premium' | 'sponsored';

export type PriceRange = 1 | 2 | 3 | 4;

export type PublishStatus = 'draft' | 'scheduled' | 'published' | 'archived';

export interface MediaAsset {
  /** R2 object key or absolute URL. */
  src: string;
  alt: string;
  width?: number;
  height?: number;
  credit?: string;
  /** Base64 blur placeholder for LQIP. */
  blurDataUrl?: string;
}

/** `null` closed. Times are 24h `HH:mm` in the town's timezone. */
export interface OpeningHoursDay {
  opens: string;
  closes: string;
}

export type Weekday = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export type OpeningHours = Partial<Record<Weekday, OpeningHoursDay[] | null>>;

export interface ContactChannels {
  phone?: string;
  /** E.164 digits only, for wa.me deep links. */
  whatsapp?: string;
  email?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  /** Pre-built Google Maps place link; falls back to a coordinate query. */
  googleMapsUrl?: string;
  /** Affiliate or direct booking URL — renders the "Book Now" CTA. */
  bookingUrl?: string;
}

export interface SeoFields {
  metaTitle?: string;
  metaDescription?: string;
  /** Overrides the derived canonical path. Rarely needed. */
  canonicalPath?: string;
  ogImage?: MediaAsset;
  noindex?: boolean;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Category {
  id: string;
  townSlug: string;
  directory: DirectorySlug;
  slug: string;
  name: string;
  /** Short blurb used on category landing pages for unique, indexable copy. */
  description?: string;
  icon?: string;
  sortOrder: number;
}

export interface Tag {
  id: string;
  slug: string;
  name: string;
}

/** Aggregate rating sourced from our own reviews (roadmap) or a manual entry. */
export interface Rating {
  value: number;
  count: number;
  /** Where the number came from — required for honest schema.org markup. */
  source: 'editorial' | 'google' | 'community';
}

export interface Listing {
  id: string;
  townSlug: string;
  directory: DirectorySlug;
  categorySlugs: string[];
  slug: string;
  title: string;
  /** One-line summary used on cards and meta descriptions. */
  summary: string;
  /** Long-form body in Markdown. */
  body: string;
  featuredImage: MediaAsset;
  gallery: MediaAsset[];
  address: string;
  /** Sub-area within the district, matched against `TownEditorial.areas`. */
  area?: string;
  postcode?: string;
  coordinates?: GeoPoint;
  openingHours?: OpeningHours;
  contact: ContactChannels;
  priceRange?: PriceRange;
  /** Free-text price hint, e.g. "RM8–15 per person". */
  priceNote?: string;
  rating?: Rating;
  facilities: string[];
  tags: string[];
  faqs: FaqItem[];
  tier: ListingTier;
  /** Surfaces the listing in the "Hidden Gems" rail and guide. */
  hiddenGem: boolean;
  /** Manual ordering nudge within the same tier. Higher wins. */
  weight: number;
  status: PublishStatus;
  /**
   * False until a human has confirmed address, hours and contact details.
   * Seeded sample data ships as `false` and renders an "unverified" notice.
   */
  verified: boolean;
  seo: SeoFields;
  publishedAt: string;
  updatedAt: string;
}

export type ArticleKind = 'blog' | 'guide' | 'itinerary' | 'sponsored';

export interface Article {
  id: string;
  townSlug: string;
  kind: ArticleKind;
  slug: string;
  title: string;
  summary: string;
  body: string;
  featuredImage: MediaAsset;
  gallery: MediaAsset[];
  author: {
    name: string;
    role?: string;
    avatar?: MediaAsset;
  };
  /** Present on sponsored articles; renders the mandatory disclosure banner. */
  sponsor?: {
    name: string;
    url?: string;
    logo?: MediaAsset;
  };
  tags: string[];
  faqs: FaqItem[];
  /** Listing ids featured in the piece; powers two-way internal linking. */
  relatedListingIds: string[];
  readingMinutes: number;
  status: PublishStatus;
  seo: SeoFields;
  publishedAt: string;
  updatedAt: string;
}

export interface TownEvent {
  id: string;
  townSlug: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  featuredImage: MediaAsset;
  gallery: MediaAsset[];
  startsAt: string;
  endsAt?: string;
  /** True for all-day / multi-day events — suppresses time rendering. */
  allDay: boolean;
  /** Free-text recurrence note, e.g. "Every Saturday night". */
  recurrence?: string;
  venueName: string;
  address: string;
  coordinates?: GeoPoint;
  /** Optional link to a listing that hosts the event. */
  venueListingId?: string;
  organiser?: string;
  contact: ContactChannels;
  ticketUrl?: string;
  priceNote?: string;
  tags: string[];
  tier: ListingTier;
  status: PublishStatus;
  seo: SeoFields;
  updatedAt: string;
}

/** Anything that can appear in a card grid or on the map. */
export type ContentItem = Listing | TownEvent;
