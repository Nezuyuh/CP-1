/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#1a3a8a', dark: '#0f2259', light: '#2563eb' },
        accent: { DEFAULT: '#cc1100', dark: '#991100', light: '#ef4444' },
        gold: { DEFAULT: '#f0a500', dark: '#c87000', light: '#fbbf24' },
      },
    },
  },
  plugins: [],
};
