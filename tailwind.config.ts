import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // GitHub Dark Theme CSS Variables
        gh: {
          bg: 'var(--gh-bg)',
          'bg-secondary': 'var(--gh-bg-secondary)',
          'bg-tertiary': 'var(--gh-bg-tertiary)',
          'bg-darkest': 'var(--gh-bg-darkest)',
          'bg-code': 'var(--gh-bg-code)',
          border: 'var(--gh-border)',
          'border-subtle': 'var(--gh-border-subtle)',
          'border-muted': 'var(--gh-border-muted)',
          text: 'var(--gh-text)',
          'text-muted': 'var(--gh-text-muted)',
          'text-dim': 'var(--gh-text-dim)',
        },

        // Yellow Accent CSS Variables
        yellowAccent: {
          primary: 'var(--yellow-primary)',
          bright: 'var(--yellow-bright)',
          dark: 'var(--yellow-dark)',
          deep: 'var(--yellow-deep)',
        },

        // Amber Badges CSS Variables
        amberBadge: {
          bg: 'var(--amber-badge-bg)',
          'bg-hover': 'var(--amber-badge-bg-hover)',
          border: 'var(--amber-badge-border)',
          text: 'var(--amber-badge-text)',
        },

        // Contribution Calendar Level CSS Variables
        contrib: {
          0: 'var(--contrib-0)',
          1: 'var(--contrib-1)',
          2: 'var(--contrib-2)',
          3: 'var(--contrib-3)',
          4: 'var(--contrib-4)',
        },

        // Deep charcoal background palette
        background: 'var(--gh-bg)',
        'background-secondary': 'var(--gh-bg-secondary)',
        card: 'var(--gh-bg-secondary)',
        'card-hover': 'var(--gh-bg-tertiary)',
        'card-border': 'var(--gh-border)',
        'card-border-subtle': 'var(--gh-border-subtle)',

        // Brand Accents mapped to Yellow + Dark
        brand: {
          lime: 'var(--yellow-bright)',
          'lime-light': 'var(--yellow-bright)',
          'lime-dark': 'var(--yellow-dark)',
          'lime-glow': 'var(--yellow-glow)',

          purple: 'var(--yellow-primary)',
          'purple-light': 'var(--yellow-bright)',
          'purple-dark': 'var(--yellow-deep)',
          'purple-glow': 'var(--yellow-glow)',

          orange: 'var(--yellow-dark)',
        },

        // Functional Status Colors
        accent: {
          success: 'var(--yellow-bright)',
          warning: 'var(--yellow-primary)',
          danger: '#f43f5e',
          info: 'var(--yellow-bright)',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glow-lime': 'var(--yellow-glow-lg)',
        'glow-purple': 'var(--yellow-glow-lg)',
        'glow-yellow': '0 0 25px -5px rgba(234, 179, 8, 0.35)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
