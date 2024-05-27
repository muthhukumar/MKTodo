/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "matt-black": "#1C1C1C",
        "dark-matt-black": "#1C1C1C",
        smoke: "#797979",
      },
    },
  },
  plugins: [],
};
