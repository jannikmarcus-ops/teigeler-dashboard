/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Corporate Design Teigeler & Partner (siehe tp-einwertungsdossier)
        tp: {
          forest: '#052E26',        // Primaergruen (Headlines, Zahlen, Akzente)
          'forest-deep': '#03211B', // Dunkelgruen (dunkle Sektionen)
          sage: '#56826F',          // Salbei-Akzent
          'sage-soft': '#E9EFEA',   // Helles Salbeigruen (Badges, Hervorhebung)
          stone: '#6D6E72',         // Grau (Meta, Labels)
          paper: '#F5F2F0',         // Warm-Beige (Body-Hintergrund)
          ink: '#333333',           // Dunkelgrau (Haupttext)
          line: '#E6E1DC',          // Hellbeige (Borders, Divider)
        },
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
