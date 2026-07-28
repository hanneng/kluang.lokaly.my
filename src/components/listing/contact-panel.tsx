import {
  ExternalLink,
  Facebook,
  Globe,
  Instagram,
  MapPin,
  Navigation,
  Phone,
} from 'lucide-react';
import { ExternalButtonLink } from '@/components/ui/button';
import { mapsUrl } from '@/lib/geo';
import { whatsappLink } from '@/lib/utils';
import type { Listing } from '@/types/content';

/**
 * Contact and conversion panel.
 *
 * This is the commercial heart of a listing page: the "Book Now", call and
 * WhatsApp buttons are what a Premium listing is paying for. Booking links are
 * marked `rel="sponsored"` because they are affiliate or paid placements.
 */
export function ContactPanel({ listing }: { listing: Listing }) {
  const { contact } = listing;
  const directions = contact.googleMapsUrl ?? mapsUrl(listing.coordinates, listing.title);

  const hasAnything =
    contact.bookingUrl ||
    contact.phone ||
    contact.whatsapp ||
    contact.website ||
    directions ||
    contact.facebook ||
    contact.instagram;

  if (!hasAnything) {
    return (
      <div className="rounded-[var(--radius-card)] border border-line bg-surface-2 p-5 text-sm text-ink-muted">
        <p>
          We do not have contact details for this listing yet.{' '}
          <a href="/contact" className="text-brand underline">
            Know them?
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[var(--radius-card)] border border-line bg-surface-2 p-5">
      <h2 className="mb-4 text-base font-semibold">Contact &amp; booking</h2>

      <div className="space-y-2.5">
        {contact.bookingUrl ? (
          <ExternalButtonLink
            href={contact.bookingUrl}
            sponsored
            size="lg"
            className="w-full"
          >
            Book now
            <ExternalLink className="size-4" aria-hidden="true" />
          </ExternalButtonLink>
        ) : null}

        {contact.whatsapp ? (
          <ExternalButtonLink
            href={whatsappLink(
              contact.whatsapp,
              `Hi, I found ${listing.title} on the local guide and would like to ask about…`,
            )}
            variant={contact.bookingUrl ? 'outline' : 'primary'}
            size="lg"
            className="w-full"
          >
            WhatsApp
          </ExternalButtonLink>
        ) : null}

        {contact.phone ? (
          <a
            href={`tel:${contact.phone.replace(/\s/g, '')}`}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-line font-medium hover:bg-surface-3"
          >
            <Phone className="size-4" aria-hidden="true" />
            {contact.phone}
          </a>
        ) : null}

        {directions ? (
          <ExternalButtonLink href={directions} variant="outline" size="lg" className="w-full">
            <Navigation className="size-4" aria-hidden="true" />
            Directions
          </ExternalButtonLink>
        ) : null}
      </div>

      <dl className="mt-5 space-y-3 border-t border-line pt-5 text-sm">
        <div className="flex gap-2.5">
          <dt className="sr-only">Address</dt>
          <MapPin className="mt-0.5 size-4 shrink-0 text-ink-subtle" aria-hidden="true" />
          <dd className="text-ink-muted">{listing.address}</dd>
        </div>

        {contact.website ? (
          <div className="flex gap-2.5">
            <dt className="sr-only">Website</dt>
            <Globe className="mt-0.5 size-4 shrink-0 text-ink-subtle" aria-hidden="true" />
            <dd className="min-w-0">
              <a
                href={contact.website}
                target="_blank"
                rel="noopener noreferrer"
                className="block truncate text-brand hover:underline"
              >
                {contact.website.replace(/^https?:\/\//, '')}
              </a>
            </dd>
          </div>
        ) : null}

        {contact.facebook || contact.instagram ? (
          <div className="flex gap-2.5">
            <dt className="sr-only">Social</dt>
            <span className="mt-0.5 flex gap-2">
              {contact.facebook ? (
                <a
                  href={contact.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${listing.title} on Facebook`}
                  className="text-ink-subtle hover:text-brand"
                >
                  <Facebook className="size-4" aria-hidden="true" />
                </a>
              ) : null}
              {contact.instagram ? (
                <a
                  href={contact.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${listing.title} on Instagram`}
                  className="text-ink-subtle hover:text-brand"
                >
                  <Instagram className="size-4" aria-hidden="true" />
                </a>
              ) : null}
            </span>
            <dd className="sr-only">Social media profiles</dd>
          </div>
        ) : null}
      </dl>
    </div>
  );
}
