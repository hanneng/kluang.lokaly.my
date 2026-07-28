/**
 * Hotels and homestays.
 *
 * Business names here are deliberately generic sample names rather than the
 * names of real operators — attaching invented rates, hours and phone numbers
 * to a real business is the one kind of seed data that can actually cause harm.
 * Replace wholesale with verified listings before launch.
 */

import { defineListing, img, PLACEHOLDER_CONTACT } from '../../helpers';
import type { Listing } from '@/types/content';

const TOWN = 'kluang';

export const hotels: Listing[] = [
  defineListing(TOWN, {
    directory: 'hotels',
    categorySlugs: ['business', 'budget'],
    title: 'Rail Central Hotel Kluang',
    summary:
      'Business-standard rooms five minutes’ walk from the railway station, with parking and breakfast included.',
    body: `The most convenient base in Kluang if you are arriving by train or planning to spend your time in the old town.

Rooms are plain but well kept — desk, air-conditioning, hot shower, reliable Wi-Fi. Breakfast is a simple local spread served from 7am, which is late if you are climbing Gunung Lambak, so plan accordingly.

The real advantage is position. The station, the kopitiams on Jalan Station and the night market rotation are all inside a ten-minute walk, and the car park means you are not hunting for a space in the town centre.`,
    featuredImage: img('tile-hotel', 'Hotel bedroom with double bed and work desk'),
    gallery: [img('tile-hotel', 'Hotel lobby seating area'), img('tile-hotel', 'Twin room with city view')],
    address: 'Jalan Station, 86000 Kluang, Johor',
    area: 'Kluang Town',
    postcode: '86000',
    coordinates: { lat: 2.0316, lng: 103.3204 },
    contact: {
      ...PLACEHOLDER_CONTACT,
      website: 'https://example.com',
      bookingUrl: 'https://example.com/book',
    },
    priceRange: 2,
    priceNote: 'From RM120 per night',
    rating: { value: 4.2, count: 214, source: 'editorial' },
    facilities: [
      'Free Wi-Fi',
      'Free parking',
      'Air-conditioning',
      'Breakfast included',
      '24-hour reception',
      'Lift',
      'Family rooms',
      'Prayer room',
      'Meeting rooms',
    ],
    tags: ['town centre', 'business', 'near station', 'parking'],
    tier: 'premium',
    weight: 15,
    faqs: [
      {
        question: 'Is there a hotel near Kluang railway station?',
        answer:
          'Yes — several properties sit within a five to ten minute walk of the station, which is the most practical area to stay if you are arriving by rail.',
      },
      {
        question: 'Do Kluang hotels include breakfast?',
        answer:
          'Mid-range hotels in Kluang usually include a simple local breakfast. Budget properties often do not — check before booking.',
      },
    ],
    seo: {
      metaTitle: 'Rail Central Hotel Kluang — Rates, Facilities & Location',
      metaDescription:
        'A business hotel five minutes from Kluang railway station. Room rates, facilities, parking, breakfast and what is within walking distance.',
    },
  }),

  defineListing(TOWN, {
    directory: 'hotels',
    categorySlugs: ['budget'],
    title: 'Kluang Budget Inn',
    summary:
      'Clean, cheap and central — a straightforward overnight stop with no pretensions.',
    body: `A no-frills option for travellers who need a bed, a shower and somewhere to leave the car.

Rooms are small and simply furnished. Air-conditioning and hot water are standard; breakfast is not included and there is no lift. Staff are on the desk until late but not around the clock.

Good value if you are passing through on the way to Mersing or the east coast.`,
    featuredImage: img('tile-hotel', 'Simple budget hotel room with single beds'),
    address: 'Jalan Ismail, 86000 Kluang, Johor',
    area: 'Kluang Town',
    coordinates: { lat: 2.0288, lng: 103.3238 },
    contact: { ...PLACEHOLDER_CONTACT },
    priceRange: 1,
    priceNote: 'From RM75 per night',
    rating: { value: 3.8, count: 141, source: 'editorial' },
    facilities: ['Free Wi-Fi', 'Air-conditioning', 'Free parking'],
    tags: ['budget', 'town centre', 'overnight'],
  }),

  defineListing(TOWN, {
    directory: 'hotels',
    categorySlugs: ['resort', 'family'],
    title: 'Belumut View Resort',
    summary:
      'Out-of-town rooms and chalets with grounds, a pool and easy access to the forest reserve.',
    body: `Twenty minutes east of Kluang town, on the road towards Kahang, with enough land around it to feel genuinely away from things.

Accommodation is split between hotel rooms in the main block and standalone chalets, which suit families and groups better. There is a pool, a restaurant, and space for children to run around without anyone worrying about traffic.

The obvious pairing is Gunung Belumut — the reserve entrance is a short drive on, which makes an early start realistic.`,
    featuredImage: img('tile-hotel', 'Resort chalets set among trees'),
    gallery: [img('tile-hotel', 'Swimming pool surrounded by greenery')],
    address: 'Jalan Kahang, 86000 Kluang, Johor',
    area: 'Kahang',
    coordinates: { lat: 2.0448, lng: 103.4211 },
    contact: {
      ...PLACEHOLDER_CONTACT,
      website: 'https://example.com',
      bookingUrl: 'https://example.com/book',
    },
    priceRange: 3,
    priceNote: 'From RM240 per night',
    rating: { value: 4.3, count: 86, source: 'editorial' },
    facilities: [
      'Free Wi-Fi',
      'Free parking',
      'Air-conditioning',
      'Swimming pool',
      'Restaurant',
      'Breakfast included',
      'Family rooms',
      'Prayer room',
    ],
    tags: ['resort', 'family', 'nature', 'pool'],
    tier: 'featured',
    weight: 8,
  }),

  defineListing(TOWN, {
    directory: 'hotels',
    categorySlugs: ['boutique'],
    title: 'Shophouse Stay Kluang',
    summary:
      'Six rooms inside a restored pre-war shophouse, a block from the old market.',
    body: `A conversion rather than a build: original tiles, high ceilings, a light well in the middle and six rooms arranged around it.

There is no lift and no restaurant, and the rooms facing the street get morning noise from the market. In exchange you get somewhere with character in a town that mostly offers standard-issue rooms, and you can walk to breakfast in three minutes.`,
    featuredImage: img('tile-hotel', 'Restored shophouse guest room with heritage tiles'),
    address: 'Jalan Duku, 86000 Kluang, Johor',
    area: 'Kluang Town',
    coordinates: { lat: 2.0301, lng: 103.3215 },
    contact: { ...PLACEHOLDER_CONTACT, bookingUrl: 'https://example.com/book' },
    priceRange: 3,
    priceNote: 'From RM190 per night',
    rating: { value: 4.6, count: 58, source: 'editorial' },
    facilities: ['Free Wi-Fi', 'Air-conditioning', 'Breakfast included'],
    tags: ['boutique', 'heritage', 'town centre', 'couples'],
    hiddenGem: true,
  }),
];

