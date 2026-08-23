import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const readJson = (relative) => JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'))
const data = readJson('data/startup-50.json')
const logos = readJson('data/startup-50-logos.json')
const media = readJson('app/generated/media.json')
const workerSource = fs.readFileSync(path.join(root, 'worker', 'index.ts'), 'utf8')
const wranglerConfig = fs.readFileSync(path.join(root, 'wrangler.jsonc'), 'utf8')
const componentSource = fs.readFileSync(path.join(root, 'app', 'components', 'Startup50.tsx'), 'utf8')
const filtersSource = fs.readFileSync(path.join(root, 'app', 'components', 'Startup50Filters.tsx'), 'utf8')
const englishPageSource = fs.readFileSync(path.join(root, 'app', '(contents)', 'en', 'startup-50', 'page.mdx'), 'utf8')

test('the watchlist has exactly fifty unique companies in alphabetical order', () => {
  assert.equal(data.entries.length, 50)
  assert.equal(new Set(data.entries.map((entry) => entry.slug)).size, 50)
  assert.equal(new Set(data.entries.map((entry) => entry.name)).size, 50)

  const collator = new Intl.Collator('en', { sensitivity: 'base', numeric: true })
  const names = data.entries.map((entry) => entry.sortName)
  assert.deepEqual(names, [...names].sort(collator.compare))
})

