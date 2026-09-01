'use client'

import type { ReactNode } from 'react'

interface NextStepProps {
  href: string
  label?: string
  title: string
  description?: string
  arrow?: string
  className?: string
}

export function NextStep({
  href,
  label = 'Next',
  title,
  description,
  arrow = '→',
  className = '',
}: NextStepProps) {
  return (
    <div className={`next-step ${className}`}>
      <span className="next-step__arrow" aria-hidden="true">
        {arrow}
      </span>
      <span className="next-step__label">{label}</span>
      <a
        href={href}
        className="next-step__title"
        style={{ fontFamily: 'var(--sans)', fontWeight: 500, color: 'var(--link)', textDecoration: 'none', fontSize: '0.92rem' }}
      >
        {title}
      </a>
      {description && (
        <span style={{ color: 'var(--ink-soft)', fontSize: '0.82rem', lineHeight: 1.45 }}>
          — {description}
        </span>
      )}
    </div>
  )
}
