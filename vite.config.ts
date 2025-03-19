import { defineConfig } from "vite";
import { resolve } from "path";
import { fileURLToPath } from "url";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "RagnaSDK",
      fileName: (format) => `ragna-sdk.${format}.js`,
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["axios"],
      output: {
        globals: {
          axios: "axios",
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  plugins: [
    dts({
      // insertTypesEntry: true,
      rollupTypes: true, // Combine all types into a single declaration file
      // outDir: "dist",
      // entryRoot: "src",
      // tsconfigPath: "./tsconfig.json",
    }),
  ],
});
