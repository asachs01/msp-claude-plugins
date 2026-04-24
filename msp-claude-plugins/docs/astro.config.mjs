// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Build target: set SITE_URL and BASE_PATH env vars to override.
// Primary (mcp.wyre.ai): defaults below
// GitHub Pages: SITE_URL=https://wyre-technology.github.io BASE_PATH=/msp-claude-plugins/
// Gateway (Docker): SITE_URL=https://mcp.wyre.ai BASE_PATH=/docs/
const site = process.env.SITE_URL || 'https://mcp.wyre.ai';
const base = process.env.BASE_PATH || '/';

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
      themes: {
        light: 'github-light',
        dark: 'github-dark'
      },
      wrap: true
    }
  }
});
