#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const data = JSON.parse(await fs.readFile(path.join(root, 'data/startup-50.json'), 'utf8'))
const sourceDir = path.join(root, 'media', 'startup-50')
const output = '/private/tmp/startup-50-logo-sheet.png'
const columns = 5
const tileWidth = 240
const tileHeight = 150
const rows = Math.ceil(data.entries.length / columns)

const escapeXml = (value) => value.replace(/[<>&'"]/g, (character) => ({
  '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;'
})[character])

const composites = []
for (const [index, entry] of data.entries.entries()) {
  const x = (index % columns) * tileWidth
  const y = Math.floor(index / columns) * tileHeight
  const file = path.join(sourceDir, `${entry.slug}.webp`)
  try {
    const logo = await sharp(file)
      .resize({ width: 190, height: 92, fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toBuffer()
    composites.push({ input: logo, left: x + 25, top: y + 12 })
  } catch {
    // A missing file stays visibly blank and is labelled below.
  }
  const label = Buffer.from(`<svg width="${tileWidth}" height="42" xmlns="http://www.w3.org/2000/svg">
    <text x="12" y="17" font-family="Arial, sans-serif" font-size="13" font-weight="700" fill="#202122">${escapeXml(entry.name)}</text>
    <text x="12" y="34" font-family="Arial, sans-serif" font-size="11" fill="#72777d">${index + 1}. ${escapeXml(entry.slug)}</text>
  </svg>`)
  composites.push({ input: label, left: x, top: y + 105 })
}

const grid = Buffer.from(`<svg width="${columns * tileWidth}" height="${rows * tileHeight}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="none" stroke="#a2a9b1"/>
  ${Array.from({ length: columns - 1 }, (_, index) => `<path d="M${(index + 1) * tileWidth} 0V${rows * tileHeight}" stroke="#c8ccd1"/>`).join('')}
  ${Array.from({ length: rows - 1 }, (_, index) => `<path d="M0 ${(index + 1) * tileHeight}H${columns * tileWidth}" stroke="#c8ccd1"/>`).join('')}
</svg>`)
composites.push({ input: grid, left: 0, top: 0 })

await sharp({
  create: {
    width: columns * tileWidth,
    height: rows * tileHeight,
    channels: 4,
    background: '#ffffff'
  }
}).composite(composites).png().toFile(output)

console.log(output)
