import { defineListing, dailyHours, hours, img, PLACEHOLDER_CONTACT } from '../../helpers';
import type { Listing } from '@/types/content';

const TOWN = 'kluang';

export const cafes: Listing[] = [
  defineListing(TOWN, {
    directory: 'cafes',
    categorySlugs: ['kopitiam', 'specialty-coffee'],
    title: 'Kluang Rail Coffee',
    summary:
      'Operating on the railway station platform since 1938 — the kopitiam that put Kluang on the map.',
    body: `If you visit one place in Kluang, it is this one, and the reason is not nostalgia. The coffee is genuinely good: beans roasted the old way with margarine and sugar, ground fine, brewed through a cloth sock and served far stronger than the chain-cafe equivalent.

Order kopi-o if you want it black and unsweetened, kopi peng over ice, and a plate of charcoal-grilled kaya toast to go with it. Half-boiled eggs are ordered by the pair.

It sits on the platform of a working railway station, so trains pull in while you eat. Get there before 9am on a weekend or you will be standing.

The brand has expanded to other towns, but this is the original counter.`,
    featuredImage: img('tile-cafe', 'Traditional kopitiam counter on a railway platform'),
    gallery: [
      img('tile-cafe', 'Kopi being poured through a cloth filter'),
      img('tile-heritage', 'Kluang railway station platform seating'),
    ],
    address: 'Kluang Railway Station, Jalan Stesen, 86000 Kluang, Johor',
    area: 'Kluang Town',
    postcode: '86000',
    coordinates: { lat: 2.0325, lng: 103.3189 },
    openingHours: hours({
      mon: ['06:30', '18:00'],
      tue: ['06:30', '18:00'],
      wed: ['06:30', '18:00'],
      thu: ['06:30', '18:00'],
      fri: ['06:30', '18:00'],
      sat: ['06:30', '18:30'],
      sun: ['06:30', '18:30'],
    }),
    contact: {},
    priceRange: 1,
    priceNote: 'RM2–10 per person',
    rating: { value: 4.7, count: 486, source: 'editorial' },
    facilities: ['Air-conditioned', 'Outdoor seating', 'Halal', 'Parking', 'Specialty coffee'],
    tags: ['kopitiam', 'heritage', 'breakfast', 'coffee', 'must visit'],
    tier: 'premium',
    weight: 20,
    faqs: [
      {
        question: 'What time does Kluang Rail Coffee open?',
        answer: 'From around 6.30am daily. Weekend mornings are extremely busy between 8am and 10am.',
      },
      {
        question: 'Is Kluang Rail Coffee halal?',
        answer:
          'The original outlet serves no pork and is widely patronised by Muslim customers, but certification status should be confirmed directly if that matters to you.',
      },
      {
        question: 'Do I need a train ticket to go there?',
        answer: 'No. The kopitiam is accessible from the station forecourt without a ticket.',
      },
    ],
    seo: {
      metaTitle: 'Kluang Rail Coffee — The Original Station Kopitiam',
      metaDescription:
        'Kluang Rail Coffee has poured kopi on the railway platform since 1938. What to order, opening hours, how busy it gets and how to find it.',
    },
  }),

  defineListing(TOWN, {
    directory: 'cafes',
    categorySlugs: ['specialty-coffee', 'work-friendly', 'brunch'],
    title: 'Lambak Roasters',
    summary:
      'Single-origin pour-over, decent Wi-Fi and enough plug sockets to make it Kluang’s default laptop cafe.',
    body: `A small roastery-cafe aimed squarely at people who want a flat white rather than a kopi. Beans are roasted on site, there is usually a pour-over option chalked up, and the espresso is pulled competently.

More practically: the Wi-Fi holds, there are power points along the wall, and nobody rushes you out. That combination is rarer in Kluang than it should be.

Brunch runs until 3pm at weekends and gets busy from 11am.`,
    featuredImage: img('tile-cafe', 'Pour-over coffee being brewed at a specialty cafe'),
    address: 'Jalan Lambak, 86000 Kluang, Johor',
    area: 'Kluang Town',
    coordinates: { lat: 2.0219, lng: 103.3392 },
    openingHours: hours({
      mon: null,
      tue: ['09:00', '18:00'],
      wed: ['09:00', '18:00'],
      thu: ['09:00', '18:00'],
      fri: ['09:00', '22:00'],
      sat: ['08:30', '22:00'],
      sun: ['08:30', '18:00'],
    }),
    contact: { ...PLACEHOLDER_CONTACT, instagram: 'https://instagram.com' },
    priceRange: 2,
    priceNote: 'RM12–28 per person',
    rating: { value: 4.4, count: 118, source: 'editorial' },
    facilities: ['Wi-Fi', 'Power points', 'Laptop friendly', 'Air-conditioned', 'Specialty coffee', 'Brunch', 'Parking', 'Card payment'],
    tags: ['specialty coffee', 'wifi', 'brunch', 'work friendly'],
    tier: 'featured',
    weight: 5,
    faqs: [
      {
        question: 'Are there cafes in Kluang good for working on a laptop?',
        answer:
          'Yes — look for the "Laptop friendly" and "Power points" filters on this page. Weekday mornings are quietest.',
      },
    ],
  }),

  defineListing(TOWN, {
    directory: 'cafes',
    categorySlugs: ['dessert', 'brunch'],
    title: 'Bakery on Jalan Duku',
    summary:
      'Sourdough, kouign-amann and cold brew from a small bakery that sells out by mid-afternoon.',
    body: `A proper bakery rather than a bread counter. Loaves come out mid-morning, laminated pastries slightly earlier, and both are gone by around 3pm on a good day.

Seating is limited to a handful of stools, so most people take away. Worth timing a visit around: get there at 10am.`,
    featuredImage: img('tile-cafe', 'Fresh pastries and sourdough loaves on a bakery counter'),
    address: 'Jalan Duku, 86000 Kluang, Johor',
    area: 'Kluang Town',
    coordinates: { lat: 2.0293, lng: 103.3208 },
    openingHours: hours({
      mon: null,
      tue: null,
      wed: ['09:00', '17:00'],
      thu: ['09:00', '17:00'],
      fri: ['09:00', '17:00'],
      sat: ['08:30', '17:00'],
      sun: ['08:30', '15:00'],
    }),
    contact: { ...PLACEHOLDER_CONTACT },
    priceRange: 2,
    priceNote: 'RM8–22',
    rating: { value: 4.5, count: 72, source: 'editorial' },
    facilities: ['Air-conditioned', 'Specialty coffee', 'Card payment', 'Vegetarian options'],
    tags: ['bakery', 'sourdough', 'pastry', 'dessert'],
    hiddenGem: true,
  }),

  defineListing(TOWN, {
    directory: 'cafes',
    categorySlugs: ['kopitiam'],
    title: 'Old Town Kopitiam, Jalan Mersing',
    summary:
      'Marble tables, ceiling fans and kopi that has not changed recipe in fifty years.',
    body: `The unreconstructed version: marble-topped tables, bentwood chairs, a tiled floor worn smooth, and a queue of regulars who have sat in the same seats for decades.

Kopi, toast, eggs. That is the menu, more or less, and it is enough. Cash only.`,
    featuredImage: img('tile-cafe', 'Old kopitiam interior with marble tables and ceiling fans'),
    address: 'Jalan Mersing, 86000 Kluang, Johor',
    area: 'Kluang Town',
    coordinates: { lat: 2.0338, lng: 103.3259 },
    openingHours: dailyHours('06:00', '17:00'),
    contact: {},
    priceRange: 1,
    priceNote: 'RM2–8',
    rating: { value: 4.3, count: 95, source: 'editorial' },
    facilities: ['Open air', 'Halal'],
    tags: ['kopitiam', 'heritage', 'breakfast', 'cash only'],
  }),
];
