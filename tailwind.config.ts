import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        stone: "var(--velnoc-stone)",
        surface: "var(--velnoc-surface)",
        paper: "var(--velnoc-paper)",
        oak: "var(--velnoc-oak)",
        "oak-soft": "var(--velnoc-oak-soft)",
        "oak-deep": "var(--velnoc-oak-deep)",
        terracotta: "var(--velnoc-terracotta)",
        "terracotta-soft": "var(--velnoc-terracotta-soft)"
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)"
      },
      fontFamily: {
        body: "var(--font-body)",
        head: "var(--font-kr-head)",
        mono: "var(--font-mono)"
      }
    }
  },
  plugins: []
};

export default config;
