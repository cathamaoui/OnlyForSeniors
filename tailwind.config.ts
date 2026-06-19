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
        yp: {
          DEFAULT: "#fcd116",
          50: "#fffde7",
          100: "#fff9c4",
          200: "#fff59d",
          300: "#fff176",
          400: "#ffee58",
          500: "#fcd116",
          600: "#f9a825",
          700: "#f57f17",
        },
        ink: "#0a0a0a",
        paper: "#fffdf2",
        dial: "#c8102e",
        // Warm cream/parchment palette — sampled from taste-skill's
        // hero (warm sandstone, slight texture). Used as page background
        // to give the site a softer, warmer feel. Pure white is reserved
        // for cards, inputs, and any surface that needs contrast.
        cream: {
          DEFAULT: "#f3ede4",
          50: "#fbf8f3",
          100: "#f7f2ea",
          200: "#f3ede4",
          300: "#ebe3d5",
          400: "#e0d4bf",
          500: "#cfc1a8",
        },
      },
      fontFamily: {
        // DM Sans — low-contrast geometric sans designed by Colophon Foundry.
        // Crisp, clean, never reads as bold. Optical sizing axis (opsz) so
        // the letterforms stay balanced from 12px captions up to 80px
        // display sizes. Used for all headings.
        display: ['"DM Sans"', "system-ui", "-apple-system", "sans-serif"],
        // Atkinson Hyperlegible — designed by the Braille Institute
        // specifically for low-vision readers. Kept for body text so
        // paragraphs remain maximally accessible to seniors.
        body: ['"Atkinson Hyperlegible"', "system-ui", "sans-serif"],
      },
      fontSize: {
        base: ["1.125rem", { lineHeight: "1.7rem" }],
        lg: ["1.25rem", { lineHeight: "1.85rem" }],
        xl: ["1.5rem", { lineHeight: "2rem" }],
        "2xl": ["1.875rem", { lineHeight: "2.4rem" }],
        "3xl": ["2.25rem", { lineHeight: "2.75rem" }],
        "4xl": ["3rem", { lineHeight: "3.5rem" }],
        "5xl": ["3.75rem", { lineHeight: "4.25rem" }],
      },
      spacing: {
        touch: "3rem",
        "touch-lg": "3.5rem",
      },
      borderRadius: {
        chunky: "0.25rem",
        none: "0",
      },
      boxShadow: {
        yp: "4px 4px 0 0 #000",
        "yp-sm": "2px 2px 0 0 #000",
        "yp-lg": "6px 6px 0 0 #000",
      },
    },
  },
  plugins: [],
};
export default config;
