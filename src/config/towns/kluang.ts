import type { TownConfig } from '@/types/town';

/**
 * Kluang, Johor — the second town on the network and the reference
 * implementation for everything built after Batu Pahat.
 */
export const kluang: TownConfig = {
  slug: 'kluang',
  name: 'Kluang',
  fullName: 'Kluang, Johor',
  state: 'Johor',
  country: 'Malaysia',
  countryCode: 'MY',
  domain: 'kluang.lokaly.my',
  aliases: ['kluang.localhost:3000'],
  timezone: 'Asia/Kuala_Lumpur',
  locale: 'en-MY',

  // Kluang town centre, near the railway station.
  coordinates: { lat: 2.0303, lng: 103.3185 },
  bounds: {
    southWest: { lat: 1.72, lng: 102.95 },
    northEast: { lat: 2.42, lng: 103.78 },
  },
  mapZoom: 12,

  hero: {
    src: '/images/placeholders/hero-hills.svg',
    alt: 'Morning mist over the hills surrounding Kluang, Johor',
    credit: 'Replace with a licensed photograph before launch',
  },

  logo: {
    // Kluang takes its name from "keluang", the flying fox.
    mark: '🦇',
  },

  seo: {
    titleTemplate: '%s | Kluang Guide',
    defaultTitle: 'Kluang Travel & Local Guide — Things to Do, Food & Hotels',
    description:
      'The independent guide to Kluang, Johor. Where to eat, what to see, where to stay and what is on this weekend — written and maintained locally.',
    keywords: [
      'Kluang',
      'Kluang Johor',
      'things to do in Kluang',
      'Kluang food',
      'Kluang hotels',
      'Gunung Lambak',
      'Kluang attractions',
      'Kluang homestay',
    ],
    ogImage: {
      src: '/images/placeholders/og-default.svg',
      alt: 'Kluang Guide — the local guide to Kluang, Johor',
    },
    twitterHandle: '@lokalymy',
  },

  theme: {
    // Rainforest green — the district is ringed by forest reserve.
    primary: 'oklch(0.47 0.098 158)',
    primaryForeground: 'oklch(0.99 0.005 158)',
    // Warm amber, picked up from kopitiam signage and laterite soil.
    accent: 'oklch(0.73 0.152 62)',
    accentForeground: 'oklch(0.22 0.03 62)',
    dark: {
      primary: 'oklch(0.72 0.115 158)',
      primaryForeground: 'oklch(0.18 0.03 158)',
      accent: 'oklch(0.79 0.145 68)',
    },
    browserTheme: '#1f5c43',
  },

  contact: {
    email: 'hello@kluang.lokaly.my',
    whatsapp: '60123456789',
    addressLines: ['Kluang, Johor', 'Malaysia'],
  },

  social: {
    facebook: 'https://facebook.com/kluanglokaly',
    instagram: 'https://instagram.com/kluanglokaly',
  },

  analytics: {
    gaMeasurementId: process.env.NEXT_PUBLIC_GA_ID,
  },

  monetisation: {
    salesEmail: 'advertise@kluang.lokaly.my',
    salesWhatsapp: '60123456789',
    currency: 'MYR',
    packages: {
      featured: 49,
      premium: 149,
      sponsoredArticle: 399,
    },
  },

  editorial: {
    tagline: 'Johor’s green heart — hills, kopi and the slow road.',
    intro:
      'Kluang sits almost exactly in the middle of Johor, wrapped in forest reserve and oil palm, with a railway station that has been pouring coffee since before independence. It is the kind of town people drive through on the way somewhere else — which is precisely why it rewards stopping.',
    areas: [
      'Kluang Town',
      'Sri Lalang',
      'Niyor',
      'Kahang',
      'Renggam',
      'Simpang Renggam',
      'Layang-Layang',
      'Paloh',
    ],
    knownFor: [
      'Kluang Rail Coffee at the railway station',
      'Gunung Lambak and Gunung Belumut hiking trails',
      'Its name — "keluang" means flying fox in old Malay',
      'Being the geographic centre of Johor',
      'Oil palm and rubber estate country',
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
    // Roadmap — schema and routes exist, UI is gated off.
    reviews: false,
    businessClaim: false,
    membership: false,
    marketplace: false,
    coupons: false,
    eventTickets: false,
    aiTripPlanner: false,
    aiAssistant: false,
  },

  status: 'beta',
  launchedAt: '2026-07-27',
};
