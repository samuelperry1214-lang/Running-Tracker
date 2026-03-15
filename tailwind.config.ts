import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#F5F0E6',
          dark: '#EDE6D6',
          card: '#FDFCF9',
        },
        track: {
          red:    '#D92B2B',
          orange: '#F47C20',
          yellow: '#D4A017',
          lime:   '#5A9E3A',
          green:  '#2E8B7A',
          teal:   '#00889E',
          blue:   '#2B5FD9',
          indigo: '#4B3FCF',
          purple: '#8B2FC9',
          coral:  '#E8634A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 4px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
};

export default config;
