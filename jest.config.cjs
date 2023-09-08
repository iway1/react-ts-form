/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testTimeout: process.env.JEST_TIMEOUT
    ? parseInt(process.env.JEST_TIMEOUT)
    : undefined,
  testEnvironment: "jsdom",
  testPathIgnorePatterns: ["utils", "lib"],
  restoreMocks: true,
  collectCoverageFrom: [
    "src/**/*.ts",
    "src/**/*.tsx",
    "!src/index.ts",
    "src/playgroundFile.tsx",
  ],
  coveragePathIgnorePatterns: ["src/__tests__/utils"],
};
