import { pathToFileURL } from "node:url";
import { resolve, dirname } from "node:path";
import { access, unlink } from "node:fs/promises";
import { build as esbuild } from "esbuild";
import type { BuildOptions } from "./types.js";

/**
 * 支持的配置文件名
 */
const CONFIG_FILES = ["tsbuildx.config.ts", "tsbuildx.config.mts", "tsbuildx.config.js", "tsbuildx.config.mjs"];

/**
 * 查找配置文件
 */
async function findConfigFile(cwd: string): Promise<string | null> {
  for (const filename of CONFIG_FILES) {
    const filepath = resolve(cwd, filename);
    try {
      await access(filepath);
      return filepath;
    } catch {
      // 文件不存在，继续查找
    }
  }
  return null;
}

/**
 * 加载配置文件
 */
export async function loadConfigFile(cwd: string = process.cwd()): Promise<BuildOptions | null> {
  const configPath = await findConfigFile(cwd);

  if (!configPath) {
    return null;
  }

  // 如果是 TypeScript 文件，需要先编译
  if (configPath.endsWith(".ts") || configPath.endsWith(".mts")) {
    return loadTsConfig(configPath);
  }

  // JS 文件直接导入
  return loadJsConfig(configPath);
}

/**
 * 加载 TypeScript 配置文件
 */
async function loadTsConfig(configPath: string): Promise<BuildOptions> {
  // 使用 esbuild 编译 TypeScript 配置文件到临时 JS 文件
  const tempOutputPath = resolve(dirname(configPath), `.tsbuildx.config.${Date.now()}.mjs`);

  try {
    await esbuild({
      entryPoints: [configPath],
      bundle: false,
      platform: "node",
      format: "esm",
      outfile: tempOutputPath,
      target: "node18"
    });

    const fileUrl = pathToFileURL(tempOutputPath).href;
    const module = await import(fileUrl);
    return module.default ?? module;
  } finally {
    // 清理临时文件
    try {
      await unlink(tempOutputPath);
    } catch {
      // 忽略清理错误
    }
  }
}

/**
 * 加载 JavaScript 配置文件
 */
async function loadJsConfig(configPath: string): Promise<BuildOptions> {
  const fileUrl = pathToFileURL(configPath).href;
  const module = await import(fileUrl);
  return module.default ?? module;
}
