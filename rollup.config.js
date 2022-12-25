import typescript from "@rollup/plugin-typescript";
const isWatching = process.env.ROLLUP_WATCH;

export default [
  {
    input: "src/index.ts",
    plugins: [
      typescript({ tsconfig: "tsconfig.json" }),
      // resolve(),
      // babel({
      //     exclude: "node_modules/**",
      //     presets: ["@babel/env", "@babel/preset-react"],
      // }),
      // commonjs(),
    ],
    output: [
      { file: "lib/index.js", format: "cjs" },
      { file: "lib/index.mjs", format: "es" },
    ],
  },
];
