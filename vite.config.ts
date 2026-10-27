import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  build: {
    target: "esnext",
    cssCodeSplit: true,
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("three")) {
              return "vendor-three";
            }
            if (id.includes("framer-motion")) {
              return "vendor-framer";
            }
            if (id.includes("gsap") || id.includes("@gsap")) {
              return "vendor-gsap";
            }
            if (id.includes("lucide-react")) {
              return "vendor-icons";
            }
            if (
              id.includes("react-router") ||
              id.includes("react-dom") ||
              id.includes("/react/") ||
              id.endsWith("/react")
            ) {
              return "vendor-react";
            }
          }
        },
      },
    },
  },
});
