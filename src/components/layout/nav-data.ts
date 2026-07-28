import { allDirectories, type NavGroupId } from '@/config/directories';
import { NAV_GROUPS, STATIC_ROUTES } from '@/config/site';
import { routes } from '@/lib/routes';
import { t } from '@/lib/template';
import type { TownConfig } from '@/types/town';

export interface NavItem {
  label: string;
  href: string;
  description?: string;
  icon?: string;
}

export interface NavGroup {
  id: NavGroupId | 'more';
  label: string;
  href?: string;
  items: NavItem[];
}

/**
 * Builds the navigation for a town.
 *
 * Directory entries come from the registry and are filtered by the town's
 * feature flags, so switching `homestays: false` removes it from the menu, the
 * sitemap and the routes in one move.
 */
export function buildNav(town: TownConfig): NavGroup[] {
  const directories = allDirectories().filter(
    (directory) => !directory.featureFlag || town.features[directory.featureFlag],
  );

  const byGroup = (group: NavGroupId): NavItem[] =>
    directories
      .filter((directory) => directory.navGroup === group)
      .map((directory) => ({
        label: directory.label,
        href: directory.path,
        description: t(directory.headline, town),
        icon: directory.icon,
      }));

  const groups: NavGroup[] = [
    {
      id: 'discover',
      label: NAV_GROUPS.discover.label,
      items: [
        {
          label: `Discover ${town.name}`,
          href: routes.discover(),
          description: `An introduction to ${town.name}`,
          icon: 'Compass',
        },
        {
          label: 'Things To Do',
          href: routes.thingsToDo(),
          description: `Everything worth doing in ${town.name}`,
          icon: 'MapPin',
        },
        {
          label: 'Hidden Gems',
          href: routes.hiddenGems(),
          description: 'The places visitors miss',
          icon: 'Compass',
        },
        ...(town.features.map
          ? [{ label: 'Map', href: routes.map(), description: 'Everything, plotted', icon: 'MapPin' }]
          : []),
      ],
    },
    { id: 'eat', label: NAV_GROUPS.eat.label, items: byGroup('eat') },
    { id: 'stay', label: NAV_GROUPS.stay.label, items: byGroup('stay') },
    {
      id: 'do',
      label: NAV_GROUPS.do.label,
      items: [
        ...byGroup('do'),
        ...(town.features.events
          ? [{ label: 'Events', href: routes.events(), description: 'What is on', icon: 'MapPin' }]
          : []),
      ],
    },
    {
      id: 'read',
      label: NAV_GROUPS.read.label,
      items: [
        ...(town.features.guides
          ? [
              {
                label: 'Travel Guides',
                href: routes.guides(),
                description: 'Long-form guides to the district',
                icon: 'Compass',
              },
              {
                label: 'Weekend Itinerary',
                href: routes.weekendItinerary(),
                description: `48 hours in ${town.name}`,
                icon: 'Compass',
              },
            ]
          : []),
        ...(town.features.blog
          ? [{ label: 'Blog', href: routes.blog(), description: 'News and stories', icon: 'Compass' }]
          : []),
      ],
    },
    { id: 'business', label: NAV_GROUPS.business.label, items: byGroup('business') },
  ];

  return groups.filter((group) => group.items.length > 0);
}

/** Footer link columns. Flatter than the header — good for crawl depth. */
export function buildFooterColumns(town: TownConfig): Array<{ title: string; items: NavItem[] }> {
  const nav = buildNav(town);
  const explore = nav.flatMap((group) => group.items);

  return [
    { title: `Explore ${town.name}`, items: explore.slice(0, 8) },
    { title: 'More', items: explore.slice(8) },
    {
      title: 'About',
      items: [
        { label: 'About us', href: STATIC_ROUTES.about },
        { label: 'Contact', href: STATIC_ROUTES.contact },
        ...(town.features.advertise
          ? [{ label: 'Advertise with us', href: STATIC_ROUTES.advertise }]
          : []),
        { label: 'Privacy policy', href: STATIC_ROUTES.privacy },
        { label: 'Terms of use', href: STATIC_ROUTES.terms },
      ],
    },
  ].filter((column) => column.items.length > 0);
}
