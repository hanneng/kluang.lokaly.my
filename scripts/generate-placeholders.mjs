/**
 * Generates the placeholder artwork referenced by the seed content.
 *
 * These exist so a fresh clone renders a complete-looking site with no image
 * hosting configured. Real photography belongs in Cloudflare R2 and is served
 * through `NEXT_PUBLIC_R2_PUBLIC_HOST`.
 *
 * Run: node scripts/generate-placeholders.mjs
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, '../public/images/placeholders');

/** [name, from, to, accent, motif] */
const PLATES = [
  ['hero-hills', '#0f3d2e', '#2c7a5b', '#f0b429', 'hills'],
  ['hero-coast', '#0d3550', '#2a7ba8', '#f08c29', 'waves'],
  ['og-default', '#123b2e', '#1f5c43', '#f0b429', 'hills'],
  ['tile-nature', '#14452f', '#3f8f63', '#d9f0a3', 'hills'],
  ['tile-food', '#5a2a1c', '#a8552f', '#f5c26b', 'dots'],
  ['tile-cafe', '#3d2a1c', '#8a5a34', '#e8c39e', 'rings'],
  ['tile-hotel', '#1c2b45', '#41618f', '#cbd9ef', 'grid'],
  ['tile-shop', '#3b1f45', '#7a4a8f', '#e3c6ef', 'grid'],
  ['tile-event', '#4a1f38', '#96406d', '#f2b8d4', 'dots'],
  ['tile-heritage', '#402c14', '#8a6a35', '#e8d3a3', 'rings'],
  ['tile-guide', '#14374a', '#3a7d94', '#bfe6ef', 'waves'],
];

const W = 1600;
const H = 1000;

function motif(kind, accent) {
  switch (kind) {
    case 'hills':
      return `
    <path d="M0 720 Q 260 560 520 690 T 1040 660 T 1600 700 L1600 1000 L0 1000 Z" fill="${accent}" opacity="0.16"/>
    <path d="M0 820 Q 320 690 640 800 T 1280 780 T 1600 820 L1600 1000 L0 1000 Z" fill="${accent}" opacity="0.24"/>`;
    case 'waves':
      return `
    <path d="M0 760 Q 200 700 400 760 T 800 760 T 1200 760 T 1600 760 L1600 1000 L0 1000 Z" fill="${accent}" opacity="0.18"/>
    <path d="M0 860 Q 200 800 400 860 T 800 860 T 1200 860 T 1600 860 L1600 1000 L0 1000 Z" fill="${accent}" opacity="0.26"/>`;
    case 'dots': {
      let out = '';
      for (let y = 140; y < H; y += 180) {
        for (let x = 120; x < W; x += 180) {
          const r = 14 + ((x + y) % 5) * 4;
          out += `<circle cx="${x}" cy="${y}" r="${r}" fill="${accent}" opacity="0.14"/>`;
        }
      }
      return out;
    }
    case 'rings': {
      let out = '';
      for (let i = 0; i < 5; i += 1) {
        out += `<circle cx="${1240 - i * 40}" cy="${360 + i * 30}" r="${180 + i * 90}" fill="none" stroke="${accent}" stroke-width="2" opacity="0.16"/>`;
      }
      return out;
    }
    case 'grid':
    default: {
      let out = '';
      for (let x = 0; x <= W; x += 100) {
        out += `<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="${accent}" stroke-width="1" opacity="0.10"/>`;
      }
      for (let y = 0; y <= H; y += 100) {
        out += `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="${accent}" stroke-width="1" opacity="0.10"/>`;
      }
      return out;
    }
  }
}

mkdirSync(outDir, { recursive: true });

for (const [name, from, to, accent, kind] of PLATES) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Placeholder image">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${from}"/>
      <stop offset="100%" stop-color="${to}"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  ${motif(kind, accent)}
</svg>
`;
  writeFileSync(resolve(outDir, `${name}.svg`), svg, 'utf8');
}

console.log(`Wrote ${PLATES.length} placeholder images to public/images/placeholders`);
