import { defineListing, dailyHours, hours, img, PLACEHOLDER_CONTACT } from '../../helpers';
import type { Listing } from '@/types/content';

const TOWN = 'kluang';

export const food: Listing[] = [
  defineListing(TOWN, {
    directory: 'food',
    categorySlugs: ['local-favourites', 'street-food'],
    title: 'Kluang Night Market (Pasar Malam)',
    summary:
      'The district’s rotating night market — different neighbourhood each evening, same reliably good satay, apam balik and fruit.',
    body: `Kluang runs a pasar malam somewhere almost every night of the week, rotating between neighbourhoods. The town-centre night is the biggest and the easiest to find.

Come hungry and bring cash in small notes. The stalls worth queueing for are the ones with a queue: satay, char kuey teow cooked over a proper flame, apam balik folded to order, and whatever fruit is in season stacked at the far end.

Arrive around 6.30pm as stalls are setting up, or 8pm for full swing. Parking gets difficult after 7pm — park a few streets out and walk in.`,
    featuredImage: img('tile-food', 'Night market food stalls lit up after dark'),
    gallery: [img('tile-food', 'Satay grilling over charcoal at a night market')],
    address: 'Rotating locations, Kluang, Johor',
    area: 'Kluang Town',
    coordinates: { lat: 2.0288, lng: 103.3245 },
    openingHours: hours({
      mon: ['18:00', '23:00'],
      tue: ['18:00', '23:00'],
      wed: ['18:00', '23:00'],
      thu: ['18:00', '23:00'],
      fri: ['18:00', '23:30'],
      sat: ['18:00', '23:30'],
      sun: ['18:00', '23:00'],
    }),
    contact: {},
    priceRange: 1,
    priceNote: 'RM3–12 per item',
    rating: { value: 4.4, count: 156, source: 'editorial' },
    facilities: ['Halal', 'Non-halal', 'Open air', 'Takeaway', 'Family friendly', 'Open late'],
    tags: ['night market', 'street food', 'cheap eats', 'evening'],
    tier: 'featured',
    weight: 9,
    faqs: [
      {
        question: 'Which night is the Kluang pasar malam?',
        answer:
          'There is one most nights, but the location changes by day of the week. The town-centre market is the largest; ask locally or check our events page for the current rotation.',
      },
      { question: 'Is the night market halal?', answer: 'It is mixed. Halal and non-halal stalls trade side by side, and stalls are generally labelled.' },
    ],
  }),

  defineListing(TOWN, {
    directory: 'food',
    categorySlugs: ['malay', 'halal', 'local-favourites'],
    title: 'Nasi Campur Kluang Town',
    summary:
      'Classic Malay mixed rice spread — twenty-odd dishes under glass, best raided before 1pm while the ayam masak merah lasts.',
    body: `Nasi campur is the default lunch across Johor, and this is the town-centre version of it: a long counter of curries, fried fish, vegetables and sambal, priced by what ends up on your plate.

Get there before 1pm. The good things — ayam masak merah, sambal udang, daging masak hitam — go first, and by 2pm you are choosing between what nobody else wanted.

Point at what you want, take a plate, pay at the end. Nobody will mind if you do not speak Malay.`,
    featuredImage: img('tile-food', 'Malay mixed rice counter with many curry dishes'),
    address: 'Jalan Duku, 86000 Kluang, Johor',
    area: 'Kluang Town',
    coordinates: { lat: 2.0297, lng: 103.3212 },
    openingHours: hours({
      mon: ['07:00', '16:00'],
      tue: ['07:00', '16:00'],
      wed: ['07:00', '16:00'],
      thu: ['07:00', '16:00'],
      fri: ['07:00', '16:00'],
      sat: ['07:00', '16:00'],
      sun: null,
    }),
    contact: { ...PLACEHOLDER_CONTACT },
    priceRange: 1,
    priceNote: 'RM7–14 per plate',
    rating: { value: 4.3, count: 88, source: 'editorial' },
    facilities: ['Halal', 'Air-conditioned', 'Dine-in', 'Takeaway', 'Parking', 'Family friendly'],
    tags: ['nasi campur', 'halal', 'lunch', 'malay'],
  }),

  defineListing(TOWN, {
    directory: 'food',
    categorySlugs: ['chinese', 'local-favourites'],
    title: 'Kluang Bak Kut Teh House',
    summary:
      'Peppery Johor-style bak kut teh, served from early morning until the pot runs out.',
    body: `Johor bak kut teh leans darker and more herbal than the Klang version, and Kluang keeps that tradition going.

Order the standard mixed pot, add a plate of yau char kwai for dipping, and drink the tea they bring without asking. Portions are sized for sharing — two people ordering two pots is a rookie mistake.

They open early and close when the pot is finished, which on weekends can be before 1pm.`,
    featuredImage: img('tile-food', 'Claypot of herbal bak kut teh with side dishes'),
    address: 'Jalan Mersing, 86000 Kluang, Johor',
    area: 'Kluang Town',
    coordinates: { lat: 2.0341, lng: 103.3268 },
    openingHours: hours({
      mon: ['07:00', '14:00'],
      tue: ['07:00', '14:00'],
      wed: null,
      thu: ['07:00', '14:00'],
      fri: ['07:00', '14:00'],
      sat: ['07:00', '14:00'],
      sun: ['07:00', '14:00'],
    }),
    contact: { ...PLACEHOLDER_CONTACT },
    priceRange: 2,
    priceNote: 'RM15–28 per person',
    rating: { value: 4.5, count: 132, source: 'editorial' },
    facilities: ['Non-halal', 'Air-conditioned', 'Dine-in', 'Takeaway', 'Parking', 'Card payment'],
    tags: ['bak kut teh', 'chinese', 'breakfast', 'signature'],
    tier: 'premium',
    weight: 7,
    faqs: [
      {
        question: 'What time should I go for bak kut teh in Kluang?',
        answer:
          'Before 9am on a weekday and before 8am at weekends. Most shops stop serving when the pot is empty rather than at a fixed closing time.',
      },
    ],
  }),

  defineListing(TOWN, {
    directory: 'food',
    categorySlugs: ['indian', 'halal'],
    title: 'Kluang Banana Leaf & Mamak',
    summary:
      'Banana leaf rice at lunch, roti canai and teh tarik around the clock.',
    body: `The all-purpose answer to "where can we eat right now" in Kluang. Banana leaf rice runs at lunch with the usual unlimited rice and vegetable refills; the rest of the day it operates as a mamak — roti canai, maggi goreng, nasi kandar and teh tarik pulled properly.

Open very late, which makes it the fallback after a long drive or a late arrival on the train.`,
    featuredImage: img('tile-food', 'Banana leaf rice with curries and papadam'),
    address: 'Jalan Rambutan, 86000 Kluang, Johor',
    area: 'Kluang Town',
    coordinates: { lat: 2.0272, lng: 103.3255 },
    openingHours: dailyHours('06:00', '02:00'),
    contact: { ...PLACEHOLDER_CONTACT },
    priceRange: 1,
    priceNote: 'RM8–18 per person',
    rating: { value: 4.1, count: 203, source: 'editorial' },
    facilities: ['Halal', 'Vegetarian options', 'Open air', 'Dine-in', 'Takeaway', 'Delivery', 'Parking', 'Open late', 'e-Wallet'],
    tags: ['mamak', 'banana leaf', 'late night', 'halal', 'vegetarian'],
  }),

  defineListing(TOWN, {
    directory: 'food',
    categorySlugs: ['seafood', 'chinese'],
    title: 'Kahang Road Seafood & Tze Char',
    summary:
      'Big-table tze char out on the Kahang road — steamed fish, butter prawns and sweet-and-sour everything.',
    body: `Kluang is inland, but the seafood restaurants on the Kahang road get daily deliveries from the east coast and cook them the way a Johor tze char shop should: high heat, heavy wok, no ceremony.

Order for the table. Steamed fish for the group, butter prawns because someone always wants them, kangkung belacan, and a claypot tofu. It works out cheaper per head than eating in town, which is why the car park fills with families on Saturday nights.

Call ahead at weekends.`,
    featuredImage: img('tile-food', 'Shared tze char dishes on a round table'),
    address: 'Jalan Kahang, 86000 Kluang, Johor',
    area: 'Kahang',
    coordinates: { lat: 2.0404, lng: 103.4102 },
    openingHours: hours({
      mon: ['17:00', '23:00'],
      tue: ['17:00', '23:00'],
      wed: ['17:00', '23:00'],
      thu: ['17:00', '23:00'],
      fri: ['17:00', '23:30'],
      sat: ['11:00', '23:30'],
      sun: ['11:00', '23:00'],
    }),
    contact: { ...PLACEHOLDER_CONTACT },
    priceRange: 2,
    priceNote: 'RM25–45 per person',
    rating: { value: 4.3, count: 97, source: 'editorial' },
    facilities: ['Non-halal', 'Open air', 'Dine-in', 'Parking', 'Family friendly', 'Card payment'],
    tags: ['seafood', 'tze char', 'dinner', 'groups'],
  }),

  defineListing(TOWN, {
    directory: 'food',
    categorySlugs: ['supper', 'street-food'],
    title: 'Jalan Station Supper Stalls',
    summary:
      'Where Kluang eats after 11pm — fried noodles, porridge and cold drinks under the shophouse awnings.',
    body: `When everything else has shut, the stalls along Jalan Station keep going. Expect wok-fried noodles, hor fun, porridge and a lot of iced drinks, served on plastic stools that spread further onto the pavement as the night goes on.

It is not refined and it is not trying to be. It is, however, the most reliably open food in Kluang at 1am.`,
    featuredImage: img('tile-food', 'Late-night stall cooking noodles under a shop awning'),
    address: 'Jalan Station, 86000 Kluang, Johor',
    area: 'Kluang Town',
    coordinates: { lat: 2.0318, lng: 103.3196 },
    openingHours: hours({
      mon: ['22:00', '03:00'],
      tue: ['22:00', '03:00'],
      wed: ['22:00', '03:00'],
      thu: ['22:00', '03:00'],
      fri: ['22:00', '04:00'],
      sat: ['22:00', '04:00'],
      sun: ['22:00', '03:00'],
    }),
    contact: {},
    priceRange: 1,
    priceNote: 'RM6–14 per dish',
    facilities: ['Non-halal', 'Open air', 'Dine-in', 'Takeaway', 'Open late'],
    tags: ['supper', 'late night', 'noodles', 'cheap eats'],
    hiddenGem: true,
  }),

  defineListing(TOWN, {
    directory: 'food',
    categorySlugs: ['local-favourites', 'halal'],
    title: 'Kluang Roti Bakar & Nasi Lemak Corner',
    summary:
      'Breakfast institution — charcoal-toasted kaya bread, half-boiled eggs and nasi lemak wrapped in banana leaf.',
    body: `The Kluang breakfast, in one stop. Kaya toast comes off a charcoal grill rather than a toaster, which is the entire difference. Half-boiled eggs arrive in the traditional two-cup arrangement, and the nasi lemak is wrapped rather than plated.

Order kopi-o kosong if you want to taste the coffee, kopi peng if you want to survive the heat.

Everything is gone by 11am.`,
    featuredImage: img('tile-cafe', 'Charcoal-toasted kaya bread with half-boiled eggs'),
    address: 'Jalan Ismail, 86000 Kluang, Johor',
    area: 'Kluang Town',
    coordinates: { lat: 2.0304, lng: 103.3231 },
    openingHours: hours({
      mon: ['06:30', '11:30'],
      tue: ['06:30', '11:30'],
      wed: ['06:30', '11:30'],
      thu: ['06:30', '11:30'],
      fri: ['06:30', '11:30'],
      sat: ['06:30', '12:00'],
      sun: ['06:30', '12:00'],
    }),
    contact: { ...PLACEHOLDER_CONTACT },
    priceRange: 1,
    priceNote: 'RM2–8 per item',
    rating: { value: 4.6, count: 174, source: 'editorial' },
    facilities: ['Halal', 'Open air', 'Dine-in', 'Takeaway', 'Family friendly'],
    tags: ['breakfast', 'kaya toast', 'nasi lemak', 'kopitiam'],
    tier: 'featured',
    weight: 6,
  }),

  defineListing(TOWN, {
    directory: 'food',
    categorySlugs: ['chinese', 'local-favourites'],
    title: 'Renggam Wanton Mee',
    summary:
      'A twenty-minute drive south for a plate of wanton mee that regulars insist is worth the petrol.',
    body: `Renggam is a small town south-west of Kluang, and its wanton mee has the kind of reputation that survives entirely on word of mouth.

Dry, with dark sauce, char siew sliced thin, and wantons in a separate bowl of soup. Ask for extra chilli if you want it — the default is mild.

Weekends are busy from 8am. There is no signage worth speaking of; look for the corner shop with the queue.`,
    featuredImage: img('tile-food', 'Plate of dry wanton mee with char siew'),
    address: 'Renggam, 86200 Kluang, Johor',
    area: 'Renggam',
    coordinates: { lat: 1.8331, lng: 103.3941 },
    openingHours: hours({
      mon: ['07:00', '13:00'],
      tue: ['07:00', '13:00'],
      wed: ['07:00', '13:00'],
      thu: null,
      fri: ['07:00', '13:00'],
      sat: ['07:00', '13:30'],
      sun: ['07:00', '13:30'],
    }),
    contact: {},
    priceRange: 1,
    priceNote: 'RM6–10 per plate',
    rating: { value: 4.4, count: 61, source: 'editorial' },
    facilities: ['Non-halal', 'Open air', 'Dine-in', 'Takeaway', 'Parking'],
    tags: ['wanton mee', 'noodles', 'breakfast', 'road trip'],
    hiddenGem: true,
  }),
];
