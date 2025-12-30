import { extname } from 'node:path'
import type { EntryType } from './types.js'

/**
 * JS/TS 文件扩展名
 */
const JS_EXTENSIONS = new Set(['.js', '.mjs', '.ts', '.mts', '.tsx', '.jsx'])

/**
 * CSS 文件扩展名
 */
const CSS_EXTENSIONS = new Set(['.css'])

/**
 * 根据文件扩展名判断入口类型
 */
export function getEntryType(filePath: string): EntryType {
  const ext = extname(filePath).toLowerCase()

  if (CSS_EXTENSIONS.has(ext)) {
    return 'css'
  }

  if (JS_EXTENSIONS.has(ext)) {
    return 'js'
  }

  // 默认当作 JS 处理
  return 'js'
}

/**
 * 获取输出文件扩展名
 */
export function getOutputExtension(type: EntryType): string {
  return type === 'css' ? '.css' : '.js'
}

/**
 * 格式化文件大小
 */
export function formatSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

/**
 * 格式化耗时
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`
  }
  return `${(ms / 1000).toFixed(2)}s`
}


