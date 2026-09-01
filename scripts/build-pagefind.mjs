#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { resolveBuildOutput } from './build-output.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const { htmlDir, isStaticExport } = resolveBuildOutput(root)
const publicIndex = path.join(root, 'public', '_pagefind')
const outputDir = isStaticExport ? path.join(root, 'out', '_pagefind') : publicIndex
const pagefindRunner = path.join(root, 'node_modules', 'pagefind', 'lib', 'runner', 'bin.cjs')

fs.rmSync(outputDir, { recursive: true, force: true })

const result = spawnSync(
  process.execPath,
  [pagefindRunner, '--site', htmlDir, '--output-path', outputDir],
  { cwd: root, stdio: 'inherit' }
)

if (result.error) throw result.error
if (result.status !== 0) process.exit(result.status ?? 1)

if (isStaticExport) {
  fs.rmSync(publicIndex, { recursive: true, force: true })
  fs.cpSync(outputDir, publicIndex, { recursive: true })

  for (const file of ['sitemap.xml', 'robots.txt', 'llms.txt', 'llms-full.txt']) {
    const src = path.join(root, 'public', file)
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(root, 'out', file))
    }
  }
}

console.log(
  `Pagefind: indexed ${path.relative(root, htmlDir)} into ${path.relative(root, outputDir)}`
)
