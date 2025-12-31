import { build as esbuild } from "esbuild";
import { resolve } from "node:path";
import type { ResolvedConfig, Entry, OutputFile } from "../types.js";

/**
 * 使用 esbuild 构建 JS/TS 文件
 */
export async function buildWithEsbuild(entries: Entry[], config: ResolvedConfig): Promise<OutputFile[]> {
  if (entries.length === 0) {
    return [];
  }

  const entryPoints = entries.map((e) => resolve(config.cwd, e.input));

  const result = await esbuild({
    entryPoints,
    outdir: config.outDir,
    bundle: true,
    format: "esm",
    platform: "node",
    target: config.target,
    sourcemap: config.sourcemap,
    minify: config.minify,
    // ESM-only: 所有 node_modules 依赖都设为 external
    packages: "external",
    external: config.external,
    metafile: true,
    splitting: entries.length > 1,
    chunkNames: "chunks/[name]-[hash]",
    ...config.esbuild
  });

  const outputs: OutputFile[] = [];

  if (result.metafile) {
    for (const [outputPath, meta] of Object.entries(result.metafile.outputs)) {
      if (outputPath.endsWith(".js")) {
        outputs.push({
          path: outputPath,
          size: meta.bytes,
          type: "js"
        });
      }
    }
  }

  return outputs;
}
