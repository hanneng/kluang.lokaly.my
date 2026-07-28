import type { TownConfig } from '@/types/town';

/**
 * Token interpolation for town-aware copy.
 *
 * Config strings hold `{{town}}` style tokens instead of functions so the whole
 * config layer stays serialisable and can later be edited in the CMS by
 * non-developers without shipping code.
 */

export type TemplateVars = Record<string, string | number | undefined>;

const TOKEN = /\{\{\s*([\w.]+)\s*\}\}/g;

export function renderTemplate(input: string, vars: TemplateVars): string {
  return input.replace(TOKEN, (match, key: string) => {
    const value = vars[key];
    return value === undefined ? match : String(value);
  });
}

/** Standard variables available to every piece of town copy. */
export function townVars(town: TownConfig, extra: TemplateVars = {}): TemplateVars {
  return {
    town: town.name,
    townFull: town.fullName,
    state: town.state,
    country: town.country,
    ...extra,
  };
}

/** Convenience wrapper: interpolate a template with the town's variables. */
export function t(input: string, town: TownConfig, extra: TemplateVars = {}): string {
  return renderTemplate(input, townVars(town, extra));
}
