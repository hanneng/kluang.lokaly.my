import { defineArticle, img } from '../helpers';
import type { Article } from '@/types/content';

const TOWN = 'kluang';

/** Listing ids follow `${town}-${directory}-${slug}`. */
const L = {
  gunungLambak: 'kluang-attractions-gunung-lambak-recreational-park',
  gunungBelumut: 'kluang-attractions-gunung-belumut-recreational-forest',
  station: 'kluang-attractions-kluang-railway-station',
  zenxin: 'kluang-attractions-zenxin-organic-park',
  kahangFarm: 'kluang-attractions-kahang-organic-rice-eco-farm',
  heritageWalk: 'kluang-attractions-kluang-town-centre-heritage-walk',
  padang: 'kluang-attractions-kluang-municipal-park-padang',
  railCoffee: 'kluang-cafes-kluang-rail-coffee',
  lambakRoasters: 'kluang-cafes-lambak-roasters',
  bakery: 'kluang-cafes-bakery-on-jalan-duku',
  nightMarket: 'kluang-food-kluang-night-market-pasar-malam',
  bakKutTeh: 'kluang-food-kluang-bak-kut-teh-house',
  rotiBakar: 'kluang-food-kluang-roti-bakar-nasi-lemak-corner',
  seafood: 'kluang-food-kahang-road-seafood-tze-char',
  supper: 'kluang-food-jalan-station-supper-stalls',
  wantonMee: 'kluang-food-renggam-wanton-mee',
  nasiCampur: 'kluang-food-nasi-campur-kluang-town',
  railCentral: 'kluang-hotels-rail-central-hotel-kluang',
  belumutResort: 'kluang-hotels-belumut-view-resort',
  shophouseStay: 'kluang-hotels-shophouse-stay-kluang',
  lambakHomestay: 'kluang-homestays-lambak-family-homestay',
  morningMarket: 'kluang-shopping-kluang-morning-market',
  produceShop: 'kluang-shopping-kluang-coffee-local-produce-shop',
  carRental: 'kluang-businesses-kluang-car-rental',
} as const;

