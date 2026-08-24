import React from 'react'
import startup50Data from '../../data/startup-50.json'
import startup50Logos from '../../data/startup-50-logos.json'
import { mediaSource } from '../lib/media'
import { REPO_URL } from '../nav.config'
import Startup50Filters from './Startup50Filters'

type Locale = 'bn' | 'en'

interface LocalText {
  bn: string
  en: string
}

interface DetailItem extends LocalText {
  url?: string
}

interface BackgroundItem extends LocalText {
  sources: string[]
}

interface ActivityItem extends DetailItem {
  date: string
}

interface StartupEntry {
  slug: string
  name: string
  sortName: string
  monogram: string
  website: string
  sectorKey: string
  sector: LocalText
  description: LocalText
  lesson: LocalText
  background: BackgroundItem
  activity: ActivityItem
  financing: DetailItem
}

interface Startup50Data {
  edition: number
  lastResearched: string
  activityWindowStart: string
  sectorGroups: Record<string, LocalText>
  entries: StartupEntry[]
}

interface StartupLogo {
  slug: string
  name: string
  src: string
  source: string
  sourceKind: string
  license?: string
  credit?: string
}

interface StartupLogoData {
  reviewedAt: string
  entries: StartupLogo[]
}

const data = startup50Data as Startup50Data
const logos = startup50Logos as StartupLogoData
const logoBySlug = new Map(logos.entries.map((logo) => [logo.slug, logo]))

function assertData(value: Startup50Data) {
  if (value.entries.length !== 50) {
    throw new Error('The Deshi Startup 50 must contain exactly 50 entries; found ' + value.entries.length + '.')
  }

  const slugs = new Set<string>()
  const names = new Set<string>()
  const collator = new Intl.Collator('en', { sensitivity: 'base', numeric: true })

  value.entries.forEach((entry, index) => {
    if (slugs.has(entry.slug) || names.has(entry.name)) {
      throw new Error('Duplicate Startup 50 entry: ' + entry.name)
    }
    slugs.add(entry.slug)
    names.add(entry.name)

    if (index > 0 && collator.compare(value.entries[index - 1].sortName, entry.sortName) > 0) {
      throw new Error('Startup 50 entries are not alphabetical at ' + entry.name + '.')
    }
    if (entry.activity.date < value.activityWindowStart || entry.activity.date > value.lastResearched) {
      throw new Error('Activity date outside the research window for ' + entry.name + '.')
    }
    for (const url of [entry.website, entry.activity.url, entry.financing.url, ...entry.background.sources].filter(Boolean)) {
      if (!/^https:\/\//.test(url || '')) throw new Error('Non-HTTPS source for ' + entry.name + ': ' + url)
    }
    if (entry.background.sources.length === 0) {
      throw new Error('Missing background source for ' + entry.name + '.')
    }
    if (!value.sectorGroups[entry.sectorKey]) {
      throw new Error('Missing Startup 50 sector group for ' + entry.name + ': ' + entry.sectorKey)
    }
    for (const copy of [entry.sector, entry.description, entry.lesson, entry.background, entry.activity, entry.financing]) {
      if (!copy.en?.trim() || !copy.bn?.trim()) throw new Error('Missing bilingual field for ' + entry.name + '.')
    }

    const logo = logoBySlug.get(entry.slug)
    if (!logo || logo.name !== entry.name || !logo.src.startsWith('/media/startup-50/')) {
      throw new Error('Missing reviewed Startup 50 logo for ' + entry.name + '.')
    }
  })

  if (logos.entries.length !== value.entries.length || logoBySlug.size !== value.entries.length) {
    throw new Error('The Startup 50 logo manifest must contain one reviewed logo per company.')
  }
}

assertData(data)

function local(value: LocalText, locale: Locale) {
  return value[locale]
}

function formatDate(value: string, locale: Locale) {
  return new Date(value + 'T00:00:00Z').toLocaleDateString(locale === 'en' ? 'en-GB' : 'bn-BD', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  })
}

function displayDomain(value: string) {
  return new URL(value).hostname.replace(/^www\./, '')
}

function sectorOptions(value: Startup50Data, locale: Locale) {
  return Object.entries(value.sectorGroups).map(([key, label]) => ({
    key,
    label: local(label, locale)
  })).sort((a, b) =>
    a.label.localeCompare(b.label, locale === 'en' ? 'en' : 'bn-BD')
  )
}

interface Startup50Props {
  locale?: Locale
}

