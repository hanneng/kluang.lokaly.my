import Link from 'next/link';
import { Facebook, Instagram, Mail, Youtube } from 'lucide-react';
import { NETWORK } from '@/config/site';
import { liveTowns } from '@/config/towns';
import { getTown } from '@/lib/town/context';
import { routes } from '@/lib/routes';
import { buildFooterColumns } from './nav-data';

export async function SiteFooter() {
  const town = await getTown();
  const columns = buildFooterColumns(town);
  const otherTowns = liveTowns().filter((entry) => entry.slug !== town.slug);
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-line bg-surface-2">
      <div className="container-page py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href={routes.home()} className="flex items-center gap-2 text-lg font-bold">
              <span aria-hidden="true">{town.logo.mark}</span>
              {town.name} Guide
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-muted">
              {town.editorial.tagline}
            </p>

            <div className="mt-5 flex items-center gap-2">
              {town.social.facebook ? (
                <a
                  href={town.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${town.name} Guide on Facebook`}
                  className="inline-flex size-9 items-center justify-center rounded-full border border-line text-ink-muted hover:text-brand"
                >
                  <Facebook className="size-4" aria-hidden="true" />
                </a>
              ) : null}
              {town.social.instagram ? (
                <a
                  href={town.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${town.name} Guide on Instagram`}
                  className="inline-flex size-9 items-center justify-center rounded-full border border-line text-ink-muted hover:text-brand"
                >
                  <Instagram className="size-4" aria-hidden="true" />
                </a>
              ) : null}
              {town.social.youtube ? (
                <a
                  href={town.social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${town.name} Guide on YouTube`}
                  className="inline-flex size-9 items-center justify-center rounded-full border border-line text-ink-muted hover:text-brand"
                >
                  <Youtube className="size-4" aria-hidden="true" />
                </a>
              ) : null}
              <a
                href={`mailto:${town.contact.email}`}
                aria-label={`Email ${town.name} Guide`}
                className="inline-flex size-9 items-center justify-center rounded-full border border-line text-ink-muted hover:text-brand"
              >
                <Mail className="size-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="mb-3 text-sm font-semibold">{column.title}</h2>
              <ul className="space-y-2 text-sm">
                {column.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-ink-muted hover:text-brand">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {otherTowns.length > 0 ? (
          <div className="mt-10 border-t border-line pt-6">
            <h2 className="mb-3 text-sm font-semibold">More towns on {NETWORK.name}</h2>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {otherTowns.map((entry) => (
                <li key={entry.slug}>
                  {/* Cross-domain: a plain anchor, not next/link. */}
                  <a
                    href={`https://${entry.domain}`}
                    className="text-ink-muted hover:text-brand"
                  >
                    {entry.name}, {entry.state}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="mt-10 flex flex-col gap-3 border-t border-line pt-6 text-sm text-ink-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {NETWORK.legalName}. {town.name} Guide is an independent local publication.
          </p>
          <p>
            Part of the{' '}
            <a href={NETWORK.url} className="hover:text-brand">
              {NETWORK.name}
            </a>{' '}
            network.
          </p>
        </div>
      </div>
    </footer>
  );
}
