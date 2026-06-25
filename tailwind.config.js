/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // 藍灰主色系，專業乾淨
        brand: {
          50: '#f1f5f9',
          100: '#e2e8f0',
          200: '#cbd5e1',
          500: '#475569',
          600: '#334155',
          700: '#1e293b',
        },
      },
    },
  },
  plugins: [],
}
