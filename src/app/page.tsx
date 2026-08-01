import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';

import { Hero } from '@/components/home/hero';
import { NetworkHero } from '@/components/home/network-hero';
import { FeaturedTowns } from '@/components/home/featured-towns';
import { ValueProps } from '@/components/home/value-props';
import { PartnerSection } from '@/components/home/partner-section';
import { AdvertiseSection } from '@/components/home/advertise-section';
import { BrowseStates } from '@/components/home/browse-states';
import { ArticleCard } from '@/components/content/article-card';
import { EventRail } from '@/components/content/event-card';
import { ListingRail, ListingGrid } from '@/components/content/listing-card';
import { AdvertiseCta } from '@/components/marketing/advertise-cta';
import { NewsletterSignup } from '@/components/marketing/newsletter';
import { Section } from '@/components/ui/section';
import { Icon } from '@/components/ui/icon';

import { allDirectories } from '@/config/directories';
import { getRepository } from '@/lib/data';
import { routes } from '@/lib/routes';
import { buildMetadata } from '@/lib/seo/metadata';
import { t } from '@/lib/template';
import { getTown } from '@/lib/town/context';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const town = await getTown();
  return buildMetadata({
    title: town.seo.defaultTitle,
    description: town.seo.description,
    path: '/',
    image: town.hero,
  });
}

export default async function HomePage() {
  const town = await getTown();
  const repo = getRepository();

  if (town.slug === 'home') {
    return (
      <>
        <NetworkHero />
        <FeaturedTowns />
        <ValueProps />
        <BrowseStates />
        <PartnerSection />
        <AdvertiseSection />
        <NewsletterSignup townName="Lokaly" />
      </>
    );
  }

  const [attractions, food, hotels, events, hiddenGems, articles, featured] = await Promise.all([
    repo.getListings({ townSlug: town.slug, directory: 'attractions', pageSize: 8 }),
    repo.getListings({ townSlug: town.slug, directory: ['food', 'cafes'], pageSize: 8 }),
    repo.getListings({ townSlug: town.slug, directory: ['hotels', 'homestays'], pageSize: 8 }),
    town.features.events
      ? repo.getEvents({ townSlug: town.slug, window: 'upcoming', pageSize: 6 })
      : Promise.resolve(null),
    repo.getListings({ townSlug: town.slug, hiddenGemOnly: true, pageSize: 4 }),
    town.features.blog || town.features.guides
      ? repo.getArticles({ townSlug: town.slug, pageSize: 4 })
      : Promise.resolve(null),
    repo.getListings({ townSlug: town.slug, featuredOnly: true, pageSize: 8, sort: 'featured' }),
  ]);

  const directories = allDirectories().filter(
    (directory) => !directory.featureFlag || town.features[directory.featureFlag],
  );

  const leadArticle = articles?.items[0];
  const restArticles = articles?.items.slice(1, 4) ?? [];

  return (
    <>
      <Hero town={town} />

      <section className="border-b border-line bg-surface-2 py-8">
        <div className="container-page">
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
            {directories.map((directory) => (
              <li key={directory.slug}>
                <Link
                  href={directory.path}
                  className="flex h-full flex-col items-center gap-2 rounded-[var(--radius-card)] border border-line bg-surface px-3 py-5 text-center transition-shadow hover:shadow-[var(--shadow-soft)]"
                >
                  <span className="flex size-11 items-center justify-center rounded-full bg-brand/10 text-brand">
                    <Icon name={directory.icon} className="size-5" />
                  </span>
                  <span className="text-sm font-medium">{directory.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {attractions.items.length > 0 ? (
        <Section
          title={t('Top Attractions in {{town}}', town)}
          description={t(
            'The places worth building a day around — hills, heritage and the odd surprise.',
            town,
          )}
          href={routes.directory('attractions')}
        >
          <ListingRail listings={attractions.items} />
        </Section>
      ) : null}

      {food.items.length > 0 ? (
        <Section
          title={t('Where to Eat in {{town}}', town)}
          description="Hawker stalls, kopitiams and the restaurants locals queue for."
          href={routes.directory('food')}
          className="bg-surface-2"
        >
          <ListingRail listings={food.items} />
        </Section>
      ) : null}

      {hotels.items.length > 0 ? (
        <Section
          title={t('Where to Stay in {{town}}', town)}
          description="Hotels and homestays, compared on price and what is actually nearby."
          href={routes.directory('hotels')}
        >
          <ListingRail listings={hotels.items} />
        </Section>
      ) : null}

      {events && events.items.length > 0 ? (
        <Section
          title="Upcoming Events"
          description={t('What is on in {{town}} over the coming weeks.', town)}
          href={routes.events()}
          className="bg-surface-2"
        >
          <EventRail events={events.items} />
        </Section>
      ) : null}

      {hiddenGems.items.length > 0 ? (
        <Section
          title="Hidden Gems"
          description="The places most visitors drive straight past."
          href={routes.hiddenGems()}
        >
          <ListingGrid listings={hiddenGems.items} showDirectory priorityCount={0} />
        </Section>
      ) : null}

      {leadArticle ? (
        <Section
          title="Latest Guides & Stories"
          description={t('Long-form guides to {{town}}, written locally.', town)}
          href={routes.guides()}
          className="bg-surface-2"
        >
          <div className="grid gap-5">
            <ArticleCard article={leadArticle} variant="feature" />
            {restArticles.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {restArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            ) : null}
          </div>
        </Section>
      ) : null}

      {featured.items.length > 0 ? (
        <Section
          title="Featured Businesses"
          description="Local businesses supporting this guide."
          href={routes.directory('businesses')}
          linkLabel="Browse the directory"
        >
          <ListingRail listings={featured.items} />
          <p className="mt-4 text-xs text-ink-subtle">
            Featured and Premium listings are paid placements, and are labelled as such.{' '}
            <Link href={routes.advertise()} className="underline hover:text-brand">
              How this works
              <ArrowRight className="ml-0.5 inline size-3" aria-hidden="true" />
            </Link>
          </p>
        </Section>
      ) : null}

      {town.features.newsletter ? <NewsletterSignup townName={town.name} /> : null}

      <AdvertiseCta town={town} />
    </>
  );
}
