'use client'

import { useState, useEffect, useCallback } from 'react'
import type { JourneyNode, JourneyStatus } from './JourneyMap.types'

interface JourneyMapProps {
  nodes: JourneyNode[]
  currentId?: string
  className?: string
  showConnectors?: boolean
  orientation?: 'horizontal' | 'vertical'
  onStatusChange?: (id: string, status: 'not-started' | 'in-progress' | 'complete') => void
}

const STORAGE_KEY = 'ds-journey-progress'

function useStoredStatus(
  nodes: JourneyNode[],
  onStatusChange?: (id: string, status: 'not-started' | 'in-progress' | 'complete') => void
) {
  const [statusMap, setStatusMap] = useState<Record<string, 'not-started' | 'in-progress' | 'complete'>>({})

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, string>
        const mapped: Record<string, 'not-started' | 'in-progress' | 'complete'> = {}
        for (const [id, s] of Object.entries(parsed)) {
          if (['not-started', 'in-progress', 'complete'].includes(s)) {
            mapped[id] = s as 'not-started' | 'in-progress' | 'complete'
          }
        }
        setStatusMap(mapped)
      }
    } catch {
      // ignore
    }
  }, [])

  const setStatus = useCallback((id: string, status: 'not-started' | 'in-progress' | 'complete') => {
    setStatusMap((prev) => {
      const next = { ...prev, [id]: status }
      if (typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        } catch {
          // ignore
        }
      }
      return next
    })
    onStatusChange?.(id, status)
  }, [onStatusChange])

  return { statusMap, setStatus }
}

