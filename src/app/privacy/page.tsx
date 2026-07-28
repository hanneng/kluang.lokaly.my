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
    title: 'Privacy Policy',
    description: 'How the {{town}} Guide collects, uses and stores personal data.',
    path: routes.privacy(),
  });
}

/**
 * NOTE FOR THE OPERATOR
 * ---------------------
 * This is a working draft, not legal advice. Before launch, have it reviewed
 * against Malaysia's Personal Data Protection Act 2010 (PDPA) — in particular
 * the notice-and-choice principle, which requires a bilingual (Bahasa Malaysia
 * and English) notice — and against GDPR if you expect EU visitors.
 */
export default async function PrivacyPage() {
  const town = await getTown();

  const crumbs: Crumb[] = [
    { label: town.name, href: routes.home() },
    { label: 'Privacy', href: routes.privacy() },
  ];

  const body = `Last updated: ${new Date().toLocaleDateString('en-MY', { day: 'numeric', month: 'long', year: 'numeric' })}

This policy explains what personal data ${town.name} Guide collects, why, and what we do with it.

## What we collect

**Information you give us.** If you subscribe to our newsletter we store your email address. If you submit an enquiry through a form, we store your name, email address, and any phone number, business name and message you provide.

**Information collected automatically.** We use Google Analytics to understand which pages are read and how people arrive. This collects usage data such as pages viewed, approximate location derived from IP address, device type and referring site. IP addresses are anonymised.

We do not collect payment details on this site.

## Why we use it

- To send the newsletter you asked for
- To reply to your enquiry
- To understand which parts of the site are useful, so we can write more of what works

## Legal basis

We rely on your consent for the newsletter and analytics, and on legitimate interest for replying to enquiries you initiate.

## How long we keep it

Newsletter subscriptions are kept until you unsubscribe. Enquiries are kept for two years. Analytics data is retained according to Google's settings, currently 14 months.

## Who we share it with

We do not sell personal data. We share it only with the service providers that operate this site — our hosting provider, our database provider and Google Analytics — and only to the extent needed to run the service.

If you contact a business through a link on this site, that interaction is between you and them, and their own privacy policy applies.

## Cookies

We use cookies for two things: remembering your light or dark theme preference, and Google Analytics measurement. You can block cookies in your browser; the site will continue to work.

## Your rights

You can ask us to provide a copy of your data, correct it, or delete it. Email [${town.contact.email}](mailto:${town.contact.email}) and we will respond within 21 days.

To unsubscribe from the newsletter, use the link at the foot of any issue.

## Children

This site is not directed at children under 13 and we do not knowingly collect their data.

## Changes

If we change this policy we will update the date at the top of this page.

## Contact

Questions about this policy: [${town.contact.email}](mailto:${town.contact.email})
`;

  return (
    <>
      <PageHeader title="Privacy Policy">
        <Breadcrumbs items={crumbs} />
      </PageHeader>
      <div className="container-prose py-12">
        <Prose body={body} />
      </div>
    </>
  );
}
