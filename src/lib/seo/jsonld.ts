/**
 * JSON-LD builders.
 *
 * Rules applied throughout:
 *  - `aggregateRating` is only emitted for ratings sourced from real reviews.
 *    Our editorial scores are not review aggregates and marking them up as such
 *    would be misrepresentation (and a manual-action risk).
 *  - Unverified listings omit `telephone`, `openingHoursSpecification` and
 *    `priceRange`, because we do not yet stand behind those values.
 *  - Sponsored articles declare their sponsor via `sponsor` and `isAccessibleForFree`.
 */

import { DIRECTORY_TYPES } from '@/config/directories';
import { NETWORK } from '@/config/site';
import { SCHEMA_DAYS, WEEKDAYS } from '@/lib/datetime';
import { markdownToText } from '@/lib/markdown';
import { truncate } from '@/lib/utils';
import type { Crumb } from '@/components/ui/breadcrumbs';
import type { Article, Listing, TownEvent } from '@/types/content';
import type { TownConfig } from '@/types/town';

type Json = Record<string, unknown>;

const abs = (origin: string, path: string): string =>
  path.startsWith('http') ? path : `${origin}${path.startsWith('/') ? path : `/${path}`}`;

/* -------------------------------------------------------------------------- */
/* Site-level                                                                  */
/* -------------------------------------------------------------------------- */

export function organizationJsonLd(town: TownConfig, origin: string): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${origin}/#organization`,
    name: `${town.name} Guide`,
    alternateName: `${NETWORK.name} ${town.name}`,
    url: origin,
    logo: abs(origin, town.seo.ogImage.src),
    description: town.seo.description,
    email: town.contact.email,
    parentOrganization: {
      '@type': 'Organization',
      name: NETWORK.legalName,
      url: NETWORK.url,
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: town.fullName,
      geo: {
        '@type': 'GeoCoordinates',
        latitude: town.coordinates.lat,
        longitude: town.coordinates.lng,
      },
    },
    sameAs: Object.values(town.social).filter(Boolean),
  };
}

export function websiteJsonLd(town: TownConfig, origin: string): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${origin}/#website`,
    url: origin,
    name: `${town.name} Guide`,
    description: town.seo.description,
    inLanguage: town.locale,
    publisher: { '@id': `${origin}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${origin}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/** `Place` markup for the town itself — used on the homepage and /discover. */
export function townPlaceJsonLd(town: TownConfig, origin: string): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'City',
    '@id': `${origin}/#place`,
    name: town.name,
    address: {
      '@type': 'PostalAddress',
      addressLocality: town.name,
      addressRegion: town.state,
      addressCountry: town.countryCode,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: town.coordinates.lat,
      longitude: town.coordinates.lng,
    },
    description: town.editorial.intro,
  };
}

/* -------------------------------------------------------------------------- */
/* Navigation                                                                  */
/* -------------------------------------------------------------------------- */

export function breadcrumbJsonLd(items: Crumb[], origin: string): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: abs(origin, item.href) } : {}),
    })),
  };
}

export function itemListJsonLd(
  entries: Array<{ name: string; url: string }>,
  origin: string,
  name?: string,
): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    ...(name ? { name } : {}),
    numberOfItems: entries.length,
    itemListElement: entries.map((entry, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: entry.name,
      url: abs(origin, entry.url),
    })),
  };
}

export function faqJsonLd(faqs: Array<{ question: string; answer: string }>): Json | null {
  if (faqs.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}

/* -------------------------------------------------------------------------- */
/* Content                                                                     */
/* -------------------------------------------------------------------------- */

function openingHoursSpec(listing: Listing) {
  if (!listing.openingHours || !listing.verified) return undefined;

  const spec = WEEKDAYS.flatMap((day) => {
    const slots = listing.openingHours?.[day];
    if (!slots || slots.length === 0) return [];
    return slots.map((slot) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: `https://schema.org/${SCHEMA_DAYS[day]}`,
      opens: slot.opens,
      closes: slot.closes,
    }));
  });

  return spec.length > 0 ? spec : undefined;
}

