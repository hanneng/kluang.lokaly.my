import type { TownConfig } from '@/types/town';

export const segamat: TownConfig = {
  slug: 'segamat',
  name: 'Segamat',
  fullName: 'Segamat, Johor',
  state: 'Johor',
  country: 'Malaysia',
  countryCode: 'MY',
  domain: 'segamat.lokaly.my',
  aliases: ['segamat.localhost:3000'],
  timezone: 'Asia/Kuala_Lumpur',
  locale: 'en-MY',

  coordinates: { lat: 2.5136, lng: 102.8034 },
  bounds: {
    southWest: { lat: 2.25, lng: 102.50 },
    northEast: { lat: 2.75, lng: 103.10 },
  },
  mapZoom: 12,

  hero: {
    src: '/images/placeholders/hero-forest.svg',
    alt: 'Segamat lush greenery',
  },

  logo: { mark: '🌲' },

  seo: {
    titleTemplate: '%s | Segamat Guide',
    defaultTitle: 'Segamat Travel & Local Guide — Nature & Local Community',
    description:
      'The independent guide to Segamat, Johor. Discover nature, local culture and authentic experiences.',
    keywords: ['Segamat', 'Johor', 'things to do in Segamat', 'Segamat nature'],
    ogImage: {
      src: '/images/placeholders/og-default.svg',
      alt: 'Segamat Guide',
    },
    twitterHandle: '@lokalymy',
  },

  theme: {
    primary: 'oklch(0.48 0.110 140)',
    primaryForeground: 'oklch(0.99 0.005 140)',
    accent: 'oklch(0.68 0.155 50)',
    accentForeground: 'oklch(0.15 0.01 50)',
    dark: {
      primary: 'oklch(0.72 0.125 140)',
      primaryForeground: 'oklch(0.15 0.02 140)',
      accent: 'oklch(0.76 0.150 50)',
    },
    browserTheme: '#3a9b5c',
  },

  contact: {
    email: 'hello@segamat.lokaly.my',
    addressLines: ['Segamat, Johor', 'Malaysia'],
  },

  social: {
    facebook: 'https://facebook.com/segamatlokaly',
    instagram: 'https://instagram.com/segamatlokaly',
  },

  analytics: {
    gaMeasurementId: process.env.NEXT_PUBLIC_GA_ID,
  },

  monetisation: {
    salesEmail: 'advertise@segamat.lokaly.my',
    currency: 'MYR',
    packages: {
      featured: 49,
      premium: 149,
      sponsoredArticle: 399,
    },
  },

  editorial: {
    tagline: 'Johor\'s green heartland — nature, agriculture and rural charm.',
    intro:
      'Segamat is a quiet agricultural town surrounded by farms and natural beauty. Experience authentic rural Malaysian life and local hospitality.',
    areas: ['Segamat Town', 'Rural areas'],
    knownFor: [
      'Agricultural heritage',
      'Natural landscapes',
      'Local farming communities',
      'Traditional Malaysian food',
      'Peaceful countryside',
    ],
    languages: ['Malay', 'English', 'Mandarin'],
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
