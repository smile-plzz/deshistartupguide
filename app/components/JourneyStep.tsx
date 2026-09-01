'use client'

import type { ReactNode } from 'react'

interface JourneyStepProps {
  number: string | number
  title: string
  body?: ReactNode
  description?: string
  status?: 'not-started' | 'in-progress' | 'complete'
  href?: string
  children?: ReactNode
  accent?: boolean
  className?: string
  badge?: string
}

export function JourneyStep({
  number,
  title,
  body,
  description,
  status = 'not-started',
  href,
  children,
  accent = false,
  className = '',
  badge,
}: JourneyStepProps) {
  const statusClass =
    status === 'complete'
      ? 'js-step--done'
      : status === 'in-progress'
      ? 'js-step--doing'
      : 'js-step--next'

  return (
    <article
      className={`js-step ${statusClass} ${accent ? 'js-step--accent' : ''} ${className}`}
    >
      <header className="js-step__head">
        <div className="js-step__meta">
          <span className="js-step__num" aria-label={`Step ${number}`}>
            {typeof number === 'number' ? String(number).padStart(2, '০') : number}
          </span>
          {badge && <span className="js-step__badge">{badge}</span>}
        </div>
        <div className="js-step__titles">
          {href ? (
            <a href={href} className="js-step__title">
              {title}
            </a>
          ) : (
            <h3 className="js-step__title">{title}</h3>
          )}
          {description && (
            <p className="js-step__desc">{description}</p>
          )}
        </div>
      </header>
      {body && <div className="js-step__body">{body}</div>}
      {children}
    </article>
  )
}
