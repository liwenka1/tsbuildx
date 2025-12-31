# tsbuildx

ESM-only bundler powered by esbuild + lightningcss

## Features

- 🚀 **ESM-only** - 仅支持 ES Modules，拥抱现代标准
- ⚡ **极致性能** - esbuild 处理 JS/TS，lightningcss 处理 CSS
- 📦 **零配置** - 开箱即用，可选配置文件
- 🎯 **类型安全** - 根据文件类型自动选择打包策略

## Installation

```bash
pnpm add -D tsbuildx
```

## Usage

### CLI

```bash
# 默认打包 src/index.ts
tsbuildx

# 指定入口
tsbuildx src/main.ts src/styles.css

# 指定输出目录
tsbuildx -o dist

# 更多选项
tsbuildx --help
```

### Programmatic API

```ts
import { build, defineConfig } from "tsbuildx";

// 直接调用
await build({
  entry: ["src/index.ts", "src/styles.css"],
  outDir: "dist"
});

// 使用 defineConfig 获得类型提示
export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "dist",
  minify: true,
  sourcemap: true
});
```

## Options

| Option      | Type                 | Default            | Description        |
| ----------- | -------------------- | ------------------ | ------------------ |
| `entry`     | `string \| string[]` | `['src/index.ts']` | 入口文件           |
| `outDir`    | `string`             | `'dist'`           | 输出目录           |
| `sourcemap` | `boolean`            | `false`            | 生成 sourcemap     |
| `minify`    | `boolean`            | `true`             | 压缩代码           |
| `target`    | `string \| string[]` | `['es2022']`       | 目标环境           |
| `clean`     | `boolean`            | `true`             | 构建前清空输出目录 |
| `external`  | `string[]`           | `[]`               | 外部依赖           |
| `dts`       | `boolean`            | `true`             | 生成类型声明       |

## License

MIT
