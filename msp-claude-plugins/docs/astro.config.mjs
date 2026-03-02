// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Build target: set SITE_URL and BASE_PATH env vars to override.
// Primary (mcp.wyretechnology.com): defaults below
// GitHub Pages: SITE_URL=https://wyre-technology.github.io BASE_PATH=/msp-claude-plugins/
// Gateway (Docker): SITE_URL=https://mcp.wyretechnology.com BASE_PATH=/docs/
const site = process.env.SITE_URL || 'https://mcp.wyretechnology.com';
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
