/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: "#08080a",
          secondary: "#121216",
          card: "#181820",
          hover: "#22222d",
        },
        accent: {
          DEFAULT: "#0066ff",
          blue: "#2f57ff",
          silver: "#8e8e93",
          lightBlue: "#e5efff"
        }
      },
      fontFamily: {
        display: ["Syne", "sans-serif"],
        sans: ["Plus Jakarta Sans", "sans-serif"],
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
      }
    },
  },
  plugins: [],
}
