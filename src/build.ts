import { rm } from "node:fs/promises";
import pc from "picocolors";
import { resolveConfig } from "./config.js";
import { buildWithEsbuild, buildWithLightningCSS, buildDts } from "./builders/index.js";
import { getEntryType, formatSize, formatDuration } from "./utils.js";
import { loadConfigFile } from "./loader.js";
import type { BuildOptions, BuildResult, Entry } from "./types.js";

/**
 * 主构建函数
 */
export async function build(options: BuildOptions = {}): Promise<BuildResult> {
  const startTime = performance.now();
  const cwd = process.cwd();

  // 先加载配置文件（在 clean 之前，避免自举时删除自己）
  const fileConfig = await loadConfigFile(cwd);
  const mergedOptions = { ...fileConfig, ...options };
  const config = resolveConfig(mergedOptions, cwd);

  // 按类型分组入口（在 clean 之前准备好）
  const jsEntries: Entry[] = [];
  const cssEntries: Entry[] = [];

  for (const entry of config.entry) {
    const type = getEntryType(entry.input);
    if (type === "css") {
      cssEntries.push(entry);
    } else {
      jsEntries.push(entry);
    }
  }

  // 清空输出目录
  if (config.clean) {
    await rm(config.outDir, { recursive: true, force: true });
  }

  // 并行构建
  const [jsOutputs, cssOutputs, dtsOutputs] = await Promise.all([
    buildWithEsbuild(jsEntries, config),
    buildWithLightningCSS(cssEntries, config),
    buildDts(jsEntries, config)
  ]);

  const outputs = [...jsOutputs, ...cssOutputs, ...dtsOutputs];
  const duration = Math.round(performance.now() - startTime);

  // 打印构建结果
  console.log();
  console.log(pc.green("✓") + pc.bold(" Build completed"));
  console.log();

  for (const output of outputs) {
    const sizeStr = pc.dim(formatSize(output.size));
    const isDts = output.path.endsWith(".d.ts");
    const typeStr = output.type === "css" ? pc.magenta("css") : isDts ? pc.yellow("dts") : pc.cyan("js");
    console.log(`  ${typeStr} ${pc.white(output.path)} ${sizeStr}`);
  }

  console.log();
  console.log(pc.dim(`  Done in ${formatDuration(duration)}`));

  return {
    outputs,
    duration
  };
}
