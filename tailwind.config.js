/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Chad Tech Hub Brand Colors
        chad: {
          blue: "#1e40af",
          gold: "#f59e0b",
          green: "#059669",
        },
      },
    },
  },
  plugins: [],
};
