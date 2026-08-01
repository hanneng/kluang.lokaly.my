import Image from 'next/image';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Check, MapPin } from 'lucide-react';

import { Breadcrumbs, type Crumb } from '@/components/ui/breadcrumbs';
import { Badge, TierBadge } from '@/components/ui/badge';
import { RatingStars } from '@/components/ui/rating';
import { Section } from '@/components/ui/section';
import { Prose } from '@/components/content/prose';
import { FaqSection } from '@/components/content/faq-section';
import { ListingCard } from '@/components/content/listing-card';
import { ContactPanel } from '@/components/listing/contact-panel';
import { Gallery } from '@/components/listing/gallery';
import { MapEmbed } from '@/components/listing/map-embed';
import { OpeningHoursPanel } from '@/components/listing/opening-hours';
import { ShareButtons } from '@/components/listing/share-buttons';
import { UnverifiedNotice } from '@/components/listing/unverified-notice';
import { AdvertiseCta } from '@/components/marketing/advertise-cta';
import { JsonLd } from '@/components/seo/json-ld';

import { DIRECTORY_TYPES, getDirectory, isDirectorySlug } from '@/config/directories';
import { getRepository } from '@/lib/data';
import { formatDistance } from '@/lib/geo';
import { markdownToText } from '@/lib/markdown';
import { routes } from '@/lib/routes';
import { breadcrumbJsonLd, faqJsonLd, listingJsonLd } from '@/lib/seo/jsonld';
import { buildMetadata } from '@/lib/seo/metadata';
import { t } from '@/lib/template';
import { getTown, getTownOrigin } from '@/lib/town/context';
import { priceBand, truncate } from '@/lib/utils';
import type { DirectorySlug } from '@/types/content';

// ISR window: 12 hours.
// Must be a literal — Next statically analyses this export. Keep in sync
// with the REVALIDATE reference table in src/config/site.ts.
export const revalidate = 43200;

interface PageProps {
  params: Promise<{ directory: string; slug: string }>;
}

