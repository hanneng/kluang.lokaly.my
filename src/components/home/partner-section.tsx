import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';

export function PartnerSection() {
  return (
    <section id="partner" className="py-20 sm:py-28 lg:py-36">
      <div className="container-page">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
              Become a Community Partner
            </h2>

            <p className="text-lg text-ink-muted mb-8 leading-relaxed">
              Lokaly is expanding rapidly across Malaysia. We're looking for passionate locals who love their hometown
              and want to build a community guide from the ground up.
            </p>

            <div className="space-y-4 mb-10">
              <div className="flex gap-3">
                <Check className="size-5 text-brand flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Everything you need</h4>
                  <p className="text-ink-muted">Website, hosting, domains and SEO tools included</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Check className="size-5 text-brand flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Training & support</h4>
                  <p className="text-ink-muted">We help you build and grow your local community</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Check className="size-5 text-brand flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Monetisation</h4>
                  <p className="text-ink-muted">Premium listings and sponsored content revenue sharing</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Check className="size-5 text-brand flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Community first</h4>
                  <p className="text-ink-muted">Support local businesses and tourism in your town</p>
                </div>
              </div>
            </div>

            <Link
              href="mailto:hello@lokaly.my?subject=Community%20Partner%20Interest"
              className="inline-flex items-center gap-2 bg-brand text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand/90 transition-colors"
            >
              Get Started
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-brand/20 to-accent/20 rounded-2xl blur-3xl" />
            <div className="relative bg-gradient-to-br from-surface to-surface-2 rounded-2xl p-8 border border-line">
              <div className="space-y-6">
                <div className="text-center p-4 rounded-lg bg-brand/10">
                  <div className="text-3xl font-bold text-brand mb-2">100+</div>
                  <p className="text-sm font-medium">Towns on our roadmap</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-accent/10 text-center">
                    <div className="text-2xl font-bold mb-1">🌏</div>
                    <p className="text-xs font-medium text-ink-subtle">Nationwide reach</p>
                  </div>
                  <div className="p-4 rounded-lg bg-brand/10 text-center">
                    <div className="text-2xl font-bold mb-1">👥</div>
                    <p className="text-xs font-medium text-ink-subtle">Community-run</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-line">
                  <p className="text-sm font-medium text-ink-muted mb-3">What we provide:</p>
                  <ul className="space-y-2 text-sm text-ink-muted">
                    <li className="flex gap-2">
                      <span>✓</span> <span>Website & hosting</span>
                    </li>
                    <li className="flex gap-2">
                      <span>✓</span> <span>Domain setup & SSL</span>
                    </li>
                    <li className="flex gap-2">
                      <span>✓</span> <span>SEO optimization</span>
                    </li>
                    <li className="flex gap-2">
                      <span>✓</span> <span>Analytics & insights</span>
                    </li>
                    <li className="flex gap-2">
                      <span>✓</span> <span>Training program</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
