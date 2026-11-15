import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1a1714",
        muted: "#5e574e",
        paper: "#f3eee4",
        card: "#fffdf8",
        line: "#e3d9c6",
        green: {
          DEFAULT: "#0e6b45",
          deep: "#073d28",
        },
        gold: "#e2b340",
        maths: "#0e6b45",
        pct: "#b86e00",
        svt: "#1d6a78",
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-outfit)", "Segoe UI", "sans-serif"],
      },
      boxShadow: {
        card: "0 16px 40px rgba(26, 23, 20, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
