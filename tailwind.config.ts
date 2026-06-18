import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary: Emerald Green
        emerald: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
          950: "#022c22",
        },
        // Secondary: Warm Cream / Off-white
        cream: {
          50: "#fefdf8",
          100: "#fdf8e8",
          200: "#fbf0c9",
          300: "#f7e29d",
          400: "#f1cf65",
          500: "#e8b83c",
        },
        // Accent: Bold Burnt Orange (warm, friendly, high contrast)
        ember: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
        },
      },
      fontFamily: {
        // Bold, highly readable - perfect for seniors
        display: ['"Bitter"', "Georgia", "serif"],
        body: ['"Atkinson Hyperlegible"', "system-ui", "sans-serif"],
      },
      fontSize: {
        // Base 18px instead of 16px for senior readability
        base: ["1.125rem", { lineHeight: "1.75rem" }],
        lg: ["1.25rem", { lineHeight: "1.875rem" }],
        xl: ["1.5rem", { lineHeight: "2rem" }],
        "2xl": ["1.875rem", { lineHeight: "2.375rem" }],
        "3xl": ["2.25rem", { lineHeight: "2.75rem" }],
        "4xl": ["3rem", { lineHeight: "3.5rem" }],
        "5xl": ["3.75rem", { lineHeight: "4.25rem" }],
      },
      spacing: {
        // Touch-friendly minimum 48px (Apple HIG) for buttons
        "touch": "3rem", // 48px
        "touch-lg": "3.5rem", // 56px
      },
      borderRadius: {
        chunky: "1rem",
      },
      boxShadow: {
        // Strong, visible borders for depth
        "retro": "4px 4px 0 0 rgba(0,0,0,0.85)",
        "retro-emerald": "4px 4px 0 0 #047857",
        "retro-ember": "4px 4px 0 0 #c2410c",
      },
      animation: {
        "float-slow": "float 6s ease-in-out infinite",
        "wiggle": "wiggle 1s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-2deg)" },
          "50%": { transform: "rotate(2deg)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
