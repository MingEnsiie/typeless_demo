import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0f1e3a',
        cyan: '#06b6d4',
      },
    },
  },
  plugins: [],
} satisfies Config;
