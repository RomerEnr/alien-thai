// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

/**
 * Families are self-hosted at build time, so no request ever leaves for Google.
 * @param {string} name
 * @param {string} cssVariable
 * @param {[number, ...number[]]} weights
 * @param {string[]} fallbacks
 * @param {{ experimental?: { variableAxis?: Record<string, number[]> } }} [options] Google provider options
 */
const googleFont = (name, cssVariable, weights, fallbacks, options) => ({
  provider: fontProviders.google(),
  name,
  cssVariable,
  weights,
  /** @type {['normal']} */
  styles: ['normal'],
  fallbacks,
  options,
});

/**
 * GitHub Pages serves the preview from a project path. Set SITE_URL and
 * BASE_PATH (or leave both out) when the real domain arrives.
 */
const SITE_URL = process.env.SITE_URL ?? 'https://romerenr.github.io';
const BASE_PATH = process.env.BASE_PATH ?? '/alien-thai';

export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  compressHTML: true,
  build: { inlineStylesheets: 'auto' },
  fonts: [
    // Google merged Big Shoulders Display into Big Shoulders; its largest
    // optical size (72) is the Display cut.
    googleFont('Big Shoulders', '--font-display', [800, 900], ['Arial Narrow', 'sans-serif'], {
      experimental: { variableAxis: { opsz: [72] } },
    }),
    googleFont('Hanken Grotesk', '--font-sans', [400, 500, 600], ['system-ui', 'sans-serif']),
    googleFont('JetBrains Mono', '--font-mono', [400, 500], ['ui-monospace', 'monospace']),
  ],
});
