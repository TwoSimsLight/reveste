/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nature: {
          50: '#f2f8f5',
          100: '#e1efe8',
          200: '#c5ded3',
          300: '#9bc4b4',
          400: '#6ea390',
          500: '#4e8674',
          600: '#3c6c5d',
          700: '#32574c',
          800: '#2a463e',
          900: '#1b4332',
          950: '#0e261c',
        },
        sand: {
          50: '#fdfcf9',
          100: '#f9f6ee',
          200: '#f3ece0',
          300: '#e9dcbe',
          400: '#dec79b',
          500: '#d1b17a',
          900: '#3d3224',
        },
        terracotta: {
          500: '#c85a17',
          600: '#b04a0e',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Fraunces"', 'Georgia', 'serif'],
      }
    },
  },
  plugins: [],
}
