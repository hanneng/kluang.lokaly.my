import type { Metadata } from 'next';
import { Mail, MessageCircle } from 'lucide-react';

import { Breadcrumbs, type Crumb } from '@/components/ui/breadcrumbs';
import { PageHeader } from '@/components/ui/section';
import { LeadForm } from '@/components/marketing/lead-form';
import { JsonLd } from '@/components/seo/json-ld';

import { routes } from '@/lib/routes';
import { breadcrumbJsonLd } from '@/lib/seo/jsonld';
import { buildMetadata } from '@/lib/seo/metadata';
import { getTown, getTownOrigin } from '@/lib/town/context';
import { whatsappLink } from '@/lib/utils';

// ISR window: 24 hours.
// Must be a literal — Next statically analyses this export. Keep in sync
// with the REVALIDATE reference table in src/config/site.ts.
export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Contact the {{town}} Guide',
    description:
      'Get in touch — suggest a listing, correct a detail, submit an event, or ask about advertising in {{town}}.',
    path: routes.contact(),
  });
}

export default async function ContactPage() {
  const town = await getTown();
  const origin = await getTownOrigin();

  const crumbs: Crumb[] = [
    { label: town.name, href: routes.home() },
    { label: 'Contact', href: routes.contact() },
  ];

  const reasons = [
    {
      title: 'Suggest a listing',
      body: `Know somewhere in ${town.name} we have missed? Send the name and roughly where it is — that is enough for us to go and check.`,
    },
    {
      title: 'Correct something',
      body: 'Wrong hours, changed phone number, closed down. Corrections are the most useful thing you can send us.',
    },
    {
      title: 'Submit an event',
      body: 'Community events are listed free. Send the date, venue and a line about what it is.',
    },
    {
      title: 'Advertising',
      body: 'Featured listings, Premium placement and sponsored articles.',
    },
  ];

  return (
    <>
      <PageHeader
        title={`Contact the ${town.name} Guide`}
        description="We read everything. Corrections and suggestions from people who live here are what keep this site worth using."
      >
        <Breadcrumbs items={crumbs} />
      </PageHeader>

      <div className="container-page py-14">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold">What are you getting in touch about?</h2>
            <ul className="mt-5 space-y-5">
              {reasons.map((reason) => (
                <li key={reason.title}>
                  <h3 className="font-medium">{reason.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-muted">{reason.body}</p>
                </li>
              ))}
            </ul>

            <div className="mt-8 space-y-3 border-t border-line pt-6 text-sm">
              <a
                href={`mailto:${town.contact.email}`}
                className="flex items-center gap-2.5 text-brand hover:underline"
              >
                <Mail className="size-4" aria-hidden="true" />
                {town.contact.email}
              </a>
              {town.contact.whatsapp ? (
                <a
                  href={whatsappLink(town.contact.whatsapp, `Hi, about the ${town.name} guide…`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-brand hover:underline"
                >
                  <MessageCircle className="size-4" aria-hidden="true" />
                  WhatsApp us
                </a>
              ) : null}
              {town.contact.addressLines ? (
                <address className="not-italic text-ink-muted">
                  {town.contact.addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              ) : null}
            </div>
          </div>

          <div className="lg:col-span-3">
            <LeadForm kind="contact" submitLabel="Send message" />
          </div>
        </div>
      </div>

      <JsonLd data={breadcrumbJsonLd(crumbs, origin)} />
    </>
  );
}
