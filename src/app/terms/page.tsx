import type { Metadata } from 'next';

import { Breadcrumbs, type Crumb } from '@/components/ui/breadcrumbs';
import { PageHeader } from '@/components/ui/section';
import { Prose } from '@/components/content/prose';

import { routes } from '@/lib/routes';
import { buildMetadata } from '@/lib/seo/metadata';
import { getTown } from '@/lib/town/context';

// ISR window: 24 hours.
// Must be a literal — Next statically analyses this export. Keep in sync
// with the REVALIDATE reference table in src/config/site.ts.
export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Terms of Use',
    description: 'The terms that apply to using the {{town}} Guide.',
    path: routes.terms(),
  });
}

/** NOTE: working draft — have a lawyer review before launch. See privacy/page.tsx. */
export default async function TermsPage() {
  const town = await getTown();

  const crumbs: Crumb[] = [
    { label: town.name, href: routes.home() },
    { label: 'Terms', href: routes.terms() },
  ];

  const body = `Last updated: ${new Date().toLocaleDateString('en-MY', { day: 'numeric', month: 'long', year: 'numeric' })}

## Using this site

${town.name} Guide is provided for information. By using it you accept these terms.

## Accuracy

We try hard to keep listings correct, and we mark every listing as verified or unverified so you can judge for yourself. Even so, opening hours change, businesses close and prices move. **Check before you travel**, particularly for anything time-sensitive or far out of your way.

We are not liable for loss or inconvenience arising from information on this site being out of date or incorrect. If you find an error, [tell us](${routes.contact()}) and we will fix it.

## Third-party links

We link to external websites, booking platforms and social media profiles. We do not control them and are not responsible for their content, availability or practices.

## Advertising and affiliate links

Some listings and articles are paid placements. These are always labelled — with a Featured, Premium or Sponsored badge, or a disclosure at the top of the article.

Some outbound links are affiliate links, meaning we may earn a commission if you book or buy. This never changes the price you pay, and it does not determine whether we recommend something.

## Content and copyright

The text, photographs and design on this site belong to us or are used with permission, and may not be reproduced commercially without written consent. You are welcome to quote a short extract with a link back.

Business names, logos and trade marks belong to their respective owners.

## Listings

We decide what to list and how to describe it. Being listed is not an endorsement, and we do not remove accurate information at a business's request. If you are the owner of a listed business and something is factually wrong, [contact us](${routes.contact()}) with the correction.

## Submissions

If you send us a photograph, correction or event listing, you confirm you have the right to do so and grant us permission to publish it on this site.

## Availability

We do not guarantee uninterrupted access to this site.

## Governing law

These terms are governed by the laws of Malaysia.

## Contact

[${town.contact.email}](mailto:${town.contact.email})
`;

  return (
    <>
      <PageHeader title="Terms of Use">
        <Breadcrumbs items={crumbs} />
      </PageHeader>
      <div className="container-prose py-12">
        <Prose body={body} />
      </div>
    </>
  );
}
