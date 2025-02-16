/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Ensure Tailwind scans your React files
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        darionBlue: "#1E40AF", // Custom color example
      },
    },
  },
  plugins: [],
};