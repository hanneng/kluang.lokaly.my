import { ArrowRight } from 'lucide-react';
import { ButtonLink } from '@/components/ui/button';
import { routes } from '@/lib/routes';
import type { TownConfig } from '@/types/town';

/** Conversion block for the advertising product, reused across page bottoms. */
export function AdvertiseCta({ town }: { town: TownConfig }) {
  if (!town.features.advertise) return null;

  return (
    <section className="py-12">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-[var(--radius-card)] bg-brand px-6 py-12 text-brand-fg sm:px-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-accent/25 blur-3xl"
          />

          <div className="relative max-w-2xl">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Reach people planning their trip to {town.name}
            </h2>
            <p className="mt-3 text-brand-fg/85">
              We publish the guide that visitors and residents actually read. A Featured or Premium
              listing puts your business in front of them at the moment they are deciding where to
              eat, stay or shop.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonLink href={routes.advertise()} variant="accent" size="lg">
                See packages
                <ArrowRight className="size-4" aria-hidden="true" />
              </ButtonLink>
              <ButtonLink
                href={routes.contact()}
                size="lg"
                className="border border-brand-fg/30 bg-transparent text-brand-fg hover:bg-brand-fg/10"
              >
                Talk to us
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
