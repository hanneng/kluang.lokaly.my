import Link from 'next/link';
import type { Metadata } from 'next';

import { Breadcrumbs, type Crumb } from '@/components/ui/breadcrumbs';
import { PageHeader } from '@/components/ui/section';
import { Prose } from '@/components/content/prose';
import { JsonLd } from '@/components/seo/json-ld';

import { NETWORK } from '@/config/site';
import { liveTowns } from '@/config/towns';
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
    title: 'About the {{town}} Guide',
    description:
      'Who we are, how we decide what to list, how we make money and how to tell the difference between editorial and advertising on this site.',
    path: routes.about(),
  });
}

export default async function AboutPage() {
  const town = await getTown();
  const origin = await getTownOrigin();
  const others = liveTowns().filter((entry) => entry.slug !== town.slug);

  const crumbs: Crumb[] = [
    { label: town.name, href: routes.home() },
    { label: 'About', href: routes.about() },
  ];

  /*
   * Written as Markdown rather than JSX so it reads like a document and can
   * later be lifted into the CMS without touching this file's structure.
   */
  const body = `${town.name} Guide is an independent local publication covering ${town.fullName}. We list places to eat, stay, shop and visit across the district, and write guides that put them in a sensible order.

## Why this exists

Most information about towns like ${town.name} is either five years out of date or written by someone who has never been. We live here. When we say a place opens at seven and sells out by nine, it is because we went.

## How we decide what to list

Anything in ${town.name} district can be listed, free. We add places because they are useful, not because they paid — and a free listing is not ranked below a paid one for relevance, only for placement within its category.

We prioritise, roughly in this order:

- Places people search for and cannot find good information about
- Places locals recommend unprompted
- Places that fill an obvious gap in the directory

## Verification

Every listing carries a verification status. **Verified** means a person has confirmed the address, opening hours and contact details. **Unverified** listings display a notice saying so — usually because they came from an initial import and nobody has been able to check them yet.

If you spot something wrong, [tell us](${routes.contact()}). Corrections are the single most useful thing readers send us.

## How we make money

Three ways, all of them labelled:

1. **Featured and Premium listings.** Businesses pay for placement within their category. These carry a visible badge.
2. **Sponsored articles.** Written by our editorial team, paid for by the subject, and opened with a disclosure banner.
3. **Affiliate links.** Some booking links earn us a commission at no extra cost to you. They are marked as sponsored links.

What we do not do: sell positive coverage, remove negative coverage for a fee, or publish paid content without labelling it. If a Premium listing is not very good, we say so in the write-up.

## Who writes this

A small local editorial team. Guides carry a byline; listings are maintained collectively.

## Get involved

- [Suggest a listing or send a correction](${routes.contact()})
- [Submit an event](${routes.contact()}) — community events are listed free
- [Advertise with us](${routes.advertise()})
`;

  return (
    <>
      <PageHeader
        title={`About the ${town.name} Guide`}
        description={town.editorial.tagline}
      >
        <Breadcrumbs items={crumbs} />
      </PageHeader>

      <div className="container-prose py-12">
        <Prose body={body} />

        {others.length > 0 ? (
          <section className="mt-12 border-t border-line pt-8">
            <h2 className="text-xl font-semibold">Part of the {NETWORK.name} network</h2>
            <p className="mt-2 text-ink-muted">
              We run the same guide for other Malaysian towns, each maintained locally.
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {others.map((entry) => (
                <li key={entry.slug}>
                  <a
                    href={`https://${entry.domain}`}
                    className="inline-flex rounded-full border border-line px-4 py-2 text-sm hover:bg-surface-3"
                  >
                    {entry.name}, {entry.state}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <p className="mt-10 text-sm text-ink-subtle">
          Read our{' '}
          <Link href={routes.privacy()} className="underline hover:text-brand">
            privacy policy
          </Link>{' '}
          and{' '}
          <Link href={routes.terms()} className="underline hover:text-brand">
            terms of use
          </Link>
          .
        </p>
      </div>

      <JsonLd data={breadcrumbJsonLd(crumbs, origin)} />
    </>
  );
}
