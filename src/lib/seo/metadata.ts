import type { Metadata } from 'next';
import { getTown, getTownOrigin } from '@/lib/town/context';
import { t } from '@/lib/template';
import { truncate } from '@/lib/utils';
import type { MediaAsset } from '@/types/content';

export interface PageMetaInput {
  /** Page title without the town suffix — the template adds it. */
  title: string;
  description: string;
  /** Site-relative path, used for the canonical URL. */
  path: string;
  image?: MediaAsset;
  /** `article` unlocks published/modified times in the OG tags. */
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
  keywords?: string[];
}

/**
 * Builds page metadata from the active town config.
 *
 * Every page uses this rather than hand-writing tags, which guarantees a
 * canonical URL on the correct domain, an OG image, and a title that follows
 * the town's template. `{{town}}` tokens in the input are interpolated.
 */
export async function buildMetadata(input: PageMetaInput): Promise<Metadata> {
  const town = await getTown();
  const origin = await getTownOrigin();

  const title = t(input.title, town);
  const description = truncate(t(input.description, town), 300);
  const url = `${origin}${input.path}`;
  const image = input.image ?? town.seo.ogImage;
  const imageUrl = image.src.startsWith('http') ? image.src : `${origin}${image.src}`;

  return {
    title,
    description,
    keywords: input.keywords ?? town.seo.keywords,
    alternates: {
      canonical: url,
    },
    robots: input.noindex
      ? { index: false, follow: true }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        },
    openGraph: {
      type: input.type ?? 'website',
      url,
      title,
      description,
      siteName: `${town.name} Guide`,
      locale: town.locale.replace('-', '_'),
      images: [{ url: imageUrl, width: image.width ?? 1200, height: image.height ?? 630, alt: image.alt }],
      ...(input.type === 'article'
        ? { publishedTime: input.publishedTime, modifiedTime: input.modifiedTime }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
      ...(town.seo.twitterHandle ? { site: town.seo.twitterHandle, creator: town.seo.twitterHandle } : {}),
    },
  };
}

/** Root metadata for the app layout — sets the title template and defaults. */
export async function buildRootMetadata(): Promise<Metadata> {
  const town = await getTown();
  const origin = await getTownOrigin();
  const ogImage = town.seo.ogImage.src.startsWith('http')
    ? town.seo.ogImage.src
    : `${origin}${town.seo.ogImage.src}`;

  return {
    metadataBase: new URL(origin),
    title: {
      default: town.seo.defaultTitle,
      template: town.seo.titleTemplate,
    },
    description: town.seo.description,
    keywords: town.seo.keywords,
    applicationName: `${town.name} Guide`,
    authors: [{ name: `${town.name} Guide` }],
    creator: `${town.name} Guide`,
    publisher: `${town.name} Guide`,
    formatDetection: { telephone: false, address: false, email: false },
    alternates: { canonical: origin },
    openGraph: {
      type: 'website',
      url: origin,
      siteName: `${town.name} Guide`,
      title: town.seo.defaultTitle,
      description: town.seo.description,
      locale: town.locale.replace('-', '_'),
      images: [{ url: ogImage, alt: town.seo.ogImage.alt }],
    },
    twitter: {
      card: 'summary_large_image',
      ...(town.seo.twitterHandle ? { site: town.seo.twitterHandle } : {}),
    },
    ...(town.seo.googleSiteVerification
      ? { verification: { google: town.seo.googleSiteVerification } }
      : {}),
  };
}
