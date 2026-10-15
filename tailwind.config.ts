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
        monastery: {
          dark: "#0d0a08",
          card: "#18120e",
          cardborder: "#3d2a1d",
          walnut: "#3A1F10",
          crimson: "#8B1E24",
          crimsonDark: "#581014",
          gold: "#D4AF37",
          goldLight: "#F5D77F",
          teak: "#E6C79C",
          rosewood: "#4A2E1B",
          saffron: "#E67E22",
          ivory: "#F5EFE6",
          bronze: "#1F1A17",
          jade: "#059669",
        },
      },
      fontFamily: {
        serif: ["Cinzel", "Cinzel Decorative", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 25px rgba(212, 175, 55, 0.35)",
        crimsonGlow: "0 0 25px rgba(139, 30, 36, 0.45)",
        jadeGlow: "0 0 20px rgba(5, 150, 105, 0.4)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "diyo-flicker": "flicker 2s ease-in-out infinite alternate",
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: "1", filter: "brightness(1)" },
          "50%": { opacity: "0.85", filter: "brightness(1.15)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
