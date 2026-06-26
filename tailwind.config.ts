import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0f766e',
          foreground: '#f0fdfa',
        },
        secondary: {
          DEFAULT: '#334155',
          foreground: '#f8fafc',
        },
        muted: {
          DEFAULT: '#e2e8f0',
          foreground: '#475569',
        },
      },
    },
  },
  plugins: [],
};

export default config;
