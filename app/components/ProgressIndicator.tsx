'use client'

import {
  useState,
  useEffect,
  useCallback,
  useId,
  useRef,
  type MouseEvent,
  type KeyboardEvent,
  type FormEvent,
} from 'react'

interface Step {
  id: string
  label: string
  description?: string
  status?: 'not-started' | 'in-progress' | 'complete'
  href?: string
}

interface ProgressIndicatorProps {
  steps: Step[]
  currentId?: string
  variant?: 'numbered' | 'pill'
  showLabels?: boolean
  className?: string
}

export function ProgressIndicator({
  steps,
  currentId,
  variant = 'numbered',
  showLabels = false,
  className = '',
}: ProgressIndicatorProps) {
  const prefix = useId()
  const listRef = useRef<HTMLUListElement>(null)

  const currentIndex = steps.findIndex((step) => step.id === currentId)

  return (
    <nav
      className={`progress-indicator progress-indicator--${variant} ${className}`}
      aria-label="Progress"
      ref={listRef}
    >
      <ol
        className="progress-indicator__list"
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          display: 'flex',
          gap: variant === 'pill' ? '6px' : '0',
          ...(variant === 'numbered' && {
            flexWrap: 'wrap',
          }),
        }}
      >
        {steps.map((step, index) => {
          const status = step.status ?? (step.id === currentId ? 'in-progress' : 'not-started')
          const isCurrent = step.id === currentId
          const isBefore = index < currentIndex
          const isLater = !isCurrent && !isBefore

          return (
            <li key={step.id} className="progress-indicator__item">
              {variant === 'pill' ? (
                <span
                  className={`progress-indicator__pill progress-indicator__pill--${status} ${
                    isCurrent ? 'js-current' : ''
                  }`}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {step.label}
                </span>
              ) : (
                <span
                  className={`progress-indicator__num progress-indicator__num--${status} ${
                    isCurrent ? 'js-current' : ''
                  }`}
                  aria-current={isCurrent ? 'step' : undefined}
                  aria-label={`Step ${index + 1}: ${step.label}${step.description ? ` — ${step.description}` : ''}`}
                >
                  {index + 1}
                </span>
              )}

              {showLabels && (
                <span
                  className={`progress-indicator__label ${
                    isLater ? 'progress-indicator__label--muted' : ''
                  }`}
                >
                  {step.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export interface ProgressStep {
  id: string
  label: string
}

interface StepperProps {
  steps: ProgressStep[]
  currentIdx: number
  onStepChange?: (idx: number) => void
  className?: string
}

export function Stepper({ steps, currentIdx, onStepChange, className = '' }: StepperProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <ol className={`stepper stepper--loading ${className}`} aria-label="Steps">
        {steps.map((step, index) => (
          <li
            key={step.id}
            className={`stepper__step ${index <= currentIdx ? 'done' : ''} ${
              index === currentIdx ? 'current' : ''
            }`}
          >
            <span className="stepper__num">{index + 1}</span>
            <span className="stepper__label">{step.label}</span>
          </li>
        ))}
      </ol>
    )
  }

  return (
    <ol
      className={`stepper ${className}`}
      aria-label="Progress steps"
      style={{
        listStyle: 'none',
        margin: 0,
        padding: 0,
        display: 'flex',
        gap: '0',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
      }}
    >
      {steps.map((step, index) => {
        const done = index < currentIdx
        const current = index === currentIdx
        const pending = index > currentIdx

        return (
          <li
            key={step.id}
            className={`stepper__step ${done ? 'stepper__step--done' : ''} ${
              current ? 'stepper__step--current' : ''
            } ${pending ? 'stepper__step--pending' : ''}`}
            onClick={() => onStepChange?.(index)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onStepChange?.(index)
              }
            }}
            tabIndex={current ? 0 : -1}
            role={current ? 'status' : undefined}
            aria-current={current ? 'step' : undefined}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: current ? '6px 10px' : '5px 8px',
              cursor: current || pending ? 'pointer' : 'default',
              borderRadius: '6px',
              transition: 'background 120ms ease, color 120ms ease',
              ...(done && {
                background: 'rgba(47,107,58,0.05)',
              }),
              ...(current && {
                background: 'rgba(28,95,178,0.06)',
                border: '1px solid var(--accent-blue)',
              }),
            }}
          >
            <span
              className="stepper__num"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                fontSize: '0.72rem',
                fontWeight: 600,
                background:
                  done
                    ? 'var(--accent-green)'
                    : current
                    ? 'var(--accent-blue)'
                    : 'transparent',
                color:
                  done
                    ? '#ffffff'
                    : current
                    ? '#ffffff'
                    : 'var(--ink-soft)',
                border:
                  !done && !current
                    ? '1px solid var(--rule)'
                    : 'none',
                transition: 'all 150ms ease',
              }}
            >
              {done ? (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  aria-hidden="true"
                  style={{ overflow: 'visible' }}
                >
                  <path
                    d="M2 6L5 9L10 3"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                index + 1
              )}
            </span>
            <span
              className="stepper__label"
              style={{
                fontSize: '0.82rem',
                color:
                  done
                    ? 'var(--accent-green)'
                    : current
                    ? 'var(--ink)'
                    : 'var(--ink-soft)',
                fontWeight: current ? 500 : 400,
                lineHeight: 1.3,
                wordBreak: 'break-word',
              }}
            >
              {step.label}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

interface ProgressCircleProps {
  current: number
  total: number
  label?: string
  size?: number
  showLabel?: boolean
  className?: string
}

export function ProgressCircle({
  current,
  total,
  label,
  size = 64,
  showLabel = true,
  className = '',
}: ProgressCircleProps) {
  const [mounted, setMounted] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const circleRef = useRef<SVGCircleElement>(null)
  const id = useId()

  useEffect(() => {
    setMounted(true)
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const progress = total > 0 ? current / total : 0
  const circumference = Math.PI * size
  const offset = circumference * (1 - progress)
  const dash = prefersReducedMotion ? offset : undefined

  if (!mounted) {
    return (
      <div className={`progress-circle ${className}`} style={{ position: 'relative', display: 'inline-block' }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 4}
            fill="none"
            stroke="var(--rule)"
            strokeWidth="3"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 4}
            fill="none"
            stroke="var(--accent-green)"
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <span
          className="progress-circle__pct"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--ink)',
            fontFamily: 'var(--sans)',
          }}
        >
          {current}/{total}
        </span>
        {label && <span className="progress-circle__label">{label}</span>}
      </div>
    )
  }

  return (
    <div
      className={`progress-circle ${className}`}
      style={{ position: 'relative', display: 'inline-block' }}
      role="meter"
      aria-valuenow={current}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-label={label || `${current} of ${total} steps complete`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{
          transform: 'rotate(-90deg)',
          transition: prefersReducedMotion ? 'none' : 'stroke-dashoffset 600ms ease',
        }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 4}
          fill="none"
          stroke="var(--rule)"
          strokeWidth="3"
        />
        <circle
          ref={circleRef}
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 4}
          fill="none"
          stroke="var(--accent-green)"
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={dash ?? offset}
          strokeLinecap="round"
        />
      </svg>
      <span
        className="progress-circle__pct"
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.85rem',
          fontWeight: 600,
          color: 'var(--ink)',
          fontFamily: 'var(--sans)',
        }}
      >
        {current}/{total}
      </span>
      {showLabel && label && (
        <span className="progress-circle__label" style={{ display: 'block', marginTop: '4px', fontSize: '0.72rem', color: 'var(--ink-soft)', fontFamily: 'var(--sans)' }}>
          {label}
        </span>
      )}
    </div>
  )
}

