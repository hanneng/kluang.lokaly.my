import Script from 'next/script';

/**
 * Google Analytics 4.
 *
 * Renders nothing when no measurement id is configured, so development and
 * preview builds never pollute production data. Loaded `afterInteractive` so it
 * never blocks LCP.
 */
export function Analytics({ measurementId }: { measurementId?: string }) {
  if (!measurementId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