export function listingJsonLd(listing: Listing, town: TownConfig, origin: string, url: string): Json {
  const directory = DIRECTORY_TYPES[listing.directory];

  const node: Json = {
    '@context': 'https://schema.org',
    '@type': directory.schemaType,
    '@id': `${abs(origin, url)}#${listing.directory}`,
    name: listing.title,
    description: truncate(markdownToText(listing.summary || listing.body), 300),
    url: abs(origin, url),
    image: abs(origin, listing.featuredImage.src),
    address: {
      '@type': 'PostalAddress',
      streetAddress: listing.address,
      addressLocality: listing.area ?? town.name,
      addressRegion: town.state,
      postalCode: listing.postcode,
      addressCountry: town.countryCode,
    },
    isPartOf: { '@id': `${origin}/#website` },
  };

  if (listing.coordinates) {
    node.geo = {
      '@type': 'GeoCoordinates',
      latitude: listing.coordinates.lat,
      longitude: listing.coordinates.lng,
    };
  }

  // Contact and hours are only asserted for human-verified records.
  if (listing.verified) {
    if (listing.contact.phone) node.telephone = listing.contact.phone;
    if (listing.contact.website) node.sameAs = [listing.contact.website];
    if (listing.priceRange) node.priceRange = '$'.repeat(listing.priceRange);
    const hours = openingHoursSpec(listing);
    if (hours) node.openingHoursSpecification = hours;
  }

  // Only community/third-party ratings are real aggregate ratings.
  if (listing.rating && listing.rating.source !== 'editorial' && listing.rating.count > 0) {
    node.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: listing.rating.value,
      reviewCount: listing.rating.count,
      bestRating: 5,
      worstRating: 1,
    };
  }

  if (listing.facilities.length > 0) {
    node.amenityFeature = listing.facilities.map((facility) => ({
      '@type': 'LocationFeatureSpecification',
      name: facility,
      value: true,
    }));
  }

  return node;
}

export function articleJsonLd(article: Article, town: TownConfig, origin: string, url: string): Json {
  const node: Json = {
    '@context': 'https://schema.org',
    '@type': article.kind === 'blog' ? 'BlogPosting' : 'Article',
    '@id': `${abs(origin, url)}#article`,
    headline: article.title,
    description: article.summary,
    url: abs(origin, url),
    image: abs(origin, article.featuredImage.src),
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    inLanguage: town.locale,
    wordCount: markdownToText(article.body).split(/\s+/).length,
    author: {
      '@type': article.author.name.toLowerCase().includes('team') ? 'Organization' : 'Person',
      name: article.author.name,
    },
    publisher: { '@id': `${origin}/#organization` },
    mainEntityOfPage: { '@type': 'WebPage', '@id': abs(origin, url) },
    about: { '@id': `${origin}/#place` },
    keywords: article.tags.join(', '),
  };

  if (article.sponsor) {
    node.sponsor = {
      '@type': 'Organization',
      name: article.sponsor.name,
      ...(article.sponsor.url ? { url: article.sponsor.url } : {}),
    };
  }

  return node;
}

export function eventJsonLd(event: TownEvent, town: TownConfig, origin: string, url: string): Json {
  const node: Json = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    '@id': `${abs(origin, url)}#event`,
    name: event.title,
    description: event.summary,
    url: abs(origin, url),
    image: abs(origin, event.featuredImage.src),
    startDate: event.startsAt,
    ...(event.endsAt ? { endDate: event.endsAt } : {}),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: event.venueName,
      address: {
        '@type': 'PostalAddress',
        streetAddress: event.address,
        addressLocality: town.name,
        addressRegion: town.state,
        addressCountry: town.countryCode,
      },
      ...(event.coordinates
        ? {
            geo: {
              '@type': 'GeoCoordinates',
              latitude: event.coordinates.lat,
              longitude: event.coordinates.lng,
            },
          }
        : {}),
    },
  };

  if (event.organiser) {
    node.organizer = { '@type': 'Organization', name: event.organiser };
  }

  if (event.ticketUrl) {
    node.offers = {
      '@type': 'Offer',
      url: event.ticketUrl,
      availability: 'https://schema.org/InStock',
      priceCurrency: 'MYR',
      ...(event.priceNote ? { description: event.priceNote } : {}),
    };
  }

  return node;
}
