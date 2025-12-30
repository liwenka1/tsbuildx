import { resolve } from 'node:path'
import type { BuildOptions, ResolvedConfig, Entry } from './types.js'

/**
 * 默认配置
 */
const defaultConfig: Omit<ResolvedConfig, 'cwd' | 'entry'> = {
  outDir: 'dist',
  sourcemap: false,
  minify: true,
  target: ['es2022'],
  clean: true,
  external: [],
  dts: true,
  esbuild: {},
  lightningcss: {},
}

/**
 * 规范化入口配置
 */
function normalizeEntry(entry: BuildOptions['entry']): Entry[] {
  if (!entry) {
    return [{ input: 'src/index.ts' }]
  }

  if (typeof entry === 'string') {
    return [{ input: entry }]
  }

  if (Array.isArray(entry)) {
    return entry.map((e) => (typeof e === 'string' ? { input: e } : e))
  }

  return [{ input: 'src/index.ts' }]
}

/**
 * 规范化 target 配置
 */
function normalizeTarget(target: BuildOptions['target']): string[] {
  if (!target) {
    return defaultConfig.target
  }
  return Array.isArray(target) ? target : [target]
}

/**
 * 解析并合并配置
 */
export function resolveConfig(
  options: BuildOptions = {},
  cwd: string = process.cwd()
): ResolvedConfig {
  return {
    entry: normalizeEntry(options.entry),
    outDir: resolve(cwd, options.outDir ?? defaultConfig.outDir),
    sourcemap: options.sourcemap ?? defaultConfig.sourcemap,
    minify: options.minify ?? defaultConfig.minify,
    target: normalizeTarget(options.target),
    clean: options.clean ?? defaultConfig.clean,
    external: options.external ?? defaultConfig.external,
    dts: options.dts ?? defaultConfig.dts,
    esbuild: options.esbuild ?? defaultConfig.esbuild,
    lightningcss: options.lightningcss ?? defaultConfig.lightningcss,
    cwd,
  }
}

/**
 * 定义配置 - 提供类型提示的辅助函数
 */
export function defineConfig(options: BuildOptions): BuildOptions {
  return options
}


