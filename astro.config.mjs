// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import starlight from '@astrojs/starlight';

export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
  integrations: [
    starlight({
      title: 'Blog Components',
      disable404Route: true,
      customCss: ['./src/styles/starlight.css'],
      expressiveCode: {
        themes: ['dark-plus'],
        defaultProps: {
          frame: false,
        },
      },
    }),
    mdx(),
    sitemap(),
  ],
  site: 'https://matthewlaustin.com',
});