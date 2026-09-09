import { defineConfig } from "vitest/config";

export default defineConfig({
  server: { host: true, port: 5173, strictPort: true },
  preview: { host: true, port: 4173, strictPort: true },
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        p01: "p01.html",
      },
    },
  },
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
