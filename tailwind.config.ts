import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ember: "#DF6C4F",
        flame: "#D14836",
        blush: "#FF9398",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      boxShadow: {
        shape: "0 24px 70px rgb(209 72 54 / 0.24)",
        "shape-dark": "0 24px 80px rgb(255 147 152 / 0.18)",
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        "float-slow": "float 10s ease-in-out infinite",
        reveal: "reveal 0.8s ease both",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translate3d(0, 0, 0) rotate(0deg)" },
          "50%": { transform: "translate3d(0, -18px, 0) rotate(3deg)" },
        },
        reveal: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