export interface ProgressBarProps {
  current: number
  total: number
  label?: string
  showCount?: boolean
  height?: number
  className?: string
}

export function ProgressBar({
  current,
  total,
  label,
  showCount = true,
  height = 6,
  className = '',
}: ProgressBarProps) {
  const [mounted, setMounted] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const progress = total > 0 ? current / total : 0
  const filledWidth = mounted ? `${progress * 100}%` : '0%'

  return (
    <div className={`progress-bar ${className}`} style={{ width: '100%' }}>
      {label && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: '6px',
            gap: '8px',
          }}
        >
          <span style={{ fontSize: '0.78rem', color: 'var(--ink-soft)', fontFamily: 'var(--sans)' }}>
            {label}
          </span>
          {showCount && (
            <span style={{ fontSize: '0.74rem', color: 'var(--ink-soft)', fontFamily: 'var(--sans)' }}>
              {current}/{total}
            </span>
          )}
        </div>
      )}
      <div
        ref={barRef}
        className="progress-bar__track"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={label || 'Progress'}
        style={{
          width: '100%',
          height: `${height}px`,
          background: 'var(--rule-soft)',
          borderRadius: '999px',
          overflow: 'hidden',
        }}
      >
        <div
          className="progress-bar__fill"
          style={{
            width: filledWidth,
            height: '100%',
            background: 'var(--accent-green)',
            borderRadius: '999px',
            transition: prefersReducedMotion ? 'none' : 'width 600ms ease',
            willChange: 'width',
          }}
        />
      </div>
    </div>
  )
}

