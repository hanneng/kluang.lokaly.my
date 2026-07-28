import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BarChart3, Check, MapPin, Search, Users } from 'lucide-react';

import { Breadcrumbs, type Crumb } from '@/components/ui/breadcrumbs';
import { PageHeader } from '@/components/ui/section';
import { Badge } from '@/components/ui/badge';
import { FaqSection } from '@/components/content/faq-section';
import { LeadForm } from '@/components/marketing/lead-form';
import { JsonLd } from '@/components/seo/json-ld';

import { AD_PACKAGES } from '@/config/site';
import { routes } from '@/lib/routes';
import { breadcrumbJsonLd, faqJsonLd } from '@/lib/seo/jsonld';
import { buildMetadata } from '@/lib/seo/metadata';
import { getTown, getTownOrigin } from '@/lib/town/context';
import { cn, formatMoney, whatsappLink } from '@/lib/utils';

// ISR window: 24 hours.
// Must be a literal — Next statically analyses this export. Keep in sync
// with the REVALIDATE reference table in src/config/site.ts.
export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Advertise in {{town}} — Featured & Premium Listings',
    description:
      'Reach visitors and residents planning what to do in {{town}}. Featured listings, Premium placement and sponsored articles, with transparent pricing.',
    path: routes.advertise(),
  });
}

