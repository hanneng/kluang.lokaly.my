import type { TownConfig } from '@/types/town';

/**
 * The Lokaly network homepage — the central portal for discovering all towns.
 * This is a special "town" config that routes through the normal multi-tenancy
 * system but renders a network-wide view instead of town-specific content.
 */
export const home: TownConfig = {
  slug: 'home',
  name: 'Lokaly',
  fullName: 'Lokaly Malaysia',
  state: 'Malaysia',
  country: 'Malaysia',
  countryCode: 'MY',
  domain: 'www.lokaly.my',
  aliases: ['lokaly.my', 'www.localhost:3000'],
  timezone: 'Asia/Kuala_Lumpur',
  locale: 'en-MY',

  coordinates: { lat: 4.21, lng: 101.686 },
  bounds: {
    southWest: { lat: 1.0, lng: 100.0 },
    northEast: { lat: 6.7, lng: 104.3 },
  },
  mapZoom: 6,

  hero: {
    src: '/images/placeholders/hero-map.svg',
    alt: 'Map of Malaysia with featured towns highlighted',
  },

  logo: {
    mark: '🌏',
  },

  seo: {
    titleTemplate: '%s | Lokaly.my',
    defaultTitle: 'Lokaly.my | Discover Malaysia One Town At A Time',
    description:
      'Discover the best attractions, food, hotels, businesses and hidden gems across Malaysia. Explore Batu Pahat, Kluang and many more towns on Lokaly.my.',
    keywords: [
      'Malaysia travel',
      'local guide Malaysia',
      'discover Malaysia',
      'Malaysian towns',
      'travel guide',
      'food guide',
      'attractions Malaysia',
      'Kluang',
      'Batu Pahat',
    ],
    ogImage: {
      src: '/images/placeholders/og-network.svg',
      alt: 'Lokaly.my — Discover Malaysia one town at a time',
    },
    twitterHandle: '@lokalymy',
  },

  theme: {
    // Rich, vibrant blue with bright teal accents for strong hero contrast
    primary: 'oklch(0.45 0.160 245)',         // Deep saturated blue for hero
    primaryForeground: 'oklch(0.99 0.005 245)',
    accent: 'oklch(0.60 0.180 195)',         // Bright cyan for buttons
    accentForeground: 'oklch(0.15 0.01 195)',
    dark: {
      primary: 'oklch(0.70 0.170 245)',      // Vibrant blue in dark mode
      primaryForeground: 'oklch(0.15 0.02 245)',
      accent: 'oklch(0.72 0.175 190)',       // Bright teal in dark mode
    },
    browserTheme: '#1a5f99',
  },

  contact: {
    email: 'hello@lokaly.my',
    addressLines: ['Malaysia'],
  },

  social: {
    facebook: 'https://facebook.com/lokalymy',
    instagram: 'https://instagram.com/lokalymy',
    x: 'https://x.com/lokalymy',
  },

  analytics: {
    gaMeasurementId: process.env.NEXT_PUBLIC_GA_ID,
  },

  monetisation: {
    salesEmail: 'advertise@lokaly.my',
    currency: 'MYR',
    packages: {
      featured: 299,
      premium: 599,
      sponsoredArticle: 1299,
    },
  },

  editorial: {
    tagline: "Malaysia's local discovery platform.",
    intro:
      'Lokaly is a network of hyperlocal community websites across Malaysia. Each town has its own dedicated guide, written and maintained by passionate locals who know their home. Discover the best food, attractions, hotels, and hidden gems in every town.',
    areas: [],
    knownFor: [
      'Hyperlocal guides for Malaysian towns',
      'Community-written content by locals',
      'Hidden gems and authentic experiences',
      'Support local businesses and tourism',
      'Travel guides for Malaysia',
    ],
    languages: ['English', 'Malay'],
  },

  features: {
    map: false,
    events: false,
    blog: false,
    guides: false,
    homestays: false,
    newsletter: true,
    advertise: true,
    reviews: false,
    businessClaim: false,
    membership: false,
    marketplace: false,
    coupons: false,
    eventTickets: false,
    aiTripPlanner: false,
    aiAssistant: false,
  },

  status: 'live',
  launchedAt: '2026-08-01',
};
