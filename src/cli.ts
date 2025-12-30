#!/usr/bin/env node

import { cac } from 'cac'
import pc from 'picocolors'
import { build } from './build.js'
import { version } from '../package.json' with { type: 'json' }

const cli = cac('tsbuildx')

cli
  .command('[...entry]', 'Build TypeScript/JavaScript/CSS files')
  .option('-o, --out-dir <dir>', 'Output directory', { default: 'dist' })
  .option('--sourcemap', 'Generate sourcemaps')
  .option('--no-minify', 'Disable minification')
  .option('--no-clean', 'Do not clean output directory')
  .option('--no-dts', 'Do not generate .d.ts files')
  .option('--target <target>', 'Target environment (e.g., es2022, node18)')
  .option('--external <deps>', 'External dependencies (comma separated)')
  .action(async (entry: string[], options) => {
    try {
      await build({
        entry: entry.length > 0 ? entry : undefined,
        outDir: options.outDir,
        sourcemap: options.sourcemap,
        minify: options.minify,
        clean: options.clean,
        dts: options.dts,
        target: options.target,
        external: options.external?.split(','),
      })
    } catch (error) {
      console.error(pc.red('Build failed:'))
      console.error(error)
      process.exit(1)
    }
  })

cli.help()
cli.version(version)

cli.parse()


