/**
 * Directory type registry.
 *
 * Every directory (hotels, food, attractions…) is described here as *data*, not
 * code. Routes, navigation, filters, JSON-LD types, nearby rails and SEO copy
 * are all derived from this file, which is why `/[directory]` can serve seven
 * different experiences from a single route handler.
 *
 * Copy uses `{{town}}` / `{{state}}` tokens rather than functions so the whole
 * registry stays JSON-serialisable — it can move into Postgres later without a
 * rewrite. Render it with `renderTemplate()` from `@/lib/template`.
 */

import type { DirectorySlug } from '@/types/content';
import type { ListingSort } from '@/types/query';
import type { FeatureFlag } from '@/types/town';

export type FacetId =
  | 'q'
  | 'category'
  | 'area'
  | 'price'
  | 'rating'
  | 'facilities'
  | 'featured'
  | 'hiddenGem';

export type NavGroupId = 'discover' | 'eat' | 'stay' | 'do' | 'read' | 'business';

export interface DirectoryCategorySeed {
  slug: string;
  name: string;
  description: string;
}

export interface DirectoryTypeConfig {
  slug: DirectorySlug;
  /** Route segment. Always `/${slug}` today, kept explicit for future aliases. */
  path: string;
  /** Plural label used in navigation and headings. */
  label: string;
  /** Singular label used in breadcrumbs and detail pages. */
  singular: string;
  navGroup: NavGroupId;
  /** lucide-react icon name; resolved by `@/components/ui/icon`. */
  icon: string;
  /** schema.org type emitted in the detail page JSON-LD. */
  schemaType: string;
  /** H1 on the index page. */
  headline: string;
  /** Lede paragraph under the H1 — unique, indexable copy per directory. */
  intro: string;
  seoTitle: string;
  seoDescription: string;
  facets: FacetId[];
  /** Renders the "Book Now" primary CTA when the listing has a booking URL. */
  bookingCta: boolean;
  /** "Nearby …" rails on the detail page, rendered in this order. */
  nearby: DirectorySlug[];
  /** Controlled vocabulary for the facilities filter and admin form. */
  facilityOptions: string[];
  /** Hides the whole directory when the town has the flag switched off. */
  featureFlag?: FeatureFlag;
  defaultSort: ListingSort;
  /** Default categories created for a new town. */
  categories: DirectoryCategorySeed[];
}

