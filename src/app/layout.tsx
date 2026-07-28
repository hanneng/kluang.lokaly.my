import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

import { Analytics } from '@/components/analytics';
import { SiteFooter } from '@/components/layout/footer';
import { SiteHeader } from '@/components/layout/header';
import { Providers } from '@/components/providers';
import { JsonLd } from '@/components/seo/json-ld';
import { organizationJsonLd, townPlaceJsonLd, websiteJsonLd } from '@/lib/seo/jsonld';
import { buildRootMetadata } from '@/lib/seo/metadata';
import { getTown, getTownOrigin } from '@/lib/town/context';

export async function generateMetadata(): Promise<Metadata> {
  return buildRootMetadata();
}

export async function generateViewport(): Promise<Viewport> {
  const town = await getTown();
  return {
    width: 'device-width',
    initialScale: 1,
    themeColor: [
      { media: '(prefers-color-scheme: light)', color: town.theme.browserTheme },
      { media: '(prefers-color-scheme: dark)', color: '#161a20' },
    ],
  };
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const town = await getTown();
  const origin = await getTownOrigin();

  /*
   * Town theming.
   *
   * Brand colours are applied as inline custom properties on <html> rather than
   * compiled into Tailwind classes. That is what lets one build serve every
   * town: the CSS bundle is identical, only these four values change.
   */
  const themeVars = {
    '--brand': town.theme.primary,
    '--brand-fg': town.theme.primaryForeground,
    '--accent': town.theme.accent,
    '--accent-fg': town.theme.accentForeground,
  } as React.CSSProperties;

  const darkOverrides = town.theme.dark;

  return (
    // suppressHydrationWarning: next-themes writes the class before React hydrates.
    <html lang={town.locale} style={themeVars} suppressHydrationWarning>
      <head>
        {darkOverrides ? (
          <style
            // Dark-mode brand overrides cannot live in an inline style attribute
            // because they are conditional on the .dark class.
            dangerouslySetInnerHTML={{
              __html: `.dark{${[
                darkOverrides.primary && `--brand:${darkOverrides.primary}`,
                darkOverrides.primaryForeground && `--brand-fg:${darkOverrides.primaryForeground}`,
                darkOverrides.accent && `--accent:${darkOverrides.accent}`,
                darkOverrides.accentForeground && `--accent-fg:${darkOverrides.accentForeground}`,
              ]
                .filter(Boolean)
                .join(';')}}`,
            }}
          />
        ) : null}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
      </head>

      <body className="min-h-dvh antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-brand focus:px-5 focus:py-2.5 focus:text-brand-fg"
        >
          Skip to content
        </a>

        <Providers>
          <div className="flex min-h-dvh flex-col">
            <SiteHeader />
            <main id="main" className="flex-1">
              {children}
            </main>
            <SiteFooter />
          </div>
        </Providers>

        <JsonLd
          data={[
            organizationJsonLd(town, origin),
            websiteJsonLd(town, origin),
            townPlaceJsonLd(town, origin),
          ]}
        />
        <Analytics measurementId={town.analytics.gaMeasurementId} />
      </body>
    </html>
  );
}
