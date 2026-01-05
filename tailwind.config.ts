import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        carolina: {
          50: "#eef7ff",
          100: "#d8eeff",
          200: "#b6e0ff",
          300: "#84ccff",
          400: "#4bb1ff",
          500: "#1d91ff",
          600: "#0b6fe6",
          700: "#0a58b4",
          800: "#0c4a8f",
          900: "#0d3f75",
        },
        deepblue: {
          50: "#eff4ff",
          100: "#dbe7ff",
          200: "#b8ccff",
          300: "#86a6ff",
          400: "#597dff",
          500: "#3b5cf6",
          600: "#2e45db",
          700: "#2638b2",
          800: "#212f8d",
          900: "#1f2c73",
        },
        accentorange: {
          50: "#fff4ed",
          100: "#ffe4d2",
          200: "#ffc5a3",
          300: "#ff9c69",
          400: "#ff6f2e",
          500: "#ff4a05",
          600: "#e13a00",
          700: "#b92e00",
          800: "#912400",
          900: "#781f00",
        }
      },
    },
  },
  plugins: [],
} satisfies Config;
