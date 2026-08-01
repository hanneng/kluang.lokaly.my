import type { TownConfig } from '@/types/town';

export const taiping: TownConfig = {
  slug: 'taiping',
  name: 'Taiping',
  fullName: 'Taiping, Perak',
  state: 'Perak',
  country: 'Malaysia',
  countryCode: 'MY',
  domain: 'taiping.lokaly.my',
  aliases: ['taiping.localhost:3000'],
  timezone: 'Asia/Kuala_Lumpur',
  locale: 'en-MY',

  coordinates: { lat: 4.8551, lng: 100.7488 },
  bounds: {
    southWest: { lat: 4.60, lng: 100.50 },
    northEast: { lat: 5.10, lng: 100.95 },
  },
  mapZoom: 12,

  hero: {
    src: '/images/placeholders/hero-lake.svg',
    alt: 'Taiping Lake',
  },

  logo: { mark: '🌺' },

  seo: {
    titleTemplate: '%s | Taiping Guide',
    defaultTitle: 'Taiping Travel & Local Guide — Heritage, Lake & Culture',
    description:
      'The independent guide to Taiping, Perak. Discover a charming heritage town with beautiful lakes and rich history.',
    keywords: ['Taiping', 'Perak', 'things to do in Taiping', 'Taiping lake', 'Taiping heritage'],
    ogImage: {
      src: '/images/placeholders/og-default.svg',
      alt: 'Taiping Guide',
    },
    twitterHandle: '@lokalymy',
  },

  theme: {
    primary: 'oklch(0.54 0.125 280)',
    primaryForeground: 'oklch(0.99 0.005 280)',
    accent: 'oklch(0.70 0.160 15)',
    accentForeground: 'oklch(0.15 0.01 15)',
    dark: {
      primary: 'oklch(0.75 0.140 280)',
      primaryForeground: 'oklch(0.15 0.02 280)',
      accent: 'oklch(0.78 0.155 15)',
    },
    browserTheme: '#9b59b6',
  },

  contact: {
    email: 'hello@taiping.lokaly.my',
    addressLines: ['Taiping, Perak', 'Malaysia'],
  },

  social: {
    facebook: 'https://facebook.com/taipinglokaly',
    instagram: 'https://instagram.com/taipinglokaly',
  },

  analytics: {
    gaMeasurementId: process.env.NEXT_PUBLIC_GA_ID,
  },

  monetisation: {
    salesEmail: 'advertise@taiping.lokaly.my',
    currency: 'MYR',
    packages: {
      featured: 49,
      premium: 149,
      sponsoredArticle: 399,
    },
  },

  editorial: {
    tagline: 'Perak\'s jewel — heritage architecture, serene lakes and history.',
    intro:
      'Taiping is one of Malaysia\'s oldest towns with stunning heritage architecture and the famous Taiping Lake. A perfect blend of history, nature and local culture.',
    areas: ['Taiping Town Centre', 'Lake Gardens'],
    knownFor: [
      'Taiping Lake Gardens (oldest lake garden in Malaysia)',
      'Colonial architecture and heritage buildings',
      'Perak Museum (oldest museum in Malaysia)',
      'Local food and kopitiam culture',
      'Rich historical significance',
    ],
    languages: ['Malay', 'English', 'Mandarin', 'Hokkien'],
  },

  features: {
    map: true,
    events: true,
    blog: true,
    guides: true,
    homestays: true,
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

  status: 'planned',
  launchedAt: '2026-08-01',
};
