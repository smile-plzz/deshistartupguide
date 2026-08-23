'use client'

import React, { useEffect, useState } from 'react'

interface SectorOption {
  key: string
  label: string
}

interface Startup50FiltersProps {
  locale: 'bn' | 'en'
  sectors: SectorOption[]
  total: number
}

const bengaliDigits = (value: number | string) =>
  String(value).replace(/\d/g, (digit) => '০১২৩৪৫৬৭৮৯'[Number(digit)])

export default function Startup50Filters({ locale, sectors, total }: Startup50FiltersProps) {
  const isEn = locale === 'en'
  const [query, setQuery] = useState('')
  const [sector, setSector] = useState('')
  const [shown, setShown] = useState(total)

  useEffect(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase(isEn ? 'en' : 'bn-BD')
    const entries = Array.from(
      document.querySelectorAll<HTMLElement>('#startup-50-register [data-startup-entry]')
    )
    let visible = 0

    for (const entry of entries) {
      const matchesQuery =
        !normalizedQuery ||
        (entry.dataset.search || '').toLocaleLowerCase(isEn ? 'en' : 'bn-BD').includes(normalizedQuery)
      const matchesSector = !sector || entry.dataset.sector === sector
      entry.hidden = !(matchesQuery && matchesSector)
      if (!entry.hidden) visible += 1
    }

    setShown(visible)
  }, [isEn, query, sector])

  const displayShown = isEn ? shown : bengaliDigits(shown)
  const displayTotal = isEn ? total : bengaliDigits(total)

  return (
    <div className="startup50-filters" role="search" aria-label={isEn ? 'Filter the 50' : '৫০টি স্টার্টআপ থেকে খুঁজুন'}>
      <label className="startup50-filters__search">
        <span>{isEn ? 'Search' : 'খুঁজুন'}</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={isEn ? 'Name or sector' : 'নাম বা খাত'}
          aria-controls="startup-50-register"
        />
      </label>
      <label>
        <span>{isEn ? 'Sector' : 'খাত'}</span>
        <select
          value={sector}
          onChange={(event) => setSector(event.target.value)}
          aria-controls="startup-50-register"
        >
          <option value="">{isEn ? 'All sectors' : 'সব খাত'}</option>
          {sectors.map((option) => (
            <option key={option.key} value={option.key}>{option.label}</option>
          ))}
        </select>
      </label>
      <button
        type="button"
        onClick={() => {
          setQuery('')
          setSector('')
        }}
      >
        {isEn ? 'Reset' : 'রিসেট'}
      </button>
      <p className="startup50-filters__count" aria-live="polite">
        {isEn
          ? `Showing ${displayShown} of ${displayTotal}.`
          : `মোট ${displayTotal}টির মধ্যে ${displayShown}টি দেখানো হচ্ছে।`}
      </p>
      <p className="startup50-filters__empty" hidden={shown !== 0}>
        {isEn
          ? 'No startups match those filters. Try a different search or reset the filters.'
          : 'এই খোঁজে কোনো স্টার্টআপ পাওয়া যায়নি। অন্য কিছু লিখে দেখুন বা ফিল্টার রিসেট করুন।'}
      </p>
    </div>
  )
}
