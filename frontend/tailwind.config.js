/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        forest: {
          50: "#eef8ef",
          100: "#d7eed8",
          200: "#b2ddb5",
          300: "#7fc586",
          400: "#4eaa58",
          500: "#2f8f3b",
          600: "#21752c",
          700: "#1d5d27",
          800: "#194a22",
          900: "#153d1d"
        },
        soil: "#7c5c3e",
        wheat: "#f3c969"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(21, 61, 29, 0.12)"
      }
    }
  },
  plugins: []
};
