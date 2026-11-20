// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import svelte from '@astrojs/svelte';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://matthewlaustin.com',
  trailingSlash: 'always',
  integrations: [svelte(), sitemap()],

  // Fonts are downloaded at build time and served from this site. No font CDN at runtime.
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Libre Franklin',
      cssVariable: '--font-sans',
      weights: ['400 800'],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Spline Sans Mono',
      cssVariable: '--font-mono',
      weights: ['400 500'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['ui-monospace', 'monospace'],
    },
  ],

  markdown: {
    // Highlighting happens at build time. Colors come from CSS variables so
    // code follows the light and dark palettes in src/styles/global.css.
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
    },
  },
});
