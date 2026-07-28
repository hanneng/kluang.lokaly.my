import { defineListing, dailyHours, hours, img, PLACEHOLDER_CONTACT } from '../../helpers';
import type { Listing } from '@/types/content';

const TOWN = 'kluang';

export const shopping: Listing[] = [
  defineListing(TOWN, {
    directory: 'shopping',
    categorySlugs: ['malls'],
    title: 'Kluang Mall',
    summary:
      'The district’s main shopping centre — supermarket, cinema, food court and the usual chain retail.',
    body: `Kluang Mall is where the town does its indoor shopping. A hypermarket anchors the ground floor, there is a cinema upstairs, and the food court is a reasonable air-conditioned fallback when the heat makes hawker stalls unappealing.

Practical rather than exciting, but it covers everything you might have forgotten to pack, and the car park is free.`,
    featuredImage: img('tile-shop', 'Shopping mall interior with retail units'),
    address: 'Jalan Rambutan, 86000 Kluang, Johor',
    area: 'Kluang Town',
    coordinates: { lat: 2.0247, lng: 103.3277 },
    openingHours: dailyHours('10:00', '22:00'),
    contact: { ...PLACEHOLDER_CONTACT },
    priceRange: 2,
    rating: { value: 4.0, count: 312, source: 'editorial' },
    facilities: ['Parking', 'Air-conditioned', 'Food court', 'ATM', 'Prayer room', 'Toilets', 'Wheelchair accessible', 'Open weekends', 'Card payment'],
    tags: ['mall', 'cinema', 'supermarket', 'family'],
    tier: 'featured',
    weight: 5,
  }),

  defineListing(TOWN, {
    directory: 'shopping',
    categorySlugs: ['markets'],
    title: 'Kluang Morning Market',
    summary:
      'Wet market and produce stalls, at their best between 6am and 9am.',
    body: `The morning market is the most honest look at what Kluang eats. Vegetables, fish brought in overnight, chicken cut to order, fruit stacked by the crate, and a line of prepared-food stalls around the edge for people who came for breakfast rather than groceries.

Go early — by 10am the good stock is gone and the stalls are packing up. Bring cash and expect it to be wet underfoot.`,
    featuredImage: img('tile-shop', 'Fresh produce stalls at a morning wet market'),
    address: 'Jalan Pasar, 86000 Kluang, Johor',
    area: 'Kluang Town',
    coordinates: { lat: 2.0309, lng: 103.3193 },
    openingHours: hours({
      mon: ['05:30', '11:00'],
      tue: ['05:30', '11:00'],
      wed: ['05:30', '11:00'],
      thu: ['05:30', '11:00'],
      fri: ['05:30', '11:00'],
      sat: ['05:30', '12:00'],
      sun: ['05:30', '12:00'],
    }),
    contact: {},
    priceRange: 1,
    rating: { value: 4.3, count: 88, source: 'editorial' },
    facilities: ['Parking', 'Toilets', 'Open weekends'],
    tags: ['market', 'produce', 'morning', 'local life'],
    hiddenGem: true,
  }),

  defineListing(TOWN, {
    directory: 'shopping',
    categorySlugs: ['souvenirs', 'specialty'],
    title: 'Kluang Coffee & Local Produce Shop',
    summary:
      'Roasted coffee, kaya, biscuits and dried goods — the practical answer to "what do I bring back from Kluang".',
    body: `Kluang’s edible souvenirs are coffee and kaya, and both travel well.

Ground coffee is sold in vacuum packs, kaya in screw-top jars, and there is usually a shelf of local biscuits and dried fruit alongside. Staff will happily explain the difference between the roast grades, which is more useful than it sounds if you are buying as a gift.`,
    featuredImage: img('tile-shop', 'Shelves of packaged local coffee and preserves'),
    address: 'Jalan Station, 86000 Kluang, Johor',
    area: 'Kluang Town',
    coordinates: { lat: 2.0321, lng: 103.3199 },
    openingHours: dailyHours('09:00', '18:00'),
    contact: { ...PLACEHOLDER_CONTACT },
    priceRange: 2,
    facilities: ['Card payment', 'Parking', 'Open weekends', 'Air-conditioned'],
    tags: ['souvenirs', 'coffee', 'gifts', 'local produce'],
    faqs: [
      {
        question: 'What should I buy as a souvenir from Kluang?',
        answer:
          'Locally roasted coffee is the obvious choice, followed by kaya and traditional biscuits. All three are sold in sealed packaging that survives a flight.',
      },
    ],
  }),
];

