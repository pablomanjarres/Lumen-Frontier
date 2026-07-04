/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // ─────────────────────────────────────────────────────────────
        // Lumen Frontier · "Old Money" warm palette — WARM RAMPS ONLY.
        // No generic Tailwind blue/green/purple/slate/sky. See DESIGN-SYSTEM.md
        // ─────────────────────────────────────────────────────────────

        // Brass — the single accent + focus color
        brass: {
          50: '#fef9ec',
          100: '#fbefc9',
          200: '#f7de8f',
          300: '#f3c654',
          400: '#f0af2b',
          500: '#e99218',
          600: '#cd6f12',
          700: '#a94f13',
          800: '#893e16',
          900: '#703416',
          950: '#411908',
        },
        // Burgundy — danger / high priority / deep emphasis
        burgundy: {
          50: '#fdf4f4',
          100: '#fbe9e9',
          200: '#f8d6d7',
          300: '#f0b3b6',
          400: '#e5888d',
          500: '#d65e68',
          600: '#c13f52',
          700: '#a02f44',
          800: '#86293d',
          900: '#722639',
          950: '#3e111b',
        },
        // Cognac — warm neutral / leather secondary tone
        cognac: {
          50: '#faf6f2',
          100: '#f2e7dc',
          200: '#e4ceb8',
          300: '#d3ac8d',
          400: '#c18965',
          500: '#b67049',
          600: '#a95c3d',
          700: '#8d4935',
          800: '#733d30',
          900: '#5e3329',
          950: '#331a15',
        },
        // Forest — success / low priority / calm
        forest: {
          50: '#f3f7f3',
          100: '#e4ede3',
          200: '#c9dac7',
          300: '#a2bfa0',
          400: '#769f74',
          500: '#548152',
          600: '#3f663e',
          700: '#335133',
          800: '#2a412b',
          900: '#223623',
          950: '#121d12',
        },
        // Ivory — warm text ramp (drives the 3 text roles) + light surfaces
        ivory: {
          50: '#fdfcfb',
          100: '#faf7f3',
          200: '#f5ede3',
          300: '#ecdfd0',
          400: '#e0cab3',
          500: '#d4b295',
          600: '#c39774',
          700: '#b07e5d',
          800: '#92674d',
          900: '#765542',
          950: '#3f2b21',
        },

        // Semantic surfaces — flat, rich, warm "night" (dark base).
        // Use these instead of tri-color gradients for panels / cards / modals.
        surface: {
          base: '#1a1413', // page background (deep forest/burgundy night)
          raised: '#221a16', // cards / panels
          overlay: '#2b211c', // modals / popovers / dropdowns
          sunken: '#120d0b', // insets / inputs / wells
        },
        // Hairline — 1px brass-tinted border (NOT border-2)
        hairline: 'rgba(233, 146, 24, 0.14)',
      },

      fontFamily: {
        // Display / headings — elegant high-contrast serif
        serif: ['"Cormorant Garamond"', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
        // Body / UI
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        // Numeric / code
        mono: ['"Fira Code"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },

      // ONE card radius + ONE control radius. Retire lg/xl/2xl/3xl/full.
      borderRadius: {
        card: '0.5rem', // 8px — cards, panels, modals, tiles
        control: '0.375rem', // 6px — buttons, inputs, chips, small controls
      },

      // ONE soft warm shadow (small elevation scale). Stop gradient-on-everything.
      boxShadow: {
        'soft-sm': '0 1px 2px 0 rgba(18, 10, 6, 0.40)',
        soft: '0 2px 6px -1px rgba(18, 10, 6, 0.45), 0 10px 24px -6px rgba(18, 10, 6, 0.35)',
        'soft-lg': '0 8px 20px -6px rgba(18, 10, 6, 0.55), 0 24px 56px -12px rgba(18, 10, 6, 0.45)',
        // Brass focus ring — pair with :focus-visible
        focus: '0 0 0 3px rgba(233, 146, 24, 0.35)',
      },

      // Semantic spacing on the 4px grid (avoid p-2.5 / px-0.5 improvisation).
      spacing: {
        gutter: '1.5rem', // 24px — standard inner padding for cards / sections
        section: '4rem', // 64px — vertical rhythm between major sections
      },
    },
  },
  plugins: [],
}
