import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/hooks/**/*.{ts,tsx}",
    "./src/providers/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        primary: {
          50: "#EEF2FE",
          500: "#4F6EDB",
          600: "#3D57BF",
        },
        accent: {
          50: "#ECFBF3",
          500: "#6EDC9F",
          600: "#4FC485",
        },
        neutral: {
          50: "#F7F8FA",
          200: "#E5E8EE",
          400: "#9AA3B2",
          600: "#4B5568",
          900: "#0F1629",
        },
        danger: {
          50: "#FDECEC",
          500: "#E5484D",
        },
        warning: {
          50: "#FEF4E2",
          500: "#F5A524",
        },
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
      },
      borderRadius: {
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgb(15 22 41 / 0.04), 0 1px 3px 0 rgb(15 22 41 / 0.06)",
        md: "0 4px 12px -2px rgb(15 22 41 / 0.08), 0 2px 4px -1px rgb(15 22 41 / 0.04)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 200ms cubic-bezier(0.22, 1, 0.36, 1)",
        "slide-up": "slide-up 250ms cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