export const DIRECTORY_TYPES: Record<DirectorySlug, DirectoryTypeConfig> = {
  attractions: {
    slug: 'attractions',
    path: '/attractions',
    label: 'Attractions',
    singular: 'Attraction',
    navGroup: 'do',
    icon: 'MapPin',
    schemaType: 'TouristAttraction',
    headline: 'Top Attractions in {{town}}',
    intro:
      'From hilltop trails to heritage streets, these are the places that make {{town}} worth the drive. Every entry is mapped, with opening hours and what to expect when you arrive.',
    seoTitle: 'Top Attractions in {{town}}, {{state}}',
    seoDescription:
      'Discover the best things to see in {{town}}, {{state}} — nature parks, heritage sites, viewpoints and family attractions, with maps, hours and tips.',
    facets: ['q', 'category', 'area', 'rating', 'featured', 'hiddenGem'],
    bookingCta: false,
    nearby: ['food', 'cafes', 'hotels'],
    facilityOptions: [
      'Free parking',
      'Paid parking',
      'Toilets',
      'Prayer room',
      'Wheelchair accessible',
      'Family friendly',
      'Guided tours',
      'Entrance fee',
      'Free entry',
      'Food stalls nearby',
    ],
    defaultSort: 'featured',
    categories: [
      { slug: 'nature', name: 'Nature & Parks', description: 'Hills, waterfalls, forest reserves and lakes around {{town}}.' },
      { slug: 'heritage', name: 'Heritage & Culture', description: 'Historic buildings, temples, mosques and museums in {{town}}.' },
      { slug: 'family', name: 'Family & Kids', description: 'Attractions that work with children in tow.' },
      { slug: 'viewpoints', name: 'Viewpoints & Photo Spots', description: 'The best places to watch the sun go down over {{town}}.' },
      { slug: 'agrotourism', name: 'Farms & Agrotourism', description: 'Working farms and plantations open to visitors.' },
      { slug: 'recreation', name: 'Sports & Recreation', description: 'Trails, courts, pools and places to get moving.' },
    ],
  },

  food: {
    slug: 'food',
    path: '/food',
    label: 'Food',
    singular: 'Restaurant',
    navGroup: 'eat',
    icon: 'UtensilsCrossed',
    schemaType: 'Restaurant',
    headline: 'Where to Eat in {{town}}',
    intro:
      'The hawker stalls, kopitiams and restaurants locals actually queue for. Sorted by what you are hungry for, with prices, halal status and the hours that matter.',
    seoTitle: 'Best Food in {{town}} — Where Locals Eat',
    seoDescription:
      'A local guide to the best food in {{town}}, {{state}}: hawker favourites, halal restaurants, seafood and supper spots, with prices, hours and directions.',
    facets: ['q', 'category', 'area', 'price', 'rating', 'facilities', 'featured', 'hiddenGem'],
    bookingCta: false,
    nearby: ['cafes', 'attractions', 'hotels'],
    facilityOptions: [
      'Halal',
      'Halal-certified',
      'Non-halal',
      'Vegetarian options',
      'Air-conditioned',
      'Open air',
      'Dine-in',
      'Takeaway',
      'Delivery',
      'Card payment',
      'e-Wallet',
      'Parking',
      'Family friendly',
      'Open late',
    ],
    defaultSort: 'featured',
    categories: [
      { slug: 'local-favourites', name: 'Local Favourites', description: 'The dishes {{town}} is known for.' },
      { slug: 'halal', name: 'Halal Restaurants', description: 'Halal-friendly dining across {{town}}.' },
      { slug: 'chinese', name: 'Chinese', description: 'Kopitiam classics, tze char and noodle houses.' },
      { slug: 'malay', name: 'Malay', description: 'Nasi campur, ikan bakar and kampung cooking.' },
      { slug: 'indian', name: 'Indian & Mamak', description: 'Banana leaf, roti canai and 24-hour mamak.' },
      { slug: 'seafood', name: 'Seafood', description: 'Fresh catch and river-mouth seafood restaurants.' },
      { slug: 'street-food', name: 'Street Food & Night Markets', description: 'Stalls, pasar malam and roadside legends.' },
      { slug: 'supper', name: 'Supper & Late Night', description: 'Still serving after 11pm.' },
    ],
  },

  cafes: {
    slug: 'cafes',
    path: '/cafes',
    label: 'Cafes',
    singular: 'Cafe',
    navGroup: 'eat',
    icon: 'Coffee',
    schemaType: 'CafeOrCoffeeShop',
    headline: 'Cafes & Coffee in {{town}}',
    intro:
      'Third-wave roasters, old-school kopitiams and the quiet corners with reliable Wi-Fi. Whether you want a laptop table or a proper kopi-o, start here.',
    seoTitle: 'Best Cafes in {{town}} — Coffee, Brunch & Wi-Fi',
    seoDescription:
      'Find the best cafes in {{town}}, {{state}} — specialty coffee, brunch spots, traditional kopitiams and work-friendly places with Wi-Fi and power points.',
    facets: ['q', 'category', 'area', 'price', 'rating', 'facilities', 'featured', 'hiddenGem'],
    bookingCta: false,
    nearby: ['food', 'attractions', 'shopping'],
    facilityOptions: [
      'Wi-Fi',
      'Power points',
      'Laptop friendly',
      'Air-conditioned',
      'Outdoor seating',
      'Pet friendly',
      'Halal',
      'Vegetarian options',
      'Brunch',
      'Specialty coffee',
      'Parking',
      'Card payment',
    ],
    defaultSort: 'featured',
    categories: [
      { slug: 'specialty-coffee', name: 'Specialty Coffee', description: 'Single origin, pour-over and local roasters.' },
      { slug: 'kopitiam', name: 'Traditional Kopitiam', description: 'Kopi-o, kaya toast and half-boiled eggs.' },
      { slug: 'brunch', name: 'Brunch & All-Day', description: 'Weekend brunch and all-day breakfast.' },
      { slug: 'dessert', name: 'Dessert & Bakery', description: 'Cakes, pastries and cold desserts.' },
      { slug: 'work-friendly', name: 'Work Friendly', description: 'Wi-Fi, plugs and a table you can sit at for hours.' },
    ],
  },

  hotels: {
    slug: 'hotels',
    path: '/hotels',
    label: 'Hotels',
    singular: 'Hotel',
    navGroup: 'stay',
    icon: 'BedDouble',
    schemaType: 'Hotel',
    headline: 'Hotels in {{town}}',
    intro:
      'Every hotel in {{town}} worth booking, compared on price, location and what is actually within walking distance. Rates shown are typical weeknight rates.',
    seoTitle: 'Hotels in {{town}}, {{state}} — Compare Rates & Locations',
    seoDescription:
      'Compare hotels in {{town}}, {{state}}. Budget to business hotels with facilities, room rates, maps and what to eat nearby. Book direct or through partners.',
    facets: ['q', 'category', 'area', 'price', 'rating', 'facilities', 'featured'],
    bookingCta: true,
    nearby: ['attractions', 'food', 'cafes'],
    facilityOptions: [
      'Free Wi-Fi',
      'Free parking',
      'Air-conditioning',
      'Swimming pool',
      'Gym',
      'Restaurant',
      'Breakfast included',
      '24-hour reception',
      'Lift',
      'Family rooms',
      'Prayer room',
      'Meeting rooms',
      'Airport transfer',
      'Wheelchair accessible',
    ],
    defaultSort: 'featured',
    categories: [
      { slug: 'budget', name: 'Budget Hotels', description: 'Clean, cheap and central places to sleep in {{town}}.' },
      { slug: 'business', name: 'Business Hotels', description: 'Reliable rooms with desks, Wi-Fi and meeting space.' },
      { slug: 'boutique', name: 'Boutique & Design', description: 'Smaller hotels with more character than chain rooms.' },
      { slug: 'family', name: 'Family Hotels', description: 'Family rooms, pools and space for children.' },
      { slug: 'resort', name: 'Resorts & Retreats', description: 'Out-of-town stays with grounds and greenery.' },
    ],
  },

  homestays: {
    slug: 'homestays',
    path: '/homestays',
    label: 'Homestays',
    singular: 'Homestay',
    navGroup: 'stay',
    icon: 'Home',
    schemaType: 'LodgingBusiness',
    headline: 'Homestays in {{town}}',
    intro:
      'Whole houses, kampung stays and apartments for groups and families — usually better value than a hotel once there are more than four of you.',
    seoTitle: 'Homestays in {{town}}, {{state}} — Whole Houses & Kampung Stays',
    seoDescription:
      'Book homestays in {{town}}, {{state}}. Whole-house rentals, kampung stays and family apartments with photos, capacity, facilities and direct contact.',
    facets: ['q', 'category', 'area', 'price', 'rating', 'facilities', 'featured'],
    bookingCta: true,
    nearby: ['attractions', 'food', 'shopping'],
    facilityOptions: [
      'Whole house',
      'Private room',
      'Wi-Fi',
      'Air-conditioning',
      'Kitchen',
      'Washing machine',
      'Parking',
      'BBQ area',
      'Swimming pool',
      'Pet friendly',
      'Prayer mat & kiblat',
      'Muslim friendly',
    ],
    featureFlag: 'homestays',
    defaultSort: 'featured',
    categories: [
      { slug: 'whole-house', name: 'Whole House', description: 'Book the entire place for your group.' },
      { slug: 'kampung', name: 'Kampung Stay', description: 'Village houses with a slower pace.' },
      { slug: 'apartment', name: 'Apartments', description: 'Serviced apartments and condo units.' },
      { slug: 'group', name: 'Large Groups', description: 'Ten beds and up, for family reunions and retreats.' },
    ],
  },

  shopping: {
    slug: 'shopping',
    path: '/shopping',
    label: 'Shopping',
    singular: 'Shopping Destination',
    navGroup: 'do',
    icon: 'ShoppingBag',
    schemaType: 'ShoppingCenter',
    headline: 'Shopping in {{town}}',
    intro:
      'Malls, morning markets, night markets and the specialist shops worth a detour — including where to buy something to bring home.',
    seoTitle: 'Shopping in {{town}}, {{state}} — Malls, Markets & Souvenirs',
    seoDescription:
      'Where to shop in {{town}}, {{state}}: shopping malls, wet markets, pasar malam, local produce and souvenirs, with opening hours and locations.',
    facets: ['q', 'category', 'area', 'price', 'facilities', 'featured'],
    bookingCta: false,
    nearby: ['food', 'cafes', 'attractions'],
    facilityOptions: [
      'Parking',
      'Air-conditioned',
      'Food court',
      'ATM',
      'Prayer room',
      'Toilets',
      'Wheelchair accessible',
      'Open weekends',
      'Card payment',
    ],
    defaultSort: 'featured',
    categories: [
      { slug: 'malls', name: 'Shopping Malls', description: 'Air-conditioned malls and department stores.' },
      { slug: 'markets', name: 'Markets & Pasar', description: 'Morning wet markets and weekly pasar malam.' },
      { slug: 'souvenirs', name: 'Local Produce & Souvenirs', description: 'What to buy in {{town}} and where to buy it.' },
      { slug: 'specialty', name: 'Specialty Shops', description: 'Bookshops, bakeries, hardware and everything in between.' },
    ],
  },

  businesses: {
    slug: 'businesses',
    path: '/businesses',
    label: 'Local Businesses',
    singular: 'Business',
    navGroup: 'business',
    icon: 'Store',
    schemaType: 'LocalBusiness',
    headline: 'Local Business Directory — {{town}}',
    intro:
      'The working directory for {{town}}: workshops, clinics, salons, printers, tuition centres and the services residents look up when something needs doing.',
    seoTitle: '{{town}} Business Directory — Local Services & Shops',
    seoDescription:
      'Find local businesses and services in {{town}}, {{state}} — car workshops, clinics, salons, contractors, tuition and more, with phone, WhatsApp and directions.',
    facets: ['q', 'category', 'area', 'rating', 'featured'],
    bookingCta: false,
    nearby: ['businesses', 'food', 'cafes'],
    facilityOptions: [
      'Parking',
      'Appointment required',
      'Walk-in welcome',
      'Open Sunday',
      'Card payment',
      'e-Wallet',
      'Home service',
      'Delivery',
    ],
    defaultSort: 'featured',
    categories: [
      { slug: 'automotive', name: 'Automotive', description: 'Workshops, tyres, car wash and rental.' },
      { slug: 'health', name: 'Health & Clinics', description: 'Clinics, dentists, pharmacies and wellness.' },
      { slug: 'beauty', name: 'Beauty & Wellness', description: 'Salons, barbers, spas and massage.' },
      { slug: 'home-services', name: 'Home & Renovation', description: 'Contractors, aircon, plumbing and electrical.' },
      { slug: 'education', name: 'Education & Tuition', description: 'Tuition centres, music and skills classes.' },
      { slug: 'professional', name: 'Professional Services', description: 'Accounting, legal, printing and IT.' },
      { slug: 'events-services', name: 'Events & Photography', description: 'Catering, photography and event planning.' },
    ],
  },
};

/** Stable ordering for navigation, sitemaps and `generateStaticParams`. */
export const DIRECTORY_ORDER: DirectorySlug[] = [
  'attractions',
  'food',
  'cafes',
  'hotels',
  'homestays',
  'shopping',
  'businesses',
];

export const DIRECTORY_SLUGS = new Set<string>(DIRECTORY_ORDER);

export function isDirectorySlug(value: string): value is DirectorySlug {
  return DIRECTORY_SLUGS.has(value);
}

export function getDirectory(slug: DirectorySlug): DirectoryTypeConfig {
  return DIRECTORY_TYPES[slug];
}

/** Every directory config, in navigation order. */
export function allDirectories(): DirectoryTypeConfig[] {
  return DIRECTORY_ORDER.map((slug) => DIRECTORY_TYPES[slug]);
}
