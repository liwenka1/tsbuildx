import type { BuildOptions } from "./src/types.js";

export default {
  entry: ["src/index.ts", "src/cli.ts"],
  outDir: "dist",
  minify: false,
  dts: true,
  sourcemap: true
} satisfies BuildOptions;
