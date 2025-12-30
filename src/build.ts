import { rm } from 'node:fs/promises'
import pc from 'picocolors'
import { resolveConfig } from './config.js'
import { buildWithEsbuild, buildWithLightningCSS } from './builders/index.js'
import { getEntryType, formatSize, formatDuration } from './utils.js'
import type { BuildOptions, BuildResult, Entry } from './types.js'

/**
 * 主构建函数
 */
export async function build(options: BuildOptions = {}): Promise<BuildResult> {
  const startTime = performance.now()
  const config = resolveConfig(options)

  // 清空输出目录
  if (config.clean) {
    await rm(config.outDir, { recursive: true, force: true })
  }

  // 按类型分组入口
  const jsEntries: Entry[] = []
  const cssEntries: Entry[] = []

  for (const entry of config.entry) {
    const type = getEntryType(entry.input)
    if (type === 'css') {
      cssEntries.push(entry)
    } else {
      jsEntries.push(entry)
    }
  }

  // 并行构建
  const [jsOutputs, cssOutputs] = await Promise.all([
    buildWithEsbuild(jsEntries, config),
    buildWithLightningCSS(cssEntries, config),
  ])

  const outputs = [...jsOutputs, ...cssOutputs]
  const duration = Math.round(performance.now() - startTime)

  // 打印构建结果
  console.log()
  console.log(pc.green('✓') + pc.bold(' Build completed'))
  console.log()

  for (const output of outputs) {
    const sizeStr = pc.dim(formatSize(output.size))
    const typeStr = output.type === 'css' ? pc.magenta('css') : pc.cyan('js')
    console.log(`  ${typeStr} ${pc.white(output.path)} ${sizeStr}`)
  }

  console.log()
  console.log(pc.dim(`  Done in ${formatDuration(duration)}`))

  return {
    outputs,
    duration,
  }
}


