/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        '12': 'repeat(12, minmax(0, 1fr))',
      },
      gridColumn: {
        'span-3':  'span 3 / span 3',
        'span-4':  'span 4 / span 4',
        'span-5':  'span 5 / span 5',
        'span-6':  'span 6 / span 6',
        'span-7':  'span 7 / span 7',
        'span-8':  'span 8 / span 8',
        'span-9':  'span 9 / span 9',
        'span-12': 'span 12 / span 12',
      },
    },
  },
  plugins: [],
}