export function JourneyMap({
  nodes,
  currentId,
  className = '',
  showConnectors = true,
  orientation = 'vertical',
  onStatusChange,
}: JourneyMapProps) {
  const { statusMap, setStatus } = useStoredStatus(nodes, onStatusChange)

  const cycleStatus = useCallback(
    (node: JourneyNode) => {
      const current = statusMap[node.id] ?? 'not-started'
      const next: Record<string, 'not-started' | 'in-progress' | 'complete'> = {
        'not-started': 'in-progress',
        'in-progress': 'complete',
        'complete': 'not-started',
      }
      setStatus(node.id, next[current])
    },
    [statusMap, setStatus]
  )

  const getStatus = useCallback(
    (node: JourneyNode) => {
      if (node.status) return node.status
      if (node.id === currentId) return 'in-progress'
      return statusMap[node.id] ?? 'not-started'
    },
    [currentId, statusMap]
  )

  const visitedCount = nodes.filter((n) => statusMap[n.id] === 'complete').length
  const total = nodes.length

  return (
    <div className={`journey-map journey-map--${orientation} ${className}`}>
      <div
        className="journey-map__header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: '12px',
          marginBottom: '14px',
          flexWrap: 'wrap'
        }}
      >
        <span
          style={{
            fontSize: '0.72rem',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'var(--accent-green)',
            fontWeight: 600,
            fontFamily: 'var(--sans)'
          }}
        >
          পথ / Journey
        </span>
        {total > 0 && (
          <span
            className="journey-map__progress"
            style={{
              fontSize: '0.78rem',
              color: 'var(--ink-soft)',
              fontFamily: 'var(--sans)'
            }}
          >
            {visitedCount}/{total} ধাপ শেষ
            {visitedCount === total && (
              <span style={{ color: 'var(--accent-green)', marginLeft: '6px' }}>
                — সব শেষ!
              </span>
            )}
          </span>
        )}
      </div>

      <ol
        className="journey-map__list"
        role="list"
        aria-label="Journey steps"
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          display: 'flex',
          flexDirection: orientation === 'horizontal' ? 'row' : 'column',
          gap: orientation === 'horizontal' ? '12px' : '0',
          flexWrap: orientation === 'horizontal' ? 'wrap' : 'nowrap'
        }}
      >
        {nodes.map((node, idx) => {
          const status = getStatus(node)
          const isCurrent = node.id === currentId
          const isLater = status === 'not-started' && !isCurrent
          const isCurrentUnstarted = isCurrent && !statusMap[node.id]

          return (
            <li
              key={node.id}
              className={`journey-map__node journey-map__node--${orientation} journey-map__node--${status} ${
                showConnectors && idx < nodes.length - 1 ? 'has-connector' : ''
              }`}
              style={{
                position: 'relative',
                paddingLeft: orientation === 'vertical' ? '28px' : '0',
                paddingBottom: orientation === 'vertical' ? '16px' : '0',
                paddingRight: orientation === 'horizontal' ? '0' : '0',
                borderLeft: orientation === 'vertical' ? '2px solid var(--rule-mute)' : 'none',
              }}
            >
              {showConnectors && idx < nodes.length - 1 && (
                <span
                  className="journey-map__connector"
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    left: orientation === 'vertical' ? '3px' : '50%',
                    top: orientation === 'vertical' ? '14px' : '50%',
                    bottom: orientation === 'vertical' ? '0' : 'auto',
                    height: orientation === 'vertical' ? '100%' : '0',
                    width: orientation === 'vertical' ? '0' : '2px',
                    background: status === 'complete'
                      ? 'var(--accent-green)'
                      : 'var(--rule-mute)',
                    transform: orientation === 'horizontal' ? 'translateY(-50%)' : 'none',
                    transition: 'background 200ms ease'
                  }}
                />
              )}

              <button
                type="button"
                className="journey-map__step-button"
                onClick={() => cycleStatus(node)}
                aria-pressed={status !== 'not-started'}
                aria-label={`${node.title}: ${status === 'complete' ? 'complete' : status === 'in-progress' ? 'in progress' : 'not started'}. Click to mark ${status === 'complete' ? 'not started' : status === 'in-progress' ? 'complete' : 'in progress'}.`}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  background: 'var(--page)',
                  border: '1px solid var(--rule)',
                  borderRadius: '6px',
                  padding: '10px 12px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  color: 'var(--ink)',
                  width: '100%',
                  transition: 'border-color 120ms ease, box-shadow 120ms ease, background 120ms ease',
                  ...(status === 'complete' ? {
                    borderColor: 'var(--accent-green)',
                    background: 'rgba(47,107,58,0.04)',
                    boxShadow: '0 0 0 1px var(--accent-green) inset'
                  } : {}),
                  ...(status === 'in-progress' ? {
                    borderLeft: '3px solid var(--accent-blue)',
                    background: 'rgba(28,95,178,0.03)',
                  } : {}),
                  ...(isCurrentUnstarted ? {
                    borderLeft: '3px solid var(--accent-green)',
                  } : {})
                }}
              >
                <span
                  className="journey-map__dot"
                  aria-hidden="true"
                  style={{
                    flexShrink: 0,
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background:
                      status === 'complete'
                        ? 'var(--accent-green)'
                        : status === 'in-progress'
                        ? 'var(--accent-blue)'
                        : 'var(--ink-soft)',
                    border: status === 'not-started' ? '1px solid var(--rule)' : 'none',
                    marginTop: '4px',
                    transition: 'background 150ms ease, border 150ms ease'
                  }}
                />

                <span style={{ flex: '1 1 auto', minWidth: 0 }}>
                  <span
                    className="journey-map__step-title"
                    style={{
                      display: 'block',
                      fontWeight: status === 'complete' ? 500 : 600,
                      fontSize: '0.88rem',
                      color: status === 'complete' ? 'var(--accent-green)' : 'var(--ink)',
                      lineHeight: 1.35,
                      wordBreak: 'break-word'
                    }}
                  >
                    {node.title}
                  </span>
                  {node.description && (
                    <span
                      className="journey-map__step-desc"
                      style={{
                        display: 'block',
                        fontSize: '0.78rem',
                        color: 'var(--ink-soft)',
                        lineHeight: 1.45,
                        marginTop: '2px'
                      }}
                    >
                      {node.description}
                    </span>
                  )}
                </span>

                <span
                  className="journey-map__status-controls"
                  style={{
                    flexShrink: 0,
                    display: 'flex',
                    gap: '4px',
                    opacity: status === 'not-started' ? 0.5 : 1
                  }}
                  aria-hidden="true"
                >
                  {status === 'not-started' && (
                    <span style={{ fontSize: '0.7rem', color: 'var(--ink-soft)', fontFamily: 'var(--sans)' }}>
                      আঘাত
                    </span>
                  )}
                  {status === 'in-progress' && (
                    <span style={{ fontSize: '0.7rem', color: 'var(--accent-blue)', fontFamily: 'var(--sans)' }}>
                      চলছে
                    </span>
                  )}
                  {status === 'complete' && (
                    <span style={{ fontSize: '0.7rem', color: 'var(--accent-green)', fontFamily: 'var(--sans)' }}>
                      শেষ
                    </span>
                  )}
                </span>
              </button>

              {node.children && node.children.length > 0 && (
                <div
                  className="journey-map__children"
                  style={{
                    paddingLeft: '20px',
                    marginTop: '8px',
                    marginBottom: '8px'
                  }}
                  role="group"
                  aria-label={`${node.title} এর ধাপ`}
                >
                  {node.children.map((child) => {
                    const childStatus = statusMap[child.id] ?? 'not-started'
                    return (
                      <div
                        key={child.id}
                        className="journey-map__child"
                        style={{
                          paddingLeft: '12px',
                          borderLeft: '1px dashed var(--rule-mute)',
                          paddingTop: '4px',
                          paddingBottom: '4px',
                          paddingRight: '8px'
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => cycleStatus(child)}
                          aria-pressed={childStatus !== 'not-started'}
                          style={{
                            display: 'inline-block',
                            background: 'transparent',
                            border: '1px solid var(--rule-mute)',
                            borderRadius: '3px',
                            padding: '2px 8px',
                            fontSize: '0.76rem',
                            color: childStatus === 'complete' ? 'var(--accent-green)' : 'var(--ink-soft)',
                            cursor: 'pointer',
                            fontFamily: 'var(--sans)',
                            transition: 'all 150ms ease',
                            textDecoration: 'none'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--accent-green)'
                            e.currentTarget.style.color = 'var(--ink)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'var(--rule-mute)'
                            e.currentTarget.style.color = childStatus === 'complete' ? 'var(--accent-green)' : 'var(--ink-soft)'
                          }}
                        >
                          {child.title}
                          {childStatus === 'complete' && ' ✓'}
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}

              {node.note && (
                <div
                  className="journey-map__note"
                  style={{
                    marginTop: '6px',
                    fontSize: '0.76rem',
                    color: 'var(--ink-soft)',
                    fontFamily: 'var(--sans)',
                    lineHeight: 1.45,
                    paddingLeft: '12px',
                    borderLeft: '2px solid var(--warn-line)',
                    background: 'rgba(190,150,40,0.04)',
                    padding: '4px 8px',
                    borderRadius: '0 3px 3px 0'
                  }}
                >
                  {node.note}
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
