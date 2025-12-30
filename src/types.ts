import type { BuildOptions as EsbuildOptions } from 'esbuild'
import type { BundleOptions as LightningCSSOptions } from 'lightningcss'

/**
 * 入口类型 - 决定使用哪个引擎处理
 */
export type EntryType = 'js' | 'css'

/**
 * 单个入口配置
 */
export interface Entry {
  /** 入口文件路径 */
  input: string
  /** 输出文件名 (不含扩展名) */
  name?: string
}

/**
 * tsbuildx 配置选项
 */
export interface BuildOptions {
  /** 入口文件，支持 glob 模式 */
  entry?: string | string[] | Entry[]

  /** 输出目录，默认 'dist' */
  outDir?: string

  /** 是否生成 sourcemap，默认 false */
  sourcemap?: boolean

  /** 是否压缩，默认 true (production) */
  minify?: boolean

  /** 目标环境，默认 'es2022' */
  target?: string | string[]

  /** 是否清空输出目录，默认 true */
  clean?: boolean

  /** 外部依赖，不打包 */
  external?: string[]

  /** 是否生成 .d.ts 类型文件，默认 true */
  dts?: boolean

  /** esbuild 额外配置 */
  esbuild?: Partial<EsbuildOptions>

  /** lightningcss 额外配置 */
  lightningcss?: Partial<LightningCSSOptions<{}>>
}

/**
 * 解析后的完整配置
 */
export interface ResolvedConfig {
  entry: Entry[]
  outDir: string
  sourcemap: boolean
  minify: boolean
  target: string[]
  clean: boolean
  external: string[]
  dts: boolean
  esbuild: Partial<EsbuildOptions>
  lightningcss: Partial<LightningCSSOptions<{}>>
  /** 工作目录 */
  cwd: string
}

/**
 * 构建结果
 */
export interface BuildResult {
  /** 输出文件列表 */
  outputs: OutputFile[]
  /** 构建耗时 (ms) */
  duration: number
}

/**
 * 输出文件信息
 */
export interface OutputFile {
  /** 文件路径 */
  path: string
  /** 文件大小 (bytes) */
  size: number
  /** 文件类型 */
  type: EntryType
}

/**
 * 定义配置的辅助函数类型
 */
export type DefineConfig = (options: BuildOptions) => BuildOptions