test('every company has useful bilingual details and a recent public update', () => {
  for (const entry of data.entries) {
    assert.match(entry.website, /^https:\/\//, entry.name + ' website')
    assert.match(entry.activity.url, /^https:\/\//, entry.name + ' latest update')
    assert.ok(entry.activity.date >= data.activityWindowStart, entry.name + ' update is too old')
    assert.ok(entry.activity.date <= data.lastResearched, entry.name + ' update is in the future')

    for (const field of ['sector', 'description', 'lesson', 'background', 'activity', 'financing']) {
      assert.ok(entry[field].en?.trim(), entry.name + ' ' + field + '.en')
      assert.ok(entry[field].bn?.trim(), entry.name + ' ' + field + '.bn')
    }

    assert.ok(Array.isArray(entry.background.sources), entry.name + ' background sources')
    assert.ok(entry.background.sources.length >= 1, entry.name + ' background source count')
    for (const source of entry.background.sources) {
      assert.match(source, /^https:\/\//, entry.name + ' background source')
    }

    assert.doesNotMatch(
      entry.background.en,
      /(?:Bangladesh-founded|Bangladesh-built|founded in Bangladesh|founded by (?:a )?Bangladesh(?:i)? team)/i,
      entry.name + ' still has a generic background'
    )
  }
})

test('every broad sector key has one clear bilingual filter label', () => {
  const usedKeys = [...new Set(data.entries.map((entry) => entry.sectorKey))].sort()
  assert.deepEqual(Object.keys(data.sectorGroups).sort(), usedKeys)

  for (const key of usedKeys) {
    assert.ok(data.sectorGroups[key].en?.trim(), key + ' sector group en')
    assert.ok(data.sectorGroups[key].bn?.trim(), key + ' sector group bn')
  }

  assert.equal(data.sectorGroups.software.en, 'Software and AI')
  assert.equal(data.sectorGroups.commerce.en, 'Commerce')
  assert.equal(data.sectorGroups.agriculture.en, 'Agriculture')
})

test('DIGIBOX is identified as parcel-locker infrastructure', () => {
  const digibox = data.entries.find((entry) => entry.slug === 'digibox')
  assert.ok(digibox)
  assert.match(digibox.sector.en, /parcel-locker/i)
  assert.match(digibox.description.en, /parcel lockers/i)
  assert.doesNotMatch(digibox.description.en, /advertising|out-of-home|screens/i)
  assert.match(digibox.sector.bn, /পার্সেল লকার/)
  assert.match(digibox.description.bn, /পার্সেল লকার/)
  assert.doesNotMatch(
    [digibox.sector.bn, digibox.description.bn, digibox.lesson.bn].join(' '),
    /ডিজিটাল মিডিয়া|বিজ্ঞাপন|স্ক্রিন/
  )
})

test('Bangla fields do not contain known translation corruption', () => {
  const bangla = data.entries.flatMap((entry) => [
    entry.sector.bn,
    entry.description.bn,
    entry.lesson.bn,
    entry.background.bn,
    entry.activity.bn,
    entry.financing.bn
  ]).join('\n')

  assert.doesNotMatch(bangla, /[\u0B80-\u0BFF]/u, 'Tamil characters found in Bangla copy')
  assert.doesNotMatch(bangla, /—/, 'em dash found in Bangla copy')
  assert.doesNotMatch(bangla, /গোজায়ান|সক্রিয়-র/, 'known company-name corruption found')
})

test('official websites are labelled with their root domains', () => {
  assert.match(componentSource, /function displayDomain\(value: string\)/)
  assert.match(componentSource, /\{displayDomain\(entry\.website\)\}/)
  assert.doesNotMatch(componentSource, /Visit the company website|কোম্পানির ওয়েবসাইট দেখুন/)

  for (const entry of data.entries) {
    const domain = new URL(entry.website).hostname.replace(/^www\./, '')
    assert.ok(domain.includes('.'), entry.name + ' root domain')
  }
})

test('the English metadata positions the edition as top startups in Bangladesh', () => {
  assert.match(englishPageSource, /title: "The Deshi Startup 50: Top startups in Bangladesh"/)
  assert.match(englishPageSource, /description: ".*top startups in Bangladesh/i)
  assert.match(componentSource, /'50 Bangladeshi startups to watch in 2026\.'/)
  assert.doesNotMatch(componentSource, /'Top 50 Bangladeshi startups to watch in 2026\.'/)
})

test('search, empty results and accessible row controls match the interface copy', () => {
  assert.match(componentSource, /data-search=\{searchText\}/)
  assert.match(filtersSource, /entry\.dataset\.search/)
  assert.doesNotMatch(filtersSource, /entry\.textContent/)
  assert.match(filtersSource, /No startups match those filters/)
  assert.match(filtersSource, /এই খোঁজে কোনো স্টার্টআপ পাওয়া যায়নি/)
  assert.match(componentSource, /alt=\{entry\.name \+ ' logo'\}/)
  assert.match(componentSource, /aria-hidden="true"/)
  assert.match(componentSource, /className="sr-only"/)
  assert.match(componentSource, /See details for/)
})

test('the company data cannot silently become a ranking', () => {
  for (const entry of data.entries) {
    for (const prohibited of ['rank', 'score', 'position', 'valuation']) {
      assert.equal(Object.hasOwn(entry, prohibited), false, entry.name + ' has prohibited ' + prohibited)
    }
  }
})

test('every company has one reviewed logo in the R2 media registry', () => {
  assert.match(logos.reviewedAt, /^\d{4}-\d{2}-\d{2}$/)
  assert.equal(logos.entries.length, 50)
  assert.equal(new Set(logos.entries.map((entry) => entry.slug)).size, 50)
  assert.equal(new Set(logos.entries.map((entry) => entry.src)).size, 50)

  const logoBySlug = new Map(logos.entries.map((entry) => [entry.slug, entry]))
  for (const company of data.entries) {
    const logo = logoBySlug.get(company.slug)
    assert.ok(logo, company.name + ' logo')
    assert.equal(logo.name, company.name)
    assert.match(logo.src, /^\/media\/startup-50\/[a-z0-9-]+\.webp$/)
    assert.match(logo.source, /^https?:\/\//)
    assert.ok(logo.sourceKind?.trim(), company.name + ' logo source kind')
    assert.equal(media[logo.src]?.remote, true, company.name + ' logo is not marked remote')
    assert.match(media[logo.src]?.key || '', /^startup-50\/.+\.[a-f0-9]{12}\.webp$/)
  }

  const licensed = logos.entries.filter((entry) => entry.license)
  for (const logo of licensed) {
    assert.ok(logo.credit?.trim(), logo.name + ' licensed logo credit')
  }
})

test('both language pages and the public suggestion form are present', () => {
  for (const relative of [
    'app/(contents)/(bn)/startup-50/page.mdx',
    'app/(contents)/en/startup-50/page.mdx',
    '.github/ISSUE_TEMPLATE/nominate-startup-50.yml'
  ]) {
    assert.equal(fs.existsSync(path.join(root, relative)), true, relative)
  }
})

test('the permanent shortcuts reach the Worker before Static Assets', () => {
  for (const route of ['/50', '/50/', '/en/50', '/en/50/']) {
    assert.ok(wranglerConfig.includes(JSON.stringify(route)), route + ' is missing from run_worker_first')
  }
  assert.match(workerSource, /startup50Alias/)
  assert.match(workerSource, /Response\.redirect\(destination\.toString\(\), 308\)/)
})
