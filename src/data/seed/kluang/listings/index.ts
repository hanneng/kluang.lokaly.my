import type { Listing } from '@/types/content';
import { attractions } from './attractions';
import { food } from './food';
import { cafes } from './cafes';
import { hotels, homestays } from './stays';
import { shopping, businesses } from './shopping-business';

/** All Kluang listings, in one flat array for the seed repository. */
export const kluangListings: Listing[] = [
  ...attractions,
  ...food,
  ...cafes,
  ...hotels,
  ...homestays,
  ...shopping,
  ...businesses,
];
