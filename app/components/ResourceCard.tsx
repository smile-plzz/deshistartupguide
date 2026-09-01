'use client'

import type { ReactNode } from 'react'

type ResourceTag = 'guide' | 'tool' | 'question' | 'government'

interface ResourceCardProps {
  href?: string
  icon?: string
  title: string
  description?: string
  tag?: ResourceTag | string
  children?: ReactNode
  className?: string
}

export function ResourceCard({
  href,
  icon = '→',
  title,
  description,
  tag,
  children,
  className = '',
}: ResourceCardProps) {
  const tagKey = typeof tag === 'string' && ['guide', 'tool', 'question', 'government'].includes(tag)
    ? tag as ResourceTag
    : undefined

  const Tag = tagKey ? (
    <span className={`resource-card__tag resource-card__tag--${tagKey}`}>
      {tagKey === 'government' && 'সরকারি উৎস'}
      {tagKey === 'guide' && 'গাইড'}
      {tagKey === 'tool' && 'টুল'}
      {tagKey === 'question' && 'প্রশ্ন'}
    </span>
  ) : null

  return (
    <a
      href={href || '#'}
      className={`resource-card ${className}`}
    >
      <span className="resource-card__icon" aria-hidden="true">
        {icon}
      </span>
      <span className="resource-card__titles">
        <span className="resource-card__title">{title}</span>
        {description && (
          <span className="resource-card__sub">{description}</span>
        )}
        {Tag}
      </span>
      {children}
    </a>
  )
}
