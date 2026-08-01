import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function AdvertiseSection() {
  return (
    <section className="py-20 sm:py-28 lg:py-36 bg-surface-2">
      <div className="container-page">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-brand/20 rounded-2xl blur-3xl" />
            <div className="relative bg-gradient-to-br from-surface to-surface-2 rounded-2xl p-8 border border-line">
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800">
                  <div className="font-semibold text-amber-900 dark:text-amber-100 mb-1">Featured Listing</div>
                  <p className="text-sm text-amber-800 dark:text-amber-200">Get prominent placement on town guides</p>
                </div>

                <div className="p-4 rounded-lg bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800">
                  <div className="font-semibold text-purple-900 dark:text-purple-100 mb-1">Premium Listing</div>
                  <p className="text-sm text-purple-800 dark:text-purple-200">Priority visibility across directories</p>
                </div>

                <div className="p-4 rounded-lg bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800">
                  <div className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Sponsored Articles</div>
                  <p className="text-sm text-blue-800 dark:text-blue-200">Tell your story to engaged audiences</p>
                </div>

                <div className="pt-4 border-t border-line text-sm text-ink-muted">
                  Each town's advertisers are hand-picked to ensure quality and relevance to the local community.
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <h2 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
              Advertise Your Business Across Local Communities
            </h2>

            <p className="text-lg text-ink-muted mb-8 leading-relaxed">
              Reach engaged travelers and locals who are actively discovering what's new in towns across Malaysia. Each
              guide features curated businesses that support the local community.
            </p>

            <div className="space-y-4 mb-10">
              <div>
                <h4 className="font-semibold mb-2">Featured Listing</h4>
                <p className="text-ink-muted">Highlighted placement in search results and directory pages</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Premium Listing</h4>
                <p className="text-ink-muted">Full visibility boost with enhanced profile and analytics</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Sponsored Articles</h4>
                <p className="text-ink-muted">Tell your brand story in long-form content reaching thousands</p>
              </div>
            </div>

            <Link
              href="mailto:advertise@lokaly.my?subject=Advertising%20Inquiry"
              className="inline-flex items-center gap-2 bg-brand text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand/90 transition-colors"
            >
              Advertise With Us
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
