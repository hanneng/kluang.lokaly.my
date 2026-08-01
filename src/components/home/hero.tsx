import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { allDirectories } from '@/config/directories';
import { resolveMediaUrl } from '@/lib/media';
import { t } from '@/lib/template';
import { Icon } from '@/components/ui/icon';
import { SearchBox } from '@/components/search/search-box';
import type { TownConfig } from '@/types/town';

/**
 * Homepage hero.
 *
 * The image is the LCP element on every device, so it is `priority` and sized
 * for the viewport rather than shipped at full width to phones.
 */
export function Hero({ town }: { town: TownConfig }) {
  const quickLinks = allDirectories()
    .filter((directory) => !directory.featureFlag || town.features[directory.featureFlag])
    .slice(0, 6);

  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src={resolveMediaUrl(town.hero.src)}
          alt={town.hero.alt}
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover"
        />
        {/* Two-stop scrim: keeps text legible without flattening the photo. */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-black/70" />
      </div>

      <div className="container-page py-20 sm:py-28 lg:py-36">
        <div className="max-w-3xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-sm font-medium text-white backdrop-blur">
            <span aria-hidden="true">{town.logo.mark}</span>
            {town.fullName}
          </p>

          <h1 className="text-4xl font-bold leading-[1.08] text-white sm:text-5xl lg:text-6xl">
            {t('Discover {{town}}', town)}
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/85 sm:text-xl">
            {town.editorial.tagline}
          </p>

          <div className="mt-8 max-w-xl">
            <Suspense fallback={<div className="h-14 rounded-full bg-white/20" />}>
              <SearchBox
                size="lg"
                placeholder={t('Search hotels, food, attractions in {{town}}…', town)}
              />
            </Suspense>
          </div>

          <nav aria-label="Browse by category" className="mt-8">
            <ul className="flex flex-wrap gap-2">
              {quickLinks.map((directory) => (
                <li key={directory.slug}>
                  <Link
                    href={directory.path}
                    className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur transition-colors hover:bg-white/25"
                  >
                    <Icon name={directory.icon} className="size-4" />
                    {directory.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {town.hero.credit ? (
        <p className="absolute bottom-2 right-3 text-[0.65rem] text-white/50">{town.hero.credit}</p>
      ) : null}
    </section>
  );
}
