import type { TownConfig } from '@/types/town';

/**
 * Batu Pahat, Johor.
 *
 * The original site runs on WordPress at batupahat.lokaly.my. This config is
 * the migration target — once content is ported, pointing the hostname at this
 * deployment is the only remaining step.
 */
export const batuPahat: TownConfig = {
  slug: 'batu-pahat',
  name: 'Batu Pahat',
  fullName: 'Batu Pahat, Johor',
  state: 'Johor',
  country: 'Malaysia',
  countryCode: 'MY',
  domain: 'batupahat.lokaly.my',
  aliases: ['batupahat.xyz', 'www.batupahat.xyz', 'batu-pahat.localhost:3000'],
  timezone: 'Asia/Kuala_Lumpur',
  locale: 'en-MY',

  coordinates: { lat: 1.8548, lng: 102.9325 },
  bounds: {
    southWest: { lat: 1.62, lng: 102.65 },
    northEast: { lat: 2.12, lng: 103.25 },
  },
  mapZoom: 12,

  hero: {
    src: '/images/placeholders/hero-coast.svg',
    alt: 'The Batu Pahat river mouth at golden hour',
  },

  logo: { mark: '⚓' },

  seo: {
    titleTemplate: '%s | Batu Pahat Guide',
    defaultTitle: 'Batu Pahat Travel & Local Guide — Food, Beaches & Hotels',
    description:
      'The independent guide to Batu Pahat, Johor. Where to eat, what to see, where to stay and what is on this weekend.',
    keywords: [
      'Batu Pahat',
      'Batu Pahat Johor',
      'things to do in Batu Pahat',
      'Batu Pahat food',
      'Batu Pahat hotels',
      'Minyak Beku',
    ],
    ogImage: {
      src: '/images/placeholders/og-default.svg',
      alt: 'Batu Pahat Guide',
    },
    twitterHandle: '@lokalymy',
  },

  theme: {
    // River-mouth blue.
    primary: 'oklch(0.50 0.105 232)',
    primaryForeground: 'oklch(0.99 0.005 232)',
    accent: 'oklch(0.72 0.155 45)',
    accentForeground: 'oklch(0.22 0.03 45)',
    dark: {
      primary: 'oklch(0.74 0.115 232)',
      primaryForeground: 'oklch(0.18 0.03 232)',
      accent: 'oklch(0.79 0.145 50)',
    },
    browserTheme: '#1d5578',
  },

  contact: {
    email: 'hello@batupahat.lokaly.my',
    whatsapp: '60123456789',
    addressLines: ['Batu Pahat, Johor', 'Malaysia'],
  },

  social: {
    facebook: 'https://facebook.com/batupahatlokaly',
    instagram: 'https://instagram.com/batupahatlokaly',
  },

  analytics: {
    gaMeasurementId: process.env.NEXT_PUBLIC_GA_ID,
  },

  monetisation: {
    salesEmail: 'advertise@batupahat.lokaly.my',
    salesWhatsapp: '60123456789',
    currency: 'MYR',
    packages: {
      featured: 49,
      premium: 149,
      sponsoredArticle: 399,
    },
  },

  editorial: {
    tagline: 'River town, coastal sunsets and some of Johor’s best eating.',
    intro:
      'Batu Pahat grew up around a river mouth on the Strait of Malacca, and it still feels like a port town — busy kopitiams, a working waterfront and beaches a short drive from the centre.',
    areas: [
      'Bandar Batu Pahat',
      'Minyak Beku',
      'Sri Gading',
      'Senggarang',
      'Rengit',
      'Yong Peng',
      'Parit Raja',
      'Ayer Hitam',
    ],
    knownFor: [
      'Minyak Beku beach and the Tanjung Labuh coastline',
      'Dataran Penggaram',
      'A dense, long-running kopitiam culture',
      'Textile and garment retail',
    ],
    languages: ['Malay', 'English', 'Mandarin', 'Hokkien', 'Tamil'],
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
  launchedAt: '2024-01-01',
};
