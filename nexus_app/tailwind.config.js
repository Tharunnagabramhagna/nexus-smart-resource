/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        neon: '0 0 24px rgba(96, 165, 250, 0.35)',
      },
    },
  },
  plugins: [],
};
