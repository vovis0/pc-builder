/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        bg: "#0d0d12",
        surface: "#13131a",
        border: "#1e1e2a",

        accent: "#a855f7",
        accentDim: "#7c3aed",

        muted: "#3f3f5a",

        text: "#e2e2f0",
        subtle: "#8888aa",
      },

      fontFamily: {
        sans: ["'Space Grotesk'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },

      boxShadow: {
        glow: "0 0 25px rgba(168, 85, 247, 0.25)",
      },

      backdropBlur: {
        xs: "2px",
      },
    },
  },

  plugins: [],
};