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
        dashboard: {
          bg: '#1a1d21',
          card: '#32373c',
          border: '#4a4f55',
          text: '#F8FAFC',
          muted: '#9ca3af',
          accent: '#3B82F6',
          success: '#22C55E',
          gold: '#F59E0B',
          silver: '#94A3B8',
          bronze: '#D97706',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
