import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        primary: {
          50: "#EEF2FE",
          100: "#DCE4FD",
          200: "#B9C9FB",
          300: "#8FA6F2",
          400: "#6B85E5",
          500: "#4F6EDB",
          600: "#3D57BF",
          700: "#2F4499",
          900: "#1E2C66",
        },
        accent: {
          50: "#ECFBF3",
          100: "#D6F6E4",
          200: "#AEEDC9",
          400: "#82E2AB",
          500: "#6EDC9F",
          600: "#4FC485",
          700: "#3AA66C",
        },
        neutral: {
          50: "#F7F8FA",
          100: "#EFF1F5",
          200: "#E5E8EE",
          300: "#CFD3DC",
          400: "#9AA3B2",
          500: "#6B7388",
          600: "#4B5568",
          700: "#323848",
          800: "#1C2030",
          900: "#0F1629",
        },
        danger: { 50: "#FDECEC", 500: "#E5484D" },
        warning: { 50: "#FEF4E2", 500: "#F5A524" },
        success: { 50: "#ECFBF3", 500: "#22C55E", 600: "#16A34A" },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "2xs": ["0.75rem", { lineHeight: "1rem" }],
        xs: ["0.8125rem", { lineHeight: "1.125rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.625rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "1.875rem" }],
        "3xl": ["2rem", { lineHeight: "2.375rem" }],
        "4xl": ["2.5rem", { lineHeight: "2.875rem" }],
        "5xl": ["3rem", { lineHeight: "3.25rem" }],
        "6xl": ["3.75rem", { lineHeight: "4rem" }],
      },
      borderRadius: {
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgb(15 22 41 / 0.04), 0 1px 3px 0 rgb(15 22 41 / 0.06)",
        md: "0 4px 12px -2px rgb(15 22 41 / 0.08), 0 2px 4px -1px rgb(15 22 41 / 0.04)",
        lg: "0 12px 32px -8px rgb(15 22 41 / 0.12), 0 4px 8px -2px rgb(15 22 41 / 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
