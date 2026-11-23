import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["packages/framework/test/**/*.test.ts"],
    setupFiles: ["packages/framework/test/setup.ts"],
    environment: "node",
    sequence: { shuffle: true },
    coverage: {
      provider: "v8",
      enabled: true,
      include: ["packages/framework/src/**/*.ts"],
      reporter: ["text", "html"],
      thresholds: { lines: 100, functions: 100, branches: 100, statements: 100 },
    },
  },
});
