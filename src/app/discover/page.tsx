import Link from 'next/link';
import type { Metadata } from 'next';

import { Breadcrumbs, type Crumb } from '@/components/ui/breadcrumbs';
import { PageHeader, Section } from '@/components/ui/section';
import { ListingRail } from '@/components/content/listing-card';
import { ArticleCard } from '@/components/content/article-card';
import { AdvertiseCta } from '@/components/marketing/advertise-cta';
import { Icon } from '@/components/ui/icon';
import { JsonLd } from '@/components/seo/json-ld';

import { allDirectories } from '@/config/directories';
import { getRepository } from '@/lib/data';
import { routes } from '@/lib/routes';
import { breadcrumbJsonLd } from '@/lib/seo/jsonld';
import { buildMetadata } from '@/lib/seo/metadata';
import { getTown, getTownOrigin } from '@/lib/town/context';

// ISR window: 24 hours.
// Must be a literal — Next statically analyses this export. Keep in sync
// with the REVALIDATE reference table in src/config/site.ts.
export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Discover {{town}} — A Local Introduction',
    description:
      'What {{town}}, {{state}} is actually like: where it is, what it is known for, the areas that make up the district and how to plan a first visit.',
    path: routes.discover(),
  });
}

export default async function DiscoverPage() {
  const town = await getTown();
  const origin = await getTownOrigin();
  const repo = getRepository();

  const [highlights, guides] = await Promise.all([
    repo.getListings({ townSlug: town.slug, featuredOnly: true, pageSize: 8 }),
    repo.getArticles({ townSlug: town.slug, kind: ['guide', 'itinerary'], pageSize: 3 }),
  ]);

  const crumbs: Crumb[] = [
    { label: town.name, href: routes.home() },
    { label: `Discover ${town.name}`, href: routes.discover() },
  ];

  const directories = allDirectories().filter(
    (directory) => !directory.featureFlag || town.features[directory.featureFlag],
  );

  return (
    <>
      <PageHeader
        eyebrow={town.fullName}
        title={`Discover ${town.name}`}
        description={town.editorial.intro}
      >
        <Breadcrumbs items={crumbs} />
      </PageHeader>

      <div className="container-page py-12">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="space-y-10 lg:col-span-2">
            <section>
              <h2 className="mb-4 text-2xl font-bold">What {town.name} is known for</h2>
              <ul className="space-y-3">
                {town.editorial.knownFor.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-accent"
                    />
                    <span className="text-ink-muted">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-bold">The areas of {town.name} district</h2>
              <p className="mb-4 text-ink-muted">
                {town.name} is bigger than the town centre. These are the areas you will see
                referenced on listings across this site — useful when working out how far apart two
                places actually are.
              </p>
              <ul className="flex flex-wrap gap-2">
                {town.editorial.areas.map((area) => (
                  <li key={area}>
                    <Link
                      href={routes.search({ q: area })}
                      className="inline-flex rounded-full border border-line px-4 py-2 text-sm hover:bg-surface-3"
                    >
                      {area}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-bold">Start browsing</h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {directories.map((directory) => (
                  <li key={directory.slug}>
                    <Link
                      href={directory.path}
                      className="flex h-full items-start gap-3 rounded-[var(--radius-card)] border border-line bg-surface-2 p-4 transition-shadow hover:shadow-[var(--shadow-soft)]"
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                        <Icon name={directory.icon} className="size-5" />
                      </span>
                      <span>
                        <span className="block font-semibold">{directory.label}</span>
                        <span className="mt-0.5 block text-sm text-ink-muted">
                          {directory.categories.length} categories
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <section className="rounded-[var(--radius-card)] border border-line bg-surface-2 p-5">
              <h2 className="mb-4 text-base font-semibold">{town.name} at a glance</h2>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-muted">State</dt>
                  <dd className="font-medium">{town.state}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-muted">Country</dt>
                  <dd className="font-medium">{town.country}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-muted">Coordinates</dt>
                  <dd className="font-medium">
                    {town.coordinates.lat.toFixed(4)}, {town.coordinates.lng.toFixed(4)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-muted">Time zone</dt>
                  <dd className="font-medium">{town.timezone.replace('_', ' ')}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-muted">Languages</dt>
                  <dd className="text-right font-medium">{town.editorial.languages.join(', ')}</dd>
                </div>
              </dl>

              {town.features.map ? (
                <Link
                  href={routes.map()}
                  className="mt-5 flex h-11 w-full items-center justify-center rounded-full bg-brand font-medium text-brand-fg hover:opacity-90"
                >
                  Open the map
                </Link>
              ) : null}
            </section>

            {guides.items[0] ? (
              <section>
                <h2 className="mb-3 text-base font-semibold">Start here</h2>
                <ArticleCard article={guides.items[0]} />
              </section>
            ) : null}
          </aside>
        </div>
      </div>

      {highlights.items.length > 0 ? (
        <Section
          title={`Highlights of ${town.name}`}
          description="Places worth building a visit around."
          href={routes.thingsToDo()}
          className="border-t border-line bg-surface-2"
        >
          <ListingRail listings={highlights.items} />
        </Section>
      ) : null}

      <AdvertiseCta town={town} />

      <JsonLd data={breadcrumbJsonLd(crumbs, origin)} />
    </>
  );
}
