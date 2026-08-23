#!/usr/bin/env node

/**
 * Fetches candidate company marks from the official websites already recorded
 * in data/startup-50.json. The output is staged under the gitignored media/
 * directory for human review before `npm run media:upload` is allowed to run.
 *
 * This is deliberately conservative: it only considers logo-like assets that
 * the company itself links from its website. It does not call a logo database,
 * scrape a search engine, or update any authored data automatically.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as cheerio from 'cheerio'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const data = JSON.parse(await fs.readFile(path.join(root, 'data/startup-50.json'), 'utf8'))
const outputDir = path.join(root, 'media', 'startup-50')
const reportPath = '/private/tmp/startup-50-logo-report.json'
const userAgent = 'DeshiStartupLogoReview/1.0 (+https://deshistartup.com/about)'

// A small reviewed override table for sites whose metadata points at partner
// marks, store badges, white-only artwork, or a bot challenge. Every URL is an
// asset published by the company itself, except the clearly licensed Sheba.xyz
// file on Wikimedia Commons.
const reviewedOverrides = {
  '10-minute-school': {
    url: 'https://cdn.10minuteschool.com/images/svg/10mslogo-svg.svg',
    kind: 'official-site logo'
  },
  agroshift: {
    url: 'https://cdn.prod.website-files.com/682b2e509c06fb31d9d240ce/682f6cead76dd449a7745a25_68106fb648460e8b171e0059_AS-Logo%20(1)%201.svg',
    kind: 'official-site header logo'
  },
  'apon-wellbeing': {
    url: 'https://apon.ibos.io/media/logos/apon.png',
    kind: 'official company web-app logo',
    background: '#123b57'
  },
  bkash: {
    url: 'https://payment.bkash.com/bKash-logo.png',
    kind: 'official payment portal logo'
  },
  dubotech: {
    url: 'https://dubotech.com/favicon/apple-touch-icon.png',
    kind: 'official-site icon'
  },
  jatri: {
    url: 'https://jatri.co/_nuxt/jatri-logo.sAXW7P9b.svg',
    kind: 'official-site logo'
  },
  'khaas-food': {
    url: 'https://www.khaasfood.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fkhaasfood_white.0d0g39f2~ef.a.webp&w=3840&q=95',
    kind: 'official-site Khaas Food logo'
  },
  'loop-freight': {
    url: 'https://loopfreight.io/static/media/logo-white.e51aa633.png',
    kind: 'official-site logo',
    background: '#202122'
  },
  'palki-motors': {
    url: 'https://palkimotors.com/logo.png',
    kind: 'official-site logo',
    background: '#17324d'
  },
  pickaboo: {
    url: 'https://www.pickaboo.com/assets/images/logo.svg',
    kind: 'official-site logo',
    background: '#35135f'
  },
  priyoshop: {
    url: 'https://priyoshopretail.com/wp-content/uploads/2025/09/Frame-1-3.png',
    kind: 'official-site header logo'
  },
  'sheba-xyz': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/d/d6/Sheba.xyz_Logo.png',
    kind: 'CC BY-SA 4.0 logo copy',
    license: 'https://creativecommons.org/licenses/by-sa/4.0/',
    credit: 'Mehedi91, Wikimedia Commons'
  },
  sokrio: {
    url: 'https://sokrio.com/wp-content/themes/sokrio/assets/images/logo.png',
    kind: 'official-site header logo'
  }
}

await fs.mkdir(outputDir, { recursive: true })

function absoluteUrl(value, base) {
  if (!value || /^data:/i.test(value)) return null
  try {
    const url = new URL(value, base)
    if (!/^https?:$/.test(url.protocol)) return null
    return url.href
  } catch {
    return null
  }
}

function addCandidate(candidates, value, base, kind, priority) {
  const url = absoluteUrl(value, base)
  if (!url) return
  const previous = candidates.get(url)
  if (!previous || priority > previous.priority) candidates.set(url, { url, kind, priority })
}

function collectJsonLogos(value, found = []) {
  if (!value || typeof value !== 'object') return found
  if (Array.isArray(value)) {
    for (const item of value) collectJsonLogos(item, found)
    return found
  }
  if (value.logo) {
    if (typeof value.logo === 'string') found.push(value.logo)
    else if (typeof value.logo === 'object') {
      for (const key of ['url', 'contentUrl']) {
        if (typeof value.logo[key] === 'string') found.push(value.logo[key])
      }
    }
  }
  for (const child of Object.values(value)) collectJsonLogos(child, found)
  return found
}

function candidatesFromHtml(html, base, companyName) {
  const $ = cheerio.load(html)
  const candidates = new Map()

  $('script[type="application/ld+json"]').each((_, element) => {
    try {
      const parsed = JSON.parse($(element).text())
      for (const value of collectJsonLogos(parsed)) addCandidate(candidates, value, base, 'json-ld logo', 100)
    } catch {
      // Invalid JSON-LD is common and does not make the site unusable.
    }
  })

  $('meta[property="og:logo"], meta[name="logo"], meta[itemprop="logo"]').each((_, element) => {
    addCandidate(candidates, $(element).attr('content'), base, 'logo metadata', 98)
  })

  $('img, source').each((_, element) => {
    const node = $(element)
    const descriptiveAttrs = [
      node.attr('alt'),
      node.attr('title'),
      node.attr('class'),
      node.attr('id')
    ].filter(Boolean).join(' ').toLowerCase()
    const value = node.attr('src') || node.attr('data-src') || node.attr('data-lazy-src') || node.attr('srcset')?.split(',')[0]?.trim().split(/\s+/)[0]
    const assetUrl = absoluteUrl(value, base)
    const assetPath = assetUrl ? new URL(assetUrl).pathname.toLowerCase() : ''
    const looksLikeLogo = descriptiveAttrs.includes('logo') || /(?:^|[\/_-])logo(?:[\/_\-.]|$)/.test(assetPath)
    const looksLikeStoreBadge = /(?:android|google-play|playstore|app-store|appstore|appgallery|ios)[._-]/.test(assetPath)
    if (!looksLikeLogo || looksLikeStoreBadge) return
    addCandidate(candidates, value, base, 'official-site logo image', assetPath.includes('logo') ? 95 : 92)
  })

  $('link[rel]').each((_, element) => {
    const node = $(element)
    const rel = (node.attr('rel') || '').toLowerCase()
    if (rel.includes('apple-touch-icon')) addCandidate(candidates, node.attr('href'), base, 'apple touch icon', 76)
    else if (/(^|\s)(shortcut )?icon(\s|$)/.test(rel)) {
      const sizes = node.attr('sizes') || ''
      const size = Math.max(...[...sizes.matchAll(/(\d+)x(\d+)/g)].map((match) => Number(match[1])), 0)
      addCandidate(candidates, node.attr('href'), base, 'site icon', 60 + Math.min(size / 64, 8))
    }
  })

  return [...candidates.values()].sort((a, b) => b.priority - a.priority).slice(0, 14)
}

async function fetchWithTimeout(url, timeoutMs = 18_000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, {
      redirect: 'follow',
      headers: { 'user-agent': userAgent, accept: 'text/html,application/xhtml+xml,image/*;q=0.9,*/*;q=0.7' },
      signal: controller.signal
    })
  } finally {
    clearTimeout(timer)
  }
}

