import { defineEvent, img, inDays, PLACEHOLDER_CONTACT } from '../helpers';
import type { TownEvent } from '@/types/content';

const TOWN = 'kluang';

/**
 * Dates are generated relative to today so the demo always has a populated
 * "Upcoming" list. Real events come from the CMS with fixed timestamps.
 */
export const kluangEvents: TownEvent[] = [
  defineEvent(TOWN, {
    title: 'Kluang Weekend Night Market',
    summary: 'The weekly pasar malam takes over the town-centre street from early evening.',
    body: `The largest of Kluang's rotating night markets, running along the town-centre street from around 6pm until late.

Expect the full range: satay, apam balik, fried snacks, seasonal fruit, clothes, phone accessories and a great deal of noise. Parking is difficult after 7pm — leave the car a few streets away.`,
    featuredImage: img('tile-event', 'Busy night market street with food stalls'),
    startsAt: inDays(3, '18:00'),
    endsAt: inDays(3, '23:30'),
    recurrence: 'Weekly',
    venueName: 'Kluang Town Centre',
    address: 'Jalan Station, 86000 Kluang, Johor',
    coordinates: { lat: 2.0288, lng: 103.3245 },
    priceNote: 'Free entry',
    tags: ['night market', 'food', 'family', 'weekly'],
    tier: 'featured',
  }),

  defineEvent(TOWN, {
    title: 'Gunung Lambak Sunrise Community Hike',
    summary: 'A guided group climb starting before dawn, open to first-timers.',
    body: `A community-organised group hike up Gunung Lambak, setting off from the base car park in the dark to reach the summit clearing for sunrise.

Aimed at people who would rather not do their first climb alone. Pace is set by the slowest walker. Bring a head torch, water and shoes with grip.

Register in advance — group size is capped.`,
    featuredImage: img('tile-nature', 'Hikers on a forest trail before dawn'),
    startsAt: inDays(9, '05:30'),
    endsAt: inDays(9, '09:00'),
    venueName: 'Gunung Lambak Recreational Park',
    address: 'Jalan Gunung Lambak, 86000 Kluang, Johor',
    coordinates: { lat: 2.0186, lng: 103.3475 },
    venueListingId: 'kluang-attractions-gunung-lambak-recreational-park',
    organiser: 'Kluang Outdoor Community',
    contact: { ...PLACEHOLDER_CONTACT },
    priceNote: 'Free — registration required',
    tags: ['hiking', 'sunrise', 'community', 'outdoors'],
  }),

  defineEvent(TOWN, {
    title: 'Kluang Coffee Festival',
    summary: 'Local roasters, kopitiam demonstrations and a cupping session at the padang.',
    body: `A weekend celebration of the thing Kluang is best known for. Local roasters set up stalls, the older kopitiam operators demonstrate sock-brewing technique, and there is a cupping session for anyone who wants to taste the difference between roast grades side by side.

Family programming runs alongside — food stalls, live music in the evening and a small makers' market.`,
    featuredImage: img('tile-cafe', 'Coffee festival stalls with brewing equipment'),
    startsAt: inDays(24, '10:00'),
    endsAt: inDays(25, '22:00'),
    allDay: true,
    venueName: 'Kluang Municipal Park & Padang',
    address: 'Jalan Bakawali, 86000 Kluang, Johor',
    coordinates: { lat: 2.0268, lng: 103.3221 },
    venueListingId: 'kluang-attractions-kluang-municipal-park-padang',
    organiser: 'Kluang Municipal Council',
    contact: { ...PLACEHOLDER_CONTACT },
    priceNote: 'Free entry',
    tags: ['coffee', 'festival', 'family', 'food'],
    tier: 'premium',
  }),

  defineEvent(TOWN, {
    title: 'Kahang Farmers’ Market',
    summary: 'Monthly organic produce market out at Kahang, with breakfast stalls.',
    body: `A monthly market at the Kahang eco farm, selling organic rice, vegetables and fruit direct from growers in the district, alongside a handful of breakfast stalls.

Starts early and winds down by lunchtime. Bring your own bags.`,
    featuredImage: img('tile-nature', 'Farmers market produce stall'),
    startsAt: inDays(17, '07:30'),
    endsAt: inDays(17, '12:00'),
    venueName: 'Kahang Organic Rice Eco Farm',
    address: 'Kahang, 86700 Kluang, Johor',
    coordinates: { lat: 2.0333, lng: 103.5333 },
    venueListingId: 'kluang-attractions-kahang-organic-rice-eco-farm',
    priceNote: 'Free entry',
    tags: ['market', 'organic', 'monthly', 'produce'],
  }),

  defineEvent(TOWN, {
    title: 'Kluang Heritage Shophouse Walk',
    summary: 'A guided two-hour walk through the pre-war town centre, led by a local historian.',
    body: `A guided version of the self-guided heritage loop, covering the railway station, the shophouse blocks around Jalan Station and the old market.

Runs monthly, in English and Malay. Groups are capped at twenty, and it books out.`,
    featuredImage: img('tile-heritage', 'Guide leading a group past heritage shophouses'),
    startsAt: inDays(31, '08:00'),
    endsAt: inDays(31, '10:00'),
    venueName: 'Kluang Railway Station',
    address: 'Jalan Stesen, 86000 Kluang, Johor',
    coordinates: { lat: 2.0324, lng: 103.3186 },
    venueListingId: 'kluang-attractions-kluang-railway-station',
    organiser: 'Kluang Heritage Society',
    contact: { ...PLACEHOLDER_CONTACT },
    priceNote: 'RM20 per person',
    ticketUrl: 'https://example.com/tickets',
    tags: ['heritage', 'walking tour', 'history', 'monthly'],
  }),

  defineEvent(TOWN, {
    title: 'Kluang Fun Run',
    summary: 'A 5 km and 10 km road run starting and finishing at the padang.',
    body: `An annual road run with 5 km and 10 km categories, starting at the padang and looping through the town centre while the roads are still quiet.

Flag-off is early. Registration includes a shirt and a finisher medal, and there are food stalls at the finish.`,
    featuredImage: img('tile-event', 'Runners at the start line of a road race'),
    startsAt: inDays(45, '06:30'),
    endsAt: inDays(45, '10:00'),
    venueName: 'Kluang Municipal Park & Padang',
    address: 'Jalan Bakawali, 86000 Kluang, Johor',
    coordinates: { lat: 2.0268, lng: 103.3221 },
    organiser: 'Kluang Municipal Council',
    priceNote: 'From RM45',
    ticketUrl: 'https://example.com/tickets',
    tags: ['running', 'sport', 'annual', 'family'],
  }),
];
