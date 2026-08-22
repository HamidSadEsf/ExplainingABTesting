import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          950: "#020617",
          850: "#16213c",
        },
        blue: {
          950: "#172554",
          850: "#1e3a5f",
        },
        emerald: {
          950: "#022c22",
          850: "#064e3b",
        },
        amber: {
          950: "#451a03",
          850: "#78350f",
        },
        rose: {
          950: "#4c0519",
          850: "#881337",
        },
      },
    },
  },
  plugins: [],
};

export default config;