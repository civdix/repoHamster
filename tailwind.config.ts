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
        // Deep charcoal background palette inspired by Linear, Raycast, Discord
        background: '#0a0d14',
        'background-secondary': '#0e121c',
        card: '#131826',
        'card-hover': '#181e30',
        'card-border': '#21293f',
        'card-border-subtle': '#192033',

        // Brand Accents: Electric Lime & Vibrant Purple
        brand: {
          lime: '#a3e635',       // Electric lime primary
          'lime-light': '#bef264',
          'lime-dark': '#65a30d',
          'lime-glow': 'rgba(163, 230, 53, 0.15)',

          purple: '#a855f7',     // Vibrant purple secondary
          'purple-light': '#c084fc',
          'purple-dark': '#7e22ce',
          'purple-glow': 'rgba(168, 85, 247, 0.15)',

          orange: '#fb923c',     // Hamster cheek & accent
        },

        // Functional Status Colors
        accent: {
          success: '#a3e635',    // electric lime for pass
          warning: '#fbbf24',    // amber
          danger: '#f43f5e',     // rose
          info: '#38bdf8',       // sky
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glow-lime': '0 0 25px -5px rgba(163, 230, 53, 0.25)',
        'glow-purple': '0 0 25px -5px rgba(168, 85, 247, 0.25)',
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
  plugins: [],
};

export default config;