async function inspectCandidate(candidate) {
  const response = await fetchWithTimeout(candidate.url)
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  const buffer = Buffer.from(await response.arrayBuffer())
  if (!buffer.length || buffer.length > 5 * 1024 * 1024) throw new Error('empty or larger than 5 MB')

  const image = sharp(buffer, { density: 288, failOn: 'none' })
  const metadata = await image.metadata()
  if (!metadata.width || !metadata.height) throw new Error('no readable dimensions')
  if (metadata.width < 24 || metadata.height < 24) throw new Error('smaller than 24 px')

  const aspect = metadata.width / metadata.height
  const area = metadata.width * metadata.height
  const aspectPenalty = aspect > 8 || aspect < 0.125 ? 25 : 0
  const score = candidate.priority * 1_000_000 + Math.min(area, 500_000) - aspectPenalty * 1_000
  return { ...candidate, buffer, width: metadata.width, height: metadata.height, format: metadata.format, score }
}

async function processEntry(entry) {
  const reviewed = reviewedOverrides[entry.slug]
  if (reviewed) {
    const chosen = await inspectCandidate({ url: reviewed.url, kind: reviewed.kind, priority: 120 })
    const output = path.join(outputDir, `${entry.slug}.webp`)
    const normalized = await sharp(chosen.buffer, { density: 288, failOn: 'none' })
      .trim({ background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .resize({ width: reviewed.background ? 276 : 320, height: reviewed.background ? 116 : 160, fit: 'inside', withoutEnlargement: false })
      .png()
      .toBuffer()
    if (reviewed.background) {
      await sharp({ create: { width: 320, height: 160, channels: 4, background: reviewed.background } })
        .composite([{ input: normalized, gravity: 'centre' }])
        .webp({ quality: 88, alphaQuality: 95, effort: 6 })
        .toFile(output)
    } else {
      await sharp(normalized).webp({ quality: 88, alphaQuality: 95, effort: 6 }).toFile(output)
    }
    return {
      slug: entry.slug,
      name: entry.name,
      website: entry.website,
      homepage: entry.website,
      logicalPath: `/media/startup-50/${entry.slug}.webp`,
      source: reviewed.url,
      sourceKind: reviewed.kind,
      sourceDimensions: `${chosen.width}x${chosen.height}`,
      output: path.relative(root, output),
      license: reviewed.license,
      credit: reviewed.credit,
      alternatives: [],
      rejected: []
    }
  }

  const homepage = await fetchWithTimeout(entry.website)
  if (!homepage.ok) throw new Error(`homepage HTTP ${homepage.status}`)
  const finalUrl = homepage.url
  const html = await homepage.text()
  const candidates = candidatesFromHtml(html, finalUrl, entry.name)
  const inspected = []
  const rejected = []

  for (const candidate of candidates) {
    try {
      inspected.push(await inspectCandidate(candidate))
    } catch (error) {
      rejected.push({ ...candidate, error: error.message })
    }
  }

  inspected.sort((a, b) => b.score - a.score)
  const chosen = inspected[0]
  if (!chosen) throw new Error(`no usable logo candidate (${rejected.map((item) => `${item.kind}: ${item.error}`).join('; ')})`)

  const output = path.join(outputDir, `${entry.slug}.webp`)
  await sharp(chosen.buffer, { density: 288, failOn: 'none' })
    .trim({ background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .resize({ width: 320, height: 160, fit: 'inside', withoutEnlargement: false })
    .webp({ quality: 88, alphaQuality: 95, effort: 6 })
    .toFile(output)

  return {
    slug: entry.slug,
    name: entry.name,
    website: entry.website,
    homepage: finalUrl,
    logicalPath: `/media/startup-50/${entry.slug}.webp`,
    source: chosen.url,
    sourceKind: chosen.kind,
    sourceDimensions: `${chosen.width}x${chosen.height}`,
    output: path.relative(root, output),
    alternatives: inspected.slice(1, 4).map(({ url, kind, width, height }) => ({ url, kind, dimensions: `${width}x${height}` })),
    rejected
  }
}

const reports = []
const failures = []
let cursor = 0
const workers = Array.from({ length: 5 }, async () => {
  while (cursor < data.entries.length) {
    const entry = data.entries[cursor++]
    try {
      const report = await processEntry(entry)
      reports.push(report)
      console.log(`✓ ${entry.name}: ${report.sourceKind} — ${report.source}`)
    } catch (error) {
      failures.push({ slug: entry.slug, name: entry.name, website: entry.website, error: error.message })
      console.error(`✗ ${entry.name}: ${error.message}`)
    }
  }
})

await Promise.all(workers)
reports.sort((a, b) => a.name.localeCompare(b.name, 'en'))
failures.sort((a, b) => a.name.localeCompare(b.name, 'en'))
await fs.writeFile(reportPath, JSON.stringify({ generatedAt: new Date().toISOString(), reports, failures }, null, 2) + '\n')
console.log(`\n${reports.length} staged, ${failures.length} failed. Review report: ${reportPath}`)
if (failures.length) process.exitCode = 2
