import type { TownConfig } from '@/types/town';

export const muar: TownConfig = {
  slug: 'muar',
  name: 'Muar',
  fullName: 'Muar, Johor',
  state: 'Johor',
  country: 'Malaysia',
  countryCode: 'MY',
  domain: 'muar.lokaly.my',
  aliases: ['muar.localhost:3000'],
  timezone: 'Asia/Kuala_Lumpur',
  locale: 'en-MY',

  coordinates: { lat: 1.8902, lng: 102.5674 },
  bounds: {
    southWest: { lat: 1.65, lng: 102.25 },
    northEast: { lat: 2.12, lng: 102.85 },
  },
  mapZoom: 12,

  hero: {
    src: '/images/placeholders/hero-river.svg',
    alt: 'The Muar River',
  },

  logo: { mark: '🌊' },

  seo: {
    titleTemplate: '%s | Muar Guide',
    defaultTitle: 'Muar Travel & Local Guide — Food, Heritage & River',
    description:
      'The independent guide to Muar, Johor. Discover food, heritage, attractions and local experiences.',
    keywords: ['Muar', 'Johor', 'things to do in Muar', 'Muar food', 'Muar hotels'],
    ogImage: {
      src: '/images/placeholders/og-default.svg',
      alt: 'Muar Guide',
    },
    twitterHandle: '@lokalymy',
  },

  theme: {
    primary: 'oklch(0.50 0.120 200)',
    primaryForeground: 'oklch(0.99 0.005 200)',
    accent: 'oklch(0.65 0.140 40)',
    accentForeground: 'oklch(0.15 0.01 40)',
    dark: {
      primary: 'oklch(0.75 0.135 200)',
      primaryForeground: 'oklch(0.15 0.02 200)',
      accent: 'oklch(0.75 0.135 40)',
    },
    browserTheme: '#1a7bb8',
  },

  contact: {
    email: 'hello@muar.lokaly.my',
    addressLines: ['Muar, Johor', 'Malaysia'],
  },

  social: {
    facebook: 'https://facebook.com/muarlokaly',
    instagram: 'https://instagram.com/muarlokaly',
  },

  analytics: {
    gaMeasurementId: process.env.NEXT_PUBLIC_GA_ID,
  },

  monetisation: {
    salesEmail: 'advertise@muar.lokaly.my',
    currency: 'MYR',
    packages: {
      featured: 49,
      premium: 149,
      sponsoredArticle: 399,
    },
  },

  editorial: {
    tagline: 'Johor\'s river town — heritage, food and waterfront charm.',
    intro:
      'Muar is a historic port town on the Johor River. Known for its culinary heritage, colonial architecture and riverside atmosphere.',
    areas: ['Muar Town Centre', 'Bandar Maharani'],
    knownFor: [
      'Laksa Muar (local noodle dish)',
      'Colonial heritage buildings',
      'River cruises and waterfront',
      'Traditional markets',
      'Friendly local culture',
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
