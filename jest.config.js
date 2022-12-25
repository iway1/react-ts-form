/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  testPathIgnorePatterns: ["utils"],
  // globals: {
  //   "ts-jest": {
  //     tsConfig: "tsconfig.json",
  //   },
  // },
};