export default function Startup50({ locale = 'bn' }: Startup50Props) {
  const isEn = locale === 'en'
  const edition = isEn ? String(data.edition) : '২০২৬'
  const fifty = isEn ? '50' : '৫০'
  const suggestUrl = REPO_URL + '/issues/new?template=nominate-startup-50.yml'
  const correctionUrl = REPO_URL + '/issues/new?template=report-mistake.yml&title=' + encodeURIComponent(
    isEn ? '[Correction] Deshi Startup 50: ' : '[সংশোধন] দেশি স্টার্টআপ ৫০: '
  )
  const sectors = sectorOptions(data, locale)

  return (
    <div className="startup50" data-startup50-edition={data.edition}>
      <header className="startup50-hero">
        <div className="startup50-hero__folio" aria-hidden="true">
          <strong>{fifty}</strong>
        </div>
        <div className="startup50-hero__copy">
          <h1>{isEn ? 'The Deshi Startup 50' : 'দেশি স্টার্টআপ ৫০'}</h1>
          <p className="startup50-hero__promise">
            {isEn
              ? 'Top 50 Bangladeshi startups to watch in 2026.'
              : '২০২৬ সালে নজরে রাখার মতো ৫০টি বাংলাদেশি স্টার্টআপ।'}
          </p>
          <p className="startup50-hero__description">
            {isEn
              ? "Meet 50 of Bangladesh's leading startups. See what each company is building, why it matters and what founders can learn from it."
              : 'দেশের শীর্ষ ৫০টি স্টার্টআপের সঙ্গে পরিচিত হোন। তারা কী বানাচ্ছে, কেন সেই কাজ জরুরি আর অন্য ফাউন্ডাররা তাদের কাছ থেকে কী শিখতে পারেন, সবই দেখে নিন এক জায়গায়।'}
          </p>
          <nav className="startup50-hero__actions" aria-label={isEn ? 'Startup 50 actions' : 'স্টার্টআপ ৫০-এর কাজ'}>
            <a className="startup50-action startup50-action--primary" href="#the-50">
              {isEn ? 'Browse the 50' : '৫০টি দেখুন'}
            </a>
            <a className="startup50-action" href={suggestUrl} target="_blank" rel="noopener noreferrer">
              {isEn ? 'Suggest a startup' : 'স্টার্টআপ প্রস্তাব করুন'}
            </a>
          </nav>
        </div>
      </header>

      <section className="startup50-register-section" id="the-50" aria-labelledby="startup50-register-title">
        <div className="startup50-register-heading">
          <div className="startup50-register-heading__rail">
            <h2 id="startup50-register-title">{edition} {isEn ? 'Edition' : 'সংস্করণ'}</h2>
            <p className="startup50-register-heading__updated">
              {isEn ? 'Last updated: ' + formatDate(data.lastResearched, locale) : 'সর্বশেষ আপডেট: ' + formatDate(data.lastResearched, locale)}
            </p>
          </div>
          <p>
            {isEn
              ? 'Search by name or sector. Open any company to see its background, latest update and public funding information.'
              : 'নাম বা খাত ধরে খুঁজুন। কোনো কোম্পানির পেছনের গল্প, সর্বশেষ খবর আর ফান্ডিংয়ের তথ্য দেখতে সেটি খুলুন।'}
          </p>
        </div>

        <Startup50Filters locale={locale} sectors={sectors} total={data.entries.length} />

        <ul className="startup50-register" id="startup-50-register">
          {data.entries.map((entry) => {
            const logo = logoBySlug.get(entry.slug) as StartupLogo
            const searchText = [
              entry.name,
              local(entry.sector, locale),
              local(data.sectorGroups[entry.sectorKey], locale)
            ].join(' ')
            return (
              <li key={entry.slug} data-startup-entry="" data-sector={entry.sectorKey} data-search={searchText}>
                <article className="startup50-entry" id={entry.slug}>
                  <div className="startup50-entry__mark">
                    <img
                      src={mediaSource(logo.src)}
                      alt={entry.name + ' logo'}
                      aria-hidden="true"
                      width="88"
                      height="52"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="startup50-entry__identity">
                    <h2 data-toc-ignore="">
                      <a href={entry.website} target="_blank" rel="noopener noreferrer">{entry.name}</a>
                    </h2>
                    <p>{local(entry.sector, locale)}</p>
                  </div>
                  <p className="startup50-entry__description">{local(entry.description, locale)}</p>
                  <div className="startup50-entry__lesson">
                    <span>{isEn ? 'What founders can learn' : 'ফাউন্ডাররা যা শিখতে পারেন'}</span>
                    <p>{local(entry.lesson, locale)}</p>
                  </div>
                  <details className="startup50-details">
                    <summary>
                      <span aria-hidden="true">{isEn ? 'See details' : 'আরও দেখুন'}</span>
                      <span className="sr-only">
                        {isEn ? 'See details for ' + entry.name : entry.name + ' সম্পর্কে আরও দেখুন'}
                      </span>
                    </summary>
                    <dl>
                      <div>
                        <dt>{isEn ? 'Background' : 'পেছনের গল্প'}</dt>
                        <dd>{local(entry.background, locale)}</dd>
                      </div>
                      <div>
                        <dt>{isEn ? 'Latest update' : 'সর্বশেষ খবর'}</dt>
                        <dd>
                          <a href={entry.activity.url} target="_blank" rel="noopener noreferrer">
                            {local(entry.activity, locale)}
                          </a>{' '}
                          <span>({formatDate(entry.activity.date, locale)})</span>
                        </dd>
                      </div>
                      <div>
                        <dt>{isEn ? 'Funding' : 'ফান্ডিং'}</dt>
                        <dd>
                          {entry.financing.url ? (
                            <a href={entry.financing.url} target="_blank" rel="noopener noreferrer">
                              {local(entry.financing, locale)}
                            </a>
                          ) : local(entry.financing, locale)}
                        </dd>
                      </div>
                      <div>
                        <dt>{isEn ? 'Official website' : 'অফিশিয়াল ওয়েবসাইট'}</dt>
                        <dd>
                          <a href={entry.website} target="_blank" rel="noopener noreferrer">
                            {displayDomain(entry.website)}
                          </a>
                        </dd>
                      </div>
                    </dl>
                  </details>
                </article>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="startup50-methodology" id="method" aria-labelledby="startup50-method-title">
        <h2 id="startup50-method-title">{isEn ? 'How startups make the list' : 'কোন স্টার্টআপ তালিকায় আসে'}</h2>
        <p className="startup50-methodology__lede">
          {isEn
            ? 'Every startup on the list must meet the same basic requirements. We then compare customer adoption, recent growth, reach and funding. Funding is an important factor, but it is not the only one and does not guarantee a place on the list.'
            : 'এই তালিকার প্রতিটি স্টার্টআপকেই একই প্রাথমিক শর্ত পূরণ করতে হয়। এরপর আমরা দেখি প্রডাক্টটি মানুষ কতটা ব্যবহার করছে, সম্প্রতি ব্যবসা কতটা এগিয়েছে, কাজের পরিসর কত বড় আর ফান্ডিং হয়েছে কি না। ফান্ডিং একটি গুরুত্বপূর্ণ বিষয়, তবে এটিই একমাত্র মাপকাঠি নয়। ফান্ডিং পেলেই তালিকায় জায়গা নিশ্চিত হয় না।'}
        </p>

        <div className="startup50-methodology__body">
          <section>
            <h3>{isEn ? 'What we look for' : 'আমরা যা দেখি'}</h3>
            <ul>
              <li>{isEn ? 'Founded in Bangladesh or primarily operating from Bangladesh' : 'বাংলাদেশে প্রতিষ্ঠিত, অথবা মূল কার্যক্রম বাংলাদেশ থেকে পরিচালিত'}</li>
              <li>{isEn ? 'A live product or platform that can scale' : 'চালু আছে আর বড় পরিসরে চালানো যায়, এমন নিজস্ব প্রডাক্ট বা প্ল্যাটফর্ম'}</li>
              <li>{isEn ? 'Verifiable activity within the past 12 months' : 'গত ১২ মাসের মধ্যে কাজের যাচাইযোগ্য অগ্রগতি'}</li>
              <li>{isEn ? 'Evidence of customers, users, revenue, transactions, contracts or meaningful partnerships' : 'কাস্টমার, ইউজার, রেভিনিউ, ট্রানজ্যাকশন, চুক্তি বা গুরুত্বপূর্ণ পার্টনারশিপের প্রমাণ'}</li>
              <li>{isEn ? 'At least two reliable public sources, including one independent of the company' : 'অন্তত দুটি নির্ভরযোগ্য পাবলিক সোর্স, যার একটি কোম্পানির বাইরের'}</li>
            </ul>
          </section>
          <section>
            <h3>{isEn ? 'Keeping it current' : 'তালিকা যেভাবে আপডেট হয়'}</h3>
            <p>
              {isEn
                ? 'We review the list throughout the year. We aim to review it monthly and do so at least once a quarter. Startups may be added or removed as their work changes.'
                : 'আমরা সারা বছর ধরেই তালিকাটি রিভিউ করি। লক্ষ্য থাকে প্রতি মাসে করার, তবে অন্তত তিন মাসে একবার এটি করা হয়। স্টার্টআপগুলোর কাজের পরিবর্তনের ওপর ভিত্তি করে নাম যোগ বা বাদ পড়তে পারে।'}
            </p>
            <p>{isEn ? 'A company cannot pay to be included.' : 'টাকা দিয়ে তালিকায় জায়গা কেনা যায় না।'}</p>
          </section>
        </div>

        <div className="startup50-methodology__actions">
          <a className="startup50-action startup50-action--primary" href={suggestUrl} target="_blank" rel="noopener noreferrer">
            {isEn ? 'Suggest a startup' : 'স্টার্টআপ প্রস্তাব করুন'}
          </a>
          <a className="startup50-action" href={correctionUrl} target="_blank" rel="noopener noreferrer">
            {isEn ? 'Report a mistake' : 'ভুল তথ্য জানান'}
          </a>
        </div>
      </section>
    </div>
  )
}
