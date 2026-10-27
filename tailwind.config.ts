import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ember: "var(--ember)",
        flame: "var(--flame)",
        blush: "var(--blush)",
        coral: "var(--coral)",
        "coral-hover": "var(--coral-hover)",
        lavender: "#B39CFF",
        "electric-blue": "#1E90FF",
        "vivid-pink": "#FF0099",
        page: "var(--page)",
        surface: "var(--surface)",
        "surface-strong": "var(--surface-strong)",
        ink: "var(--ink)",
        muted: "var(--muted)",
        line: "var(--line)",
        accent: "var(--accent)",
      },
      fontFamily: {
        sans: [
          '"Plus Jakarta Sans"',
          '"Space Grotesk"',
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        display: [
          '"Syne"',
          '"Space Grotesk"',
          "sans-serif",
        ],
        grotesk: [
          '"Space Grotesk"',
          "sans-serif",
        ],
        serif: [
          '"Instrument Serif"',
          "Georgia",
          "serif",
        ],
        mono: [
          '"JetBrains Mono"',
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
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
