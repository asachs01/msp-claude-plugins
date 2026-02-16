// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Build target: set SITE_URL and BASE_PATH env vars to override.
// GitHub Pages (default): https://wyre-technology.github.io/msp-claude-plugins/
// Gateway (Docker):       SITE_URL=https://mcp.wyretechnology.com BASE_PATH=/docs/
const site = process.env.SITE_URL || 'https://wyre-technology.github.io';
const base = process.env.BASE_PATH || '/msp-claude-plugins/';

// https://astro.build/config
export default defineConfig({
  site,
  base,
  integrations: [
    tailwind(),
    mdx(),
    sitemap()
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true
    }
  }
});