export const homestays: Listing[] = [
  defineListing(TOWN, {
    directory: 'homestays',
    categorySlugs: ['whole-house', 'group'],
    title: 'Lambak Family Homestay',
    summary:
      'A four-bedroom house near the Gunung Lambak trailhead, sleeping up to twelve.',
    body: `A whole-house rental aimed at families and hiking groups. Four bedrooms, two bathrooms, a full kitchen, a washing machine and a covered car porch for three vehicles.

The trailhead is a five-minute drive, which makes a pre-dawn start on Gunung Lambak realistic without staying in town.

Minimum two-night stay at weekends. Bring your own toiletries.`,
    featuredImage: img('tile-hotel', 'Living room of a family homestay house'),
    gallery: [img('tile-hotel', 'Homestay kitchen and dining area')],
    address: 'Taman Lambak, 86000 Kluang, Johor',
    area: 'Kluang Town',
    coordinates: { lat: 2.0207, lng: 103.3411 },
    contact: { ...PLACEHOLDER_CONTACT, bookingUrl: 'https://example.com/book' },
    priceRange: 2,
    priceNote: 'From RM380 per night for the whole house',
    rating: { value: 4.5, count: 42, source: 'editorial' },
    facilities: [
      'Whole house',
      'Wi-Fi',
      'Air-conditioning',
      'Kitchen',
      'Washing machine',
      'Parking',
      'BBQ area',
      'Muslim friendly',
      'Prayer mat & kiblat',
    ],
    tags: ['whole house', 'groups', 'hiking', 'family'],
    tier: 'featured',
    weight: 6,
    faqs: [
      {
        question: 'How many people can stay in a Kluang homestay?',
        answer:
          'Whole-house homestays in Kluang typically sleep between eight and sixteen people. Filter by the "Large groups" category for the biggest properties.',
      },
    ],
  }),

  defineListing(TOWN, {
    directory: 'homestays',
    categorySlugs: ['kampung'],
    title: 'Kampung Renggam Homestay',
    summary:
      'A traditional wooden kampung house south of town, with fruit trees and a very quiet night.',
    body: `A raised timber house on family land, rented out as a whole property. The interior is simple — fans and one air-conditioned bedroom — and the appeal is the setting: rambutan and durian trees, a wide verandah and no traffic noise at all.

Best in fruit season, which is roughly June to August depending on the year. The owners live nearby and will point you at the good stalls.`,
    featuredImage: img('tile-hotel', 'Traditional Malay wooden house with verandah'),
    address: 'Renggam, 86200 Kluang, Johor',
    area: 'Renggam',
    coordinates: { lat: 1.8296, lng: 103.3987 },
    contact: { ...PLACEHOLDER_CONTACT },
    priceRange: 1,
    priceNote: 'From RM180 per night',
    rating: { value: 4.4, count: 29, source: 'editorial' },
    facilities: ['Whole house', 'Kitchen', 'Parking', 'Muslim friendly', 'Prayer mat & kiblat', 'BBQ area'],
    tags: ['kampung', 'quiet', 'fruit season', 'traditional'],
    hiddenGem: true,
  }),

  defineListing(TOWN, {
    directory: 'homestays',
    categorySlugs: ['apartment'],
    title: 'Kluang Town Serviced Apartment',
    summary:
      'A two-bedroom apartment walking distance from Kluang Mall, good for longer stays.',
    body: `A standard condominium unit set up for short lets: two bedrooms, a kitchen, a washing machine and covered parking, with the mall and a supermarket in walking range.

More practical than a hotel for anything over three nights, particularly if you are in Kluang for work.`,
    featuredImage: img('tile-hotel', 'Modern serviced apartment living area'),
    address: 'Jalan Bakawali, 86000 Kluang, Johor',
    area: 'Kluang Town',
    coordinates: { lat: 2.0253, lng: 103.3287 },
    contact: { ...PLACEHOLDER_CONTACT, bookingUrl: 'https://example.com/book' },
    priceRange: 2,
    priceNote: 'From RM160 per night',
    rating: { value: 4.1, count: 37, source: 'editorial' },
    facilities: ['Wi-Fi', 'Air-conditioning', 'Kitchen', 'Washing machine', 'Parking', 'Swimming pool'],
    tags: ['apartment', 'long stay', 'work trip'],
  }),
];