export default async function AdvertisePage() {
  const town = await getTown();
  if (!town.features.advertise) notFound();

  const origin = await getTownOrigin();
  const { packages, salesEmail, salesWhatsapp, currency } = town.monetisation;

  const crumbs: Crumb[] = [
    { label: town.name, href: routes.home() },
    { label: 'Advertise', href: routes.advertise() },
  ];

  const audience = [
    {
      icon: Search,
      title: 'People actively deciding',
      body: `Most of our traffic arrives from searches like "where to eat in ${town.name}" or "${town.name} hotels". They are not browsing — they are choosing.`,
    },
    {
      icon: MapPin,
      title: 'Visitors and residents both',
      body: `Weekend visitors planning a trip, and residents looking up a workshop or a clinic. Different needs, same directory.`,
    },
    {
      icon: Users,
      title: 'Local, not national',
      body: `Every page is about ${town.name}. There is no wasted reach — nobody lands here by accident from another state.`,
    },
    {
      icon: BarChart3,
      title: 'Compounding, not disposable',
      body: 'A listing or article keeps ranking and keeps earning traffic. A boosted social post stops the day you stop paying.',
    },
  ];

  const faqs = [
    {
      question: 'How is a Featured listing different from a free one?',
      answer:
        'Free listings are ordered by relevance. Featured listings are pinned above them within their category, carry a labelled badge, and unlock a photo gallery plus click-to-call and WhatsApp buttons.',
    },
    {
      question: 'Are paid placements labelled?',
      answer:
        'Always. Featured, Premium and Sponsored items carry a visible badge, and sponsored articles open with a disclosure. Readers trusting what they see here is the only reason advertising here is worth anything.',
    },
    {
      question: 'Do you write the sponsored articles yourselves?',
      answer:
        'Yes. Our editorial team writes them, visits where practical, and keeps editorial control over the copy. You review for factual accuracy. We do not publish supplied advertorial as-is.',
    },
    {
      question: 'Is there a minimum term?',
      answer:
        'Featured and Premium listings are billed monthly with no minimum term. Sponsored articles are a one-off fee and the article stays published.',
    },
    {
      question: 'What happens if my details change?',
      answer:
        'Send us the update and we will make it, usually the same working day. Premium listings also get a quarterly content refresh from our editor.',
    },
    {
      question: 'Can I see how my listing is performing?',
      answer:
        'Featured and Premium listings receive a monthly summary: page views, clicks to your website, calls and WhatsApp taps.',
    },
  ];

  const price = (id: string): number | undefined =>
    id === 'featured'
      ? packages.featured
      : id === 'premium'
        ? packages.premium
        : id === 'sponsoredArticle'
          ? packages.sponsoredArticle
          : undefined;

  return (
    <>
      <PageHeader
        eyebrow="Advertise with us"
        title={`Get your business in front of ${town.name}`}
        description={`We publish the independent guide to ${town.name}. If someone is searching for what you sell, this is where they are looking.`}
      >
        <Breadcrumbs items={crumbs} />
      </PageHeader>

      {/* Why advertise */}
      <section className="container-page py-14">
        <h2 className="text-2xl font-bold sm:text-3xl">Why advertise here</h2>
        <p className="mt-3 max-w-3xl text-ink-muted">
          A local guide reaches a smaller audience than a national platform, and a much more useful
          one. Everyone reading this site has already decided they care about {town.name}.
        </p>

        <ul className="mt-8 grid gap-5 sm:grid-cols-2">
          {audience.map((item) => (
            <li
              key={item.title}
              className="rounded-[var(--radius-card)] border border-line bg-surface-2 p-6"
            >
              <span className="inline-flex size-11 items-center justify-center rounded-full bg-brand/10 text-brand">
                <item.icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Packages */}
      <section className="border-y border-line bg-surface-2 py-14" id="packages">
        <div className="container-page">
          <h2 className="text-2xl font-bold sm:text-3xl">Packages</h2>
          <p className="mt-3 max-w-3xl text-ink-muted">
            Prices in {currency}. No setup fee, no contract on the monthly packages.
          </p>

          <ul className="mt-8 grid gap-6 lg:grid-cols-3">
            {AD_PACKAGES.map((pkg) => {
              const amount = price(pkg.id);
              return (
                <li
                  key={pkg.id}
                  className={cn(
                    'relative flex flex-col rounded-[var(--radius-card)] border bg-surface p-7',
                    pkg.popular ? 'border-brand shadow-[var(--shadow-lift)]' : 'border-line',
                  )}
                >
                  {pkg.popular ? (
                    <div className="absolute -top-3 left-7">
                      <Badge tone="brand">Most popular</Badge>
                    </div>
                  ) : null}

                  <h3 className="text-xl font-bold">{pkg.name}</h3>
                  <p className="mt-1.5 text-sm text-ink-muted">{pkg.tagline}</p>

                  <p className="mt-5">
                    <span className="text-3xl font-bold">
                      {amount !== undefined ? formatMoney(amount, currency, town.locale) : '—'}
                    </span>
                    <span className="ml-1.5 text-sm text-ink-subtle">{pkg.billing}</span>
                  </p>

                  <ul className="mt-6 flex-1 space-y-2.5 text-sm">
                    {pkg.highlights.map((highlight) => (
                      <li key={highlight} className="flex gap-2.5">
                        <Check className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
                        <span className="text-ink-muted">{highlight}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#enquire"
                    className={cn(
                      'mt-7 flex h-12 items-center justify-center rounded-full font-medium transition-opacity hover:opacity-90',
                      pkg.popular
                        ? 'bg-brand text-brand-fg'
                        : 'border border-line text-ink hover:bg-surface-3',
                    )}
                  >
                    Enquire about {pkg.name}
                  </a>
                </li>
              );
            })}
          </ul>

          <p className="mt-6 text-sm text-ink-subtle">
            Free listings remain free, and always will. If you run a business in {town.name} and are
            not listed at all,{' '}
            <Link href={routes.contact()} className="text-brand underline">
              send us the details
            </Link>{' '}
            and we will add you at no cost.
          </p>
        </div>
      </section>

      {/* Enquiry form */}
      <section className="container-page py-14" id="enquire">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold sm:text-3xl">Talk to us</h2>
            <p className="mt-3 text-ink-muted">
              Tell us what you are trying to achieve and we will suggest the smallest thing that
              might work. We would rather sell you a Featured listing that pays for itself than a
              package you do not need.
            </p>

            <dl className="mt-7 space-y-4 text-sm">
              <div>
                <dt className="font-medium">Email</dt>
                <dd>
                  <a href={`mailto:${salesEmail}`} className="text-brand hover:underline">
                    {salesEmail}
                  </a>
                </dd>
              </div>
              {salesWhatsapp ? (
                <div>
                  <dt className="font-medium">WhatsApp</dt>
                  <dd>
                    <a
                      href={whatsappLink(
                        salesWhatsapp,
                        `Hi, I would like to advertise on the ${town.name} guide.`,
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand hover:underline"
                    >
                      Message us
                    </a>
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>

          <div className="lg:col-span-3">
            <LeadForm
              kind="advertise"
              submitLabel="Send enquiry"
              packages={AD_PACKAGES.map((pkg) => ({ id: pkg.id, name: pkg.name }))}
            />
          </div>
        </div>
      </section>

      <section className="container-page pb-16">
        <FaqSection faqs={faqs} title="Advertising FAQ" />
      </section>

      <JsonLd data={[breadcrumbJsonLd(crumbs, origin), faqJsonLd(faqs)]} />
    </>
  );
}