interface CheckStepProps {
  id: string
  label: string
  status?: 'not-started' | 'in-progress' | 'complete'
  description?: string
  href?: string
  children?: React.ReactNode
}

interface CheckStepsProps {
  steps: CheckStepProps[]
  currentId?: string
  variant?: 'stack' | 'row'
  className?: string
}

export function CheckSteps({ steps, currentId, variant = 'stack', className = '' }: CheckStepsProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className={`check-steps ${className}`}>
        {steps.map((step) => (
          <div key={step.id} className="check-steps__item">
            <span
              className={`check-steps__marker ${
                step.status === 'complete'
                  ? 'done'
                  : step.status === 'in-progress'
                  ? 'doing'
                  : ''
              }`}
            >
              {step.status === 'complete' ? '✓' : step.status === 'in-progress' ? '●' : '○'}
            </span>
            <span className="check-steps__label">{step.label}</span>
          </div>
        ))}
      </div>
    )
  }

  const currentIndex = steps.findIndex((s) => s.id === currentId)

  return (
    <div
      className={`check-steps check-steps--${variant} ${className}`}
      role="list"
      aria-label="Checklist steps"
    >
      {steps.map((step, index) => {
        const status = step.status ?? (step.id === currentId ? 'in-progress' : 'not-started')
        const isDone = status === 'complete'
        const isCurrent = status === 'in-progress'
        const isLater = !isDone && !isCurrent

        return (
          <div
            key={step.id}
            className={`check-steps__item ${
              variant === 'row' ? 'check-steps__item--row' : ''
            }`}
          >
            {variant === 'row' ? (
              <span
                className={`check-steps__connector ${
                  isDone ? 'check-steps__connector--done' : ''
                } ${isCurrent ? 'check-steps__connector--current' : ''}`}
                aria-hidden="true"
              />
            ) : (
              <span
                className={`check-steps__marker ${
                  isDone ? 'check-steps__marker--done' : isCurrent ? 'check-steps__marker--doing' : ''
                }`}
                aria-hidden="true"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  background: isDone ? 'var(--accent-green)' : isCurrent ? 'var(--accent-blue)' : 'var(--rule-soft)',
                  color: isDone || isCurrent ? '#ffffff' : 'var(--ink-soft)',
                  border: !isDone && !isCurrent ? '1px solid var(--rule)' : 'none',
                  flexShrink: 0,
                }}
              >
                {isDone ? (
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
                    <path d="M2.5 5.5L4.5 7.5L8.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : isCurrent ? (
                  <span style={{ fontSize: '0.55rem' }}>●</span>
                ) : (
                  index + 1
                )}
              </span>
            )}

            <div className="check-steps__body">
              {step.href ? (
                <a
                  href={step.href}
                  className={`check-steps__label ${
                    isDone ? 'check-steps__label--done' : ''
                  } ${isCurrent ? 'check-steps__label--current' : ''}`}
                  style={{
                    color: isDone ? 'var(--accent-green)' : 'var(--link)',
                    textDecoration: 'none',
                    display: 'inline-block',
                  }}
                >
                  {step.label}
                </a>
              ) : (
                <span
                  className={`check-steps__label ${
                    isDone ? 'check-steps__label--done' : ''
                  } ${isCurrent ? 'check-steps__label--current' : ''}`}
                >
                  {step.label}
                </span>
              )}
              {step.description && (
                <span className="check-steps__desc">{step.description}</span>
              )}
              {step.children}
            </div>
          </div>
        )
      })}
    </div>
  )
}
