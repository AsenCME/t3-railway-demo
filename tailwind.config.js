/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  important: true,
  theme: {
    extend: {
      colors: {
        primary: "#000000",
        secondary: "#ff12ab",
      },
    },
  },
  plugins: [],
};
