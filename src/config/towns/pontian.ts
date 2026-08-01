import type { TownConfig } from '@/types/town';

export const pontian: TownConfig = {
  slug: 'pontian',
  name: 'Pontian',
  fullName: 'Pontian, Johor',
  state: 'Johor',
  country: 'Malaysia',
  countryCode: 'MY',
  domain: 'pontian.lokaly.my',
  aliases: ['pontian.localhost:3000'],
  timezone: 'Asia/Kuala_Lumpur',
  locale: 'en-MY',

  coordinates: { lat: 1.4868, lng: 103.3932 },
  bounds: {
    southWest: { lat: 1.25, lng: 103.15 },
    northEast: { lat: 1.75, lng: 103.65 },
  },
  mapZoom: 12,

  hero: {
    src: '/images/placeholders/hero-beach.svg',
    alt: 'Pontian coastal landscape',
  },

  logo: { mark: '🏖️' },

  seo: {
    titleTemplate: '%s | Pontian Guide',
    defaultTitle: 'Pontian Travel & Local Guide — Beaches & Local Culture',
    description:
      'The independent guide to Pontian, Johor. Discover beaches, local food and authentic experiences.',
    keywords: ['Pontian', 'Johor', 'things to do in Pontian', 'Pontian beaches'],
    ogImage: {
      src: '/images/placeholders/og-default.svg',
      alt: 'Pontian Guide',
    },
    twitterHandle: '@lokalymy',
  },

  theme: {
    primary: 'oklch(0.55 0.130 180)',
    primaryForeground: 'oklch(0.99 0.005 180)',
    accent: 'oklch(0.70 0.150 30)',
    accentForeground: 'oklch(0.15 0.01 30)',
    dark: {
      primary: 'oklch(0.75 0.140 180)',
      primaryForeground: 'oklch(0.15 0.02 180)',
      accent: 'oklch(0.78 0.140 30)',
    },
    browserTheme: '#008ba3',
  },

  contact: {
    email: 'hello@pontian.lokaly.my',
    addressLines: ['Pontian, Johor', 'Malaysia'],
  },

  social: {
    facebook: 'https://facebook.com/pontianlokaly',
    instagram: 'https://instagram.com/pontianlokaly',
  },

  analytics: {
    gaMeasurementId: process.env.NEXT_PUBLIC_GA_ID,
  },

  monetisation: {
    salesEmail: 'advertise@pontian.lokaly.my',
    currency: 'MYR',
    packages: {
      featured: 49,
      premium: 149,
      sponsoredArticle: 399,
    },
  },

  editorial: {
    tagline: 'Johor\'s coastal gem — beaches, seafood and island culture.',
    intro:
      'Pontian is a charming coastal town known for its sandy beaches, fresh seafood and laid-back lifestyle. A perfect escape from the city.',
    areas: ['Pontian Town', 'Coastal areas'],
    knownFor: [
      'Beautiful beaches',
      'Fresh seafood restaurants',
      'Island proximity',
      'Relaxed pace of life',
      'Local fishing communities',
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
