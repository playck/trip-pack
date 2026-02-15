import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(process.cwd(), "src") },
  },
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    react(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "chakra": ["@chakra-ui/react", "@emotion/react", "@emotion/styled"],
          "motion": ["framer-motion"],
          "supabase": ["@supabase/supabase-js"],
          "router": ["@tanstack/react-router"],
          "query": ["@tanstack/react-query"],
          "google-maps": ["@vis.gl/react-google-maps"],
        },
      },
    },
  },
});
