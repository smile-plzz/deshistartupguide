#!/usr/bin/env node
/*
FORM: Code-led editorial folio; chosen form 7 of 7; concept-seed key 43206b6f.
*/
import fs from 'node:fs/promises'
import fsSync from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import * as fontkit from 'fontkit'
import sharp from 'sharp'
import socialImages from '../data/social-images.json' with { type: 'json' }

export const CARD_WIDTH = 1200
export const CARD_HEIGHT = 630

const PNG_TEXT_KEY = 'impeccable:prompt'
const crcTable = (() => {
  const table = new Uint32Array(256)
  for (let value = 0; value < 256; value += 1) {
    let crc = value
    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1
    }
    table[value] = crc >>> 0
  }
  return table
})()

function crc32(data) {
  let crc = 0xffffffff
  for (const byte of data) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}

function pngChunk(type, data) {
  const chunk = Buffer.alloc(12 + data.length)
  chunk.writeUInt32BE(data.length, 0)
  chunk.write(type, 4, 'ascii')
  data.copy(chunk, 8)
  chunk.writeUInt32BE(crc32(Buffer.concat([Buffer.from(type, 'ascii'), data])), 8 + data.length)
  return chunk
}

export function embedSocialImageProvenance(png, prompt) {
  const iend = png.indexOf(Buffer.from('IEND', 'ascii')) - 4
  if (iend < 8) throw new Error('Generated social image is not a valid PNG')
  if (!prompt?.trim()) throw new Error('Social-image provenance is required')
  const text = Buffer.concat([
    Buffer.from(PNG_TEXT_KEY, 'latin1'),
    Buffer.from([0]),
    Buffer.from(prompt, 'utf8')
  ])
  return Buffer.concat([png.subarray(0, iend), pngChunk('tEXt', text), png.subarray(iend)])
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export function createSocialImageFont(fontData) {
  if (!fontData?.length) throw new Error('Social-image Bengali font file is missing or empty')
  const font = fontkit.create(fontData)
  if (!font || font.type !== 'WOFF2' || !font.characterSet?.includes(0x0995)) {
    throw new Error('Social-image font does not contain Bengali glyphs')
  }
  return font
}

export function renderFolioSocialSvg() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${CARD_WIDTH}" height="${CARD_HEIGHT}" viewBox="0 0 ${CARD_WIDTH} ${CARD_HEIGHT}">
  <!-- Startup 50 social image: an editorial folio, not a miniature web page. -->
  <rect width="1200" height="630" fill="#fbfaf7"/>
  <rect width="400" height="630" fill="#064e3b"/>
  <line x1="468" y1="132" x2="1138" y2="132" stroke="#d9d5cd" stroke-width="1"/>
  <line x1="468" y1="530" x2="1138" y2="530" stroke="#d9d5cd" stroke-width="1"/>
</svg>`
}

async function configureFontRendering() {
  const cache = path.join(os.tmpdir(), 'deshi-social-image-font-cache')
  await fs.mkdir(cache, { recursive: true })
  process.env.XDG_CACHE_HOME ||= cache
  if (!process.env.FONTCONFIG_FILE) {
    const config = [
      '/opt/homebrew/etc/fonts/fonts.conf',
      '/usr/local/etc/fonts/fonts.conf',
      '/etc/fonts/fonts.conf'
    ].find((candidate) => fsSync.existsSync(candidate))
    if (config) process.env.FONTCONFIG_FILE = config
  }
}

async function textLayer({
  text,
  locale,
  fontPath,
  fontSize,
  fontWeight,
  color,
  width,
  height,
  spacing = 0,
  letterSpacing = 0
}) {
  const markup = `<span foreground="${color}" font_size="${Math.round(fontSize * 1024)}" font_weight="${fontWeight}"` +
    (letterSpacing ? ` letter_spacing="${Math.round(letterSpacing * 1024)}"` : '') +
    `>${escapeXml(text)}</span>`
  return sharp({
    text: {
      text: markup,
      font: locale === 'bn' ? 'Deshi Sans Bengali' : 'Arial',
      ...(locale === 'bn' ? { fontfile: fontPath } : {}),
      width,
      height,
      rgba: true,
      align: 'left',
      spacing
    }
  }).png().toBuffer({ resolveWithObject: true })
}

async function renderFolioSocialCard({ locale, copy, fontPath, mark, provenance }) {
  if (!Array.isArray(copy.tagline) || copy.tagline.length !== 2) {
    throw new Error(`${locale} folio social image needs exactly two tagline lines`)
  }
  const [folio, title, tagline, url] = await Promise.all([
    textLayer({
      text: copy.folio,
      locale,
      fontPath,
      fontSize: locale === 'en' ? 216 : 195,
      fontWeight: locale === 'en' ? 700 : 600,
      color: '#f7f3e8',
      width: 330,
      height: 360,
      letterSpacing: locale === 'en' ? -6 : 0
    }),
    textLayer({
      text: copy.title,
      locale,
      fontPath,
      fontSize: 44,
      fontWeight: locale === 'en' ? 700 : 600,
      color: '#202122',
      width: 668,
      height: 90,
      letterSpacing: locale === 'en' ? -1.1 : 0
    }),
    textLayer({
      text: copy.tagline.join('\n'),
      locale,
      fontPath,
      fontSize: 29,
      fontWeight: 400,
      color: '#315548',
      width: 668,
      height: 120,
      spacing: locale === 'en' ? 8 : -8,
      letterSpacing: locale === 'en' ? -0.2 : 0
    }),
    textLayer({
      text: copy.displayUrl,
      locale: 'en',
      fontPath,
      fontSize: 14.5,
      fontWeight: 600,
      color: '#065f46',
      width: 668,
      height: 30,
      letterSpacing: 0.15
    })
  ])

  const png = await sharp(Buffer.from(renderFolioSocialSvg()))
    .composite([
      { input: folio.data, left: Math.round((400 - folio.info.width) / 2), top: Math.round((630 - folio.info.height) / 2) },
      { input: title.data, left: 468, top: 194 },
      { input: tagline.data, left: 468, top: locale === 'en' ? 304 : 316 },
      { input: url.data, left: 468, top: 554 },
      ...(mark ? [{ input: mark, left: 1068, top: 50 }] : [])
    ])
    .png({ compressionLevel: 9 })
    .toBuffer()
  return embedSocialImageProvenance(png, provenance)
}

export async function buildSocialImages({
  definitions = socialImages,
  outputDir,
  fontPath,
  markPath
}) {
  if (!fontPath) throw new Error('Social-image font path is required')
  await configureFontRendering()
  const [fontData, mark] = await Promise.all([
    fs.readFile(fontPath),
    markPath
      ? sharp(markPath).resize(70, 70, { fit: 'contain' }).png().toBuffer().catch(() => null)
      : null
  ])
  createSocialImageFont(fontData)
  let generated = 0

  for (const [slug, definition] of Object.entries(definitions)) {
    if (definition.template !== 'folio') {
      throw new Error(`${slug}: unsupported social-image template ${definition.template}`)
    }
    if (!definition.provenance?.trim()) {
      throw new Error(`${slug}: social-image provenance is required`)
    }
    for (const [locale, copy] of Object.entries(definition.locales || {})) {
      const expectedSrc = `/media/og/${locale}/${slug}.png`
      if (copy.src !== expectedSrc) {
        throw new Error(`${slug}:${locale} must use ${expectedSrc}`)
      }
      const target = path.join(outputDir, locale, `${slug}.png`)
      await fs.mkdir(path.dirname(target), { recursive: true })
      const card = await renderFolioSocialCard({
        locale,
        copy,
        fontPath,
        mark,
        provenance: definition.provenance
      })
      await fs.writeFile(target, card)
      generated += 1
    }
  }
  return { generated }
}

async function main() {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
  const result = await buildSocialImages({
    outputDir: path.join(root, 'media', 'og'),
    fontPath: path.join(root, 'app', 'fonts', 'deshi-sans-bengali-var.woff2'),
    markPath: path.join(root, 'public', 'deshi-mark.webp')
  })
  process.stdout.write(`Social images: generated ${result.generated} in gitignored media/og\n`)
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  main().catch((error) => {
    process.stderr.write(`Social-image build failed: ${error.message}\n`)
    process.exitCode = 1
  })
}
