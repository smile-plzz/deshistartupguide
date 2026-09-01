'use client'

import { useState, useCallback, type ChangeEvent } from 'react'

interface FounderPathSelectorProps {
  paths: Array<{
    id: string
    title: string
    sub: string
    href: string
  }>
  heading?: string
  subheading?: string
  className?: string
  onSelect?: (id: string) => void
}

export function FounderPathSelector({
  paths,
  heading = 'আপনি এখন কোথায়?',
  subheading,
  className = '',
  onSelect,
}: FounderPathSelectorProps) {
  const [selected, setSelected] = useState<string | null>(null)

  const handleSelect = useCallback(
    (id: string) => {
      setSelected(id)
      onSelect?.(id)
    },
    [onSelect]
  )

  return (
    <section className={`path-selector ${className}`} aria-labelledby="path-question">
      <div className="path-selector__head">
        <h2
          id="path-question"
          className="path-selector__question"
          style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.2rem, 3vw, 1.6rem)', fontWeight: 400, lineHeight: 1.35, color: 'var(--ink)', margin: 0 }}
        >
          {heading}
        </h2>
        {subheading && (
          <p className="path-selector__hint" style={{ color: 'var(--ink-soft)', fontSize: '0.92rem', marginTop: '6px', lineHeight: 1.55 }}>
            {subheading}
          </p>
        )}
      </div>

      <div className="path-selector__list" role="group" aria-label={heading}>
        {paths.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`path-choice ${selected === p.id ? 'selected' : ''}`}
            onClick={() => handleSelect(p.id)}
            aria-pressed={selected === p.id}
          >
            <span className="path-choice__num" aria-hidden="true">
              {p.id}
            </span>
            <span className="path-choice__title">{p.title}</span>
            <span className="path-choice__sub">{p.sub}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
