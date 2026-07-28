import { defineListing, hours, img, PLACEHOLDER_CONTACT } from '../../helpers';
import type { Listing } from '@/types/content';

const TOWN = 'kluang';

export const attractions: Listing[] = [
  defineListing(TOWN, {
    directory: 'attractions',
    categorySlugs: ['nature', 'recreation'],
    title: 'Gunung Lambak Recreational Park',
    summary:
      'Kluang’s home mountain — a steep 510 m climb that locals treat as a morning routine, with a waterfall and picnic area at the base.',
    body: `Gunung Lambak is the hill you see from almost everywhere in Kluang town, and the reason half the district owns a pair of trail shoes.

The main trail starts behind the recreational park at the foot of the hill and climbs roughly 510 metres to a summit clearing. It is short but genuinely steep — most people take between 60 and 90 minutes up, and the descent is harder on the knees than the ascent is on the lungs. Ropes and steps have been installed on the worst sections, but after rain the granite gets slick and the last third turns into a scramble.

Start early. The car park fills before 7am on weekends, and the canopy does very little once the sun is properly up. There is a stream and a small waterfall near the base where families spread out mats, plus a surau, changing rooms and a row of stalls selling breakfast to people coming back down.

**What to bring:** at least 1.5 litres of water per person, grip shoes, and small notes for the stalls. There is no shop past the trailhead.`,
    featuredImage: img('tile-nature', 'Forest trail climbing Gunung Lambak in Kluang'),
    gallery: [
      img('tile-nature', 'Trail marker on the Gunung Lambak route'),
      img('tile-heritage', 'Picnic area at the base of Gunung Lambak'),
    ],
    address: 'Jalan Gunung Lambak, 86000 Kluang, Johor',
    area: 'Kluang Town',
    postcode: '86000',
    coordinates: { lat: 2.0186, lng: 103.3475 },
    openingHours: hours({
      mon: ['06:00', '19:00'],
      tue: ['06:00', '19:00'],
      wed: ['06:00', '19:00'],
      thu: ['06:00', '19:00'],
      fri: ['06:00', '19:00'],
      sat: ['06:00', '19:00'],
      sun: ['06:00', '19:00'],
    }),
    contact: {},
    priceNote: 'Free entry. Parking RM2.',
    rating: { value: 4.5, count: 128, source: 'editorial' },
    facilities: ['Free parking', 'Toilets', 'Prayer room', 'Family friendly', 'Free entry', 'Food stalls nearby'],
    tags: ['hiking', 'nature', 'sunrise', 'family'],
    tier: 'featured',
    weight: 10,
    faqs: [
      {
        question: 'How long does it take to climb Gunung Lambak?',
        answer:
          'Most people reach the summit in 60–90 minutes and come back down in about 45 minutes. Fit hikers who go regularly do the round trip in just over an hour.',
      },
      {
        question: 'Is Gunung Lambak suitable for beginners?',
        answer:
          'Yes, with the caveat that it is steep rather than long. Beginners manage it comfortably if they start early, take breaks and wear shoes with grip. It is not a good first hike in wet weather.',
      },
      {
        question: 'Is there an entrance fee?',
        answer: 'Entry to the recreational park and trail is free. Parking is charged at a nominal rate.',
      },
    ],
    seo: {
      metaTitle: 'Gunung Lambak Kluang — Trail Guide, Timing & Parking',
      metaDescription:
        'Everything you need to hike Gunung Lambak in Kluang: trail difficulty, how long it takes, when to start, parking, facilities and what to bring.',
    },
  }),

  defineListing(TOWN, {
    directory: 'attractions',
    categorySlugs: ['nature'],
    title: 'Gunung Belumut Recreational Forest',
    summary:
      'A serious forest-reserve hike about 40 minutes east of town, with river pools near the entrance for people who would rather not climb.',
    body: `Hutan Lipur Gunung Belumut sits inside the forest reserve east of Kluang, and it is a different proposition from Gunung Lambak — taller, wilder and a proper day out rather than a morning workout.

The summit trail is a full-day undertaking and registration at the ranger post is required. Most visitors never go that far. They stop at the river near the entrance, where a series of clear granite pools and small cascades make an excellent, cold swimming spot, with sheltered huts and barbecue pits alongside.

Bring everything you need. The nearest shop is a long way back down the road, mobile coverage is patchy inside the reserve, and the access road narrows considerably in the last few kilometres.`,
    featuredImage: img('tile-nature', 'River pools at Gunung Belumut Recreational Forest'),
    address: 'Hutan Lipur Gunung Belumut, 86000 Kluang, Johor',
    area: 'Kahang',
    coordinates: { lat: 2.0575, lng: 103.5286 },
    openingHours: hours({
      mon: ['08:00', '17:00'],
      tue: ['08:00', '17:00'],
      wed: ['08:00', '17:00'],
      thu: ['08:00', '17:00'],
      fri: ['08:00', '17:00'],
      sat: ['08:00', '18:00'],
      sun: ['08:00', '18:00'],
    }),
    contact: {},
    priceNote: 'Small entry fee per vehicle',
    rating: { value: 4.4, count: 76, source: 'editorial' },
    facilities: ['Paid parking', 'Toilets', 'Family friendly', 'Entrance fee', 'Guided tours'],
    tags: ['nature', 'waterfall', 'swimming', 'camping', 'hiking'],
    hiddenGem: true,
    faqs: [
      {
        question: 'Can you swim at Gunung Belumut?',
        answer:
          'Yes — the river pools near the entrance are the main draw and are shallow enough for families. Avoid the water entirely after heavy rain upstream.',
      },
      {
        question: 'Do you need a permit to climb Gunung Belumut?',
        answer:
          'The summit trail requires registration at the ranger post, and climbers are generally expected to start early and go in a group.',
      },
    ],
  }),

  defineListing(TOWN, {
    directory: 'attractions',
    categorySlugs: ['heritage', 'viewpoints'],
    title: 'Kluang Railway Station',
    summary:
      'A working colonial-era station on the West Coast line, and the address of the kopitiam that made Kluang famous.',
    body: `Kluang Railway Station is the most photographed building in the district and still does its actual job — KTM intercity and ETS services stop here daily.

The low white station building dates from the early twentieth century, when the line through Johor was cut to serve the rubber estates. Very little about the platform has been modernised, which is precisely the appeal: timber, ceiling fans, a hand-painted station sign and a level of quiet that feels impossible for a transport hub.

The other reason to come is Kluang Rail Coffee, which has operated on the platform since 1938 and remains the single most reliable breakfast in town.

**Getting here by train:** the station is on the KTM West Coast line, roughly five hours from KL Sentral and two from JB Sentral, depending on service.`,
    featuredImage: img('tile-heritage', 'Platform at Kluang Railway Station'),
    gallery: [img('tile-heritage', 'Kluang Railway Station building'), img('tile-cafe', 'Kopi and toast on the station platform')],
    address: 'Jalan Stesen, 86000 Kluang, Johor',
    area: 'Kluang Town',
    postcode: '86000',
    coordinates: { lat: 2.0324, lng: 103.3186 },
    contact: {},
    priceNote: 'Free to visit',
    rating: { value: 4.6, count: 210, source: 'editorial' },
    facilities: ['Toilets', 'Free entry', 'Food stalls nearby', 'Paid parking', 'Wheelchair accessible'],
    tags: ['heritage', 'photography', 'train', 'coffee'],
    tier: 'featured',
    weight: 12,
    faqs: [
      {
        question: 'Can you visit Kluang Railway Station without taking a train?',
        answer:
          'Yes. The station forecourt and the kopitiam are open to anyone. Be considerate on the platform itself when services are due.',
      },
      {
        question: 'What time does Kluang Rail Coffee open?',
        answer:
          'It opens early — before 7am most days — and tends to sell out of the popular items well before lunch.',
      },
    ],
    seo: {
      metaTitle: 'Kluang Railway Station — History, Photos & Rail Coffee',
      metaDescription:
        'Visit Kluang Railway Station: colonial-era architecture, the famous Kluang Rail Coffee kopitiam on the platform, train times and photography tips.',
    },
  }),

  defineListing(TOWN, {
    directory: 'attractions',
    categorySlugs: ['agrotourism', 'family'],
    title: 'Zenxin Organic Park',
    summary:
      'A working organic farm open to visitors, with guided tours, a farm-to-table restaurant and a produce shop.',
    body: `Zenxin runs one of Malaysia’s better-known organic operations, and the Kluang site is set up for visitors rather than being a farm that merely tolerates them.

A guided tour walks you through the growing tunnels and explains what organic certification actually requires — useful, and more interesting than it sounds. Children get the hands-on parts: feeding animals, pulling vegetables, seeing where things come from. The on-site restaurant cooks with what the farm grows, and the shop sells produce, cold-pressed juice and dry goods.

Book ahead for tours, especially during school holidays, and allow two to three hours.`,
    featuredImage: img('tile-nature', 'Rows of vegetables under growing tunnels at an organic farm'),
    address: 'Jalan Batu Pahat, 86000 Kluang, Johor',
    area: 'Kluang Town',
    coordinates: { lat: 2.0119, lng: 103.2617 },
    openingHours: hours({
      mon: ['09:00', '17:00'],
      tue: ['09:00', '17:00'],
      wed: ['09:00', '17:00'],
      thu: ['09:00', '17:00'],
      fri: ['09:00', '17:00'],
      sat: ['09:00', '18:00'],
      sun: ['09:00', '18:00'],
    }),
    contact: { ...PLACEHOLDER_CONTACT },
    priceRange: 2,
    priceNote: 'Tour packages from RM15 per person',
    rating: { value: 4.2, count: 94, source: 'editorial' },
    facilities: ['Free parking', 'Toilets', 'Family friendly', 'Guided tours', 'Entrance fee', 'Wheelchair accessible'],
    tags: ['farm', 'organic', 'family', 'educational'],
    tier: 'premium',
    weight: 8,
    faqs: [
      {
        question: 'Do you need to book a farm tour in advance?',
        answer:
          'Yes for guided tours, particularly at weekends and during school holidays. Walk-in visits to the shop and restaurant are usually fine.',
      },
      {
        question: 'Is Zenxin Organic Park good for young children?',
        answer:
          'It is one of the better options in Kluang for under-tens — short walking distances, animals, and a restaurant on site.',
      },
    ],
  }),

  defineListing(TOWN, {
    directory: 'attractions',
    categorySlugs: ['agrotourism'],
    title: 'Kahang Organic Rice Eco Farm',
    summary:
      'Paddy fields and an eco-farm stay out at Kahang, about 35 km east of Kluang town.',
    body: `Kahang sits on the road east towards Mersing, and the organic rice farm there is the closest thing the district has to a proper agritourism destination.

The draw is the paddy itself — a genuinely photogenic landscape that changes completely across the planting cycle — plus fish ponds, fruit orchards and a small set of chalets for people who want to stay the night. Tours cover organic rice cultivation and usually end with a meal.

Combine it with Gunung Belumut, which is on the same side of the district.`,
    featuredImage: img('tile-nature', 'Green paddy fields at an organic rice farm'),
    address: 'Kahang, 86700 Kluang, Johor',
    area: 'Kahang',
    coordinates: { lat: 2.0333, lng: 103.5333 },
    contact: { ...PLACEHOLDER_CONTACT },
    priceRange: 2,
    rating: { value: 4.1, count: 47, source: 'editorial' },
    facilities: ['Free parking', 'Toilets', 'Guided tours', 'Family friendly'],
    tags: ['farm', 'paddy', 'eco', 'photography'],
    hiddenGem: true,
  }),

  defineListing(TOWN, {
    directory: 'attractions',
    categorySlugs: ['heritage', 'viewpoints'],
    title: 'Kluang Town Centre Heritage Walk',
    summary:
      'A self-guided loop through the pre-war shophouse blocks between the station, the padang and the old market.',
    body: `Kluang’s town centre has not been redeveloped as hard as most Johor towns of its size, which means the shophouse grid around Jalan Station and Jalan Mersing is largely intact.

Start at the railway station, walk up past the coffee shops on Jalan Station, cut across to the old market for the morning trade, and loop back along the row of two-storey shophouses with their original tiled five-foot ways. The whole circuit is about 2 km and takes an hour at a browsing pace.

Go between 7am and 10am. The light is better, the market is alive, and the kopitiams are at their best.`,
    featuredImage: img('tile-heritage', 'Row of pre-war shophouses in Kluang town centre'),
    address: 'Jalan Station, 86000 Kluang, Johor',
    area: 'Kluang Town',
    coordinates: { lat: 2.0311, lng: 103.3202 },
    contact: {},
    priceNote: 'Free',
    facilities: ['Free entry', 'Food stalls nearby', 'Paid parking'],
    tags: ['heritage', 'walking', 'photography', 'morning'],
    hiddenGem: true,
    faqs: [
      {
        question: 'How long is the Kluang heritage walk?',
        answer: 'About 2 km as a loop, which takes roughly an hour including stops.',
      },
    ],
  }),

  defineListing(TOWN, {
    directory: 'attractions',
    categorySlugs: ['recreation', 'family'],
    title: 'Kluang Municipal Park & Padang',
    summary:
      'The town’s central green space — a jogging loop, playgrounds and the venue for most public events in Kluang.',
    body: `The padang and the adjoining municipal park are where Kluang exercises. There is a marked jogging loop, outdoor gym equipment, courts, and playgrounds that fill up in the late afternoon once the heat drops.

It is also the default venue for public events: national day gatherings, food fairs, night markets and community runs all end up here. Check the events listings before visiting on a weekend if you want either a crowd or the absence of one.`,
    featuredImage: img('tile-nature', 'Open green padang with jogging track in Kluang'),
    address: 'Jalan Bakawali, 86000 Kluang, Johor',
    area: 'Kluang Town',
    coordinates: { lat: 2.0268, lng: 103.3221 },
    openingHours: hours({
      mon: ['06:00', '22:00'],
      tue: ['06:00', '22:00'],
      wed: ['06:00', '22:00'],
      thu: ['06:00', '22:00'],
      fri: ['06:00', '22:00'],
      sat: ['06:00', '22:00'],
      sun: ['06:00', '22:00'],
    }),
    contact: {},
    priceNote: 'Free',
    facilities: ['Free parking', 'Toilets', 'Free entry', 'Family friendly', 'Wheelchair accessible'],
    tags: ['park', 'jogging', 'family', 'events'],
  }),

  defineListing(TOWN, {
    directory: 'attractions',
    categorySlugs: ['heritage'],
    title: 'Kluang Chinese Temple Row',
    summary:
      'A cluster of long-established Chinese temples on the edge of the old town, busiest around lunar new year and the ninth-month festivals.',
    body: `Kluang’s Chinese community arrived with the rubber estates, and the temples on the town’s eastern edge have been in continuous use since. They are working places of worship rather than exhibits — visitors are welcome, but dress and behave accordingly.

The best time to visit is during the lunar new year period or the ninth lunar month, when the courtyards fill with opera performances, food stalls and processions. On an ordinary weekday morning it is just quiet, smoky and worth twenty minutes.`,
    featuredImage: img('tile-heritage', 'Ornate roof of a Chinese temple'),
    address: 'Jalan Mersing, 86000 Kluang, Johor',
    area: 'Kluang Town',
    coordinates: { lat: 2.0352, lng: 103.3281 },
    contact: {},
    priceNote: 'Free',
    facilities: ['Free entry', 'Free parking', 'Toilets'],
    tags: ['heritage', 'temple', 'culture', 'festival'],
  }),
];
