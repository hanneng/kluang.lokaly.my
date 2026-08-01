import Link from 'next/link';
import { liveTowns, allTowns } from '@/config/towns';
import { townOrigin } from '@/config/towns';
import { Badge } from '@/components/ui/badge';

export function FeaturedTowns() {
  const live = liveTowns();
  const planned = allTowns().filter((t) => t.status === 'planned');

  return (
    <section id="featured-towns" className="py-20 sm:py-28 lg:py-36">
      <div className="container-page">
        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Explore Towns</h2>
          <p className="text-lg text-ink-subtle max-w-2xl">
            Visit hyperlocal guides across Malaysia, each written and maintained by passionate locals who
            know their home.
          </p>
        </div>

        {live.length > 0 && (
          <div className="mb-20">
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <span className="text-2xl">✅</span> Currently Available
              </h3>
              <p className="text-ink-subtle">Explore these towns now</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {live.map((town) => (
                <Link
                  key={town.slug}
                  href={townOrigin(town)}
                  className="group relative overflow-hidden rounded-2xl bg-surface border border-line shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <div className="aspect-video bg-gradient-to-br from-[var(--color-brand)]/10 to-[var(--color-accent)]/10 flex items-center justify-center text-6xl">
                    {town.logo.mark}
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-xl font-bold group-hover:text-brand transition-colors">
                          {town.name}
                        </h4>
                        <p className="text-sm text-ink-subtle">{town.state}</p>
                      </div>
                      {town.status === 'beta' && <Badge tone="brand">Beta</Badge>}
                    </div>

                    <p className="text-sm leading-relaxed text-ink-muted mb-4">
                      {town.editorial.intro}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {town.editorial.knownFor.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-brand/10 text-brand"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {planned.length > 0 && (
          <div>
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <span className="text-2xl">🚀</span> Coming Soon
              </h3>
              <p className="text-ink-subtle">We're expanding across Malaysia</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {planned.map((town) => (
                <div
                  key={town.slug}
                  className="opacity-60 rounded-2xl bg-surface-2 border border-line p-6 text-center"
                >
                  <div className="aspect-video bg-gradient-to-br from-line/30 to-line/50 rounded-lg flex items-center justify-center text-5xl mb-4">
                    {town.logo.mark}
                  </div>
                  <h4 className="text-lg font-bold mb-1">{town.name}</h4>
                  <p className="text-sm text-ink-subtle mb-4">{town.state}</p>
                  <p className="text-sm font-medium text-ink-subtle mb-4">Coming Soon</p>
                  <button
                    disabled
                    className="w-full px-4 py-2 rounded-lg bg-line text-ink-subtle font-medium cursor-not-allowed opacity-50"
                  >
                    Notify Me
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
