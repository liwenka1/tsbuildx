import { bundle } from "lightningcss";
import { resolve, basename } from "node:path";
import { writeFile, mkdir } from "node:fs/promises";
import type { ResolvedConfig, Entry, OutputFile } from "../types.js";

/**
 * 使用 lightningcss 构建 CSS 文件
 */
export async function buildWithLightningCSS(entries: Entry[], config: ResolvedConfig): Promise<OutputFile[]> {
  if (entries.length === 0) {
    return [];
  }

  const outputs: OutputFile[] = [];

  // 确保输出目录存在
  await mkdir(config.outDir, { recursive: true });

  for (const entry of entries) {
    const inputPath = resolve(config.cwd, entry.input);
    const outputName = entry.name ?? basename(entry.input, ".css");
    const outputPath = resolve(config.outDir, `${outputName}.css`);

    const result = bundle({
      filename: inputPath,
      minify: config.minify,
      sourceMap: config.sourcemap,
      ...config.lightningcss
    });

    await writeFile(outputPath, result.code);

    if (config.sourcemap && result.map) {
      await writeFile(`${outputPath}.map`, result.map);
    }

    outputs.push({
      path: outputPath,
      size: result.code.length,
      type: "css"
    });
  }

  return outputs;
}
