import { spawn } from "node:child_process";
import { writeFile, readFile, mkdir } from "node:fs/promises";
import { resolve, basename, relative } from "node:path";
import type { ResolvedConfig, Entry, OutputFile } from "../types.js";

/**
 * 使用 TypeScript 编译器生成 .d.ts 文件
 */
export async function buildDts(entries: Entry[], config: ResolvedConfig): Promise<OutputFile[]> {
  if (entries.length === 0 || !config.dts) {
    return [];
  }

  // 过滤出 TypeScript 文件
  const tsEntries = entries.filter((e) => /\.(ts|tsx|mts)$/.test(e.input) && !e.input.endsWith(".d.ts"));

  if (tsEntries.length === 0) {
    return [];
  }

  const outputs: OutputFile[] = [];

  // 确保输出目录存在
  await mkdir(config.outDir, { recursive: true });

  // 创建临时 tsconfig 用于生成 dts
  const tempTsConfig = {
    compilerOptions: {
      declaration: true,
      emitDeclarationOnly: true,
      outDir: config.outDir,
      moduleResolution: "bundler",
      module: "ESNext",
      target: "ESNext",
      strict: true,
      skipLibCheck: true,
      esModuleInterop: true
    },
    files: tsEntries.map((e) => resolve(config.cwd, e.input))
  };

  const tempConfigPath = resolve(config.outDir, ".dts-tsconfig.json");
  await writeFile(tempConfigPath, JSON.stringify(tempTsConfig, null, 2));

  try {
    await runTsc(tempConfigPath, config.cwd);

    // 收集生成的 .d.ts 文件信息
    for (const entry of tsEntries) {
      const inputBasename = basename(entry.input, /\.(ts|tsx|mts)$/.exec(entry.input)?.[0] ?? ".ts");
      const dtsPath = resolve(config.outDir, `${inputBasename}.d.ts`);

      try {
        const content = await readFile(dtsPath);
        outputs.push({
          path: relative(config.cwd, dtsPath),
          size: content.length,
          type: "js"
        });
      } catch {
        // 文件可能不存在
      }
    }
  } finally {
    // 清理临时配置文件
    try {
      const { unlink } = await import("node:fs/promises");
      await unlink(tempConfigPath);
    } catch {
      // 忽略清理错误
    }
  }

  return outputs;
}

/**
 * 运行 tsc 命令
 */
function runTsc(configPath: string, cwd: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const tsc = spawn("npx", ["tsc", "-p", configPath], {
      cwd,
      stdio: ["ignore", "pipe", "pipe"]
    });

    let stderr = "";

    tsc.stderr?.on("data", (data) => {
      stderr += data.toString();
    });

    tsc.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`tsc failed with code ${code}: ${stderr}`));
      }
    });

    tsc.on("error", reject);
  });
}
