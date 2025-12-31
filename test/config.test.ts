import { resolve } from "node:path";
import { describe, it, expect } from "vitest";
import { resolveConfig, defineConfig } from "../src/config.js";

const TEST_CWD = resolve("/test/project");

describe("resolveConfig", () => {
  it("should use default values when no options provided", () => {
    const config = resolveConfig({}, TEST_CWD);

    expect(config.entry).toEqual([{ input: "src/index.ts" }]);
    expect(config.outDir).toBe(resolve(TEST_CWD, "dist"));
    expect(config.sourcemap).toBe(false);
    expect(config.minify).toBe(true);
    expect(config.target).toEqual(["es2022"]);
    expect(config.clean).toBe(true);
    expect(config.external).toEqual([]);
    expect(config.dts).toBe(true);
  });

  it("should normalize string entry to array", () => {
    const config = resolveConfig({ entry: "src/main.ts" });

    expect(config.entry).toEqual([{ input: "src/main.ts" }]);
  });

  it("should normalize array of strings to Entry objects", () => {
    const config = resolveConfig({ entry: ["src/a.ts", "src/b.ts"] });

    expect(config.entry).toEqual([{ input: "src/a.ts" }, { input: "src/b.ts" }]);
  });

  it("should keep Entry objects as is", () => {
    const config = resolveConfig({
      entry: [{ input: "src/main.ts", name: "bundle" }]
    });

    expect(config.entry).toEqual([{ input: "src/main.ts", name: "bundle" }]);
  });

  it("should normalize target to array", () => {
    const config = resolveConfig({ target: "es2020" });

    expect(config.target).toEqual(["es2020"]);
  });

  it("should override default values", () => {
    const config = resolveConfig(
      {
        outDir: "build",
        sourcemap: true,
        minify: false,
        clean: false,
        dts: false,
        external: ["lodash"]
      },
      TEST_CWD
    );

    expect(config.outDir).toBe(resolve(TEST_CWD, "build"));
    expect(config.sourcemap).toBe(true);
    expect(config.minify).toBe(false);
    expect(config.clean).toBe(false);
    expect(config.dts).toBe(false);
    expect(config.external).toEqual(["lodash"]);
  });
});

describe("defineConfig", () => {
  it("should return the same config (for type inference)", () => {
    const input = { entry: "src/index.ts", minify: true };
    const output = defineConfig(input);

    expect(output).toBe(input);
  });
});