/**
 * Listing detail — one template for all seven directory types.
 *
 * What differs between a hotel and a cafe (booking CTA, which "Nearby" rails
 * appear, the schema.org type) comes from the directory registry, not from
 * separate page files. Adding an eighth directory needs no new route.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { directory: directorySlug, slug } = await params;
  if (!isDirectorySlug(directorySlug)) return {};

  const town = await getTown();
  const listing = await getRepository().getListingBySlug(town.slug, directorySlug, slug);
  if (!listing) return {};

  const directory = getDirectory(directorySlug);

  return buildMetadata({
    title: listing.seo.metaTitle ?? `${listing.title} — ${directory.singular} in ${town.name}`,
    description:
      listing.seo.metaDescription ??
      truncate(listing.summary || markdownToText(listing.body), 155),
    path: routes.listing(directorySlug, slug),
    image: listing.seo.ogImage ?? listing.featuredImage,
    noindex: listing.seo.noindex,
  });
}

export default async function ListingDetailPage({ params }: PageProps) {
  const { directory: directorySlug, slug } = await params;
  if (!isDirectorySlug(directorySlug)) notFound();

  const town = await getTown();
  const directory = getDirectory(directorySlug);
  if (directory.featureFlag && !town.features[directory.featureFlag]) notFound();

  const repo = getRepository();
  const listing = await repo.getListingBySlug(town.slug, directorySlug, slug);
  if (!listing) notFound();

  const origin = await getTownOrigin();
  const path = routes.listing(directorySlug, slug);
  const canonical = `${origin}${path}`;

  /*
   * Nearby rails and related listings, resolved in parallel.
   *
   * Which directories appear as "Nearby" is configured per directory type —
   * a hotel shows attractions and food; a restaurant shows cafes and hotels.
   */
  const [nearbyGroups, related] = await Promise.all([
    listing.coordinates
      ? Promise.all(
          directory.nearby.map(async (target: DirectorySlug) => ({
            directory: DIRECTORY_TYPES[target],
            results: await repo.getNearbyListings({
              townSlug: town.slug,
              origin: listing.coordinates!,
              directory: target,
              excludeId: listing.id,
              radiusKm: 20,
              limit: 4,
            }),
          })),
        )
      : Promise.resolve([]),
    repo.getListings({
      townSlug: town.slug,
      directory: directorySlug,
      excludeId: listing.id,
      pageSize: 4,
      sort: 'featured',
    }),
  ]);

  const crumbs: Crumb[] = [
    { label: town.name, href: routes.home() },
    { label: directory.label, href: directory.path },
    { label: listing.title, href: path },
  ];

  const galleryImages =
    listing.gallery.length > 0 ? listing.gallery : [listing.featuredImage];

  return (
    <>
      {/* Hero */}
      <div className="relative">
        <div className="relative aspect-[16/9] w-full sm:aspect-[21/9]">
          <Image
            src={listing.featuredImage.src}
            alt={listing.featuredImage.alt}
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          {listing.featuredImage.credit ? (
            // Visible attribution — required for CC BY-SA imagery, courteous for CC0.
            <p className="absolute bottom-1.5 right-2.5 text-[0.65rem] leading-tight text-white/60">
              {listing.featuredImage.credit}
            </p>
          ) : null}
        </div>

        <div className="container-page relative -mt-24 sm:-mt-28">
          <div className="rounded-[var(--radius-card)] border border-line bg-surface-2 p-6 shadow-[var(--shadow-lift)] sm:p-8">
            <Breadcrumbs items={crumbs} />

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <TierBadge tier={listing.tier} />
              {listing.hiddenGem ? <Badge tone="neutral">Hidden gem</Badge> : null}
              {listing.categorySlugs.slice(0, 3).map((categorySlug) => {
                const category = directory.categories.find((entry) => entry.slug === categorySlug);
                if (!category) return null;
                return (
                  <a
                    key={categorySlug}
                    href={routes.directoryCategory(directorySlug, categorySlug)}
                    className="rounded-full border border-line px-2.5 py-1 text-xs hover:bg-surface-3"
                  >
                    {category.name}
                  </a>
                );
              })}
            </div>

            <h1 className="mt-3 text-3xl font-bold sm:text-4xl lg:text-5xl">{listing.title}</h1>

            <p className="mt-3 max-w-3xl text-lg text-ink-muted">{listing.summary}</p>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm">
              {listing.rating ? <RatingStars rating={listing.rating} /> : null}
              {listing.priceRange ? (
                <span className="font-medium">
                  {priceBand(listing.priceRange)}
                  {listing.priceNote ? (
                    <span className="ml-2 font-normal text-ink-muted">{listing.priceNote}</span>
                  ) : null}
                </span>
              ) : listing.priceNote ? (
                <span className="text-ink-muted">{listing.priceNote}</span>
              ) : null}
              {listing.area ? (
                <span className="inline-flex items-center gap-1 text-ink-muted">
                  <MapPin className="size-4" aria-hidden="true" />
                  {listing.area}
                </span>
              ) : null}
              <div className="ml-auto">
                <ShareButtons url={canonical} title={listing.title} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-page py-10">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Main column */}
          <div className="space-y-10 lg:col-span-2">
            {!listing.verified ? <UnverifiedNotice townName={town.name} /> : null}

            <section>
              <h2 className="sr-only">About {listing.title}</h2>
              <Prose body={listing.body} />
            </section>

            {listing.facilities.length > 0 ? (
              <section>
                <h2 className="mb-4 text-2xl font-bold">Facilities</h2>
                <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {listing.facilities.map((facility) => (
                    <li key={facility} className="flex items-center gap-2 text-sm">
                      <Check className="size-4 shrink-0 text-brand" aria-hidden="true" />
                      {facility}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {galleryImages.length > 1 ? (
              <section>
                <h2 className="mb-4 text-2xl font-bold">Photos</h2>
                <Gallery images={galleryImages} title={listing.title} />
              </section>
            ) : null}

            {listing.coordinates ? (
              <section>
                <h2 className="mb-4 text-2xl font-bold">Location</h2>
                <MapEmbed point={listing.coordinates} title={listing.title} />
                <p className="mt-3 text-sm text-ink-muted">{listing.address}</p>
              </section>
            ) : null}

            <FaqSection faqs={listing.faqs} />
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <ContactPanel listing={listing} />
            <OpeningHoursPanel hours={listing.openingHours} verified={listing.verified} />

            {listing.tags.length > 0 ? (
              <section className="rounded-[var(--radius-card)] border border-line bg-surface-2 p-5">
                <h2 className="mb-3 text-base font-semibold">Tags</h2>
                <ul className="flex flex-wrap gap-1.5">
                  {listing.tags.map((tag) => (
                    <li key={tag}>
                      <a
                        href={routes.search({ q: tag })}
                        className="inline-flex rounded-full bg-surface-3 px-2.5 py-1 text-xs text-ink-muted hover:text-brand"
                      >
                        {tag}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </aside>
        </div>
      </div>

      {/* Nearby rails — the internal-linking engine of the whole site. */}
      {nearbyGroups.map((group) =>
        group.results.length > 0 ? (
          <Section
            key={group.directory.slug}
            title={`Nearby ${group.directory.label}`}
            description={t(`Within a short drive of ${listing.title}.`, town)}
            href={group.directory.path}
            className="border-t border-line"
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {group.results.map(({ item, distanceKm }) => (
                <ListingCard
                  key={item.id}
                  listing={item}
                  meta={`${formatDistance(distanceKm)} away`}
                />
              ))}
            </div>
          </Section>
        ) : null,
      )}

      {related.items.length > 0 ? (
        <Section
          title={`More ${directory.label.toLowerCase()} in ${town.name}`}
          href={directory.path}
          className="bg-surface-2"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.items.map((item) => (
              <ListingCard key={item.id} listing={item} />
            ))}
          </div>
        </Section>
      ) : null}

      <AdvertiseCta town={town} />

      <JsonLd
        data={[
          listingJsonLd(listing, town, origin, path),
          breadcrumbJsonLd(crumbs, origin),
          faqJsonLd(listing.faqs),
        ]}
      />
    </>
  );
}
