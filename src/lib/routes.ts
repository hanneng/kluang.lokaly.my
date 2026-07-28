/**
 * Canonical URL builders.
 *
 * Every internal link goes through here. When a URL shape changes, it changes
 * in one place and the sitemap, breadcrumbs, JSON-LD and canonicals all follow.
 */

import type { Article, DirectorySlug, Listing, TownEvent } from '@/types/content';
import { STATIC_ROUTES } from '@/config/site';

export const routes = {
  home: () => '/',
  discover: () => STATIC_ROUTES.discover,
  thingsToDo: () => STATIC_ROUTES.thingsToDo,
  map: () => STATIC_ROUTES.map,
  hiddenGems: () => STATIC_ROUTES.hiddenGems,
  advertise: () => STATIC_ROUTES.advertise,
  about: () => STATIC_ROUTES.about,
  contact: () => STATIC_ROUTES.contact,
  privacy: () => STATIC_ROUTES.privacy,
  terms: () => STATIC_ROUTES.terms,

  directory: (directory: DirectorySlug) => `/${directory}`,
  directoryCategory: (directory: DirectorySlug, categorySlug: string) =>
    `/${directory}/category/${categorySlug}`,
  listing: (directory: DirectorySlug, slug: string) => `/${directory}/${slug}`,

  events: () => STATIC_ROUTES.events,
  event: (slug: string) => `/events/${slug}`,

  guides: () => STATIC_ROUTES.guides,
  guide: (slug: string) => `/guides/${slug}`,
  weekendItinerary: () => STATIC_ROUTES.weekendItinerary,

  blog: () => STATIC_ROUTES.blog,
  post: (slug: string) => `/blog/${slug}`,

  search: (params?: { q?: string; directory?: string; category?: string }) => {
    if (!params) return STATIC_ROUTES.search;
    const search = new URLSearchParams();
    if (params.q) search.set('q', params.q);
    if (params.directory) search.set('directory', params.directory);
    if (params.category) search.set('category', params.category);
    const qs = search.toString();
    return qs ? `${STATIC_ROUTES.search}?${qs}` : STATIC_ROUTES.search;
  },
} as const;

/** Canonical path for an article, which differs by editorial kind. */
export function articleHref(article: Pick<Article, 'kind' | 'slug'>): string {
  return article.kind === 'blog' ? routes.post(article.slug) : routes.guide(article.slug);
}

export function listingHref(listing: Pick<Listing, 'directory' | 'slug'>): string {
  return routes.listing(listing.directory, listing.slug);
}

export function eventHref(event: Pick<TownEvent, 'slug'>): string {
  return routes.event(event.slug);
}
