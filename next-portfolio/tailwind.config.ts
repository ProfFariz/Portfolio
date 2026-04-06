import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        border: "var(--border)",
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
        display: ["var(--font-syne)"],
        mono: ["var(--font-jetbrains-mono)"],
      },
      animation: {
        float: "float 10s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