export const kluangArticles: Article[] = [
  /* ---------------------------------------------------------------------- */
  /* Flagship itinerary — the page most likely to rank and convert.          */
  /* ---------------------------------------------------------------------- */
  defineArticle(TOWN, {
    kind: 'itinerary',
    slug: 'weekend-itinerary',
    title: 'A Perfect Weekend in Kluang: 48-Hour Itinerary',
    summary:
      'Two days in Kluang done properly — an early climb, the best kopi in Johor, a forest river and a night market, with driving times between each stop.',
    body: `Kluang rewards an early start and punishes a lie-in. Almost everything worth doing here happens before 10am or after 6pm, with a long, hot gap in the middle that locals sensibly spend indoors.

This itinerary is built around that rhythm. It assumes you have a car — you will want one — and that you are staying somewhere in or near the town centre.

## Saturday

### 6.15am — Gunung Lambak

Start in the dark. The trailhead car park is fifteen minutes from the town centre, and the climb takes most people 60 to 90 minutes. Going up before sunrise means you beat both the heat and the weekend crowd, and the summit clearing is at its best in the first light.

Bring 1.5 litres of water per person and shoes with grip. There is nothing to buy past the trailhead.

### 8.30am — Breakfast at the railway station

Come down, drive twenty minutes, and have breakfast where Kluang has had it since 1938. Kopi-o, charcoal-grilled kaya toast, half-boiled eggs. Sit on the platform and watch a train come in.

If the queue is out the door — likely by 9am on a Saturday — the kopitiams on Jalan Station a block away are perfectly good.

### 10.00am — Heritage walk through the old town

Walk it off. The shophouse grid between the station, the old market and Jalan Mersing is largely intact, and the morning market is still trading until about 11am. Allow an hour at a browsing pace.

### 12.30pm — Lunch, then hide from the sun

Nasi campur if you want the local default, bak kut teh if you got up early enough that it still counts as brunch. Then do what everyone in Kluang does between 1pm and 4pm: go somewhere air-conditioned. A cafe, the mall, or your hotel room.

### 5.00pm — Zenxin Organic Park

The light is good again, and a farm tour is a gentle way to spend the late afternoon. Book ahead.

### 7.00pm — Night market

The pasar malam rotates by day of the week; the town-centre night is the biggest. Go hungry, bring small notes, park a few streets out.

### 10.30pm — Supper, if you have room

You probably do not. If you do, the stalls on Jalan Station run past midnight.

## Sunday

### 7.30am — Drive east to Gunung Belumut

Forty minutes on the Kahang road. Skip the summit trail unless you have a full day and have registered — the river pools near the entrance are the point. Cold, clear, granite-bottomed, and largely empty before 10am.

Bring everything: food, water, a towel. There are no shops.

### 11.30am — Kahang detour

The organic rice farm is on the way back if you want paddy fields and a slower stop. Otherwise drive straight through.

### 1.00pm — Seafood lunch on the Kahang road

Order for the table: steamed fish, butter prawns, kangkung belacan. It is cheaper per head out here than in town and considerably better.

### 3.00pm — Coffee and something to take home

Back in town: a flat white if you need one, then a stop for vacuum-packed coffee and kaya. Both survive a flight.

### 4.30pm — Drive home

Kluang to Johor Bahru is about two hours. To Kuala Lumpur, closer to three and a half. Leave before the Sunday evening traffic builds on the highway.

## Practical notes

**Getting here.** Kluang is on the KTM West Coast line, which is the pleasant way to arrive and the impractical way to get around once you have. If you come by train, arrange a rental car in town.

**Where to stay.** Town centre if you want to walk to breakfast; out towards Kahang if you would rather wake up somewhere green.

**When to go.** Any time of year works. The wetter months make the trails slippery and the river unsafe after upstream rain — check before you commit to Belumut.`,
    featuredImage: img('tile-guide', 'Morning mist over the hills outside Kluang'),
    gallery: [img('tile-nature', 'Sunrise from the Gunung Lambak summit clearing')],
    tags: ['itinerary', 'weekend', 'first visit', '48 hours'],
    relatedListingIds: [
      L.gunungLambak,
      L.railCoffee,
      L.heritageWalk,
      L.zenxin,
      L.nightMarket,
      L.gunungBelumut,
      L.seafood,
      L.produceShop,
      L.railCentral,
    ],
    faqs: [
      {
        question: 'Is one day enough for Kluang?',
        answer:
          'One day covers Gunung Lambak, the railway station kopitiam, the old town and a night market. Two days lets you add Gunung Belumut and the eastern side of the district, which is where the landscape gets interesting.',
      },
      {
        question: 'Do I need a car in Kluang?',
        answer:
          'For the town centre, no. For Gunung Belumut, Kahang, Renggam or the seafood restaurants, yes — e-hailing coverage outside the town is unreliable.',
      },
      {
        question: 'What is the best time of year to visit Kluang?',
        answer:
          'Kluang is fine year-round. The main seasonal factor is rain: wet weather makes the hill trails slippery and the Belumut river unsafe, so check the forecast if either is central to your plan.',
      },
    ],
    seo: {
      metaTitle: 'A Perfect Weekend in Kluang — 48-Hour Itinerary',
      metaDescription:
        'A tested two-day Kluang itinerary: Gunung Lambak at sunrise, kopi at the railway station, Gunung Belumut river pools, night markets and where to eat between them.',
    },
  }),

  /* ---------------------------------------------------------------------- */
  defineArticle(TOWN, {
    kind: 'guide',
    slug: 'hidden-gems',
    title: '9 Hidden Gems in Kluang Most Visitors Drive Straight Past',
    summary:
      'The river pools, the supper stalls, the wanton mee twenty minutes south — the parts of Kluang that never make it onto a day-trip list.',
    body: `Kluang gets treated as a fuel stop between Johor Bahru and the east coast. That is a reasonable use of the town if you have two hours. It is a poor one if you have a day.

These are the places that reward staying.

## 1. The river pools at Gunung Belumut

Everyone who has heard of Belumut thinks of the summit trail, which is a serious full-day climb requiring registration. Almost nobody mentions the river near the entrance: a chain of clear granite pools, cold enough to be a genuine shock, with sheltered huts alongside. Arrive before 10am and you will likely have it to yourself.

## 2. Renggam wanton mee

Twenty minutes south-west, in a town most people have no reason to visit. Dry noodles, dark sauce, thin-sliced char siew, wantons in a separate bowl. There is effectively no signage — look for the corner shop with a queue outside it at 8am.

## 3. The supper stalls on Jalan Station

Kluang shuts early, with one exception. After 11pm the stalls along Jalan Station spread onto the pavement and keep frying until three or four in the morning.

## 4. The morning market before 8am

Not a tourist attraction and better for it. Fish landed overnight, vegetables by the crate, and a ring of breakfast stalls around the edge. By 10am it is over.

## 5. The pre-war shophouse blocks

Kluang has not been redeveloped as aggressively as most Johor towns its size, which means the five-foot ways and tiled shopfronts between the station and the old market are largely original. An hour on foot, best between 7am and 10am.

## 6. The Kahang paddy fields

Thirty-five kilometres east, on the Mersing road. Paddy is not what most people associate with Johor, and the fields change completely across the planting cycle. Worth the detour if you are heading to Belumut anyway.

## 7. A shophouse hotel instead of a chain room

There are six rooms inside a restored pre-war shophouse a block from the old market. No lift, no restaurant, morning noise from the street — and considerably more character than the alternatives.

## 8. The bakery that sells out by three

Sourdough and laminated pastries from a small operation with four stools and no interest in expanding. Get there at 10am.

## 9. Kampung Renggam, in fruit season

A raised timber house on family land, surrounded by rambutan and durian trees. Between roughly June and August the whole area smells like fruit and the roadside stalls multiply.

---

None of these need a booking, a guide or a ticket. Most need you to be awake earlier than you would like.`,
    featuredImage: img('tile-guide', 'Quiet river pool surrounded by forest'),
    tags: ['hidden gems', 'local knowledge', 'off the beaten track'],
    relatedListingIds: [
      L.gunungBelumut,
      L.wantonMee,
      L.supper,
      L.morningMarket,
      L.heritageWalk,
      L.kahangFarm,
      L.shophouseStay,
      L.bakery,
    ],
    faqs: [
      {
        question: 'What is Kluang famous for?',
        answer:
          'Kluang is best known for Kluang Rail Coffee at the railway station, and for Gunung Lambak — the hill that dominates the town. The name itself comes from "keluang", the old Malay word for flying fox.',
      },
    ],
    seo: {
      metaTitle: '9 Hidden Gems in Kluang — Places Visitors Miss',
      metaDescription:
        'Beyond Gunung Lambak and the railway kopitiam: river pools, supper stalls, morning markets and the parts of Kluang district that reward staying a full day.',
    },
  }),

  /* ---------------------------------------------------------------------- */
  defineArticle(TOWN, {
    kind: 'guide',
    slug: 'one-day-in-kluang',
    title: 'One Day in Kluang: What to Do If You Only Have 24 Hours',
    summary:
      'The compressed version — hill at dawn, kopi at eight, old town by ten, night market by seven.',
    body: `If Kluang is a stop rather than a destination, this is the order to do it in.

## Before 7am — Gunung Lambak

Non-negotiable if the weather allows. Sixty to ninety minutes up, forty-five down. Start in the dark.

## 8.30am — The railway station

Kopi, kaya toast, half-boiled eggs, on a platform that has looked much the same since the 1930s. This is the single most Kluang thing you can do.

## 10am — The old town on foot

Two kilometres, an hour, largely intact pre-war shophouses and a market that is still trading.

## Midday to 4pm — Wait it out

Eat properly, then find air-conditioning. This is not laziness; it is how the town operates.

## 5pm — Pick one

A farm tour east of town, the padang if you want to see Kluang exercise, or a cafe if you want to sit down.

## 7pm — Night market

Wherever it is that day. Small notes, empty stomach, park a few streets out.

## After

If you are driving on to Mersing or the east coast, the Kahang road takes you straight there and the seafood restaurants along it are worth the stop.`,
    featuredImage: img('tile-guide', 'Kluang town street in the early morning'),
    tags: ['itinerary', 'day trip', 'first visit'],
    relatedListingIds: [L.gunungLambak, L.railCoffee, L.heritageWalk, L.nightMarket, L.seafood, L.padang],
    faqs: [
      {
        question: 'How far is Kluang from Johor Bahru?',
        answer: 'Roughly 100 km, or about two hours by road depending on traffic and route.',
      },
      {
        question: 'Can you visit Kluang as a day trip from Johor Bahru?',
        answer:
          'Yes, comfortably — if you leave early. A 5am departure gets you to the Gunung Lambak trailhead in time to climb before the heat.',
      },
    ],
  }),

  /* ---------------------------------------------------------------------- */
  defineArticle(TOWN, {
    kind: 'guide',
    slug: 'where-to-eat-in-kluang',
    title: 'Where to Eat in Kluang: A Local’s Order of Operations',
    summary:
      'Breakfast before nine, lunch before one, supper after eleven. What to order at each, and why timing matters more than choice.',
    body: `Kluang's food is not hard to find. It is, however, easy to miss by turning up at the wrong hour.

Most of the best things here are made in a fixed quantity each morning and sold until they run out. There is no second sitting.

## Breakfast — before 9am

This is Kluang's strongest meal by a distance.

**Kopi and charcoal toast** at the railway station. Order kopi-o kosong if you want to taste what the roast actually does, kopi peng if you want to survive the walk back to the car.

**Bak kut teh**, Johor-style — darker and more herbal than the Klang version. Shops open at 7am and stop when the pot is empty, which on a Saturday can mean before 8.30.

**Roti bakar and nasi lemak** from the corner stalls, where the bread goes over charcoal rather than into a toaster. That is the whole difference and it is not subtle.

## Lunch — before 1pm

**Nasi campur** is the default. Twenty-odd dishes under glass, priced by what lands on the plate. Get there before 1pm or you are choosing from what nobody wanted.

**Banana leaf rice** runs at lunch, with the usual unlimited refills.

## Dinner — from 6pm

**Night market**, if it is on. The stalls worth queueing for are the ones with a queue.

**Tze char on the Kahang road**, if there are four or more of you. Order for the table, not for yourself.

## Supper — after 11pm

**Jalan Station.** Fried noodles, hor fun, porridge, plastic stools. Open until three or four.

## The one worth driving for

Renggam wanton mee, twenty minutes south-west. Not better than everything in Kluang town, but different enough to justify the petrol, and the kind of place that only exists because its regulars keep it alive.`,
    featuredImage: img('tile-food', 'Hawker dishes laid out on a table'),
    tags: ['food guide', 'where to eat', 'local food'],
    relatedListingIds: [
      L.railCoffee,
      L.bakKutTeh,
      L.rotiBakar,
      L.nasiCampur,
      L.nightMarket,
      L.seafood,
      L.supper,
      L.wantonMee,
    ],
    faqs: [
      {
        question: 'What food is Kluang known for?',
        answer:
          'Coffee above all — Kluang Rail Coffee has operated at the railway station since 1938. Beyond that: Johor-style bak kut teh, charcoal-grilled kaya toast and the rotating night markets.',
      },
      {
        question: 'Is there halal food in Kluang?',
        answer:
          'Plenty. Nasi campur, mamak and the roti bakar stalls are halal, and the night markets have halal and non-halal stalls trading side by side, generally labelled.',
      },
    ],
    seo: {
      metaTitle: 'Where to Eat in Kluang — Best Food, Timed Properly',
      metaDescription:
        'A local guide to eating in Kluang: what to order for breakfast, lunch, dinner and supper, which places sell out early, and the one dish worth a twenty-minute drive.',
    },
  }),

  /* ---------------------------------------------------------------------- */
  defineArticle(TOWN, {
    kind: 'guide',
    slug: 'getting-to-kluang',
    title: 'Getting to Kluang: Train, Bus and the Drive from KL or JB',
    summary:
      'Kluang sits almost exactly in the middle of Johor. Here is what each way of arriving actually costs you in time.',
    body: `## By train

Kluang is on the KTM West Coast line, and the station is in the middle of town — a rare thing in Malaysia.

Roughly two hours from JB Sentral and around five from KL Sentral, depending on service. The train is the pleasant option and it drops you within walking distance of breakfast.

The catch: once you are here, public transport around the district is thin. If your plan includes Gunung Belumut, Kahang or Renggam, arrange a rental car.

## By car

- **From Johor Bahru:** about 100 km, roughly two hours.
- **From Kuala Lumpur:** about 300 km, three and a half to four hours.
- **From Melaka:** about 150 km, two hours.
- **From Mersing and the east coast:** about 100 km on the Kahang road, ninety minutes.

Driving is the practical choice for anyone planning to leave the town centre.

## By bus

Express coaches connect Kluang to JB, KL and Singapore. The terminal is a short ride from the centre. Cheapest option, least flexible.

## Getting around once you are here

The town centre is walkable — station, market, old shophouses and most of the good breakfast are inside a two-kilometre loop.

Everything else is not. E-hailing works in town and becomes unreliable outside it. For the forest reserves and the eastern half of the district, you want your own vehicle.`,
    featuredImage: img('tile-heritage', 'Train arriving at a small Malaysian railway station'),
    tags: ['transport', 'planning', 'how to get there'],
    relatedListingIds: [L.station, L.carRental, L.railCentral],
    faqs: [
      {
        question: 'How do I get from Kuala Lumpur to Kluang?',
        answer:
          'By car it is roughly 300 km and three and a half to four hours. By train, KTM services from KL Sentral take around five hours and stop in the centre of Kluang.',
      },
      {
        question: 'Is there a train station in Kluang?',
        answer:
          'Yes. Kluang Railway Station is on the KTM West Coast line, in the town centre, and is an attraction in its own right.',
      },
      {
        question: 'Do I need to rent a car in Kluang?',
        answer:
          'Only if you plan to leave the town centre — which most visitors do, since the forest reserves and the Kahang road restaurants are the main draws.',
      },
    ],
  }),

  /* ---------------------------------------------------------------------- */
  defineArticle(TOWN, {
    kind: 'guide',
    slug: 'hiking-in-kluang',
    title: 'Hiking in Kluang: Gunung Lambak vs Gunung Belumut',
    summary:
      'One is a 90-minute morning workout you can do before breakfast. The other is a full day with a ranger register. Choosing between them.',
    body: `Kluang has two hills worth climbing and they demand completely different things from you.

## Gunung Lambak — the morning one

**Height:** around 510 m. **Time:** 60–90 minutes up, 45 down. **Difficulty:** steep rather than long.

This is the one locals do before work. The trail starts behind the recreational park, climbs hard, and finishes at a summit clearing. Ropes and steps cover the worst sections, but wet granite is genuinely slippery and the descent punishes knees more than the climb punishes lungs.

Facilities at the base are good: parking, toilets, a surau, a stream with a small waterfall, and stalls selling breakfast to people coming down.

**Do it if:** you have a morning, reasonable fitness and shoes with grip.

## Gunung Belumut — the full day

**Height:** just over 1,000 m. **Time:** a full day. **Difficulty:** genuine.

Inside the forest reserve, 40 minutes east of town. The summit trail requires registration at the ranger post and is not something to attempt casually or late in the day.

Most visitors never climb it. They stop at the river near the entrance — granite pools, small cascades, sheltered huts and barbecue pits — which is an excellent destination on its own.

**Do it if:** you have a full day, a group, and have registered. **Otherwise:** go for the river.

## Practical notes for both

- Start early. The heat is the main hazard, not the terrain.
- Carry more water than feels necessary — 1.5 litres minimum per person.
- Avoid both after heavy rain. Trails turn to mud and river levels rise fast.
- Mobile coverage is patchy at Belumut. Tell someone your plan.`,
    featuredImage: img('tile-nature', 'Steep forest trail with rope handline'),
    tags: ['hiking', 'outdoors', 'gunung lambak', 'gunung belumut'],
    relatedListingIds: [L.gunungLambak, L.gunungBelumut, L.lambakHomestay, L.belumutResort],
    faqs: [
      {
        question: 'Which is harder, Gunung Lambak or Gunung Belumut?',
        answer:
          'Gunung Belumut, by a wide margin. Lambak is a steep 90-minute climb; Belumut is a full-day expedition requiring registration at the ranger post.',
      },
      {
        question: 'Can beginners climb Gunung Lambak?',
        answer:
          'Yes. It is short, well used and has ropes on the steepest sections. Start early, take breaks and avoid it in wet weather.',
      },
    ],
  }),

  /* ---------------------------------------------------------------------- */
  /* Blog                                                                    */
  /* ---------------------------------------------------------------------- */
  defineArticle(TOWN, {
    kind: 'blog',
    slug: 'why-kluang-is-named-after-bats',
    title: 'Why Kluang Is Named After Bats',
    summary:
      'The town’s name comes from "keluang", the old Malay word for flying fox — and the municipal emblem has never let anyone forget it.',
    body: `Ask why the town is called Kluang and you will get the same answer everywhere: keluang, the old Malay word for flying fox.

The large fruit bats that give the town its name were once common across the lowland forest and orchards of central Johor. They are big — wingspans over a metre — and they roost communally, which makes a colony hard to miss and easy to name a place after.

The municipal council took the obvious step and put a bat on its emblem, which means Kluang is one of the few Malaysian towns whose official heraldry features a mammal most people find unsettling.

## Are there still flying foxes in Kluang?

Fewer. Habitat loss across the district has pushed the colonies back towards the remaining forest reserve, and they are no longer the everyday sight they were within living memory. Around the fringes of Gunung Belumut and the less-developed parts of the district, they persist.

Dusk is when you would see them, in loose formation, heading out to feed.

## The other explanation

There is a competing story that the name refers to the shape of the surrounding hills rather than the animals. It is less well supported and considerably less fun, and the council emblem has effectively settled the argument.`,
    featuredImage: img('tile-heritage', 'Silhouettes of fruit bats at dusk'),
    tags: ['history', 'local culture', 'name origin'],
    relatedListingIds: [L.gunungBelumut, L.heritageWalk],
    faqs: [
      {
        question: 'What does "Kluang" mean?',
        answer:
          'It derives from "keluang", the old Malay word for the flying fox — the large fruit bat once common in the district. The town’s emblem features one.',
      },
    ],
  }),

  defineArticle(TOWN, {
    kind: 'blog',
    slug: 'kluang-coffee-explained',
    title: 'What Makes Kluang Coffee Different',
    summary:
      'Margarine, sugar and a very hot drum. Why traditional Malaysian kopi tastes nothing like the beans in your supermarket.',
    body: `The coffee at Kluang's railway station is not specialty coffee and does not want to be. It is kopi, which is a different drink made by a different process for a different purpose.

## The roast

Traditional Malaysian kopi beans are roasted with margarine and sugar in the drum. The sugar caramelises and then burns, coating the bean and producing the dark, slightly bitter, faintly smoky character that defines the style. Modern specialty roasting does the opposite — it works hard to avoid exactly this.

Neither is wrong. They are aiming at different things.

## The brew

Ground fine, packed into a cloth filter — the "sock" — and repeatedly flushed with boiling water. The result is thick, strong and holds up against condensed milk, which is the point.

## Ordering it

- **Kopi** — with condensed milk.
- **Kopi-o** — black, with sugar.
- **Kopi-o kosong** — black, no sugar. This is where you taste the roast.
- **Kopi peng** — iced.
- **Kopi-c** — with evaporated milk instead of condensed.

If you want to know what a Kluang roast actually tastes like, order kopi-o kosong once. Then order it however you like it.

## Taking some home

Vacuum-packed ground coffee is sold in the shops near the station and survives a flight. Buy the roast grade the shop recommends rather than the one with the best packaging.`,
    featuredImage: img('tile-cafe', 'Coffee being brewed through a traditional cloth filter'),
    tags: ['coffee', 'food culture', 'kopitiam'],
    relatedListingIds: [L.railCoffee, L.produceShop, L.lambakRoasters],
    faqs: [
      {
        question: 'What is kopi-o kosong?',
        answer: 'Black coffee with no sugar and no milk — the way to taste what a traditional Malaysian roast actually does.',
      },
      {
        question: 'Can I buy Kluang coffee to take home?',
        answer:
          'Yes. Vacuum-packed ground coffee is widely sold near the railway station and travels well.',
      },
    ],
  }),

  /* ---------------------------------------------------------------------- */
  /* Sponsored — disclosure is rendered automatically from the sponsor field */
  /* ---------------------------------------------------------------------- */
  defineArticle(TOWN, {
    kind: 'sponsored',
    slug: 'a-weekend-at-belumut-view-resort',
    title: 'A Weekend at Belumut View Resort',
    summary:
      'What it is like to base yourself twenty minutes outside Kluang, with the forest reserve on your doorstep.',
    body: `> This article is sponsored by Belumut View Resort. Our editorial team wrote it after visiting; the resort reviewed it for factual accuracy only.

Staying in Kluang town makes sense if your weekend is about breakfast and the old shophouses. It makes considerably less sense if the reason you came is the forest.

Belumut View sits twenty minutes east on the Kahang road, which puts the reserve entrance within a short drive and makes a 7am start at the river genuinely achievable rather than theoretically possible.

## The rooms

Split between a main block and standalone chalets. The chalets are the reason to book — more space, a verandah, and enough separation that a group is not negotiating over one bathroom.

## The grounds

Enough land that children can be released without anyone watching for traffic. There is a pool, which after a morning on a trail is not a luxury.

## The trade-off

You are twenty minutes from dinner options in town, and the on-site restaurant is the practical choice most evenings. If your weekend is food-led, stay in the centre instead.

## Who it suits

Families, hiking groups, and anyone whose plan involves Gunung Belumut at an hour when the river is still empty.`,
    featuredImage: img('tile-hotel', 'Resort chalet verandah looking onto trees'),
    sponsor: {
      name: 'Belumut View Resort',
      url: 'https://example.com',
    },
    tags: ['sponsored', 'where to stay', 'family'],
    relatedListingIds: [L.belumutResort, L.gunungBelumut, L.kahangFarm],
  }),
];
