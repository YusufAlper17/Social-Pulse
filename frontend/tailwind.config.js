/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  important: true,
  theme: {
    extend: {
      colors: {
        primary: '#6A5ACD',
        secondary: '#4B3EAA',
        background: {
          dark: '#121212',
          medium: '#1E1E1E',
          light: '#2A2A2A'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  }
} 