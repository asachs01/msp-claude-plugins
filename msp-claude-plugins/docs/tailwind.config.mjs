/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          light: '#fafafa',
          dark: '#0a0a0a'
        },
        text: {
          light: '#171717',
          dark: '#ededed'
        },
        accent: {
          DEFAULT: '#00C9DB',
          hover: '#00b5c6'
        },
        highlight: '#EDE947',
        success: '#16a34a',
        border: {
          light: '#e5e5e5',
          dark: '#262626'
        }
      },
      fontFamily: {
        sans: ['Nunito Sans', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        heading: ['Oswald', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'SF Mono', 'Menlo', 'Monaco', 'Consolas', 'monospace']
      }
    }
  },
  plugins: []
};