export const businesses: Listing[] = [
  defineListing(TOWN, {
    directory: 'businesses',
    categorySlugs: ['automotive'],
    title: 'Kluang Auto Care & Tyre Centre',
    summary:
      'Servicing, tyres and battery replacement, with walk-in slots most weekday mornings.',
    body: `A general workshop handling routine servicing, tyre changes, alignment and batteries for most common makes.

Useful to know if you are driving through Johor and something goes wrong — they are on the main road, open six days, and will usually look at a walk-in the same morning.`,
    featuredImage: img('tile-shop', 'Car workshop service bay'),
    address: 'Jalan Mersing, 86000 Kluang, Johor',
    area: 'Kluang Town',
    coordinates: { lat: 2.0361, lng: 103.3295 },
    openingHours: hours({
      mon: ['08:30', '18:00'],
      tue: ['08:30', '18:00'],
      wed: ['08:30', '18:00'],
      thu: ['08:30', '18:00'],
      fri: ['08:30', '18:00'],
      sat: ['08:30', '14:00'],
      sun: null,
    }),
    contact: { ...PLACEHOLDER_CONTACT },
    rating: { value: 4.2, count: 64, source: 'editorial' },
    facilities: ['Parking', 'Walk-in welcome', 'Card payment', 'e-Wallet'],
    tags: ['workshop', 'tyres', 'car service'],
    tier: 'featured',
    weight: 4,
  }),

  defineListing(TOWN, {
    directory: 'businesses',
    categorySlugs: ['health'],
    title: 'Klinik Kesihatan Kluang Town',
    summary: 'General practice clinic with evening hours and weekend cover.',
    body: `A general practice handling consultations, minor injuries, vaccinations and health screening.

Evening sessions run until 9pm on weekdays, which makes it the practical option for anything that happens after office hours but does not warrant the hospital.`,
    featuredImage: img('tile-shop', 'Clinic reception area'),
    address: 'Jalan Ismail, 86000 Kluang, Johor',
    area: 'Kluang Town',
    coordinates: { lat: 2.0281, lng: 103.3243 },
    openingHours: hours({
      mon: ['09:00', '21:00'],
      tue: ['09:00', '21:00'],
      wed: ['09:00', '21:00'],
      thu: ['09:00', '21:00'],
      fri: ['09:00', '21:00'],
      sat: ['09:00', '17:00'],
      sun: ['09:00', '13:00'],
    }),
    contact: { ...PLACEHOLDER_CONTACT },
    rating: { value: 4.1, count: 51, source: 'editorial' },
    facilities: ['Parking', 'Walk-in welcome', 'Open Sunday', 'Card payment'],
    tags: ['clinic', 'health', 'gp'],
  }),

  defineListing(TOWN, {
    directory: 'businesses',
    categorySlugs: ['professional', 'events-services'],
    title: 'Kluang Print & Signage',
    summary: 'Digital printing, banners and shop signage, with same-day work on small jobs.',
    body: `Business cards, flyers, banners, vehicle decals and shop signage. Small-format jobs are usually turned around the same day if the artwork is ready.

Relevant to anyone advertising locally — they handle the physical side of what we do online.`,
    featuredImage: img('tile-shop', 'Large format printing workshop'),
    address: 'Jalan Duku, 86000 Kluang, Johor',
    area: 'Kluang Town',
    coordinates: { lat: 2.0299, lng: 103.3221 },
    openingHours: hours({
      mon: ['09:00', '18:00'],
      tue: ['09:00', '18:00'],
      wed: ['09:00', '18:00'],
      thu: ['09:00', '18:00'],
      fri: ['09:00', '18:00'],
      sat: ['09:00', '13:00'],
      sun: null,
    }),
    contact: { ...PLACEHOLDER_CONTACT },
    facilities: ['Parking', 'Walk-in welcome', 'e-Wallet'],
    tags: ['printing', 'signage', 'business services'],
  }),

  defineListing(TOWN, {
    directory: 'businesses',
    categorySlugs: ['automotive'],
    title: 'Kluang Car Rental',
    summary:
      'Self-drive rentals from the town centre — useful if you arrive by train and want to reach the forest reserves.',
    body: `Public transport within Kluang district is thin, and the attractions worth the trip — Gunung Belumut, Kahang, the seafood restaurants — are all a drive away.

Self-drive rental fills that gap. Compact cars and MPVs, daily and weekly rates, with delivery to the railway station on request.`,
    featuredImage: img('tile-shop', 'Row of rental cars parked at a depot'),
    address: 'Jalan Station, 86000 Kluang, Johor',
    area: 'Kluang Town',
    coordinates: { lat: 2.0313, lng: 103.3211 },
    openingHours: dailyHours('08:00', '19:00'),
    contact: { ...PLACEHOLDER_CONTACT, website: 'https://example.com' },
    priceRange: 2,
    priceNote: 'From RM90 per day',
    rating: { value: 4.0, count: 44, source: 'editorial' },
    facilities: ['Parking', 'Appointment required', 'Card payment', 'Open Sunday', 'Home service'],
    tags: ['car rental', 'transport', 'self drive'],
    tier: 'premium',
    weight: 6,
    faqs: [
      {
        question: 'How do you get around Kluang without a car?',
        answer:
          'Within the town centre, walking works. For Gunung Belumut, Kahang or Renggam you will want a car — e-hailing coverage exists but is unreliable outside the town.',
      },
    ],
  }),

  defineListing(TOWN, {
    directory: 'businesses',
    categorySlugs: ['beauty'],
    title: 'Lambak Barber & Grooming',
    summary: 'Walk-in barbershop near the town centre, open late on weekends.',
    body: `Cuts, fades, beard trims and hot-towel shaves. Walk-ins are normal on weekdays; weekends move faster if you message ahead.`,
    featuredImage: img('tile-shop', 'Barbershop chairs and mirrors'),
    address: 'Jalan Lambak, 86000 Kluang, Johor',
    area: 'Kluang Town',
    coordinates: { lat: 2.0224, lng: 103.3378 },
    openingHours: hours({
      mon: null,
      tue: ['11:00', '20:00'],
      wed: ['11:00', '20:00'],
      thu: ['11:00', '20:00'],
      fri: ['11:00', '22:00'],
      sat: ['10:00', '22:00'],
      sun: ['10:00', '19:00'],
    }),
    contact: { ...PLACEHOLDER_CONTACT },
    rating: { value: 4.4, count: 73, source: 'editorial' },
    facilities: ['Walk-in welcome', 'Open Sunday', 'e-Wallet', 'Parking'],
    tags: ['barber', 'grooming'],
  }),
];
