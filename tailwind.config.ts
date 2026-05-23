import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Palette officielle BeSerene (SKILL_ui.md)
        cream: {
          DEFAULT: "#F2EDE8",
          dark: "#E4DDD6",
        },
        peach: {
          DEFAULT: "#F0B8A8",
          dark: "#C8806A",
          text: "#7A3E2E",
        },
        coral: {
          DEFAULT: "#D4604A",
          light: "#F5D0C8",
          dark: "#8A3020",
        },
        latte: {
          DEFAULT: "#C89878",
          light: "#EDE0D4",
          dark: "#7A5038",
        },
        rain: {
          DEFAULT: "#C8D8DC",
          light: "#E8F0F2",
          dark: "#486878",
        },
        eucal: {
          DEFAULT: "#8A9E98",
          light: "#D4E0DC",
          dark: "#384E48",
        },
        charcoal: "#3A3228",
      },
      fontFamily: {
        // Playfair Display = titres de modules / sections (SKILL_ui)
        display: ["var(--font-playfair)", "Georgia", "serif"],
        // Sans par défaut = system stack + Geist en fallback
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "system-ui",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
export default config;
