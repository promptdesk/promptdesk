import { defineConfig, mergeConfig } from "vitest/config";
//import react from '@vitejs/plugin-react'
import { fileURLToPath } from "node:url";
import viteConfig from "./vite.config";

// https://vitejs.dev/config/
export default defineConfig({
  //plugins: [react()],
  viteConfig,
  test: {
    environment: "jsdom",
    globals: true,
    files: "src/**/*.test.{ts,tsx}",
    setupFiles: ["./setup-vitest.ts"],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
