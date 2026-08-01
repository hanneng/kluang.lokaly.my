import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function NetworkHero() {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary)]/85 to-[var(--color-accent)]/40 py-20 sm:py-28 lg:py-40">
      <div className="absolute inset-0 -z-10 opacity-20">
        <svg className="h-full w-full" viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice">
          <path
            d="M0,400 Q360,200 720,400 T1440,400 L1440,800 L0,800 Z"
            fill="currentColor"
            className="text-white/30"
          />
          <path
            d="M0,500 Q360,300 720,500 T1440,500 L1440,800 L0,800 Z"
            fill="currentColor"
            className="text-white/10"
          />
        </svg>
      </div>

      <div className="container-page">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-4 py-2">
            <span className="text-3xl" aria-hidden="true">
              🌏
            </span>
            <span className="text-sm font-medium text-white">Malaysia's Local Discovery Platform</span>
          </div>

          <h1 className="text-5xl font-bold leading-[1.1] text-white sm:text-6xl lg:text-7xl">
            Discover the Best of Every Malaysian Town
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-white/85 sm:text-xl max-w-2xl mx-auto">
            From hidden food gems to local attractions, hotels and community businesses, Lokaly helps you
            experience Malaysia like a local.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#featured-towns"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white text-[var(--color-primary)] px-6 py-3 font-semibold transition-transform hover:scale-105"
            >
              Explore Towns
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="#partner"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white/20 backdrop-blur text-white px-6 py-3 font-semibold transition-colors hover:bg-white/30"
            >
              Become a Community Partner
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
