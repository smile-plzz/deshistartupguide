'use client'

import { useState, useEffect, type FormEvent } from 'react'

interface ChecklistItem {
  id: string
  text: string
  hint?: string
}

interface ActionChecklistProps {
  items: ChecklistItem[]
  title?: string
  className?: string
  storageKey?: string
  showHint?: boolean
}

export function ActionChecklist({
  items,
  title,
  className = '',
  storageKey = 'ds-checklist',
  showHint = true,
}: ActionChecklistProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (typeof window === 'undefined') return
    try {
      const raw = window.localStorage.getItem(storageKey)
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, boolean>
        setChecked(parsed)
      }
    } catch {
      // ignore corrupt storage
    }
  }, [storageKey])

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] }
      if (typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(storageKey, JSON.stringify(next))
        } catch {
          // ignore
        }
      }
      return next
    })
  }

  const allDone = items.every((item) => checked[item.id])
  const someDone = items.some((item) => checked[item.id])

  if (!mounted) {
    return (
      <div className={`checklist ${className}`} aria-label={title || 'Checklist'}>
        {items.map((item) => (
          <div key={item.id} className="checklist__item">
            <span className="checklist__box" aria-hidden="true" />
            <span className="checklist__text">{item.text}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={`checklist-block ${className}`}>
      {title && (
        <p style={{
          fontSize: '0.78rem',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: 'var(--accent-green)',
          fontWeight: 600,
          fontFamily: 'var(--sans)',
          marginBottom: '8px',
          textAlign: 'left'
        }}>
          {title}
        </p>
      )}
      <ul className="checklist" role="list" aria-label={title || 'Checklist'}>
        {items.map((item) => (
          <li
            key={item.id}
            className={`checklist__item ${checked[item.id] ? 'checked' : ''}`}
            onClick={() => toggle(item.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                toggle(item.id)
              }
            }}
            tabIndex={0}
            role="checkbox"
            aria-checked={checked[item.id]}
          >
            <span className="checklist__box" aria-hidden="true" />
            <span className="checklist__text">
              {item.text}
              {item.hint && showHint && <br />}
              {item.hint && showHint && (
                <span className="checklist__text--hint">{item.hint}</span>
              )}
            </span>
          </li>
        ))}
      </ul>
      {items.length > 0 && (
        <div
          className={`checklist__progress ${allDone ? 'checklist__progress--done' : ''}`}
          aria-live="polite"
          style={{
            fontSize: '0.78rem',
            color: 'var(--ink-soft)',
            fontFamily: 'var(--sans)',
            marginTop: '10px',
            padding: '6px 0 2px',
            borderTop: '1px dotted var(--rule-mute)'
          }}
        >
          {someDone
            ? `প্রোগ্রেস: ${items.filter(i => checked[i.id]).length}/${items.length} শেষ`
            : 'এখনো কিছু চেক করা হয়নি'}
          {allDone && (
            <span style={{ color: 'var(--accent-green)', marginLeft: '8px' }}>
              — সব শেষ!
            </span>
          )}
        </div>
      )}
    </div>
  )
}
