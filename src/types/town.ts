/**
 * Town configuration contract.
 *
 * A town is the single unit of multi-tenancy in this platform. Everything the
 * UI renders — copy, colours, coordinates, SEO defaults, monetisation, enabled
 * features — is derived from one `TownConfig` object. Adding a new town to the
 * network should never require touching a component.
 *
 * @see docs/ADD-NEW-TOWN.md
 */

/** Feature flags let a town launch with a subset of the platform. */
export type FeatureFlag =
  | 'map'
  | 'events'
  | 'blog'
  | 'guides'
  | 'homestays'
  | 'newsletter'
  | 'advertise'
  | 'reviews' // roadmap
  | 'businessClaim' // roadmap
  | 'membership' // roadmap
  | 'marketplace' // roadmap
  | 'coupons' // roadmap
  | 'eventTickets' // roadmap
  | 'aiTripPlanner' // roadmap
  | 'aiAssistant'; // roadmap

/**
 * Theme tokens. Values are raw CSS colour values (OKLCH preferred) and are
 * injected as CSS custom properties on `<html>`, so a town re-skins the entire
 * UI without a Tailwind rebuild.
 */
export interface TownTheme {
  /** Brand colour used for primary actions and accents. */
  primary: string;
  /** Readable foreground on top of `primary`. */
  primaryForeground: string;
  /** Secondary brand colour, used for highlights and category chips. */
  accent: string;
  accentForeground: string;
  /** Optional dark-mode overrides; falls back to the light values. */
  dark?: Partial<Pick<TownTheme, 'primary' | 'primaryForeground' | 'accent' | 'accentForeground'>>;
  /** Browser theme-color / PWA colour. */
  browserTheme: string;
}

export interface GeoPoint {
  lat: number;
  lng: number;
}

/** Map viewport bounds, used to constrain the interactive map to the district. */
export interface GeoBounds {
  southWest: GeoPoint;
  northEast: GeoPoint;
}

export interface TownImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  /** Optional photographer / source credit rendered in the hero corner. */
  credit?: string;
}

export interface TownSeo {
  /** `%s` is replaced with the page title. */
  titleTemplate: string;
  defaultTitle: string;
  description: string;
  keywords: string[];
  /** Fallback social share image. */
  ogImage: TownImage;
  twitterHandle?: string;
  /** Verification token for Google Search Console. */
  googleSiteVerification?: string;
}

export interface TownContact {
  email: string;
  /** E.164 without `+`, e.g. `60123456789`. Used to build wa.me links. */
  whatsapp?: string;
  phone?: string;
  addressLines?: string[];
}

export interface TownSocial {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  x?: string;
}

export interface TownAnalytics {
  /** GA4 measurement id, e.g. `G-XXXXXXX`. Omit to disable analytics. */
  gaMeasurementId?: string;
}

export interface TownMonetisation {
  /** Shown on the Advertise page and used for lead routing. */
  salesEmail: string;
  salesWhatsapp?: string;
  currency: 'MYR';
  /** Monthly prices in the town's currency, by package tier. */
  packages: {
    featured: number;
    premium: number;
    sponsoredArticle: number;
  };
  affiliate?: {
    /** Travelpayouts / Booking.com style partner marker. */
    travelpayoutsMarker?: string;
    bookingAid?: string;
  };
}

/** Editorial copy that differs per town but appears in shared components. */
export interface TownEditorial {
  /** One-line positioning statement, used under the hero headline. */
  tagline: string;
  /** 2–3 sentence introduction for the homepage and /discover. */
  intro: string;
  /** Sub-areas within the district — powers the location filter. */
  areas: string[];
  /** Fun facts surfaced on /discover and in AI-generated summaries later. */
  knownFor: string[];
  /** Languages commonly spoken, used for the About page and hreflang planning. */
  languages: string[];
}

export interface TownConfig {
  /** URL-safe identifier and the sub-domain label. */
  slug: string;
  /** Short display name, e.g. "Kluang". */
  name: string;
  /** Full legal/administrative name, e.g. "Kluang, Johor". */
  fullName: string;
  state: string;
  country: string;
  countryCode: string;
  /** Canonical hostname for this town. */
  domain: string;
  /** Extra hostnames that should resolve to this town (legacy domains, previews). */
  aliases?: string[];
  timezone: string;
  locale: string;
  coordinates: GeoPoint;
  bounds: GeoBounds;
  /** Default zoom for the interactive map. */
  mapZoom: number;
  hero: TownImage;
  logo: {
    /** Emoji or short mark rendered when no image logo is configured. */
    mark: string;
    src?: string;
  };
  seo: TownSeo;
  theme: TownTheme;
  contact: TownContact;
  social: TownSocial;
  analytics: TownAnalytics;
  monetisation: TownMonetisation;
  editorial: TownEditorial;
  features: Record<FeatureFlag, boolean>;
  status: 'live' | 'beta' | 'planned';
  /** ISO date the town went live; used in About and Organization JSON-LD. */
  launchedAt: string;
}
