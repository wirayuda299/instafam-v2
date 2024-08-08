import { configDefaults, defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom",
    globals: true,
    coverage: {
      provider: "istanbul",
    },
    alias: {
      "@/": new URL("./", import.meta.url).pathname,
    },
    exclude: [...configDefaults.exclude, "/lib", "types", "node_modules"],
  },
});
