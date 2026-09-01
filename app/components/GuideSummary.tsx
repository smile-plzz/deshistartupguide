'use client'

import type { ReactNode } from 'react'

interface GuideSummaryProps {
  label?: string
  children: ReactNode
  className?: string
}

export function GuideSummary({
  label = 'সারকথা / Summary',
  children,
  className = '',
}: GuideSummaryProps) {
  return (
    <section className={`guide-summary ${className}`} aria-label="Summary">
      <span className="guide-summary__label">{label}</span>
      <span className="guide-summary__text">{children}</span>
    </section>
  )
}
