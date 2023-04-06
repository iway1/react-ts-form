import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    restoreMocks: true,

    coverage: {
      include: [
        "src/**/*.ts",
        "src/**/*.tsx",
        "!src/index.ts",
        "src/playgroundFile.tsx",
      ],
      exclude: ["src/__tests__/utils"],
      provider: "istanbul",
    },
    globals: true,
  },
});
