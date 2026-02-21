/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#1a56db',
          600: '#1648c0',
          700: '#123ba3',
          800: '#0e2d86',
          900: '#0a1f69',
        },
        brt: {
          blue: '#1a56db',
          green: '#059669',
          yellow: '#d97706',
          red: '#dc2626',
          dark: '#0f172a',
          gray: '#64748b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
