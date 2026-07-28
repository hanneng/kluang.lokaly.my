import {
  BedDouble,
  Coffee,
  Compass,
  Home,
  MapPin,
  ShoppingBag,
  Store,
  UtensilsCrossed,
  type LucideIcon,
} from 'lucide-react';

/**
 * Icon lookup for config-driven surfaces.
 *
 * The directory registry stores icon *names* so it stays serialisable; this map
 * is the single place those names become components. Keep it small — a full
 * lucide barrel import would land in every client bundle.
 */
const ICONS: Record<string, LucideIcon> = {
  MapPin,
  UtensilsCrossed,
  Coffee,
  BedDouble,
  Home,
  ShoppingBag,
  Store,
  Compass,
};

export function Icon({
  name,
  className,
  strokeWidth = 1.75,
}: {
  name: string;
  className?: string;
  strokeWidth?: number;
}) {
  const Component = ICONS[name] ?? Compass;
  return <Component className={className} strokeWidth={strokeWidth} aria-hidden="true" />;
}
