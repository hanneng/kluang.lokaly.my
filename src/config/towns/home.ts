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
    primary: 'oklch(0.52 0.113 255)',
    primaryForeground: 'oklch(0.99 0.005 255)',
    accent: 'oklch(0.68 0.176 32)',
    accentForeground: 'oklch(0.2 0.02 32)',
    dark: {
      primary: 'oklch(0.75 0.135 255)',
      primaryForeground: 'oklch(0.18 0.03 255)',
      accent: 'oklch(0.75 0.165 32)',
    },
    browserTheme: '#5b4fb6',
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
