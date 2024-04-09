import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import path from "path";

const resolve = (f) => path.resolve(__dirname, f);

export default defineConfig({
  plugins: [preact()],
  base: "/static/",
  build: {
    manifest: true,
    outDir: resolve("./build"),
    rollupOptions: {
      input: {
        index: resolve("src/index.jsx"),
      },
    },
  },
});
