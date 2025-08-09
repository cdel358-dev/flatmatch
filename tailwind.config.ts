import type { Config } from 'tailwindcss';

export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx,css}',
  ],
  darkMode: 'class',
  theme: {
    container: { center: true, padding: '1rem' },
    extend: {
      colors: {
        brand: {
          DEFAULT: '#2563eb',
          foreground: '#ffffff',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;