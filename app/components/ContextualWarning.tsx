'use client'

import type { ReactNode } from 'react'

interface ContextWarningProps {
  label?: string
  children: ReactNode
  variant?: 'caution' | 'government' | 'mistake'
  className?: string
}

export function ContextualWarning({
  label,
  children,
  variant = 'caution',
  className = '',
}: ContextWarningProps) {
  const variantClass =
    variant === 'government' ? 'context-warning--gov' : ''

  const defaultLabels = {
    caution: 'দ্রষ্টব্য / Caution',
    government: 'সরকারি তথ্য / Government information',
    mistake: 'সাধারণ ভুল / Common mistake',
  }

  return (
    <aside className={`context-warning ${variantClass} ${className}`} role="note">
      <span className="context-warning__label">
        {label || defaultLabels[variant]}
      </span>
      <span className="context-warning__text">{children}</span>
    </aside>
  )
}
